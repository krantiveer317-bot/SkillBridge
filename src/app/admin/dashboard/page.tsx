'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatsCard } from '@/components/ui/StatsCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { apiFetch } from '@/lib/api';
import {
  ShieldAlert,
  Users,
  FolderGit2,
  BriefcaseBusiness,
  Building2,
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  Loader2,
} from 'lucide-react';

interface AdminStats {
  users: number;
  projects: number;
  pendingVerifications: number;
  applications: number;
  opportunities: number;
  companies: number;
  mentors: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await apiFetch<{
        data: AdminStats;
      }>('/admin/stats');

      setStats(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load platform statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <DashboardShell>
      <div className="space-y-8">
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
                Real-time platform statistics and administrative operations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/admin/verifications">
              <Button size="sm" leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}>
                Review Queue ({stats?.pendingVerifications ?? 0})
              </Button>
            </Link>

            <Button
              size="sm"
              variant="outline"
              onClick={loadStats}
              leftIcon={
                loading
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <RefreshCw className="w-3.5 h-3.5" />
              }
            >
              Refresh
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Total Platform Users"
            value={loading ? '...' : String(stats?.users ?? 0)}
            change={`${stats?.mentors ?? 0} mentors`}
            isPositive={true}
            icon={<Users className="w-4 h-4 text-purple-600" />}
            description="All registered platform users"
          />

          <StatsCard
            label="Total Projects"
            value={loading ? '...' : String(stats?.projects ?? 0)}
            change={`${stats?.applications ?? 0} applications`}
            isPositive={true}
            icon={<FolderGit2 className="w-4 h-4 text-indigo-600" />}
            description="Projects registered on SkillBridge"
          />

          <StatsCard
            label="Active Opportunities"
            value={loading ? '...' : String(stats?.opportunities ?? 0)}
            change={`${stats?.companies ?? 0} companies`}
            isPositive={true}
            icon={<BriefcaseBusiness className="w-4 h-4 text-sky-600" />}
            description="Currently active opportunities"
          />

          <StatsCard
            label="Pending Verifications"
            value={loading ? '...' : String(stats?.pendingVerifications ?? 0)}
            change="Requires review"
            isPositive={stats?.pendingVerifications === 0}
            icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
            description="Verification requests awaiting review"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Verification Queue
                </h3>
                <p className="text-xs text-slate-500">
                  Verification requests awaiting administrative review
                </p>
              </div>

              <Link href="/admin/verifications">
                <Button
                  variant="ghost"
                  size="sm"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  View Queue
                </Button>
              </Link>
            </div>

            <div className="p-6 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-950/40 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-purple-600" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {loading
                      ? 'Loading verification status...'
                      : `${stats?.pendingVerifications ?? 0} request(s) currently pending`}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Open the verification queue to inspect individual submissions and review them.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Quick Admin Operations
            </h3>

            <div className="p-5 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 space-y-3 text-xs">
              <Link
                href="/admin/users"
                className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
              >
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Manage User Access & Roles
                </span>
                <Users className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                href="/admin/companies"
                className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
              >
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Vet & Approve Employers
                </span>
                <Building2 className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                href="/admin/payments"
                className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
              >
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Payment Integration Status
                </span>
                <ShieldCheck className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                href="/admin/reports"
                className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
              >
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Dispute & Abuse Reports
                </span>
                <AlertTriangle className="w-4 h-4 text-rose-500" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
