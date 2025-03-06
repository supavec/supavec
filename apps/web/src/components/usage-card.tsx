"use client";

import type { Tables } from "@/types/supabase";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import { getNextUsageResetDate } from "@/lib/utils";

type SubscriptionTier = "Free" | "Basic" | "Enterprise" | null;

type UsageCardProps = {
  initialStorageUsage?: number;
  subscribedProductId: Tables<"profiles">["stripe_subscribed_product_id"];
  lastUsageResetAt?: string | null;
};

/**
 * Gets the start date for counting API usage based on the user's last_usage_reset_at date
 */
function getStartDateForApiUsage(lastUsageResetAt: string | null): Date {
  if (!lastUsageResetAt) {
    // Fallback to first day of current month if no reset date is available
    const currentDate = new Date();
    return new Date(
      Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1)
    );
  }

  const resetDate = new Date(lastUsageResetAt);
  const currentDate = new Date();

  // Create date with same day in current month
  const currentMonthResetDay = new Date(
    Date.UTC(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      resetDate.getUTCDate()
    )
  );

  // If we're past the reset day in the current month, use current month's reset day
  // Otherwise, use last month's reset day
  if (currentDate.getTime() >= currentMonthResetDay.getTime()) {
    return currentMonthResetDay;
  } else {
    // Use the previous month's reset day
    const lastMonthResetDay = new Date(
      Date.UTC(
        currentDate.getUTCMonth() === 0
          ? currentDate.getUTCFullYear() - 1
          : currentDate.getUTCFullYear(),
        currentDate.getUTCMonth() === 0 ? 11 : currentDate.getUTCMonth() - 1,
        resetDate.getUTCDate()
      )
    );

    // Handle edge cases (e.g., Jan 31 → Feb 28/29)
    if (lastMonthResetDay.getUTCDate() !== resetDate.getUTCDate()) {
      // Set to the last day of the target month
      lastMonthResetDay.setUTCDate(0);
    }

    return lastMonthResetDay;
  }
}

export function UsageCard({
  initialStorageUsage = 0,
  subscribedProductId = null,
  lastUsageResetAt = null,
}: UsageCardProps) {
  const supabase = createClient();

  const [apiCallUsage, setApiCallUsage] = useState(0);
  const [apiCallLimit, setApiCallLimit] = useState(100);
  const nextUsageResetDate = getNextUsageResetDate(lastUsageResetAt);

  // Map the stripe_subscribed_product_id to the appropriate tier name
  let subscriptionTier: SubscriptionTier = null;

  if (subscribedProductId) {
    if (
      // Check if it's a Basic tier product
      subscribedProductId === process.env.NEXT_PUBLIC_STRIPE_PRODUCT_BASIC
    ) {
      subscriptionTier = "Basic";
    } else if (
      // Check if it's an Enterprise tier product
      subscribedProductId === process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ENTERPRISE
    ) {
      subscriptionTier = "Enterprise";
    } else {
      // Default to Free if we don't recognize the product ID
      subscriptionTier = "Free";
    }
  } else {
    // No subscription, so Free tier
    subscriptionTier = "Free";
  }

  const [isLoading, setIsLoading] = useState(true);

  const apiCallPercentage = Math.min(100, (apiCallUsage / apiCallLimit) * 100);
  // Helper function to get limits based on subscription tier
  const getLimits = (tier: string | null) => {
    switch (tier) {
      case "Basic":
        return { apiCalls: 750, storage: 2 * 1024 }; // 750 API calls, 2GB
      case "Enterprise":
        return { apiCalls: 5000, storage: 15 * 1024 }; // 5000 API calls, 15GB
      case "Free":
      default:
        return { apiCalls: 100, storage: 250 }; // 100 API calls, 250MB
    }
  };

  useEffect(() => {
    async function fetchUsageData() {
      try {
        setIsLoading(true);

        // Set limits based on subscription tier
        const limits = getLimits(subscriptionTier);
        setApiCallLimit(limits.apiCalls);

        // Get usage start date based on last_usage_reset_at
        const usageStartDate = getStartDateForApiUsage(lastUsageResetAt);
        console.log({ usageStartDate });

        // Fetch API usage since the last usage reset date
        const { count } = await supabase
          .from("api_usage_logs")
          .select("id", { count: "exact", head: true })
          .gte("created_at", usageStartDate.toISOString());

        setApiCallUsage(count || 0);
      } catch (error) {
        console.error("Error fetching usage data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsageData();
  }, [supabase, initialStorageUsage, subscriptionTier, lastUsageResetAt]);

  return (
    <Card className="basis-full md:basis-1/2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Usage (this period)</CardTitle>
          {subscriptionTier && (
            <span className="text-sm font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
              {subscriptionTier} Plan
            </span>
          )}
        </div>
        <CardDescription>Your current usage and limits</CardDescription>
        {nextUsageResetDate && (
          <CardDescription className="mt-1">
            Usage will reset{" "}
            {new Date(nextUsageResetDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              API Calls
            </div>
            <div className="font-medium">
              {isLoading ? "Loading..." : `${apiCallUsage} / ${apiCallLimit}`}
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${isLoading ? 0 : apiCallPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
