import { prisma } from '../config/database';
import { getPaginationParams, buildPaginationMeta } from '../types';

export class NotificationService {
  async findMine(userId: string, query: { page?: string; limit?: string }) {
    const { skip, take, page, limit } = getPaginationParams(query);
    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        skip, take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where: { userId } }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ]);
    return { notifications, unreadCount, meta: buildPaginationMeta(total, page, limit) };
  }

  async markRead(id: string, userId: string) {
    return prisma.notification.updateMany({ where: { id, userId }, data: { isRead: true } });
  }

  async markAllRead(userId: string) {
    return prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
  }

  async create(data: { userId: string; type: 'APPLICATION_UPDATE' | 'VERIFICATION_UPDATE' | 'SESSION_REMINDER' | 'NEW_MESSAGE' | 'SKILL_EXCHANGE' | 'PAYMENT' | 'SYSTEM'; title: string; body: string; link?: string }) {
    return prisma.notification.create({ data });
  }
}

export const notificationService = new NotificationService();
