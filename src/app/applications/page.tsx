'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { apiFetch } from '@/lib/api';
import {
  FileCheck2,
  Clock,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface Application {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  opportunity?: {
    id: string;
    title?: string;
    company?: {
      name?: string;
      logo?: string | null;
    } | null;
    compensation?: string | null;
  } | null;
}

interface ApplicationsResponse {
  applications?: Application[];
  data?: Application[];
  meta?: unknown;
}

export default function ApplicationsTrackerPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadApplications() {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFetch<ApplicationsResponse>(
          '/applications/my?limit=100'
        );

        if (cancelled) return;

        setApplications(response.applications ?? response.data ?? []);
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load your applications.'
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadApplications();

    return () => {
      cancelled = true;
    };
  }, []);

  const total = applications.length;
  const inReview = applications.filter(
    (app) =>
      ['PENDING', 'REVIEWING', 'IN_REVIEW'].includes(
        app.status.toUpperCase()
      )
  ).length;

  const interviews = applications.filter((app) =>
    app.status.toUpperCase().includes('INTERVIEW')
  ).length;

  const offers = applications.filter((app) =>
    app.status.toUpperCase().includes('OFFER')
  ).length;

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-indigo-600" />
            <span>Applications & Interview Pipeline</span>
          </h1>

          <p className="text-xs text-slate-500 mt-1">
            Track your real applications and hiring progress.
          </p>
        </div>

        {/* Pipeline overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Total
            </span>
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 block">
              {total}
            </span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              In Review
            </span>
            <span className="text-2xl font-bold text-indigo-600 mt-1 block">
              {inReview}
            </span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Interviews
            </span>
            <span className="text-2xl font-bold text-emerald-600 mt-1 block">
              {interviews}
            </span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Offers
            </span>
            <span className="text-2xl font-bold text-purple-600 mt-1 block">
              {offers}
            </span>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-10 text-center">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto text-indigo-600" />
            <p className="text-sm text-slate-500 mt-3">
              Loading your applications...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20 p-6">
            <h2 className="text-sm font-bold text-red-700 dark:text-red-400">
              Unable to load applications
            </h2>
            <p className="text-xs text-red-600 dark:text-red-400 mt-2">
              {error}
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && applications.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-10 text-center">
            <FileCheck2 className="w-8 h-8 mx-auto text-slate-400" />
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-3">
              No applications yet
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Applications you submit will appear here.
            </p>
          </div>
        )}

        {/* Real applications */}
        {!loading && !error && applications.length > 0 && (
          <div className="space-y-4">
            {applications.map((app) => {
              const title = app.opportunity?.title || 'Opportunity';
              const companyName =
                app.opportunity?.company?.name || 'Company';
              const compensation =
                app.opportunity?.compensation || 'Compensation not specified';

              return (
                <div
                  key={app.id}
                  className="p-5 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        {title}
                      </h3>

                      <p className="text-xs text-slate-500 mt-1">
                        {companyName} · {compensation} · Applied{' '}
                        {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <Badge
                      variant={
                        app.status.toUpperCase().includes('OFFER')
                          ? 'purple'
                          : app.status.toUpperCase().includes('INTERVIEW')
                            ? 'success'
                            : 'default'
                      }
                      size="md"
                      dot
                    >
                      {app.status}
                    </Badge>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Last Updated</span>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 pl-5 mt-1">
                      {new Date(app.updatedAt).toLocaleString()}
                    </p>
                  </div>

                  {app.opportunity?.id && (
                    <a
                      href={`/opportunities/${app.opportunity.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      View Opportunity
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
