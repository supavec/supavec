import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { FeaturedSection } from "@/components/sections/featured-section";
import { WhyIBuit } from "@/components/sections/why-i-built";
import { WhatIsRag } from "@/components/sections/what-is-rag";
import { WhySupavec } from "@/components/sections/why-supavec";
import { HowToUse } from "@/components/sections/how-to-use";
import { Community } from "@/components/sections/community";
import { CTA } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";
import { Pricing } from "@/components/sections/pricing";

export const metadata: Metadata = {
  description:
    "The open-source alternative to Carbon.ai. Build powerful RAG applications with any data source, at any scale.",
};

export default async function Home() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  return (
    <main>
      <Header isLoggedIn={!!user?.user} />
      <Hero />
      <FeaturedSection />
      <WhyIBuit />
      <WhatIsRag />
      <WhySupavec />
      <HowToUse />
      <Pricing />
      <Community />
      <CTA />
      <Footer />
    </main>
  );
}
