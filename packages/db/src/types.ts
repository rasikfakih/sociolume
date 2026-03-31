// Database types for Supabase
// These types mirror the database schema from 001_initial_schema.sql

// =============================================================================
// JSON type for JSONB columns
// =============================================================================

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// =============================================================================
// Enum Types (TypeScript versions of SQL enums)
// =============================================================================

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
export type MemberRole = 'owner' | 'admin' | 'member' | 'viewer';
export type ActivityType = 'user' | 'agency' | 'subscription' | 'crm' | 'settings';
export type ActivityAction = 'created' | 'updated' | 'deleted' | 'login' | 'logout';
export type NotificationType = 'info' | 'warning' | 'error' | 'success';
export type PlanInterval = 'month' | 'year';
export type LeadSource = 'hubspot' | 'manual' | 'import';
export type Platform = 'reddit' | 'news';
export type MentionStatus = 'new' | 'assigned' | 'replied' | 'closed';
export type Sentiment = 'positive' | 'neutral' | 'negative';

// =============================================================================
// Table Row Types
// =============================================================================

// Plans table - pricing plan configurations
export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: PlanInterval;
  features: Json;
  limits: Json;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Agencies table - multi-tenant organizations
export interface Agency {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  website: string | null;
  settings: Json;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Profiles table - user profile data from Clerk
export interface Profile {
  id: string;
  user_id: string | null;
  clerk_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  last_sign_in_at: string | null;
  metadata: Json;
  synced_at: string;
  source: string;
  created_at: string;
  updated_at: string;
}

// Users table - primary user records with agency associations
export interface User {
  id: string;
  profile_id: string | null;
  agency_id: string | null;
  is_primary: boolean;
  role: MemberRole;
  created_at: string;
  updated_at: string;
}

// Agency members table - junction table for user-agency relationships
export interface AgencyMember {
  id: string;
  agency_id: string;
  user_id: string;
  role: MemberRole;
  joined_at: string;
  created_at: string;
  updated_at: string;
}

// Subscriptions table - per-agency subscription tracking
export interface Subscription {
  id: string;
  agency_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

// Usage records table - tracks feature usage by agency
export interface UsageRecord {
  id: string;
  agency_id: string;
  user_id: string | null;
  feature: string;
  count: number;
  period_start: string;
  period_end: string;
  created_at: string;
}

// Activities table - activity logging for audit trails
export interface Activity {
  id: string;
  agency_id: string;
  user_id: string | null;
  type: ActivityType;
  action: ActivityAction;
  description: string | null;
  metadata: Json;
  ip_address: string | null;
  created_at: string;
}

// Notifications table - user notifications
export interface Notification {
  id: string;
  agency_id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  read_at: string | null;
  created_at: string;
}

// CRM leads table - lead storage
export interface CrmLead {
  id: string;
  agency_id: string;
  user_id: string | null;
  email: string;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  phone: string | null;
  status: LeadStatus;
  source: LeadSource | null;
  hubspot_id: string | null;
  hubspot_data: Json | null;
  metadata: Json;
  created_at: string;
  updated_at: string;
}

// Brands table - brands being tracked
export interface Brand {
  id: string;
  agency_id: string;
  name: string;
  slug: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Brand keywords table - keywords to track for a brand
export interface BrandKeyword {
  id: string;
  brand_id: string;
  phrase: string;
  platform: Platform | 'all';
  is_active: boolean;
  created_at: string;
}

// Mentions table - social media mentions
export interface Mention {
  id: string;
  brand_id: string;
  agency_id: string;
  platform: Platform;
  external_id: string;
  url: string;
  title: string | null;
  content: string | null;
  author_handle: string | null;
  sentiment: Sentiment;
  status: MentionStatus;
  assigned_to: string | null;
  platform_created_at: string | null;
  detected_at: string;
  created_at: string;
}

// =============================================================================
// Database Interface (snake_case to match PostgreSQL)
// =============================================================================

export interface Database {
  public: {
    Tables: {
      plans: {
        Row: Plan;
        Insert: Omit<Plan, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Plan, 'id' | 'created_at' | 'updated_at'>>;
      };
      agencies: {
        Row: Agency;
        Insert: Omit<Agency, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Agency, 'id' | 'created_at' | 'updated_at'>>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'synced_at' | 'created_at' | 'updated_at'> & {
          id?: string;
          synced_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Profile, 'id' | 'synced_at' | 'created_at' | 'updated_at'>>;
      };
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
      agency_members: {
        Row: AgencyMember;
        Insert: Omit<AgencyMember, 'id' | 'joined_at' | 'created_at' | 'updated_at'> & {
          id?: string;
          joined_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<AgencyMember, 'id' | 'joined_at' | 'created_at' | 'updated_at'>>;
      };
      subscriptions: {
        Row: Subscription;
        Insert: Omit<Subscription, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Subscription, 'id' | 'created_at' | 'updated_at'>>;
      };
      usage_records: {
        Row: UsageRecord;
        Insert: Omit<UsageRecord, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<UsageRecord, 'id' | 'created_at'>>;
      };
      activities: {
        Row: Activity;
        Insert: Omit<Activity, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Activity, 'id' | 'created_at'>>;
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Notification, 'id' | 'created_at'>>;
      };
      crm_leads: {
        Row: CrmLead;
        Insert: Omit<CrmLead, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<CrmLead, 'id' | 'created_at' | 'updated_at'>>;
      };
      brands: {
        Row: Brand;
        Insert: Omit<Brand, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Brand, 'id' | 'created_at' | 'updated_at'>>;
      };
      brand_keywords: {
        Row: BrandKeyword;
        Insert: Omit<BrandKeyword, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<BrandKeyword, 'id' | 'created_at'>>;
      };
      mentions: {
        Row: Mention;
        Insert: Omit<Mention, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Mention, 'id' | 'created_at'>>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      subscription_status: SubscriptionStatus;
      lead_status: LeadStatus;
      member_role: MemberRole;
      activity_type: ActivityType;
      activity_action: ActivityAction;
      notification_type: NotificationType;
      plan_interval: PlanInterval;
      lead_source: LeadSource;
      platform: Platform;
      mention_status: MentionStatus;
      sentiment: Sentiment;
    };
  };
}

// =============================================================================
// Table Name Constants
// =============================================================================

export const tables = {
  plans: 'plans',
  agencies: 'agencies',
  profiles: 'profiles',
  users: 'users',
  agencyMembers: 'agency_members',
  subscriptions: 'subscriptions',
  usageRecords: 'usage_records',
  activities: 'activities',
  notifications: 'notifications',
  crmLeads: 'crm_leads',
  brands: 'brands',
  brandKeywords: 'brand_keywords',
  mentions: 'mentions',
} as const;

// =============================================================================
// Type Helpers
// =============================================================================

export type TableRow<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type TableInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type TableUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
