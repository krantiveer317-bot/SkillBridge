import { Request, Response, NextFunction } from 'express';
import { projectService } from '../services/project.service';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response';

export class ProjectController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await projectService.create(req.user!.userId, req.body);
      sendCreated(res, 'Project created', data);
    } catch (err) { next(err); }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projects, meta } = await projectService.findAll(req.query as Record<string, string>);
      sendSuccess(res, 'Projects retrieved', projects, 200, meta);
    } catch (err) { next(err); }
  }

  async findMine(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projects, meta } = await projectService.findMine(req.user!.userId, req.query as Record<string, string>);
      sendSuccess(res, 'Your projects retrieved', projects, 200, meta);
    } catch (err) { next(err); }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await projectService.findById(req.params.id);
      sendSuccess(res, 'Project retrieved', data);
    } catch (err) { next(err); }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await projectService.update(req.params.id, req.user!.userId, req.body);
      sendSuccess(res, 'Project updated', data);
    } catch (err) { next(err); }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await projectService.delete(req.params.id, req.user!.userId);
      sendNoContent(res);
    } catch (err) { next(err); }
  }

  async star(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await projectService.star(req.params.id);
      sendSuccess(res, 'Project starred', { starsCount: data.starsCount });
    } catch (err) { next(err); }
  }

  async publish(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await projectService.publish(req.params.id, req.user!.userId);
      sendSuccess(res, 'Project published', data);
    } catch (err) { next(err); }
  }
}

export const projectController = new ProjectController();
