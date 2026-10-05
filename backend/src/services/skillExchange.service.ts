import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { getPaginationParams, buildPaginationMeta } from '../types';
import { SkillExchangeInput } from '../validators/common.validator';

export class SkillExchangeService {
  async create(requesterId: string, input: SkillExchangeInput) {
    return prisma.skillExchangeRequest.create({
      data: { requesterId, ...input },
      include: {
        offeringSkill: { select: { name: true } },
        seekingSkill: { select: { name: true } },
        requester: { select: { profile: { select: { avatar: true, title: true } } } },
      },
    });
  }

  async findAll(query: { page?: string; limit?: string; status?: string }) {
    const { skip, take, page, limit } = getPaginationParams(query);
    const where = query.status ? { status: query.status as 'OPEN' | 'MATCHED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' } : { status: 'OPEN' as const };
    const [requests, total] = await Promise.all([
      prisma.skillExchangeRequest.findMany({
        where, skip, take,
        include: {
          offeringSkill: { select: { name: true, category: true } },
          seekingSkill: { select: { name: true, category: true } },
          requester: { select: { profile: { select: { avatar: true, title: true } } } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.skillExchangeRequest.count({ where }),
    ]);
    return { requests, meta: buildPaginationMeta(total, page, limit) };
  }

  async findMine(requesterId: string, query: { page?: string; limit?: string }) {
    const { skip, take, page, limit } = getPaginationParams(query);
    const [requests, total] = await Promise.all([
      prisma.skillExchangeRequest.findMany({
        where: { OR: [{ requesterId }, { receiverId: requesterId }] },
        skip, take,
        include: {
          offeringSkill: { select: { name: true } },
          seekingSkill: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.skillExchangeRequest.count({ where: { OR: [{ requesterId }, { receiverId: requesterId }] } }),
    ]);
    return { requests, meta: buildPaginationMeta(total, page, limit) };
  }

  async accept(id: string, receiverId: string) {
    const req = await prisma.skillExchangeRequest.findUnique({ where: { id } });
    if (!req) throw new AppError('Request not found', 404);
    if (req.status !== 'OPEN') throw new AppError('Request is no longer open', 409);
    if (req.requesterId === receiverId) throw new AppError('Cannot accept your own request', 400);
    return prisma.skillExchangeRequest.update({
      where: { id },
      data: { receiverId, status: 'MATCHED' },
    });
  }

  async complete(id: string, userId: string) {
    const req = await prisma.skillExchangeRequest.findUnique({ where: { id } });
    if (!req) throw new AppError('Request not found', 404);
    if (req.requesterId !== userId && req.receiverId !== userId) throw new AppError('Not authorized', 403);
    if (req.status !== 'MATCHED' && req.status !== 'IN_PROGRESS') throw new AppError('Cannot complete this request', 409);
    return prisma.skillExchangeRequest.update({
      where: { id },
      data: { status: 'COMPLETED', completedAt: new Date() },
    });
  }

  async cancel(id: string, userId: string) {
    const req = await prisma.skillExchangeRequest.findUnique({ where: { id } });
    if (!req) throw new AppError('Request not found', 404);
    if (req.requesterId !== userId) throw new AppError('Not authorized', 403);
    return prisma.skillExchangeRequest.update({ where: { id }, data: { status: 'CANCELLED' } });
  }
}

export const skillExchangeService = new SkillExchangeService();
