import { Request, Response, NextFunction } from 'express';
import { verificationService } from '../services/verification.service';
import { sendSuccess, sendCreated } from '../utils/response';

export class VerificationController {
  async request(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await verificationService.request(req.user!.userId, req.body);
      sendCreated(res, 'Verification request submitted', data);
    } catch (err) { next(err); }
  }

  async findMine(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { requests, meta } = await verificationService.findMine(req.user!.userId, req.query as Record<string, string>);
      sendSuccess(res, 'Verification requests retrieved', requests, 200, meta);
    } catch (err) { next(err); }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { requests, meta } = await verificationService.findAll(req.query as Record<string, string>);
      sendSuccess(res, 'Verification requests retrieved', requests, 200, meta);
    } catch (err) { next(err); }
  }

  async review(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await verificationService.review((req.params.id as string), req.user!.userId, req.body);
      sendSuccess(res, 'Verification reviewed', data);
    } catch (err) { next(err); }
  }
}

export const verificationController = new VerificationController();

