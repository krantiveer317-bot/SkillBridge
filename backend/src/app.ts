import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { env } from './config/env';
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

app.use(
  morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

app.use(globalRateLimiter);

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

app.use(notFound);
app.use(errorHandler);

export default app;
