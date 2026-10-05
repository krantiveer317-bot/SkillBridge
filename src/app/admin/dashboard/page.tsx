'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatsCard } from '@/components/ui/StatsCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockAdminStats, mockVerificationRequests } from '@/data/mockData';
import {
  ShieldAlert,
  Users,
  FolderGit2,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  Building2,
  CreditCard,
} from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <DashboardShell>
      <div className="space-y-8">
        {/* Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50/80 via-white to-white dark:border-slate-800 dark:from-purple-950/30 dark:via-slate-900 dark:to-slate-900">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                  SkillBridge Platform Administration
                </h1>
                <Badge variant="purple">Master Operations</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Platform integrity: 99.98% • 23 verification audits awaiting approval • 2 open dispute flags.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/admin/verifications">
              <Button size="sm" leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}>
                Review Queue (23)
              </Button>
            </Link>
            <Link href="/admin/reports">
              <Button size="sm" variant="outline" leftIcon={<AlertTriangle className="w-3.5 h-3.5" />}>
                Flags (2)
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Total Platform Users"
            value="14,820"
            change="+480 this week"
            isPositive={true}
            icon={<Users className="w-4 h-4 text-purple-600" />}
            description="Students, Mentors, Companies"
          />
          <StatsCard
            label="Verified Builders"
            value="4,210"
            change="28.4% of users"
            isPositive={true}
            icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
            description="Passed test suite audits"
          />
          <StatsCard
            label="Total GMV Volume"
            value="$1,248,500"
            change="+31% MoM"
            isPositive={true}
            icon={<DollarSign className="w-4 h-4 text-indigo-600" />}
            description="Contracts, Escrows, Payouts"
          />
          <StatsCard
            label="Partner Companies"
            value="168 Teams"
            change="Vercel, Supabase, Linear"
            isPositive={true}
            icon={<Building2 className="w-4 h-4 text-sky-600" />}
            description="Hiring actively"
          />
        </div>

        {/* Action Center */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 cols: Verification Queue review */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Verification Queue for Final Review
                </h3>
                <p className="text-xs text-slate-500">Submissions awaiting admin oversight and certificate minting</p>
              </div>
              <Link href="/admin/verifications">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  View All (23)
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {mockVerificationRequests.map((vr) => (
                <div
                  key={vr.id}
                  className="p-4 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {vr.projectTitle}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Applicant: {vr.applicantName} • Target: {vr.requestedLevel} • Submitted: {vr.submittedDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Badge variant={vr.status === 'Approved' ? 'success' : 'warning'}>
                      {vr.status}
                    </Badge>
                    <Link href="/admin/verifications">
                      <Button size="sm" variant="outline">
                        Audit
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 1 col: System health & shortcuts */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Quick Admin Operations
            </h3>

            <div className="p-5 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 space-y-3 text-xs">
              <Link href="/admin/users" className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Manage User Access & Roles</span>
                <Users className="w-4 h-4 text-slate-400" />
              </Link>
              <Link href="/admin/companies" className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Vet & Approve Employers</span>
                <Building2 className="w-4 h-4 text-slate-400" />
              </Link>
              <Link href="/admin/payments" className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Ledger & Platform Fees</span>
                <CreditCard className="w-4 h-4 text-slate-400" />
              </Link>
              <Link href="/admin/reports" className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Dispute & Abuse Reports</span>
                <AlertTriangle className="w-4 h-4 text-rose-500" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
