'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { mockVerificationRequests } from '@/data/mockData';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  PlusCircle,
  FolderGit2,
  ArrowRight,
  Terminal,
} from 'lucide-react';

export default function VerificationHubPage() {
  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Skill Verification Hub
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Submit repositories for automated test runs, peer audits, and mentor code reviews.
            </p>
          </div>

          <Link href="/projects/new">
            <Button size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
              Request Verification
            </Button>
          </Link>
        </div>

        {/* 3-Tier Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 space-y-2">
            <VerificationBadge tier="Level 1: Peer Verified" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 pt-1">
              Peer Verification (L1)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Automated unit & integration tests run in sandbox CI. Reviewed and approved by 2 verified community peers.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-indigo-200/80 bg-indigo-50/30 dark:border-indigo-900/60 dark:bg-slate-900 space-y-2">
            <VerificationBadge tier="Level 2: Mentor Reviewed" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 pt-1">
              Mentor Reviewed (L2)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Architecture review, edge cases, and code readability audited by senior engineers from partner firms.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-emerald-200/80 bg-emerald-50/30 dark:border-emerald-900/60 dark:bg-slate-900 space-y-2">
            <VerificationBadge tier="Level 3: Industry Audited" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 pt-1">
              Industry Audited (L3)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Production-ready distributed testing, load profiling, and live defense. Fast-tracks you to final hiring rounds.
            </p>
          </div>
        </div>

        {/* Active Verification Queue */}
        <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              My Verification Submissions
            </h3>
            <span className="text-xs text-slate-500">{mockVerificationRequests.length} submissions recorded</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {mockVerificationRequests.map((vr) => (
              <div key={vr.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {vr.projectTitle}
                    </h4>
                    <Badge variant={vr.status === 'Approved' ? 'success' : 'warning'}>
                      {vr.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>Target: {vr.requestedLevel}</span>
                    <span>•</span>
                    <span>Submitted: {vr.submittedDate}</span>
                    {vr.assignedReviewer && (
                      <>
                        <span>•</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                          Reviewer: {vr.assignedReviewer}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <Link href="/projects/proj-1">
                  <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    View Audit Report
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
