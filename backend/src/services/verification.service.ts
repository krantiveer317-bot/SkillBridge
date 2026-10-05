import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { VerificationRequestInput, ReviewVerificationInput } from '../validators/project.validator';
import { getPaginationParams, buildPaginationMeta } from '../types';
import { VerificationStatus } from '@prisma/client';

export class VerificationService {
  async request(applicantId: string, input: VerificationRequestInput) {
    const project = await prisma.project.findUnique({ where: { id: input.projectId } });
    if (!project) throw new AppError('Project not found', 404);
    if (project.authorId !== applicantId) throw new AppError('Not authorized', 403);

    const existing = await prisma.verificationRequest.findFirst({
      where: { projectId: input.projectId, applicantId, status: { in: ['PENDING', 'IN_PROGRESS'] } },
    });
    if (existing) throw new AppError('A pending verification request already exists for this project', 409);

    return prisma.verificationRequest.create({
      data: {
        projectId: input.projectId,
        applicantId,
        requestedTier: input.requestedTier,
        proofArtifacts: input.proofArtifacts,
      },
      include: { project: { select: { title: true } }, applicant: { select: { profile: true } } },
    });
  }

  async findMine(applicantId: string, query: { page?: string; limit?: string }) {
    const { skip, take, page, limit } = getPaginationParams(query);
    const [requests, total] = await Promise.all([
      prisma.verificationRequest.findMany({
        where: { applicantId },
        skip, take,
        include: { project: { select: { title: true, skills: { include: { skill: { select: { name: true } } } } } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.verificationRequest.count({ where: { applicantId } }),
    ]);
    return { requests, meta: buildPaginationMeta(total, page, limit) };
  }

  async findAll(query: { page?: string; limit?: string; status?: string }) {
    const { skip, take, page, limit } = getPaginationParams(query);
    const where = query.status ? { status: query.status as VerificationStatus } : {};
    const [requests, total] = await Promise.all([
      prisma.verificationRequest.findMany({
        where, skip, take,
        include: {
          project: { select: { title: true } },
          applicant: { select: { profile: { select: { avatar: true, title: true } } } },
          reviewer: { select: { profile: { select: { title: true } } } },
        },
        orderBy: { submittedAt: 'desc' },
      }),
      prisma.verificationRequest.count({ where }),
    ]);
    return { requests, meta: buildPaginationMeta(total, page, limit) };
  }

  async review(id: string, reviewerId: string, input: ReviewVerificationInput) {
    const request = await prisma.verificationRequest.findUnique({ where: { id } });
    if (!request) throw new AppError('Verification request not found', 404);
    if (!['PENDING', 'IN_PROGRESS'].includes(request.status)) {
      throw new AppError('This request has already been reviewed', 409);
    }

    const updated = await prisma.verificationRequest.update({
      where: { id },
      data: {
        status: input.status as VerificationStatus,
        reviewerId,
        reviewerNotes: input.reviewerNotes,
        reviewedAt: new Date(),
      },
    });

    if (input.status === 'APPROVED') {
      await prisma.project.update({
        where: { id: request.projectId },
        data: { verificationTier: request.requestedTier },
      });
    }

    return updated;
  }
}

export const verificationService = new VerificationService();
