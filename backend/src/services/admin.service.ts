import { prisma } from '../config/database';
import { getPaginationParams, buildPaginationMeta } from '../types';

export class AdminService {
  async getStats() {
    const [users, projects, verifications, applications, opportunities, companies, mentors] = await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.verificationRequest.count({ where: { status: 'PENDING' } }),
      prisma.application.count(),
      prisma.opportunity.count({ where: { isActive: true } }),
      prisma.company.count(),
      prisma.mentor.count(),
    ]);
    return { users, projects, pendingVerifications: verifications, applications, opportunities, companies, mentors };
  }

  async listUsers(query: { page?: string; limit?: string; role?: string; q?: string }) {
    const { skip, take, page, limit } = getPaginationParams(query);
    const where = {
      ...(query.role ? { role: query.role as 'STUDENT' | 'MENTOR' | 'COMPANY' | 'ADMIN' } : {}),
      ...(query.q ? { email: { contains: query.q, mode: 'insensitive' as const } } : {}),
    };
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where, skip, take,
        select: { id: true, email: true, role: true, isActive: true, isVerified: true, createdAt: true, profile: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);
    return { users, meta: buildPaginationMeta(total, page, limit) };
  }

  async setUserStatus(userId: string, isActive: boolean) {
    return prisma.user.update({ where: { id: userId }, data: { isActive } });
  }

  async setUserRole(userId: string, role: 'STUDENT' | 'MENTOR' | 'COMPANY' | 'ADMIN') {
    return prisma.user.update({ where: { id: userId }, data: { role } });
  }

  async listVerifications(query: { page?: string; limit?: string; status?: string }) {
    const { skip, take, page, limit } = getPaginationParams(query);
    const where = query.status ? { status: query.status as 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'CHANGES_REQUESTED' | 'REJECTED' } : {};
    const [requests, total] = await Promise.all([
      prisma.verificationRequest.findMany({
        where, skip, take,
        include: {
          project: { select: { title: true } },
          applicant: { select: { email: true, profile: true } },
        },
        orderBy: { submittedAt: 'desc' },
      }),
      prisma.verificationRequest.count({ where }),
    ]);
    return { requests, meta: buildPaginationMeta(total, page, limit) };
  }

  async verifyCompany(companyId: string) {
    return prisma.company.update({ where: { id: companyId }, data: { isVerified: true } });
  }
}

export const adminService = new AdminService();
