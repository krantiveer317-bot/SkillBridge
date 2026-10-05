'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { apiFetch } from '@/lib/api';
import { Briefcase, ExternalLink } from 'lucide-react';

interface Opportunity {
  id: string;
  type: string;
  title: string;
  category: string;
  description: string;
  compensation: string;
  locationType: string;
  minimumVerificationTier: string;
  deadline?: string | null;
  isActive: boolean;
  isFeatured: boolean;
  applicantCount: number;
  createdAt: string;
  company: {
    id: string;
    name: string;
    logoUrl?: string | null;
    isVerified: boolean;
    location?: string | null;
  };
}

interface OpportunitiesResponse {
  opportunities: Opportunity[];
  meta?: unknown;
}

export default function AdminJobsPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadOpportunities() {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch<OpportunitiesResponse>(
        '/opportunity?page=1&limit=100'
      );

      setOpportunities(response.opportunities ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load opportunities.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOpportunities();
  }, []);

  function formatType(type: string) {
    return type
      .toLowerCase()
      .replace(/^./, (char) => char.toUpperCase());
  }

  function formatTier(tier: string) {
    return tier
      .toLowerCase()
      .replace(/^./, (char) => char.toUpperCase());
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-purple-600" />
            <span>Job Postings Moderation</span>
          </h1>

          <p className="text-xs text-slate-500 mt-1">
            Review currently active opportunities using real company and
            application data.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Live Opportunities ({opportunities.length})
            </h3>

            <span className="text-xs text-slate-400">
              Active records from the database
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Loading opportunities...
            </div>
          ) : opportunities.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No active opportunities found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="p-4">Title / Company</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Compensation</th>
                    <th className="p-4">Min Proof Tier</th>
                    <th className="p-4">Applicants</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Details</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {opportunities.map((opp) => (
                    <tr
                      key={opp.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                    >
                      <td className="p-4">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {opp.title}
                        </div>

                        <div className="text-[11px] text-slate-400">
                          {opp.company.name}
                          {opp.company.isVerified ? ' • Verified company' : ''}
                        </div>
                      </td>

                      <td className="p-4">
                        {formatType(opp.type)}
                      </td>

                      <td className="p-4 font-medium text-emerald-600">
                        {opp.compensation}
                      </td>

                      <td className="p-4 font-semibold">
                        {formatTier(opp.minimumVerificationTier)}
                      </td>

                      <td className="p-4">
                        {opp.applicantCount} candidates
                      </td>

                      <td className="p-4">
                        <Badge variant="success">
                          {opp.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>

                      <td className="p-4 text-right">
                        <a
                          href={`/opportunities`}
                          className="inline-block"
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            leftIcon={
                              <ExternalLink className="w-3.5 h-3.5" />
                            }
                          >
                            View
                          </Button>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
