import { Request, Response, NextFunction } from 'express';
import { freelanceService } from '../services/freelance.service';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response';

export class FreelanceController {
  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { contracts, meta } = await freelanceService.findAll(req.query as Record<string, string>);
      sendSuccess(res, 'Contracts retrieved', contracts, 200, meta);
    } catch (err) { next(err); }
  }

  async findMine(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { contracts, meta } = await freelanceService.findMine(req.user!.userId, req.query as Record<string, string>);
      sendSuccess(res, 'Your contracts retrieved', contracts, 200, meta);
    } catch (err) { next(err); }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await freelanceService.create(req.user!.userId, req.body);
      sendCreated(res, 'Contract created', data);
    } catch (err) { next(err); }
  }

  async accept(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await freelanceService.accept((req.params.id as string), req.user!.userId);
      sendSuccess(res, 'Contract accepted', data);
    } catch (err) { next(err); }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await freelanceService.updateStatus((req.params.id as string), req.user!.userId, req.body);
      sendSuccess(res, 'Contract status updated', data);
    } catch (err) { next(err); }
  }

  async cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await freelanceService.updateStatus((req.params.id as string), req.user!.userId, { status: 'CANCELLED' });
      sendNoContent(res);
    } catch (err) { next(err); }
  }
}

export const freelanceController = new FreelanceController();

