# Sociolume Architecture

## Overview

Sociolume is a SaaS platform built with a monorepo architecture using TurboRepo. The system is designed for scalability, modularity, and maintainability.

## Technology Stack

| Layer           | Technology             | Purpose               |
| --------------- | ---------------------- | --------------------- |
| Package Manager | pnpm 8+                | Dependency management |
| Build Tool      | TurboRepo 2.x          | Build orchestration   |
| Web Framework   | Next.js 14             | React SSR/SSG         |
| UI Framework    | Tailwind CSS + daisyUI | Styling               |
| Database        | Supabase               | PostgreSQL + Realtime |
| Auth            | Clerk                  | Authentication        |
| CMS             | WordPress (headless)   | Content management    |
| CRM             | HubSpot                | Customer management   |
| Backend API     | Fastify                | Node.js API gateway   |
| AI Service      | FastAPI                | Python ML/AI services |
| Testing         | Vitest + Playwright    | Unit + E2E tests      |

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                              │
├─────────────────┬─────────────────┬────────────────────────────┤
│   Public Web    │  Customer App   │      Admin Portal          │
│   (Marketing)   │   (Dashboard)   │      (Admin)               │
└────────┬────────┴────────┬────────┴────────────┬─────────────┘
         │                  │                      │
         ▼                  ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway (Fastify)                       │
│  /api/v1/* - Auth, Users, Subscriptions, Analytics, etc.       │
└─────────────────────────────┬───────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Supabase   │    │    HubSpot   │    │  WordPress   │
│  (Database)  │    │     (CRM)    │    │    (CMS)     │
└──────────────┘    └──────────────┘    └──────────────┘
         │
         ▼
┌──────────────┐
│     AI       │
│   Service    │
│  (FastAPI)   │
└──────────────┘
```

## Project Structure

```
sociolume/
├── apps/
│   ├── web/              # Public marketing + customer app
│   │   ├── src/
│   │   │   ├── app/     # Next.js App Router
│   │   │   │   ├── (marketing)/    # Marketing pages
│   │   │   │   ├── (auth)/          # Auth pages
│   │   │   │   ├── (dashboard)/     # Protected dashboard
│   │   │   │   └── api/             # API routes
│   │   │   ├── components/
│   │   │   │   ├── marketing/       # Marketing components
│   │   │   │   ├── dashboard/      # Dashboard components
│   │   │   │   └── ui/              # Shared UI components
│   │   │   └── lib/                 # Utilities
│   │   └── package.json
│   │
│   ├── admin/            # Admin portal
│   │   ├── src/
│   │   │   ├── app/     # Next.js App Router
│   │   │   ├── components/
│   │   │   └── lib/
│   │   └── package.json
│   │
│   └── api/             # Fastify API gateway
│       ├── src/
│       │   ├── routes/
│       │   ├── services/
│       │   └── plugins/
│       └── package.json
│
├── services/
│   └── ai/              # FastAPI AI service
│       ├── app/
│       │   ├── api/
│       │   ├── core/
│       │   └── models/
│       └── pyproject.toml
│
├── packages/
│   ├── config/          # Shared ESLint/TypeScript configs
│   ├── types/           # Shared TypeScript types
│   ├── utils/           # Shared utilities
│   ├── ui/              # Shared UI components
│   ├── auth/            # Clerk helpers
│   ├── db/              # Supabase client + helpers
│   ├── cms/             # WordPress client
│   ├── crm/             # HubSpot client
│   └── realtime/        # Supabase realtime helpers
│
└── docs/
    ├── architecture.md
    ├── roadmap.md
    ├── runbook.md
    ├── module-status.json
    ├── file-inventory.json
    ├── pending-items.md
    └── validation-log.md
```

## Data Flow

### Authentication Flow (Clerk)

1. User visits sign-in page
2. Clerk handles authentication
3. After login, redirect to dashboard
4. Middleware checks session for protected routes
5. User data synced to Supabase on first login

### Database Flow (Supabase)

1. API Gateway receives request
2. Verify Clerk token
3. Query Supabase via typed client
4. Return response
5. Optional: Enable realtime subscriptions

### CRM Flow (HubSpot)

1. New user signup triggers webhook
2. API Gateway processes webhook
3. Create contact in HubSpot
4. Also store local backup in Supabase

### Content Flow (WordPress)

1. Marketing pages fetch from WordPress API
2. Cache content where appropriate
3. Display blog posts, landing page content

## Environment Configuration

### Development

- Local development with `pnpm dev`
- Use `.env.local` for secrets
- Some services can use mock data

### Production

- Deploy to Vercel (web apps)
- Deploy to Railway/Render (API gateway)
- Deploy to Render/Fly.io (AI service)

## Security Considerations

1. **Environment Variables**: Never commit secrets
2. **API Keys**: Use Clerk for auth, Supabase for data
3. **CORS**: Configure properly for production
4. **Rate Limiting**: Implement in API gateway
5. **Webhooks**: Verify signatures from external services

## Extension Points

### Billing Module (Future)

- Stripe integration for payments
- Subscription management
- Invoice generation

### Analytics Module (Future)

- Usage tracking
- Dashboard analytics
- Export capabilities

### Mobile Sync (Future)

- Mobile app development
- Push notifications
- Offline support

## Monitoring

- Vercel Analytics for web apps
- Sentry for error tracking
- Supabase dashboard for database
