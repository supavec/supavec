import { buttonVariants } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { IoMenuSharp } from "react-icons/io5";

export function MobileDrawer({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <Drawer>
      <DrawerTrigger>
        <IoMenuSharp className="text-2xl" />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="px-6">
          <Link
            href="/"
            title="brand-logo"
            className="relative mr-6 flex items-center space-x-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="logo" className="size-8" />
            <DrawerTitle>{siteConfig.name}</DrawerTitle>
          </Link>
          <DrawerDescription>{siteConfig.description}</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <div className="space-y-2 mb-4">
            <h3 className="text-sm font-medium text-muted-foreground px-4 text-center">
              Solutions
            </h3>
            <Link
              href="/outbound-sales-call-coaching"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "rounded-full justify-center w-full"
              )}
            >
              Sales Coaching
            </Link>
          </div>
          <Link
            href="/pricing"
            className={cn(buttonVariants({ variant: "ghost" }), "rounded-full")}
          >
            Pricing
          </Link>
          <a
            href="https://docs.supavec.com/"
            target="_blank"
            className={cn(buttonVariants({ variant: "ghost" }), "rounded-full")}
          >
            API Docs
          </a>
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "default" }),
                "rounded-full group"
              )}
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "default" }),
                "rounded-full group"
              )}
            >
              {siteConfig.cta}
            </Link>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
