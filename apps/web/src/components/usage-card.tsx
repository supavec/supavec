"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";

type UsageCardProps = {
  initialStorageUsage?: number;
  initialStorageLimit?: number;
  initialSubscriptionTier?: "Free" | "Basic" | "Enterprise" | null;
};

export function UsageCard({
  initialStorageUsage = 0,
  initialStorageLimit = 250,
  initialSubscriptionTier = null,
}: UsageCardProps) {
  const supabase = createClient();

  const [apiCallUsage, setApiCallUsage] = useState(0);
  const [apiCallLimit, setApiCallLimit] = useState(100);
  const [storageUsage, setStorageUsage] = useState(initialStorageUsage);
  const [storageLimit, setStorageLimit] = useState(initialStorageLimit);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(
    initialSubscriptionTier
  );

  const [isLoading, setIsLoading] = useState(true);

  const apiCallPercentage = Math.min(100, (apiCallUsage / apiCallLimit) * 100);
  const storagePercentage = Math.min(100, (storageUsage / storageLimit) * 100);

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

        const tier = initialSubscriptionTier;
        setSubscriptionTier(tier);

        // Set limits based on subscription tier
        const limits = getLimits(tier);
        setApiCallLimit(limits.apiCalls);
        setStorageLimit(limits.storage);

        // Fetch API usage for the current month
        const { count } = await supabase
          .from("api_usage_logs")
          .select("id", { count: "exact", head: true })
          .gte(
            "created_at",
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              1
            ).toISOString()
          );

        setApiCallUsage(count || 0);
        setStorageUsage(initialStorageUsage);
      } catch (error) {
        console.error("Error fetching usage data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsageData();
  }, [supabase, initialSubscriptionTier, initialStorageUsage]);

  // Helper function to format storage display
  const formatStorage = (mbValue: number) => {
    if (mbValue >= 1024) {
      return `${(mbValue / 1024).toFixed(1)} GB`;
    }
    return `${mbValue} MB`;
  };

  return (
    <Card className="basis-full md:basis-1/2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Usage</CardTitle>
          {subscriptionTier && (
            <span className="text-sm font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
              {subscriptionTier} Plan
            </span>
          )}
        </div>
        <CardDescription>Your current usage and limits</CardDescription>
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
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              Storage
            </div>
            <div className="font-medium">
              {isLoading
                ? "Loading..."
                : `${formatStorage(storageUsage)} / ${formatStorage(storageLimit)}`}
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${isLoading ? 0 : storagePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
