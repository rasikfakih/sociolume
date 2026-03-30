# Sociolume Roadmap

## Release 1 - Foundation (Current)

**Goal**: Establish the monorepo, auth, and customer dashboard shell

### Completed ✓

- [x] Monorepo setup with TurboRepo
- [x] pnpm workspace configuration
- [x] Shared package infrastructure
- [x] Public marketing site
- [x] Login/Auth foundation with Clerk
- [x] Customer dashboard shell

### In Progress

- [ ] CI/CD pipeline setup

### Status: IN DEVELOPMENT

---

## Release 2 - Supabase Schema Foundation (In Progress)

**Goal**: Connect Supabase database and CRM integration

### Completed ✓

- [x] Supabase database schema
- [x] TypeScript types and helpers

### In Progress

- [ ] User profile sync from Clerk to Supabase
- [ ] HubSpot CRM integration
- [ ] Local CRM backup in Supabase
- [ ] Basic user settings page

### Dependencies

- Release 1 completion

### Status: IN DEVELOPMENT

---

## Release 3 - Content & SEO

**Goal**: WordPress CMS integration and SEO foundation

### Planned

- [ ] WordPress headless client
- [ ] Blog post listing and rendering
- [ ] Landing page content blocks
- [ ] SEO metadata integration
- [ ] Sitemap and robots.txt

### Dependencies

- Release 1 completion

---

## Release 4 - Basic Features

**Goal**: Core business features for first customers

### Planned

- [ ] User profile management
- [ ] Basic subscription display
- [ ] Usage tracking placeholder
- [ ] Activity feed placeholder

### Dependencies

- Release 2 completion

---

## Release 5 - Realtime Features

**Goal**: Live updates and notifications

### Planned

- [ ] Supabase Realtime subscriptions
- [ ] Notification system
- [ ] Live activity indicators
- [ ] WebSocket setup for real-time

### Dependencies

- Release 4 completion

---

## Release 6 - Admin Portal Basic

**Goal**: Basic admin functionality

### Planned

- [ ] Admin authentication
- [ ] User management view
- [ ] Basic analytics display
- [ ] Content management view

### Dependencies

- Release 3 completion

---

## Release 7 - Billing Foundation

**Goal**: Payment integration setup

### Planned

- [ ] Stripe integration
- [ ] Subscription plans
- [ ] Payment history
- [ ] Invoice placeholder

### Dependencies

- Release 6 completion

---

## Release 8 - AI Service Scaffold

**Goal**: ML/AI service infrastructure

### Planned

- [ ] FastAPI service setup
- [ ] Model loading infrastructure
- [ ] API endpoints for predictions
- [ ] Health monitoring

### Dependencies

- Release 1 completion

---

## Release 9 - Analytics Foundation

**Goal**: Usage analytics and reporting

### Planned

- [ ] Usage data collection
- [ ] Dashboard charts
- [ ] Export functionality
- [ ] Report generation

### Dependencies

- Release 7 completion

---

## Release 10 - Enterprise Features

**Goal**: Enterprise-ready features

### Planned

- [ ] SSO/SAML support
- [ ] Team management
- [ ] Role-based access control
- [ ] Audit logging
- [ ] API rate limiting

### Dependencies

- Release 9 completion

---

## Future Ideas (Backlog)

- Mobile app (React Native)
- Browser extension
- Webhook integrations
- Third-party integrations marketplace
- AI-powered insights
- Custom reporting
- White-label options

---

## Version History

| Version | Date | Notes              |
| ------- | ---- | ------------------ |
| 1.0.0   | TBD  | Foundation release |
