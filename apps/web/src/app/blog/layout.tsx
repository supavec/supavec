import type { Metadata } from "next";
import React from "react";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles and updates from the Supavec team",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="min-h-screen py-12 md:py-20">
        <div className="container mx-auto py-8">
          <main className="mb-12">{children}</main>
        </div>
      </div>
      <Footer className="border-t" />
    </>
  );
}
