"use client";

import { AuroraText } from "@/components/aurora-text";
import { Section } from "@/components/section";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { PlayCircle, Upload } from "lucide-react";

const ease = [0.16, 1, 0.3, 1];

function SalesCoachingHeroTitles() {
  return (
    <div className="flex w-full max-w-4xl flex-col overflow-hidden pt-8">
      <motion.h1
        className="text-left text-4xl font-semibold leading-tight text-foreground sm:text-5xl md:text-6xl tracking-tighter"
        initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
        animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          ease,
          staggerChildren: 0.2,
        }}
      >
        <motion.span
          className="inline-block text-balance"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            ease,
          }}
        >
          <AuroraText className="leading-tight">
            Turn Every Sales Call Into a Playbook-Ready Brief—Automatically
          </AuroraText>
        </motion.span>
      </motion.h1>
      <motion.p
        className="text-left max-w-2xl leading-relaxed text-muted-foreground sm:text-lg sm:leading-relaxed text-balance mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.6,
          duration: 0.8,
          ease,
        }}
      >
        Upload a Zoom or Fireflies transcript and, in seconds, Supavec surfaces
        wins, objections, next steps, and coaching cues—so your agency spends
        more time closing and less time replaying recordings. All powered by our
        open-source RAG engine—deploy in your own VPC or use ours.
      </motion.p>
    </div>
  );
}

function SalesCoachingHeroCTA() {
  return (
    <div className="relative mt-8">
      <motion.div
        className="flex w-full max-w-2xl flex-col items-start justify-start space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8, ease }}
      >
        <Link
          href="/demo"
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "w-full sm:w-auto text-background flex gap-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          )}
        >
          <PlayCircle className="h-5 w-5" />
          Watch 3-Min Demo
        </Link>
        <Link
          href="/onboarding"
          className="w-full sm:w-auto text-foreground hover:text-blue-600 dark:hover:text-blue-400 flex gap-2 items-center font-medium transition-colors underline underline-offset-4"
        >
          <Upload className="h-4 w-4" />
          Generate My Free Brief
        </Link>
      </motion.div>

      {/* Early access section */}
      <motion.div
        className="mt-8 pt-6 border-t border-border/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.8, ease }}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Early Access Program
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            Be among the first agencies to test our AI coaching platform. Join
            our pilot program and help shape the future of sales coaching.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function SalesCoachingHeroVisual() {
  return (
    <motion.div
      className="mt-16 lg:mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.8, ease }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl">
        {/* Before: Messy transcript snippet */}
        <div className="space-y-4">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            BEFORE: Raw Transcript
          </div>
          <div className="rounded-lg bg-muted/30 border p-6 text-sm font-mono overflow-hidden">
            <div className="text-red-600 dark:text-red-400 text-xs font-medium mb-2">
              UNSTRUCTURED • 47 MIN CALL
            </div>
            <pre className="text-foreground whitespace-pre-wrap text-xs leading-relaxed opacity-80">
              {`Speaker 1: So, um, I think what we're looking at is, you know, we've got this process where we're doing a lot of manual work and it's taking forever and, uh...

Speaker 2: Yeah, I mean, the pricing seems steep. Like, how do I know this is going to work for our team? We've tried other solutions before and...

Speaker 1: Right, right. I totally get that. Let me, uh, let me pull up the demo again. Can you see my screen? 

Speaker 2: Hold on, my connection is lagging...`}
            </pre>
            <div className="mt-2 text-xs text-muted-foreground">
              + 1,247 more lines...
            </div>
          </div>
        </div>

        {/* After: Clean brief */}
        <div className="space-y-4">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            AFTER: Coaching Brief
          </div>
          <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 border border-emerald-200 dark:border-emerald-800 p-6 text-sm">
            <div className="text-emerald-600 dark:text-emerald-400 text-xs font-medium mb-3">
              STRUCTURED • READY IN 24 SECONDS
            </div>
            <div className="space-y-3">
              <div className="bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded text-xs">
                <span className="font-medium text-green-800 dark:text-green-300">
                  WINS:
                </span>{" "}
                Technical fit confirmed, urgency established
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded text-xs">
                <span className="font-medium text-yellow-800 dark:text-yellow-300">
                  OBJECTIONS:
                </span>{" "}
                Pricing concerns at 23:15, previous solution failures
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded text-xs">
                <span className="font-medium text-blue-800 dark:text-blue-300">
                  NEXT STEPS:
                </span>{" "}
                Send ROI calculator, schedule technical demo
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded text-xs">
                <span className="font-medium text-purple-800 dark:text-purple-300">
                  COACHING:
                </span>{" "}
                Address price objection earlier, improve demo flow
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function SalesCoachingHero() {
  return (
    <Section id="sales-coaching-hero">
      <div className="relative w-full p-6 lg:p-12 border-x overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-start">
            <SalesCoachingHeroTitles />
            <SalesCoachingHeroCTA />
            <SalesCoachingHeroVisual />
          </div>
        </div>
      </div>
    </Section>
  );
}
