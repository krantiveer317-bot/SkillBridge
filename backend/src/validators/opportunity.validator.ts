import { z } from 'zod';

export const createOpportunitySchema = z.object({
  type: z.enum(['JOB', 'INTERNSHIP', 'FREELANCE']),
  title: z.string().min(3).max(200),
  category: z.string().min(1).max(100),
  description: z.string().min(20).max(5000),
  compensation: z.string().min(1).max(200),
  locationType: z.enum(['REMOTE', 'HYBRID', 'ONSITE']).default('REMOTE'),
  minimumVerificationTier: z.enum(['NONE', 'PEER', 'MENTOR', 'INDUSTRY']).default('NONE'),
  deadline: z.string().datetime().optional(),
  skillIds: z.array(z.string().cuid()).max(15).default([]),
  isFeatured: z.boolean().default(false),
});

export const updateOpportunitySchema = createOpportunitySchema.partial();

export const createApplicationSchema = z.object({
  opportunityId: z.string().cuid('Invalid opportunity ID'),
  coverLetter: z.string().max(3000).optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum([
    'UNDER_REVIEW',
    'INTERVIEW_SCHEDULED',
    'OFFER_EXTENDED',
    'REJECTED',
    'ARCHIVED',
  ]),
  feedback: z.string().max(2000).optional(),
});

export type CreateOpportunityInput = z.infer<typeof createOpportunitySchema>;
export type UpdateOpportunityInput = z.infer<typeof updateOpportunitySchema>;
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
