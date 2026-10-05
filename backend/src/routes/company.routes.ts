import { Router } from 'express';
import { companyController } from '../controllers/company.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { optionalAuth } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { updateCompanySchema } from '../validators/common.validator';
import { idParamSchema, paginationSchema } from '../validators/common.validator';

const router = Router();

router.get('/', optionalAuth, validate(paginationSchema, 'query'), companyController.findAll.bind(companyController));
router.get('/my', authenticate, authorize('COMPANY'), companyController.getMyProfile.bind(companyController));
router.get('/:id', validate(idParamSchema, 'params'), companyController.findById.bind(companyController));
router.post('/', authenticate, authorize('COMPANY'), companyController.createProfile.bind(companyController));
router.patch('/my', authenticate, authorize('COMPANY'), validate(updateCompanySchema), companyController.update.bind(companyController));

export default router;
