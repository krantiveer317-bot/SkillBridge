import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { skillService } from '../services/skill.service';
import { sendSuccess, sendNoContent } from '../utils/response';

export class UserController {
  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await userService.getMe(req.user!.userId);
      sendSuccess(res, 'Profile retrieved', data);
    } catch (err) { next(err); }
  }

  async updateMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await userService.updateMe(req.user!.userId, req.body);
      sendSuccess(res, 'Profile updated', data);
    } catch (err) { next(err); }
  }

  async deleteMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await userService.deleteMe(req.user!.userId);
      sendNoContent(res);
    } catch (err) { next(err); }
  }

  async getPublicProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await userService.getPublicProfile((req.params.id as string));
      sendSuccess(res, 'Public profile retrieved', data);
    } catch (err) { next(err); }
  }

  async listUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { users, meta } = await userService.listUsers(req.query as Record<string, string>);
      sendSuccess(res, 'Users retrieved', users, 200, meta);
    } catch (err) { next(err); }
  }

  async addSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await skillService.addToUser(req.user!.userId, req.body.skillId, req.body.level);
      sendSuccess(res, 'Skill added', data);
    } catch (err) { next(err); }
  }

  async removeSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await skillService.removeFromUser(req.user!.userId, (req.params.skillId as string));
      sendNoContent(res);
    } catch (err) { next(err); }
  }
}

export const userController = new UserController();


