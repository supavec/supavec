# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

Supavec is a multi-tenant RAG-as-a-Service platform built with:

- **Frontend**: Next.js 15 app in `apps/web/` with TypeScript, Tailwind CSS, and Radix UI
- **API**: Express.js server in `packages/api/` with vector search, semantic caching, and file processing
- **Database**: Supabase (PostgreSQL) with row-level security for multi-tenant isolation
- **Caching**: L1 (Redis) + L2 (PostgreSQL) semantic cache for 70-90% cost reduction
- **Runtime**: Bun for package management and development

## Key Systems

### Vector Search & Semantic Cache
- **L1 Cache**: Redis for exact query matches (~1-5ms)
- **L2 Cache**: PostgreSQL for semantic similarity matching (~10-20ms)
- **Standard Search**: ~2-10 seconds without cache
- Configurable semantic threshold (default: 0.95)

### Multi-tenant Architecture
- Row-level security (RLS) enforced at database level
- Team-based data isolation
- Usage-based billing with API rate limiting

### Performance Optimizations
- Batch embeddings processing (100-doc batches)
- Async usage logging for non-blocking operations
- HNSW vector indexes for fast similarity search
- Streaming and standard chat response modes

## Development Commands

### Root Level
```bash
bun i                    # Install all dependencies
bun dev                  # Start all services with Turbo
bun build                # Build all packages
bun build:api            # Build API package only
bun lint                 # Lint all packages
bun format               # Format code with Prettier
```

### Web App (`apps/web/`)
```bash
cd apps/web
bun run dev              # Start Next.js dev server with Turbopack
bun run build            # Build for production
bun run start            # Start production server
bun run lint             # Run Next.js linting
bun run generate         # Generate Supabase types from local DB
bun run g                # Alias for generate
bun run genType          # Generate types from remote Supabase project
```

### API Server (`packages/api/`)
```bash
cd packages/api
bun run dev              # Start API server with watch mode
bun run build            # Build API server
bun run start            # Start built API server
bun run lint             # Lint API code
bun run test:cache       # Test semantic cache functionality
```

## Environment Setup

### API Server (`packages/api/.env`)
```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# Semantic Cache
ENABLE_SEMANTIC_CACHE=true
CACHE_L1_TTL=3600
CACHE_L2_TTL=86400
CACHE_SEMANTIC_THRESHOLD=0.95
```

## Key API Endpoints

- `POST /search` - Vector similarity search with semantic caching
- `POST /upload_file` - Upload and process PDF/text files
- `POST /chat` - Chat with documents (streaming/standard modes)
- `GET /cache_stats` - Cache performance statistics
- `POST /upload_text` - Upload text directly for processing
- `DELETE /delete_file` - Remove files and associated vectors

## Testing

- Use `bun run test:cache` to test semantic cache functionality
- API endpoints documented at `packages/api/README.md`
- Supabase migrations in `supabase/migrations/`

## Database Operations

### Type Generation
- Local: `bun run generate` (from `apps/web/`)
- Remote: `bun run genType` (requires NEXT_PUBLIC_SUPABASE_PROJECT_ID)

### Migrations
- Create: `bun run migration:diff -f migration_name`
- Deploy: `bun run deploy`

## Package Structure

- `apps/web/` - Next.js frontend application
- `packages/api/` - Express.js API server
- `packages/common/` - Shared utilities and types
- `supabase/` - Database schema, migrations, and Edge Functions

## Performance Monitoring

- PostHog integration for product and API event tracking
- Request-level tracing with unique IDs
- Cache statistics endpoint for monitoring hit rates
- Async usage logging for billing and analytics