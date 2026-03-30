# @sociolume/crm

A HubSpot CRM client package for managing contacts, companies, deals, and notes within the Sociolume platform.

## Installation

This package is part of a monorepo. Install dependencies from the root:

```bash
pnpm install
```

## Usage

### Initialize the client

```typescript
import { HubSpotClient, getHubSpotClient } from '@sociolume/crm';

// Use default client (reads from environment variables)
const client = getHubSpotClient();

// Or create a custom instance
const customClient = new HubSpotClient('your-api-key', 'your-portal-id');
```

### Contact operations

```typescript
// Create a new contact
const contact = await client.createContact({
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1-555-123-4567',
  company: 'Acme Corp',
});

// Get a contact by ID
const contact = await client.getContact('12345');

// Update a contact
const updated = await client.updateContact('12345', {
  firstName: 'Jonathan',
  phone: '+1-555-987-6543',
});

// Search contacts by email
const results = await client.searchContacts('john.doe');
```

### Company operations

```typescript
// Create a company
const company = await client.createCompany({
  name: 'Acme Corp',
  domain: 'acme.com',
});

// Get a company by ID
const company = await client.getCompany('67890');
```

### Deal operations

```typescript
// Create a deal
const deal = await client.createDeal({
  name: 'Enterprise License',
  stage: 'appointmentscheduled',
  amount: 50000,
  pipeline: 'default',
});

// Update a deal
const updated = await client.updateDeal('24680', {
  stage: 'closedwon',
  amount: 55000,
});
```

### Note operations

```typescript
// Create a note
const note = await client.createNote({
  content: 'Met with the client to discuss pricing.',
  associationTargetId: '12345',
  associationType: 10, // Contact association type
});
```

## API Reference

### HubSpotClient

The main client class for interacting with the HubSpot API.

#### Constructor

```typescript
constructor(apiKey?: string, portalId?: string)
```

| Parameter | Type   | Description                           |
| --------- | ------ | ------------------------------------- |
| apiKey    | string | HubSpot API key (optional)            |
| portalId  | string | HubSpot Portal ID (optional)          |

Both parameters default to values from environment variables.

#### Methods

##### Contact Operations

| Method           | Description                    | Returns           |
| ---------------- | ------------------------------ | ------------------ |
| `createContact`  | Create a new contact           | `HubSpotContact`  |
| `getContact`     | Get a contact by ID            | `HubSpotContact`   |
| `updateContact`  | Update a contact's properties  | `HubSpotContact`   |
| `searchContacts` | Search contacts by email       | `HubSpotContactSearchResult` |

##### Company Operations

| Method          | Description                  | Returns         |
| --------------- | ---------------------------- | --------------- |
| `createCompany` | Create a new company         | `HubSpotCompany` |
| `getCompany`    | Get a company by ID          | `HubSpotCompany` |

##### Deal Operations

| Method        | Description                | Returns       |
| ------------- | -------------------------- | ------------- |
| `createDeal`  | Create a new deal          | `HubSpotDeal` |
| `updateDeal`  | Update a deal's properties | `HubSpotDeal` |

##### Note Operations

| Method      | Description                                | Returns      |
| ----------- | ------------------------------------------ | ------------ |
| `createNote` | Create a note with optional associations | `HubSpotNote` |

### Types

#### HubSpotContact

```typescript
interface HubSpotContact {
  id: string;
  properties: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}
```

#### HubSpotCompany

```typescript
interface HubSpotCompany {
  id: string;
  properties: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}
```

#### HubSpotDeal

```typescript
interface HubSpotDeal {
  id: string;
  properties: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}
```

#### HubSpotNote

```typescript
interface HubSpotNote {
  id: string;
  properties: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}
```

### Deal Stages

Predefined deal stage constants:

```typescript
import { dealStages, DealStage } from '@sociolume/crm';

// Access stage values
const stage = dealStages.qualified; // 'qualifiedtobuy'
```

| Stage Key    | HubSpot Value         |
| ------------ | --------------------- |
| `new`        | `appointmentscheduled` |
| `qualified`  | `qualifiedtobuy`       |
| `proposal`  | `presentationscheduled` |
| `negotiation` | `decisionmakerboughtin` |
| `closed`    | `contractsent`         |
| `won`       | `closedwon`           |
| `lost`      | `closedlost`          |

## Environment Variables

The client reads configuration from the following environment variables. See [`.env.example`](../../.env.example) for reference.

| Variable             | Description                    | Required |
| -------------------- | ------------------------------ | -------- |
| `HUBSPOT_API_KEY`    | HubSpot private app API key   | Yes      |
| `HUBSPOT_PORTAL_ID`  | Your HubSpot Portal ID        | Yes      |
| `HUBSPOT_WEBHOOK_SECRET` | Webhook signature verification secret | No |

## Related Packages

- [`@sociolume/config`](../../config/README.md) - Shared configuration including HubSpot settings
- [`@sociolume/db`](../../db/README.md) - Database client for persistent storage
- [`@sociolume/types`](../../types/README.md) - Shared TypeScript type definitions

## Development

### Type checking

```bash
pnpm --filter @sociolume/crm typecheck
```

### Linting

```bash
pnpm --filter @sociolume/crm lint
```

## License

Private - All rights reserved