import { Router } from 'express';
import { skillController } from '../controllers/skill.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { optionalAuth } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { createSkillSchema } from '../validators/common.validator';
import { idParamSchema, paginationSchema } from '../validators/common.validator';

const router = Router();

router.get('/', optionalAuth, validate(paginationSchema, 'query'), skillController.findAll.bind(skillController));
router.get('/:id', validate(idParamSchema, 'params'), skillController.findById.bind(skillController));
router.post('/', authenticate, authorize('ADMIN'), validate(createSkillSchema), skillController.create.bind(skillController));
router.patch('/:id', authenticate, authorize('ADMIN'), validate(idParamSchema, 'params'), skillController.update.bind(skillController));
router.delete('/:id', authenticate, authorize('ADMIN'), validate(idParamSchema, 'params'), skillController.deactivate.bind(skillController));

export default router;
