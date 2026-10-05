import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.string().cuid('Invalid ID format'),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const searchSchema = paginationSchema.extend({
  q: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export const skillExchangeSchema = z.object({
  offeringSkillId: z.string().cuid('Invalid skill ID'),
  seekingSkillId: z.string().cuid('Invalid skill ID'),
  offeringLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
  seekingLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
});

export const bookSessionSchema = z.object({
  mentorId: z.string().cuid('Invalid mentor ID'),
  scheduledAt: z.string().datetime('Must be a valid ISO datetime'),
  durationMins: z.number().int().min(30).max(180).default(60),
  topic: z.string().max(300).optional(),
});

export const updateSessionSchema = z.object({
  status: z.enum(['COMPLETED', 'CANCELLED', 'NO_SHOW']),
  notes: z.string().max(2000).optional(),
});

export const createCourseSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(3000).optional(),
  price: z.number().min(0).default(0),
  tags: z.array(z.string()).max(10).default([]),
  isPublished: z.boolean().default(false),
});

export const updateCourseSchema = createCourseSchema.partial();

export const createSkillSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.enum([
    'FRONTEND',
    'BACKEND',
    'DEVOPS_CLOUD',
    'AI_ML',
    'MOBILE',
    'DESIGN_UX',
    'BLOCKCHAIN',
    'DATA_SCIENCE',
    'OTHER',
  ]),
  description: z.string().max(500).optional(),
  iconUrl: z.string().url().optional(),
});

export const freelanceContractSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(3000),
  budget: z.number().positive('Budget must be positive'),
});

export const updateContractStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'COMPLETED', 'DISPUTED', 'CANCELLED']),
});

export const updateMentorSchema = z.object({
  bio: z.string().max(1000).optional(),
  hourlyRate: z.number().min(0).optional(),
  expertise: z.array(z.string()).max(20).optional(),
  isAvailable: z.boolean().optional(),
});

export const updateCompanySchema = z.object({
  name: z.string().min(2).max(200).optional(),
  description: z.string().max(3000).optional(),
  industry: z.string().max(100).optional(),
  size: z.string().max(50).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal('')),
  logoUrl: z.string().url().optional().or(z.literal('')),
});

export type IdParam = z.infer<typeof idParamSchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
export type SearchQuery = z.infer<typeof searchSchema>;
export type SkillExchangeInput = z.infer<typeof skillExchangeSchema>;
export type BookSessionInput = z.infer<typeof bookSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type CreateSkillInput = z.infer<typeof createSkillSchema>;
export type FreelanceContractInput = z.infer<typeof freelanceContractSchema>;
export type UpdateContractStatusInput = z.infer<typeof updateContractStatusSchema>;
export type UpdateMentorInput = z.infer<typeof updateMentorSchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
