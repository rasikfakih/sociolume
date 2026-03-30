# @sociolume/realtime

> **Version:** 1.0.0  
> **Description:** Supabase realtime subscriptions for Sociolume notifications, activities, and presence

## Overview

This package provides realtime subscriptions using [Supabase Realtime](https://supabase.com/realtime) for the Sociolume platform. It enables real-time data synchronization for notifications, user activities, usage tracking, and presence awareness.

## Installation

```bash
pnpm add @sociolume/realtime
```

## Requirements

| Dependency | Version |
|------------|---------|
| React | ^18.2.0 |
| React DOM | ^18.2.0 |
| @supabase/supabase-js | ^2.39.0 |

## Environment Variables

This package relies on Supabase environment variables configured in the [`@sociolume/db`](../db/README.md) package.

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |

## Usage

### Subscribe to Notifications

Receive real-time notifications for a specific user:

```typescript
import { subscribeToNotifications } from '@sociolume/realtime';
import { RealtimeChannel } from '@supabase/supabase-js';

function NotificationsComponent() {
  useEffect(() => {
    const userId = 'user_123';
    
    const channel = subscribeToNotifications(userId, (notification) => {
      console.log('New notification:', notification);
      // Handle notification (e.g., show toast, update UI)
    });

    channel.subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return <div>Listening for notifications...</div>;
}
```

### Subscribe to Activities

Track user activities in real-time:

```typescript
import { subscribeToActivities } from '@sociolume/realtime';

function ActivityTracker() {
  useEffect(() => {
    const userId = 'user_123';
    
    const channel = subscribeToActivities(userId, (activity) => {
      console.log('New activity:', activity);
      // Update activity feed
    });

    channel.subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return <div>Tracking activities...</div>;
}
```

### Subscribe to Usage Updates

Monitor usage metrics in real-time:

```typescript
import { subscribeToUsage } from '@sociolume/realtime';

function UsageMonitor() {
  useEffect(() => {
    const userId = 'user_123';
    
    const channel = subscribeToUsage(userId, (usage) => {
      console.log('Usage update:', usage);
      // Update usage display
    });

    channel.subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return <div>Monitoring usage...</div>;
}
```

### Subscribe to Table Changes

Listen for any changes to a specific database table:

```typescript
import { subscribeToTable } from '@sociolume/realtime';

interface UserRecord {
  id: string;
  email: string;
  name: string;
}

function UserTableListener() {
  useEffect(() => {
    const channel = subscribeToTable<UserRecord>('users', (record) => {
      console.log('User changed:', record);
    });

    channel.subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return <div>Listening to user table...</div>;
}
```

### Presence Tracking

Track online users with presence:

```typescript
import { createChannel, setupPresence } from '@sociolume/realtime';

interface PresenceState {
  user_id: string;
  online_at: string;
}

function PresenceComponent() {
  useEffect(() => {
    const userId = 'user_123';
    const channel = createChannel('room-1');

    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState<PresenceState>();
      console.log('Online users:', state);
    });

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await setupPresence(channel, userId);
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return <div>Presence tracking enabled</div>;
}
```

### Broadcast Messages

Send real-time messages to channel participants:

```typescript
import { createChannel, broadcastMessage } from '@sociolume/realtime';

function ChatComponent() {
  useEffect(() => {
    const channel = createChannel('chat-room');

    channel.on('broadcast', { event: 'message' }, ({ payload }) => {
      console.log('Received message:', payload);
    });

    channel.subscribe();

    // Send a message
    broadcastMessage(channel, 'message', { text: 'Hello!' });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return <div>Chat enabled</div>;
}
```

## Exports

| Export | Source | Description |
|--------|--------|-------------|
| `subscribeToTable` | `@sociolume/realtime` | Subscribe to table changes |
| `subscribeToNotifications` | `@sociolume/realtime` | Subscribe to user notifications |
| `subscribeToActivities` | `@sociolume/realtime` | Subscribe to user activities |
| `subscribeToUsage` | `@sociolume/realtime` | Subscribe to usage updates |
| `setupPresence` | `@sociolume/realtime` | Setup presence tracking |
| `broadcastMessage` | `@sociolume/realtime` | Broadcast to channel |
| `createChannel` | `@sociolume/realtime` | Create custom channel |
| `RealtimeChannel` | `@sociolume/realtime` | Supabase channel type |
| `RealtimePresenceState` | `@sociolume/realtime` | Presence state type |
| `RealtimePostgresChangesPayload` | `@sociolume/realtime` | Postgres changes type |

## API Reference

### `subscribeToTable<T>(table, callback)`

Subscribe to all changes on a database table.

```typescript
const channel = subscribeToTable<User>('users', (user) => {
  console.log(user);
});
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `table` | `string` | Database table name |
| `callback` | `(payload: T) => void` | Callback for new records |

**Returns:** `RealtimeChannel`

### `subscribeToNotifications(userId, callback)`

Subscribe to notifications for a specific user.

```typescript
const channel = subscribeToNotifications(userId, (notification) => {
  console.log(notification);
});
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | User ID to filter notifications |
| `callback` | `(notification: unknown) => void` | Callback for new notifications |

**Returns:** `RealtimeChannel`

### `subscribeToActivities(userId, callback)`

Subscribe to activities for a specific user.

```typescript
const channel = subscribeToActivities(userId, (activity) => {
  console.log(activity);
});
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | User ID to filter activities |
| `callback` | `(activity: unknown) => void` | Callback for new activities |

**Returns:** `RealtimeChannel`

### `subscribeToUsage(userId, callback)`

Subscribe to usage updates for a specific user.

```typescript
const channel = subscribeToUsage(userId, (usage) => {
  console.log(usage);
});
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | User ID to filter usage |
| `callback` | `(usage: unknown) => void` | Callback for usage updates |

**Returns:** `RealtimeChannel`

### `setupPresence(channel, userId)`

Track user presence in a channel.

```typescript
await setupPresence(channel, userId);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `channel` | `RealtimeChannel` | Channel to track presence on |
| `userId` | `string` | User ID to track |

**Returns:** `Promise<void>`

### `broadcastMessage(channel, event, payload)`

Send a broadcast message to all channel subscribers.

```typescript
await broadcastMessage(channel, 'message', { text: 'Hello!' });
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `channel` | `RealtimeChannel` | Channel to broadcast on |
| `event` | `string` | Event name |
| `payload` | `unknown` | Message payload |

**Returns:** `Promise<void>`

### `createChannel(channelName)`

Create a custom realtime channel.

```typescript
const channel = createChannel('my-channel');
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `channelName` | `string` | Unique channel name |

**Returns:** `RealtimeChannel`

## Related Packages

- [`@sociolume/db`](../db/README.md) - Database client and types
- [`@sociolume/auth`](../auth/README.md) - Authentication
- [`@sociolume/config`](../config/README.md) - Configuration

## Related Documentation

- [Supabase Realtime](https://supabase.com/docs/guides/realtime) - Supabase realtime docs
- [API Documentation](../docs/api.md) - Sociolume API endpoints