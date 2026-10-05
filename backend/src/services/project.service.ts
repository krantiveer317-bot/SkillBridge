import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { CreateProjectInput, UpdateProjectInput } from '../validators/project.validator';
import { getPaginationParams, buildPaginationMeta } from '../types';
import { ProjectStatus } from '@prisma/client';

export class ProjectService {
  private projectSelect = {
    id: true,
    title: true,
    description: true,
    longDescription: true,
    githubUrl: true,
    liveUrl: true,
    bannerImage: true,
    status: true,
    verificationTier: true,
    starsCount: true,
    viewsCount: true,
    teamSize: true,
    createdAt: true,
    updatedAt: true,
    author: {
      select: {
        id: true,
        role: true,
        profile: { select: { avatar: true, title: true } },
      },
    },
    skills: { include: { skill: { select: { id: true, name: true, category: true } } } },
  };

  async create(authorId: string, input: CreateProjectInput) {
    const { skillIds, ...rest } = input;
    return prisma.project.create({
      data: {
        ...rest,
        authorId,
        skills: { create: skillIds.map((skillId) => ({ skillId })) },
      },
      select: this.projectSelect,
    });
  }

  async findAll(query: { page?: string; limit?: string; q?: string; status?: string }) {
    const { skip, take, page, limit } = getPaginationParams(query);
    const where = {
      status: (query.status as ProjectStatus) ?? 'PUBLISHED',
      ...(query.q
        ? {
            OR: [
              { title: { contains: query.q, mode: 'insensitive' as const } },
              { description: { contains: query.q, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({ where, skip, take, select: this.projectSelect, orderBy: { createdAt: 'desc' } }),
      prisma.project.count({ where }),
    ]);

    return { projects, meta: buildPaginationMeta(total, page, limit) };
  }

  async findMine(authorId: string, query: { page?: string; limit?: string }) {
    const { skip, take, page, limit } = getPaginationParams(query);
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: { authorId },
        skip,
        take,
        select: this.projectSelect,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.project.count({ where: { authorId } }),
    ]);
    return { projects, meta: buildPaginationMeta(total, page, limit) };
  }

  async findById(id: string) {
    const project = await prisma.project.findUnique({ where: { id }, select: this.projectSelect });
    if (!project) throw new AppError('Project not found', 404);
    await prisma.project.update({ where: { id }, data: { viewsCount: { increment: 1 } } });
    return project;
  }

  async update(id: string, authorId: string, input: UpdateProjectInput) {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) throw new AppError('Project not found', 404);
    if (project.authorId !== authorId) throw new AppError('Not authorized', 403);

    const { skillIds, ...rest } = input;
    return prisma.project.update({
      where: { id },
      data: {
        ...rest,
        ...(skillIds
          ? {
              skills: {
                deleteMany: {},
                create: skillIds.map((skillId) => ({ skillId })),
              },
            }
          : {}),
      },
      select: this.projectSelect,
    });
  }

  async delete(id: string, authorId: string) {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) throw new AppError('Project not found', 404);
    if (project.authorId !== authorId) throw new AppError('Not authorized', 403);
    await prisma.project.delete({ where: { id } });
  }

  async star(id: string) {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) throw new AppError('Project not found', 404);
    return prisma.project.update({ where: { id }, data: { starsCount: { increment: 1 } } });
  }

  async publish(id: string, authorId: string) {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) throw new AppError('Project not found', 404);
    if (project.authorId !== authorId) throw new AppError('Not authorized', 403);
    return prisma.project.update({ where: { id }, data: { status: 'PUBLISHED' } });
  }
}

export const projectService = new ProjectService();
