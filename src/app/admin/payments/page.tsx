'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { CreditCard, ShieldAlert } from 'lucide-react';

export default function AdminPaymentsPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            <CreditCard className="h-6 w-6 text-purple-600" />
            <span>Platform Ledger & Fees</span>
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Global transaction ledger, escrow balance reconciliation, and
            platform fee accounting.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-10 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <ShieldAlert className="mx-auto h-10 w-10 text-slate-400" />

          <h2 className="mt-4 text-sm font-bold text-slate-900 dark:text-slate-100">
            Platform ledger is not available
          </h2>

          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-slate-500">
            The backend currently supports user-level payment history but does
            not expose an admin-wide ledger. No fabricated financial figures
            are displayed.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
