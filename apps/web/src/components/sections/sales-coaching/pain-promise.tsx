"use client";

import { Section } from "@/components/section";
import { motion } from "framer-motion";
import {
  Clock,
  Users,
  TrendingDown,
  Zap,
  Target,
  LineChart,
} from "lucide-react";

const ease = [0.16, 1, 0.3, 1];

const painPoints = [
  {
    icon: <Clock className="h-6 w-6" />,
    emoji: "⏰",
    title: "Managers binge-watching midnight replays",
    description:
      "Sales managers spending hours reviewing call recordings instead of coaching",
  },
  {
    icon: <Users className="h-6 w-6" />,
    emoji: "⏱️",
    title: "Reps missing coaching while quota clock ticks",
    description:
      "Critical coaching opportunities lost due to time constraints and manual review processes",
  },
  {
    icon: <TrendingDown className="h-6 w-6" />,
    emoji: "📊",
    title: "Ops teams drowning in call data",
    description:
      "Mountains of transcript data with no clear insights or actionable intelligence",
  },
];

const promisePoints = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Instant coaching summaries",
    description:
      "Every call gets a coach's summary—no extra headcount required",
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "Actionable insights",
    description:
      "Clear wins, objections, and next steps extracted automatically",
  },
  {
    icon: <LineChart className="h-6 w-6" />,
    title: "Scale your coaching",
    description: "Coach more reps, more often, with AI-powered analysis",
  },
];

export function SalesCoachingPainPromise() {
  return (
    <Section
      id="pain-promise"
      title="Why This Page Exists"
      className="border-x"
    >
      <div className="relative p-6 lg:p-12 border-x">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Pain Points */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-red-600 dark:text-red-400">
                The Pain
              </h3>
              <p className="text-lg text-muted-foreground">
                B2B sales agencies are drowning in call data but starving for
                insights
              </p>
            </div>

            <div className="space-y-6">
              {painPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease }}
                  viewport={{ once: true }}
                  className="flex gap-4 p-4 rounded-lg bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/50"
                >
                  <div className="flex-shrink-0 text-2xl">{point.emoji}</div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">
                      {point.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {point.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Promise */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                The Promise
              </h3>
              <div className="p-6 rounded-lg bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 border border-emerald-200 dark:border-emerald-800">
                <blockquote className="text-xl font-medium text-foreground italic">
                  &ldquo;Supavec gives every call a coach&rsquo;s summary—no
                  extra headcount.&rdquo;
                </blockquote>
                <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium mt-3">
                  One-page summary in &lt; 30 seconds
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {promisePoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease }}
                  viewport={{ once: true }}
                  className="flex gap-4 p-4 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/50"
                >
                  <div className="flex-shrink-0 text-emerald-600 dark:text-emerald-400">
                    {point.icon}
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">
                      {point.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {point.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
