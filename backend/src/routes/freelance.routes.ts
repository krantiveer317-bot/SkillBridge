import { Router } from 'express';
import { freelanceController } from '../controllers/freelance.controller';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { freelanceContractSchema, updateContractStatusSchema } from '../validators/common.validator';
import { idParamSchema, paginationSchema } from '../validators/common.validator';

const router = Router();

router.get('/', validate(paginationSchema, 'query'), freelanceController.findAll.bind(freelanceController));
router.get('/my', authenticate, validate(paginationSchema, 'query'), freelanceController.findMine.bind(freelanceController));
router.post('/', authenticate, validate(freelanceContractSchema), freelanceController.create.bind(freelanceController));
router.post('/:id/accept', authenticate, validate(idParamSchema, 'params'), freelanceController.accept.bind(freelanceController));
router.patch('/:id/status', authenticate, validate(idParamSchema, 'params'), validate(updateContractStatusSchema), freelanceController.updateStatus.bind(freelanceController));
router.delete('/:id', authenticate, validate(idParamSchema, 'params'), freelanceController.cancel.bind(freelanceController));

export default router;
