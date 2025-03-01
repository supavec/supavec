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
  initialHasProSubscription?: boolean;
};

export function UsageCard({
  initialStorageUsage = 0,
  initialStorageLimit = 1024,
  initialHasProSubscription = false,
}: UsageCardProps) {
  const supabase = createClient();

  const [apiCallUsage, setApiCallUsage] = useState(0);
  const [apiCallLimit, setApiCallLimit] = useState(
    initialHasProSubscription ? 1000 : 100
  );
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

        const hasProSub = initialHasProSubscription;
        setHasProSubscription(hasProSub);

        // Set limits based on subscription status
        setApiCallLimit(hasProSub ? 1000 : 100);
        setStorageLimit(hasProSub ? 10 * 1024 : 1024); // 10GB or 1GB in MB

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
        setStorageUsage(0);
      } catch (error) {
        console.error("Error fetching usage data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsageData();
  }, [supabase, initialHasProSubscription]);

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
