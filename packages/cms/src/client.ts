import { wordpressConfig } from '@sociolume/config';

const WP_API_URL = wordpressConfig.apiUrl;
const WP_API_KEY = wordpressConfig.apiKey;

// WordPress API client for headless CMS
export class WordPressClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl = WP_API_URL, apiKey = WP_API_KEY) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Get all posts
  async getPosts(options?: {
    page?: number;
    perPage?: number;
    categories?: number[];
    tags?: number[];
    search?: string;
  }): Promise<WordPressPost[]> {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', String(options.page));
    if (options?.perPage) params.append('per_page', String(options.perPage));
    if (options?.search) params.append('search', options.search);
    if (options?.categories?.length) {
      params.append('categories', options.categories.join(','));
    }
    if (options?.tags?.length) {
      params.append('tags', options.tags.join(','));
    }

    const queryString = params.toString();
    const endpoint = `/wp/v2/posts${queryString ? `?${queryString}` : ''}`;
    return this.request<WordPressPost[]>(endpoint);
  }

  // Get single post by ID or slug
  async getPost(identifier: string | number): Promise<WordPressPost> {
    return this.request<WordPressPost>(`/wp/v2/posts/${identifier}`);
  }

  // Get all pages
  async getPages(options?: { page?: number; perPage?: number }): Promise<WordPressPage[]> {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', String(options.page));
    if (options?.perPage) params.append('per_page', String(options.perPage));

    const queryString = params.toString();
    const endpoint = `/wp/v2/pages${queryString ? `?${queryString}` : ''}`;
    return this.request<WordPressPage[]>(endpoint);
  }

  // Get single page by ID or slug
  async getPage(identifier: string | number): Promise<WordPressPage> {
    return this.request<WordPressPage>(`/wp/v2/pages/${identifier}`);
  }

  // Get categories
  async getCategories(options?: { page?: number; perPage?: number }): Promise<WordPressCategory[]> {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', String(options.page));
    if (options?.perPage) params.append('per_page', String(options.perPage));

    const queryString = params.toString();
    const endpoint = `/wp/v2/categories${queryString ? `?${queryString}` : ''}`;
    return this.request<WordPressCategory[]>(endpoint);
  }

  // Get tags
  async getTags(options?: { page?: number; perPage?: number }): Promise<WordPressTag[]> {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', String(options.page));
    if (options?.perPage) params.append('per_page', String(options.perPage));

    const queryString = params.toString();
    const endpoint = `/wp/v2/tags${queryString ? `?${queryString}` : ''}`;
    return this.request<WordPressTag[]>(endpoint);
  }

  // Get media (featured images, etc.)
  async getMedia(id: number): Promise<WordPressMedia> {
    return this.request<WordPressMedia>(`/wp/v2/media/${id}`);
  }
}

// Default client instance
let wpClient: WordPressClient | null = null;

export function getWordPressClient(): WordPressClient {
  if (!wpClient) {
    wpClient = new WordPressClient();
  }
  return wpClient;
}

// TypeScript interfaces for WordPress API responses
export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
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
  _links: Record<string, unknown>;
}

export interface WordPressPage {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
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
  _links: Record<string, unknown>;
}

export interface WordPressCategory {
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

export interface WordPressTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta: Record<string, unknown>;
}

export interface WordPressMedia {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: { rendered: string };
  author: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: Record<string, unknown>;
  description: { rendered: string };
  caption: { rendered: string };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: Record<string, unknown>;
  post: number | null;
  source_url: string;
}
