import { getSupabaseClient, getSupabaseAdmin } from './client';
import { tables } from './types';
import type { Json, Plan, Agency, Profile, User, AgencyMember, Subscription, UsageRecord, Activity, Notification, CrmLead, MemberRole, SubscriptionStatus, ActivityType, LeadStatus, LeadSource, NotificationType } from './types';

// Use any type for Supabase client to bypass type inference issues
type DbClient = any;

// =============================================================================
// Plans Helpers
// =============================================================================

/**
 * Get all active plans
 */
export async function getPlans(client?: DbClient) {
  const supabase = client || getSupabaseClient();
  const { data, error } = await supabase
    .from(tables.plans)
    .select('*')
    .eq('is_active', true)
    .order('price', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Get plan by ID
 */
export async function getPlanById(id: string, client?: DbClient) {
  const supabase = client || getSupabaseClient();
  const { data, error } = await supabase.from(tables.plans).select('*').eq('id', id).single();

  if (error) throw error;
  return data as Plan | null;
}

/**
 * Create a new plan
 */
export async function createPlan(
  plan: {
    name: string;
    price: number;
    interval: 'month' | 'year';
    features: Json;
    limits: Json;
    is_active?: boolean;
  },
  client?: DbClient
) {
  const supabase = client || getSupabaseAdmin();
  const { data, error } = await supabase.from(tables.plans).insert(plan).select().single();

  if (error) throw error;
  return data as Plan;
}

/**
 * Update a plan
 */
export async function updatePlan(
  id: string,
  updates: Partial<{
    name: string;
    price: number;
    interval: 'month' | 'year';
    features: Json;
    limits: Json;
    is_active: boolean;
  }>,
  client?: DbClient
) {
  const supabase = client || getSupabaseAdmin();
  const { data, error } = await supabase
    .from(tables.plans)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Plan;
}

// =============================================================================
// Agencies Helpers
// =============================================================================

/**
 * Get all agencies
 */
export async function getAgencies(client?: DbClient) {
  const supabase = client || getSupabaseClient();
  const { data, error } = await supabase
    .from(tables.agencies)
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Get agency by ID
 */
export async function getAgencyById(id: string, client?: DbClient) {
  const supabase = client || getSupabaseClient();
  const { data, error } = await supabase.from(tables.agencies).select('*').eq('id', id).single();

  if (error) throw error;
  return data as Agency | null;
}

/**
 * Get agency by slug (unique)
 */
export async function getAgencyBySlug(slug: string, client?: DbClient) {
  const supabase = client || getSupabaseClient();
  const { data, error } = await supabase
    .from(tables.agencies)
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data as Agency | null;
}

/**
 * Create a new agency
 */
export async function createAgency(
  agency: {
    name: string;
    slug: string;
    logo_url?: string | null;
    website?: string | null;
    settings?: Json;
    is_active?: boolean;
  },
  client?: DbClient
) {
  const supabase = client || getSupabaseAdmin();
  const { data, error } = await supabase.from(tables.agencies).insert(agency).select().single();

  if (error) throw error;
  return data as Agency;
}

/**
 * Update an agency
 */
export async function updateAgency(
  id: string,
  updates: Partial<{
    name: string;
    slug: string;
    logo_url: string | null;
    website: string | null;
    settings: Json;
    is_active: boolean;
  }>,
  client?: DbClient
) {
  const supabase = client || getSupabaseAdmin();
  const { data, error } = await supabase
    .from(tables.agencies)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Agency;
}

/**
 * Soft delete agency
 */
export async function deleteAgency(id: string, client?: DbClient) {
  const supabase = client || getSupabaseAdmin();
  const { data, error } = await supabase
    .from(tables.agencies)
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Agency;
}

// =============================================================================
// Profiles Helpers (Clerk sync)
// =============================================================================

/**
 * Get profile by Clerk ID
 */
export async function getProfileByClerkId(clerkId: string, client?: DbClient) {
  const supabase = client || getSupabaseClient();
  const { data, error } = await supabase
    .from(tables.profiles)
    .select('*')
    .eq('clerk_id', clerkId)
    .single();

  if (error) throw error;
  return data as Profile | null;
}

/**
 * Get profile by user ID
 */
export async function getProfileByUserId(userId: string, client?: DbClient) {
  const supabase = client || getSupabaseClient();
  const { data, error } = await supabase
    .from(tables.profiles)
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data as Profile | null;
}

/**
 * Create profile with Clerk data
 */
export async function createProfile(
  profile: {
    clerk_id: string;
    user_id?: string | null;
    email: string;
    first_name?: string | null;
    last_name?: string | null;
    image_url?: string | null;
    last_sign_in_at?: string | null;
    metadata?: Json;
    synced_at?: string;
    source?: string;
  },
  client?: DbClient
) {
  const supabase = client || getSupabaseAdmin();
  const { data, error } = await supabase
    .from(tables.profiles)
    .insert(profile)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

/**
 * Update profile
 */
export async function updateProfile(
  id: string,
  updates: Partial<{
    clerk_id: string;
    user_id: string | null;
    email: string;
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
    last_sign_in_at: string | null;
    metadata: Json;
    synced_at: string;
    source: string;
  }>,
  client?: DbClient
) {
  const supabase = client || getSupabaseAdmin();
  const { data, error } = await supabase
    .from(tables.profiles)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

/**
 * Sync/upsert from Clerk webhook
 */
export async function syncProfileFromClerk(
  clerkId: string,
  data: {
    email: string;
    first_name?: string;
    last_name?: string;
    image_url?: string;
    metadata?: Json;
  },
  client?: DbClient
) {
  // Check if profile exists
  const existing = await getProfileByClerkId(clerkId, client);

  if (existing) {
    // Update existing profile
    return updateProfile(
      existing.id,
      {
        email: data.email,
        first_name: data.first_name || null,
        last_name: data.last_name || null,
        image_url: data.image_url || null,
        metadata: data.metadata || null,
        synced_at: new Date().toISOString(),
      },
      client
    );
  }

  // Create new profile
  return createProfile(
    {
      clerk_id: clerkId,
      email: data.email,
      first_name: data.first_name || null,
      last_name: data.last_name || null,
      image_url: data.image_url || null,
      metadata: data.metadata || null,
      synced_at: new Date().toISOString(),
      source: 'clerk',
    },
    client
  );
}

// =============================================================================
// Users Helpers
// =============================================================================

/**
 * Get user by ID
 */
export async function getUserById(id: string, client?: DbClient) {
  const supabase = client || getSupabaseClient();
  const { data, error } = await supabase
    .from(tables.users)
    .select('*, profile:profiles(*), agency:agencies(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get user by profile ID
 */
export async function getUserByProfileId(profileId: string, client?: DbClient) {
  const supabase = client || getSupabaseClient();
  const { data, error } = await supabase
    .from(tables.users)
    .select('*, profile:profiles(*), agency:agencies(*)')
    .eq('profile_id', profileId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get all users in agency
 */
export async function getUsersByAgency(agencyId: string, client?: DbClient) {
  const supabase = client || getSupabaseClient();
  const { data, error } = await supabase
    .from(tables.users)
    .select('*, profile:profiles(*)')
    .eq('agency_id', agencyId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Create new user
 */
export async function createUser(
  user: {
    profile_id?: string | null;
    agency_id?: string | null;
    is_primary?: boolean;
    role?: MemberRole;
  },
  client?: DbClient
) {
  const supabase = client || getSupabaseAdmin();
  const { data, error } = await supabase.from(tables.users).insert(user).select().single();

  if (error) throw error;
  return data as User;
}

/**
 * Update user
 */
export async function updateUser(
  id: string,
  updates: Partial<{
    profile_id: string | null;
    agency_id: string | null;
    is_primary: boolean;
    role: MemberRole;
  }>,
  client?: DbClient
) {
  const supabase = client || getSupabaseAdmin();
  const { data, error } = await supabase
    .from(tables.users)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

/**
 * Set primary agency for user
 */
export async function setUserPrimaryAgency(userId: string, agencyId: string, client?: DbClient) {
  const supabase = client || getSupabaseAdmin();

  // First, set all user's agencies to non-primary
  await supabase
    .from(tables.users)
    .update({ is_primary: false })
    .eq('user_id', userId);

  // Then set the specified agency as primary
  const { data, error } = await supabase
    .from(tables.users)
    .update({
      agency_id: agencyId,
      is_primary: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

// =============================================================================
// Agency Members Helpers
// =============================================================================

/**
 * Get all members of agency
 */
export async function getAgencyMembers(agencyId: string, client?: DbClient) {
  const supabase = client || getSupabaseClient();
  const { data, error } = await supabase
    .from(tables.agencyMembers)
    .select('*, user:users(*), profile:profiles(*)')
    .eq('agency_id', agencyId)
    .order('joined_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Get all agencies a user belongs to
 */
export async function getUserAgencies(userId: string, client?: DbClient) {
  const supabase = client || getSupabaseClient();
  const { data, error } = await supabase
    .from(tables.agencyMembers)
    .select('*, agency:agencies(*)')
    .eq('user_id', userId)
    .order('joined_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Add user to agency
 */
export async function addAgencyMember(
  data: {
    agency_id: string;
    user_id: string;
    role?: MemberRole;
  },
  client?: DbClient
) {
  const supabase = client || getSupabaseAdmin();
  const { data: member, error } = await supabase
    .from(tables.agencyMembers)
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return member as AgencyMember;
}

/**
 * Update member role
 */
export async function updateAgencyMemberRole(
  agencyId: string,
  userId: string,
  role: MemberRole,
  client?: DbClient
) {
  const supabase = client || getSupabaseAdmin();
  const { data, error } = await supabase
    .from(tables.agencyMembers)
    .update({ role, updated_at: new Date().toISOString() })
    .eq('agency_id', agencyId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as AgencyMember;
}

/**
 * Remove user from agency
 */
export async function removeAgencyMember(agencyId: string, userId: string, client?: DbClient) {
  const supabase = client || getSupabaseAdmin();
  const { error } = await supabase
    .from(tables.agencyMembers)
    .delete()
    .eq('agency_id', agencyId)
    .eq('user_id', userId);

  if (error) throw error;
  return { success: true };
}

/**
 * Check if user is agency member
 */
export async function isUserAgencyMember(userId: string, agencyId: string, client?: DbClient) {
  const supabase = client || getSupabaseClient();
  const { data, error } = await supabase
    .from(tables.agencyMembers)
    .select('id')
    .eq('agency_id', agencyId)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return false;
    }
    throw error;
  }
  return !!data;
}

// =============================================================================
// Subscriptions Helpers
// =============================================================================

/**
 * Get agency's active subscription
 */
export async function getSubscriptionByAgency(agencyId: string, client?: DbClient) {
  const supabase = client || getSupabaseClient();
  const { data, error } = await supabase
    .from(tables.subscriptions)
    .select('*, plan:plans(*)')
    .eq('agency_id', agencyId)
    .eq('status', 'active')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }
  return data;
}

/**
 * Get subscription by ID
 */
export async function getSubscriptionById(id: string, client?: DbClient) {
  const supabase = client || getSupabaseClient();
  const { data, error } = await supabase
    .from(tables.subscriptions)
    .select('*, plan:plans(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Create subscription
 */
export async function createSubscription(
  subscription: {
    agency_id: string;
    plan_id: string;
    status: SubscriptionStatus;
    current_period_start: string;
    current_period_end: string;
    cancel_at_period_end?: boolean;
    stripe_subscription_id?: string | null;
  },
  client?: DbClient
) {
  const supabase = client || getSupabaseAdmin();
  const { data, error } = await supabase
    .from(tables.subscriptions)
    .insert(subscription)
    .select()
    .single();

  if (error) throw error;
  return data as Subscription;
}

/**
 * Update subscription
 */
export async function updateSubscription(
  id: string,
  updates: Partial<{
    agency_id: string;
    plan_id: string;
    status: SubscriptionStatus;
    current_period_start: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
    stripe_subscription_id: string | null;
  }>,
  client?: DbClient
) {
  const supabase = client || getSupabaseAdmin();
  const { data, error } = await supabase
    .from(tables.subscriptions)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Subscription;
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(id: string, client?: DbClient) {
  const supabase = client || getSupabaseAdmin();
  const { data, error } = await supabase
    .from(tables.subscriptions)
    .update({
      status: 'canceled',
      cancel_at_period_end: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Subscription;
}

// =============================================================================
// Usage Records Helpers
// =============================================================================

/**
 * Record usage for a feature
 */
export async function recordUsage(
  data: {
    agency_id: string;
    user_id?: string | null;
    feature: string;
    count: number;
    period_start: string;
    period_end: string;
  },
  client?: DbClient
) {
  const supabase = client || getSupabaseClient();
  const { data: record, error } = await supabase
    .from(tables.usageRecords)
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return record as UsageRecord;
}

/**
 * Get usage for agency
 */
export async function getAgencyUsage(
  agencyId: string,
  feature?: string,
  periodStart?: string,
  periodEnd?: string,
  client?: DbClient
) {
  const supabase = client || getSupabaseClient();
  let query = supabase
    .from(tables.usageRecords)
    .select('*')
    .eq('agency_id', agencyId);

  if (feature) {
    query = query.eq('feature', feature);
  }
  if (periodStart) {
    query = query.gte('period_start', periodStart);
  }
  if (periodEnd) {
    query = query.lte('period_end', periodEnd);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return (data as UsageRecord[]) || [];
}

/**
 * Get usage for user
 */
export async function getUserUsage(
  userId: string,
  feature?: string,
  periodStart?: string,
  periodEnd?: string,
  client?: DbClient
) {
  const supabase = client || getSupabaseClient();
  let query = supabase
    .from(tables.usageRecords)
    .select('*')
    .eq('user_id', userId);

  if (feature) {
    query = query.eq('feature', feature);
  }
  if (periodStart) {
    query = query.gte('period_start', periodStart);
  }
  if (periodEnd) {
    query = query.lte('period_end', periodEnd);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return (data as UsageRecord[]) || [];
}

/**
 * Get usage summary for agency
 */
export async function getUsageSummary(
  agencyId: string,
  periodStart?: string,
  periodEnd?: string,
  client?: DbClient
) {
  const supabase = client || getSupabaseClient();
  let query = supabase
    .from(tables.usageRecords)
    .select('feature, count, period_start, period_end')
    .eq('agency_id', agencyId);

  if (periodStart) {
    query = query.gte('period_start', periodStart);
  }
  if (periodEnd) {
    query = query.lte('period_end', periodEnd);
  }

  const { data, error } = await query;

  if (error) throw error;

  // Group by feature and sum counts
  const summary: Record<string, { total: number; period_start: string; period_end: string }> = {};

  for (const record of data || []) {
    const rec = record as { feature: string; count: number; period_start: string; period_end: string };
    if (!summary[rec.feature]) {
      summary[rec.feature] = {
        total: 0,
        period_start: rec.period_start,
        period_end: rec.period_end,
      };
    }
    summary[rec.feature]!.total += rec.count;
  }

  return summary;
}

// =============================================================================
// Activities Helpers
// =============================================================================

/**
 * Log an activity
 */
export async function createActivity(
  data: {
    agency_id: string;
    user_id?: string | null;
    type: ActivityType;
    action: 'created' | 'updated' | 'deleted' | 'login' | 'logout';
    description?: string | null;
    metadata?: Json;
    ip_address?: string | null;
  },
  client?: DbClient
) {
  const supabase = client || getSupabaseClient();
  const { data: activity, error } = await supabase
    .from(tables.activities)
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return activity as Activity;
}

/**
 * Get agency activities
 */
export async function getAgencyActivities(
  agencyId: string,
  limit = 50,
  offset = 0,
  client?: DbClient
) {
  const supabase = client || getSupabaseClient();
  const { data, error } = await supabase
    .from(tables.activities)
    .select('*, user:users(*), profile:profiles(*)')
    .eq('agency_id', agencyId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return (data as Activity[]) || [];
}

/**
 * Get user activities
 */
export async function getUserActivities(
  userId: string,
  limit = 50,
  offset = 0,
  client?: DbClient
) {
  const supabase = client || getSupabaseClient();
  const { data, error } = await supabase
    .from(tables.activities)
    .select('*, agency:agencies(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return (data as Activity[]) || [];
}

/**
 * Get activities by type
 */
export async function getActivitiesByType(
  agencyId: string,
  type: ActivityType,
  limit = 50,
  client?: DbClient
) {
  const supabase = client || getSupabaseClient();
  const { data, error } = await supabase
    .from(tables.activities)
    .select('*, user:users(*), profile:profiles(*)')
    .eq('agency_id', agencyId)
    .eq('type', type)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as Activity[]) || [];
}

// =============================================================================
// Notifications Helpers
// =============================================================================

/**
 * Create notification
 */
export async function createNotification(
  data: {
    agency_id: string;
    user_id: string;
    type: NotificationType;
    title: string;
    message: string;
    read?: boolean;
    read_at?: string | null;
  },
  client?: DbClient
) {
  const supabase = client || getSupabaseClient();
  const { data: notification, error } = await supabase
    .from(tables.notifications)
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return notification as Notification;
}

/**
 * Get user notifications
 */
export async function getUserNotifications(
  userId: string,
  unreadOnly = false,
  limit = 50,
  client?: DbClient
) {
  const supabase = client || getSupabaseClient();
  let query = supabase
    .from(tables.notifications)
    .select('*, agency:agencies(*)')
    .eq('user_id', userId);

  if (unreadOnly) {
    query = query.eq('read', false);
  }

  const { data, error } = await query.order('created_at', { ascending: false }).limit(limit);

  if (error) throw error;
  return (data as Notification[]) || [];
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(id: string, client?: DbClient) {
  const supabase = client || getSupabaseClient();
  const { data, error } = await supabase
    .from(tables.notifications)
    .update({ read: true, read_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Notification;
}

/**
 * Mark all notifications as read for user
 */
export async function markAllNotificationsAsRead(userId: string, client?: DbClient) {
  const supabase = client || getSupabaseClient();
  const { data, error } = await supabase
    .from(tables.notifications)
    .update({ read: true, read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('read', false)
    .select();

  if (error) throw error;
  return (data as Notification[]) || [];
}

/**
 * Delete notification
 */
export async function deleteNotification(id: string, client?: DbClient) {
  const supabase = client || getSupabaseClient();
  const { error } = await supabase.from(tables.notifications).delete().eq('id', id);

  if (error) throw error;
  return { success: true };
}

// =============================================================================
// CRM Leads Helpers
// =============================================================================

/**
 * Create lead
 */
export async function createLead(
  data: {
    agency_id: string;
    user_id?: string | null;
    email: string;
    first_name?: string | null;
    last_name?: string | null;
    company?: string | null;
    phone?: string | null;
    status?: LeadStatus;
    source?: LeadSource | null;
    hubspot_id?: string | null;
    hubspot_data?: Json | null;
    metadata?: Json;
  },
  client?: DbClient
) {
  const supabase = client || getSupabaseAdmin();
  const { data: lead, error } = await supabase
    .from(tables.crmLeads)
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return lead as CrmLead;
}

/**
 * Get agency leads
 */
export async function getLeadsByAgency(
  agencyId: string,
  status?: LeadStatus,
  limit = 50,
  offset = 0,
  client?: DbClient
) {
  const supabase = client || getSupabaseClient();
  let query = supabase
    .from(tables.crmLeads)
    .select('*, user:users(*), profile:profiles(*)')
    .eq('agency_id', agencyId);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return (data as CrmLead[]) || [];
}

/**
 * Get lead by ID
 */
export async function getLeadById(id: string, client?: DbClient) {
  const supabase = client || getSupabaseClient();
  const { data, error } = await supabase
    .from(tables.crmLeads)
    .select('*, user:users(*), profile:profiles(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as CrmLead | null;
}

/**
 * Update lead
 */
export async function updateLead(
  id: string,
  updates: Partial<{
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
  }>,
  client?: DbClient
) {
  const supabase = client || getSupabaseAdmin();
  const { data, error } = await supabase
    .from(tables.crmLeads)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as CrmLead;
}

/**
 * Delete lead
 */
export async function deleteLead(id: string, client?: DbClient) {
  const supabase = client || getSupabaseAdmin();
  const { error } = await supabase.from(tables.crmLeads).delete().eq('id', id);

  if (error) throw error;
  return { success: true };
}

/**
 * Sync lead from HubSpot
 */
export async function syncLeadFromHubspot(
  agencyId: string,
  hubspotData: {
    hubspot_id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    company?: string;
    phone?: string;
    metadata?: Json;
  },
  client?: DbClient
) {
  const supabase = client || getSupabaseAdmin();

  // Check if lead with this hubspot_id exists
  const { data: existing } = await supabase
    .from(tables.crmLeads)
    .select('id')
    .eq('agency_id', agencyId)
    .eq('hubspot_id', hubspotData.hubspot_id)
    .single();

  if (existing && existing.id) {
    // Update existing lead
    return updateLead(
      existing.id,
      {
        email: hubspotData.email,
        first_name: hubspotData.first_name || null,
        last_name: hubspotData.last_name || null,
        company: hubspotData.company || null,
        phone: hubspotData.phone || null,
        hubspot_data: hubspotData.metadata || null,
        source: 'hubspot',
      },
      client
    );
  }

  // Create new lead
  return createLead(
    {
      agency_id: agencyId,
      email: hubspotData.email,
      first_name: hubspotData.first_name || null,
      last_name: hubspotData.last_name || null,
      company: hubspotData.company || null,
      phone: hubspotData.phone || null,
      status: 'new',
      source: 'hubspot',
      hubspot_id: hubspotData.hubspot_id,
      hubspot_data: hubspotData.metadata || null,
    },
    client
  );
}

// =============================================================================
// Legacy/User helpers (backwards compatibility)
// =============================================================================

/**
 * Get user by Clerk ID (legacy)
 * @deprecated Use getProfileByClerkId instead
 */
export async function getUserByClerkId(clerkId: string, client?: DbClient) {
  const supabase = client || getSupabaseClient();
  const { data, error } = await supabase
    .from(tables.profiles)
    .select('*')
    .eq('clerk_id', clerkId)
    .single();

  if (error) throw error;
  return data as Profile | null;
}

/**
 * Get subscription by user ID (legacy)
 * @deprecated Use getSubscriptionByAgency instead
 */
export async function getSubscriptionByUserId(userId: string, client?: DbClient) {
  const supabase = client || getSupabaseClient();
  const { data, error } = await supabase
    .from(tables.subscriptions)
    .select('*, plans(*)')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get leads (legacy)
 * @deprecated Use getLeadsByAgency instead
 */
export async function getLeads(client?: DbClient) {
  const supabase = client || getSupabaseClient();
  const { data, error } = await supabase
    .from(tables.crmLeads)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as CrmLead[]) || [];
}

/**
 * Create user (legacy)
 * @deprecated Use createUser with profile instead
 */
export async function createUserLegacy(
  user: {
    clerk_id: string;
    email: string;
    first_name?: string;
    last_name?: string;
  },
  client?: DbClient
) {
  const supabase = client || getSupabaseAdmin();
  const { data, error } = await supabase
    .from(tables.users)
    .insert({
      clerk_id: user.clerk_id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update user (legacy)
 * @deprecated Use updateUser instead
 */
export async function updateUserLegacy(
  clerkId: string,
  updates: Partial<{ first_name: string; last_name: string; image_url: string }>,
  client?: DbClient
) {
  const supabase = client || getSupabaseAdmin();
  const { data, error } = await supabase
    .from(tables.users)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('clerk_id', clerkId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Record usage (legacy)
 * @deprecated Use recordUsage with new signature
 */
export async function recordUsageLegacy(
  userId: string,
  type: string,
  count: number = 1,
  client?: DbClient
) {
  const supabase = client || getSupabaseClient();
  const { data, error } = await supabase
    .from(tables.usageRecords)
    .insert({
      user_id: userId,
      feature: type,
      count,
      agency_id: '', // Will need to be set
      period_start: new Date().toISOString(),
      period_end: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get user usage (legacy)
 * @deprecated Use getUserUsage with new signature
 */
export async function getUserUsageLegacy(userId: string, client?: DbClient) {
  const supabase = client || getSupabaseClient();
  const { data, error } = await supabase.from(tables.usageRecords).select('*').eq('user_id', userId);

  if (error) throw error;
  return (data as UsageRecord[]) || [];
}

/**
 * Create activity (legacy)
 * @deprecated Use createActivity with new signature
 */
export async function createActivityLegacy(
  userId: string,
  type: string,
  description: string,
  metadata?: Record<string, unknown>,
  client?: DbClient
) {
  const supabase = client || getSupabaseClient();
  const { data, error } = await supabase
    .from(tables.activities)
    .insert({
      user_id: userId,
      type,
      action: 'created',
      description,
      metadata,
      agency_id: '', // Will need to be set
    })
    .select()
    .single();

  if (error) throw error;
  return data as Activity;
}

/**
 * Get user activities (legacy)
 * @deprecated Use getUserActivities with new signature
 */
export async function getUserActivitiesLegacy(userId: string, limit = 10, client?: DbClient) {
  const supabase = client || getSupabaseClient();
  const { data, error } = await supabase
    .from(tables.activities)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as Activity[]) || [];
}

/**
 * Get user notifications (legacy)
 * @deprecated Use getUserNotifications with new signature
 */
export async function getUserNotificationsLegacy(userId: string, client?: DbClient) {
  const supabase = client || getSupabaseClient();
  const { data, error } = await supabase
    .from(tables.notifications)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as Notification[]) || [];
}

/**
 * Create lead (legacy)
 * @deprecated Use createLead with new signature
 */
export async function createLeadLegacy(
  lead: {
    email: string;
    first_name?: string;
    last_name?: string;
    company?: string;
    source?: string;
  },
  client?: DbClient
) {
  const supabase = client || getSupabaseAdmin();
  const { data, error } = await supabase.from(tables.crmLeads).insert(lead).select().single();

  if (error) throw error;
  return data as CrmLead;
}
