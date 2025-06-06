"use client";

import { Section } from "@/components/section";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Clock,
  Users,
  Database,
  Zap,
  Target,
  Shield,
  ArrowRight,
} from "lucide-react";

const ease = [0.16, 1, 0.3, 1];

const challenges = [
  {
    icon: <Clock className="h-6 w-6 stroke-1" />,
    title: "Managers lose hours scrubbing call recordings",
    description: "Time spent reviewing instead of coaching active deals",
  },
  {
    icon: <Users className="h-6 w-6 stroke-1" />,
    title: "Coaching slips when pipelines heat up",
    description: "Critical feedback gets delayed when sales teams are busiest",
  },
  {
    icon: <Database className="h-6 w-6 stroke-1" />,
    title: "Sensitive client data can't leave your stack",
    description: "Privacy concerns limit tool adoption for enterprise clients",
  },
];

const solutions = [
  {
    icon: <Zap className="h-6 w-6" />,
    title:
      "Brief in < 30 sec—review an entire hour call faster than a coffee break",
    description: "Auto-generated coaching summary delivered instantly",
  },
  {
    icon: <Target className="h-6 w-6" />,
    title:
      "Auto-extracted insights—each rep gets actionable feedback after every call",
    description: "Wins, objections, and next steps surfaced automatically",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Self-host or SaaS—open-source, SOC-2 path, full VPC deploy option",
    description: "Complete control over your data and deployment",
  },
];

export function SalesCoachingPainPromise() {
  return (
    <Section
      id="why-choose-supavec"
      title="Why Sales Agencies Choose Supavec"
      description="Supavec helps B2B sales agencies turn raw call data into clear, coach-ready actions—without extra headcount or vendor lock-in."
      align="center"
    >
      <div className="relative px-6 pb-6 lg:px-12 lg:pb-12 border-x">
        {/* Micro-proof chip */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Runs 24s per 60-min call (internal benchmark)
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Agency Challenges */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-slate-600 dark:text-slate-400">
                Agency Challenge
              </h3>
            </div>

            <div className="space-y-6">
              {challenges.map((challenge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease }}
                  viewport={{ once: true }}
                  className="flex gap-4 p-4 rounded-lg bg-slate-50/50 dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-700/50"
                >
                  <div className="flex-shrink-0 text-slate-500 dark:text-slate-400">
                    {challenge.icon}
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">
                      {challenge.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {challenge.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Supavec Fix */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                Supavec Fix
              </h3>
            </div>

            <div className="space-y-6">
              {solutions.map((solution, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease }}
                  viewport={{ once: true }}
                  className="flex gap-4 p-4 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/50"
                >
                  <div className="flex-shrink-0 text-emerald-600 dark:text-emerald-400">
                    {solution.icon}
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">
                      {solution.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {solution.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* CTA Nudger */}
        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease }}
          viewport={{ once: true }}
        >
          <a
            href="#interactive-demo"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "group"
            )}
          >
            See a Live Brief
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </Section>
  );
}
