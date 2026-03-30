-- =============================================================================
-- Sociolume SaaS Database Schema - Initial Migration
-- Release 2: Supabase Schema Foundation
-- =============================================================================
-- This migration creates the core database schema for the Sociolume multi-tenant
-- SaaS platform, including user management, agency/workspace organization,
-- subscriptions, usage tracking, CRM leads, and activity logging.
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- ENUMS
-- =============================================================================

-- Subscription status enum
CREATE TYPE subscription_status AS ENUM (
    'active',
    'canceled',
    'past_due',
    'trialing',
    'incomplete'
);

-- Lead status enum for CRM
CREATE TYPE lead_status AS ENUM (
    'new',
    'contacted',
    'qualified',
    'proposal',
    'won',
    'lost'
);

-- Member role enum
CREATE TYPE member_role AS ENUM (
    'owner',
    'admin',
    'member',
    'viewer'
);

-- =============================================================================
-- PLANS TABLE
-- =============================================================================
-- Stores pricing plan configurations with features and limits.
-- Used by the subscription system to determine feature access.

CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    interval VARCHAR(10) NOT NULL CHECK (interval IN ('month', 'year')),
    features JSONB NOT NULL DEFAULT '{}',
    limits JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE plans IS 'Pricing plans for the SaaS platform. Contains features and limits JSONB for flexible configuration.';
COMMENT ON COLUMN plans.features IS 'JSON object containing feature flags and descriptions';
COMMENT ON COLUMN plans.limits IS 'JSON object containing usage limits (e.g., max_users, max_api_calls)';

-- =============================================================================
-- AGENCIES TABLE
-- =============================================================================
-- Multi-tenant organization table. Each agency represents a customer workspace
-- with its own settings, users, and subscriptions.

CREATE TABLE agencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    logo_url VARCHAR(512),
    website VARCHAR(512),
    settings JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE agencies IS 'Multi-tenant organizations representing customer workspaces';
COMMENT ON COLUMN agencies.slug IS 'URL-friendly identifier for the agency, used in subdomains';

-- =============================================================================
-- PROFILES TABLE
-- =============================================================================
-- Stores user profile data synced from Clerk authentication.
-- Provides a local cache of Clerk user data for database relationships.

CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    clerk_id VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    image_url VARCHAR(512),
    last_sign_in_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB NOT NULL DEFAULT '{}',
    synced_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    source VARCHAR(50) NOT NULL DEFAULT 'clerk',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE profiles IS 'User profile data synced from Clerk. Acts as local cache for auth provider data';
COMMENT ON COLUMN profiles.clerk_id IS 'Unique Clerk user ID for synchronization';
COMMENT ON COLUMN profiles.source IS 'Auth provider source (clerk, custom, etc.)';

-- =============================================================================
-- USERS TABLE
-- =============================================================================
-- Primary user records with agency associations and roles.
-- Links to profiles for Clerk-synced data.

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    agency_id UUID REFERENCES agencies(id) ON DELETE SET NULL,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    role VARCHAR(50) NOT NULL DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE users IS 'Primary user records with agency membership and roles';
COMMENT ON COLUMN users.is_primary IS 'Whether this is the user''s primary agency';
COMMENT ON COLUMN users.role IS 'Role within the platform: owner, admin, member, or viewer';

-- Add foreign key from profiles to users after users table exists
ALTER TABLE profiles 
    ADD CONSTRAINT fk_profiles_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

-- =============================================================================
-- AGENCY_MEMBERS TABLE
-- =============================================================================
-- Junction table for many-to-many user-agency relationships.
-- Allows users to belong to multiple agencies with different roles.

CREATE TABLE agency_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(agency_id, user_id)
);

COMMENT ON TABLE agency_members IS 'Junction table for many-to-many user-agency relationships with roles';

-- =============================================================================
-- SUBSCRIPTIONS TABLE
-- =============================================================================
-- Per-agency subscription tracking with Stripe integration.
-- Tracks subscription status, billing period, and Stripe IDs.

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,
    status subscription_status NOT NULL DEFAULT 'trialing',
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
    stripe_subscription_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE subscriptions IS 'Per-agency subscription records with Stripe integration';
COMMENT ON COLUMN subscriptions.status IS 'Subscription state: active, canceled, past_due, trialing, incomplete';
COMMENT ON COLUMN subscriptions.stripe_subscription_id IS 'Reference to Stripe subscription for sync';

-- =============================================================================
-- USAGE_RECORDS TABLE
-- =============================================================================
-- Tracks feature usage by agency for billing and limits enforcement.
-- Aggregated periodically to check against plan limits.

CREATE TABLE usage_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    feature VARCHAR(100) NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE usage_records IS 'Tracks feature usage by agency for billing and limits';
COMMENT ON COLUMN usage_records.feature IS 'Feature identifier: api_calls, storage, users, etc.';

-- =============================================================================
-- ACTIVITIES TABLE
-- =============================================================================
-- Activity logging for audit trails and user activity feeds.
-- Tracks all significant actions across the platform.

CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    metadata JSONB NOT NULL DEFAULT '{}',
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE activities IS 'Activity logging for audit trails and activity feeds';
COMMENT ON COLUMN activities.type IS 'Activity category: user, agency, subscription, crm, settings';
COMMENT ON COLUMN activities.action IS 'Action type: created, updated, deleted, login, logout';

-- =============================================================================
-- NOTIFICATIONS TABLE
-- =============================================================================
-- User notifications for in-app alerts and updates.

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL DEFAULT 'info',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE notifications IS 'User notifications for in-app alerts';
COMMENT ON COLUMN notifications.type IS 'Notification type: info, warning, error, success';

-- =============================================================================
-- CRM_LEADS TABLE
-- =============================================================================
-- CRM lead storage for future HubSpot integration and backup.
-- Stores lead data with optional HubSpot sync.

CREATE TABLE crm_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    company VARCHAR(255),
    phone VARCHAR(50),
    status lead_status NOT NULL DEFAULT 'new',
    source VARCHAR(50),
    hubspot_id VARCHAR(255),
    hubspot_data JSONB,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE crm_leads IS 'CRM leads storage for HubSpot backup and sync';
COMMENT ON COLUMN crm_leads.status IS 'Lead status: new, contacted, qualified, proposal, won, lost';
COMMENT ON COLUMN crm_leads.source IS 'Lead source: hubspot, manual, import';
COMMENT ON COLUMN crm_leads.hubspot_data IS 'Cached HubSpot lead data for offline access';

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Users indexes
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_email ON users(email);

-- Agencies indexes
CREATE INDEX idx_agencies_slug ON agencies(slug);
CREATE INDEX idx_agencies_is_active ON agencies(is_active);

-- Agency members indexes
CREATE UNIQUE INDEX idx_agency_members_agency_user ON agency_members(agency_id, user_id);
CREATE INDEX idx_agency_members_user_id ON agency_members(user_id);

-- Subscriptions indexes
CREATE INDEX idx_subscriptions_agency_id ON subscriptions(agency_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_agency_status ON subscriptions(agency_id, status);

-- Usage records indexes
CREATE INDEX idx_usage_records_agency_id ON usage_records(agency_id);
CREATE INDEX idx_usage_records_period_start ON usage_records(period_start);
CREATE INDEX idx_usage_records_agency_period ON usage_records(agency_id, period_start);

-- Activities indexes
CREATE INDEX idx_activities_agency_id ON activities(agency_id);
CREATE INDEX idx_activities_created_at ON activities(created_at);
CREATE INDEX idx_activities_agency_created ON activities(agency_id, created_at);
CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_user_created ON activities(user_id, created_at);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_user_read_created ON notifications(user_id, read, created_at);

-- CRM leads indexes
CREATE INDEX idx_crm_leads_agency_id ON crm_leads(agency_id);
CREATE INDEX idx_crm_leads_status ON crm_leads(status);
CREATE INDEX idx_crm_leads_agency_status ON crm_leads(agency_id, status);
CREATE UNIQUE INDEX idx_crm_leads_email_agency ON crm_leads(email, agency_id);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- PLANS RLS POLICIES
-- =============================================================================

-- Public read for active plans
CREATE POLICY "Public can view active plans" ON plans
    FOR SELECT
    USING (is_active = true);

-- Service role can manage plans
CREATE POLICY "Service role can manage plans" ON plans
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- =============================================================================
-- AGENCIES RLS POLICIES
-- =============================================================================

-- Authenticated users can view their agencies
CREATE POLICY "Users can view their agencies" ON agencies
    FOR SELECT
    USING (
        id IN (
            SELECT agency_id FROM agency_members
            WHERE user_id IN (
                SELECT id FROM users
                WHERE profile_id IN (
                    SELECT id FROM profiles
                    WHERE user_id = auth.uid()
                )
            )
        )
    );

-- Agency owners/admins can update their agency
CREATE POLICY "Agency owners/admins can update" ON agencies
    FOR UPDATE
    USING (
        id IN (
            SELECT agency_id FROM agency_members
            WHERE user_id IN (
                SELECT id FROM users
                WHERE profile_id IN (
                    SELECT id FROM profiles
                    WHERE user_id = auth.uid()
                )
            )
            AND role IN ('owner', 'admin')
        )
    );

-- Service role can manage agencies
CREATE POLICY "Service role can manage agencies" ON agencies
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- =============================================================================
-- PROFILES RLS POLICIES
-- =============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT
    USING (user_id IN (
        SELECT id FROM users
        WHERE profile_id = profiles.id
    ));

-- Service role can manage profiles
CREATE POLICY "Service role can manage profiles" ON profiles
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- =============================================================================
-- USERS RLS POLICIES
-- =============================================================================

-- Users can view users in their agencies
CREATE POLICY "Users can view agency users" ON users
    FOR SELECT
    USING (
        agency_id IN (
            SELECT agency_id FROM agency_members
            WHERE user_id IN (
                SELECT id FROM users
                WHERE profile_id IN (
                    SELECT id FROM profiles
                    WHERE user_id = auth.uid()
                )
            )
        )
    );

-- Agency owners/admins can manage agency members
CREATE POLICY "Agency owners/admins can manage users" ON users
    FOR ALL
    USING (
        agency_id IN (
            SELECT agency_id FROM agency_members
            WHERE user_id IN (
                SELECT id FROM users
                WHERE profile_id IN (
                    SELECT id FROM profiles
                    WHERE user_id = auth.uid()
                )
            )
            AND role IN ('owner', 'admin')
        )
    );

-- Service role can manage users
CREATE POLICY "Service role can manage users" ON users
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- =============================================================================
-- AGENCY_MEMBERS RLS POLICIES
-- =============================================================================

-- Agency members can view other members
CREATE POLICY "Members can view agency" ON agency_members
    FOR SELECT
    USING (
        agency_id IN (
            SELECT agency_id FROM agency_members
            WHERE user_id IN (
                SELECT id FROM users
                WHERE profile_id IN (
                    SELECT id FROM profiles
                    WHERE user_id = auth.uid()
                )
            )
        )
    );

-- Agency owners/admins can manage members
CREATE POLICY "Owners/admins can manage members" ON agency_members
    FOR ALL
    USING (
        agency_id IN (
            SELECT agency_id FROM agency_members
            WHERE user_id IN (
                SELECT id FROM users
                WHERE profile_id IN (
                    SELECT id FROM profiles
                    WHERE user_id = auth.uid()
                )
            )
            AND role IN ('owner', 'admin')
        )
    );

-- Service role can manage agency members
CREATE POLICY "Service role can manage agency_members" ON agency_members
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- =============================================================================
-- SUBSCRIPTIONS RLS POLICIES
-- =============================================================================

-- Agency owners/admins can view subscriptions
CREATE POLICY "Agency can view subscriptions" ON subscriptions
    FOR SELECT
    USING (
        agency_id IN (
            SELECT agency_id FROM agency_members
            WHERE user_id IN (
                SELECT id FROM users
                WHERE profile_id IN (
                    SELECT id FROM profiles
                    WHERE user_id = auth.uid()
                )
            )
            AND role IN ('owner', 'admin')
        )
    );

-- Service role can manage subscriptions
CREATE POLICY "Service role can manage subscriptions" ON subscriptions
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- =============================================================================
-- USAGE_RECORDS RLS POLICIES
-- =============================================================================

-- Agency members can view usage
CREATE POLICY "Agency can view usage" ON usage_records
    FOR SELECT
    USING (
        agency_id IN (
            SELECT agency_id FROM agency_members
            WHERE user_id IN (
                SELECT id FROM users
                WHERE profile_id IN (
                    SELECT id FROM profiles
                    WHERE user_id = auth.uid()
                )
            )
        )
    );

-- Service role can manage usage records
CREATE POLICY "Service role can manage usage_records" ON usage_records
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- =============================================================================
-- ACTIVITIES RLS POLICIES
-- =============================================================================

-- Agency members can view activities
CREATE POLICY "Agency can view activities" ON activities
    FOR SELECT
    USING (
        agency_id IN (
            SELECT agency_id FROM agency_members
            WHERE user_id IN (
                SELECT id FROM users
                WHERE profile_id IN (
                    SELECT id FROM profiles
                    WHERE user_id = auth.uid()
                )
            )
        )
    );

-- Service role can manage activities
CREATE POLICY "Service role can manage activities" ON activities
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- =============================================================================
-- NOTIFICATIONS RLS POLICIES
-- =============================================================================

-- Users can view own notifications
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT
    USING (
        user_id IN (
            SELECT id FROM users
            WHERE profile_id IN (
                SELECT id FROM profiles
                WHERE user_id = auth.uid()
            )
        )
    );

-- Users can update own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE
    USING (
        user_id IN (
            SELECT id FROM users
            WHERE profile_id IN (
                SELECT id FROM profiles
                WHERE user_id = auth.uid()
            )
        )
    );

-- Service role can manage notifications
CREATE POLICY "Service role can manage notifications" ON notifications
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- =============================================================================
-- CRM_LEADS RLS POLICIES
-- =============================================================================

-- Agency members can view leads
CREATE POLICY "Agency can view leads" ON crm_leads
    FOR SELECT
    USING (
        agency_id IN (
            SELECT agency_id FROM agency_members
            WHERE user_id IN (
                SELECT id FROM users
                WHERE profile_id IN (
                    SELECT id FROM profiles
                    WHERE user_id = auth.uid()
                )
            )
        )
    );

-- Agency owners/admins can manage leads
CREATE POLICY "Agency owners/admins can manage leads" ON crm_leads
    FOR ALL
    USING (
        agency_id IN (
            SELECT agency_id FROM agency_members
            WHERE user_id IN (
                SELECT id FROM users
                WHERE profile_id IN (
                    SELECT id FROM profiles
                    WHERE user_id = auth.uid()
                )
            )
            AND role IN ('owner', 'admin')
        )
    );

-- Service role can manage CRM leads
CREATE POLICY "Service role can manage crm_leads" ON crm_leads
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- =============================================================================
-- DEFAULT SEED DATA
-- =============================================================================

-- Insert default pricing plans
INSERT INTO plans (name, price, interval, features, limits) VALUES
('Free', 0, 'month', 
    '{"api_calls": 100, "users": 1, "storage_mb": 100}', 
    '{"api_calls": 100, "users": 1, "storage_mb": 100}'),
('Starter', 29, 'month', 
    '{"api_calls": 1000, "users": 5, "storage_mb": 1000, "hubspot_sync": true}', 
    '{"api_calls": 1000, "users": 5, "storage_mb": 1000}'),
('Professional', 99, 'month', 
    '{"api_calls": 10000, "users": 25, "storage_mb": 10000, "hubspot_sync": true, "analytics": true}', 
    '{"api_calls": 10000, "users": 25, "storage_mb": 10000}'),
('Enterprise', 299, 'month', 
    '{"api_calls": -1, "users": -1, "storage_mb": -1, "hubspot_sync": true, "analytics": true, "priority_support": true, "custom_integrations": true}', 
    '{"api_calls": -1, "users": -1, "storage_mb": -1}')
ON CONFLICT DO NOTHING;

-- =============================================================================
-- FUNCTION: Updated_at trigger
-- =============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all tables with updated_at column
CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agencies_updated_at BEFORE UPDATE ON agencies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agency_members_updated_at BEFORE UPDATE ON agency_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_leads_updated_at BEFORE UPDATE ON crm_leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================
