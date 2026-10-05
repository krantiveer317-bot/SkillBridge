import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100)
    .trim(),

  email: z
    .string()
    .email('Invalid email address')
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /[A-Z]/,
      'Password must contain at least one uppercase letter'
    )
    .regex(
      /[0-9]/,
      'Password must contain at least one number'
    ),

  role: z
    .enum(['STUDENT', 'MENTOR', 'COMPANY'])
    .default('STUDENT'),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(1, 'Password is required'),
});

/*
 * Verify Email OTP
 */
export const verifyEmailSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .trim()
    .toLowerCase(),

  code: z
    .string()
    .regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
});

/*
 * Resend Email OTP
 */
export const resendVerificationSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .trim()
    .toLowerCase(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z
    .string()
    .min(1, 'Refresh token is required'),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .trim()
    .toLowerCase(),
});

export const resetPasswordSchema = z.object({
  token: z
    .string()
    .min(1, 'Reset token is required'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /[A-Z]/,
      'Password must contain at least one uppercase letter'
    )
    .regex(
      /[0-9]/,
      'Password must contain at least one number'
    ),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Current password is required'),

  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .regex(
      /[A-Z]/,
      'Password must contain at least one uppercase letter'
    )
    .regex(
      /[0-9]/,
      'Password must contain at least one number'
    ),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationInput = z.infer<
  typeof resendVerificationSchema
>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;