'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { mockOpportunities } from '@/data/mockData';
import { Briefcase, PlusCircle, Users, Eye, ArrowRight } from 'lucide-react';

export default function CompanyJobsPage() {
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
              Create, pause, or view applicants for engineering roles and internships.
            </p>
          </div>

          <Link href="/company/jobs/new">
            <Button size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
              Post a New Role
            </Button>
          </Link>
        </div>

        {/* Jobs Table */}
        <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Active Job Postings (8)
            </h3>
            <span className="text-xs text-slate-400">Filtered by verified proof criteria</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {mockOpportunities.map((opp) => (
              <div
                key={opp.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {opp.title}
                    </h4>
                    <Badge variant={opp.type === 'job' ? 'default' : opp.type === 'internship' ? 'purple' : 'success'}>
                      {opp.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500">
                    {opp.compensation} • {opp.locationType} • Min Proof: {opp.minimumVerificationTier}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300 font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <Users className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{opp.applicantCount} Applicants</span>
                  </div>

                  <Link href="/company/candidates">
                    <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Review Candidates
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
