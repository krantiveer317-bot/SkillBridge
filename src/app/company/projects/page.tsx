'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FolderGit2, PlusCircle, Users, ArrowRight, DollarSign } from 'lucide-react';

export default function CompanyProjectsPage() {
  const sponsoredProjects = [
    {
      id: 'sp-1',
      title: 'Build Open-Source Next.js Edge Middleware for WebSockets',
      bounty: '$4,000 Bounty + Interview Fast-Track',
      submissions: 18,
      verifiedSubmissions: 5,
      status: 'Active',
      deadline: 'April 20, 2025',
      skills: ['Next.js', 'Edge Functions', 'WebSockets', 'TypeScript'],
    },
    {
      id: 'sp-2',
      title: 'Distributed Log Aggregator Benchmark Suite',
      bounty: '$3,500 Bounty + Interview Fast-Track',
      submissions: 12,
      verifiedSubmissions: 3,
      status: 'Active',
      deadline: 'May 05, 2025',
      skills: ['Go', 'Kafka', 'eBPF', 'Benchmarking'],
    },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FolderGit2 className="w-6 h-6 text-sky-600" />
              <span>Sponsored Pre-Hire Projects</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Sponsor production problems as audition tasks. Screen builders by reviewing their actual submitted solutions.
            </p>
          </div>

          <Button size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Sponsor New Project
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sponsoredProjects.map((sp) => (
            <div
              key={sp.id}
              className="p-6 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="success">{sp.status}</Badge>
                  <span className="text-xs font-semibold text-emerald-600">{sp.bounty}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {sp.title}
                </h3>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {sp.skills.map((s) => (
                    <span key={s} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{sp.submissions} Student Submissions</span>
                  </span>
                  <span className="text-emerald-600 font-semibold">
                    {sp.verifiedSubmissions} Verified L3
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Deadline: {sp.deadline}</span>
                <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Audit Submissions
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
