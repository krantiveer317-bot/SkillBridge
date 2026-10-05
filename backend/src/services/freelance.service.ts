import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { getPaginationParams, buildPaginationMeta } from '../types';
import { FreelanceContractInput, UpdateContractStatusInput } from '../validators/common.validator';

export class FreelanceService {
  async findAll(query: { page?: string; limit?: string; status?: string }) {
    const { skip, take, page, limit } = getPaginationParams(query);
    const where = {
      status: (query.status as 'OPEN' | 'ACTIVE' | 'COMPLETED' | 'DISPUTED' | 'CANCELLED') ?? 'OPEN',
    };
    const [contracts, total] = await Promise.all([
      prisma.freelanceContract.findMany({
        where, skip, take,
        include: {
          client: { select: { profile: { select: { avatar: true, title: true } } } },
          freelancer: { select: { profile: { select: { avatar: true, title: true } } } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.freelanceContract.count({ where }),
    ]);
    return { contracts, meta: buildPaginationMeta(total, page, limit) };
  }

  async findMine(userId: string, query: { page?: string; limit?: string }) {
    const { skip, take, page, limit } = getPaginationParams(query);
    const where = { OR: [{ clientId: userId }, { freelancerId: userId }] };
    const [contracts, total] = await Promise.all([
      prisma.freelanceContract.findMany({
        where, skip, take,
        include: {
          client: { select: { profile: { select: { avatar: true, title: true } } } },
          freelancer: { select: { profile: { select: { avatar: true, title: true } } } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.freelanceContract.count({ where }),
    ]);
    return { contracts, meta: buildPaginationMeta(total, page, limit) };
  }

  async create(clientId: string, input: FreelanceContractInput) {
    return prisma.freelanceContract.create({
      data: { clientId, ...input },
      include: { client: { select: { profile: { select: { avatar: true, title: true } } } } },
    });
  }

  async accept(id: string, freelancerId: string) {
    const contract = await prisma.freelanceContract.findUnique({ where: { id } });
    if (!contract) throw new AppError('Contract not found', 404);
    if (contract.status !== 'OPEN') throw new AppError('Contract is no longer open', 409);
    if (contract.clientId === freelancerId) throw new AppError('Cannot accept your own contract', 400);
    return prisma.freelanceContract.update({
      where: { id },
      data: { freelancerId, status: 'ACTIVE', startedAt: new Date() },
    });
  }

  async updateStatus(id: string, userId: string, input: UpdateContractStatusInput) {
    const contract = await prisma.freelanceContract.findUnique({ where: { id } });
    if (!contract) throw new AppError('Contract not found', 404);
    if (contract.clientId !== userId && contract.freelancerId !== userId) throw new AppError('Not authorized', 403);
    return prisma.freelanceContract.update({
      where: { id },
      data: {
        status: input.status,
        ...(input.status === 'COMPLETED' ? { completedAt: new Date() } : {}),
      },
    });
  }
}

export const freelanceService = new FreelanceService();
