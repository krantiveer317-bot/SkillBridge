'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Flag, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function AdminReportsPage() {
  const reports = [
    {
      id: 'rep-1',
      target: 'Project: Crypto Arbitrage Bot #19',
      reporter: 'Automated Plagiarism Scanner',
      reason: '92% code match with existing open-source repository without attribution.',
      date: '2 hours ago',
      status: 'Under Investigation',
      severity: 'Medium',
    },
    {
      id: 'rep-2',
      target: 'User: dev_scout_99',
      reporter: 'Elena Rostova (Student Builder)',
      reason: 'Attempted to initiate payment off-platform to avoid escrow protections.',
      date: '1 day ago',
      status: 'Action Required',
      severity: 'High',
    },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Flag className="w-6 h-6 text-purple-600" />
            <span>Disputes & Abuse Reports</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Resolve trust violations, code plagiarism flags, and escrow disputes.
          </p>
        </div>

        <div className="space-y-4">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="p-6 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{rep.target}</h4>
                    <p className="text-xs text-slate-400">Reported by {rep.reporter} • {rep.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <Badge variant={rep.severity === 'High' ? 'danger' : 'warning'}>
                    {rep.severity} Severity
                  </Badge>
                  <Badge variant="default">{rep.status}</Badge>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-11">
                "{rep.reason}"
              </p>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <Button size="sm" variant="outline">
                  Dismiss
                </Button>
                <Button size="sm" variant="danger">
                  Take Enforcement Action
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
