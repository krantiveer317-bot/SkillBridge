import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { getPaginationParams, buildPaginationMeta } from '../types';
import { OpportunityType, LocationType, VerificationTier } from '@prisma/client';
import {
  CreateOpportunityInput,
  UpdateOpportunityInput,
  CreateApplicationInput,
  UpdateApplicationStatusInput,
} from '../validators/opportunity.validator';

export class OpportunityService {
  private oppSelect = {
    id: true, type: true, title: true, category: true, description: true,
    compensation: true, locationType: true, minimumVerificationTier: true,
    deadline: true, isActive: true, isFeatured: true, applicantCount: true,
    createdAt: true, updatedAt: true,
    company: { select: { id: true, name: true, logoUrl: true, isVerified: true, location: true } },
    skills: { include: { skill: { select: { id: true, name: true } } } },
  };

  async findAll(query: {
    page?: string; limit?: string; type?: string;
    locationType?: string; q?: string; tier?: string;
  }) {
    const { skip, take, page, limit } = getPaginationParams(query);
    const where = {
      isActive: true,
      ...(query.type ? { type: query.type as OpportunityType } : {}),
      ...(query.locationType ? { locationType: query.locationType as LocationType } : {}),
      ...(query.tier ? { minimumVerificationTier: query.tier as VerificationTier } : {}),
      ...(query.q ? { title: { contains: query.q, mode: 'insensitive' as const } } : {}),
    };
    const [opportunities, total] = await Promise.all([
      prisma.opportunity.findMany({ where, skip, take, select: this.oppSelect, orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }] }),
      prisma.opportunity.count({ where }),
    ]);
    return { opportunities, meta: buildPaginationMeta(total, page, limit) };
  }

  async findById(id: string) {
    const opp = await prisma.opportunity.findUnique({ where: { id }, select: this.oppSelect });
    if (!opp) throw new AppError('Opportunity not found', 404);
    return opp;
  }

  async create(companyUserId: string, input: CreateOpportunityInput) {
    const company = await prisma.company.findUnique({ where: { userId: companyUserId } });
    if (!company) throw new AppError('Company profile not found', 404);
    const { skillIds, deadline, ...rest } = input;
    return prisma.opportunity.create({
      data: {
        ...rest,
        companyId: company.id,
        deadline: deadline ? new Date(deadline) : null,
        skills: { create: skillIds.map((skillId) => ({ skillId })) },
      },
      select: this.oppSelect,
    });
  }

  async update(id: string, companyUserId: string, input: UpdateOpportunityInput) {
    const company = await prisma.company.findUnique({ where: { userId: companyUserId } });
    if (!company) throw new AppError('Company profile not found', 404);
    const opp = await prisma.opportunity.findUnique({ where: { id } });
    if (!opp || opp.companyId !== company.id) throw new AppError('Not authorized', 403);
    const { skillIds, deadline, ...rest } = input;
    return prisma.opportunity.update({
      where: { id },
      data: {
        ...rest,
        ...(deadline ? { deadline: new Date(deadline) } : {}),
        ...(skillIds ? { skills: { deleteMany: {}, create: skillIds.map((skillId) => ({ skillId })) } } : {}),
      },
      select: this.oppSelect,
    });
  }

  async deactivate(id: string, companyUserId: string) {
    const company = await prisma.company.findUnique({ where: { userId: companyUserId } });
    if (!company) throw new AppError('Company profile not found', 404);
    const opp = await prisma.opportunity.findUnique({ where: { id } });
    if (!opp || opp.companyId !== company.id) throw new AppError('Not authorized', 403);
    await prisma.opportunity.update({ where: { id }, data: { isActive: false } });
  }
}

export class ApplicationService {
  async apply(applicantId: string, input: CreateApplicationInput) {
    const opp = await prisma.opportunity.findUnique({ where: { id: input.opportunityId, isActive: true } });
    if (!opp) throw new AppError('Opportunity not found or is no longer active', 404);

    const existing = await prisma.application.findUnique({
      where: { applicantId_opportunityId: { applicantId, opportunityId: input.opportunityId } },
    });
    if (existing) throw new AppError('You have already applied to this opportunity', 409);

    const [application] = await prisma.$transaction([
      prisma.application.create({
        data: { applicantId, opportunityId: input.opportunityId, coverLetter: input.coverLetter },
        include: { opportunity: { select: { title: true, company: { select: { name: true, logoUrl: true } } } } },
      }),
      prisma.opportunity.update({ where: { id: input.opportunityId }, data: { applicantCount: { increment: 1 } } }),
    ]);

    return application;
  }

  async findMine(applicantId: string, query: { page?: string; limit?: string }) {
    const { skip, take, page, limit } = getPaginationParams(query);
    const [apps, total] = await Promise.all([
      prisma.application.findMany({
        where: { applicantId },
        skip, take,
        include: {
          opportunity: {
            select: { title: true, type: true, compensation: true, company: { select: { name: true, logoUrl: true } } },
          },
        },
        orderBy: { appliedAt: 'desc' },
      }),
      prisma.application.count({ where: { applicantId } }),
    ]);
    return { applications: apps, meta: buildPaginationMeta(total, page, limit) };
  }

  async findForOpportunity(opportunityId: string, companyUserId: string, query: { page?: string; limit?: string }) {
    const company = await prisma.company.findUnique({ where: { userId: companyUserId } });
    if (!company) throw new AppError('Company profile not found', 404);
    const opp = await prisma.opportunity.findUnique({ where: { id: opportunityId } });
    if (!opp || opp.companyId !== company.id) throw new AppError('Not authorized', 403);
    const { skip, take, page, limit } = getPaginationParams(query);
    const [apps, total] = await Promise.all([
      prisma.application.findMany({
        where: { opportunityId },
        skip, take,
        include: { applicant: { select: { profile: true, skills: { include: { skill: true } } } } },
        orderBy: { appliedAt: 'desc' },
      }),
      prisma.application.count({ where: { opportunityId } }),
    ]);
    return { applications: apps, meta: buildPaginationMeta(total, page, limit) };
  }

  async updateStatus(id: string, companyUserId: string, input: UpdateApplicationStatusInput) {
    const app = await prisma.application.findUnique({
      where: { id },
      include: { opportunity: { select: { companyId: true } } },
    });
    if (!app) throw new AppError('Application not found', 404);
    const company = await prisma.company.findUnique({ where: { userId: companyUserId } });
    if (!company || app.opportunity.companyId !== company.id) throw new AppError('Not authorized', 403);
    return prisma.application.update({ where: { id }, data: { status: input.status, feedback: input.feedback } });
  }

  async withdraw(id: string, applicantId: string) {
    const app = await prisma.application.findUnique({ where: { id } });
    if (!app) throw new AppError('Application not found', 404);
    if (app.applicantId !== applicantId) throw new AppError('Not authorized', 403);
    return prisma.application.update({ where: { id }, data: { status: 'WITHDRAWN' } });
  }
}

export const opportunityService = new OpportunityService();
export const applicationService = new ApplicationService();
