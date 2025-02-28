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

      const { error: subscriptionUpdateError } = await supabaseAdmin
        .from("profiles")
        .update({
          stripe_is_subscribed: true,
          stripe_interval: event.data.object.items.data[0].plan.interval,
          stripe_subscribed_product_id: event.data.object.plan.product,
        })
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
