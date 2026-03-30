import { authMiddleware } from '@clerk/nextjs';

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/dashboard/*', '/settings', '/settings/*'];

// Routes that don't require authentication
const publicRoutes = ['/', '/sign-in', '/sign-up', '/api/health', '/blog', '/blog/(.*)'];

export default authMiddleware({
  publicRoutes,
  ignoredRoutes: ['/api/health'],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
