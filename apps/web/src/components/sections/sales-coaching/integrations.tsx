"use client";

import { Section } from "@/components/section";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const ease = [0.16, 1, 0.3, 1];

const integrations = [
  {
    name: "Zoom",
    logo: "🎥",
    status: "Available",
    description: "Direct transcript import from Zoom cloud recordings",
  },
  {
    name: "Fireflies",
    logo: "🔥",
    status: "Available",
    description: "API integration for automatic transcript sync",
  },
  {
    name: "Gong",
    logo: "📊",
    status: "Roadmap",
    description: "Revenue intelligence platform integration",
  },
  {
    name: "HubSpot",
    logo: "🧡",
    status: "Available",
    description: "CRM integration for coaching insights",
  },
  {
    name: "Salesforce",
    logo: "☁️",
    status: "Available",
    description: "Activity logging and opportunity updates",
  },
  {
    name: "Microsoft Teams",
    logo: "💬",
    status: "Roadmap",
    description: "Meeting transcript integration",
  },
];

export function SalesCoachingIntegrations() {
  return (
    <Section
      id="integrations"
      title="Integrations & Workflow Fit"
      subtitle="Slots Into Your Existing Tooling"
      description="No platform migration required, work with the tools you already use"
      align="center"
    >
      <div className="relative px-6 pb-6 lg:px-12 lg:pb-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Integrations Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {integrations.map((integration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="p-6 rounded-xl bg-background border border-border/50 hover:border-border transition-colors duration-200 text-center space-y-3">
                  {/* Logo */}
                  <div className="text-4xl mb-2">{integration.logo}</div>

                  {/* Name */}
                  <h3 className="font-semibold text-foreground">
                    {integration.name}
                  </h3>

                  {/* Status Badge */}
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      integration.status === "Available"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                    }`}
                  >
                    {integration.status === "Roadmap"
                      ? "Coming Soon"
                      : integration.status}
                  </div>
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  {integration.description}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Workflow Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800"
          >
            <div className="text-center space-y-6">
              <h3 className="text-2xl font-bold text-foreground">
                Your Workflow, Enhanced
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mx-auto">
                    1
                  </div>
                  <h4 className="font-semibold text-foreground">Connect</h4>
                  <p className="text-muted-foreground">
                    Link your existing meeting and CRM tools
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mx-auto">
                    2
                  </div>
                  <h4 className="font-semibold text-foreground">Analyze</h4>
                  <p className="text-muted-foreground">
                    Automatic processing of every sales call
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold mx-auto">
                    3
                  </div>
                  <h4 className="font-semibold text-foreground">Scale</h4>
                  <p className="text-muted-foreground">
                    Coaching insights flow back to your CRM
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-lg font-medium text-blue-800 dark:text-blue-300">
                  Supavec slots into the tooling you already use—no platform
                  migration required.
                </p>
              </div>
            </div>
          </motion.div>

          {/* API Access */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease }}
            viewport={{ once: true }}
            className="text-center space-y-4"
          >
            <h4 className="text-lg font-semibold text-foreground">
              Need a custom integration?
            </h4>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our REST API makes it easy to connect any platform. Plus, as an
              open-source solution, you can build custom integrations that fit
              your exact workflow.
            </p>
            <div className="flex justify-center">
              <a
                href="/docs/api"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                View API Documentation
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
