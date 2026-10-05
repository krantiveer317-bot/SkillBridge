import { Router } from 'express';
import { projectController } from '../controllers/project.controller';
import { authenticate } from '../middleware/authenticate';
import { optionalAuth } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { createProjectSchema, updateProjectSchema } from '../validators/project.validator';
import { idParamSchema, paginationSchema } from '../validators/common.validator';

const router = Router();

router.get('/', optionalAuth, validate(paginationSchema, 'query'), projectController.findAll.bind(projectController));
router.get('/my', authenticate, validate(paginationSchema, 'query'), projectController.findMine.bind(projectController));
router.get('/:id', validate(idParamSchema, 'params'), projectController.findById.bind(projectController));
router.post('/', authenticate, validate(createProjectSchema), projectController.create.bind(projectController));
router.patch('/:id', authenticate, validate(idParamSchema, 'params'), validate(updateProjectSchema), projectController.update.bind(projectController));
router.delete('/:id', authenticate, validate(idParamSchema, 'params'), projectController.delete.bind(projectController));
router.post('/:id/star', validate(idParamSchema, 'params'), projectController.star.bind(projectController));
router.post('/:id/publish', authenticate, validate(idParamSchema, 'params'), projectController.publish.bind(projectController));

export default router;
