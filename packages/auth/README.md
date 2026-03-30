# @sociolume/auth

> **Version:** 1.0.0  
> **Description:** Clerk authentication integration for Sociolume

## Overview

This package provides authentication utilities using [Clerk](https://clerk.com/) for the Sociolume platform. It integrates with Next.js and provides hooks and utilities for user authentication state management.

## Installation

```bash
pnpm add @sociolume/auth
```

## Requirements

| Dependency | Version |
|------------|---------|
| React | ^18.2.0 |
| React DOM | ^18.2.0 |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in page URL |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign-up page URL |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Redirect after sign-in |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Redirect after sign-up |

## Usage

### Initialize Clerk

Set up Clerk in your Next.js application layout:

```tsx
// app/layout.tsx
import { ClerkProvider } from '@sociolume/auth/clerk';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      {children}
    </ClerkProvider>
  );
}
```

### Get Authentication State

Use the `getAuth` helper to retrieve authentication state in server components or API routes:

```typescript
import { getAuth } from '@sociolume/auth';

export function getData() {
  const { userId, sessionId } = getAuth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }
  
  return { userId };
}
```

### Use Clerk Hooks

Use provided hooks for client-side authentication:

```tsx
import { useUser, useClerk } from '@sociolume/auth/hooks';
import { useEffect, useState } from 'react';

export function UserProfile() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isLoaded || !mounted) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.firstName}</h1>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
```

## Exports

| Export | Source | Description |
|--------|--------|-------------|
| `ClerkProvider` | `@sociolume/auth/clerk` | Clerk provider component |
| `auth` | `@sociolume/auth` | Auth helper functions |
| `clerkClient` | `@sociolume/auth` | Clerk client instance |
| `getAuth` | `@sociolume/auth` | Get auth state in server contexts |
| `useUser` | `@sociolume/auth/hooks` | Hook to access current user |
| `useClerk` | `@sociolume/auth/hooks` | Hook for Clerk operations |

## API Reference

### `getAuth()`

Retrieves authentication state in server contexts.

```typescript
const { userId, sessionId, claims } = getAuth();
```

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `userId` | `string \| null` | Current user ID |
| `sessionId` | `string \| null` | Current session ID |
| `claims` | `JwtPayload \| null` | Token claims |

### `useUser()`

React hook to access the current user.

```typescript
const { user, isLoaded, isSignedIn } = useUser();
```

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `user` | `ClerkUser \| null` | Current user object |
| `isLoaded` | `boolean` | Whether user data loaded |
| `isSignedIn` | `boolean` | Whether user is signed in |

### `useClerk()`

React hook for Clerk operations.

```typescript
const { signOut, openSignIn, openSignUp } = useClerk();
```

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `signOut` | `(options?) => Promise<void>` | Sign out |
| `openSignIn` | `() => void` | Open sign-in modal |
| `openSignUp` | `() => void` | Open sign-up modal |
| `setActive` | `(options?) => Promise<void>` | Set active session |

## User Object Properties

The Clerk user object contains:

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | User ID |
| `firstName` | string \| null | First name |
| `lastName` | string \| null | Last name |
| `emailAddresses` | EmailAddress[] | Email addresses |
| `phoneNumbers` | PhoneNumber[] | Phone numbers |
| `imageUrl` | string | Profile image URL |
| `createdAt` | number | Creation timestamp |

## Integration with API

The package works with the Sociolume API for authenticated requests:

```typescript
import { getAuth } from '@sociolume/auth';

export async function fetchProfile() {
  const { userId } = getAuth();
  
  const response = await fetch('http://localhost:3001/api/auth/profile', {
    headers: {
      'Authorization': `Bearer ${userId}`,
    },
  });
  
  return response.json();
}
```

## Related Documentation

- [API Documentation](../docs/api.md) - API endpoints
- [Clerk Documentation](https://clerk.com/docs) - Clerk platform docs