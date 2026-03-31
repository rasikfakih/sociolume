import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { apiConfig } from '@sociolume/config';
import { healthRoutes } from './routes/health.js';
import { versionRoutes } from './routes/version.js';
import { authRoutes } from './routes/auth.js';
import { webhookRoutes } from './routes/webhooks.js';
import { brandRoutes } from './routes/brands.js';
import { startCronJobs } from './cron.js';
import { logger } from './utils/logger.js';

const fastify = Fastify({
  logger: logger as any,
});

async function buildApp() {
  // Register plugins
  await fastify.register(helmet, {
    contentSecurityPolicy: false,
  });

  await fastify.register(cors, {
    origin: apiConfig.corsOrigins,
    credentials: true,
  });

  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  // Register routes
  await fastify.register(healthRoutes, { prefix: '/api' });
  await fastify.register(versionRoutes, { prefix: '/api' });
  await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(webhookRoutes, { prefix: '/api/webhooks' });
  await fastify.register(brandRoutes, { prefix: '/api' });

  // Root route
  fastify.get('/', async () => {
    return { message: 'Sociolume API Gateway', version: '1.0.0' };
  });

  return fastify;
}

async function start() {
  try {
    const app = await buildApp();
    await app.listen({ port: apiConfig.port, host: apiConfig.host });
    startCronJobs();
    logger.info(`Server running on http://${apiConfig.host}:${apiConfig.port}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

start();

export { fastify, buildApp };
