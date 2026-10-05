import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { getPaginationParams, buildPaginationMeta } from '../types';
import { CreateSkillInput } from '../validators/common.validator';

export class SkillService {
  async findAll(query: { page?: string; limit?: string; category?: string; q?: string }) {
    const { skip, take, page, limit } = getPaginationParams(query);
    const where = {
      isActive: true,
      ...(query.category ? { category: query.category as 'FRONTEND' | 'BACKEND' } : {}),
      ...(query.q ? { name: { contains: query.q, mode: 'insensitive' as const } } : {}),
    };
    const [skills, total] = await Promise.all([
      prisma.skill.findMany({ where, skip, take, orderBy: { name: 'asc' } }),
      prisma.skill.count({ where }),
    ]);
    return { skills, meta: buildPaginationMeta(total, page, limit) };
  }

  async findById(id: string) {
    const skill = await prisma.skill.findUnique({ where: { id } });
    if (!skill) throw new AppError('Skill not found', 404);
    return skill;
  }

  async create(input: CreateSkillInput) {
    return prisma.skill.create({ data: input });
  }

  async update(id: string, input: Partial<CreateSkillInput>) {
    const skill = await prisma.skill.findUnique({ where: { id } });
    if (!skill) throw new AppError('Skill not found', 404);
    return prisma.skill.update({ where: { id }, data: input });
  }

  async deactivate(id: string) {
    const skill = await prisma.skill.findUnique({ where: { id } });
    if (!skill) throw new AppError('Skill not found', 404);
    return prisma.skill.update({ where: { id }, data: { isActive: false } });
  }

  async addToUser(userId: string, skillId: string, level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT') {
    const skill = await prisma.skill.findUnique({ where: { id: skillId } });
    if (!skill) throw new AppError('Skill not found', 404);
    return prisma.userSkill.upsert({
      where: { userId_skillId: { userId, skillId } },
      update: { level },
      create: { userId, skillId, level },
      include: { skill: true },
    });
  }

  async removeFromUser(userId: string, skillId: string) {
    const us = await prisma.userSkill.findUnique({ where: { userId_skillId: { userId, skillId } } });
    if (!us) throw new AppError('Skill not in your profile', 404);
    await prisma.userSkill.delete({ where: { userId_skillId: { userId, skillId } } });
  }
}

export const skillService = new SkillService();
