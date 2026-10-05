export type UserRole = 'public' | 'student' | 'mentor' | 'company' | 'admin';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type VerificationTier = 'none' | 'peer' | 'mentor' | 'industry';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title: string;
  bio?: string;
  location?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  verifiedSkillsCount?: number;
  completedProjectsCount?: number;
  trustScore?: number; // 0-100
  badgeTier?: VerificationTier;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'DevOps & Cloud' | 'AI & ML' | 'Mobile' | 'Design & UX' | 'Blockchain' | 'Data Science';
  level: SkillLevel;
  isVerified?: boolean;
  verifiedBy?: string;
  verifiedDate?: string;
  endorsersCount?: number;
  projectCount?: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    title: string;
    badgeTier?: VerificationTier;
  };
  skills: string[];
  githubUrl?: string;
  liveUrl?: string;
  bannerImage?: string;
  verificationStatus: 'verified' | 'pending' | 'draft';
  verificationLevel: 'Level 1: Peer Verified' | 'Level 2: Mentor Reviewed' | 'Level 3: Industry Audited' | 'Unverified';
  starsCount: number;
  viewsCount: number;
  createdAt: string;
  proofDetails?: {
    testCoverage: string;
    performanceScore: string;
    architectureVerified: boolean;
    reviewerNotes: string;
  };
}

export type OpportunityType = 'job' | 'internship' | 'freelance';

export interface Opportunity {
  id: string;
  title: string;
  company: {
    id: string;
    name: string;
    logo: string;
    verified: boolean;
    location: string;
  };
  type: OpportunityType;
  category: string;
  description: string;
  compensation: string;
  locationType: 'Remote' | 'Hybrid' | 'On-site';
  requiredSkills: string[];
  minimumVerificationTier: 'None' | 'Peer' | 'Mentor' | 'Industry';
  deadline?: string;
  postedAt: string;
  applicantCount: number;
  featured?: boolean;
}

export interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  bio: string;
  hourlyRate: number;
  rating: number;
  reviewsCount: number;
  sessionsCompleted: number;
  expertise: string[];
  availableSlots: string[];
  featured?: boolean;
}

export interface SkillExchangeRequest {
  id: string;
  requester: {
    id: string;
    name: string;
    avatar: string;
    title: string;
  };
  offeringSkill: string;
  offeringSkillLevel: SkillLevel;
  seekingSkill: string;
  seekingSkillLevel: SkillLevel;
  message: string;
  status: 'Open' | 'Matched' | 'Completed';
  createdAt: string;
}

export interface Application {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  companyName: string;
  companyLogo: string;
  appliedDate: string;
  status: 'Submitted' | 'Under Review' | 'Interview Scheduled' | 'Offer Extended' | 'Archived';
  type: OpportunityType;
  compensation: string;
  lastUpdate: string;
  feedback?: string;
}

export interface EarningTransaction {
  id: string;
  title: string;
  client: string;
  type: 'Freelance Milestone' | 'Mentorship Booking' | 'Prize Bounty' | 'Direct Contract';
  amount: number;
  fee: number;
  netAmount: number;
  date: string;
  status: 'Completed' | 'Pending Escrow' | 'Processing';
  invoiceId: string;
}

export interface VerificationRequest {
  id: string;
  projectId: string;
  projectTitle: string;
  applicantName: string;
  applicantId: string;
  skills: string[];
  submittedDate: string;
  requestedLevel: 'Level 1: Peer' | 'Level 2: Mentor' | 'Level 3: Industry';
  status: 'Pending Review' | 'In Progress' | 'Approved' | 'Changes Requested';
  assignedReviewer?: string;
  proofArtifacts: string[];
}
