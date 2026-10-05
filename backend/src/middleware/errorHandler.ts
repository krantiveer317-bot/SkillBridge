import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';
import { sendError } from '../utils/response';
import { env } from '../config/env';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  // Operational / known errors
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode, err.errors);
    return;
  }

  // Zod validation (should normally be caught by validate middleware)
  if (err instanceof ZodError) {
    sendError(res, 'Validation failed', 422);
    return;
  }

  // JWT errors
  if (err instanceof TokenExpiredError) {
    sendError(res, 'Token has expired', 401);
    return;
  }
  if (err instanceof JsonWebTokenError) {
    sendError(res, 'Invalid token', 401);
    return;
  }

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const fields = (err.meta?.target as string[])?.join(', ') ?? 'field';
      sendError(res, `A record with this ${fields} already exists`, 409);
      return;
    }
    if (err.code === 'P2025') {
      sendError(res, 'Record not found', 404);
      return;
    }
    if (err.code === 'P2003') {
      sendError(res, 'Related record not found', 400);
      return;
    }
    logger.error('Prisma error', { code: err.code, meta: err.meta });
    sendError(res, 'Database error', 500);
    return;
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    sendError(res, 'Invalid data provided', 400);
    return;
  }

  // Unhandled — log and return generic 500
  logger.error('Unhandled error', {
    message: err.message,
    stack: env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  sendError(res, env.NODE_ENV === 'production' ? 'Internal server error' : err.message, 500);
}
