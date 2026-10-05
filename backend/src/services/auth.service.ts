import { sendVerificationEmail } from './email.service';
import { prisma } from '../config/database';
import { hashPassword, comparePassword } from '../utils/hash';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/token';
import { AppError } from '../middleware/errorHandler';
import {
  RegisterInput,
  LoginInput,
} from '../validators/auth.validator';
import { UserRole } from '@prisma/client';
import { randomBytes, randomInt } from 'crypto';

export class AuthService {
  async register(input: RegisterInput) {
    const existing = await prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (existing) {
      throw new AppError('Email is already registered', 409);
    }

    const passwordHash = await hashPassword(input.password);

    const name = (input as RegisterInput & { name?: string }).name;

    if (!name || !name.trim()) {
      throw new AppError('Name is required', 400);
    }

    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        role: input.role as UserRole,

        // New accounts are not verified yet
        isVerified: false,
        isActive: true,

        profile: {
          create: {
            name: name.trim(),
            title:
              input.role === 'MENTOR'
                ? 'Mentor'
                : input.role === 'COMPANY'
                  ? 'Company'
                  : 'Student',
          },
        },
      },

      select: {
        id: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
        profile: true,
      },
    });

    // Generate 6-digit OTP
    const verificationCode = randomInt(
      100000,
      1000000
    ).toString();

    // OTP valid for 10 minutes
    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // Remove any previous OTP
    await prisma.emailVerificationCode.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // Save new OTP
    await prisma.emailVerificationCode.create({
      data: {
        userId: user.id,
        code: verificationCode,
        expiresAt,
      },
    });

    // Send OTP to user's email
    await sendVerificationEmail(
      user.email,
      verificationCode
    );

    return {
      user,
      requiresVerification: true,
      message:
        'Account created. Please verify your email using the OTP.',
    };
  }

  async verifyEmail(email: string, code: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.isVerified) {
      throw new AppError(
        'Email is already verified',
        400
      );
    }

    const verification =
      await prisma.emailVerificationCode.findFirst({
        where: {
          userId: user.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

    if (!verification) {
      throw new AppError(
        'No verification code found. Please request a new OTP.',
        400
      );
    }

    // Check expiry
    if (verification.expiresAt < new Date()) {
      await prisma.emailVerificationCode.delete({
        where: {
          id: verification.id,
        },
      });

      throw new AppError(
        'OTP has expired. Please request a new OTP.',
        400
      );
    }

    // Maximum 5 attempts
    if (verification.attempts >= 5) {
      throw new AppError(
        'Too many incorrect attempts. Please request a new OTP.',
        429
      );
    }

    // Check OTP
    if (verification.code !== code) {
      await prisma.emailVerificationCode.update({
        where: {
          id: verification.id,
        },
        data: {
          attempts: {
            increment: 1,
          },
        },
      });

      throw new AppError(
        'Invalid OTP',
        400
      );
    }

    // Mark email as verified
    const verifiedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isVerified: true,
        emailVerifiedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        role: true,
        isVerified: true,
        profile: true,
      },
    });

    // Delete used OTP
    await prisma.emailVerificationCode.delete({
      where: {
        id: verification.id,
      },
    });

    return verifiedUser;
  }

  async resendVerificationCode(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.isVerified) {
      throw new AppError(
        'Email is already verified',
        400
      );
    }

    // Generate new 6-digit OTP
    const code = randomInt(
      100000,
      1000000
    ).toString();

    // OTP valid for 10 minutes
    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // Remove previous OTP
    await prisma.emailVerificationCode.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // Save new OTP
    await prisma.emailVerificationCode.create({
      data: {
        userId: user.id,
        code,
        expiresAt,
      },
    });

    // Send new OTP to email
    await sendVerificationEmail(
      user.email,
      code
    );

    return {
      message:
        'A new OTP has been sent to your email.',
    };
  }

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: {
        email: input.email,
      },
      select: {
        id: true,
        email: true,
        role: true,
        passwordHash: true,
        isActive: true,
        isVerified: true,
      },
    });

    if (
      !user ||
      !(await comparePassword(
        input.password,
        user.passwordHash
      ))
    ) {
      throw new AppError(
        'Invalid email or password',
        401
      );
    }

    if (!user.isActive) {
      throw new AppError(
        'Account has been deactivated',
        403
      );
    }

    // Do not allow login before email verification
    if (!user.isVerified) {
      throw new AppError(
        'Please verify your email with the OTP before logging in.',
        403
      );
    }

    // Update last login
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        lastLoginAt: new Date(),
      },
    });

    // Create access token
    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Create refresh token
    const tokenId = randomBytes(16).toString('hex');

    const refreshToken = signRefreshToken({
      userId: user.id,
      tokenId,
    });

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(
          Date.now() +
            7 * 24 * 60 * 60 * 1000
        ),
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    const payload =
      verifyRefreshToken(refreshToken);

    const stored =
      await prisma.refreshToken.findUnique({
        where: {
          token: refreshToken,
        },
      });

    if (
      !stored ||
      stored.expiresAt < new Date()
    ) {
      throw new AppError(
        'Invalid or expired refresh token',
        401
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        isVerified: true,
      },
    });

    if (!user || !user.isActive) {
      throw new AppError(
        'User not found or inactive',
        401
      );
    }

    if (!user.isVerified) {
      throw new AppError(
        'Email is not verified',
        403
      );
    }

    // Delete old refresh token
    await prisma.refreshToken.delete({
      where: {
        token: refreshToken,
      },
    });

    // Create new access token
    const newAccessToken =
      signAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

    // Create new refresh token
    const tokenId = randomBytes(16).toString('hex');

    const newRefreshToken =
      signRefreshToken({
        userId: user.id,
        tokenId,
      });

    // Store new refresh token
    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt: new Date(
          Date.now() +
            7 * 24 * 60 * 60 * 1000
        ),
      },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string) {
    await prisma.refreshToken.deleteMany({
      where: {
        token: refreshToken,
      },
    });
  }

  async logoutAll(userId: string) {
    await prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  }
}

export const authService =
  new AuthService();