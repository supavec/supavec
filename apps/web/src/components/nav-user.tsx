"use client";

import { ChevronsUpDown, Mail, Sparkles } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut } from "@/app/login/actions";
import { LogoutButton } from "./logout-button";
import { Icons } from "./icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/app/consts";

export function NavUser({
  user,
  hasProSubscription = false,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  hasProSubscription?: boolean;
}) {
  const { isMobile } = useSidebar();
  const posthog = usePostHog();

  return (
    <SidebarMenu>
      {!hasProSubscription && (
        <SidebarMenuItem>
          <Button asChild className="w-full" variant="default">
            <Link href="/pricing">
              <Sparkles className="size-4" />
              <span>Upgrade {APP_NAME}</span>
            </Link>
          </Button>
        </SidebarMenuItem>
      )}

      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Contact Us">
          <Link
            href="mailto:hello@supavec.com"
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText("hello@supavec.com");
              toast.success("Email address copied to clipboard");
              posthog.capture("Email address copied to clipboard from sidebar");
            }}
          >
            <Mail />
            <span>Contact Us</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Discord">
          <Link
            href="https://go.supavec.com/discord-dashboard"
            target="target_blank"
          >
            <Icons.discord />
            <span>Discord</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            {/* <DropdownMenuSeparator /> */}
            {/* <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup> */}
            {/* <DropdownMenuSeparator /> */}
            {/* <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <form
                action={async () => {
                  posthog.reset();
                  await signOut();
                }}
              >
                <LogoutButton />
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
