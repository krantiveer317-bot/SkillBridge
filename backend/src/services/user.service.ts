import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { UpdateProfileInput } from '../validators/user.validator';
import {
  getPaginationParams,
  buildPaginationMeta,
} from '../types';

export class UserService {
  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,

        profile: true,

        skills: {
          include: {
            skill: true,
          },
        },

        _count: {
          select: {
            projects: true,
            applications: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async getPublicProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        isActive: true,
      },

      select: {
        id: true,
        role: true,
        createdAt: true,

        profile: true,

        skills: {
          where: {
            isVerified: true,
          },

          include: {
            skill: true,
          },
        },

        projects: {
          where: {
            status: 'PUBLISHED',
          },

          select: {
            id: true,
            title: true,
            description: true,
            verificationTier: true,
            starsCount: true,

            skills: {
              include: {
                skill: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },

          take: 6,
        },

        _count: {
          select: {
            projects: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async updateMe(
    userId: string,
    input: UpdateProfileInput
  ) {
    const { name, ...profileData } = input;

    await prisma.profile.upsert({
      where: {
        userId,
      },

      update: {
        ...(name !== undefined
          ? {
              name,
            }
          : {}),

        ...profileData,
      },

      create: {
        userId,

        ...(name !== undefined
          ? {
              name,
            }
          : {}),

        ...profileData,
      },
    });

    return this.getMe(userId);
  }

  async deleteMe(userId: string) {
    await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        isActive: false,
      },
    });
  }

  async listUsers(query: {
    page?: string;
    limit?: string;
    role?: string;
    q?: string;
  }) {
    const {
      skip,
      take,
      page,
      limit,
    } = getPaginationParams(query);

    const where = {
      isActive: true,

      ...(query.role
        ? {
            role: query.role as
              | 'STUDENT'
              | 'MENTOR'
              | 'COMPANY'
              | 'ADMIN',
          }
        : {}),

      ...(query.q
        ? {
            profile: {
              OR: [
                {
                  name: {
                    contains: query.q,
                    mode: 'insensitive' as const,
                  },
                },
                {
                  title: {
                    contains: query.q,
                    mode: 'insensitive' as const,
                  },
                },
              ],
            },
          }
        : {}),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,

        select: {
          id: true,
          email: true,
          role: true,
          isVerified: true,
          createdAt: true,

          profile: {
            select: {
              name: true,
              avatar: true,
              title: true,
              location: true,
            },
          },
        },

        orderBy: {
          createdAt: 'desc',
        },
      }),

      prisma.user.count({
        where,
      }),
    ]);

    return {
      users,
      meta: buildPaginationMeta(
        total,
        page,
        limit
      ),
    };
  }
}

export const userService = new UserService();