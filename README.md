# Sociolume - SaaS Monorepo

## Overview

Sociolume is a modern SaaS platform built with TurboRepo monorepo architecture. This monorepo contains:

- **apps/web** - Public marketing site + customer dashboard (Next.js)
- **apps/admin** - Admin portal (Next.js)
- **apps/api** - Fastify backend gateway
- **services/ai** - FastAPI AI service scaffold
- **packages/** - Shared packages (ui, config, types, utils, auth, db, cms, crm, realtime)

## Tech Stack

- **Package Manager**: pnpm
- **Build Tool**: TurboRepo
- **Web Framework**: Next.js 14
- **UI**: Tailwind CSS + daisyUI
- **Database**: Supabase (Mumbai region)
- **Auth**: Clerk
- **CMS**: WordPress (headless)
- **CRM**: HubSpot
- **Backend**: Node.js + Fastify
- **AI**: Python + FastAPI
- **Testing**: Vitest + Playwright

## Prerequisites

- Node.js 20+
- pnpm 8+
- Docker (optional, for local Supabase)

## Quick Start

```bash
# Install dependencies
pnpm install

# Run development (all apps)
pnpm dev

# Run specific app
pnpm --filter web dev

# Build all apps
pnpm build

# Run tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Lint and typecheck
pnpm check
```

## Environment Setup

1. Copy `.env.example` to `.env.local`
2. Fill in your API keys and secrets
3. For local development, you can use mock values for some services

## Project Structure

```
apps/
  web/          - Public marketing + customer app
  admin/        - Admin portal
  api/          - Fastify API gateway
services/
  ai/           - FastAPI AI service
packages/
  config/       - Shared lint/ts/prettier configs
  types/        - Shared TypeScript types
  utils/        - Shared utilities
  ui/           - Shared UI components
  auth/         - Clerk authentication helpers
  db/           - Supabase client + helpers
  cms/          - WordPress headless CMS client
  crm/          - HubSpot CRM client
  realtime/     - Supabase realtime helpers
```

## Documentation

- [Architecture](docs/architecture.md)
- [Roadmap](docs/roadmap.md)
- [Runbook](docs/runbook.md)

## Contributing

1. Create a feature branch
2. Make your changes
3. Run `pnpm check` to validate
4. Submit a pull request

## License

Proprietary - All rights reserved
