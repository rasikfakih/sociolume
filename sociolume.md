# Sociolume Master Document

**Project:** Sociolume SaaS Platform  
**Document Type:** Combined master document  
**Status:** Living technical + product bible  
**Scope:** From the very beginning to the current state, including architecture, releases, modules, schemas, APIs, decisions, prompts, workflows, testing, deployment, and roadmap.

---

## 1. What Sociolume Is

Sociolume is a multi-tenant SaaS platform built to monitor social conversations, identify leads, assist with AI-powered replies, support mobile offline sync, provide billing and admin tooling, and later expand into analytics, enterprise security, CMS-driven content, and continuous product iteration.

The platform is designed to serve teams that need to discover demand signals from public conversations and turn those signals into structured leads, notifications, dashboards, workflows, and revenue. It is not a single app; it is a platform made of multiple connected products:

- API Gateway for core application logic and authentication
- AI Service for conversation analysis and reply generation
- Mobile Sync for offline-first mobile usage
- Billing and Admin Portal for operational control
- Customer Portal for self-service usage
- Analytics and Data Platform for reporting and forecasting
- Enterprise Security and Compliance for SSO, RBAC, audit, secrets, and DR
- Future CMS / WordPress layer for content and landing-page management
- Future CRM integration layer for HubSpot backup and lead sync

The intention has always been to build the system in phases so every phase can be tested, validated, and expanded without rewriting the whole product.

---

## 2. Product Vision

The original product vision was to create a social monitoring and lead generation SaaS that helps agencies and businesses find high-intent conversations online, analyze them automatically, and act on them quickly. Over time the vision expanded into a complete enterprise-grade platform with:

- public-facing discovery and SEO-friendly pages
- authenticated dashboards and workflows
- AI-assisted lead scoring and reply generation
- mobile offline support
- billing and subscriptions
- analytics and forecasting
- compliance and security
- deployable infrastructure
- CI/CD and developer workflows for continuous improvement

The long-term goal is to have a living SaaS that can be extended indefinitely, where new modules can be built one by one, validated, and merged safely into production.

---

## 3. Design Principles

The project has consistently followed a few architectural principles:

### 3.1 Build in phases
Every major feature should be built, tested, validated, and only then expanded.

### 3.2 Keep boundaries clean
Backend logic, AI logic, mobile sync, admin tooling, customer tooling, analytics, and infra should not leak into one another unnecessarily.

### 3.3 Prefer production-ready over demo-only
Even when something is built quickly, it should still be deployable, observable, and testable.

### 3.4 Use the right tool for the right layer
- Fastify for API Gateway
- FastAPI for AI Service
- Next.js for frontend apps
- Supabase for the database and realtime
- Clerk for authentication
- WordPress as headless CMS
- HubSpot as CRM
- GitHub Actions for CI/CD
- Docker and Kubernetes for deployment
- Redis for queues, cache, and rate limiting
- ClickHouse for analytics

### 3.5 Keep the system expandable
The monorepo and package structure should support future additions without forcing a rewrite.

---

## 4. Current Strategic Direction

The newest direction for Sociolume is clear:

- Monorepo architecture
- TurboRepo
- pnpm
- Next.js 14 for web apps
- Node.js + Fastify for API Gateway
- Python + FastAPI for AI Service
- Tailwind CSS with daisyUI
- Supabase in Mumbai region for database, storage, realtime, and edge functions
- Clerk for authentication
- WordPress as headless CMS for content and landing-page editing
- HubSpot for CRM
- GitHub for version control and CI/CD
- Vercel for frontend deployment
- Realtime for notifications and activity feed only in the current MVP phase
- Live updates and operational richness later
- Internal lead table in Supabase as backup, even when HubSpot is the primary CRM

The current focus is not to finish every possible feature immediately. The focus is to stabilize the core SaaS loop and then add features in a controlled cycle:

**Prompt → Generate Code → Validate in ChatGPT → Run → Fix → Validate → Next Module**

That loop is now the preferred way to continue development.

---

## 5. Release and Module History

### Release 1: Core Foundation
The first stage focused on the API Gateway and foundational SaaS architecture.

#### Main outcomes
- Multi-tenant backend design
- JWT authentication
- Role-based access control
- Agencies, users, projects, keywords, conversations, leads, replies, notifications, bookmarks, reports, webhooks, and audit logs
- GraphQL + REST hybrid
- Prisma-based persistence
- Docker development support

#### Purpose
This release established the “backbone” of Sociolume. Without it, there would be no reliable place to add AI, mobile sync, billing, or frontend modules.

---

### Release 2: Supabase Schema Foundation
This was the new direction that moved the system toward a practical SaaS foundation using Supabase.

#### Key outcomes
- 10 core tables created
- Multi-tenant relationship model
- Clerk integration foundation
- HubSpot backup readiness
- basic helper functions and TypeScript types
- documentation and package READMEs
- RLS-enabled schema
- future-proofed structure for settings and profile sync

#### Important schema decisions
- `profiles` stores Clerk identity information
- `users` represents application-side users
- `agencies` represent workspaces/tenants
- `agency_members` supports many-to-many membership
- `subscriptions` are agency-level
- `notifications` support realtime
- `crm_leads` store HubSpot backup data

#### Release 2.1
- Clerk webhook handler created
- user-created event syncs Clerk identity into Supabase
- default agency auto-created
- owner membership auto-created
- idempotency and signature verification handled
- backend route separation kept clean

---

### Release 3: Basic Settings Page
The next release direction was the basic authenticated settings page.

#### Purpose
- read current profile from backend
- update first and last name
- keep backend and frontend separated
- use Fastify API route for profile operations
- use Clerk token on the frontend

#### Scope
This release intentionally avoids billing, team management, and advanced settings.

---

### Release 4: API Gateway and AI Service Integration
This phase connected the API Gateway to the AI Service.

#### Key outcomes
- analyze conversation
- generate replies
- batch analysis
- rate limiting
- caching
- circuit breakers
- webhook triggers for high-value leads
- better fault tolerance

#### Purpose
The goal here was to ensure the AI Service was not an isolated microservice but part of the product’s operational flow.

---

### Release 5: Production Hardening
This stage focused on operational maturity.

#### Key outcomes
- Kubernetes manifests
- Helm chart
- monitoring stack
- distributed tracing
- canary deployment
- scaling configuration
- operational readiness
- infra documentation

#### Purpose
This made the system more deployable and observable.

---

### Release 6: Offline-First Mobile Sync
This release created the mobile synchronization foundation.

#### Key outcomes
- push changes
- pull changes
- status endpoint
- conflict resolution
- device registration
- offline-first behavior
- AsyncStorage-backed local cache
- sync hook for React Native

#### Purpose
This allowed mobile usage even when internet connectivity is not stable.

---

### Release 7: Billing, Usage Metering, and Admin Portal
This phase built the business operations layer.

#### Key outcomes
- billing dashboard
- MRR/ARR tracking
- subscriptions
- invoices
- usage metering
- enterprise page
- webhook DLQ
- rate limits page
- experiments page

#### Purpose
This turned Sociolume into a controllable commercial product.

---

### Release 8: Customer Portal and Integrations
This phase built the self-service customer experience.

#### Key outcomes
- dashboard
- subscription management
- usage tracking
- integrations
- webhooks
- team management
- API keys
- settings
- OAuth integration patterns

#### Purpose
This gave customers a place to self-manage their account and integrations.

---

### Release 9: Analytics and Data Platform
This phase created the data warehouse and reporting layer.

#### Key outcomes
- event ingestion
- event schema
- Redis stream buffering
- ClickHouse analytics storage
- raw events in PostgreSQL
- materialized aggregations
- BI API
- dashboards
- forecasting
- anomaly detection
- scheduled reports
- cost attribution

#### Purpose
This gave Sociolume the ability to understand product activity, usage, and value over time.

---

### Release 10: Enterprise Security, Compliance, and Reliability Hardening
This phase added enterprise-grade controls.

#### Key outcomes
- SSO/SAML/OIDC
- SCIM
- RBAC
- immutable audit logs
- secrets management
- privacy and PII protection
- infrastructure hardening
- backups and disaster recovery
- observability and incident response
- security testing
- canary deployments
- chaos engineering
- compliance artifacts

#### Purpose
This made the platform enterprise-ready and audit-friendly.

---

## 6. Architecture Overview

### 6.1 System Layers

Sociolume should be understood as a layered system:

1. **Presentation Layer**
   - Next.js apps
   - marketing pages
   - customer dashboard
   - admin portal
   - mobile app

2. **Application Layer**
   - Fastify API Gateway
   - AI service
   - mobile sync service
   - analytics services
   - billing services

3. **Data Layer**
   - Supabase Postgres
   - Supabase storage
   - Supabase realtime
   - Redis
   - ClickHouse
   - WordPress content store
   - HubSpot CRM

4. **Infrastructure Layer**
   - Docker
   - GitHub Actions
   - Vercel
   - Kubernetes later
   - monitoring / tracing / logs
   - secrets and environment management

### 6.2 Main operational flow
A user should be able to:
- sign up with Clerk
- get synced into Supabase
- land in a default agency
- open the dashboard
- view data and notifications
- connect CRM and CMS integrations
- eventually trigger analytics and AI-driven workflows

That is the core SaaS loop.

---

## 7. Proposed Monorepo Structure

A clean monorepo structure is essential so every module can grow independently but remain connected.

```text
sociolume/
├── apps/
│   ├── web/                     # Next.js 14 customer-facing app
│   ├── admin/                   # Next.js admin portal
│   ├── api/                     # Fastify API Gateway
│   ├── ai-service/              # FastAPI AI microservice
│   ├── worker/                  # background jobs / queues
│   └── docs/                    # docs site / internal docs app
├── packages/
│   ├── db/                      # Supabase schema, migrations, helpers
│   ├── auth/                    # Clerk helpers, session utilities
│   ├── ui/                      # shared UI components
│   ├── config/                  # env validation, constants
│   ├── types/                   # shared types
│   ├── cms/                     # WordPress integration helpers
│   ├── crm/                     # HubSpot integration helpers
│   ├── realtime/                # realtime wrappers / channels
│   ├── analytics/               # analytics SDK / event contract
│   └── utils/                   # shared utilities
├── infra/
│   ├── docker/
│   ├── github/
│   ├── vercel/
│   ├── supabase/
│   ├── wordpress/
│   ├── hubspot/
│   └── deployment/
├── docs/
│   ├── roadmap.md
│   ├── module-status.json
│   ├── pending-items.md
│   ├── skills.md
│   └── sociolume.md
└── turbo.json
```

### Why this structure matters
- It allows independent development
- It reduces accidental coupling
- It supports incremental releases
- It makes CI/CD easier
- It keeps frontend, backend, and shared logic separated

---

## 8. Technology Choices and Why They Matter

### 8.1 TurboRepo
TurboRepo is the right choice for a monorepo because it supports cached builds, parallel tasks, and better developer flow.

### 8.2 pnpm
pnpm is preferred because:
- it is fast
- it deduplicates dependencies better
- it works well in large monorepos
- it reduces install time and disk usage

### 8.3 Next.js 14
Next.js 14 is the right version for this phase because it balances stability and productivity.

### 8.4 Tailwind CSS + daisyUI
This combination gives:
- speed of implementation
- consistent styling
- easy theming
- fewer custom CSS problems

### 8.5 Supabase in Mumbai
Mumbai region is preferred for latency and user experience because the target audience is India-centric and low latency matters.

### 8.6 Clerk
Clerk is the right auth layer because it reduces auth complexity and keeps identity management reliable.

### 8.7 WordPress
WordPress should be used as a headless CMS for:
- blog content
- landing pages
- editable marketing blocks

### 8.8 HubSpot
HubSpot should be the CRM for:
- lead tracking
- customer workflows
- sales visibility
- backup sync from internal CRM records

### 8.9 Vercel
Vercel is ideal for Next.js deployments because it simplifies previews, deployments, and frontend operations.

---

## 9. Data Model Summary

### 9.1 Release 2 schema summary
Core tables:
- plans
- agencies
- profiles
- users
- agency_members
- subscriptions
- usage_records
- activities
- notifications
- crm_leads

### 9.2 Current relationship strategy
- Clerk identity maps into `profiles`
- `profiles` connect to `users`
- `users` join `agencies`
- `agency_members` handle role-based tenancy
- `subscriptions` belong to agencies
- `notifications` belong to users/agencies
- `crm_leads` act as HubSpot backup records

### 9.3 Realtime scope
Only these should be realtime initially:
- notifications
- activity feed

Not:
- live dashboard cards
- usage live graphs
- heavy operational streams

---

## 10. Authentication and Identity

### 10.1 Clerk first
Clerk profile sync is the absolute identity foundation.

### 10.2 Default agency creation
When a new user is created:
1. create profile
2. create agency
3. create user
4. create agency_members entry with owner role

### 10.3 Why this is important
This reduces friction and gives the user an immediately usable workspace.

### 10.4 Authentication flow
- Clerk login
- token retrieval on frontend
- Fastify verifies token
- profile data fetched from API Gateway
- UI reads from DB through authenticated backend route

---

## 11. Backend API Strategy

The API Gateway remains the system of record for application behavior.

### Responsibilities
- auth verification
- profile read/update
- settings operations
- lead / conversation / activity logic
- webhook handling
- integration orchestration
- billing and admin endpoints
- mobile sync endpoints
- analytics ingestion / proxy endpoints

### Why backend-first matters
It keeps the architecture consistent and avoids logic duplication in frontend code.

---

## 12. Frontend Strategy

### 12.1 Next.js app responsibilities
- marketing pages
- login
- dashboard
- settings
- customer portal
- admin portal

### 12.2 Frontend data flow
- frontend asks API Gateway
- API Gateway talks to database or services
- frontend never directly mutates DB
- frontend uses Clerk for auth token
- frontend uses shared UI components for consistency

### 12.3 UI style
- Tailwind CSS
- daisyUI
- clean cards
- clear whitespace
- modern SaaS feel
- fast loading
- mobile-friendly layouts

---

## 13. Current Development Philosophy

The new workflow is:

**Design → Generate Code → Validate with ChatGPT → Run Locally → Fix → Validate Again → Merge Next Module**

This is a highly practical cycle because it avoids huge rewrite failures and allows the stack to mature step by step.

### Why it works
- each feature is isolated
- each feature is testable
- bugs are caught earlier
- the project remains understandable
- progress is visible

---

## 14. Suggested Module Order Going Forward

If the goal is to get to a live MVP quickly, the order should be:

1. Supabase schema foundation
2. Clerk sync and settings
3. Dashboard shell
4. Notifications and realtime
5. WordPress headless content
6. HubSpot lead sync
7. Analytics and usage reporting
8. Billing / subscriptions
9. Admin portal enhancements
10. Security, compliance, reliability improvements
11. Mobile app refinements
12. Performance optimization and production hardening

This order keeps identity, data integrity, and the core dashboard first.

---

## 15. CMS and CRM Recommendation

### CMS
Use **WordPress as a headless CMS only**.

Why:
- easy content editing
- mature editorial tooling
- supports non-technical staff
- can power blog and landing pages
- can be separated from the core app shell

### CRM
Use **HubSpot as the primary CRM**.

Why:
- excellent workflow visibility
- lead and customer lifecycle management
- good backup and sync patterns
- scalable for teams
- familiar for sales/operations users

### Internal backup
Keep a simple internal lead table in Supabase as a backup layer even when HubSpot is primary. This protects the product from CRM outages and keeps data local.

---

## 16. Security and Compliance Direction

Even in earlier releases, the system should keep:
- RLS at the database layer
- secure auth boundaries
- webhook signature verification
- secret management
- PII minimization
- audit logs
- data retention policies

Later releases should expand this into:
- SSO
- SCIM
- role enforcement
- tamper-evident audit trails
- compliance artifacts
- backup and DR drills

---

## 17. Testing Philosophy

Each module should be tested in a loop:

1. unit tests
2. integration tests
3. local runtime verification
4. UI checks
5. data integrity validation
6. deployment simulation if relevant

### Recommended testing stack
- Vitest for unit tests
- Playwright for browser testing
- Fastify route tests for backend
- Supabase local/dev validation
- Docker Compose for local service orchestration

---

## 18. CI/CD Strategy

### GitHub Actions
Use GitHub Actions for:
- linting
- type checking
- unit tests
- integration tests
- build verification
- preview deployments
- security checks

### Vercel
Use Vercel for:
- frontend preview deploys
- production frontend deploys
- branch previews

### Local developer flow
Use local commands for:
- `pnpm install`
- `pnpm dev`
- `pnpm test`
- `pnpm lint`
- `pnpm build`

### Why local CI matters
It helps catch issues before they reach GitHub or production.

---

## 19. Prompting Workflow for MiniMax / Kilo / Coding Agents

The best way to use code-generation agents is to provide:
- target module
- current repo status
- exact files to change
- hard boundaries
- required tests
- acceptance criteria
- forbidden changes
- sample input/output
- rollout order

### Prompt structure template
1. Context
2. Goal
3. Files to edit
4. Constraints
5. Acceptance criteria
6. Testing steps
7. Output format
8. Do not do list

This should be repeated per feature so every coding cycle stays controlled.

---

## 20. Suggested Immediate Next Build

The best next build after the foundation is:

### Release 2.2 / 3.0 Core Path
- basic settings page
- profile read/update
- agency display
- notification groundwork
- dashboard shell
- realtime notifications
- initial web app shell in Next.js

This is the fastest path to a visible, working SaaS.

---

## 21. Suggested Roadmap from Here

### Phase A: Core SaaS loop
- Clerk user sync
- profile settings
- dashboard
- notifications
- agency shell

### Phase B: Content and acquisition
- WordPress CMS
- blog
- landing pages
- SEO pages

### Phase C: CRM and workflows
- HubSpot sync
- lead backup
- lead lifecycle UI
- internal lead table reconciliation

### Phase D: Analytics and monetization
- usage reporting
- token metering
- billing
- invoices
- plan management

### Phase E: Scale and governance
- SSO
- RBAC
- enterprise compliance
- observability
- backups
- disaster recovery
- performance tuning

---

## 22. Module Decision Log

### Confirmed decisions
- monorepo
- TurboRepo
- pnpm
- Next.js 14
- Fastify
- FastAPI
- Supabase Mumbai
- Clerk
- WordPress headless CMS
- HubSpot CRM
- Vercel frontend deployment
- GitHub Actions CI/CD
- Tailwind + daisyUI
- realtime for notifications only
- single-agency MVP logic with future multi-agency model preserved

### Deferred decisions
- full enterprise SSO rollout
- full multi-agency UX
- advanced realtime features
- deep CRM object sync beyond leads
- full marketing CMS editing workflow
- large-scale analytics polish

---

## 23. What Should Be in the Next Documentation Files

For the next cycle, it is useful to maintain these docs:

- `docs/module-status.json`
- `docs/pending-items.md`
- `docs/roadmap.md`
- `docs/release-log.md`
- `docs/architecture.md`
- `docs/api-contracts.md`
- `docs/data-model.md`
- `docs/deployment.md`
- `docs/testing.md`
- `docs/decisions.md`
- `docs/sociolume.md`

These files make it easier to know what is done, what is pending, and what should be built next.

---

## 24. Current Master Summary

Sociolume is now best understood as a platform that combines:

- public content and discovery
- authenticated SaaS operations
- AI-assisted analysis and reply generation
- mobile offline support
- billing and admin control
- analytics and forecasting
- enterprise security and compliance
- scalable deployment and CI/CD
- future CMS and CRM integrations

The project’s biggest strength is that it can evolve module by module.

The project’s biggest risk is trying to build too much at once.

That is why the new build strategy should stay disciplined:
- one module at a time
- one prompt at a time
- one validation cycle at a time

---

## 25. Future Roadmap

The roadmap should eventually cover:

- marketing site
- landing pages
- SEO blog
- customer dashboard
- admin portal
- internal support tools
- support automation
- richer analytics
- campaign performance
- lead scoring improvements
- mobile app improvements
- onboarding flows
- permissions model expansion
- enterprise reporting
- app performance optimization
- observability improvements
- cost reduction and resource optimization
- documentation hardening
- release automation
- rollback automation

---

## 26. Final Notes

This document is intended to be the single place where Sociolume’s history, architecture, release decisions, and future direction are preserved. It should be updated continuously as the system grows.

The best next step is to keep the build process incremental, validated, and test-driven so the platform becomes stable enough to launch and flexible enough to grow.

---

*End of Sociolume Master Document*
