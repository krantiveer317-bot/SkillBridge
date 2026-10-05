import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { getPaginationParams, buildPaginationMeta } from '../types';
import { UpdateCompanyInput } from '../validators/common.validator';

export class CompanyService {
  async findAll(query: { page?: string; limit?: string; q?: string }) {
    const { skip, take, page, limit } = getPaginationParams(query);
    const where = {
      ...(query.q ? { name: { contains: query.q, mode: 'insensitive' as const } } : {}),
    };
    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where, skip, take,
        include: { _count: { select: { opportunities: true } } },
        orderBy: { isVerified: 'desc' },
      }),
      prisma.company.count({ where }),
    ]);
    return { companies, meta: buildPaginationMeta(total, page, limit) };
  }

  async findById(id: string) {
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        opportunities: { where: { isActive: true }, take: 10, orderBy: { createdAt: 'desc' } },
        _count: { select: { opportunities: true } },
      },
    });
    if (!company) throw new AppError('Company not found', 404);
    return company;
  }

  async getMyProfile(userId: string) {
    const company = await prisma.company.findUnique({
      where: { userId },
      include: { opportunities: { orderBy: { createdAt: 'desc' } } },
    });
    if (!company) throw new AppError('Company profile not found', 404);
    return company;
  }

  async createProfile(userId: string, input: { name: string }) {
    const existing = await prisma.company.findUnique({ where: { userId } });
    if (existing) throw new AppError('Company profile already exists', 409);
    return prisma.company.create({ data: { userId, name: input.name } });
  }

  async update(userId: string, input: UpdateCompanyInput) {
    const company = await prisma.company.findUnique({ where: { userId } });
    if (!company) throw new AppError('Company profile not found', 404);
    return prisma.company.update({ where: { userId }, data: input });
  }
}

export const companyService = new CompanyService();
