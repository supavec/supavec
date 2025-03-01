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

interface UsageCardProps {
  initialApiCallUsage?: number;
  initialApiCallLimit?: number;
  initialStorageUsage?: number;
  initialStorageLimit?: number;
  initialHasProSubscription?: boolean;
}

export function UsageCard({
  initialApiCallUsage = 0,
  initialApiCallLimit = 100,
  initialStorageUsage = 0,
  initialStorageLimit = 1024,
  initialHasProSubscription = false,
}: UsageCardProps) {
  const [apiCallUsage, setApiCallUsage] = useState(initialApiCallUsage);
  const [apiCallLimit, setApiCallLimit] = useState(initialApiCallLimit);
  const [storageUsage, setStorageUsage] = useState(initialStorageUsage);
  const [storageLimit, setStorageLimit] = useState(initialStorageLimit);
  const [hasProSubscription, setHasProSubscription] = useState(
    initialHasProSubscription
  );
  const [isLoading, setIsLoading] = useState(true);

  const apiCallPercentage = Math.min(100, (apiCallUsage / apiCallLimit) * 100);
  const storagePercentage = Math.min(100, (storageUsage / storageLimit) * 100);

  useEffect(() => {
    async function fetchUsageData() {
      try {
        setIsLoading(true);
        const supabase = createClient();

        // Get user profile data
        const { data: profileData } = await supabase
          .from("profiles")
          .select("id, stripe_is_subscribed")
          .single();

        if (profileData) {
          const hasProSub = profileData.stripe_is_subscribed ?? false;
          setHasProSubscription(hasProSub);

          // Set limits based on subscription status
          setApiCallLimit(hasProSub ? 1000 : 100);
          setStorageLimit(hasProSub ? 10 * 1024 : 1024); // 10GB or 1GB in MB

          // Fetch API usage for the current month
          const { count } = await supabase
            .from("api_usage_logs")
            .select("*", { count: "exact", head: true })
            .match({ user_id: profileData.id })
            .gte(
              "created_at",
              new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                1
              ).toISOString()
            );

          setApiCallUsage(count || 0);

          // TODO: Calculate actual storage usage from files
          // This would need to be implemented based on your data model
          setStorageUsage(0);
        }
      } catch (error) {
        console.error("Error fetching usage data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    // Only fetch if we don't have initial data
    if (initialApiCallUsage === 0 && initialStorageUsage === 0) {
      fetchUsageData();
    } else {
      setIsLoading(false);
    }
  }, [initialApiCallUsage, initialStorageUsage]);

  return (
    <Card className="basis-full md:basis-1/2">
      <CardHeader>
        <CardTitle>Usage</CardTitle>
        <CardDescription>Your current usage and limits</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              AI Generations
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
                : `${storageUsage} MB / ${hasProSubscription ? "10 GB" : "1 GB"}`}
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
