import { Request, Response, NextFunction } from 'express';
import { companyService } from '../services/company.service';
import { sendSuccess, sendCreated } from '../utils/response';

export class CompanyController {
  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { companies, meta } = await companyService.findAll(req.query as Record<string, string>);
      sendSuccess(res, 'Companies retrieved', companies, 200, meta);
    } catch (err) { next(err); }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await companyService.findById((req.params.id as string));
      sendSuccess(res, 'Company retrieved', data);
    } catch (err) { next(err); }
  }

  async getMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await companyService.getMyProfile(req.user!.userId);
      sendSuccess(res, 'Company profile retrieved', data);
    } catch (err) { next(err); }
  }

  async createProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await companyService.createProfile(req.user!.userId, req.body);
      sendCreated(res, 'Company profile created', data);
    } catch (err) { next(err); }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await companyService.update(req.user!.userId, req.body);
      sendSuccess(res, 'Company profile updated', data);
    } catch (err) { next(err); }
  }
}

export const companyController = new CompanyController();

