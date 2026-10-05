import 'dotenv/config';

import app from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { logger } from './utils/logger';

async function bootstrap() {
  try {
    await connectDatabase();

    logger.info('Database connected');

    const server = app.listen(env.PORT, '0.0.0.0', () => {
      logger.info(
        `SkillBridge API running on http://0.0.0.0:${env.PORT}/api/${env.API_VERSION}`,
      );

      logger.info(
        `Health: http://0.0.0.0:${env.PORT}/api/${env.API_VERSION}/health`,
      );

      logger.info(`Environment: ${env.NODE_ENV}`);
    });

    const shutdown = async (signal: string) => {
      logger.info(`${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        await disconnectDatabase();

        logger.info('Server closed. DB disconnected.');

        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
}

bootstrap();

export default app;
