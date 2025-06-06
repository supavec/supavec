"use client";

import { Section } from "@/components/section";
import { motion } from "framer-motion";
import { Star, Shield, Users } from "lucide-react";

const ease = [0.16, 1, 0.3, 1];

const visionStatements = [
  {
    quote:
      "Imagine cutting call review time from 40 minutes to 8 minutes per call. Instead of spending hours analyzing recordings, get instant insights that actually help reps improve.",
    title: "The Vision",
    subtitle: "What we're building for sales leaders",
    icon: "🎯",
  },
  {
    quote:
      "Picture saving 12+ hours per week across your team. Reps get clear next-step checklists after each call, leading to higher conversion rates.",
    title: "The Impact",
    subtitle: "How we transform sales coaching",
    icon: "⚡",
  },
];

const stats = [
  {
    number: "Open-Source",
    label: "MIT licensed for transparency",
    icon: <Users className="h-6 w-6" />,
  },
  {
    number: "24s",
    label: "Target processing time per call",
    icon: <Shield className="h-6 w-6" />,
  },
  {
    number: "Self-Host",
    label: "Deploy in your own VPC",
    icon: <Star className="h-6 w-6" />,
  },
];

export function SalesCoachingSocialProof() {
  return (
    <Section
      id="social-proof"
      title="Early Access Program"
      subtitle="Be The First To Experience AI-Powered Coaching"
      description="Join our pilot program and help shape the future of sales coaching"
      align="center"
    >
      <div className="relative px-6 pb-6 lg:px-12 lg:pb-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Vision Statements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {visionStatements.map((statement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2, ease }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border shadow-sm">
                  {/* Icon */}
                  <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                    {statement.icon}
                  </div>

                  {/* Content */}
                  <div className="mt-4">
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      {statement.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {statement.subtitle}
                    </p>
                    <blockquote className="text-foreground leading-relaxed italic">
                      {statement.quote}
                    </blockquote>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Platform Features
              </h3>
              <p className="text-muted-foreground">
                Built for modern sales teams who value transparency and control
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1, ease }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white mb-3">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Founding Partner Program */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl p-8 border border-emerald-200 dark:border-emerald-800 text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-full text-sm font-medium mb-6">
                <Shield className="h-4 w-4" />
                Founding Partner Program
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-4">
                Join Our Early Access Program
              </h3>

              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Be among the first agencies to test our AI coaching platform.
                Get early access, direct feedback channels with our team, and
                help shape the product roadmap. Only 12 spots available.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-sm">
                <div className="p-4 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                  <div className="font-semibold text-emerald-800 dark:text-emerald-300 mb-1">
                    White-Glove Setup
                  </div>
                  <div className="text-muted-foreground">
                    Dedicated onboarding specialist
                  </div>
                </div>
                <div className="p-4 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                  <div className="font-semibold text-emerald-800 dark:text-emerald-300 mb-1">
                    Early Access
                  </div>
                  <div className="text-muted-foreground">
                    First to get new features
                  </div>
                </div>
                <div className="p-4 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                  <div className="font-semibold text-emerald-800 dark:text-emerald-300 mb-1">
                    Partner Pricing
                  </div>
                  <div className="text-muted-foreground">
                    Special rates for early adopters
                  </div>
                </div>
              </div>

              <button className="inline-flex items-center px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors">
                Apply for Early Access
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
