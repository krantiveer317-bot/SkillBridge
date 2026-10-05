import { Request, Response, NextFunction } from 'express';
import { skillService } from '../services/skill.service';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response';

export class SkillController {
  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { skills, meta } = await skillService.findAll(req.query as Record<string, string>);
      sendSuccess(res, 'Skills retrieved', skills, 200, meta);
    } catch (err) { next(err); }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await skillService.findById((req.params.id as string));
      sendSuccess(res, 'Skill retrieved', data);
    } catch (err) { next(err); }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await skillService.create(req.body);
      sendCreated(res, 'Skill created', data);
    } catch (err) { next(err); }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await skillService.update((req.params.id as string), req.body);
      sendSuccess(res, 'Skill updated', data);
    } catch (err) { next(err); }
  }

  async deactivate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await skillService.deactivate((req.params.id as string));
      sendNoContent(res);
    } catch (err) { next(err); }
  }
}

export const skillController = new SkillController();

