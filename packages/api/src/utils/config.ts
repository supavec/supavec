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
  FREE = "FREE",
  BASIC = "BASIC",
  ENTERPRISE = "ENTERPRISE",
}

/**
 * Validates that all required environment variables are set
 * @throws {Error} If any required environment variables are missing
 */
export function validateEnvironmentVariables(): void {
  const requiredVariables = [
    "NEXT_PUBLIC_STRIPE_PRODUCT_BASIC",
    "NEXT_PUBLIC_STRIPE_PRODUCT_ENTERPRISE",
  ];

  const missingVariables = requiredVariables.filter(
    (variable) => !process.env[variable],
  );

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVariables.join(", ")}`,
    );
  }
}

validateEnvironmentVariables();
