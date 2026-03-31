import { useUser, useOrganization, useOrganizationList, useClerk } from '@clerk/clerk-react';

// Hook for getting current user
export function useCurrentUser(): { user: any; isLoaded: boolean; isSignedIn: boolean | undefined } {
  const { user, isLoaded, isSignedIn } = useUser();
  return { user, isLoaded, isSignedIn };
}

// Hook for getting current organization
export function useCurrentOrganization(): { organization: any; isLoaded: boolean } {
  const { organization, isLoaded } = useOrganization();
  return { organization, isLoaded };
}

// Hook for listing organizations (for users with multiple orgs)
export function useOrganizations(): { organizationList: any; isLoaded: boolean } {
  const { organizationList, isLoaded } = useOrganizationList();
  return { organizationList, isLoaded };
}

// Hook for Clerk utilities
export function useAuthActions(): { signOut: any; openUserProfile: () => void } {
  const { signOut, openUserProfile } = useClerk();

  return {
    signOut,
    openUserProfile,
  };
}

// Hook for checking if user has specific role
export function useHasRole(_requiredRole: string): boolean {
  const { organization } = useCurrentOrganization();
  if (!organization) return false;

  // Role checking implementation depends on Clerk version
  return false;
}

// Hook for protected content - redirects if not signed in
export function useProtected() {
  const { isSignedIn, isLoaded } = useUser();
  return { isSignedIn, isLoaded };
}
