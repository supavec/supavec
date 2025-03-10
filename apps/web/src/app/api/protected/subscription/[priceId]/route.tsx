import initStripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/utils/supabase/admin";

// @ts-expect-error - Stripe is not typed
const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

export async function POST(
  req: Request,
  { params }: { params: Promise<{ priceId: string }> }
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user == null)
      return NextResponse.json(
        { status: "error", result: "Bad Request" },
        { status: 400 }
      );

    const { data, error } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .match({ id: user.id })
      .single();

    if (error) {
      console.error(error.message);
      return NextResponse.json(
        { result: "error", message: "Failed to fetch user profile" },
        { status: 500 }
      );
    }

    const priceId = (await params).priceId;
    const lineItems = [
      {
        price: priceId,
        quantity: 1,
      },
    ];

    let stripeCustomerId = data.stripe_customer_id ?? null;

    if (!stripeCustomerId) {
      // search if Stripe already has this customer on their end
      const customers = await stripe.customers.search({
        query: `email:'${user.email}'`,
      });

      if (customers.data.length === 0) {
        console.log(
          `This user ${user.id} doesn't exist on Stripe. Thus creating...`
        );
        const res = await stripe.customers.create({
          email: user.email,
        });

        stripeCustomerId = res.id;
      } else {
        console.log(
          `It seems this user ${user.id} exists on Stripe but the customer ID isn't exist on our Supabase DB. Thus it's going to use the existing Stripe customer ID instead of creating a new one.`
        );
        stripeCustomerId = customers.data[0].id;
      }

      console.log(`Save Stripe customer ID of this user ${user.id}`);
      const { error: saveStripeCustomerIdError } = await supabaseAdmin
        .from("profiles")
        .update({
          stripe_customer_id: stripeCustomerId,
        })
        .match({
          id: user.id,
        });

      if (saveStripeCustomerIdError) {
        console.error(
          `saveStirpeCustomerIdError: ${saveStripeCustomerIdError.message}`
        );

        return NextResponse.json(
          {
            result: "error",
            message: "Failed to save Stripe customer ID",
          },
          { status: 500 }
        );
      }
    }

    console.log(`Creating Stripe checkout session for user ${user.id}`);
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ result: "success", id: session.id });
  } catch (err) {
    return NextResponse.json(
      { result: "error", message: (err as Error)?.message ?? "" },
      { status: 500 }
    );
  }
}
