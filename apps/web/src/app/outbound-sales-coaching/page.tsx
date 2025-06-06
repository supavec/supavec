import type { Metadata } from "next";
import { SalesCoachingHero } from "@/components/sections/sales-coaching/hero";
import { SalesCoachingPainPromise } from "@/components/sections/sales-coaching/pain-promise";
import { SalesCoachingHowItWorks } from "@/components/sections/sales-coaching/how-it-works";
import { SalesCoachingBenefits } from "@/components/sections/sales-coaching/benefits";
import { SalesCoachingIntegrations } from "@/components/sections/sales-coaching/integrations";
import { SalesCoachingSocialProof } from "@/components/sections/sales-coaching/social-proof";
import { SalesCoachingOpenSource } from "@/components/sections/sales-coaching/open-source";
import { SalesCoachingFAQ } from "@/components/sections/sales-coaching/faq";
import { SalesCoachingCTA } from "@/components/sections/sales-coaching/cta";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";

export const metadata: Metadata = {
  title: "AI Sales Call Coaching - Turn Every Call Into a Playbook | Supavec",
  description:
    "Transform sales call transcripts into actionable coaching briefs automatically. Get wins, objections, next steps, and coaching cues in seconds.",
};

export default async function SalesCoachingPage() {
  return (
    <main>
      <Header />
      <SalesCoachingHero />
      <SalesCoachingPainPromise />
      <SalesCoachingHowItWorks />
      <SalesCoachingBenefits />
      <SalesCoachingIntegrations />
      <SalesCoachingSocialProof />
      <SalesCoachingOpenSource />
      <SalesCoachingFAQ />
      <SalesCoachingCTA />
      <Footer />
    </main>
  );
}
