import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { idParamSchema, paginationSchema } from '../validators/common.validator';

const router = Router();

// All admin routes require ADMIN role
router.use(authenticate, authorize('ADMIN'));

router.get('/stats', adminController.getStats.bind(adminController));
router.get('/users', validate(paginationSchema, 'query'), adminController.listUsers.bind(adminController));
router.patch('/users/:id/status', validate(idParamSchema, 'params'), adminController.setUserStatus.bind(adminController));
router.patch('/users/:id/role', validate(idParamSchema, 'params'), adminController.setUserRole.bind(adminController));
router.get('/verifications', validate(paginationSchema, 'query'), adminController.listVerifications.bind(adminController));
router.patch('/companies/:id/verify', validate(idParamSchema, 'params'), adminController.verifyCompany.bind(adminController));

export default router;
