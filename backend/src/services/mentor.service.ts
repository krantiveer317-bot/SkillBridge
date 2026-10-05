import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { getPaginationParams, buildPaginationMeta } from '../types';
import { UpdateMentorInput, BookSessionInput, UpdateSessionInput, CreateCourseInput, UpdateCourseInput } from '../validators/common.validator';

export class MentorService {
  async findAll(query: { page?: string; limit?: string; q?: string }) {
    const { skip, take, page, limit } = getPaginationParams(query);
    const where = {
      isAvailable: true,
      ...(query.q
        ? {
            OR: [
              { user: { profile: { title: { contains: query.q, mode: 'insensitive' as const } } } },
              { bio: { contains: query.q, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };
    const [mentors, total] = await Promise.all([
      prisma.mentor.findMany({
        where, skip, take,
        include: { user: { select: { profile: true } }, _count: { select: { sessions: true } } },
        orderBy: { rating: 'desc' },
      }),
      prisma.mentor.count({ where }),
    ]);
    return { mentors, meta: buildPaginationMeta(total, page, limit) };
  }

  async findById(id: string) {
    const mentor = await prisma.mentor.findUnique({
      where: { id },
      include: { user: { select: { profile: true } }, courses: { where: { isPublished: true } }, reviews: { take: 10, orderBy: { createdAt: 'desc' } } },
    });
    if (!mentor) throw new AppError('Mentor not found', 404);
    return mentor;
  }

  async register(userId: string) {
    const existing = await prisma.mentor.findUnique({ where: { userId } });
    if (existing) throw new AppError('Mentor profile already exists', 409);
    return prisma.mentor.create({ data: { userId }, include: { user: { select: { profile: true } } } });
  }

  async update(userId: string, input: UpdateMentorInput) {
    const mentor = await prisma.mentor.findUnique({ where: { userId } });
    if (!mentor) throw new AppError('Mentor profile not found', 404);
    return prisma.mentor.update({ where: { userId }, data: input });
  }

  async getMyProfile(userId: string) {
    const mentor = await prisma.mentor.findUnique({
      where: { userId },
      include: { user: { select: { profile: true } }, courses: true, _count: { select: { sessions: true, reviews: true } } },
    });
    if (!mentor) throw new AppError('Mentor profile not found', 404);
    return mentor;
  }
}

export class SessionService {
  async book(studentId: string, input: BookSessionInput) {
    const mentor = await prisma.mentor.findUnique({ where: { id: input.mentorId } });
    if (!mentor || !mentor.isAvailable) throw new AppError('Mentor not found or unavailable', 404);

    const scheduledAt = new Date(input.scheduledAt);
    if (scheduledAt < new Date()) throw new AppError('Session must be scheduled in the future', 400);

    return prisma.session.create({
      data: {
        mentorId: input.mentorId,
        mentorUserId: mentor.userId,
        studentId,
        scheduledAt,
        durationMins: input.durationMins,
        topic: input.topic,
        price: mentor.hourlyRate * (input.durationMins / 60),
      },
      include: {
        mentor: { include: { user: { select: { profile: true } } } },
      },
    });
  }

  async findMine(userId: string, query: { page?: string; limit?: string; role?: string }) {
    const { skip, take, page, limit } = getPaginationParams(query);
    const ismentor = query.role === 'mentor';
    const where = ismentor ? { mentorId: userId } : { studentId: userId };
    const [sessions, total] = await Promise.all([
      prisma.session.findMany({
        where, skip, take,
        include: { mentor: { include: { user: { select: { profile: true } } } } },
        orderBy: { scheduledAt: 'desc' },
      }),
      prisma.session.count({ where }),
    ]);
    return { sessions, meta: buildPaginationMeta(total, page, limit) };
  }

  async update(id: string, userId: string, input: UpdateSessionInput) {
    const session = await prisma.session.findUnique({ where: { id } });
    if (!session) throw new AppError('Session not found', 404);
    const mentor = await prisma.mentor.findUnique({ where: { id: session.mentorId } });
    if (session.studentId !== userId && mentor?.userId !== userId) throw new AppError('Not authorized', 403);

    const updated = await prisma.session.update({
      where: { id },
      data: {
        status: input.status,
        notes: input.notes,
        ...(input.status === 'COMPLETED' ? { completedAt: new Date() } : {}),
        ...(input.status === 'CANCELLED' ? { cancelledAt: new Date() } : {}),
      },
    });

    if (input.status === 'COMPLETED') {
      await prisma.mentor.update({ where: { id: session.mentorId }, data: { sessionsCompleted: { increment: 1 } } });
    }

    return updated;
  }
}

export class CourseService {
  async findAll(query: { page?: string; limit?: string; q?: string }) {
    const { skip, take, page, limit } = getPaginationParams(query);
    const where = {
      isPublished: true,
      ...(query.q ? { title: { contains: query.q, mode: 'insensitive' as const } } : {}),
    };
    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where, skip, take,
        include: { mentor: { include: { user: { select: { profile: true } } } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.course.count({ where }),
    ]);
    return { courses, meta: buildPaginationMeta(total, page, limit) };
  }

  async findById(id: string) {
    const course = await prisma.course.findUnique({
      where: { id },
      include: { mentor: { include: { user: { select: { profile: true } } } } },
    });
    if (!course) throw new AppError('Course not found', 404);
    return course;
  }

  async create(userId: string, input: CreateCourseInput) {
    const mentor = await prisma.mentor.findUnique({ where: { userId } });
    if (!mentor) throw new AppError('Mentor profile not found', 404);
    return prisma.course.create({ data: { mentorId: mentor.id, ...input } });
  }

  async update(id: string, userId: string, input: UpdateCourseInput) {
    const mentor = await prisma.mentor.findUnique({ where: { userId } });
    if (!mentor) throw new AppError('Mentor profile not found', 404);
    const course = await prisma.course.findUnique({ where: { id } });
    if (!course || course.mentorId !== mentor.id) throw new AppError('Not authorized', 403);
    return prisma.course.update({ where: { id }, data: input });
  }

  async delete(id: string, userId: string) {
    const mentor = await prisma.mentor.findUnique({ where: { userId } });
    if (!mentor) throw new AppError('Mentor profile not found', 404);
    const course = await prisma.course.findUnique({ where: { id } });
    if (!course || course.mentorId !== mentor.id) throw new AppError('Not authorized', 403);
    await prisma.course.delete({ where: { id } });
  }
}

export const mentorService = new MentorService();
export const sessionService = new SessionService();
export const courseService = new CourseService();
