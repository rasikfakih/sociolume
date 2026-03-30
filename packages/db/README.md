# @sociolume/db

> **Version:** 1.0.0  
> **Description:** Supabase database client and types for Sociolume

## Overview

This package provides a typed Supabase client for the Sociolume platform. It includes type-safe database operations, admin client for server-side operations, and TypeScript type definitions that mirror the database schema.

## Installation

```bash
pnpm add @sociolume/db
```

## Requirements

This package has no additional runtime dependencies beyond the peer dependency:

| Dependency | Version |
|------------|---------|
| None | - |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (private, server-only) |

## Usage

### Get Client (Client-Side)

For client-side operations with auth:

```typescript
import { getSupabaseClient } from '@sociolume/db';

const supabase = getSupabaseClient();

// Query users table
const { data: users, error } = await supabase
  .from('users')
  .select('*');
```

### Get Admin Client (Server-Side)

For server-side operations bypassing RLS:

```typescript
import { getSupabaseAdmin } from '@sociolume/db';

const supabase = getSupabaseAdmin();

// Create user record
const { data, error } = await supabase
  .from('users')
  .insert({
    clerk_id: 'user_123',
    email: 'user@example.com',
    first_name: 'John',
    last_name: 'Doe',
  });
```

## Exports

| Export | Source | Description |
|--------|--------|-------------|
| `getSupabaseClient` | `@sociolume/db` | Get client with anon auth |
| `getSupabaseAdmin` | `@sociolume/db` | Get admin client |
| `TypedSupabaseClient` | `@sociolume/db` | Typed client type |
| Database types | `@sociolume/db/types` | Full schema types |

## API Reference

### `getSupabaseClient()`

Returns a Supabase client configured with the anon key. This client respects Row Level Security (RLS) policies.

```typescript
import { getSupabaseClient } from '@sociolume/db';

const supabase = getSupabaseClient();
```

**Returns:** `SupabaseClient<Database>`

### `getSupabaseAdmin()`

Returns a Supabase client configured with the service role key. This client bypasses RLS and should be used only in server-side contexts.

```typescript
import { getSupabaseAdmin } from '@sociolume/db';

const supabase = getSupabaseAdmin();
```

**Returns:** `SupabaseClient<Database>`

**Warning:** Never expose the admin client to the client-side.

## Database Schema

This package includes TypeScript types mirroring the Supabase schema:

### Tables

#### `users`

```typescript
interface User {
  id: string;
  clerk_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}
```

#### `subscriptions`

```typescript
interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}
```

#### `plans`

```typescript
interface Plan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  interval: string;
  features: Json;
  limits: Json;
  created_at: string;
}
```

#### `usage`

```typescript
interface Usage {
  id: string;
  user_id: string;
  type: string;
  count: number;
  timestamp: string;
}
```

#### `activities`

```typescript
interface Activity {
  id: string;
  user_id: string;
  type: string;
  description: string;
  metadata: Json | null;
  created_at: string;
}
```

#### `notifications`

```typescript
interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}
```

#### `crm_leads`

```typescript
interface CrmLead {
  id: string;
  user_id: string | null;
  email: string;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  status: string;
  source: string | null;
  hubspot_id: string | null;
  created_at: string;
  updated_at: string;
}
```

## Usage Examples

### Fetch User Profile

```typescript
import { getSupabaseClient } from '@sociolume/db';

async function getUserProfile(clerkId: string) {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_id', clerkId)
    .single();
  
  if (error) throw error;
  return data;
}
```

### Create Subscription

```typescript
import { getSupabaseAdmin } from '@sociolume/db';

async function createSubscription(userId: string, planId: string) {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      plan_id: planId,
      status: 'active',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}
```

### Log Activity

```typescript
import { getSupabaseClient } from '@sociolume/db';

async function logActivity(userId: string, type: string, description: string) {
  const supabase = getSupabaseClient();
  
  const { error } = await supabase
    .from('activities')
    .insert({
      user_id: userId,
      type,
      description,
    });
  
  if (error) throw error;
}
```

### Subscribe to Realtime Changes

```typescript
import { getSupabaseClient } from '@sociolume/db';

function subscribeToNotifications(userId: string, callback: (notification) => void) {
  const supabase = getSupabaseClient();
  
  return supabase
    .channel('notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => callback(payload.new)
    )
    .subscribe();
}
```

## Type Safety

The package exports the full database schema as TypeScript types:

```typescript
import { Database } from '@sociolume/db/types';

// Use with Supabase client
const supabase = createClient<Database>(url, key);
```

## Related Packages

- [`@sociolume/config`](./config/README.md) - Configuration
- [`@sociolume/auth`](./auth/README.md) - Authentication
- [API Documentation](../docs/api.md) - API endpoints

---

# Database Schema (Release 2)

This section documents the Supabase database schema foundation for Release 2, including multi-tenant architecture, Clerk integration, and usage tracking.

## 1. Migration Files

### Location

```
supabase/migrations/001_initial_schema.sql
```

### How to Apply Migrations

Using the Supabase CLI:

```bash
# Apply pending migrations
pnpm supabase migration up

# Create a new migration
pnpm supabase migration new your_migration_name

# List migration status
pnpm supabase migration list

# Reset database (drops all tables and re-applies migrations)
pnpm supabase db reset
```

### Manual Application

```bash
# Connect to Supabase and run SQL directly
psql $DATABASE_URL -f supabase/migrations/001_initial_schema.sql
```

---

## 2. Schema Overview

The database consists of **10 tables** organized for multi-tenant SaaS operations:

| Table | Description |
|-------|-------------|
| `plans` | Pricing plan configurations with features and limits (JSONB) |
| `agencies` | Multi-tenant organizations/workspaces |
| `profiles` | User profile data synced from Clerk authentication |
| `users` | Primary user records linking profiles to agencies |
| `agency_members` | Junction table for user-agency many-to-many relationships |
| `subscriptions` | Per-agency subscription records with Stripe integration |
| `usage_records` | Track API calls, storage, and feature usage by agency |
| `activities` | Audit trail and activity feed logging |
| `notifications` | In-app user notifications |
| `crm_leads` | CRM lead storage with HubSpot integration support |

### Entity Relationship Model

```
┌─────────────┐       ┌─────────────────┐
│    plans    │◄──────│ subscriptions   │
└─────────────┘       └─────────────────┘
                              │
                              ▼
┌─────────────┐       ┌─────────────────┐       ┌─────────────┐
│   profiles  │◄──────│     users        │◄──────│ agency_     │
│ (clerk_id)  │       │ (is_primary)     │       │ members     │
└─────────────┘       └─────────────────┘       └─────────────┘
                              │                       │
                              ▼                       ▼
                       ┌─────────────────┐       ┌─────────────┐
                       │    agencies      │◄──────│ crm_leads   │
                       │ (multi-tenant)  │       │ (hubspot)   │
                       └─────────────────┘       └─────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │  usage_records  │
                       └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   activities    │
                       └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │ notifications    │
                       └─────────────────┘
```

---

## 3. Clerk Integration

The `profiles` table acts as a local cache for Clerk user data, enabling database relationships while maintaining authentication through Clerk.

### Profile Schema

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK to users table (nullable) |
| `clerk_id` | VARCHAR(255) | **Unique** Clerk user ID (external identity key) |
| `email` | VARCHAR(255) | User email address |
| `first_name` | VARCHAR(255) | First name |
| `last_name` | VARCHAR(255) | Last name |
| `image_url` | VARCHAR(512) | Avatar/profile image URL |
| `last_sign_in_at` | TIMESTAMP WITH TIME ZONE | Last sign-in timestamp |
| `metadata` | JSONB | Additional profile metadata |
| `synced_at` | TIMESTAMP WITH TIME ZONE | Last sync timestamp from Clerk |
| `source` | VARCHAR(50) | Auth provider source (default: 'clerk') |

### syncProfileFromClerk Function

Used in Clerk webhook handlers to sync user data:

```typescript
import { syncProfileFromClerk } from '@sociolume/db';

// In your Clerk webhook handler
await syncProfileFromClerk(clerkId, {
  email: user.email,
  first_name: user.first_name,
  last_name: user.last_name,
  image_url: user.image_url,
  metadata: user.metadata,
});
```

---

## 4. HubSpot Integration (Future)

The `crm_leads` table stores lead data for future HubSpot integration:

### CRM Lead Schema

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `agency_id` | UUID | FK to agencies (required) |
| `user_id` | UUID | FK to users (optional, owner/assignee) |
| `email` | VARCHAR(255) | Lead email (unique per agency) |
| `first_name` | VARCHAR(255) | First name |
| `last_name` | VARCHAR(255) | Last name |
| `company` | VARCHAR(255) | Company name |
| `phone` | VARCHAR(50) | Phone number |
| `status` | lead_status | Enum: new, contacted, qualified, proposal, won, lost |
| `source` | VARCHAR(50) | Lead source: hubspot, manual, import |
| `hubspot_id` | VARCHAR(255) | HubSpot contact ID for linking |
| `hubspot_data` | JSONB | Raw HubSpot data for backup |

### syncLeadFromHubspot Function

Used for HubSpot webhook/integration:

```typescript
import { syncLeadFromHubspot } from '@sociolume/db';

await syncLeadFromHubspot(agencyId, {
  email: lead.email,
  first_name: lead.firstName,
  last_name: lead.lastName,
  company: lead.company,
  hubspot_id: lead.id,
  hubspot_data: lead, // Raw HubSpot data
});
```

---

## 5. Multi-Tenancy

### agencies Table

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `name` | VARCHAR(255) | Agency/organization name |
| `slug` | VARCHAR(100) | URL-friendly unique identifier |
| `logo_url` | VARCHAR(512) | Agency logo |
| `website` | VARCHAR(512) | Agency website |
| `settings` | JSONB | Agency-specific settings |
| `is_active` | BOOLEAN | Active status |

### agency_members Table (Junction)

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `agency_id` | UUID | FK to agencies (CASCADE delete) |
| `user_id` | UUID | FK to users (CASCADE delete) |
| `role` | VARCHAR(50) | Role in this agency: owner, admin, member, viewer |
| `joined_at` | TIMESTAMP WITH TIME ZONE | When user joined |

### users Table

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `profile_id` | UUID | FK to profiles |
| `agency_id` | UUID | FK to agencies (primary agency) |
| `is_primary` | BOOLEAN | Whether this is user's primary agency |
| `role` | VARCHAR(50) | Platform role: owner, admin, member, viewer |

---

## 6. Usage & Billing

### subscriptions Table (Linked to Agencies)

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `agency_id` | UUID | FK to agencies (**not** users - per-agency billing) |
| `plan_id` | UUID | FK to plans |
| `status` | subscription_status | Enum: active, canceled, past_due, trialing, incomplete |
| `current_period_start` | TIMESTAMP WITH TIME ZONE | Billing period start |
| `current_period_end` | TIMESTAMP WITH TIME ZONE | Billing period end |
| `cancel_at_period_end` | BOOLEAN | Cancel flag |
| `stripe_subscription_id` | VARCHAR(255) | Stripe subscription ID |

### usage_records Table

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `agency_id` | UUID | FK to agencies |
| `user_id` | UUID | FK to users (optional, for user-specific usage) |
| `feature` | VARCHAR(100) | Feature: api_calls, storage, users, etc. |
| `count` | INTEGER | Usage count |
| `period_start` | TIMESTAMP WITH TIME ZONE | Usage period start |
| `period_end` | TIMESTAMP WITH TIME ZONE | Usage period end |

### plans Table

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `name` | VARCHAR(255) | Plan name |
| `price` | DECIMAL(10,2) | Price amount |
| `interval` | VARCHAR(10) | 'month' or 'year' |
| `features` | JSONB | Feature flags and descriptions |
| `limits` | JSONB | Usage limits (max_users, max_api_calls, etc.) |

---

## 7. Indexes & Performance

Key indexes created for query optimization:

| Table | Index | Purpose |
|-------|-------|----------|
| `users` | `idx_users_clerk_id` | Clerk user lookup |
| `users` | `idx_users_email` | Email search |
| `agencies` | `idx_agencies_slug` | Slug lookup |
| `agencies` | `idx_agencies_is_active` | Active filter |
| `agency_members` | `idx_agency_members_agency_user` | Unique user-agency |
| `agency_members` | `idx_agency_members_user_id` | User's agencies |
| `subscriptions` | `idx_subscriptions_agency_id` | Agency subscriptions |
| `subscriptions` | `idx_subscriptions_status` | Status filter |
| `subscriptions` | `idx_subscriptions_agency_status` | Agency + status |
| `usage_records` | `idx_usage_records_agency_id` | Agency usage |
| `usage_records` | `idx_usage_records_period_start` | Period filter |
| `usage_records` | `idx_usage_records_agency_period` | Agency + period |
| `activities` | `idx_activities_agency_id` | Agency activities |
| `activities` | `idx_activities_created_at` | Time filtering |
| `activities` | `idx_activities_user_id` | User activities |
| `notifications` | `idx_notifications_user_id` | User notifications |
| `notifications` | `idx_notifications_read` | Unread filter |
| `crm_leads` | `idx_crm_leads_agency_id` | Agency leads |
| `crm_leads` | `idx_crm_leads_status` | Status filter |
| `crm_leads` | `idx_crm_leads_email_agency` | Unique email per agency |

---

## 8. RLS Policies

All tables have Row Level Security (RLS) enabled. The security model:

### Access Patterns

| Table | Read Access | Write Access |
|-------|-------------|--------------|
| `plans` | Public (active) | Service role only |
| `agencies` | Agency members | Agency owners/admins |
| `profiles` | Own profile | Service role only |
| `users` | Agency users | Agency owners/admins |
| `agency_members` | Agency members | Agency owners/admins |
| `subscriptions` | Agency owners/admins | Service role only |
| `usage_records` | Agency members | Service role only |
| `activities` | Agency members | Service role only |
| `notifications` | Own user | Own user |
| `crm_leads` | Agency members | Agency owners/admins |

### Service Role Bypass

All tables have a service role policy that bypasses RLS:

```sql
CREATE POLICY "Service role can manage <table>" ON <table>
    FOR ALL
    USING (true)
    WITH CHECK (true);
```

**Important:** Never expose the service role key to the client-side.

---

## 9. Example Queries

### Get User's Agencies

```typescript
import { getUserAgencies } from '@sociolume/db';

const agencies = await getUserAgencies(userId);
// Returns all agencies the user belongs to
```

Or with raw SQL:

```sql
SELECT a.*
FROM agencies a
JOIN agency_members am ON am.agency_id = a.id
WHERE am.user_id = 'user-uuid-here';
```

### Get Agency's Active Subscription

```typescript
import { getAgencyActiveSubscription } from '@sociolume/db';

const subscription = await getAgencyActiveSubscription(agencyId);
```

Raw SQL:

```sql
SELECT s.*, p.name as plan_name, p.price as plan_price
FROM subscriptions s
JOIN plans p ON p.id = s.plan_id
WHERE s.agency_id = 'agency-uuid-here'
  AND s.status = 'active'
  AND s.current_period_end > NOW()
ORDER BY s.current_period_start DESC
LIMIT 1;
```

### Record Usage

```typescript
import { createUsageRecord } from '@sociolume/db';

await createUsageRecord({
  agency_id: agencyId,
  user_id: userId, // optional
  feature: 'api_calls',
  count: 1,
  period_start: new Date(),
  period_end: new Date(),
});
```

### Sync Clerk Profile

```typescript
import { syncProfileFromClerk } from '@sociolume/db';

// Called from Clerk webhook endpoint
const profile = await syncProfileFromClerk(
  'user_123abc', // Clerk user ID
  {
    email: 'user@example.com',
    first_name: 'John',
    last_name: 'Doe',
    image_url: 'https://...',
    metadata: { /* any custom metadata */ },
  }
);
```

### Get CRM Leads

```typescript
import { getCrmLeadsByAgency } from '@sociolume/db';

const leads = await getCrmLeadsByAgency(agencyId);
// Returns all leads for an agency
```

Raw SQL:

```sql
SELECT 
  l.id,
  l.email,
  l.first_name,
  l.last_name,
  l.company,
  l.status,
  l.source,
  l.hubspot_id,
  l.created_at
FROM crm_leads l
WHERE l.agency_id = 'agency-uuid-here'
ORDER BY l.created_at DESC;
```

---

## Default Seed Data

The migration includes default pricing plans:

| Plan | Price | Interval | Key Features |
|------|-------|----------|---------------|
| Free | $0 | month | 100 API calls, 1 user, 100MB storage |
| Starter | $29 | month | 1,000 API calls, 5 users, 1GB storage, HubSpot sync |
| Professional | $99 | month | 10,000 API calls, 25 users, 10GB storage, HubSpot + Analytics |
| Enterprise | $299 | month | Unlimited API calls, unlimited users, unlimited storage, priority support |