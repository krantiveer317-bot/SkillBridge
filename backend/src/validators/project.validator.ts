import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500),
  longDescription: z.string().max(5000).optional(),
  githubUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  liveUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  bannerImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  skillIds: z.array(z.string().cuid()).min(1, 'At least one skill is required').max(10),
  teamSize: z.number().int().min(1).max(50).default(1),
});

export const updateProjectSchema = createProjectSchema.partial();

export const verificationRequestSchema = z.object({
  projectId: z.string().cuid('Invalid project ID'),
  requestedTier: z.enum(['PEER', 'MENTOR', 'INDUSTRY']),
  proofArtifacts: z.array(z.string().url()).min(1, 'At least one proof artifact is required'),
});

export const reviewVerificationSchema = z.object({
  status: z.enum(['APPROVED', 'CHANGES_REQUESTED', 'REJECTED']),
  reviewerNotes: z.string().max(2000).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type VerificationRequestInput = z.infer<typeof verificationRequestSchema>;
export type ReviewVerificationInput = z.infer<typeof reviewVerificationSchema>;
