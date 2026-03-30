# Sociolume Runbook

## Local Development

### Prerequisites

- Node.js 20+
- pnpm 8+
- Docker (optional, for local Supabase)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/sociolume/sociolume.git
cd sociolume

# 2. Install dependencies
pnpm install

# 3. Copy environment file
cp .env.example .env.local

# 4. Fill in your environment variables
# Required minimum for local dev:
# - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (from Clerk dashboard)
# - CLERK_SECRET_KEY (from Clerk dashboard)
# - NEXT_PUBLIC_SUPABASE_URL (your Supabase project URL)
# - NEXT_PUBLIC_SUPABASE_ANON_KEY (from Supabase dashboard)

# 5. Run development
pnpm dev
```

### Running Individual Apps

```bash
# Web app only
pnpm --filter web dev

# Admin only
pnpm --filter admin dev

# API only
pnpm --filter api dev

# AI service only
pnpm --filter ai dev
```

### Running with Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## Testing

### Unit Tests

```bash
# Run all unit tests
pnpm test

# Run tests for specific package
pnpm --filter @sociolume/ui test

# Run with coverage
pnpm test --coverage
```

### E2E Tests

```bash
# Run E2E tests
pnpm test:e2e

# Run specific test file
pnpm exec playwright test e2e/home.spec.ts
```

## Build

```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter web build
```

## Linting & Type Checking

```bash
# Lint all
pnpm lint

# Typecheck all
pnpm typecheck

# Run both
pnpm check
```

## Common Issues

### Port Already in Use

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Missing Dependencies

```bash
# Clean and reinstall
pnpm clean
pnpm install
```

### Build Errors

```bash
# Clear all caches
rm -rf node_modules/.cache
rm -rf .next
rm -rf apps/*/node_modules/.cache
```

## Deployment

### Environment Variables Required

For production deployment, set these:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `HUBSPOT_API_KEY`
- `WORDPRESS_API_URL`

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy web app
cd apps/web
vercel deploy --prod
```

## Monitoring

### Health Checks

- Web: `GET /api/health`
- API: `GET /health`
- AI: `GET /health`

### Logs

- Vercel dashboard for web apps
- Railway/Render dashboard for API/AI
