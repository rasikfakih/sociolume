import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { supabaseConfig } from '@sociolume/config';
import type { Database } from './types';

// Create Supabase client for client-side use
let supabaseClient: SupabaseClient<Database> | null = null;

export function getSupabaseClient(): SupabaseClient<Database> {
  if (supabaseClient) return supabaseClient;

  const url = supabaseConfig.url;
  const anonKey = supabaseConfig.anonKey;

  if (!url || !anonKey) {
    console.warn('Supabase credentials not configured. Using mock client.');
    // Return a mock client for development
    return createClient('https://placeholder.supabase.co', 'placeholder-key');
  }

  supabaseClient = createClient<Database>(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return supabaseClient;
}

// Create Supabase admin client for server-side use
export function getSupabaseAdmin(): SupabaseClient<Database> {
  const url = supabaseConfig.url;
  const serviceKey = supabaseConfig.serviceRoleKey;

  if (!url || !serviceKey) {
    console.warn('Supabase service key not configured. Using standard client.');
    return getSupabaseClient();
  }

  return createClient<Database>(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// Export typed client
export type TypedSupabaseClient = SupabaseClient<Database>;
