import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import initStripe from "stripe";
import { supabaseAdmin } from "@/utils/supabase/admin";

export const config = {
  api: { bodyParser: false },
};

// @ts-expect-error - Stripe is not typed
const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const signature = req.headers["stripe-signature"];
  const signatureSecret = process.env.STRIPE_SIGNATURE_SECRET;
  const reqBuffer = await buffer(req);

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      reqBuffer,
      signature,
      signatureSecret,
    );
  } catch (err) {
    console.log(err);

    return res.status(400).send(`Webhook error: ${(err as Error).message}`);
  }

  switch (event.type) {
    case "customer.subscription.updated":
      console.log("event", "customer.subscription.updated");

      // First, check if the user already has last_usage_reset_at set
      const { data: userData, error: userFetchError } = await supabaseAdmin
        .from("profiles")
        .select("last_usage_reset_at")
        .match({ stripe_customer_id: event.data.object.customer })
        .single();

      if (userFetchError) {
        console.error(`Error fetching user data: ${userFetchError.message}`);
      }

      // Only set last_usage_reset_at if it's null or this is a new subscription
      const updateData: {
        stripe_is_subscribed: boolean;
        stripe_interval: string;
        stripe_subscribed_product_id: string;
        last_usage_reset_at?: string;
      } = {
        stripe_is_subscribed: true,
        stripe_interval: event.data.object.items.data[0].plan.interval,
        stripe_subscribed_product_id: event.data.object.plan.product,
      };

      // Add last_usage_reset_at if it's null or this is a new subscription
      if (
        !userData?.last_usage_reset_at
      ) {
        updateData.last_usage_reset_at = new Date().toISOString();
      }

      const { error: subscriptionUpdateError } = await supabaseAdmin
        .from("profiles")
        .update(updateData)
        .match({
          stripe_customer_id: event.data.object.customer,
        });

      if (subscriptionUpdateError) {
        console.error(subscriptionUpdateError.message);
      }

      break;
    case "customer.subscription.deleted":
      console.log("event", "customer.subscription.deleted");

      const { error: subscriptionDeleteError } = await supabaseAdmin
        .from("profiles")
        .update({
          stripe_is_subscribed: false,
          stripe_interval: null,
          stripe_subscribed_product_id: null,
          last_usage_reset_at: null,
        })
        .match({
          stripe_customer_id: event.data.object.customer,
        });

      if (subscriptionDeleteError) {
        console.error(subscriptionDeleteError.message);
      }

      break;
    case "payment_intent.succeeded":
      /**
       * Onetime payment
       */
      console.log("event is payment_intent.succeeded");

      break;
  }

  res.json({ received: true });
};

export default handler;
