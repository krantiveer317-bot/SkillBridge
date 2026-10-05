import { Router } from 'express';
import { applicationController } from '../controllers/opportunity.controller';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { createApplicationSchema, updateApplicationStatusSchema } from '../validators/opportunity.validator';
import { idParamSchema, paginationSchema } from '../validators/common.validator';

const router = Router();

router.post('/', authenticate, validate(createApplicationSchema), applicationController.apply.bind(applicationController));
router.get('/my', authenticate, validate(paginationSchema, 'query'), applicationController.findMine.bind(applicationController));
router.patch('/:id/status', authenticate, validate(idParamSchema, 'params'), validate(updateApplicationStatusSchema), applicationController.updateStatus.bind(applicationController));
router.delete('/:id', authenticate, validate(idParamSchema, 'params'), applicationController.withdraw.bind(applicationController));

export default router;
