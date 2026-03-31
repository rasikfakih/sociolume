import { auth as clerkGetAuth, clerkClient } from '@clerk/nextjs/server';
import type { AuthObject } from '@clerk/nextjs/server';

// Auth helpers for server-side authentication
export function getAuth(): AuthObject {
  return clerkGetAuth();
}

// Export clerkClient for direct Clerk API access
export { clerkClient };

// Type for authenticated user
export interface AuthUser {
  userId: string;
  sessionId: string;
  actor?: string;
  orgId?: string;
  orgRole?: string;
}

// Helper to check if user is authenticated
export function isAuthenticated(auth: ReturnType<typeof clerkGetAuth>): boolean {
  return !!auth?.userId;
}

// Helper to get user ID from auth
export function getUserId(auth: ReturnType<typeof clerkGetAuth>): string | null {
  return auth?.userId ?? null;
}

// Helper to get organization ID from auth
export function getOrgId(auth: ReturnType<typeof clerkGetAuth>): string | null {
  return auth?.orgId ?? null;
}

// Helper to get organization role from auth
export function getOrgRole(auth: ReturnType<typeof clerkGetAuth>): string | null {
  return auth?.orgRole ?? null;
}
