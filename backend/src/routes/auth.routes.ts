import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { authRateLimiter } from '../middleware/rateLimiter';

import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  verifyEmailSchema,
  resendVerificationSchema,
} from '../validators/auth.validator';

const router = Router();

/*
 * ============================================================
 * REGISTER
 * POST /api/v1/auth/register
 *
 * Body:
 * {
 *   "name": "Krantiveer Lamba",
 *   "email": "user@example.com",
 *   "password": "Password123",
 *   "role": "STUDENT"
 * }
 *
 * After registration:
 * - User is created
 * - isVerified = false
 * - 6-digit OTP is generated
 * - OTP is saved in database
 * - OTP is shown in backend terminal for now
 * ============================================================
 */
router.post(
  '/register',
  authRateLimiter,
  validate(registerSchema),
  authController.register.bind(authController)
);

/*
 * ============================================================
 * VERIFY EMAIL OTP
 * POST /api/v1/auth/verify-email
 *
 * Body:
 * {
 *   "email": "user@example.com",
 *   "code": "123456"
 * }
 *
 * OTP must:
 * - Be exactly 6 digits
 * - Not be expired
 * - Match the latest OTP
 *
 * Successful verification:
 * - isVerified = true
 * - emailVerifiedAt = current time
 * ============================================================
 */
router.post(
  '/verify-email',
  authRateLimiter,
  validate(verifyEmailSchema),
  authController.verifyEmail.bind(authController)
);

/*
 * ============================================================
 * RESEND VERIFICATION OTP
 * POST /api/v1/auth/resend-verification
 *
 * Body:
 * {
 *   "email": "user@example.com"
 * }
 *
 * Generates a new 6-digit OTP.
 * ============================================================
 */
router.post(
  '/resend-verification',
  authRateLimiter,
  validate(resendVerificationSchema),
  authController.resendVerificationCode.bind(authController)
);

/*
 * ============================================================
 * LOGIN
 * POST /api/v1/auth/login
 *
 * Body:
 * {
 *   "email": "user@example.com",
 *   "password": "Password123"
 * }
 *
 * Login is allowed only after email verification.
 * ============================================================
 */
router.post(
  '/login',
  authRateLimiter,
  validate(loginSchema),
  authController.login.bind(authController)
);

/*
 * ============================================================
 * REFRESH ACCESS TOKEN
 * POST /api/v1/auth/refresh
 * ============================================================
 */
router.post(
  '/refresh',
  validate(refreshTokenSchema),
  authController.refresh.bind(authController)
);

/*
 * ============================================================
 * LOGOUT
 * POST /api/v1/auth/logout
 * ============================================================
 */
router.post(
  '/logout',
  validate(refreshTokenSchema),
  authController.logout.bind(authController)
);

/*
 * ============================================================
 * LOGOUT ALL DEVICES
 * POST /api/v1/auth/logout-all
 *
 * Requires authentication.
 * ============================================================
 */
router.post(
  '/logout-all',
  authenticate,
  authController.logoutAll.bind(authController)
);

/*
 * ============================================================
 * CURRENT AUTHENTICATED USER
 * GET /api/v1/auth/me
 *
 * Requires:
 * Authorization: Bearer <access-token>
 * ============================================================
 */
router.get(
  '/me',
  authenticate,
  authController.me.bind(authController)
);

export default router;