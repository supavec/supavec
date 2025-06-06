"use client";

import { Section } from "@/components/section";
import { motion } from "framer-motion";
import { Upload, Layers, FileText, ArrowRight } from "lucide-react";

const ease = [0.16, 1, 0.3, 1];

const steps = [
  {
    number: "01",
    icon: <Upload className="h-8 w-8" />,
    title: "Ingest",
    description: "Drop in a .vtt / .srt or connect Fireflies API",
    details:
      "Support for all major transcript formats. Zoom, Teams, Fireflies, Gong - we handle them all.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    number: "02",
    icon: <Layers className="h-8 w-8" />,
    title: "Chunk & Retrieve",
    description:
      "Supavec's open-source RAG slices by speaker, batches turns, indexes instantly",
    details:
      "Advanced speaker diarization and context-aware chunking for maximum accuracy.",
    color: "from-purple-500 to-pink-500",
  },
  {
    number: "03",
    icon: <FileText className="h-8 w-8" />,
    title: "Summarize & Coach",
    description:
      "LLM generates a one-page brief (wins, objections, next steps, sentiment, talk-ratio)",
    details:
      "Actionable insights formatted for immediate coaching and CRM updates.",
    color: "from-emerald-500 to-teal-500",
  },
];

export function SalesCoachingHowItWorks() {
  return (
    <Section
      id="how-it-works"
      title="How It Works"
      subtitle="3-Step Visual Process"
      description="Transform your sales calls into coaching gold in three simple steps"
      align="center"
    >
      <div className="relative p-6 lg:p-12 border-x">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2, ease }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Step Card */}
                <div className="relative p-6 rounded-xl bg-gradient-to-br from-background/50 to-muted/50 border border-border/50 backdrop-blur-sm">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4">
                    <div
                      className={`w-14 h-14 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-xl shadow-lg border-4 border-background`}
                    >
                      {index + 1}
                    </div>
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-lg bg-gradient-to-r ${step.color} flex items-center justify-center text-white mb-4 mt-4`}
                  >
                    {step.icon}
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground">
                      {step.description}
                    </p>
                    <p className="text-xs text-muted-foreground/80">
                      {step.details}
                    </p>
                  </div>
                </div>

                {/* Arrow connector (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-8 transform -translate-y-1/2 text-muted-foreground/40">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Code/Visual Example */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease }}
            viewport={{ once: true }}
            className="mt-12 p-6 rounded-xl bg-muted/30 border"
          >
            <div className="text-center space-y-4">
              <h4 className="text-lg font-semibold text-foreground">
                From Raw Transcript to Coaching Brief
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                <div className="p-4 rounded bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                  <div className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                    Input
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    transcript.vtt
                    <br />
                    47 minutes • 2 speakers
                  </div>
                </div>
                <div className="p-4 rounded bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                  <div className="font-medium text-purple-800 dark:text-purple-300 mb-2">
                    Processing
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Speaker diarization
                    <br />
                    Context chunking
                    <br />
                    Vector indexing
                  </div>
                </div>
                <div className="p-4 rounded bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                  <div className="font-medium text-emerald-800 dark:text-emerald-300 mb-2">
                    Output
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Coaching brief
                    <br />
                    Ready in 24 seconds
                    <br />
                    CRM-ready format
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
