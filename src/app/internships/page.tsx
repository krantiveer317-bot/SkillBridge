'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { OpportunityCard } from '@/components/ui/OpportunityCard';
import { apiFetch } from '@/lib/api';
import { Opportunity } from '@/types';
import { GraduationCap, Search } from 'lucide-react';

type ApiOpportunity = {
  id: string;
  type: 'JOB' | 'INTERNSHIP' | 'FREELANCE';
  title: string;
  category: string;
  description: string;
  compensation: string;
  locationType: 'REMOTE' | 'HYBRID' | 'ONSITE';
  minimumVerificationTier: 'NONE' | 'PEER' | 'MENTOR' | 'INDUSTRY';
  deadline: string | null;
  applicantCount: number;
  isFeatured: boolean;
  createdAt: string;
  company: {
    id: string;
    name: string;
    logoUrl: string | null;
    isVerified: boolean;
    location: string | null;
  };
  skills: {
    skill: {
      id: string;
      name: string;
    };
  }[];
};

type ApiResponse = {
  opportunities: ApiOpportunity[];
};

const mapOpportunity = (opp: ApiOpportunity): Opportunity => ({
  id: opp.id,
  title: opp.title,
  company: {
    id: opp.company.id,
    name: opp.company.name,
    logo: opp.company.logoUrl ?? '',
    verified: opp.company.isVerified,
    location: opp.company.location ?? '',
  },
  type: 'internship',
  category: opp.category,
  description: opp.description,
  compensation: opp.compensation,
  locationType:
    opp.locationType === 'REMOTE'
      ? 'Remote'
      : opp.locationType === 'HYBRID'
        ? 'Hybrid'
        : 'On-site',
  requiredSkills: opp.skills.map(({ skill }) => skill.name),
  minimumVerificationTier:
    opp.minimumVerificationTier === 'NONE'
      ? 'None'
      : opp.minimumVerificationTier === 'PEER'
        ? 'Peer'
        : opp.minimumVerificationTier === 'MENTOR'
          ? 'Mentor'
          : 'Industry',
  deadline: opp.deadline ?? undefined,
  postedAt: opp.createdAt,
  applicantCount: opp.applicantCount,
  featured: opp.isFeatured,
});

export default function StudentInternshipsPage() {
  const [search, setSearch] = useState('');
  const [internships, setInternships] = useState<ApiOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadInternships = async () => {
      try {
        setLoading(true);
        setError('');

        const params = new URLSearchParams({
          type: 'INTERNSHIP',
          page: '1',
          limit: '100',
        });

        if (search.trim()) {
          params.set('q', search.trim());
        }

        const result = await apiFetch<ApiResponse>(
          `/opportunity?${params.toString()}`,
          { auth: false }
        );

        setInternships(result.opportunities ?? []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load internships.'
        );
        setInternships([]);
      } finally {
        setLoading(false);
      }
    };

    const timeout = window.setTimeout(loadInternships, 250);

    return () => window.clearTimeout(timeout);
  }, [search]);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
            <span>Paid Engineering Internships</span>
          </h1>

          <p className="text-xs text-slate-500 mt-1">
            High-compensation university & developer internships with direct
            engineering mentorship.
          </p>
        </div>

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />

          <input
            type="text"
            placeholder="Search internships..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        {loading && (
          <div className="py-12 text-center text-sm text-slate-500">
            Loading internships...
          </div>
        )}

        {!loading && error && (
          <div className="py-12 text-center text-sm text-red-500">
            {error}
          </div>
        )}

        {!loading && !error && internships.length === 0 && (
          <div className="py-12 text-center text-sm text-slate-500">
            No internships found.
          </div>
        )}

        {!loading && !error && internships.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internships.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={mapOpportunity(opp)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
