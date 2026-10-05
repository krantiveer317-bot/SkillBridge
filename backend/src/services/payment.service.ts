import { prisma } from '../config/database';
import { getPaginationParams, buildPaginationMeta } from '../types';

export class PaymentService {
  async findMine(userId: string, query: { page?: string; limit?: string }) {
    const { skip, take, page, limit } = getPaginationParams(query);
    const [transactions, total] = await Promise.all([
      prisma.earningTransaction.findMany({
        where: { userId },
        skip, take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.earningTransaction.count({ where: { userId } }),
    ]);
    const totalEarnings = await prisma.earningTransaction.aggregate({
      where: { userId, status: 'COMPLETED' },
      _sum: { netAmount: true },
    });
    return {
      transactions,
      totalEarnings: totalEarnings._sum.netAmount ?? 0,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async initiate(_userId: string, _data: { amount: number; type: string }) {
    // Stub â€” Razorpay not implemented yet
    return {
      message: 'Payment initiation is not yet implemented. Razorpay integration coming soon.',
      stub: true,
    };
  }

  async handleWebhook(_payload: unknown) {
    // Stub â€” Razorpay webhook handler not implemented yet
    return { received: true };
  }
}

export const paymentService = new PaymentService();
