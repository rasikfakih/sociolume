# @sociolume/ui

> **Version:** 1.0.0  
> **Description:** Reusable React UI component library for Sociolume

## Overview

This package provides a collection of modular, accessible React UI components designed for the Sociolume platform. Built with TypeScript and React 18+, all components follow consistent design patterns.

## Installation

```bash
pnpm add @sociolume/ui
```

## Requirements

| Dependency | Version |
|------------|---------|
| React | ^18.2.0 |
| React DOM | ^18.2.0 |

## Components

The package exports the following components:

| Component | Export Path | Description |
|-----------|-------------|-------------|
| Button | `@sociolume/ui/button` | Action buttons with variants |
| Card | `@sociolume/ui/card` | Container card component |
| Input | `@sociolume/ui/input` | Form input field |
| Modal | `@sociolume/ui/modal` | Dialog modal |
| Avatar | `@sociolume/ui/avatar` | User avatar display |
| Badge | `@sociolume/ui/badge` | Status badge |
| Tabs | `@sociolume/ui/tabs` | Tab navigation |

## Usage

### Import All Components

```typescript
import { Button, Card, Input, Modal, Avatar, Badge, Tabs } from '@sociolume/ui';
```

### Import Individual Components

```typescript
import { Button } from '@sociolume/ui/button';
import { Card } from '@sociolume/ui/card';
```

### Example: Button Component

```tsx
import { Button } from '@sociolume/ui/button';

export function MyComponent() {
  return (
    <Button 
      variant="primary" 
      onClick={() => console.log('Clicked')}
    >
      Click Me
    </Button>
  );
}
```

### Example: Card Component

```tsx
import { Card } from '@sociolume/ui/card';

export function MyComponent() {
  return (
    <Card>
      <h2>Card Title</h2>
      <p>Card content goes here.</p>
    </Card>
  );
}
```

### Example: Input Component

```tsx
import { Input } from '@sociolume/ui/input';

export function MyComponent() {
  return (
    <Input
      type="email"
      placeholder="Enter your email"
      label="Email Address"
      error="Invalid email"
    />
  );
}
```

### Example: Modal Component

```tsx
import { useState } from 'react';
import { Modal, Button } from '@sociolume/ui';

export function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2>Modal Title</h2>
        <p>This is the modal content.</p>
      </Modal>
    </>
  );
}
```

### Example: Avatar Component

```tsx
import { Avatar } from '@sociolume/ui/avatar';

export function MyComponent() {
  return (
    <Avatar
      src="https://example.com/avatar.jpg"
      alt="User Name"
      size="md"
    />
  );
}
```

### Example: Badge Component

```tsx
import { Badge } from '@sociolume/ui/badge';

export function MyComponent() {
  return (
    <Badge variant="success">Active</Badge>
  );
}
```

### Example: Tabs Component

```tsx
import { Tabs } from '@sociolume/ui/tabs';

export function MyComponent() {
  const tabs = [
    { id: 'tab1', label: 'Tab 1', content: 'Content 1' },
    { id: 'tab2', label: 'Tab 2', content: 'Content 2' },
  ];

  return <Tabs tabs={tabs} defaultTab="tab1" />;
}
```

## Component API Reference

### Button

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | `'primary'` | Button style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Disabled state |
| `onClick` | `() => void` | - | Click handler |

### Card

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'outlined' \| 'elevated'` | `'default'` | Card style |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Padding size |

### Input

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `string` | `'text'` | Input type |
| `label` | `string` | - | Label text |
| `placeholder` | `string` | - | Placeholder text |
| `error` | `string` | - | Error message |
| `disabled` | `boolean` | `false` | Disabled state |

### Modal

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Modal visibility |
| `onClose` | `() => void` | - | Close handler |
| `title` | `string` | - | Modal title |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Modal size |

### Avatar

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | - | Image source |
| `alt` | `string` | - | Alt text |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Avatar size |
| `fallback` | `string` | - | Fallback initials |

### Badge

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'success' \| 'warning' \| 'error'` | `'default'` | Badge variant |
| `size` | `'sm' \| 'md'` | `'md'` | Badge size |

### Tabs

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `TabItem[]` | - | Array of tab items |
| `defaultTab` | `string` | - | Default active tab ID |
| `onChange` | `(tabId: string) => void` | - | Tab change handler |

## TypeScript

This package is written in TypeScript and provides type definitions. No additional `@types` packages required.

## Development

```bash
# Lint
pnpm --filter @sociolume/ui lint

# Type check
pnpm --filter @sociolume/ui typecheck
```

## Related Packages

- [`@sociolume/auth`](./auth/README.md) - Authentication utilities
- [`@sociolume/db`](./db/README.md) - Database client