import { Request, Response } from "express";
import { z } from "zod";
import { client } from "../utils/posthog";
import { logApiUsageAsync } from "../utils/async-logger";
import { supabase } from "../utils/supabase";

const requestSchema = z.object({
  pagination: z
    .object({
      limit: z.number().positive().default(10),
      offset: z.number().nonnegative().default(0),
    })
    .default({ limit: 10, offset: 0 }),
  order_dir: z.enum(["asc", "desc"]).default("desc"),
});

export const userFiles = async (req: Request, res: Response) => {
  console.log("[USER-FILES] Request received", { body: req.body });
  try {
    const validation = requestSchema.safeParse(req.body);
    if (!validation.success) {
      console.log("[USER-FILES] Validation failed", validation.error.errors);
      return res.status(400).json({
        success: false,
        error: "Invalid request parameters",
        details: validation.error.errors,
      });
    }

    const { pagination, order_dir } = validation.data;
    console.log("[USER-FILES] Validated request data", {
      pagination,
      order_dir,
    });

    // Get team ID from API key
    const apiKey = req.headers.authorization as string;
    console.log("[USER-FILES] Verifying API key");
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from("api_keys")
      .select("team_id, user_id, profiles(email)")
      .match({ api_key: apiKey })
      .single();

    if (apiKeyError || !apiKeyData?.team_id) {
      console.log("[USER-FILES] Invalid API key", { error: apiKeyError });
      return res.status(401).json({
        success: false,
        error: "Invalid API key",
      });
    }

    const teamId = apiKeyData.team_id;
    console.log("[USER-FILES] Team ID retrieved", { teamId });

    // Fetch files with pagination
    console.log("[USER-FILES] Fetching files with pagination");
    const { data: files, error: filesError } = await supabase
      .from("files")
      .select("type, file_id, created_at, file_name, team_id")
      .match({ team_id: teamId })
      .is("deleted_at", null)
      .range(pagination.offset, pagination.offset + pagination.limit - 1)
      .order("created_at", { ascending: order_dir === "asc" });

    if (filesError) {
      console.log("[USER-FILES] Error fetching files", { error: filesError });
      throw new Error(`Failed to fetch files: ${filesError.message}`);
    }
    console.log("[USER-FILES] Files fetched successfully", {
      count: files?.length,
    });

    // Get total count for pagination
    console.log("[USER-FILES] Getting total count");
    const { count, error: countError } = await supabase
      .from("files")
      .select("id", {
        count: "exact",
        head: true,
      })
      .match({ team_id: teamId });

    if (countError) {
      console.log("[USER-FILES] Error getting count", { error: countError });
      throw new Error(`Failed to get total count: ${countError.message}`);
    }
    console.log("[USER-FILES] Total count retrieved", { count });

    client.capture({
      distinctId: apiKeyData.profiles?.email as string,
      event: "/user_files API Call",
    });
    console.log("[USER-FILES] PostHog event captured");

    logApiUsageAsync({
      endpoint: "/upload_files",
      userId: apiKeyData.user_id || "",
      success: true,
    });
    console.log("[USER-FILES] API usage logged");

    console.log("[USER-FILES] Sending successful response");
    return res.json({
      success: true,
      results: files,
      pagination: {
        ...pagination,
      },
      count,
    });
  } catch (error) {
    console.error("[USER-FILES] Error fetching user files:", error);

    if (req.headers.authorization) {
      const apiKey = req.headers.authorization as string;
      console.log("[USER-FILES] Attempting to log error with user ID");
      const { data: apiKeyData } = await supabase
        .from("api_keys")
        .select("user_id")
        .match({ api_key: apiKey })
        .single();

      if (apiKeyData?.user_id) {
        logApiUsageAsync({
          endpoint: "/upload_files",
          userId: apiKeyData.user_id,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
        console.log("[USER-FILES] Error logged for user", {
          userId: apiKeyData.user_id,
        });
      }
    }

    console.log("[USER-FILES] Sending error response");
    return res.status(500).json({
      success: false,
      error: `Failed to fetch files${
        error instanceof Error ? `: ${error.message}` : ""
      }`,
    });
  }
};
