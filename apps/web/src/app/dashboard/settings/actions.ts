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

    const { url } = await stripe.billingPortal.sessions.create({
      customer: userData?.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
    });

    if (error) {
      console.error("Error fetching user data:", error);
      redirect("/dashboard/settings?error=user_data_fetch_error");
    }

    if (url) {
      return { url };
    }

    // For now, redirect back to the settings page
    console.log("Stripe portal link creation not implemented yet");
    redirect("/dashboard/settings?error=not_implemented");
  } catch (error) {
    console.error("Error creating Stripe portal session:", error);
    redirect("/dashboard/settings?error=stripe_portal_error");
  }
}
