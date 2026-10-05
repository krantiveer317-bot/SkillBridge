import { Router, Request, Response } from 'express';
import { sendSuccess } from '../utils/response';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  sendSuccess(res, 'SkillBridge API is running', {
    version: 'v1',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

export default router;
