'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatsCard } from '@/components/ui/StatsCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { apiFetch } from '@/lib/api';
import {
  Building2,
  Briefcase,
  Users,
  PlusCircle,
  Search,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

type Opportunity = {
  id: string;
  type: 'JOB' | 'INTERNSHIP' | 'FREELANCE';
  title: string;
  category: string;
  description: string;
  compensation: string;
  locationType: 'REMOTE' | 'HYBRID' | 'ONSITE';
  minimumVerificationTier: 'NONE' | 'PEER' | 'MENTOR' | 'INDUSTRY';
  deadline: string | null;
  isActive: boolean;
  isFeatured: boolean;
  applicantCount: number;
  createdAt: string;
  updatedAt: string;
  skills: {
    skill: {
      id: string;
      name: string;
    };
  }[];
};

type Company = {
  id: string;
  name: string;
  logoUrl: string | null;
  website: string | null;
  description: string | null;
  industry: string | null;
  size: string | null;
  location: string | null;
  isVerified: boolean;
  opportunities: Opportunity[];
};

type Application = {
  id: string;
  status: string;
  appliedAt: string;
  applicant: {
    profile: {
      id?: string;
      name?: string;
      title?: string | null;
      avatarUrl?: string | null;
    } | null;
    skills: {
      skill: {
        id: string;
        name: string;
      };
    }[];
  };
};

type ApplicationsResponse = {
  applications: Application[];
};

type DashboardCandidate = Application & {
  opportunityTitle: string;
  opportunityId: string;
};

const formatType = (type: Opportunity['type']) => {
  switch (type) {
    case 'JOB':
      return 'Job';
    case 'INTERNSHIP':
      return 'Internship';
    case 'FREELANCE':
      return 'Freelance';
    default:
      return type;
  }
};

const formatLocation = (type: Opportunity['locationType']) => {
  switch (type) {
    case 'REMOTE':
      return 'Remote';
    case 'HYBRID':
      return 'Hybrid';
    case 'ONSITE':
      return 'On-site';
    default:
      return type;
  }
};

export default function CompanyDashboardPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [candidates, setCandidates] = useState<DashboardCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError('');

        const companyData = await apiFetch<Company>('/company/my');
        setCompany(companyData);

        const activeOpportunities = (companyData.opportunities ?? []).filter(
          (opp) => opp.isActive
        );

        const applicationResults = await Promise.all(
          activeOpportunities.map(async (opp) => {
            try {
              const result = await apiFetch<ApplicationsResponse>(
                `/opportunity/${opp.id}/applications?page=1&limit=100`
              );

              return (result.applications ?? []).map((application) => ({
                ...application,
                opportunityTitle: opp.title,
                opportunityId: opp.id,
              }));
            } catch {
              return [];
            }
          })
        );

        setCandidates(applicationResults.flat());
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load company dashboard.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const activeOpportunities = useMemo(
    () => (company?.opportunities ?? []).filter((opp) => opp.isActive),
    [company]
  );

  const totalApplicants = useMemo(
    () =>
      activeOpportunities.reduce(
        (total, opportunity) => total + opportunity.applicantCount,
        0
      ),
    [activeOpportunities]
  );

  const uniqueCandidates = useMemo(
    () => new Set(candidates.map((candidate) => candidate.applicant.profile?.id).filter(Boolean)).size,
    [candidates]
  );

  const recentOpportunities = activeOpportunities.slice(0, 3);
  const recentCandidates = candidates.slice(0, 3);

  return (
    <DashboardShell>
      <div className="space-y-8">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-sky-600" />
              Loading company dashboard...
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-950/20">
            <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-500" />

            <h2 className="font-semibold text-red-700 dark:text-red-400">
              Unable to load dashboard
            </h2>

            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && company && (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50/80 via-white to-white dark:border-slate-800 dark:from-sky-950/30 dark:via-slate-900 dark:to-slate-900">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl overflow-hidden border-2 border-sky-500/30 shrink-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  {company.logoUrl ? (
                    <img
                      src={company.logoUrl}
                      alt={company.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 className="w-7 h-7 text-slate-400" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {company.name} Talent Portal
                    </h1>

                    {company.isVerified && (
                      <Badge variant="info">
                        Verified Employer
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Manage your SkillBridge opportunities and candidate
                    applications.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link href="/company/jobs/new">
                  <Button
                    size="sm"
                    leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
                  >
                    Post New Role
                  </Button>
                </Link>

                <Link href="/company/candidates">
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<Search className="w-3.5 h-3.5" />}
                  >
                    Find Candidates
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                label="Active Roles"
                value={`${activeOpportunities.length}`}
                change={`${company.opportunities.length} total`}
                isPositive={activeOpportunities.length > 0}
                icon={<Briefcase className="w-4 h-4 text-sky-600" />}
                description="Currently accepting applications"
              />

              <StatsCard
                label="Applicants"
                value={`${totalApplicants}`}
                change={`${uniqueCandidates} unique profiles`}
                isPositive={totalApplicants > 0}
                icon={<Users className="w-4 h-4 text-indigo-600" />}
                description="Across active roles"
              />

              <StatsCard
                label="Featured Roles"
                value={`${activeOpportunities.filter((opp) => opp.isFeatured).length}`}
                change="Currently featured"
                isPositive={
                  activeOpportunities.some((opp) => opp.isFeatured)
                }
                icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                description="Highlighted opportunities"
              />

              <StatsCard
                label="Company Status"
                value={company.isVerified ? 'Verified' : 'Pending'}
                change={company.industry || 'Company'}
                isPositive={company.isVerified}
                icon={<Building2 className="w-4 h-4 text-purple-600" />}
                description="Current SkillBridge profile"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      Active Engineering Openings
                    </h3>

                    <p className="text-xs text-slate-500">
                      Live roles receiving candidate applications
                    </p>
                  </div>

                  <Link href="/company/jobs">
                    <Button
                      variant="ghost"
                      size="sm"
                      rightIcon={
                        <ArrowRight className="w-3.5 h-3.5" />
                      }
                    >
                      Manage All
                    </Button>
                  </Link>
                </div>

                {recentOpportunities.length === 0 ? (
                  <div className="rounded-xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
                    <Briefcase className="mx-auto mb-3 h-8 w-8 text-slate-400" />

                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      No active openings
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Create a role to start receiving applications.
                    </p>

                    <Link href="/company/jobs/new" className="inline-block mt-4">
                      <Button size="sm">
                        Post a Role
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentOpportunities.map((opp) => (
                      <div
                        key={opp.id}
                        className="p-5 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {opp.title}
                            </h4>

                            <Badge variant="info">
                              {formatType(opp.type)}
                            </Badge>
                          </div>

                          <p className="text-xs text-slate-500 mt-1">
                            {opp.compensation || 'Compensation not specified'}
                            {' • '}
                            {formatLocation(opp.locationType)}
                          </p>

                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {opp.skills.slice(0, 6).map(({ skill }) => (
                              <span
                                key={skill.id}
                                className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                              >
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                            {opp.applicantCount} applicants
                          </span>

                          <Link
                            href={`/company/candidates?opportunityId=${opp.id}`}
                          >
                            <Button size="sm" variant="outline">
                              View Pipeline
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Recent Applicants
                  </h3>

                  <Link
                    href="/company/candidates"
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    View All
                  </Link>
                </div>

                {recentCandidates.length === 0 ? (
                  <div className="rounded-xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
                    <Users className="mx-auto mb-2 h-7 w-7 text-slate-400" />
                    <p className="text-xs text-slate-500">
                      No applications yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentCandidates.map((candidate) => {
                      const profile = candidate.applicant.profile;

                      return (
                        <div
                          key={candidate.id}
                          className="p-4 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 space-y-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                              {profile?.avatarUrl ? (
                                <img
                                  src={profile.avatarUrl}
                                  alt={profile.name || 'Applicant'}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Users className="w-4 h-4 text-slate-400" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                                {profile?.name || 'Unnamed applicant'}
                              </div>

                              <p className="text-slate-400 text-[11px] truncate">
                                {profile?.title || candidate.opportunityTitle}
                              </p>
                            </div>

                            <Badge variant="info">
                              {candidate.status}
                            </Badge>
                          </div>

                          <div className="text-[11px] text-slate-500">
                            Applied for{' '}
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              {candidate.opportunityTitle}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
