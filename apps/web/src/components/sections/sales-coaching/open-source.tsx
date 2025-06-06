"use client";

import { Section } from "@/components/section";
import { motion } from "framer-motion";
import { Shield, Code, Server, Lock, Eye, GitBranch } from "lucide-react";

const ease = [0.16, 1, 0.3, 1];

const features = [
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Self-Host Option",
    description:
      "Deploy Supavec in your own VPC—client data never leaves your infrastructure",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: <Eye className="h-8 w-8" />,
    title: "Full Auditability",
    description:
      "MIT-licensed code means complete transparency—audit every line yourself",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: <Lock className="h-8 w-8" />,
    title: "No Vendor Lock-in",
    description:
      "Own your coaching data and infrastructure. Switch or customize anytime",
    color: "from-purple-500 to-pink-500",
  },
];

const complianceFeatures = [
  {
    badge: "GDPR-Ready",
    description: "Built-in data protection controls",
  },
  {
    badge: "SOC-2 Roadmap",
    description: "Enterprise security compliance in development",
  },
  {
    badge: "HIPAA-Compatible",
    description: "Healthcare-grade privacy when self-hosted",
  },
];

export function SalesCoachingOpenSource() {
  return (
    <Section
      id="open-source"
      title="Open-Source & Privacy Edge"
      subtitle="Your Data, Your Control"
      description="Enterprise-grade security with open-source transparency"
      align="center"
    >
      <div className="relative p-6 lg:p-12 border-x">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Main Value Prop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            viewport={{ once: true }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-full text-sm font-medium">
              <GitBranch className="h-4 w-4" />
              MIT Licensed & Open Source
            </div>

            <blockquote className="text-2xl font-medium text-foreground max-w-4xl mx-auto">
              Supavec is MIT-licensed and can run in your own VPC—so client data
              never leaves your walls.
            </blockquote>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease }}
                viewport={{ once: true }}
                className="text-center space-y-4"
              >
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mx-auto`}
                >
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold text-foreground">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Deployment Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900/50 dark:to-blue-950/20 rounded-xl p-8 border"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Deployment Options
              </h3>
              <p className="text-muted-foreground">
                Choose the hosting model that fits your security requirements
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 bg-white/70 dark:bg-gray-900/70 rounded-lg border">
                <div className="flex items-center gap-3 mb-4">
                  <Server className="h-6 w-6 text-blue-500" />
                  <h4 className="text-lg font-semibold text-foreground">
                    Cloud Hosted
                  </h4>
                </div>
                <p className="text-muted-foreground mb-4">
                  Get started instantly with our managed cloud infrastructure
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Zero setup required</li>
                  <li>• Automatic updates & scaling</li>
                  <li>• 99.9% uptime SLA</li>
                  <li>• SOC-2 Type II (roadmap)</li>
                </ul>
              </div>

              <div className="p-6 bg-white/70 dark:bg-gray-900/70 rounded-lg border">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-emerald-500" />
                  <h4 className="text-lg font-semibold text-foreground">
                    Self-Hosted
                  </h4>
                </div>
                <p className="text-muted-foreground mb-4">
                  Deploy in your own infrastructure for maximum control
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Complete data sovereignty</li>
                  <li>• Custom security controls</li>
                  <li>• Air-gapped deployments</li>
                  <li>• White-label options</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Compliance Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease }}
            viewport={{ once: true }}
            className="text-center space-y-6"
          >
            <h3 className="text-xl font-bold text-foreground">
              Compliance & Security
            </h3>

            <div className="flex flex-wrap justify-center gap-4">
              {complianceFeatures.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1, ease }}
                  viewport={{ once: true }}
                  className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-800"
                >
                  <div className="font-semibold text-sm">{item.badge}</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">
                    {item.description}
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Pre-empt compliance objections with built-in privacy controls and
              transparent security practices
            </p>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
