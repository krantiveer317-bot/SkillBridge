'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockOpportunities } from '@/data/mockData';
import { Briefcase, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AdminJobsPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-purple-600" />
            <span>Job Postings Moderation</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ensure all listed opportunities meet minimum compensation guidelines and proof standards.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Live Opportunities ({mockOpportunities.length})
            </h3>
            <span className="text-xs text-slate-400">All compensation benchmarks verified</span>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="p-4">Title / Company</th>
                <th className="p-4">Type</th>
                <th className="p-4">Compensation</th>
                <th className="p-4">Min Proof Tier</th>
                <th className="p-4">Applicants</th>
                <th className="p-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {mockOpportunities.map((opp) => (
                <tr key={opp.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="p-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{opp.title}</div>
                    <div className="text-[11px] text-slate-400">{opp.company.name}</div>
                  </td>
                  <td className="p-4 capitalize">{opp.type}</td>
                  <td className="p-4 font-medium text-emerald-600">{opp.compensation}</td>
                  <td className="p-4 font-semibold">{opp.minimumVerificationTier}</td>
                  <td className="p-4">{opp.applicantCount} candidates</td>
                  <td className="p-4 text-right">
                    <Button size="sm" variant="outline">
                      Approved
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
