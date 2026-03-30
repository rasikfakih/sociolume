import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (_request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'api',
    });
  });

  fastify.get('/health/live', async (_request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({ status: 'ok' });
  });

  fastify.get('/health/ready', async (_request: FastifyRequest, reply: FastifyReply) => {
    // Add checks for dependencies here
    return reply.send({ status: 'ready' });
  });
}
