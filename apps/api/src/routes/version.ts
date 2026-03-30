import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export async function versionRoutes(fastify: FastifyInstance) {
  fastify.get('/version', async (_request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({
      version: '1.0.0',
      name: 'Sociolume API',
      environment: process.env.NODE_ENV || 'development',
    });
  });
}
