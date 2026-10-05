import { Request, Response, NextFunction } from 'express';
import { skillExchangeService } from '../services/skillExchange.service';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response';

export class SkillExchangeController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await skillExchangeService.create(req.user!.userId, req.body);
      sendCreated(res, 'Skill exchange request created', data);
    } catch (err) { next(err); }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { requests, meta } = await skillExchangeService.findAll(req.query as Record<string, string>);
      sendSuccess(res, 'Exchange requests retrieved', requests, 200, meta);
    } catch (err) { next(err); }
  }

  async findMine(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { requests, meta } = await skillExchangeService.findMine(req.user!.userId, req.query as Record<string, string>);
      sendSuccess(res, 'Your exchange requests retrieved', requests, 200, meta);
    } catch (err) { next(err); }
  }

  async accept(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await skillExchangeService.accept(req.params.id, req.user!.userId);
      sendSuccess(res, 'Exchange request accepted', data);
    } catch (err) { next(err); }
  }

  async complete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await skillExchangeService.complete(req.params.id, req.user!.userId);
      sendSuccess(res, 'Exchange marked as complete', data);
    } catch (err) { next(err); }
  }

  async cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await skillExchangeService.cancel(req.params.id, req.user!.userId);
      sendNoContent(res);
    } catch (err) { next(err); }
  }
}

export const skillExchangeController = new SkillExchangeController();
