"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import initStripe from "stripe";

// @ts-expect-error - Stripe is not typed
const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

export async function createStripePortalLink() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    const { data: userData, error } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .match({ id: user.id })
      .single();

    const session = await stripe.billingPortal.sessions.create({
      customer: userData?.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
    });

    if (error) {
      console.error("Error fetching user data:", error);
      redirect("/dashboard/billing?error=user_data_fetch_error");
    }

    if (session) {
      return { url: session.url };
    }

    // For now, redirect back to the billing page
    console.log("Stripe portal link creation not implemented yet");
    redirect("/dashboard/billing?error=not_implemented");
  } catch (error) {
    console.error("Error creating Stripe portal link:", error);
    redirect("/dashboard/billing?error=stripe_portal_error");
  }
}
