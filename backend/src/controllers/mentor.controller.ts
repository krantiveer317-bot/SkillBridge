import { Request, Response, NextFunction } from 'express';
import { mentorService, sessionService, courseService } from '../services/mentor.service';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response';

export class MentorController {
  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { mentors, meta } = await mentorService.findAll(req.query as Record<string, string>);
      sendSuccess(res, 'Mentors retrieved', mentors, 200, meta);
    } catch (err) { next(err); }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await mentorService.findById(req.params.id);
      sendSuccess(res, 'Mentor retrieved', data);
    } catch (err) { next(err); }
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await mentorService.register(req.user!.userId);
      sendCreated(res, 'Mentor profile created', data);
    } catch (err) { next(err); }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await mentorService.update(req.user!.userId, req.body);
      sendSuccess(res, 'Mentor profile updated', data);
    } catch (err) { next(err); }
  }

  async getMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await mentorService.getMyProfile(req.user!.userId);
      sendSuccess(res, 'Mentor profile retrieved', data);
    } catch (err) { next(err); }
  }
}

export class SessionController {
  async book(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await sessionService.book(req.user!.userId, req.body);
      sendCreated(res, 'Session booked', data);
    } catch (err) { next(err); }
  }

  async findMine(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessions, meta } = await sessionService.findMine(req.user!.userId, req.query as Record<string, string>);
      sendSuccess(res, 'Sessions retrieved', sessions, 200, meta);
    } catch (err) { next(err); }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await sessionService.update(req.params.id, req.user!.userId, req.body);
      sendSuccess(res, 'Session updated', data);
    } catch (err) { next(err); }
  }
}

export class CourseController {
  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { courses, meta } = await courseService.findAll(req.query as Record<string, string>);
      sendSuccess(res, 'Courses retrieved', courses, 200, meta);
    } catch (err) { next(err); }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await courseService.findById(req.params.id);
      sendSuccess(res, 'Course retrieved', data);
    } catch (err) { next(err); }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await courseService.create(req.user!.userId, req.body);
      sendCreated(res, 'Course created', data);
    } catch (err) { next(err); }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await courseService.update(req.params.id, req.user!.userId, req.body);
      sendSuccess(res, 'Course updated', data);
    } catch (err) { next(err); }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await courseService.delete(req.params.id, req.user!.userId);
      sendNoContent(res);
    } catch (err) { next(err); }
  }
}

export const mentorController = new MentorController();
export const sessionController = new SessionController();
export const courseController = new CourseController();
