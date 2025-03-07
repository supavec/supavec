"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { subscribe } from "./subscribe";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";

type TabsProps = {
  activeTab: string;
  setActiveTab: (tab: "yearly" | "monthly") => void;
  className?: string;
  children: (activeTab: string) => React.ReactNode;
};

type TabsListProps = {
  children: React.ReactNode;
};

type TabsTriggerProps = {
  value: string;
  onClick: () => void;
  children: React.ReactNode;
  isActive: boolean;
};

const Tabs = ({ activeTab, className, children }: TabsProps) => {
  return (
    <div
      className={cn(
        "mx-auto flex w-full items-center justify-center",
        className
      )}
    >
      {children(activeTab)}
    </div>
  );
};

const TabsList = ({ children }: TabsListProps) => {
  return (
    <div className="relative flex w-fit items-center rounded-full border p-1.5">
      {children}
    </div>
  );
};

const TabsTrigger = ({ onClick, children, isActive }: TabsTriggerProps) => {
  return (
    <button
      onClick={onClick}
      className={cn("relative z-[1] px-4 py-2", { "z-0": isActive })}
    >
      {isActive && (
        <motion.div
          layoutId="active-tab"
          className="absolute inset-0 rounded-full bg-accent"
          transition={{
            duration: 0.2,
            type: "spring",
            stiffness: 300,
            damping: 25,
            velocity: 2,
          }}
        />
      )}
      <span
        className={cn(
          "relative block text-sm font-medium duration-200",
          isActive ? "delay-100 text-primary" : ""
        )}
      >
        {children}
      </span>
    </button>
  );
};

export function PricingClient() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "yearly"
  );
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();
  const posthog = usePostHog();

  const handleTabChange = (tab: "yearly" | "monthly") => {
    setBillingCycle(tab);
  };

  const handleSubscribe = async (priceId: string, tierName: string) => {
    try {
      if (tierName === "Free") {
        router.push("/dashboard");
        return;
      }

      setLoadingTier(tierName);

      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      await subscribe(priceId);

      posthog.capture("Subscription initiated", {
        tier: tierName,
        billing_cycle: billingCycle,
        price_id: priceId,
        user_id: data.user.id,
      });
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Subscription failed", {
        description:
          "There was an error processing your subscription. Please try again.",
      });

      posthog.capture("Subscription failed", {
        tier: tierName,
        billing_cycle: billingCycle,
        price_id: priceId,
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="border border-b-0 grid grid-rows-1">
      <div className="grid grid-rows-1 gap-y-10 p-10">
        <Tabs
          activeTab={billingCycle}
          setActiveTab={handleTabChange}
          className="mx-auto w-full max-w-md"
        >
          {(activeTab) => (
            <TabsList>
              {["yearly", "monthly"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  onClick={() => handleTabChange(tab as "yearly" | "monthly")}
                  isActive={activeTab === tab}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === "yearly" && (
                    <span className="ml-2 text-xs font-semibold text-green-500">
                      2 months free
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          )}
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        {siteConfig.pricing.map((tier, index) => (
          <div
            key={index}
            className={cn(
              "outline-focus transition-transform-background relative z-10 box-border grid h-full w-full overflow-hidden text-foreground motion-reduce:transition-none lg:border-r border-t last:border-r-0",
              tier.popular ? "bg-primary/5" : "text-foreground"
            )}
          >
            <div className="flex flex-col h-full">
              <CardHeader className="border-b p-4 grid grid-rows-2 h-fit">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    {tier.name}
                  </span>
                  {tier.popular && (
                    <Badge
                      variant="secondary"
                      className="bg-primary text-primary-foreground hover:bg-secondary-foreground"
                    >
                      Most Popular
                    </Badge>
                  )}
                </CardTitle>
                <div className="pt-2 text-3xl font-bold">
                  <motion.div
                    key={tier.price[billingCycle]}
                    initial={{
                      opacity: 0,
                      x: billingCycle === "yearly" ? -10 : 10,
                      filter: "blur(5px)",
                    }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.25,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  >
                    {tier.price[billingCycle]}
                    <span className="text-sm font-medium text-muted-foreground">
                      / {tier.frequency[billingCycle]}
                    </span>
                  </motion.div>
                </div>
                <p className="text-[15px] font-medium text-muted-foreground">
                  {tier.description}
                </p>
              </CardHeader>

              <CardContent className="flex-grow p-4 pt-5">
                <ul className="space-y-2">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="mr-2 size-4 text-green-500" />
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <Button
                onClick={async () =>
                  await handleSubscribe(tier.priceId[billingCycle], tier.name)
                }
                disabled={loadingTier !== null}
                size="lg"
                className={cn(
                  "focus:ring-0 w-full rounded-none shadow-none",
                  tier.popular
                    ? "bg-primary text-primary-foreground hover:bg-secondary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                )}
              >
                {loadingTier === tier.name ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  tier.cta
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
