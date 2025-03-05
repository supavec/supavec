import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { APP_NAME } from "../consts";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";

export const metadata: Metadata = {
  title: `Blog - ${APP_NAME}`,
  description: "Articles and updates from the Supavec team",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <main className="mb-12">{children}</main>
      </div>
      <Footer className="border-t" />
    </div>
  );
}
