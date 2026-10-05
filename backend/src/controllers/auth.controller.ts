import {
  Request,
  Response,
  NextFunction,
} from 'express';

import { authService } from '../services/auth.service';

import {
  sendSuccess,
  sendCreated,
} from '../utils/response';

import {
  RegisterInput,
  LoginInput,
  RefreshTokenInput,
} from '../validators/auth.validator';

export class AuthController {
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await authService.register(
        req.body as RegisterInput
      );

      sendCreated(
        res,
        'Account created. Please verify your email.',
        result
      );
    } catch (err) {
      next(err);
    }
  }

  async verifyEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, code } = req.body as {
        email: string;
        code: string;
      };

      if (!email || !code) {
        throw new Error(
          'Email and OTP are required'
        );
      }

      const user = await authService.verifyEmail(
        email,
        code
      );

      sendSuccess(
        res,
        'Email verified successfully',
        { user }
      );
    } catch (err) {
      next(err);
    }
  }

  async resendVerificationCode(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body as {
        email: string;
      };

      if (!email) {
        throw new Error('Email is required');
      }

      const result =
        await authService.resendVerificationCode(
          email
        );

      sendSuccess(
        res,
        result.message,
        result
      );
    } catch (err) {
      next(err);
    }
  }

  async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await authService.login(
        req.body as LoginInput
      );

      sendSuccess(
        res,
        'Login successful',
        result
      );
    } catch (err) {
      next(err);
    }
  }

  async refresh(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { refreshToken } =
        req.body as RefreshTokenInput;

      const result =
        await authService.refresh(refreshToken);

      sendSuccess(
        res,
        'Token refreshed',
        result
      );
    } catch (err) {
      next(err);
    }
  }

  async logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { refreshToken } =
        req.body as RefreshTokenInput;

      await authService.logout(refreshToken);

      sendSuccess(
        res,
        'Logged out successfully'
      );
    } catch (err) {
      next(err);
    }
  }

  async logoutAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await authService.logoutAll(
        req.user!.userId
      );

      sendSuccess(
        res,
        'Logged out from all devices'
      );
    } catch (err) {
      next(err);
    }
  }

  async me(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      sendSuccess(
        res,
        'Authenticated',
        {
          user: req.user,
        }
      );
    } catch (err) {
      next(err);
    }
  }
}

export const authController =
  new AuthController();
