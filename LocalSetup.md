# Local Setup Guide

This guide will help you set up Supavec locally for development.

## Prerequisites

- [Bun](https://bun.sh/) (version 1.0.30 or higher)
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Docker](https://www.docker.com/) (for running Supabase locally)

## Initial Setup

1. Clone the repository

```bash
git clone https://github.com/taishikato/supavec.git
cd supavec
```

2. Install dependencies

```bash
bun install
```

3. Set up environment variables

For the web app (`apps/web`):

- Copy `.env.sample` to `.env.local`

```bash
cp apps/web/.env.sample apps/web/.env.local
```

For the API (`packages/api`):

- Copy `.env.sample` to `.env`

```bash
cp packages/api/.env.sample packages/api/.env
```

4. Configure environment variables:

Web app environment variables (`apps/web/.env.local`):

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `NEXT_PUBLIC_SUPABASE_PROJECT_ID`: Your Supabase project ID
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `NEXT_PUBLIC_API_URL`: Local API URL (default: http://localhost:3001)

API environment variables (`packages/api/.env`):

- `OPENAI_API_KEY`: Your OpenAI API key
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `UPSTASH_REDIS_REST_URL`: Your Upstash Redis REST URL
- `UPSTASH_REDIS_REST_TOKEN`: Your Upstash Redis REST token
- `POSTHOG_API_KEY`: Your PostHog API key (optional)
- `POSTHOG_HOST`: Your PostHog host URL (optional)

## Running the Development Environment

1. Start the Supabase local development environment:

```bash
cd supabase
supabase start
```

2. Start the development servers:

In one terminal, start the API server:

```bash
cd packages/api
bun run dev
```

In another terminal, start the web server:

```bash
cd apps/web
bun run dev
```

The application should now be running at:

- Web: http://localhost:3000
- API: http://localhost:3001

## Development Workflow

1. Create a new branch for your feature/fix:

```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit them:

```bash
git add .
git commit -m "feat: your feature description"
```

3. Push your changes and create a pull request:

```bash
git push origin feature/your-feature-name
```

## Available Scripts

From the root directory:

- `bun run dev`: Start all development servers
- `bun run build`: Build all packages
- `bun run build:api`: Build only the API package
- `bun run lint`: Run linting
- `bun run format`: Format code using Prettier

## Troubleshooting

1. If you encounter dependency issues:

```bash
bun install --force
```

2. If the development server isn't working:

- Check if all environment variables are properly set
- Ensure Supabase is running locally
- Verify that ports 3000 and 3001 are available

## Need Help?

If you need help or have questions:

1. Check the existing [issues](https://github.com/taishikato/supavec/issues)
2. Create a new issue if your problem hasn't been addressed

## Contributing

1. Ensure your code follows the project's coding standards
2. Add tests for new features when applicable
3. Update documentation as needed
4. Follow the conventional commits specification for commit messages
