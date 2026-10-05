import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { updateProfileSchema, addSkillSchema } from '../validators/user.validator';
import { idParamSchema } from '../validators/common.validator';

const router = Router();

// Current user
router.get('/me', authenticate, userController.getMe.bind(userController));
router.patch('/me', authenticate, validate(updateProfileSchema), userController.updateMe.bind(userController));
router.delete('/me', authenticate, userController.deleteMe.bind(userController));

// User skills
router.post('/me/skills', authenticate, validate(addSkillSchema), userController.addSkill.bind(userController));
router.delete('/me/skills/:skillId', authenticate, userController.removeSkill.bind(userController));

// Public profile
router.get('/:id', validate(idParamSchema, 'params'), userController.getPublicProfile.bind(userController));

export default router;
