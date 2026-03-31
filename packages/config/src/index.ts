// Sociolume Shared Configuration Package
// Re-exported configs for use across packages

export const appConfig = {
  name: 'Sociolume',
  version: '1.0.0',
  description: 'SaaS Platform for Social Volume Management',
};

export const apiConfig = {
  port: parseInt(process.env['API_PORT'] || '3001', 10),
  host: process.env['API_HOST'] || '0.0.0.0',
  corsOrigins: process.env['CORS_ORIGINS']?.split(',') || ['http://localhost:3000'],
};

export const supabaseConfig = {
  url: process.env['NEXT_PUBLIC_SUPABASE_URL'] || '',
  anonKey: process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || '',
  serviceRoleKey: process.env['SUPABASE_SERVICE_ROLE_KEY'] || '',
  // Mumbai region - ap-south-1
  region: 'ap-south-1',
};

export const clerkConfig = {
  publishableKey: process.env['NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY'] || '',
  secretKey: process.env['CLERK_SECRET_KEY'] || '',
  signInUrl: process.env['NEXT_PUBLIC_CLERK_SIGN_IN_URL'] || '/sign-in',
  signUpUrl: process.env['NEXT_PUBLIC_CLERK_SIGN_UP_URL'] || '/sign-up',
  afterSignInUrl: process.env['NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL'] || '/dashboard',
  afterSignUpUrl: process.env['NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL'] || '/dashboard',
};

export const wordpressConfig = {
  url: process.env['NEXT_PUBLIC_WORDPRESS_URL'] || '',
  apiUrl: process.env['WORDPRESS_API_URL'] || '',
  apiKey: process.env['WORDPRESS_API_KEY'] || '',
};

export const hubspotConfig = {
  apiKey: process.env['HUBSPOT_API_KEY'] || '',
  portalId: process.env['HUBSPOT_PORTAL_ID'] || '',
  webhookSecret: process.env['HUBSPOT_WEBHOOK_SECRET'] || '',
};

export const aiServiceConfig = {
  url: process.env['AI_SERVICE_URL'] || 'http://localhost:8001',
  apiKey: process.env['AI_SERVICE_API_KEY'] || '',
};
