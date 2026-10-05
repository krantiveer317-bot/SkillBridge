import { Router } from 'express';
import { mentorController, sessionController, courseController } from '../controllers/mentor.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { optionalAuth } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { updateMentorSchema, bookSessionSchema, updateSessionSchema, createCourseSchema, updateCourseSchema } from '../validators/common.validator';
import { idParamSchema, paginationSchema } from '../validators/common.validator';

const router = Router();

// Mentors
router.get('/', optionalAuth, validate(paginationSchema, 'query'), mentorController.findAll.bind(mentorController));
router.get('/my', authenticate, authorize('MENTOR'), mentorController.getMyProfile.bind(mentorController));
router.get('/:id', validate(idParamSchema, 'params'), mentorController.findById.bind(mentorController));
router.post('/register', authenticate, mentorController.register.bind(mentorController));
router.patch('/my', authenticate, authorize('MENTOR'), validate(updateMentorSchema), mentorController.update.bind(mentorController));

// Sessions
router.post('/sessions', authenticate, validate(bookSessionSchema), sessionController.book.bind(sessionController));
router.get('/sessions/my', authenticate, validate(paginationSchema, 'query'), sessionController.findMine.bind(sessionController));
router.patch('/sessions/:id', authenticate, validate(idParamSchema, 'params'), validate(updateSessionSchema), sessionController.update.bind(sessionController));

// Courses
router.get('/courses', optionalAuth, validate(paginationSchema, 'query'), courseController.findAll.bind(courseController));
router.get('/courses/:id', validate(idParamSchema, 'params'), courseController.findById.bind(courseController));
router.post('/courses', authenticate, authorize('MENTOR'), validate(createCourseSchema), courseController.create.bind(courseController));
router.patch('/courses/:id', authenticate, authorize('MENTOR'), validate(idParamSchema, 'params'), validate(updateCourseSchema), courseController.update.bind(courseController));
router.delete('/courses/:id', authenticate, authorize('MENTOR'), validate(idParamSchema, 'params'), courseController.delete.bind(courseController));

export default router;
