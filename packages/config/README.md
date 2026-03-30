# @sociolume/config

Centralized configuration management for the Sociolume SaaS platform. Provides type-safe access to all service configurations through a unified interface.

## Overview

This package exports configuration objects for all integrated services:

- **Supabase** - PostgreSQL database and authentication
- **Clerk** - User authentication and management
- **WordPress** - CMS integration
- **HubSpot** - CRM and marketing automation
- **AI Service** - Machine learning predictions

All configurations are read from environment variables with sensible defaults.

## Installation

```bash
# From the monorepo root
pnpm add @sociolume/config

# Or reference directly in code
import { supabaseConfig, clerkConfig } from '@sociolume/config';
```

## Usage

### Import Configuration Objects

```typescript
import {
  appConfig,
  apiConfig,
  supabaseConfig,
  clerkConfig,
  wordpressConfig,
  hubspotConfig,
  aiServiceConfig,
} from '@sociolume/config';
```

### Using Configurations

#### Supabase Configuration

```typescript
import { supabaseConfig } from '@sociolume/config';

// Initialize Supabase client
const supabase = createClient(
  supabaseConfig.url,
  supabaseConfig.anonKey
);

// Server-side operations use service role key
const adminClient = createClient(
  supabaseConfig.url,
  supabaseConfig.serviceRoleKey,
  { auth: { persistSession: false } }
);
```

#### Clerk Authentication

```typescript
import { clerkConfig } from '@sociolume/config';

// Configure Clerk in your app
const clerk = new Clerk(clerkConfig.publishableKey);

// Use secret key for server operations
const response = await clerk.authenticateRequest(request);
```

#### API Server Configuration

```typescript
import { apiConfig } from '@sociolume/config';

// Configure Express/Fastify server
app.listen(apiConfig.port, apiConfig.host, () => {
  console.log(`Server running on ${apiConfig.host}:${apiConfig.port}`);
  console.log(`Allowed CORS origins: ${apiConfig.corsOrigins.join(', ')}`);
});
```

#### AI Service Integration

```typescript
import { aiServiceConfig } from '@sociolume/config';

// Configure AI service client
const aiClient = new AIServiceClient({
  baseURL: aiServiceConfig.url,
  apiKey: aiServiceConfig.apiKey,
});
```

## Environment Variables Reference

### API Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `API_PORT` | `3001` | Server port number |
| `API_HOST` | `0.0.0.0` | Server bind address |
| `CORS_ORIGINS` | `http://localhost:3000` | Comma-separated list of allowed origins |

### Supabase

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public anon key for client |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-side admin operations |
| Region | Fixed | `ap-south-1` (Mumbai) |

### Clerk Authentication

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key for server |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | No | Sign-in redirect URL |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | No | Sign-up redirect URL |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | No | Post-sign-in redirect |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | No | Post-sign-up redirect |

### WordPress CMS

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_WORDPRESS_URL` | No | WordPress site URL |
| `WORDPRESS_API_URL` | No | WordPress REST API endpoint |
| `WORDPRESS_API_KEY` | No | API authentication key |

### HubSpot CRM

| Variable | Required | Description |
|----------|----------|-------------|
| `HUBSPOT_API_KEY` | No | HubSpot private app token |
| `HUBSPOT_PORTAL_ID` | No | HubSpot account portal ID |
| `HUBSPOT_WEBHOOK_SECRET` | No | Webhook signature verification |

### AI Service

| Variable | Default | Description |
|----------|---------|-------------|
| `AI_SERVICE_URL` | `http://localhost:8001` | AI service base URL |
| `AI_SERVICE_API_KEY` | No | AI service authentication |

## Example .env File

```env
# API Server
API_PORT=3001
API_HOST=0.0.0.0
CORS_ORIGINS=http://localhost:3000,https://app.sociolume.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# WordPress CMS (optional)
NEXT_PUBLIC_WORDPRESS_URL=https://blog.sociolume.com
WORDPRESS_API_URL=https://blog.sociolume.com/wp-json
WORDPRESS_API_KEY=your_wordpress_api_key

# HubSpot CRM (optional)
HUBSPOT_API_KEY=pat-na1-...
HUBSPOT_PORTAL_ID=12345678
HUBSPOT_WEBHOOK_SECRET=your_webhook_secret

# AI Service
AI_SERVICE_URL=http://localhost:8001
AI_SERVICE_API_KEY=your_ai_service_key
```

## TypeScript Support

This package is written in TypeScript and requires no additional type definitions. All exported configurations are fully typed.

```typescript
import type { SupabaseConfig, ClerkConfig } from '@sociolume/config';
```

## Related Packages

| Package | Description |
|---------|-------------|
| [`@sociolume/db`](./db/README.md) | Database client and types using Supabase |
| [`@sociolume/auth`](./auth/README.md) | Authentication utilities using Clerk |
| [`@sociolume/cms`](./cms/README.md) | WordPress CMS client |
| [`@sociolume/crm`](./crm/README.md) | HubSpot CRM integration |
| [`@sociolume/realtime`](./realtime/README.md) | Real-time subscription handling |
| [`@sociolume/types`](./types/README.md) | Shared TypeScript type definitions |

## License

Private - All rights reserved