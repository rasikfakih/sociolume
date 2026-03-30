import { getAuth as clerkGetAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import type { GetAuthReturn } from '@clerk/nextjs/server';

// Auth helpers for server-side authentication
export function getAuth(req: Request): GetAuthReturn {
  return clerkGetAuth(req);
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
export function isAuthenticated(auth: GetAuthReturn): boolean {
  return !!auth?.userId;
}

// Helper to get user ID from auth
export function getUserId(auth: GetAuthReturn): string | null {
  return auth?.userId ?? null;
}

// Helper to get organization ID from auth
export function getOrgId(auth: GetAuthReturn): string | null {
  return auth?.orgId ?? null;
}

// Helper to get organization role from auth
export function getOrgRole(auth: GetAuthReturn): string | null {
  return auth?.orgRole ?? null;
}
