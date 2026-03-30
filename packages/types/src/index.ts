// User Types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  subscriptionId?: string;
  subscriptionPlan?: SubscriptionPlan;
  usage?: UsageStats;
  organizationId?: string;
}

// Organization Types
export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  role: OrganizationRole;
  createdAt: string;
}

export type OrganizationRole = 'owner' | 'admin' | 'member' | 'viewer';

// Subscription Types
export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'unpaid';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: BillingInterval;
  features: string[];
  limits: PlanLimits;
}

export type BillingInterval = 'day' | 'week' | 'month' | 'year';

export interface PlanLimits {
  apiCalls: number;
  storage: number;
  teamMembers: number;
}

// Usage Types
export interface UsageStats {
  apiCalls: number;
  storageUsed: number;
  teamMembers: number;
  periodStart: string;
  periodEnd: string;
}

export interface UsageRecord {
  id: string;
  userId: string;
  type: UsageType;
  count: number;
  timestamp: string;
}

export type UsageType = 'api_call' | 'storage_upload' | 'team_invite';

// Activity Types
export interface Activity {
  id: string;
  userId: string;
  type: ActivityType;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export type ActivityType =
  | 'login'
  | 'api_call'
  | 'settings_change'
  | 'team_invite'
  | 'subscription_change';

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

// API Types
export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// CRM Types (HubSpot)
export interface Contact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  hubspotId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  contactId: string;
  status: LeadStatus;
  source?: string;
  score?: number;
  hubspotId?: string;
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost';

export interface Company {
  id: string;
  name: string;
  domain?: string;
  hubspotId?: string;
  createdAt: string;
  updatedAt: string;
}

// CMS Types (WordPress)
export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  author: string;
  featuredImage?: string;
  publishedAt: string;
  modifiedAt: string;
  categories: number[];
  tags: number[];
}

export interface ContentBlock {
  id: string;
  type: string;
  content: string;
  order: number;
}

export interface LandingPage {
  id: number;
  slug: string;
  title: string;
  sections: ContentBlock[];
}

// Analytics Types
export interface AnalyticsData {
  totalApiCalls: number;
  uniqueUsers: number;
  activeSubscriptions: number;
  revenue: number;
  period: string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}
