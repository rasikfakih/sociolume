// Monitor service - runs every 2 hours to fetch mentions from Reddit and Google News
import { logger } from '../utils/logger.js';
import { getAllActiveKeywordsWithBrands, insertMentions } from '@sociolume/db';
import type { Sentiment, Platform } from '@sociolume/db';

// =============================================================================
// Sentiment Classifier (pure function, no imports needed)
// =============================================================================

const POSITIVE_WORDS = ['love', 'great', 'excellent', 'amazing', 'best', 'recommend', 'thanks', 'helpful', 'perfect', 'happy', 'good', 'awesome', 'fantastic', 'brilliant', 'outstanding'];
const NEGATIVE_WORDS = ['hate', 'worst', 'terrible', 'awful', 'bad', 'horrible', 'scam', 'fraud', 'useless', 'disappointed', 'pathetic', 'complaint', 'issue', 'problem', 'broken', 'refund', 'cheat', 'poor', 'disgusting', 'ridiculous'];

function classifySentiment(text: string): Sentiment {
  const lower = text.toLowerCase();
  const hasPositive = POSITIVE_WORDS.some(w => lower.includes(w));
  const hasNegative = NEGATIVE_WORDS.some(w => lower.includes(w));
  if (hasNegative) return 'negative';
  if (hasPositive) return 'positive';
  return 'neutral';
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Simple hash function for generating external IDs from URLs
 * Returns a 16-character hex string using basic char code math
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Convert to positive hex and pad to 16 chars
  const hex = Math.abs(hash).toString(16).padStart(16, '0');
  return hex.substring(0, 16);
}

/**
 * Fetch with retry - wraps built-in fetch with max 2 retries, 1000ms delay between retries
 * On all retries exhausted, throw the last error
 */
async function fetchWithRetry(url: string, options: RequestInit = {}, maxRetries = 2): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  throw lastError || new Error('Fetch failed after retries');
}

// =============================================================================
// Reddit Fetcher
// =============================================================================

interface RedditMention {
  external_id: string;
  url: string;
  title: string;
  content: string;
  author_handle: string;
  platform_created_at: string;
  platform: Platform;
}

async function fetchRedditMentions(phrase: string): Promise<RedditMention[]> {
  try {
    const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(phrase)}&sort=new&limit=25&type=link`;
    const response = await fetchWithRetry(url, {
      headers: {
        'User-Agent': process.env['REDDIT_USER_AGENT'] || 'Sociolume/1.0',
      },
    });
    
    if (!response.ok) {
      logger.error({ url, status: response.status }, 'Reddit fetch returned non-OK status');
      return [];
    }
    
    const data: any = await response.json();
    
    if (!data?.data?.children || !Array.isArray(data.data.children)) {
      logger.warn({ phrase }, 'Reddit response missing data.children');
      return [];
    }
    
    return data.data.children.map((child: any) => {
      const post = child.data;
      return {
        external_id: post.id,
        url: 'https://reddit.com' + post.permalink,
        title: post.title,
        content: post.selftext ? post.selftext.substring(0, 600) : '',
        author_handle: post.author,
        platform_created_at: new Date(post.created_utc * 1000).toISOString(),
        platform: 'reddit' as Platform,
      };
    });
  } catch (error) {
    logger.error({ error, phrase }, 'Failed to fetch Reddit mentions');
    return [];
  }
}

// =============================================================================
// Google News RSS Fetcher
// =============================================================================

async function fetchGoogleNewsMentions(phrase: string): Promise<RedditMention[]> {
  try {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(phrase)}&hl=en-IN&gl=IN&ceid=IN:en`;
    const response = await fetchWithRetry(url);
    
    if (!response.ok) {
      logger.error({ url, status: response.status }, 'Google News fetch returned non-OK status');
      return [];
    }
    
    const xml = await response.text();
    const mentions: RedditMention[] = [];
    
    // Extract <item> blocks using regex
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
    let itemMatch;
    
    while ((itemMatch = itemRegex.exec(xml)) !== null) {
      const itemContent = itemMatch[1];
      
      // Extract title
      const titleMatch = /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/i.exec(itemContent);
      const title = titleMatch ? (titleMatch[1] || titleMatch[2] || '') : '';
      
      // Extract link
      const linkMatch = /<link><!\[CDATA\[(.*?)\]\]><\/link>|<link>(.*?)<\/link>/i.exec(itemContent);
      const link = linkMatch ? (linkMatch[1] || linkMatch[2] || '') : '';
      
      // Extract description
      const descMatch = /<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/i.exec(itemContent);
      let description = descMatch ? (descMatch[1] || descMatch[2] || '') : '';
      
      // Strip HTML tags from description
      description = description.replace(/<[^>]*>/g, '').trim();
      description = description.substring(0, 600);
      
      // Extract pubDate
      const pubDateMatch = /<pubDate>(.*?)<\/pubDate>/i.exec(itemContent);
      let platform_created_at = '';
      if (pubDateMatch && pubDateMatch[1]) {
        try {
          platform_created_at = new Date(pubDateMatch[1]).toISOString();
        } catch {
          platform_created_at = '';
        }
      }
      
      // Extract source
      const sourceMatch = /<source><!\[CDATA\[(.*?)\]\]><\/source>|<source>(.*?)<\/source>/i.exec(itemContent);
      const author_handle = sourceMatch ? (sourceMatch[1] || sourceMatch[2] || '') : '';
      
      if (title && link) {
        mentions.push({
          external_id: simpleHash(link),
          url: link,
          title: title,
          content: description,
          author_handle: author_handle,
          platform_created_at,
          platform: 'news' as Platform,
        });
      }
    }
    
    return mentions;
  } catch (error) {
    logger.error({ error, phrase }, 'Failed to fetch Google News mentions');
    return [];
  }
}

// =============================================================================
// Main Export
// =============================================================================

export async function runMonitorCycle(): Promise<void> {
  const startTime = new Date().toISOString();
  logger.info({ timestamp: startTime }, 'Monitor cycle starting');
  
  try {
    // Get all active keywords with brands
    const keywords = await getAllActiveKeywordsWithBrands();
    
    if (!keywords || keywords.length === 0) {
      logger.info('No active keywords');
      return;
    }
    
    logger.info({ keywordCount: keywords.length }, 'Found active keywords to monitor');
    
    let totalNewMentions = 0;
    
    // Process each keyword
    for (const keyword of keywords) {
      const { brand_id, brand_name, agency_id, phrase, platform } = keyword;
      
      let mentions: RedditMention[] = [];
      
      // Fetch from Reddit if platform is 'reddit' or 'all'
      if (platform === 'reddit' || platform === 'all') {
        const redditMentions = await fetchRedditMentions(phrase);
        mentions = [...mentions, ...redditMentions];
      }
      
      // Fetch from Google News if platform is 'news' or 'all'
      if (platform === 'news' || platform === 'all') {
        const newsMentions = await fetchGoogleNewsMentions(phrase);
        mentions = [...mentions, ...newsMentions];
      }
      
      // Apply sentiment classification to each mention
      const mentionsWithSentiment = mentions.map(mention => ({
        brand_id,
        agency_id,
        platform: mention.platform,
        external_id: mention.external_id,
        url: mention.url,
        title: mention.title,
        content: mention.content,
        author_handle: mention.author_handle,
        sentiment: classifySentiment(mention.title + ' ' + mention.content),
        platform_created_at: mention.platform_created_at,
      }));
      
      // Insert mentions into database
      if (mentionsWithSentiment.length > 0) {
        const insertedCount = await insertMentions(mentionsWithSentiment);
        totalNewMentions += insertedCount;
        
        logger.info(
          { 
            brand_name, 
            keyword_phrase: phrase, 
            platform, 
            new_count: insertedCount 
          },
          'Processed keyword mentions'
        );
      } else {
        logger.info(
          { brand_name, keyword_phrase: phrase, platform },
          'No new mentions found for keyword'
        );
      }
    }
    
    const endTime = new Date().toISOString();
    logger.info(
      { 
        timestamp: endTime, 
        total_new_mentions: totalNewMentions,
        duration_seconds: (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000 
      },
      'Monitor cycle completed'
    );
    
  } catch (error) {
    logger.error({ error }, 'Monitor cycle failed');
    // Never crash - just log the error
  }
}
