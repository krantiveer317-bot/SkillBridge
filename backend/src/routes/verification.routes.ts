import { Router } from 'express';
import { verificationController } from '../controllers/verification.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { verificationRequestSchema, reviewVerificationSchema } from '../validators/project.validator';
import { idParamSchema, paginationSchema } from '../validators/common.validator';

const router = Router();

router.post('/request', authenticate, validate(verificationRequestSchema), verificationController.request.bind(verificationController));
router.get('/my', authenticate, validate(paginationSchema, 'query'), verificationController.findMine.bind(verificationController));
router.get('/', authenticate, authorize('ADMIN', 'MENTOR'), validate(paginationSchema, 'query'), verificationController.findAll.bind(verificationController));
router.patch('/:id/review', authenticate, authorize('ADMIN', 'MENTOR'), validate(idParamSchema, 'params'), validate(reviewVerificationSchema), verificationController.review.bind(verificationController));

export default router;
