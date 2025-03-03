import process from "node:process";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

type User = {
  id: string;
  email: string;
  last_usage_reset_at: string;
};

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

addEventListener("beforeunload", () => {
  console.log("Reset API usage function will be shutdown");
});

/**
 * Resets API usage for users whose last reset was more than a month ago
 */
async function resetApiUsage() {
  console.log("Starting API usage reset background process");

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  console.log(
    `Finding users with last_usage_reset_date before ${oneMonthAgo.toISOString()}`,
  );

  // Search for users to reset
  // Find users whose last_usage_reset_date is more than 1 month ago
  const { data: usersToReset, error: selectError } = await supabaseAdmin
    .from("profiles")
    .select("id, email, last_usage_reset_at")
    .lt("last_usage_reset_at", oneMonthAgo.toISOString());

  if (selectError) {
    console.error(`Error selecting users: ${selectError.message}`);
    throw new Error(`Error selecting users: ${selectError.message}`);
  }

  console.log(`Found ${usersToReset?.length || 0} users to reset`);

  // If there are no users to reset, return a message
  if (!usersToReset || usersToReset.length === 0) {
    console.log("No users need API usage reset at this time");
    return {
      success: true,
      message: "No users to reset",
      count: 0,
    };
  }

  console.log(`Processing reset for ${usersToReset.length} users`);

  const now = new Date().toISOString();
  const userIds = usersToReset.map((user: User) => user.id);

  const { error: updateError } = await supabaseAdmin
    .from("profiles")
    .update({ last_usage_reset_at: now })
    .in("id", userIds);

  if (updateError) {
    console.error(`Error updating users: ${updateError.message}`);
    throw new Error(`Error updating users: ${updateError.message}`);
  }

  console.log(`Successfully reset API usage for ${usersToReset.length} users`);

  return {
    success: true,
    message: "API usage reset successful",
    count: usersToReset.length,
    users: usersToReset.map((u: User) => ({ id: u.id, email: u.email })),
  };
}

serve(async (req) => {
  try {
    console.log("Received request to reset API usage");

    const reqJson = await req.json();
    if (reqJson.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
      console.warn("Unauthorized access attempt to reset API usage");
      return new Response(
        JSON.stringify({ message: "Not authorized" }),
        { headers: { "Content-Type": "application/json" } },
      );
    }

    console.log("Starting background process for API usage reset");

    // Use EdgeRuntime.waitUntil to run the reset in the background
    // @ts-expect-error EdgeRuntime is available in Deno
    EdgeRuntime.waitUntil(resetApiUsage());

    console.log("Background process initiated successfully");

    return new Response(
      JSON.stringify({
        success: true,
        message: "API usage reset process started in the background",
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 202,
      },
    );
  } catch (error) {
    console.error("Error in reset-api-usage function:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
});
