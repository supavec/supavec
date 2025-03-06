import { Icons } from "@/components/icons";
import {
  BrainIcon,
  Code2,
  CodeIcon,
  GlobeIcon,
  Lock,
  PlugIcon,
  Scale,
  UsersIcon,
  Wrench,
  ZapIcon,
  Linkedin,
} from "lucide-react";

export const BLUR_FADE_DELAY = 0.15;

/**
 * Validates that all required environment variables are set
 * @throws {Error} If any required environment variables are missing
 */
export function validateEnvironmentVariables(): void {
  if (!process.env.NEXT_PUBLIC_STRIPE_PRODUCT_BASIC) {
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_STRIPE_PRODUCT_BASIC"
    );
  }

  if (!process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ENTERPRISE) {
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_STRIPE_PRODUCT_ENTERPRISE"
    );
  }

  if (!process.env.NEXT_PUBLIC_STRIPE_KEY) {
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_STRIPE_KEY"
    );
  }
}

// Validate environment variables on import
validateEnvironmentVariables();

// Stripe product IDs
export const STRIPE_PRODUCT_IDS = {
  BASIC: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_BASIC,
  ENTERPRISE: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ENTERPRISE,
};

// API call limits for different subscription tiers
export const API_CALL_LIMITS = {
  FREE: 100, // Free tier: 100 API calls per month
  BASIC: 750, // Basic tier: 750 API calls per month
  ENTERPRISE: 5000, // Enterprise tier: 5,000 API calls per month
};

// Subscription tier names
export enum SUBSCRIPTION_TIER {
  FREE = "Free",
  BASIC = "Basic",
  ENTERPRISE = "Enterprise",
}

export const siteConfig = {
  name: "Supavec",
  description: "Connect your data to LLMs, no matter the source.",
  cta: "Get Started",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  keywords: ["Rag As A Service", "Tool Integration", "Workflow Automation"],
  links: {
    twitter: "https://x.com/supavec_ai",
    discord: "https://go.supavec.com/discord",
    github: "https://github.com/taishikato/supavec",
  },
  hero: {
    title: "Supavec",
    description:
      "The open-source alternative to Carbon.ai. Build powerful RAG applications with any data source, at any scale.",
    cta: "Get Started",
  },
  whySupavec: [
    {
      name: "Full Control with Open Source",
      description:
        "Choose between our cloud version or self-host on your infrastructure - unlike Carbon.ai, you're never locked in. Fully open source under MIT license, giving you the freedom to adapt and modify.",
      icon: <Code2 className="size-6" />,
    },
    {
      name: "Enterprise-Grade Privacy",
      description:
        "Built with Supabase Row Level Security (RLS), ensuring your data stays private and secure on your infrastructure with granular access control.",
      icon: <Lock className="size-6" />,
    },
    {
      name: "Built to Scale",
      description:
        "Handle millions of documents, process any size, support concurrent processing, and scale horizontally. Built on Supabase, Next.js, and TypeScript.",
      icon: <Scale className="size-6" />,
    },
    {
      name: "Developer-First",
      description:
        "Simple API, comprehensive documentation, easy integration, and quick setup with a modern tech stack.",
      icon: <Wrench className="size-6" />,
    },
  ],
  features: [
    {
      name: "Simple Agent Workflows",
      description:
        "Easily create and manage AI agent workflows with intuitive APIs.",
      icon: <BrainIcon className="h-6 w-6" />,
    },
    {
      name: "Multi-Agent Systems",
      description:
        "Build complex systems with multiple AI agents working together.",
      icon: <UsersIcon className="h-6 w-6" />,
    },
    {
      name: "Tool Integration",
      description:
        "Seamlessly integrate external tools and APIs into your agent workflows.",
      icon: <PlugIcon className="h-6 w-6" />,
    },
    {
      name: "Cross-Language Support",
      description:
        "Available in all major programming languages for maximum flexibility.",
      icon: <GlobeIcon className="h-6 w-6" />,
    },
    {
      name: "Customizable Agents",
      description:
        "Design and customize agents to fit your specific use case and requirements.",
      icon: <CodeIcon className="h-6 w-6" />,
    },
    {
      name: "Efficient Execution",
      description:
        "Optimize agent performance with built-in efficiency and scalability features.",
      icon: <ZapIcon className="h-6 w-6" />,
    },
  ],
  pricing: [
    {
      name: "Free",
      price: { monthly: "$0", yearly: "$0" },
      frequency: { monthly: "month", yearly: "year" },
      priceId: {
        monthly:
          process.env.NEXT_PUBLIC_STRIPE_PRICE_FREE_MONTHLY ||
          "price_free_monthly",
        yearly:
          process.env.NEXT_PUBLIC_STRIPE_PRICE_FREE_YEARLY ||
          "price_free_yearly",
      },
      description: "Try Supavec with limited usage.",
      features: [
        "100 API calls per month",
        "All supported file types",
        "5 requests per minute",
        "Community support",
      ],
      cta: "Get Started",
    },
    {
      name: "Basic",
      price: { monthly: "$19", yearly: "$190" },
      frequency: { monthly: "month", yearly: "year" },
      priceId: {
        monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC_MONTHLY as string,
        yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC_YEARLY as string,
      },
      description: "For developers with regular usage needs.",
      features: [
        "750 API calls per month",
        "All supported file types",
        "15 requests per minute",
        "Email support",
      ],
      popular: true,
      cta: "Get Started",
    },
    {
      name: "Enterprise",
      price: { monthly: "$149", yearly: "$1,490" },
      frequency: { monthly: "month", yearly: "year" },
      priceId: {
        monthly:
          process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY ||
          "price_enterprise_monthly",
        yearly:
          process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_YEARLY ||
          "price_enterprise_yearly",
      },
      description: "For businesses with high-volume needs.",
      features: [
        "5,000 API calls per month",
        "50 requests per minute",
        "Priority processing",
        "Priority email support",
        "Team access with multiple API keys",
        "Dedicated infrastructure",
      ],
      cta: "Get Started",
    },
  ],
  footer: {
    socialLinks: [
      {
        icon: <Icons.github className="size-5" />,
        url: "https://github.com/taishikato/supavec",
      },
      {
        icon: <Icons.twitter className="size-5" />,
        url: "https://x.com/supavec_ai",
      },
      {
        icon: <Icons.discord className="size-5" />,
        url: "https://go.supavec.com/discord",
      },
      {
        icon: <Linkedin className="size-5" />,
        url: "https://go.supavec.com/linkedin",
      },
    ],
    // links: [
    //   { text: "Pricing", url: "#" },
    //   { text: "Contact", url: "#" },
    // ],
    bottomText: "All rights reserved.",
    brandText: "Supavec",
  },
};

export type SiteConfig = typeof siteConfig;
