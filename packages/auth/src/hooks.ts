import { useUser, useOrganization, useOrganizationList, useClerk } from '@clerk/clerk-react';
import type { User } from '@clerk/clerk-react';
import type { Organization } from '@clerk/clerk-react';

// Hook for getting current user
export function useCurrentUser() {
  const { user, isLoaded, isSignedIn } = useUser();
  return { user: user as User | null, isLoaded, isSignedIn };
}

// Hook for getting current organization
export function useCurrentOrganization() {
  const { organization, isLoaded, isActive } = useOrganization();
  return { organization: organization as Organization | null, isLoaded, isActive };
}

// Hook for listing organizations (for users with multiple orgs)
export function useOrganizations() {
  const { organizationList, isLoaded } = useOrganizationList();
  return { organizationList, isLoaded };
}

// Hook for Clerk utilities
export function useAuthActions() {
  const { signOut, openUserProfile } = useClerk();

  return {
    signOut: (redirectUrl?: string) => signOut({ redirectUrl }),
    openUserProfile,
  };
}

// Hook for checking if user has specific role
export function useHasRole(requiredRole: string): boolean {
  const { organization } = useCurrentOrganization();
  if (!organization) return false;

  const membership = organization.internalOrganizationSettings?.membership?.role;
  return membership === requiredRole;
}

// Hook for protected content - redirects if not signed in
export function useProtected() {
  const { isSignedIn, isLoaded } = useUser();
  return { isSignedIn, isLoaded };
}
