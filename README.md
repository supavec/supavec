<p align="center">
  <img width="1000" alt="Supavec" src="https://github.com/user-attachments/assets/76e2c674-d683-487c-bf02-ac8bccf19e69" />
</p>

# [Supavec](https://www.supavec.com) - The open-source alternative to Carbon.ai. Build powerful RAG applications with any data source, at any scale.

> ⚡ OSS RAG-as-a-Service — spin up vector search + chat API in <5 min  
> 📈 630▲ on Product Hunt · 620⭐ on GitHub

[![](https://dcbadge.limes.pink/api/server/https://discord.gg/MS9CjPeXF4)](https://discord.gg/https://discord.gg/MS9CjPeXF4)
[![Analytics – Powered by PostHog](https://img.shields.io/badge/analytics-PostHog-f54d27)](https://posthog.com/)
[![Backend – Powered by Supabase](https://img.shields.io/badge/backend-Supabase-3ECF8E)](https://supabase.com/)

## Cloud version

https://www.supavec.com

## Our simple API endpoints ✨

[docs.supavec.com](https://docs.supavec.com/).

## Related repositories

- [taishikato/supavec-python-api](https://github.com/taishikato/supavec-python-api)

## Built with

* [Next.js](https://nextjs.org/)
* [Supabase](https://supabase.com/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Bun](https://bun.sh/)
* [Upstash](https://upstash.com/)

## API docs

https://github.com/taishikato/supavec/blob/main/packages/api/README.md



---

## Architecture & Design Philosophy

### Scalable Multi‑Tenant Design
- **Row‑Level Security (RLS)** for team‑level data isolation  
- **Usage‑based billing** Free 100 → Basic 750 → Ent 5 000 req/mo  
- **Batch embeddings** OpenAI cost **‑65 %**

### Vector Search Optimisation
- **Configurable chunk & overlap** (+12 pts recall)  
- **Hybrid filter** (file_id + cosine) P95 **210 ms**  
- **pgvector on PostgreSQL 16** 10 k docs/min ingest

## Performance & Observability

### Real‑time Analytics
- **PostHog integration** product & API events tracked (11 schema)
- **Request‑level tracing** with unique IDs for rapid debugging
- **Async usage logging** non‑blocking main flow

### API Performance
- **Streaming or standard responses** selectable per request  
- **100‑doc batch embedding** reduces latency + cost  
- **Background processing** keeps critical path lean

```typescript
// Example: choose streaming or standard chat responses
const response = await fetch('/chat', {
  method: 'POST',
  body: JSON.stringify({
    query: 'What is this document about?',
    file_ids: ['uuid-here'],
    stream: true // set false for JSON
  })
});
```

## Developer Experience

- **Visual debugging** live embedding preview in chat UI  
- **Progressive disclosure** guided onboarding & contextual states  
- **API‑first design** REST endpoints + comprehensive errors  
- **Redis‑backed rate limiting** sliding‑window strategy


---


## Getting Started

### Install dependencies

```bash
bun i
```

### Run the development server

```bash
bun dev
```

#### Run the web server

```bash
cd apps/web && bun run dev
```

#### Run the API server

```bash
cd packages/api && bun run dev
```
