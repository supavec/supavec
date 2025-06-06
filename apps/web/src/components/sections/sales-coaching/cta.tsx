"use client";

import { Section } from "@/components/section";
import { motion } from "framer-motion";
import { PlayCircle, Upload, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const ease = [0.16, 1, 0.3, 1];

export function SalesCoachingCTA() {
  return (
    <Section id="final-cta">
      <div className="relative p-6 lg:p-12 border-x overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-emerald-950/20" />

        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Ready to Transform Your Sales Coaching?
            </h2>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Stop spending hours reviewing call recordings. Start getting
              instant, actionable coaching insights that help your team close
              more deals.
            </p>
          </motion.div>

          {/* Value props summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12"
          >
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                24s
              </div>
              <div className="text-sm text-muted-foreground">
                Average processing time per call
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                3×
              </div>
              <div className="text-sm text-muted-foreground">
                More coaching conversations
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                15%
              </div>
              <div className="text-sm text-muted-foreground">
                Faster pipeline reviews
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a
              href="#interactive-demo"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "text-lg px-8 py-4 text-background flex gap-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              )}
            >
              <PlayCircle className="h-5 w-5" />
              Try Live Demo
            </a>

            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "text-lg px-8 py-4 flex gap-2 rounded-lg transition-all duration-200"
              )}
            >
              <Upload className="h-5 w-5" />
              Build My Coaching App
            </Link>
          </motion.div>

          {/* Risk-free message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span>✓ No credit card required</span>
              <span>✓ Free trial transcript</span>
              <span>✓ Setup in 2 minutes</span>
            </div>

            <p className="text-sm text-muted-foreground italic">
              Join the agencies already transforming their coaching with
              AI-powered insights
            </p>
          </motion.div>

          {/* Secondary value prop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease }}
            viewport={{ once: true }}
            className="pt-8 border-t border-border/50"
          >
            <blockquote className="text-lg font-medium text-foreground italic">
              &ldquo;Every call becomes a coaching opportunity. Every insight
              drives better performance.&rdquo;
            </blockquote>
            <p className="text-sm text-muted-foreground mt-2">
              Transform your sales coaching today with Supavec
            </p>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
