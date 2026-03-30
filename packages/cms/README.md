# @sociolume/cms

A headless WordPress CMS client for the Sociolume platform. Provides TypeScript bindings for interacting with the WordPress REST API to fetch posts, pages, media, categories, and tags.

## Installation

```bash
pnpm add @sociolume/cms
```

## Usage

### Basic Usage

```typescript
import { getWordPressClient, WordPressClient } from '@sociolume/cms';

// Use the default client with environment configuration
const client = getWordPressClient();

// Or create a custom instance
const customClient = new WordPressClient('https://your-wordpress-site.com', 'your-api-key');
```

### Fetching Posts

```typescript
import { getWordPressClient } from '@sociolume/cms';

const client = getWordPressClient();

// Get all posts with pagination
const posts = await client.getPosts({
  page: 1,
  perPage: 10,
});

// Search posts
const searchResults = await client.getPosts({
  search: 'getting started',
});

// Filter by categories and tags
const filteredPosts = await client.getPosts({
  categories: [1, 2],
  tags: [3, 4],
});
```

### Fetching a Single Post

```typescript
// By ID
const post = await client.getPost(123);

// By slug
const post = await client.getPost('my-post-slug');
```

### Fetching Pages

```typescript
// Get all pages
const pages = await client.getPages({ perPage: 20 });

// Get a single page by ID or slug
const page = await client.getPage(42);
const page = await client.getPage('about-us');
```

### Fetching Categories and Tags

```typescript
// Get categories
const categories = await client.getCategories({ perPage: 50 });

// Get tags
const tags = await client.getTags({ perPage: 100 });
```

### Fetching Media

```typescript
// Get media by ID
const media = await client.getMedia(101);
```

## API Reference

### `WordPressClient`

The main client class for interacting with the WordPress REST API.

#### Constructor

```typescript
new WordPressClient(baseUrl?: string, apiKey?: string)
```

| Parameter | Type   | Description                                      |
| --------- | ------ | ------------------------------------------------ |
| baseUrl   | string | WordPress site URL (defaults to `WORDPRESS_API_URL` from config) |
| apiKey    | string | API key for authenticated requests (defaults to `WORDPRESS_API_KEY` from config) |

#### Methods

##### `getPosts(options?)`

Fetches a list of posts with optional filtering.

```typescript
getPosts(options?: {
  page?: number;
  perPage?: number;
  categories?: number[];
  tags?: number[];
  search?: string;
}): Promise<WordPressPost[]>
```

##### `getPost(identifier)`

Fetches a single post by ID or slug.

```typescript
getPost(identifier: string | number): Promise<WordPressPost>
```

##### `getPages(options?)`

Fetches a list of pages with optional pagination.

```typescript
getPages(options?: {
  page?: number;
  perPage?: number;
}): Promise<WordPressPage[]>
```

##### `getPage(identifier)`

Fetches a single page by ID or slug.

```typescript
getPage(identifier: string | number): Promise<WordPressPage>
```

##### `getCategories(options?)`

Fetches a list of categories.

```typescript
getCategories(options?: {
  page?: number;
  perPage?: number;
}): Promise<WordPressCategory[]>
```

##### `getTags(options?)`

Fetches a list of tags.

```typescript
getTags(options?: {
  page?: number;
  perPage?: number;
}): Promise<WordPressTag[]>
```

##### `getMedia(id)`

Fetches a single media item by ID.

```typescript
getMedia(id: number): Promise<WordPressMedia>
```

### Type Definitions

#### `WordPressPost`

```typescript
interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string; protected: boolean };
  excerpt: { rendered: string; protected: boolean };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  format: string;
  meta: Record<string, unknown>;
  categories: number[];
  tags: number[];
}
```

#### `WordPressPage`

```typescript
interface WordPressPage {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string; protected: boolean };
  excerpt: { rendered: string; protected: boolean };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  menu_order: number;
  meta: Record<string, unknown>;
}
```

#### `WordPressCategory`

```typescript
interface WordPressCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: Record<string, unknown>;
}
```

#### `WordPressTag`

```typescript
interface WordPressTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta: Record<string, unknown>;
}
```

#### `WordPressMedia`

```typescript
interface WordPressMedia {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  type: string;
  link: string;
  title: { rendered: string };
  // ... additional media properties
}
```

## Environment Variables

Configure the WordPress client via environment variables:

| Variable | Description | Required |
| -------- | ----------- | -------- |
| `NEXT_PUBLIC_WORDPRESS_URL` | Public URL of your WordPress site | Yes |
| `WORDPRESS_API_URL` | WordPress REST API URL | Yes |
| `WORDPRESS_API_KEY` | API key for authenticated requests | No (for public content) |

## Example Environment Setup

```env
NEXT_PUBLIC_WORDPRESS_URL=https://blog.sociolume.com
WORDPRESS_API_URL=https://blog.sociolume.com/wp-json
WORDPRESS_API_KEY=your_application_password_here
```

### Generating WordPress Application Password

1. Log in to your WordPress admin panel
2. Go to **Users** → **Profile**
3. Scroll down to **Application Passwords**
4. Enter a name for the application and click **Add New**
5. Copy the generated password and use it as your `WORDPRESS_API_KEY`

## Related Packages

| Package | Description |
| ------- | ----------- |
| [`@sociolume/config`](../config/README.md) | Shared configuration with WordPress environment variable definitions |
| [`@sociolume/db`](../db/README.md) | Database client for additional data persistence |
| [`@sociolume/types`](../types/README.md) | Shared TypeScript type definitions |

## License

Private - All rights reserved