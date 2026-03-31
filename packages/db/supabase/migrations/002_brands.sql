-- =============================================================================
-- Sociolume SaaS Database Migration - Brands & Mentions
-- Release 2: Brand management and mention tracking
-- =============================================================================
-- This migration creates the brands, brand_keywords, and mentions tables
-- for brand monitoring and social mention tracking functionality.
-- =============================================================================

-- =============================================================================
-- BRANDS TABLE
-- =============================================================================
-- Stores brand entities associated with agencies.
-- Each brand has a name, slug, and active status.

CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(agency_id, slug)
);

COMMENT ON TABLE brands IS 'Brand entities associated with agencies for monitoring';
COMMENT ON COLUMN brands.slug IS 'URL-friendly identifier for the brand';

-- =============================================================================
-- BRAND_KEYWORDS TABLE
-- =============================================================================
-- Stores keywords/phrases to track for each brand across platforms.
-- Supports tracking specific phrases on Reddit, News, or all platforms.

CREATE TABLE brand_keywords (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    phrase VARCHAR(255) NOT NULL,
    platform VARCHAR(20) NOT NULL DEFAULT 'all'
        CHECK (platform IN ('reddit', 'news', 'all')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE brand_keywords IS 'Keywords and phrases to track for each brand';
COMMENT ON COLUMN brand_keywords.platform IS 'Platform to track: reddit, news, or all';

-- =============================================================================
-- MENTIONS TABLE
-- =============================================================================
-- Stores social media mentions and news articles mentioning brands.
-- Tracks sentiment, status, and assignment for workflow management.

CREATE TABLE mentions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    platform VARCHAR(20) NOT NULL 
        CHECK (platform IN ('reddit', 'news')),
    external_id VARCHAR(512) NOT NULL,
    url TEXT NOT NULL,
    title TEXT,
    content TEXT,
    author_handle VARCHAR(255),
    sentiment VARCHAR(10) NOT NULL DEFAULT 'neutral'
        CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    status VARCHAR(20) NOT NULL DEFAULT 'new'
        CHECK (status IN ('new', 'assigned', 'replied', 'closed')),
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    platform_created_at TIMESTAMP WITH TIME ZONE,
    detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(brand_id, platform, external_id)
);

COMMENT ON TABLE mentions IS 'Social media mentions and news articles for brands';
COMMENT ON COLUMN mentions.platform IS 'Platform source: reddit or news';
COMMENT ON COLUMN mentions.sentiment IS 'Sentiment analysis: positive, neutral, negative';
COMMENT ON COLUMN mentions.status IS 'Workflow status: new, assigned, replied, closed';

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Brands indexes
CREATE INDEX idx_brands_agency_id ON brands(agency_id);
CREATE INDEX idx_brands_slug ON brands(slug);
CREATE INDEX idx_brands_is_active ON brands(is_active);
CREATE INDEX idx_brands_agency_slug ON brands(agency_id, slug);

-- Brand keywords indexes
CREATE INDEX idx_brand_keywords_brand_id ON brand_keywords(brand_id);
CREATE INDEX idx_brand_keywords_phrase ON brand_keywords(phrase);
CREATE INDEX idx_brand_keywords_platform ON brand_keywords(platform);
CREATE INDEX idx_brand_keywords_is_active ON brand_keywords(is_active);

-- Mentions indexes
CREATE INDEX idx_mentions_brand_id ON mentions(brand_id);
CREATE INDEX idx_mentions_agency_id ON mentions(agency_id);
CREATE INDEX idx_mentions_platform ON mentions(platform);
CREATE INDEX idx_mentions_status ON mentions(status);
CREATE INDEX idx_mentions_sentiment ON mentions(sentiment);
CREATE INDEX idx_mentions_assigned_to ON mentions(assigned_to);
CREATE INDEX idx_mentions_detected_at ON mentions(detected_at);
CREATE INDEX idx_mentions_agency_detected ON mentions(agency_id, detected_at);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all new tables
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentions ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- BRANDS RLS POLICIES
-- =============================================================================

-- Agency members can view their brands
CREATE POLICY "Agency members can view brands" ON brands
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

-- Agency owners/admins can manage brands
CREATE POLICY "Agency owners/admins can manage brands" ON brands
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

-- Service role can manage brands
CREATE POLICY "Service role can manage brands" ON brands
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- =============================================================================
-- BRAND_KEYWORDS RLS POLICIES
-- =============================================================================

-- Agency members can view brand keywords
CREATE POLICY "Agency members can view brand keywords" ON brand_keywords
    FOR SELECT
    USING (
        brand_id IN (
            SELECT id FROM brands
            WHERE agency_id IN (
                SELECT agency_id FROM agency_members
                WHERE user_id IN (
                    SELECT id FROM users
                    WHERE profile_id IN (
                        SELECT id FROM profiles
                        WHERE user_id = auth.uid()
                    )
                )
            )
        )
    );

-- Agency owners/admins can manage brand keywords
CREATE POLICY "Agency owners/admins can manage brand keywords" ON brand_keywords
    FOR ALL
    USING (
        brand_id IN (
            SELECT id FROM brands
            WHERE agency_id IN (
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
        )
    );

-- Service role can manage brand keywords
CREATE POLICY "Service role can manage brand keywords" ON brand_keywords
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- =============================================================================
-- MENTIONS RLS POLICIES
-- =============================================================================

-- Agency members can view mentions
CREATE POLICY "Agency members can view mentions" ON mentions
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

-- Agency owners/admins can manage mentions
CREATE POLICY "Agency owners/admins can manage mentions" ON mentions
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

-- Service role can manage mentions
CREATE POLICY "Service role can manage mentions" ON mentions
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Apply updated_at trigger to brands table
-- Uses the same pattern as other tables in 001_initial_schema.sql
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================
