import axios from "redaxios";
import { loadStripe } from "@stripe/stripe-js";

export const subscribe = async (priceId: string) => {
  try {
    // @ts-expect-error - Stripe is not typed
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/protected/subscription/${priceId}`,
      {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!data || !data.id) {
      throw new Error("Invalid response from subscription API");
    }

    await stripe?.redirectToCheckout({ sessionId: data.id });
  } catch (err) {
    throw new Error((err as Error).message);
  }
};
