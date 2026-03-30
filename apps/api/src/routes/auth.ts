import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getSupabaseClient } from '@sociolume/db';

interface AuthProtectedBody {
  userId: string;
}

export async function authRoutes(fastify: FastifyInstance) {
  // Verify authentication middleware
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

  // Get current user
  fastify.get('/me', async (_request: FastifyRequest, reply: FastifyReply) => {
    const user = (_request as any).user;
    return reply.send({
      userId: user.id,
      message: 'User authenticated',
    });
  });

  // Protected route example - get user profile from Supabase
  fastify.get('/profile', async (_request: FastifyRequest, reply: FastifyReply) => {
    const user = (_request as any).user;
    const supabase = getSupabaseClient();

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_id', user.id)
        .single();

      if (error) {
        return reply.code(404).send({ error: 'Profile not found' });
      }

      return reply.send({ profile: data });
    } catch (err) {
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
}
