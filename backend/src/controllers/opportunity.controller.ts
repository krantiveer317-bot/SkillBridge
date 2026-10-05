import { Request, Response, NextFunction } from 'express';
import { opportunityService, applicationService } from '../services/opportunity.service';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response';

export class OpportunityController {
  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { opportunities, meta } = await opportunityService.findAll(req.query as Record<string, string>);
      sendSuccess(res, 'Opportunities retrieved', opportunities, 200, meta);
    } catch (err) { next(err); }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await opportunityService.findById(req.params.id);
      sendSuccess(res, 'Opportunity retrieved', data);
    } catch (err) { next(err); }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await opportunityService.create(req.user!.userId, req.body);
      sendCreated(res, 'Opportunity created', data);
    } catch (err) { next(err); }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await opportunityService.update(req.params.id, req.user!.userId, req.body);
      sendSuccess(res, 'Opportunity updated', data);
    } catch (err) { next(err); }
  }

  async deactivate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await opportunityService.deactivate(req.params.id, req.user!.userId);
      sendNoContent(res);
    } catch (err) { next(err); }
  }
}

export class ApplicationController {
  async apply(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await applicationService.apply(req.user!.userId, req.body);
      sendCreated(res, 'Application submitted', data);
    } catch (err) { next(err); }
  }

  async findMine(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { applications, meta } = await applicationService.findMine(req.user!.userId, req.query as Record<string, string>);
      sendSuccess(res, 'Applications retrieved', applications, 200, meta);
    } catch (err) { next(err); }
  }

  async findForOpportunity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { applications, meta } = await applicationService.findForOpportunity(req.params.id, req.user!.userId, req.query as Record<string, string>);
      sendSuccess(res, 'Applications retrieved', applications, 200, meta);
    } catch (err) { next(err); }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await applicationService.updateStatus(req.params.id, req.user!.userId, req.body);
      sendSuccess(res, 'Application status updated', data);
    } catch (err) { next(err); }
  }

  async withdraw(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await applicationService.withdraw(req.params.id, req.user!.userId);
      sendNoContent(res);
    } catch (err) { next(err); }
  }
}

export const opportunityController = new OpportunityController();
export const applicationController = new ApplicationController();
