# @sociolume/types

> **Version:** 1.0.0  
> **Description:** Shared TypeScript type definitions for the Sociolume platform

## Overview

This package provides centralized TypeScript type definitions used across the Sociolume platform. It includes types for users, organizations, subscriptions, CRM contacts, CMS content, analytics, and common utility types used throughout the monorepo.

## Installation

```bash
pnpm add @sociolume/types
```

## Requirements

This package has no runtime dependencies:

| Dependency | Version |
|------------|---------|
| None | - |

## Usage

### Import Types

```typescript
import {
  User,
  UserProfile,
  Organization,
  ApiResponse,
  PaginatedResponse,
  Contact,
  Lead,
  BlogPost,
  AnalyticsData,
} from '@sociolume/types';
```

### User Types

```typescript
import { User, UserProfile, Organization, OrganizationRole } from '@sociolume/types';

// Basic user type
const user: User = {
  id: 'user_123',
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  imageUrl: 'https://example.com/avatar.jpg',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z',
};

// Extended profile with subscription info
const profile: UserProfile = {
  ...user,
  subscriptionId: 'sub_123',
  subscriptionPlan: { /* ... */ },
  usage: { /* ... */ },
  organizationId: 'org_123',
};

// Organization role
type Role = OrganizationRole; // 'owner' | 'admin' | 'member' | 'viewer'
```

### Subscription Types

```typescript
import {
  Subscription,
  SubscriptionStatus,
  SubscriptionPlan,
  BillingInterval,
  PlanLimits,
  UsageStats,
} from '@sociolume/types';

const plan: SubscriptionPlan = {
  id: 'plan_pro',
  name: 'Pro',
  description: 'Professional plan',
  price: 29.99,
  interval: 'month',
  features: ['unlimited_api_calls', 'priority_support'],
  limits: {
    apiCalls: 10000,
    storage: 10737418240, // 10GB
    teamMembers: 5,
  },
};

const subscription: Subscription = {
  id: 'sub_123',
  userId: 'user_123',
  planId: 'plan_pro',
  status: 'active',
  currentPeriodStart: '2024-01-01T00:00:00Z',
  currentPeriodEnd: '2024-02-01T00:00:00Z',
  cancelAtPeriodEnd: false,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z',
};
```

### API Response Types

```typescript
import { ApiResponse, ApiError, PaginatedResponse } from '@sociolume/types';

// Generic API response
interface UserResponse {
  id: string;
  name: string;
}

const response: ApiResponse<UserResponse> = {
  data: { id: '123', name: 'John' },
  success: true,
};

// Or with error
const errorResponse: ApiResponse<UserResponse> = {
  error: {
    code: 'NOT_FOUND',
    message: 'User not found',
  },
  success: false,
};

// Paginated response
const paginatedResponse: PaginatedResponse<UserResponse> = {
  data: [
    { id: '1', name: 'John' },
    { id: '2', name: 'Jane' },
  ],
  total: 100,
  page: 1,
  pageSize: 10,
  hasMore: true,
};
```

### CRM Types (HubSpot)

```typescript
import { Contact, Lead, LeadStatus, Company } from '@sociolume/types';

const contact: Contact = {
  id: 'contact_123',
  email: 'jane@company.com',
  firstName: 'Jane',
  lastName: 'Smith',
  phone: '+1234567890',
  company: 'Acme Corp',
  hubspotId: 'hs_123',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z',
};

const lead: Lead = {
  id: 'lead_123',
  contactId: 'contact_123',
  status: 'qualified',
  source: 'website',
  score: 85,
  hubspotId: 'hs_lead_123',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z',
};

// Lead statuses
type Status = LeadStatus;
// 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'

const company: Company = {
  id: 'company_123',
  name: 'Acme Corp',
  domain: 'acme.com',
  hubspotId: 'hs_company_123',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z',
};
```

### CMS Types (WordPress)

```typescript
import { BlogPost, ContentBlock, LandingPage } from '@sociolume/types';

const post: BlogPost = {
  id: 123,
  slug: 'hello-world',
  title: 'Hello World',
  content: '<p>Welcome to our blog!</p>',
  excerpt: 'A brief summary...',
  author: 'john@example.com',
  featuredImage: 'https://example.com/image.jpg',
  publishedAt: '2024-01-01T00:00:00Z',
  modifiedAt: '2024-01-15T00:00:00Z',
  categories: [1, 2],
  tags: [3, 4],
};

const landingPage: LandingPage = {
  id: 456,
  slug: 'pricing',
  title: 'Pricing',
  sections: [
    {
      id: 'section_1',
      type: 'hero',
      content: '{"title": "Our Pricing"}',
      order: 1,
    },
  ],
};
```

### Analytics Types

```typescript
import { AnalyticsData, ChartDataPoint } from '@sociolume/types';

const analytics: AnalyticsData = {
  totalApiCalls: 150000,
  uniqueUsers: 2500,
  activeSubscriptions: 1800,
  revenue: 45000.50,
  period: '2024-01',
};

const chartData: ChartDataPoint[] = [
  { date: '2024-01-01', value: 100, label: 'Day 1' },
  { date: '2024-01-02', value: 150, label: 'Day 2' },
  { date: '2024-01-03', value: 200, label: 'Day 3' },
];
```

### Activity & Notification Types

```typescript
import { Activity, ActivityType, Notification, NotificationType } from '@sociolume/types';

const activity: Activity = {
  id: 'activity_123',
  userId: 'user_123',
  type: 'login',
  description: 'User logged in',
  metadata: { ip: '192.168.1.1' },
  createdAt: '2024-01-15T00:00:00Z',
};

const notification: Notification = {
  id: 'notif_123',
  userId: 'user_123',
  type: 'success',
  title: 'Welcome!',
  message: 'Your account has been created.',
  read: false,
  createdAt: '2024-01-15T00:00:00Z',
};
```

## Exports

| Export | Type | Description |
|--------|------|-------------|
| `User` | Interface | Basic user type |
| `UserProfile` | Interface | Extended user with subscription & usage |
| `Organization` | Interface | Organization entity |
| `OrganizationMember` | Interface | Organization membership |
| `OrganizationRole` | Type | 'owner' \| 'admin' \| 'member' \| 'viewer' |
| `Subscription` | Interface | Subscription entity |
| `SubscriptionStatus` | Type | 'active' \| 'canceled' \| 'past_due' \| 'trialing' \| 'unpaid' |
| `SubscriptionPlan` | Interface | Plan details |
| `BillingInterval` | Type | 'day' \| 'week' \| 'month' \| 'year' |
| `PlanLimits` | Interface | Plan usage limits |
| `UsageStats` | Interface | Current usage statistics |
| `UsageRecord` | Interface | Usage record entry |
| `UsageType` | Type | 'api_call' \| 'storage_upload' \| 'team_invite' |
| `Activity` | Interface | Activity log entry |
| `ActivityType` | Type | Activity type union |
| `Notification` | Interface | User notification |
| `NotificationType` | Type | 'info' \| 'success' \| 'warning' \| 'error' |
| `ApiResponse<T>` | Generic | Generic API response wrapper |
| `ApiError` | Interface | API error details |
| `PaginatedResponse<T>` | Generic | Paginated data response |
| `Contact` | Interface | CRM contact (HubSpot) |
| `Lead` | Interface | CRM lead |
| `LeadStatus` | Type | Lead status union |
| `Company` | Interface | CRM company |
| `BlogPost` | Interface | WordPress blog post |
| `ContentBlock` | Interface | CMS content block |
| `LandingPage` | Interface | CMS landing page |
| `AnalyticsData` | Interface | Analytics summary data |
| `ChartDataPoint` | Interface | Chart data point |

## Related Packages

| Package | Description |
|---------|-------------|
| [@sociolume/db](./packages/db) | Supabase database client |
| [@sociolume/config](./packages/config) | Environment configuration |
| [@sociolume/auth](./packages/auth) | Authentication (Clerk) |
| [@sociolume/cms](./packages/cms) | WordPress CMS client |
| [@sociolume/crm](./packages/crm) | HubSpot CRM client |
| [@sociolume/realtime](./packages/realtime) | Real-time subscriptions |
| [@sociolume/utils](./packages/utils) | Utility functions |
