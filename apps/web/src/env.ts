import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    DEMO_SUPA_API_KEY: z.string().min(1),
    LOOPS_API_KEY: z.string().min(1),
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_SIGNATURE_SECRET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    NEXT_PUBLIC_GOOGLE_ANALYTICS: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    // Stripe
    NEXT_PUBLIC_STRIPE_KEY: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PRICE_BASIC_MONTHLY: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PRICE_BASIC_YEARLY: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_YEARLY: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PRODUCT_BASIC: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PRODUCT_ENTERPRISE: z.string().min(1),
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_GOOGLE_ANALYTICS: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_STRIPE_KEY: process.env.NEXT_PUBLIC_STRIPE_KEY,
    NEXT_PUBLIC_STRIPE_PRICE_BASIC_MONTHLY:
      process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC_MONTHLY,
    NEXT_PUBLIC_STRIPE_PRICE_BASIC_YEARLY:
      process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC_YEARLY,
    NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY:
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY,
    NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_YEARLY:
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_YEARLY,
    NEXT_PUBLIC_STRIPE_PRODUCT_BASIC:
      process.env.NEXT_PUBLIC_STRIPE_PRODUCT_BASIC,
    NEXT_PUBLIC_STRIPE_PRODUCT_ENTERPRISE:
      process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ENTERPRISE,
  },
});
