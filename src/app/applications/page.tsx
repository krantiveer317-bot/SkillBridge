'use client';

import React from 'react';
import Image from 'next/image';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockApplications } from '@/data/mockData';
import { FileCheck2, ExternalLink, Clock, CheckCircle2, MessageSquare } from 'lucide-react';

export default function ApplicationsTrackerPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-indigo-600" />
            <span>Applications & Interview Pipeline</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track status, interview milestones, and feedback from hiring teams.
          </p>
        </div>

        {/* Pipeline overview cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Active</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 block">4</span>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">In Review</span>
            <span className="text-2xl font-bold text-indigo-600 mt-1 block">2</span>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Interviews</span>
            <span className="text-2xl font-bold text-emerald-600 mt-1 block">1</span>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Offers</span>
            <span className="text-2xl font-bold text-purple-600 mt-1 block">1</span>
          </div>
        </div>

        {/* Detailed Application Cards */}
        <div className="space-y-4">
          {mockApplications.map((app) => (
            <div
              key={app.id}
              className="p-5 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0">
                    <Image src={app.companyLogo} alt={app.companyName} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      {app.opportunityTitle}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {app.companyName} • {app.compensation} • Applied {app.appliedDate}
                    </p>
                  </div>
                </div>

                <Badge
                  variant={
                    app.status === 'Interview Scheduled'
                      ? 'success'
                      : app.status === 'Offer Extended'
                      ? 'purple'
                      : 'default'
                  }
                  size="md"
                  dot
                >
                  {app.status}
                </Badge>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Latest Status Update:</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 pl-5">
                  {app.lastUpdate}
                </p>
                {app.feedback && (
                  <p className="text-indigo-600 dark:text-indigo-400 pl-5 font-medium mt-1">
                    "{app.feedback}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
