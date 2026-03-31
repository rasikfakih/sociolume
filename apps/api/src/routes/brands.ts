import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
  getSupabaseClient,
  getBrandsByAgency,
  getBrandById,
  createBrand,
  deactivateBrand,
  addBrandKeyword,
  deactivateBrandKeyword,
  getMentionsByBrand,
  updateMention,
  getProfileByClerkId,
} from '@sociolume/db';
import { Brand, BrandKeyword, Mention, MentionStatus, Platform } from '@sociolume/db';
import { logger } from '../utils/logger.js';

// =============================================================================
// Types
// =============================================================================

interface CreateBrandBody {
  name: string;
  keywords: string[];
}

interface AddKeywordBody {
  phrase: string;
  platform?: 'reddit' | 'news' | 'all';
}

interface UpdateMentionBody {
  status?: MentionStatus;
  assigned_to?: string;
}

interface BrandParams {
  id: string;
}

interface KeywordParams {
  id: string;
  keywordId: string;
}

interface MentionParams {
  id: string;
  mentionId: string;
}

interface MentionsQuery {
  status?: MentionStatus;
  platform?: Platform;
  page?: number;
}

// =============================================================================
// Helper Functions
// =============================================================================

async function getAgencyIdFromClerkId(clerkId: string): Promise<string | null> {
  const supabase = getSupabaseClient();

  // Get profile by clerk ID
  const profile = await getProfileByClerkId(clerkId);
  if (!profile || !profile.user_id) {
    return null;
  }

  // Query agency_members joined with users to get agency_id
  const { data, error } = await supabase
    .from('agency_members')
    .select('agency_id')
    .eq('user_id', profile.user_id)
    .single() as { data: { agency_id: string } | null; error: any };

  if (error || !data) {
    logger.warn({ clerkId, error }, 'Failed to get agency_id from clerk_id');
    return null;
  }

  return data.agency_id;
}

async function verifyBrandOwnership(
  brandId: string,
  agencyId: string,
  reply: FastifyReply
): Promise<Brand | null> {
  const brand = await getBrandById(brandId);
  if (!brand) {
    return null;
  }
  if (brand.agency_id !== agencyId) {
    return null;
  }
  return brand;
}

async function getBrandKeywords(brandId: string): Promise<BrandKeyword[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('brand_keywords')
    .select('*')
    .eq('brand_id', brandId)
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data as BrandKeyword[]) || [];
}

// =============================================================================
// Route Handlers
// =============================================================================

export async function brandRoutes(fastify: FastifyInstance) {
  // Auth preHandler hook - same pattern as auth.ts
  fastify.addHook('preHandler', async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.substring(7);

    // In production, verify the Clerk token here
    // For now, we'll accept any token for development
    if (process.env.NODE_ENV === 'production') {
      try {
        // TODO: Implement Clerk token verification
        // const clerk = require('@clerk/clerk-sdk-node');
        // const verification = await clerk.verifyToken(token);
      } catch {
        return reply.code(401).send({ error: 'Invalid token' });
      }
    }

    // Attach user to request (would come from Clerk in production)
    (request as any).user = { id: 'dev-user-id' };
  });

  // GET /brands - List all brands for the user's agency
  fastify.get(
    '/brands',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = (request as any).user;
      const agencyId = await getAgencyIdFromClerkId(user.id);

      if (!agencyId) {
        return reply.code(404).send({ error: 'Agency not found' });
      }

      const brands = await getBrandsByAgency(agencyId);
      return reply.send({ brands });
    }
  );

  // POST /brands - Create a new brand
  fastify.post<{ Body: CreateBrandBody }>(
    '/brands',
    {
      schema: {
        body: {
          type: 'object',
          required: ['name', 'keywords'],
          properties: {
            name: { type: 'string', minLength: 1 },
            keywords: { type: 'array', minItems: 1, items: { type: 'string' } },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: CreateBrandBody }>, reply: FastifyReply) => {
      const user = (request as any).user;
      const agencyId = await getAgencyIdFromClerkId(user.id);

      if (!agencyId) {
        return reply.code(404).send({ error: 'Agency not found' });
      }

      const { name, keywords } = request.body;
      const brand = await createBrand({ agency_id: agencyId, name, keywords });
      return reply.code(201).send({ brand });
    }
  );

  // GET /brands/:id - Get a specific brand with its keywords
  fastify.get<{ Params: BrandParams }>(
    '/brands/:id',
    async (request: FastifyRequest<{ Params: BrandParams }>, reply: FastifyReply) => {
      const user = (request as any).user;
      const agencyId = await getAgencyIdFromClerkId(user.id);

      if (!agencyId) {
        return reply.code(404).send({ error: 'Agency not found' });
      }

      const brand = await verifyBrandOwnership(request.params.id, agencyId, reply);
      if (!brand) {
        return reply.code(404).send({ error: 'Brand not found' });
      }

      const keywords = await getBrandKeywords(brand.id);
      return reply.send({ brand, keywords });
    }
  );

  // DELETE /brands/:id - Deactivate a brand
  fastify.delete<{ Params: BrandParams }>(
    '/brands/:id',
    async (request: FastifyRequest<{ Params: BrandParams }>, reply: FastifyReply) => {
      const user = (request as any).user;
      const agencyId = await getAgencyIdFromClerkId(user.id);

      if (!agencyId) {
        return reply.code(404).send({ error: 'Agency not found' });
      }

      const brand = await verifyBrandOwnership(request.params.id, agencyId, reply);
      if (!brand) {
        return reply.code(404).send({ error: 'Brand not found' });
      }

      await deactivateBrand(brand.id);
      return reply.send({ success: true });
    }
  );

  // POST /brands/:id/keywords - Add a keyword to a brand
  fastify.post<{ Params: BrandParams; Body: AddKeywordBody }>(
    '/brands/:id/keywords',
    {
      schema: {
        body: {
          type: 'object',
          required: ['phrase'],
          properties: {
            phrase: { type: 'string', minLength: 1 },
            platform: { type: 'string', enum: ['reddit', 'news', 'all'], default: 'all' },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Params: BrandParams; Body: AddKeywordBody }>,
      reply: FastifyReply
    ) => {
      const user = (request as any).user;
      const agencyId = await getAgencyIdFromClerkId(user.id);

      if (!agencyId) {
        return reply.code(404).send({ error: 'Agency not found' });
      }

      const brand = await verifyBrandOwnership(request.params.id, agencyId, reply);
      if (!brand) {
        return reply.code(404).send({ error: 'Brand not found' });
      }

      const { phrase, platform = 'all' } = request.body;
      const keyword = await addBrandKeyword({ brand_id: brand.id, phrase, platform });
      return reply.code(201).send({ keyword });
    }
  );

  // DELETE /brands/:id/keywords/:keywordId - Deactivate a keyword
  fastify.delete<{ Params: KeywordParams }>(
    '/brands/:id/keywords/:keywordId',
    async (request: FastifyRequest<{ Params: KeywordParams }>, reply: FastifyReply) => {
      const user = (request as any).user;
      const agencyId = await getAgencyIdFromClerkId(user.id);

      if (!agencyId) {
        return reply.code(404).send({ error: 'Agency not found' });
      }

      const brand = await verifyBrandOwnership(request.params.id, agencyId, reply);
      if (!brand) {
        return reply.code(404).send({ error: 'Brand not found' });
      }

      await deactivateBrandKeyword(request.params.keywordId);
      return reply.send({ success: true });
    }
  );

  // GET /brands/:id/mentions - Get mentions for a brand
  fastify.get<{ Params: BrandParams; Querystring: MentionsQuery }>(
    '/brands/:id/mentions',
    async (
      request: FastifyRequest<{ Params: BrandParams; Querystring: MentionsQuery }>,
      reply: FastifyReply
    ) => {
      const user = (request as any).user;
      const agencyId = await getAgencyIdFromClerkId(user.id);

      if (!agencyId) {
        return reply.code(404).send({ error: 'Agency not found' });
      }

      const brand = await verifyBrandOwnership(request.params.id, agencyId, reply);
      if (!brand) {
        return reply.code(404).send({ error: 'Brand not found' });
      }

      const { status, platform, page = '1' } = request.query;
      const pageNum = parseInt(page as string, 10) || 1;

      const result = await getMentionsByBrand(brand.id, {
        status,
        platform,
        page: pageNum,
        pageSize: 25,
      });

      return reply.send({
        mentions: result.data,
        count: result.count,
        page: result.page,
        totalPages: result.totalPages,
      });
    }
  );

  // PATCH /brands/:id/mentions/:mentionId - Update a mention
  fastify.patch<{ Params: MentionParams; Body: UpdateMentionBody }>(
    '/brands/:id/mentions/:mentionId',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['new', 'assigned', 'replied', 'closed'] },
            assigned_to: { type: 'string', nullable: true },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Params: MentionParams; Body: UpdateMentionBody }>,
      reply: FastifyReply
    ) => {
      const user = (request as any).user;
      const agencyId = await getAgencyIdFromClerkId(user.id);

      if (!agencyId) {
        return reply.code(404).send({ error: 'Agency not found' });
      }

      const brand = await verifyBrandOwnership(request.params.id, agencyId, reply);
      if (!brand) {
        return reply.code(404).send({ error: 'Brand not found' });
      }

      const { status, assigned_to } = request.body;
      const mention = await updateMention(request.params.mentionId, { status, assigned_to });
      return reply.send({ mention });
    }
  );
}