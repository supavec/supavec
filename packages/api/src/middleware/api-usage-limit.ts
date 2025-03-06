import { NextFunction, Response } from "express";
import { supabase } from "../utils/supabase";
import { AuthenticatedRequest } from "./auth";
import {
  API_CALL_LIMITS,
  STRIPE_PRODUCT_IDS,
  SUBSCRIPTION_TIER,
} from "../utils/config";
import { getStartDateForApiUsage } from "@supavec/common/usage";

export const apiUsageLimit = () => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const requestPath = req.path;
    const requestMethod = req.method;
    const requestId = req.headers["x-request-id"] || `req_${Date.now()}`;

    console.log(
      `[API-LIMIT][${requestId}] Processing request ${requestMethod} ${requestPath}`,
    );

    try {
      if (!req.apiKey) {
        console.warn(
          `[API-LIMIT][${requestId}] Request rejected: Missing API key`,
        );
        return res.status(401).json({
          success: false,
          error: "API key is required",
        });
      }

      console.log(
        `[API-LIMIT][${requestId}] Validating API key: ${
          req.apiKey.substring(0, 8)
        }...`,
      );

      const { data: apiKeyData, error: apiKeyError } = await supabase
        .from("api_keys")
        .select("id, team_id, user_id")
        .match({ api_key: req.apiKey })
        .single();

      if (apiKeyError || !apiKeyData) {
        console.warn(
          `[API-LIMIT][${requestId}] Invalid API key: ${
            apiKeyError?.message || "No data returned"
          }`,
        );
        return res.status(401).json({
          success: false,
          error: "Invalid API key",
        });
      }

      const userId = apiKeyData.user_id;
      const teamId = apiKeyData.team_id;
      const keyId = apiKeyData.id;

      console.log(
        `[API-LIMIT][${requestId}] API key validated - User: ${userId}, Team: ${
          teamId || "N/A"
        }, Key ID: ${keyId}`,
      );

      if (!userId) {
        console.error(
          `[API-LIMIT][${requestId}] User ID not found for API key ${keyId}`,
        );
        return next();
      }

      console.log(
        `[API-LIMIT][${requestId}] Fetching subscription data for user ${userId}`,
      );

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select(
          "stripe_is_subscribed, stripe_subscribed_product_id, last_usage_reset_at",
        )
        .match({ id: userId })
        .single();

      if (profileError) {
        console.error(
          `[API-LIMIT][${requestId}] Error fetching profile data: ${profileError.message}`,
        );

        return res.status(500).json({
          success: false,
          error: "Could not retrieve user subscription profile.",
        });
      }

      // Determine the subscription tier and corresponding API call limit
      let apiCallLimit = API_CALL_LIMITS.FREE; // Default to Free tier
      let tierName = SUBSCRIPTION_TIER.FREE;

      const hasSubscription = profileData?.stripe_is_subscribed ?? false;
      const productId = profileData?.stripe_subscribed_product_id;

      if (hasSubscription && productId) {
        if (productId === STRIPE_PRODUCT_IDS.BASIC) {
          apiCallLimit = API_CALL_LIMITS.BASIC;
          tierName = SUBSCRIPTION_TIER.BASIC;
        } else if (
          productId === STRIPE_PRODUCT_IDS.ENTERPRISE
        ) {
          apiCallLimit = API_CALL_LIMITS.ENTERPRISE;
          tierName = SUBSCRIPTION_TIER.ENTERPRISE;
        }
      }

      console.log(
        `[API-LIMIT][${requestId}] User subscription tier: ${tierName}, API call limit: ${apiCallLimit}`,
      );

      // Get usage start date based on last_usage_reset_at
      const lastUsageResetAt = profileData?.last_usage_reset_at;
      const usageStartDate = getStartDateForApiUsage(lastUsageResetAt);

      console.log(
        `[API-LIMIT][${requestId}] Counting API usage since ${usageStartDate.toISOString()} (based on last_usage_reset_at: ${
          lastUsageResetAt || "not set"
        })`,
      );

      // Count API calls since the last usage reset date
      const { count, error: countError } = await supabase
        .from("api_usage_logs")
        .select("id", { count: "exact", head: true })
        .match({ user_id: userId })
        .gte("created_at", usageStartDate.toISOString());

      if (countError) {
        console.error(
          `[API-LIMIT][${requestId}] Error counting API usage: ${countError.message}`,
        );
        return res.status(500).json({
          success: false,
          error: "Could not retrieve usage logs",
        });
      }

      const apiCallCount = count || 0;
      const remainingCalls = apiCallLimit - apiCallCount;
      const usagePercentage = ((apiCallCount / apiCallLimit) * 100).toFixed(2);

      console.log(
        `[API-LIMIT][${requestId}] API usage: ${apiCallCount}/${apiCallLimit} (${usagePercentage}%), Remaining: ${remainingCalls}`,
      );

      // Check if the user has exceeded their API call limit
      if (apiCallCount >= apiCallLimit) {
        console.warn(
          `[API-LIMIT][${requestId}] API call limit exceeded for user ${userId} - Usage: ${apiCallCount}/${apiCallLimit}`,
        );
        return res.status(429).json({
          success: false,
          error: "API call limit exceeded for this month",
          limit: apiCallLimit,
          usage: apiCallCount,
        });
      }

      // Log when users are approaching their limit (80% or more)
      if (apiCallCount >= apiCallLimit * 0.8) {
        console.warn(
          `[API-LIMIT][${requestId}] User ${userId} approaching API limit - Usage: ${apiCallCount}/${apiCallLimit} (${usagePercentage}%)`,
        );
      }

      console.log(`[API-LIMIT][${requestId}] Request allowed to proceed`);
      return next();
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : String(error);
      console.error(
        `[API-LIMIT][${requestId}] Unexpected error in API usage limit middleware: ${errorMessage}`,
        error,
      );
      return next();
    }
  };
};
