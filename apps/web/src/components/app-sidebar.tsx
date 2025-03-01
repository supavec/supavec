"use client";

import * as React from "react";
import {
  BookOpen,
  SquareTerminal,
  GalleryVerticalEnd,
  Video,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({
  user,
  team,
  hasProSubscription = false,
  subscribedProductId = null,
}: {
  user: { id: string; name: string | null; email: string | null } | null;
  team:
    | {
        id: string;
        teams: {
          name: string | null;
          id: string;
        };
      }[]
    | null;
  hasProSubscription?: boolean;
  subscribedProductId?: string | null;
}) {
  const pathname = usePathname();

  const isDashboardActive = pathname === "/dashboard";
  const isSettingsActive = pathname === "/dashboard/settings";

  let subscriptionTier = "Free";

  if (hasProSubscription && subscribedProductId) {
    if (subscribedProductId === process.env.NEXT_PUBLIC_STRIPE_PRODUCT_BASIC) {
      subscriptionTier = "Basic";
    } else if (
      subscribedProductId === process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ENTERPRISE
    ) {
      subscriptionTier = "Enterprise";
    }
  }

  const data = {
    teams: [
      {
        name: team?.[0]?.teams?.name ?? "Your team",
        logo: GalleryVerticalEnd,
        plan: subscriptionTier,
      },
    ],
    user: {
      name: user?.name ?? "User",
      email: user?.email ?? "",
      avatar: "/avatars/user.jpg",
    },
    navMain: [
      {
        isExternal: false,
        title: "Dashboard",
        url: "/dashboard",
        icon: SquareTerminal,
        isActive: isDashboardActive,
      },
      {
        isExternal: false,
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
        isActive: isSettingsActive,
      },
      {
        title: "Documentation",
        url: "https://docs.supavec.com/",
        icon: BookOpen,
        isExternal: true,
      },
      {
        title: "Tutorial",
        url: "https://go.supavec.com/tutorial-video",
        icon: Video,
        isExternal: true,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} team={data.teams[0]} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} hasProSubscription={hasProSubscription} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
