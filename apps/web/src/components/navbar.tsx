"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Logo } from "./logo";
import { Bars2Icon } from "@heroicons/react/24/solid";
import { PlusGrid, PlusGridItem, PlusGridRow } from "./plus-grid";
import { motion } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { signOut } from "@/app/login/actions";

const links = [{ href: "/login", label: "Login" }];

function DesktopNav({ loginUser }: { loginUser: User | null }) {
  return (
    <nav className="relative hidden lg:flex">
      {loginUser ? (
        <PlusGridItem className="relative flex justify-center items-center">
          <Link href="/dashboard">Dashboard</Link>
        </PlusGridItem>
      ) : (
        links.map(({ href, label }) => (
          <PlusGridItem key={href} className="relative flex">
            <Link
              href={href}
              className="flex items-center px-4 py-3 text-base font-medium text-gray-950 bg-blend-multiply data-hover:bg-black/2.5"
            >
              {label}
            </Link>
          </PlusGridItem>
        ))
      )}
    </nav>
  );
}

function MobileNavButton() {
  return (
    <DisclosureButton
      className="flex size-12 items-center justify-center self-center rounded-lg data-hover:bg-black/5 lg:hidden"
      aria-label="Open main menu"
    >
      <Bars2Icon className="size-6" />
    </DisclosureButton>
  );
}

function MobileNav({ loginUser }: { loginUser: User | null }) {
  return (
    <DisclosurePanel className="lg:hidden">
      <div className="flex flex-col gap-6 py-4">
        {loginUser ? (
          <motion.form
            action={signOut}
            initial={{ opacity: 0, rotateX: -90 }}
            animate={{ opacity: 1, rotateX: 0 }}
            transition={{
              duration: 0.15,
              ease: "easeInOut",
              rotateX: { duration: 0.3, delay: 0 * 0.1 },
            }}
          >
            <Link href="/dashboard">Dashboard</Link>
          </motion.form>
        ) : (
          links.map(({ href, label }, linkIndex) => (
            <motion.div
              initial={{ opacity: 0, rotateX: -90 }}
              animate={{ opacity: 1, rotateX: 0 }}
              transition={{
                duration: 0.15,
                ease: "easeInOut",
                rotateX: { duration: 0.3, delay: linkIndex * 0.1 },
              }}
              key={href}
            >
              <Link href={href} className="text-base font-medium text-gray-950">
                {label}
              </Link>
            </motion.div>
          ))
        )}
      </div>
      <div className="absolute left-1/2 w-screen -translate-x-1/2">
        <div className="absolute inset-x-0 top-0 border-t border-black/5" />
        <div className="absolute inset-x-0 top-2 border-t border-black/5" />
      </div>
    </DisclosurePanel>
  );
}

export function Navbar({ banner }: { banner?: React.ReactNode }) {
  const supabase = createClient();
  const [loginUser, setLoginUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setLoginUser(data.user);
    };
    getUser();
  }, [supabase.auth]);

  return (
    <Disclosure as="header" className="pt-12 sm:pt-16">
      <PlusGrid>
        <PlusGridRow className="relative flex justify-between">
          <div className="relative flex gap-6">
            <PlusGridItem className="py-3">
              <Link href="/" title="Home">
                <Logo className="h-9" />
              </Link>
            </PlusGridItem>
            {banner && (
              <div className="relative hidden items-center py-3 lg:flex">
                {banner}
              </div>
            )}
          </div>
          <DesktopNav loginUser={loginUser} />
          <MobileNavButton />
        </PlusGridRow>
      </PlusGrid>
      <MobileNav loginUser={loginUser} />
    </Disclosure>
  );
}
