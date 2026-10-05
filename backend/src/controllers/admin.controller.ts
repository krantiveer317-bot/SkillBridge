import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/admin.service';
import { sendSuccess, sendNoContent } from '../utils/response';

export class AdminController {
  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await adminService.getStats();
      sendSuccess(res, 'Platform stats retrieved', data);
    } catch (err) { next(err); }
  }

  async listUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { users, meta } = await adminService.listUsers(req.query as Record<string, string>);
      sendSuccess(res, 'Users retrieved', users, 200, meta);
    } catch (err) { next(err); }
  }

  async setUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { isActive } = req.body as { isActive: boolean };
      await adminService.setUserStatus((req.params.id as string), isActive);
      sendNoContent(res);
    } catch (err) { next(err); }
  }

  async setUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await adminService.setUserRole((req.params.id as string), req.body.role);
      sendSuccess(res, 'User role updated', data);
    } catch (err) { next(err); }
  }

  async listVerifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { requests, meta } = await adminService.listVerifications(req.query as Record<string, string>);
      sendSuccess(res, 'Verifications retrieved', requests, 200, meta);
    } catch (err) { next(err); }
  }

  async verifyCompany(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await adminService.verifyCompany((req.params.id as string));
      sendSuccess(res, 'Company verified', data);
    } catch (err) { next(err); }
  }
}

export const adminController = new AdminController();

