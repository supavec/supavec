import { supabaseAdmin } from "@/utils/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import axios from "redaxios";
import initStripe from "stripe";

// @ts-expect-error - Stripe is not typed
const stripe = initStripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const routeSecret = searchParams.get("API_ROUTE_SECRET");
  if (routeSecret !== process.env.API_ROUTE_SECRET) {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  const reqJson = await req.json();

  const [stripeResponse, loopsResponse] = await Promise.allSettled([
    // Stripe
    stripe.customers.create({
      email: reqJson.record.email,
    }),

    // Loops
    axios.post(
      "https://app.loops.so/api/v1/events/send",
      {
        email: reqJson.record.email,
        userId: reqJson.record.id,
        firstName: reqJson.record.name?.split(" ")[0] ?? null,
        lastName: reqJson.record.name?.split(" ")[1] ?? null,
        isFileUploaded: false,
        eventName: "new-signup",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
        },
      },
    ),
  ]);

  let hasFailed = false;
  if (stripeResponse.status === "rejected") {
    hasFailed = true;
    console.error(`Stripe error: ${stripeResponse.reason}`);
  } else {
    await supabaseAdmin
      .from("profiles")
      .update({
        stripe_customer_id: stripeResponse.value.id,
      })
      .match({
        id: reqJson.record.id,
      });
  }

  if (loopsResponse.status === "rejected") {
    hasFailed = true;
    console.error(`Loops error: ${loopsResponse.reason}`);
  }

  if (!hasFailed) console.log("success");

  return NextResponse.json({ status: "done" });
}
