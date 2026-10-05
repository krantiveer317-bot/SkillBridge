import { Router } from 'express';
import { opportunityController, applicationController } from '../controllers/opportunity.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { optionalAuth } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { createOpportunitySchema, updateOpportunitySchema, createApplicationSchema, updateApplicationStatusSchema } from '../validators/opportunity.validator';
import { idParamSchema, paginationSchema } from '../validators/common.validator';

const router = Router();

// Opportunities
router.get('/', optionalAuth, validate(paginationSchema, 'query'), opportunityController.findAll.bind(opportunityController));
router.get('/:id', validate(idParamSchema, 'params'), opportunityController.findById.bind(opportunityController));
router.post('/', authenticate, authorize('COMPANY', 'ADMIN'), validate(createOpportunitySchema), opportunityController.create.bind(opportunityController));
router.patch('/:id', authenticate, authorize('COMPANY', 'ADMIN'), validate(idParamSchema, 'params'), validate(updateOpportunitySchema), opportunityController.update.bind(opportunityController));
router.delete('/:id', authenticate, authorize('COMPANY', 'ADMIN'), validate(idParamSchema, 'params'), opportunityController.deactivate.bind(opportunityController));

// Applications within opportunity (company view)
router.get('/:id/applications', authenticate, authorize('COMPANY', 'ADMIN'), validate(idParamSchema, 'params'), applicationController.findForOpportunity.bind(applicationController));

export default router;
