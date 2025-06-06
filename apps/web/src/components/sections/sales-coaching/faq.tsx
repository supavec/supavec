"use client";

import { Section } from "@/components/section";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const ease = [0.16, 1, 0.3, 1];

const faqs = [
  {
    question: "How accurate are the summaries?",
    answer:
      "Our AI achieves 95%+ accuracy in objection detection and sentiment analysis. We use advanced speaker diarization and context-aware processing to ensure coaching insights are reliable and actionable. For edge cases, summaries include confidence scores and relevant transcript snippets for verification.",
  },
  {
    question: "Can it detect multiple speakers?",
    answer:
      "Yes, Supavec automatically identifies and separates different speakers in your calls. Our advanced diarization handles overlapping speech, background noise, and varying audio quality. Each insight is tagged with speaker attribution, so you know exactly who said what.",
  },
  {
    question: "How do we ingest calls at scale?",
    answer:
      "Multiple options: direct API integration with platforms like Fireflies and Zoom, bulk upload via dashboard, or automated workflows through our REST API. We support .vtt, .srt, .txt formats and can process hundreds of calls simultaneously with sub-30-second turnaround times.",
  },
  {
    question: "What languages are supported?",
    answer:
      "Currently optimized for English with excellent results. Spanish, French, and German support is in beta. We're expanding language coverage based on customer demand—reach out if you need specific language support for your market.",
  },
  {
    question: "How does pricing work for agencies?",
    answer:
      "We offer per-transcript pricing starting at $0.25/call, or volume-based monthly subscriptions. Enterprise agencies get custom pricing with white-label options, dedicated support, and on-premise deployment. No setup fees or minimum commitments.",
  },
  {
    question: "Can we customize the coaching templates?",
    answer:
      "Absolutely. You can create custom coaching frameworks, modify insight categories, and set agency-specific criteria for what constitutes wins, objections, or red flags. Templates can be shared across teams or kept private to specific managers.",
  },
];

export function SalesCoachingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section
      id="faq"
      title="Frequently Asked Questions"
      subtitle="Got Questions? We Have Answers"
      description="Everything you need to know about transforming your sales coaching with AI"
      align="center"
    >
      <div className="relative p-6 lg:p-12 border-x">
        <div className="max-w-4xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease }}
              viewport={{ once: true }}
              className="border border-border/50 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 text-left flex items-center justify-between bg-background hover:bg-muted/50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-foreground pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0 text-muted-foreground">
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
              </button>

              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease }}
                className="overflow-hidden"
              >
                <div className="p-6 pt-0 border-t border-border/50">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Contact for more questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease }}
          viewport={{ once: true }}
          className="mt-12 text-center space-y-4"
        >
          <h3 className="text-xl font-semibold text-foreground">
            Still have questions?
          </h3>
          <p className="text-muted-foreground">
            Our team is here to help you understand how Supavec can transform
            your sales coaching
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@supavec.com"
              className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              Email Our Team
            </a>
            <a
              href="https://cal.com/taishik/15-mins-meeting"
              target="_blank"
              className="inline-flex items-center px-6 py-3 border border-border hover:bg-muted text-foreground font-medium rounded-lg transition-colors"
            >
              Schedule a Demo
            </a>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
