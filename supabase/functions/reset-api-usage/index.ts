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

serve(async (req) => {
  try {
    const reqJson = await req.json();
    if (reqJson.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
      return new Response(
        JSON.stringify({ message: "Not authorized" }),
        { headers: { "Content-Type": "application/json" } },
      );
    }

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
      throw new Error(`Error selecting users: ${selectError.message}`);
    }

    console.log(`Found ${usersToReset?.length || 0} users to reset`);

    // If there are no users to reset, return a message
    if (!usersToReset || usersToReset.length === 0) {
      return new Response(
        JSON.stringify({ message: "No users to reset", count: 0 }),
        { headers: { "Content-Type": "application/json" } },
      );
    }

    const now = new Date().toISOString();
    const userIds = usersToReset.map((user: User) => user.id);

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ last_usage_reset_at: now })
      .in("id", userIds);

    if (updateError) {
      throw new Error(`Error updating users: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({
        message: "API usage reset successful",
        count: usersToReset.length,
        users: usersToReset.map((u: User) => ({ id: u.id, email: u.email })),
      }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error in reset-api-usage function:", error);

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/reset-api-usage' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
