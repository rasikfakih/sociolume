import { authMiddleware } from '@clerk/nextjs';

// Admin routes - all require authentication for now
const protectedRoutes = ['/'];

export default authMiddleware({
  publicRoutes: ['/sign-in', '/sign-up', '/api/health'],
  ignoredRoutes: ['/api/health'],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
