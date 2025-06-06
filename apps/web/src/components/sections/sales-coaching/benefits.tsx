"use client";

import { Section } from "@/components/section";
import { motion } from "framer-motion";
import {
  Building2,
  Users,
  Target,
  TrendingUp,
  Clock,
  MessageSquare,
} from "lucide-react";

const ease = [0.16, 1, 0.3, 1];

const benefits = [
  {
    role: "Agency Owners",
    icon: <Building2 className="h-8 w-8" />,
    outcome: "15% faster pipeline reviews",
    description:
      "Get instant visibility into deal health across your entire sales organization",
    proofPoint:
      "Based on pilot program with 3 agencies managing 500+ monthly calls",
    color: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    textColor: "text-blue-800 dark:text-blue-300",
  },
  {
    role: "Sales Managers",
    icon: <Users className="h-8 w-8" />,
    outcome: "3× more coaching touchpoints/week",
    description:
      "Scale your coaching impact without scaling your time investment",
    proofPoint: "Average manager coaches 12 reps vs 4 reps with manual review",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    textColor: "text-emerald-800 dark:text-emerald-300",
  },
  {
    role: "Sales Reps",
    icon: <Target className="h-8 w-8" />,
    outcome: "Clear next-step checklist post-call",
    description:
      "Never leave a call wondering what to do next or how to improve",
    proofPoint:
      "Interactive demo shows export to CRM and task management tools",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    textColor: "text-purple-800 dark:text-purple-300",
  },
];

const metrics = [
  {
    number: "24s",
    label: "Average processing time",
    icon: <Clock className="h-6 w-6" />,
  },
  {
    number: "95%",
    label: "Objection detection accuracy",
    icon: <MessageSquare className="h-6 w-6" />,
  },
  {
    number: "3x",
    label: "More coaching conversations",
    icon: <TrendingUp className="h-6 w-6" />,
  },
];

export function SalesCoachingBenefits() {
  return (
    <Section
      id="benefits"
      title="Outcome-Focused Benefits"
      subtitle="Concrete Results For Every Role"
      description="Real improvements you can measure and track"
      align="center"
    >
      <div className="relative px-6 pb-6 lg:px-12 lg:pb-12 border-x">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Benefits Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease }}
                viewport={{ once: true }}
                className={`p-6 rounded-xl ${benefit.bgColor} border ${benefit.borderColor}`}
              >
                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-lg bg-gradient-to-r ${benefit.color} flex items-center justify-center text-white mb-4`}
                >
                  {benefit.icon}
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      {benefit.role}
                    </h3>
                    <div
                      className={`text-2xl font-bold ${benefit.textColor} mb-2`}
                    >
                      {benefit.outcome}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>

                  <div className="pt-2 border-t border-current/10">
                    <p className="text-xs text-muted-foreground/80 italic">
                      {benefit.proofPoint}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Metrics Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl p-8 border"
          >
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-foreground mb-2">
                Performance Metrics
              </h3>
              <p className="text-muted-foreground">
                Concrete results you can measure
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {metrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1, ease }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white mb-3">
                    {metric.icon}
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">
                    {metric.number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {metric.label}
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
