# Stripe Integration for Supavec

This directory contains the code for the billing page and Stripe integration. Follow these steps to set up Stripe integration:

## Prerequisites

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard

## Installation

1. Install the Stripe SDK:

```bash
npm install stripe
```

2. Add your Stripe API keys to your environment variables:

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Database Setup

Add the following columns to your `profiles` table:

- `stripe_customer_id` (text): The Stripe customer ID
- `subscription_status` (text): The status of the subscription (e.g., 'active', 'canceled', 'past_due')
- `subscription_id` (text): The Stripe subscription ID
- `subscription_price_id` (text): The Stripe price ID for the subscription
- `subscription_current_period_end` (timestamp): When the current billing period ends

## Implementation Steps

1. Update the `actions.ts` file to use the Stripe SDK
2. Create a webhook handler to process Stripe events
3. Update the billing page to show the correct subscription status
4. Create a checkout page for new subscriptions

## Webhook Setup

Create a webhook endpoint at `/api/webhooks/stripe` to handle Stripe events. Configure your Stripe Dashboard to send webhooks to this endpoint.

## Testing

Use Stripe's test mode and test cards to verify your integration works correctly before going live.

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/customer-portal)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks) 