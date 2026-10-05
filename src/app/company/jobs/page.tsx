'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { apiFetch } from '@/lib/api';
import {
  Briefcase,
  PlusCircle,
  Users,
  ArrowRight,
  AlertCircle,
  MapPin,
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
  opportunities: Opportunity[];
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

const formatLocation = (location: Opportunity['locationType']) => {
  switch (location) {
    case 'REMOTE':
      return 'Remote';
    case 'HYBRID':
      return 'Hybrid';
    case 'ONSITE':
      return 'On-site';
    default:
      return location;
  }
};

const formatTier = (tier: Opportunity['minimumVerificationTier']) => {
  switch (tier) {
    case 'NONE':
      return 'None';
    case 'PEER':
      return 'Peer';
    case 'MENTOR':
      return 'Mentor';
    case 'INDUSTRY':
      return 'Industry';
    default:
      return tier;
  }
};

export default function CompanyJobsPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCompany = async () => {
      try {
        setLoading(true);
        setError('');

        const result = await apiFetch<Company>('/company/my');

        setCompany(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load company opportunities.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadCompany();
  }, []);

  const opportunities = company?.opportunities ?? [];
  const activeOpportunities = opportunities.filter((opp) => opp.isActive);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-sky-600" />
              <span>Job Postings Manager</span>
            </h1>

            <p className="text-xs text-slate-500 mt-1">
              Manage your company's jobs, internships, and freelance roles.
            </p>
          </div>

          <Link href="/company/jobs/new">
            <Button
              size="sm"
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Post a New Role
            </Button>
          </Link>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-sky-600" />
              Loading job postings...
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-950/20">
            <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-500" />

            <h2 className="font-semibold text-red-700 dark:text-red-400">
              Unable to load job postings
            </h2>

            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-xs">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Active Job Postings ({activeOpportunities.length})
                  </h3>

                  <p className="text-xs text-slate-400 mt-1">
                    {company?.name || 'Your company'} opportunities
                  </p>
                </div>

                <span className="text-xs text-slate-400">
                  {opportunities.length} total postings
                </span>
              </div>

              {activeOpportunities.length === 0 ? (
                <div className="py-16 text-center">
                  <Briefcase className="mx-auto mb-3 h-9 w-9 text-slate-400" />

                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    No active postings
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Create your first role to start receiving applications.
                  </p>

                  <Link href="/company/jobs/new" className="inline-block mt-4">
                    <Button size="sm">
                      Post a New Role
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {activeOpportunities.map((opp) => (
                    <div
                      key={opp.id}
                      className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {opp.title}
                          </h4>

                          <Badge
                            variant={
                              opp.type === 'JOB'
                                ? 'default'
                                : opp.type === 'INTERNSHIP'
                                  ? 'purple'
                                  : 'success'
                            }
                          >
                            {formatType(opp.type)}
                          </Badge>

                          {opp.isFeatured && (
                            <Badge variant="info">
                              Featured
                            </Badge>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                          {opp.description}
                        </p>

                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
                          {opp.compensation && (
                            <span>{opp.compensation}</span>
                          )}

                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {formatLocation(opp.locationType)}
                          </span>

                          <span>
                            Min Proof: {formatTier(opp.minimumVerificationTier)}
                          </span>

                          {opp.category && (
                            <span>{opp.category}</span>
                          )}
                        </div>

                        {opp.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {opp.skills.map(({ skill }) => (
                              <span
                                key={skill.id}
                                className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                              >
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 self-end lg:self-auto shrink-0">
                        <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300 font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                          <Users className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{opp.applicantCount} Applicants</span>
                        </div>

                        <Link href={`/company/candidates?opportunityId=${opp.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            rightIcon={
                              <ArrowRight className="w-3.5 h-3.5" />
                            }
                          >
                            Review
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
