import { Request, Response, NextFunction } from 'express';
import { notificationService } from '../services/notification.service';
import { sendSuccess, sendNoContent } from '../utils/response';

export class NotificationController {
  async findMine(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { notifications, unreadCount, meta } = await notificationService.findMine(req.user!.userId, req.query as Record<string, string>);
      sendSuccess(res, 'Notifications retrieved', { notifications, unreadCount }, 200, meta);
    } catch (err) { next(err); }
  }

  async markRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await notificationService.markRead(req.params.id, req.user!.userId);
      sendNoContent(res);
    } catch (err) { next(err); }
  }

  async markAllRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await notificationService.markAllRead(req.user!.userId);
      sendNoContent(res);
    } catch (err) { next(err); }
  }
}

export const notificationController = new NotificationController();
