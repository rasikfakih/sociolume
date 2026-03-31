import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getSupabaseClient } from '@sociolume/db';

interface ProfileData {
  id: string;
  clerk_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

interface UserData {
  id: string;
  agency_id: string | null;
  role: string;
}

interface AgencyData {
  id: string;
  name: string;
}

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
  fastify.get('/profile', async (request: FastifyRequest, reply: FastifyReply) => {
    const user = (request as any).user;
    const supabase = getSupabaseClient();

    // Step 1: Query profiles table by clerk_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('clerk_id', user.id)
      .single() as { data: ProfileData | null; error: any };

    if (profileError) throw profileError;
    if (!profile) return reply.code(404).send({ error: 'Profile not found' });

    // Step 2: Query users table to get the user record with agency_id
    const { data: userRecord, error: userError } = await supabase
      .from('users')
      .select('id, agency_id, role')
      .eq('profile_id', profile.id)
      .single() as { data: UserData | null; error: any };

    if (userError) throw userError;
    if (!userRecord) return reply.code(404).send({ error: 'User not found' });

    // Step 3: Query agencies to get agency name
    let agency = null;
    if (userRecord.agency_id) {
      const { data: agencyData, error: agencyError } = await supabase
        .from('agencies')
        .select('id, name')
        .eq('id', userRecord.agency_id)
        .single() as { data: AgencyData | null; error: any };

      if (!agencyError && agencyData) {
        agency = {
          id: agencyData.id,
          name: agencyData.name,
          role: userRecord.role || 'member',
        };
      }
    }

    // Format profile response
    const profileResponse = {
      id: profile.id,
      clerk_id: profile.clerk_id,
      email: profile.email,
      first_name: profile.first_name,
      last_name: profile.last_name,
      image_url: profile.image_url,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    };

    return reply.send({
      profile: profileResponse,
      agency,
    });
  });
}
