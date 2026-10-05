import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { logger } from './utils/logger';
import { globalRateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Routes
import healthRouter from './routes/health.routes';
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import projectRouter from './routes/project.routes';
import verificationRouter from './routes/verification.routes';
import opportunityRouter from './routes/opportunity.routes';
import applicationRouter from './routes/application.routes';
import mentorRouter from './routes/mentor.routes';
import companyRouter from './routes/company.routes';
import skillRouter from './routes/skill.routes';
import skillExchangeRouter from './routes/skillExchange.routes';
import freelanceRouter from './routes/freelance.routes';
import notificationRouter from './routes/notification.routes';
import paymentRouter from './routes/payment.routes';
import adminRouter from './routes/admin.routes';

const app = express();

// ── Security & Parsing ────────────────────────────────────────
app.use(helmet());

app.use(
  cors({
    origin: env.CORS_ORIGINS.split(',').map((o) => o.trim()),
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ── Logging ───────────────────────────────────────────────────
app.use(
  morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

// ── Rate Limiting ─────────────────────────────────────────────
app.use(globalRateLimiter);

// ── API Routes v1 ─────────────────────────────────────────────
const API_PREFIX = `/api/${env.API_VERSION}`;

app.use(`${API_PREFIX}/health`, healthRouter);
app.use(`${API_PREFIX}/auth`, authRouter);
app.use(`${API_PREFIX}/users`, userRouter);
app.use(`${API_PREFIX}/projects`, projectRouter);
app.use(`${API_PREFIX}/verification`, verificationRouter);
app.use(`${API_PREFIX}/opportunities`, opportunityRouter);
app.use(`${API_PREFIX}/applications`, applicationRouter);
app.use(`${API_PREFIX}/mentors`, mentorRouter);
app.use(`${API_PREFIX}/companies`, companyRouter);
app.use(`${API_PREFIX}/skills`, skillRouter);
app.use(`${API_PREFIX}/skill-exchange`, skillExchangeRouter);
app.use(`${API_PREFIX}/freelance`, freelanceRouter);
app.use(`${API_PREFIX}/notifications`, notificationRouter);
app.use(`${API_PREFIX}/payments`, paymentRouter);
app.use(`${API_PREFIX}/admin`, adminRouter);

// ── 404 & Error Handlers ──────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Bootstrap ─────────────────────────────────────────────────
async function bootstrap() {
  try {
    await connectDatabase();

    logger.info('✅  Database connected');

    // Listen on all network interfaces
    // This allows other devices on the same Wi-Fi
    // to access the backend using your PC's IPv4 address.
    const server = app.listen(env.PORT, '0.0.0.0', () => {
      logger.info(
        `🚀  SkillBridge API running on http://0.0.0.0:${env.PORT}${API_PREFIX}`,
      );

      logger.info(
        `📋  Health: http://0.0.0.0:${env.PORT}${API_PREFIX}/health`,
      );

      logger.info(`🌍  Environment: ${env.NODE_ENV}`);
    });

    // ── Graceful shutdown ────────────────────────────────────
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