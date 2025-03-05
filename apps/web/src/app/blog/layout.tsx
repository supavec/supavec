import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { APP_NAME } from "../consts";
import { Footer } from "@/components/sections/footer";

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
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 border-b border-gray-200 dark:border-gray-800 pb-8">
          <div className="flex justify-between items-center mb-6">
            <Link href="/" className="text-xl font-bold">
              {APP_NAME}
            </Link>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/blog" className="font-medium">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard">Dashboard</Link>
                </li>
              </ul>
            </nav>
          </div>
          <h1 className="text-4xl font-bold mb-2">Supavec Blog</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Articles, tutorials, and updates from the Supavec team
          </p>
        </header>

        <main className="mb-12">{children}</main>

        <Footer className="border-t" />
      </div>
    </div>
  );
}
