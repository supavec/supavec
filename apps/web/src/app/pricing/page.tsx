import type { Metadata } from "next";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { CTA } from "@/components/sections/cta";
import { PricingClient } from "./pricing-client";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple pricing for everyone. Choose an affordable plan that's packed with the best features.",
};

export default async function PricingPage() {
  return (
    <>
      <Header />
      <main className="bg-background text-foreground">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              Simple pricing for everyone
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose an affordable plan that&apos;s packed with the best
              features for engaging your audience, creating customer loyalty,
              and driving sales.
            </p>
          </div>

          <PricingClient />
        </div>
        <CTA />
      </main>
      <Footer />
    </>
  );
}
