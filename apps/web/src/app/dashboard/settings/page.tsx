import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { ManageSubscriptionButton } from "./manage-subscription-button";
import { STRIPE_PRODUCT_IDS } from "@/lib/config";

export const metadata = {
  title: "Settings",
  description:
    "Manage your account settings, subscription and billing information",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "id, name, email, stripe_is_subscribed, stripe_subscribed_product_id"
    )
    .single();

  const { data: teamMemberships } = await supabase
    .from("team_memberships")
    .select("id, teams(name, id)");

  const hasSubscription = profile?.stripe_is_subscribed ?? false;

  // Determine the subscription tier based on the product ID
  let subscriptionTier = "Free";

  if (hasSubscription && profile?.stripe_subscribed_product_id) {
    if (profile.stripe_subscribed_product_id === STRIPE_PRODUCT_IDS.BASIC) {
      subscriptionTier = "Basic";
    } else if (
      profile.stripe_subscribed_product_id === STRIPE_PRODUCT_IDS.ENTERPRISE
    ) {
      subscriptionTier = "Enterprise";
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar
        user={profile}
        team={teamMemberships}
        hasProSubscription={hasSubscription}
        subscribedProductId={profile?.stripe_subscribed_product_id}
      />
      <SidebarInset>
        <header className="border-b flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <Link href="/dashboard">Dashboard</Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Settings</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="py-10 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings, subscription and billing information
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Status</CardTitle>
                <CardDescription>
                  Your current subscription plan and status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Current Plan
                    </div>
                    <div className="font-medium">
                      {hasSubscription
                        ? `${subscriptionTier} Plan`
                        : "Free Plan"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Status
                    </div>
                    <div className="font-medium">
                      {hasSubscription ? (
                        <span className="text-green-500">Active</span>
                      ) : (
                        <span className="text-yellow-500">
                          No active subscription
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {hasSubscription ? (
                  <ManageSubscriptionButton />
                ) : (
                  <Button asChild>
                    <a href="/pricing">Upgrade Plan</a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
