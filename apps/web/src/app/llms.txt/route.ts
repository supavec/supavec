import { NextResponse } from "next/server";

export async function GET() {
  const content = `# https://www.supavec.com/ llms.txt

- [Supavec: RAG API Service](https://www.supavec.com/): Instantly integrate your data with any LLM using Supavec.
- [Simple Pricing Plans](https://www.supavec.com/pricing): Affordable pricing plans for engaging audiences and driving sales.
- [Supavec Blog Updates](https://www.supavec.com/blog): Explore articles and updates from the Supavec team.
- [Terms of Service](https://www.supavec.com/legal/tos): Supavec's Terms of Service outline user responsibilities and rights.
- [Privacy Policy Overview](https://www.supavec.com/legal/privacy-policy): Comprehensive privacy policy detailing data collection and usage.
- [Sales Coaching AI](https://www.supavec.com/examples/sales-coaching): Instant coaching insights from call transcripts using AI.
- [Supavec Login](https://www.supavec.com/login): Easily sign in or create an account on Supavec.
- [Chat with PDF](https://www.supavec.com/examples/chat-with-pdf): Chat with your PDF for instant answers and summaries.
- [Supavec MCP Server Guide](https://www.supavec.com/blog/supavec-mcp-server): Learn how to use Supavec MCP Server for LLMs.
- [Supavec Performance Update](https://www.supavec.com/blog/supavec-performance-update-90000x-faster-queries): Supavec's database optimization boosts query performance by 90,985 times.`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
