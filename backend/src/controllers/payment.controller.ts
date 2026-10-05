import { Request, Response, NextFunction } from 'express';
import { paymentService } from '../services/payment.service';
import { sendSuccess } from '../utils/response';

export class PaymentController {
  async findMine(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { transactions, totalEarnings, meta } = await paymentService.findMine(req.user!.userId, req.query as Record<string, string>);
      sendSuccess(res, 'Transactions retrieved', { transactions, totalEarnings }, 200, meta);
    } catch (err) { next(err); }
  }

  async initiate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await paymentService.initiate(req.user!.userId, req.body);
      sendSuccess(res, 'Payment initiation stub', data);
    } catch (err) { next(err); }
  }

  async webhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await paymentService.handleWebhook(req.body);
      sendSuccess(res, 'Webhook received', data);
    } catch (err) { next(err); }
  }
}

export const paymentController = new PaymentController();

