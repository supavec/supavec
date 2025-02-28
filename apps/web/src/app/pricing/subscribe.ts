import axios from "redaxios";
import { loadStripe } from "@stripe/stripe-js";

// @ts-expect-error - Stripe is not typed
const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

export const subscribe = async (priceId: string) => {
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/protected/subscription/${priceId}`,
    );
    await stripe?.redirectToCheckout({ sessionId: data.id });
  } catch (err) {
    throw new Error((err as Error).message);
  }
};
