# Sociolume API Documentation

> **Version:** 1.0.0  
> **Last Updated:** March 2026

## Table of Contents

- [Overview](#overview)
- [Base URL & Configuration](#base-url--configuration)
- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Endpoints](#endpoints)
  - [Root](#root)
  - [Health](#health)
  - [Version](#version)
  - [Auth](#auth)
- [Error Handling](#error-handling)
- [Database Schema](#database-schema)
- [Example Requests](#example-requests)

---

## Overview

The Sociolume API Gateway is a Fastify-based REST API that serves as the central communication hub for the Sociolume SaaS platform. It provides endpoints for authentication, health monitoring, version information, and user profile management.

### Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Fastify (Node.js) |
| Authentication | Clerk |
| Database | Supabase |
| Security | Helmet, CORS, Rate Limiting |

### Project Structure

```
apps/api/
├── src/
│   ├── server.ts          # Main server entry point
│   ├── routes/
│   │   ├── auth.ts        # Authentication routes
│   │   ├── health.ts      # Health check routes
│   │   └── version.ts     # Version info routes
│   └── utils/
│       └── logger.ts      # Logging utility
└── package.json
```

---

## Base URL & Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `API_PORT` | `3001` | API server port |
| `API_HOST` | `0.0.0.0` | API server host |
| `CORS_ORIGINS` | `http://localhost:3000` | Allowed CORS origins (comma-separated) |
| `NODE_ENV` | `development` | Environment mode |

### Base URLs

| Environment | URL |
|-------------|-----|
| Local Development | `http://localhost:3001` |
| Production | `https://api.your-domain.com` |

### CORS Configuration

The API accepts requests from the following origins by default:
- `http://localhost:3000` (development)
- Configure additional origins via `CORS_ORIGINS` environment variable

---

## Authentication

### Authentication Flow

The API uses Bearer token authentication for protected endpoints. All authenticated routes require a valid Clerk JWT token in the `Authorization` header.

```
Authorization: Bearer <your-clerk-jwt-token>
```

### Token Verification

In **production** mode, the API verifies tokens against Clerk's authentication service. In **development** mode, any valid Bearer token is accepted for easier testing.

### Protected Routes

All routes under `/api/auth/*` require valid authentication:
- [`GET /api/auth/me`](#get-apiauthme) - Get current user
- [`GET /api/auth/profile`](#get-apiauthprofile) - Get user profile

### Unauthenticated Routes

The following endpoints do not require authentication:
- [`GET /`](#get-) - Root endpoint
- [`GET /api/health`](#get-apihealth) - Health check
- [`GET /api/health/live`](#get-apihealthlive) - Liveness probe
- [`GET /api/health/ready`](#get-apihealthready) - Readiness probe
- [`GET /api/version`](#get-apiversion) - Version info

---

## Rate Limiting

The API implements rate limiting via `@fastify/rate-limit`:

| Limit | Time Window |
|-------|-------------|
| 100 requests | 1 minute |

When rate limited, the API returns:
```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded",
  "retryAfter": 60
}
```

---

## Endpoints

### Root

#### `GET /`

Returns basic API information.

**Description:** Welcome endpoint for the Sociolume API Gateway.

**Authentication:** Not required

**Request:**
```
GET /
```

**Response (200 OK):**
```json
{
  "message": "Sociolume API Gateway",
  "version": "1.0.0"
}
```

---

### Health

#### `GET /api/health`

Returns comprehensive health status of the API service.

**Description:** Main health check endpoint that returns service status, timestamp, and service name. Use this for general health monitoring.

**Authentication:** Not required

**Request:**
```
GET /api/health
```

**Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2026-03-29T06:34:23.505Z",
  "service": "api"
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Health status (`healthy` or `unhealthy`) |
| `timestamp` | string | ISO 8601 timestamp of the health check |
| `service` | string | Service identifier (`api`) |

---

#### `GET /api/health/live`

Liveness probe endpoint.

**Description:** Used by Kubernetes/container orchestrators to determine if the container is running. Returns a simple status check without external dependency verification.

**Authentication:** Not required

**Request:**
```
GET /api/health/live
```

**Response (200 OK):**
```json
{
  "status": "ok"
}
```

---

#### `GET /api/health/ready`

Readiness probe endpoint.

**Description:** Used by Kubernetes/container orchestrators to determine if the container is ready to accept traffic. Can be extended to check dependencies like database connectivity.

**Authentication:** Not required

**Request:**
```
GET /api/health/ready
```

**Response (200 OK):**
```json
{
  "status": "ready"
}
```

---

### Version

#### `GET /api/version`

Returns API version and environment information.

**Description:** Provides version details about the running API instance, useful for debugging and version tracking.

**Authentication:** Not required

**Request:**
```
GET /api/version
```

**Response (200 OK):**
```json
{
  "version": "1.0.0",
  "name": "Sociolume API",
  "environment": "development"
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `version` | string | Semantic version of the API |
| `name` | string | API name |
| `environment` | string | Running environment (`development` or `production`) |

---

### Auth

#### `GET /api/auth/me`

Returns the authenticated user's ID.

**Description:** Returns the user ID from the authenticated token. This endpoint verifies the Bearer token and returns the associated user ID.

**Authentication:** Required (Bearer token)

**Request:**
```
GET /api/auth/me
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**
```json
{
  "userId": "user_123456789",
  "message": "User authenticated"
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `userId` | string | Clerk user ID |
| `message` | string | Success message |

**Error Responses:**

| Status | Error |
|--------|-------|
| 401 | `Missing or invalid authorization header` |
| 401 | `Invalid token` |

---

#### `GET /api/auth/profile`

Returns the user's profile from Supabase.

**Description:** Retrieves the full user profile stored in the Supabase `users` table. The user is matched by their Clerk ID.

**Authentication:** Required (Bearer token)

**Request:**
```
GET /api/auth/profile
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**
```json
{
  "profile": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "clerk_id": "user_123456789",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "image_url": "https://example.com/avatar.jpg",
    "created_at": "2026-01-15T10:30:00Z",
    "updated_at": "2026-03-20T14:45:00Z"
  }
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `profile` | object | User profile object |

**Profile Object Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | UUID primary key |
| `clerk_id` | string | Clerk user ID |
| `email` | string | User email |
| `first_name` | string \| null | User's first name |
| `last_name` | string \| null | User's last name |
| `image_url` | string \| null | Profile image URL |
| `created_at` | string | ISO 8601 timestamp |
| `updated_at` | string | ISO 8601 timestamp |

**Error Responses:**

| Status | Error |
|--------|-------|
| 401 | `Missing or invalid authorization header` |
| 401 | `Invalid token` |
| 404 | `Profile not found` |
| 500 | `Internal server error` |

---

## Error Handling

### Error Response Format

All errors follow a consistent JSON format:

```json
{
  "error": "Error Type",
  "message": "Human-readable error message"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 429 | Too Many Requests (Rate Limited) |
| 500 | Internal Server Error |

### Common Errors

| Status | Error Message | Cause |
|--------|--------------|-------|
| 401 | `Missing or invalid authorization header` | No or malformed Authorization header |
| 401 | `Invalid token` | Invalid or expired Clerk token |
| 404 | `Profile not found` | User profile doesn't exist in database |
| 500 | `Internal server error` | Unexpected server error |

---

## Database Schema

The API integrates with Supabase for data persistence. Below are the primary database tables:

### `users`

Stores user profile information synchronized from Clerk.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `clerk_id` | string | Clerk user ID (unique) |
| `email` | string | User email |
| `first_name` | text \| null | First name |
| `last_name` | text \| null | Last name |
| `image_url` | text \| null | Profile image URL |
| `created_at` | timestamptz | Creation timestamp |
| `updated_at` | timestamptz | Last update timestamp |

### `subscriptions`

Stores user subscription information.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | Foreign key to users |
| `plan_id` | string | Plan identifier |
| `status` | string | Subscription status |
| `current_period_start` | date | Period start date |
| `current_period_end` | date | Period end date |
| `cancel_at_period_end` | boolean | Auto-cancel flag |

### `plans`

Available subscription plans.

### `usage`

Tracks API usage metrics.

### `activities`

User activity log.

### `notifications`

User notifications.

### `crm_leads`

CRMlead data synchronized with HubSpot.

---

## Example Requests

### cURL Examples

#### Health Check

```bash
curl -X GET http://localhost:3001/api/health
```

#### Get Version

```bash
curl -X GET http://localhost:3001/api/version
```

#### Get Current User

```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer your-jwt-token"
```

#### Get User Profile

```bash
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer your-jwt-token"
```

### JavaScript/Fetch Examples

#### Basic Health Check

```javascript
const response = await fetch('http://localhost:3001/api/health');
const data = await response.json();
console.log(data);
// { status: 'healthy', timestamp: '...', service: 'api' }
```

#### Authenticated Request

```javascript
const token = 'your-clerk-jwt-token';

const response = await fetch('http://localhost:3001/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log(data);
// { userId: 'user_123', message: 'User authenticated' }
```

#### Get User Profile

```javascript
const token = 'your-clerk-jwt-token';

const response = await fetch('http://localhost:3001/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const { profile } = await response.json();
console.log(profile.email);
```

### Python Examples

#### Health Check

```python
import requests

response = requests.get('http://localhost:3001/api/health')
print(response.json())
# {'status': 'healthy', 'timestamp': '...', 'service': 'api'}
```

#### Authenticated Profile Request

```python
import requests

token = 'your-clerk-jwt-token'
headers = {'Authorization': f'Bearer {token}'}

response = requests.get('http://localhost:3001/api/auth/profile', headers=headers)
data = response.json()
print(data['profile']['email'])
```

---

## Related Documentation

- [Architecture Overview](./architecture.md) - System architecture and data flows
- [Runbook](./runbook.md) - Local development and deployment guide
- [Module Status](./module-status.json) - Project module tracking

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | March 2026 | Initial API documentation |