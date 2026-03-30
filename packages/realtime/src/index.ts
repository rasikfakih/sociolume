import { getSupabaseClient, TypedSupabaseClient } from '@sociolume/db';
import {
  RealtimeChannel,
  RealtimePresenceState,
  RealtimePostgresChangesPayload,
} from '@supabase/supabase-js';

// Realtime subscription helpers for Supabase
export type { RealtimeChannel, RealtimePresenceState, RealtimePostgresChangesPayload };

// Subscribe to database changes
export function subscribeToTable<T>(table: string, callback: (payload: T) => void) {
  const supabase = getSupabaseClient();
  return supabase.channel(`public:${table}`).on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table,
    },
    (payload: RealtimePostgresChangesPayload<T>) => {
      callback(payload.new as T);
    }
  );
}

// Subscribe to specific user's notifications
export function subscribeToNotifications(
  userId: string,
  callback: (notification: unknown) => void
) {
  const supabase = getSupabaseClient();
  return supabase.channel(`notifications:${userId}`).on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`,
    },
    (payload: RealtimePostgresChangesPayload<unknown>) => {
      callback(payload.new);
    }
  );
}

// Subscribe to specific user's activities
export function subscribeToActivities(userId: string, callback: (activity: unknown) => void) {
  const supabase = getSupabaseClient();
  return supabase.channel(`activities:${userId}`).on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'activities',
      filter: `user_id=eq.${userId}`,
    },
    (payload: RealtimePostgresChangesPayload<unknown>) => {
      callback(payload.new);
    }
  );
}

// Subscribe to usage updates
export function subscribeToUsage(userId: string, callback: (usage: unknown) => void) {
  const supabase = getSupabaseClient();
  return supabase.channel(`usage:${userId}`).on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'usage',
      filter: `user_id=eq.${userId}`,
    },
    (payload: RealtimePostgresChangesPayload<unknown>) => {
      callback(payload.new);
    }
  );
}

// Presence helpers for showing online users
export function setupPresence(channel: RealtimeChannel, userId: string) {
  return channel.track({
    user_id: userId,
    online_at: new Date().toISOString(),
  });
}

// Broadcast to channel (for real-time messaging)
export function broadcastMessage(channel: RealtimeChannel, event: string, payload: unknown) {
  return channel.send({
    type: 'broadcast',
    event,
    payload,
  });
}

// Create a custom channel for app-specific real-time features
export function createChannel(channelName: string): RealtimeChannel {
  const supabase = getSupabaseClient();
  return supabase.channel(channelName);
}
