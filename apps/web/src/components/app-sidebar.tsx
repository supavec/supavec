"use client";

import * as React from "react";
import {
  BookOpen,
  SquareTerminal,
  GalleryVerticalEnd,
  Video,
  CreditCard,
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
}) {
  const pathname = usePathname();

  const isDashboardActive = pathname === "/dashboard";
  const isBillingActive = pathname === "/dashboard/billing";

  const data = {
    teams: [
      {
        name: team?.[0]?.teams?.name ?? "Your team",
        logo: GalleryVerticalEnd,
        plan: "Beta",
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
        title: "Billing",
        url: "/dashboard/billing",
        icon: CreditCard,
        isActive: isBillingActive,
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
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
