import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { idParamSchema, paginationSchema } from '../validators/common.validator';

const router = Router();

router.get('/', authenticate, validate(paginationSchema, 'query'), notificationController.findMine.bind(notificationController));
router.patch('/read-all', authenticate, notificationController.markAllRead.bind(notificationController));
router.patch('/:id/read', authenticate, validate(idParamSchema, 'params'), notificationController.markRead.bind(notificationController));

export default router;
