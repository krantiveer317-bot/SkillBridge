import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/token';
import { sendError } from '../utils/response';

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    sendError(res, 'Authentication required', 401);
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role as import('@prisma/client').UserRole,
    };
    next();
  } catch {
    sendError(res, 'Invalid or expired token', 401);
  }
}

/** Optional auth — attaches user if token present, never blocks */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const payload = verifyAccessToken(authHeader.slice(7));
      req.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role as import('@prisma/client').UserRole,
      };
    } catch {
      // silently ignore — optional
    }
  }
  next();
}
