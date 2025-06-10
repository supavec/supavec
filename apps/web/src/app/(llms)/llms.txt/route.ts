import { NextResponse } from "next/server";

export async function GET() {
  const content = `# Supavec - The open source RAG as a Service platform

> Turn any private data into instant context for the LLM you already use. Open-source, scalable RAG platform built on Supabase with self-host or cloud options.

Supavec is a production-ready RAG (Retrieval-Augmented Generation) API that helps AI agencies, SaaS engineers, and enterprise teams integrate their data with any LLM. Upload calls, docs, or tickets in minutes and retrieve laser-accurate context at query time.

## Getting Started
- [Supavec Home](https://www.supavec.com/): RAG API Service for instant LLM data integration
- [Login & Sign Up](https://www.supavec.com/login): Access your Supavec dashboard
- [Pricing Plans](https://www.supavec.com/pricing): Affordable pay-as-you-grow pricing

## Use Cases & Examples
- [Sales Call Intelligence](https://www.supavec.com/examples/sales-coaching): AI coaching insights from call transcripts with timestamped clips
- [Chat with PDF](https://www.supavec.com/examples/chat-with-pdf): Interactive PDF conversations for instant answers and summaries

## Technical Resources
- [Supavec MCP Server Guide](https://www.supavec.com/blog/supavec-mcp-server): Connect Supavec with LLMs using Model Context Protocol
- [Performance Update](https://www.supavec.com/blog/supavec-performance-update-90000x-faster-queries): Database optimization achieving 90,985x faster queries
- [Blog & Updates](https://www.supavec.com/blog): Latest articles and product updates

## Legal & Support
- [Terms of Service](https://www.supavec.com/legal/tos): User responsibilities and rights
- [Privacy Policy](https://www.supavec.com/legal/privacy-policy): Data collection and usage details`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
