import { NextResponse } from "next/server";

export async function GET() {
  const content = `# https://www.supavec.com/ llms-full.txt

## Supavec: RAG API Service
[![Supavec - The open source RAG as a service platform | Product Hunt](https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=871672&theme=neutral&period=daily&t=1739785669388)](https://www.producthunt.com/posts/supavec?embed=true&utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-supavec)

# Bring Your Own Data to Any LLM—Instant RAG API

Ingest calls, docs, or tickets in minutes and retrieve laser-accurate context at query time. Open-source, scalable, and ready for production.

[Get Started](https://www.supavec.com/login)

GET STARTED IN SECONDS

\`\`\`
curl -X POST https://api.supavec.com/upload_text \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"contents": "your text here"}'
\`\`\`

## Use Cases

### Sales Call Insights

Drop your meeting transcripts; ask "Where did pricing objections spike?" and get timestamped clips plus summarised answers you can paste into CRM.

### Support Knowledge Copilot

Connect Zendesk, Notion, or Confluence. Agents type a question and receive citations from the latest docs—no more tab-switching.

### Internal Policy Q&A

Keep legal or HR PDFs on-prem. Employees query through Slack, results reference exact clauses—no risk of leaking data.

### Developer Docs Search

Sync your docs repo hourly. Ship an AI search bar that returns code snippets and links in under 300 ms.

[Try Supavec for free](https://www.supavec.com/login)

## How to use Supavec

### Step 1: Create your workspace

Get started in seconds with our intuitive setup. Sign up for free and create your first workspace. No credit card required, no complex configuration needed. Free forever plan available.

### Step 2: Generate your API key

Secure access to enterprise-grade vector infrastructure. Generate your unique API key with one click. Built with security-first architecture and automatic key rotation. Enterprise-grade security.

### Step 3: Start embedding

From zero to semantic search in minutes. Send your first documents via our REST API or SDKs. Watch as your data transforms into intelligent, searchable vectors. Sub-100ms response times.

Ready to transform your search experience?

Start for free | View documentation

## Statistics

- Stars on GitHub: https://github.com/taishikato/supavec
- Embeddings generated: Available via login
- Discord Members: https://go.supavec.com/discord

## Pricing

Simple pricing for every developer. Choose a plan that fits your API usage needs, from experimenting to building production-ready applications with Supavec's powerful vector embedding capabilities.

### Free Plan
$0/year
- 100 API calls per month
- All supported file types
- 5 requests per minute
- Community support

### Basic Plan (Most Popular)
$190/year ($15.83/month when billed yearly)
- 750 API calls per month
- All supported file types
- 15 requests per minute
- Email support

### Enterprise Plan
$1,490/year ($124.17/month when billed yearly)
- 5,000 API calls per month
- 50 requests per minute
- Priority processing
- Priority email support
- Team access with multiple API keys
- Dedicated infrastructure

100% refund within 14 days if you don't love it. No questions asked.

## Community

We're grateful for the amazing open-source community that helps make our project better every day. Contributors include Neco, Marie Otaki, Blair Bodnar, Magio, and Taishi kato.

[Become a contributor](https://github.com/taishikato/supavec)

## Frequently Asked Questions

### How does the 14-day refund policy work?
If you're not satisfied with our service for any reason, simply contact our support team within 14 days of your purchase for a full refund. No questions asked.

### Can I switch between plans?
Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be prorated for the remainder of your billing cycle. When downgrading, changes will take effect at the start of your next billing cycle.

### Do you offer team discounts?
Yes, we offer special pricing for teams of 5 or more. Contact our sales team for more information about team discounts and enterprise plans.

### What payment methods do you accept?
We accept all major credit cards, PayPal, and bank transfers for annual plans. All payments are securely processed and your information is never stored on our servers.

## Sales Coaching AI Example

Upload a call transcript or paste a Fireflies URL to get instant coaching insights powered by Supavec RAG. This is a demonstration of the Supavec + LLM workflow. In production, this would connect to the Fireflies API, embed transcript chunks via Supavec's /embed endpoint, and query for insights using the /query endpoint with customizable coaching prompts.

## Chat with PDF Example

Upload a PDF document to chat with it and get instant answers powered by Supavec RAG. This is a demonstration of the Supavec + LLM workflow. In production, this would connect to your document storage, embed document chunks via Supavec's /embed endpoint, and query for relevant information using the /query endpoint with customizable chat prompts.

## Blog Posts

### Supavec Performance Update: 90,000x Faster Queries
March 20, 2025 • Taishi

We recently made a significant database optimization to Supavec that has dramatically improved query performance. What started as an investigation into slow API responses ended with a solution that made our document retrieval 90,985 times faster.

#### Identifying the Problem
As more users joined Supavec and started uploading documents, we noticed our API response times gradually degrading. The culprit was filtering documents using metadata(jsonb)->>file_id patterns, forcing PostgreSQL to perform full sequential scans.

#### Our Solution
We implemented a two-part solution:

1. **Schema Improvement**: Added a dedicated file_id column instead of storing this identifier in a JSON metadata field
2. **Strategic Indexing**: Added a partial index focusing on active documents

#### The Results
- Before: 10,008.379 ms execution time
- After: 0.110 ms execution time
- **90,985x speed improvement**

This means significantly faster API response times, better handling of concurrent requests, and improved scalability as document collections grow.

### Introducing Supavec MCP Server: Fetch relevant content from Supavec in LLMs
March 5, 2025 • Taishi

Supavec MCP Server is a new way to fetch relevant content from Supavec in LLMs using Model Context Protocol (MCP). MCP is a protocol that connects AI to external data sources like Google Drive and websites.

#### What is MCP?
Model Context Protocol (MCP) is a universal plug that connects AI to third-party data and tools, solving the problem of AI being isolated from real data.

#### How to use Supavec MCP Server:
1. Download the MCP server from GitHub
2. Build with npm i && npm run build
3. Get your Supavec API key
4. Add the MCP Server to Claude Desktop configuration
5. Use it to fetch relevant content from your Supavec data

## Terms of Service

### 1. Introduction
Welcome to Supavec. These Terms of Service govern your access to and use of the Supavec platform, website, APIs, and services. By accessing or using the Service, you agree to be bound by these Terms.

### 2. Definitions
- "Supavec", "we", "us", or "our" refers to Supavec, the provider of the Service
- "You" or "your" refers to the individual or entity using the Service
- "Content" refers to any data, text, files, information, or materials you upload, process, or store
- "RAG" refers to Retrieval-Augmented Generation, the AI technology used in our Service

### 3. Account Registration
To use certain features, you must register for an account. You agree to provide accurate, current, and complete information and maintain account security. The Service is not intended for individuals under 18.

### 4. Service Description
Supavec is an open-source RAG platform that helps developers integrate AI with their data. Users can upload documents via API and query them using natural language. Our core technology is available as open source under the MIT license, with a cloud-hosted version offering additional features.

### 5. Pricing and Payment
We offer a free tier with limited features and paid subscription plans with additional features. All payments are non-refundable except as expressly set forth in these Terms.

### 6. Your Content
You retain all rights to your Content. By uploading Content, you grant Supavec a license to use, copy, store, transmit, and process your Content solely to provide the Service. Content must not infringe on others' rights, violate laws, contain harmful code, or be otherwise objectionable.

### 7. Intellectual Property Rights
The Service and its original content are owned by Supavec and protected by international intellectual property laws. Portions of our software are available under the MIT license.

### 8. Acceptable Use
Use the Service only for lawful purposes. Do not use it to harm others, interfere with the Service, gain unauthorized access, or develop competing products.

### 9. Third-Party Services
The Service may integrate with third-party services governed by their own terms and privacy policies.

### 10. Disclaimer of Warranties
THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND.

### 11. Limitation of Liability
IN NO EVENT SHALL SUPAVEC BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.

### 12. Indemnification
You agree to defend and indemnify Supavec from claims arising from your violation of these Terms or use of the Service.

### 13. Term and Termination
These Terms remain in effect while you use the Service. Either party may terminate the agreement, with surviving provisions continuing after termination.

### 14-18. Additional Provisions
The Terms may be modified with notice. They're governed by Delaware law, with disputes resolved through binding arbitration. No class actions are permitted.

Contact us at hello@supavec.com or https://go.supavec.com/discord for questions.

## Privacy Policy

### Introduction
We are committed to protecting your privacy and handling your data with transparency. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.

### Information We Collect
- **Personal Information**: Name, email, job title, company, account credentials, payment information
- **Usage Data**: IP address, browser type, device type, pages visited, time spent
- **File Data**: Content of uploaded files, generated embeddings, file metadata

### How We Use Your Information
- Provide, maintain, and improve our Service
- Process transactions and handle payments
- Provide customer support
- Send administrative and marketing communications
- Monitor usage and analyze trends
- Protect against malicious activity

### Data Retention
We store information for as long as your account is active or as needed to provide the Service. You can request deletion at any time.

### Data Security
We implement appropriate technical and organizational measures to protect your information, though no method is 100% secure.

### Sharing Your Information
We may share information with:
- Service providers who work on our behalf
- In business transfers
- For legal requirements
- With your consent

### Data Processing Subprocessors
- Supabase: Database hosting and storage
- Upstash: Rate limiting and queue management
- OpenAI: Generating embeddings and AI responses
- PostHog: Analytics
- Loops: Customer engagement and email
- Stripe: Payment processing

### Your Rights
Depending on your location, you may have rights to access, correct, delete, restrict processing, or port your data. Contact us at hello@supavec.com to exercise these rights.

### Additional Information
- Not intended for children under 18
- Information may be transferred internationally
- California residents have specific rights under CCPA
- We may update this policy with notice

Contact us at hello@supavec.com or https://go.supavec.com/discord for questions about privacy.

## Contact Information

- Email: hello@supavec.com
- Discord: https://go.supavec.com/discord
- GitHub: https://github.com/taishikato/supavec
- Website: https://www.supavec.com

Supavec is the open-source alternative to Carbon AI, built with Supabase, Bun, Next.js, Vercel, Railway, and TypeScript. We make it easy to connect your data to AI through our open-source RAG platform.`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
