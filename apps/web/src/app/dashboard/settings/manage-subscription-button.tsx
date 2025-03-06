"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createStripePortalLink } from "./actions";

export function ManageSubscriptionButton() {
  const [isPending, startTransition] = useTransition();

  const handleManageSubscription = async () => {
    startTransition(async () => {
      const { url } = await createStripePortalLink();
      if (url) {
        window.location.href = url;
      }
    });
  };

  return (
    <Button onClick={handleManageSubscription} disabled={isPending}>
      {isPending ? "Loading..." : "Manage Subscription"}
    </Button>
  );
}
