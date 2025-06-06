"use client";

import { MobileDrawer } from "@/components/mobile-drawer";
import { useAuth } from "@/hooks/use-auth";
import { buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function Header() {
  const { isLoggedIn } = useAuth();

  return (
    <header className="sticky top-0 h-[var(--header-height)] z-50 p-0 bg-background/60 backdrop-blur">
      <div className="flex justify-between items-center container mx-auto p-2">
        <Link
          href="/"
          title="brand-logo"
          className="relative mr-6 flex items-center space-x-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="logo" className="size-8" />
          <span className="font-semibold text-lg">{siteConfig.name}</span>
        </Link>

        <div className="hidden lg:flex items-center gap-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-8 tracking-tight font-medium">
                  Solutions
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-2 p-4 w-[300px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/outbound-sales-call-coaching"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Sales Coaching
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Interactive sales coaching example with AI feedback
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "h-8 tracking-tight font-medium"
                  )}
                >
                  <Link href="/pricing">Pricing</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "h-8 tracking-tight font-medium"
                  )}
                >
                  <a href="https://docs.supavec.com/" target="_blank">
                    API Docs
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "default" }),
                "h-8 text-primary-foreground rounded-lg group tracking-tight font-medium"
              )}
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "default" }),
                "h-8 text-primary-foreground rounded-lg group tracking-tight font-medium"
              )}
            >
              {siteConfig.cta}
            </Link>
          )}
        </div>

        <div className="mt-2 cursor-pointer block lg:hidden">
          <MobileDrawer isLoggedIn={isLoggedIn} />
        </div>
      </div>
      <hr className="absolute w-full bottom-0" />
    </header>
  );
}
