"use client";

import { MobileDrawer } from "@/components/mobile-drawer";
import { useAuth } from "@/hooks/use-auth";
import { buttonVariants } from "@/components/ui/button";
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
        <div className="hidden lg:flex gap-x-4">
          <Link
            href="/pricing"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "rounded-lg h-8 tracking-tight font-medium"
            )}
          >
            Pricing
          </Link>
          <a
            href="https://docs.supavec.com/"
            target="_blank"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "rounded-lg h-8 tracking-tight font-medium"
            )}
          >
            API Docs
          </a>
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
