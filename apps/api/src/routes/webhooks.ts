/**
 * Clerk Webhook Handler for Sociolume Release 2.1
 * 
 * This module handles webhook events from Clerk for user management:
 * - user.created: Creates profile, agency, user, and membership
 * - user.updated: Updates profile and user data
 * - user.deleted: Logs deletion events (no data deletion in v1)
 * 
 * ENVIRONMENT VARIABLES REQUIRED:
 * - CLERK_WEBHOOK_SECRET: The webhook secret from Clerk dashboard
 *   Get this from Clerk Dashboard > Webhooks > Your webhook > Secret
 *   Format: whsec_...
 * - NEXT_PUBLIC_SUPABASE_URL: Supabase project URL
 * - SUPABASE_SERVICE_ROLE_KEY: Supabase service role key (bypasses RLS)
 * 
 * ENDPOINT:
 * POST /api/webhooks/clerk
 * 
 * SIGNATURE VERIFICATION:
 * Uses Svix library to verify webhook signatures via headers:
 * - svix-id: Unique message ID
 * - svix-timestamp: Unix timestamp
 * - svix-signature: HMAC-SHA256 signature
 * 
 * IDEMPOTENCY:
 * All handlers check for existing records before creating new ones
 * to handle duplicate webhook deliveries gracefully.
 */
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Webhook } from 'svix';
import { createClient } from '@supabase/supabase-js';
import type { Json } from '@sociolume/db';
import { logger } from '../utils/logger.js';

// =============================================================================
// Supabase Admin Client (bypasses RLS)
// =============================================================================

// Using any type to bypass strict schema typing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let supabaseAdmin: any = null;

function createSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set'
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    supabaseAdmin = createSupabaseAdmin();
  }
  return supabaseAdmin;
}

// =============================================================================
// Types for Clerk Webhook Events
// =============================================================================

interface ClerkUserData {
  id: string;
  email_addresses: Array<{
    id: string;
    email_address: string;
  }>;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  last_sign_in_at: number | null;
  metadata: Record<string, unknown>;
}

interface ClerkWebhookEvent {
  type: 'user.created' | 'user.updated' | 'user.deleted';
  data: ClerkUserData;
}

// =============================================================================
// Helper Functions (using Admin Client)
// =============================================================================

/**
 * Generate a URL-friendly slug from agency name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Get primary email from Clerk user data
 */
function getPrimaryEmail(userData: ClerkUserData): string {
  const emailEntry = userData.email_addresses[0];
  return emailEntry?.email_address || '';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ProfileRecord extends Record<string, any> {
  id: string;
  clerk_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  metadata: Json;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface AgencyRecord extends Record<string, any> {
  id: string;
  name: string;
  slug: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface UserRecord extends Record<string, any> {
  id: string;
  profile_id: string;
  agency_id: string;
  role: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface AgencyMemberRecord extends Record<string, any> {
  id: string;
  agency_id: string;
  user_id: string;
  role: string;
}

/**
 * Get profile by Clerk ID using admin client
 */
async function getProfileByClerkIdAdmin(): Promise<ProfileRecord | null> {
  const supabase = getSupabaseAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clerkId = (globalThis as any).__clerkId;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('clerk_id', clerkId)
    .single();

  if (error && error.code !== 'PGRST116') {
    logger.error({ error, clerkId }, 'Error fetching profile by clerk ID');
    throw error;
  }

  return data;
}

/**
 * Upsert profile from Clerk data using admin client
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function upsertProfileFromClerkAdmin(clerkId: string, profileData: any): Promise<ProfileRecord> {
  const supabase = getSupabaseAdmin();

  const now = new Date().toISOString();
  const profilePayload = {
    clerk_id: clerkId,
    email: profileData.email,
    first_name: profileData.first_name || null,
    last_name: profileData.last_name || null,
    image_url: profileData.image_url || null,
    metadata: profileData.metadata || {},
    source: 'clerk_webhook',
    synced_at: now,
    last_sign_in_at: now,
  };

  const { data, error } = await supabase
    .from('profiles')
    .upsert(profilePayload, {
      onConflict: 'clerk_id',
    })
    .select()
    .single();

  if (error) {
    logger.error({ error, clerkId }, 'Error upserting profile');
    throw error;
  }

  return data;
}

/**
 * Create agency using admin client
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function createAgencyAdmin(agencyData: any): Promise<AgencyRecord> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('agencies')
    .insert({
      name: agencyData.name,
      slug: agencyData.slug,
      settings: agencyData.settings,
      is_active: agencyData.is_active,
    })
    .select()
    .single();

  if (error) {
    logger.error({ error, agencyData }, 'Error creating agency');
    throw error;
  }

  return data;
}

/**
 * Create user using admin client
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function createUserAdmin(userData: any): Promise<UserRecord> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('users')
    .insert({
      profile_id: userData.profile_id,
      agency_id: userData.agency_id,
      is_primary: userData.is_primary,
      role: userData.role,
    })
    .select()
    .single();

  if (error) {
    logger.error({ error, userData }, 'Error creating user');
    throw error;
  }

  return data;
}

/**
 * Update user using admin client
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function updateUserAdmin(userId: string, updates: any): Promise<void> {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId);

  if (error) {
    logger.error({ error, userId, updates }, 'Error updating user');
    throw error;
  }
}

/**
 * Add agency member using admin client
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function addAgencyMemberAdmin(agencyMemberData: any): Promise<AgencyMemberRecord> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('agency_members')
    .insert({
      agency_id: agencyMemberData.agency_id,
      user_id: agencyMemberData.user_id,
      role: agencyMemberData.role,
    })
    .select()
    .single();

  if (error) {
    logger.error({ error, agencyMemberData }, 'Error adding agency member');
    throw error;
  }

  return data;
}

/**
 * Get user by profile ID using admin client
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getUserByProfileIdAdmin(profileId: string): Promise<UserRecord | null> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('profile_id', profileId)
    .single();

  if (error && error.code !== 'PGRST116') {
    logger.error({ error, profileId }, 'Error fetching user by profile ID');
    throw error;
  }

  return data;
}

// =============================================================================
// Webhook Handler
// =============================================================================

export async function webhookRoutes(fastify: FastifyInstance) {
  // Add custom content type parser for raw body handling
  // This is needed for Svix signature verification
  fastify.addContentTypeParser(
    'application/json',
    { parseAs: 'string' },
    function (request: FastifyRequest, body: string, done) {
      (request as any).rawBody = body;
      try {
        const json = JSON.parse(body);
        done(null, json);
      } catch (err) {
        done(err as Error, undefined);
      }
    }
  );

  // POST /api/webhooks/clerk - Handle Clerk webhooks
  fastify.post<{ Body: ClerkWebhookEvent }>(
    '/clerk',
    async (request: FastifyRequest<{ Body: ClerkWebhookEvent }>, reply: FastifyReply) => {
      try {
        // Get Svix headers
        const svixId = request.headers['svix-id'] as string;
        const svixTimestamp = request.headers['svix-timestamp'] as string;
        const svixSignature = request.headers['svix-signature'] as string;

        // Verify all required headers are present
        if (!svixId || !svixTimestamp || !svixSignature) {
          logger.warn({ headers: request.headers }, 'Missing Svix headers');
          return reply.status(400).send({ error: 'Missing required Svix headers' });
        }

        // Get webhook secret from environment
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        if (!webhookSecret) {
          logger.error('CLERK_WEBHOOK_SECRET not configured');
          return reply.status(500).send({ error: 'Webhook secret not configured' });
        }

        // Get raw body for verification
        const rawBody = (request as any).rawBody as string;
        if (!rawBody) {
          logger.error('Raw body not available for verification');
          return reply.status(500).send({ error: 'Could not verify webhook signature' });
        }

        // Verify webhook signature
        const wh = new Webhook(webhookSecret);
        let evt: ClerkWebhookEvent;

        try {
          evt = wh.verify(rawBody, {
            'svix-id': svixId,
            'svix-timestamp': svixTimestamp,
            'svix-signature': svixSignature,
          }) as ClerkWebhookEvent;
        } catch (err) {
          logger.warn({ error: err }, 'Invalid webhook signature');
          return reply.status(401).send({ error: 'Invalid webhook signature' });
        }

        // Handle the event
        const result = await handleWebhookEvent(evt);

        return reply.status(200).send({ success: true, event: evt.type });
      } catch (error) {
        // Never crash server on webhook failure; catch and log errors gracefully
        logger.error({ error }, 'Webhook handler error');
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );
}

// =============================================================================
// Event Handlers
// =============================================================================

/**
 * Handle webhook events from Clerk
 */
async function handleWebhookEvent(event: ClerkWebhookEvent): Promise<void> {
  switch (event.type) {
    case 'user.created':
      await handleUserCreated(event.data);
      break;
    case 'user.updated':
      await handleUserUpdated(event.data);
      break;
    case 'user.deleted':
      await handleUserDeleted(event.data);
      break;
    default:
      logger.info({ eventType: event.type }, 'Unhandled webhook event type');
  }
}

/**
 * Handle user.created event
 * - Sync profile from Clerk
 * - Create default agency for user
 * - Create user record linked to profile and agency
 * - Create agency membership with owner role
 */
async function handleUserCreated(userData: ClerkUserData): Promise<void> {
  const clerkId = userData.id;
  const email = getPrimaryEmail(userData);

  logger.info({ clerkId, email }, 'Processing user.created event');

  // Step 1: Check if profile already exists (idempotency)
  const existingProfile = await getProfileByClerkIdAdminById(clerkId);

  if (existingProfile) {
    // Profile already exists - this might be a replay or duplicate
    // Just sync the profile data without creating new records
    await upsertProfileFromClerkAdmin(clerkId, {
      email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      image_url: userData.image_url,
      metadata: userData.metadata,
    });

    logger.info({ clerkId }, 'Profile already exists, synced profile data');
    return;
  }

  // Step 2: Sync profile (this creates or updates profile)
  const profile = await upsertProfileFromClerkAdmin(clerkId, {
    email,
    first_name: userData.first_name,
    last_name: userData.last_name,
    image_url: userData.image_url,
    metadata: userData.metadata,
  });

  if (!profile) {
    logger.error({ clerkId }, 'Failed to create profile');
    throw new Error('Failed to create profile');
  }

  // Step 3: Create default agency
  const agencyName = userData.first_name
    ? `${userData.first_name}'s Agency`
    : 'My Workspace';
  const agencySlug = generateSlug(agencyName);

  const agency = await createAgencyAdmin({
    name: agencyName,
    slug: agencySlug,
    settings: {},
    is_active: true,
  });

  if (!agency) {
    logger.error({ clerkId }, 'Failed to create agency');
    throw new Error('Failed to create agency');
  }

  // Step 4: Create user record
  const user = await createUserAdmin({
    profile_id: profile.id,
    agency_id: agency.id,
    is_primary: true,
    role: 'owner',
  });

  if (!user) {
    logger.error({ clerkId }, 'Failed to create user');
    throw new Error('Failed to create user');
  }

  // Step 5: Create agency membership
  await addAgencyMemberAdmin({
    agency_id: agency.id,
    user_id: user.id,
    role: 'owner',
  });

  logger.info({ clerkId, profileId: profile.id, agencyId: agency.id, userId: user.id }, 'User created successfully');
}

/**
 * Handle user.updated event
 * - Update profile from Clerk
 * - Update user record if needed
 */
async function handleUserUpdated(userData: ClerkUserData): Promise<void> {
  const clerkId = userData.id;
  const email = getPrimaryEmail(userData);

  logger.info({ clerkId, email }, 'Processing user.updated event');

  // Step 1: Get existing profile
  const profile = await getProfileByClerkIdAdminById(clerkId);

  if (!profile) {
    // No existing profile - this could be an update before the create webhook was processed
    // Create a new profile and related records
    logger.info({ clerkId }, 'Profile not found, creating from update event');
    await handleUserCreated(userData);
    return;
  }

  // Step 2: Update profile
  await upsertProfileFromClerkAdmin(clerkId, {
    email,
    first_name: userData.first_name,
    last_name: userData.last_name,
    image_url: userData.image_url,
    metadata: userData.metadata,
  });

  // Step 3: Update user record if needed (user role or agency association may change)
  // Note: We don't create duplicate agencies or memberships on update
  const userRecord = await getUserByProfileIdAdmin(profile.id);

  if (userRecord && userRecord.role !== 'owner') {
    // Update user role if needed based on Clerk metadata
    const newRole = userData.metadata?.role as string | undefined;
    if (newRole && ['owner', 'admin', 'member', 'viewer'].includes(newRole)) {
      await updateUserAdmin(userRecord.id, { role: newRole });
    }
  }

  logger.info({ clerkId, profileId: profile.id }, 'User updated successfully');
}

/**
 * Handle user.deleted event
 * - Log the event (don't delete data in v1)
 * - This is intentionally conservative - data deletion should be manual or require explicit action
 */
async function handleUserDeleted(userData: ClerkUserData): Promise<void> {
  const clerkId = userData.id;

  logger.info({ clerkId }, 'Processing user.deleted event - logging only (no data deletion in v1)');

  // In v1, we don't delete data. Just log the event for manual review.
  // Future versions may implement proper cleanup with:
  // - Soft delete profile
  // - Archive agency
  // - Remove user access
}

// =============================================================================
// Private Helper Functions
// =============================================================================

/**
 * Get profile by Clerk ID using admin client (internal)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getProfileByClerkIdAdminById(clerkId: string): Promise<any | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('clerk_id', clerkId)
    .single();

  if (error && error.code !== 'PGRST116') {
    logger.error({ error, clerkId }, 'Error fetching profile by clerk ID');
    throw error;
  }

  return data;
}
