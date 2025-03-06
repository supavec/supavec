import type { Metadata } from "next";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { CTA } from "@/components/sections/cta";
import { PricingClient } from "./pricing-client";
import { Testimonials } from "./testimonials";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple pricing for everyone. Choose an affordable plan that's packed with the best features.",
};

const faqItems = [
  {
    question: "How does the 14-day refund policy work?",
    answer:
      "If you&apos;re not satisfied with our service for any reason, simply contact our support team within 14 days of your purchase for a full refund. No questions asked.",
  },
  {
    question: "Can I switch between plans?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you&apos;ll be prorated for the remainder of your billing cycle. When downgrading, changes will take effect at the start of your next billing cycle.",
  },
  {
    question: "Do you offer team discounts?",
    answer:
      "Yes, we offer special pricing for teams of 5 or more. Contact our sales team for more information about team discounts and enterprise plans.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and bank transfers for annual plans. All payments are securely processed and your information is never stored on our servers.",
  },
];

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
            <p className="mt-4 text-lg text-primary font-medium max-w-3xl mx-auto">
              100% refund within 14 days if you don&apos;t love it. No questions
              asked.
            </p>
          </div>

          <PricingClient />

          <Testimonials />

          <div className="mt-24">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:gap-10 max-w-5xl mx-auto">
              {faqItems.map((item, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="text-xl font-semibold">{item.question}</h3>
                  <p className="text-muted-foreground">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <CTA />
      </main>
      <Footer />
    </>
  );
}
