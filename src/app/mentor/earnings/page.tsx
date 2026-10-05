'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatsCard } from '@/components/ui/StatsCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DollarSign, Download, CreditCard, ArrowUpRight } from 'lucide-react';

export default function MentorEarningsPage() {
  const transactions = [
    { id: 'tx-m1', client: 'Alex Rivera', type: '1-on-1 Consultation', amount: 85, date: 'Today', status: 'Pending Payout' },
    { id: 'tx-m2', client: 'Elena Rostova', type: 'Mock System Design Screen', amount: 85, date: 'Yesterday', status: 'Completed' },
    { id: 'tx-m3', client: 'Cohort Payout #4', type: 'Distributed Systems Masterclass', amount: 2490, date: 'Mar 10, 2025', status: 'Completed' },
    { id: 'tx-m4', client: 'Marcus Vance', type: '1-on-1 Code Audit', amount: 85, date: 'Mar 05, 2025', status: 'Completed' },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-emerald-600" />
              <span>Mentor Revenue & Payouts</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Consulting earnings and masterclass revenue deposited automatically every Friday.
            </p>
          </div>

          <Button size="sm" leftIcon={<CreditCard className="w-4 h-4" />}>
            Bank Account Settings
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            label="March Revenue"
            value="$4,280.00"
            change="+24% vs Feb"
            isPositive={true}
            icon={<DollarSign className="w-4 h-4 text-emerald-600" />}
          />
          <StatsCard
            label="Next Friday Payout"
            value="$1,170.00"
            change="Auto-scheduled"
            isPositive={true}
            icon={<CreditCard className="w-4 h-4 text-indigo-600" />}
          />
          <StatsCard
            label="All-Time Mentorship GMV"
            value="$32,450.00"
            change="112 sessions"
            isPositive={true}
            icon={<ArrowUpRight className="w-4 h-4 text-purple-600" />}
          />
        </div>

        {/* Ledger */}
        <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Session Ledger & Receipts
            </h3>
            <span className="text-xs text-slate-400">Export CSV</span>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="p-4">Mentee / Cohort</th>
                <th className="p-4">Type</th>
                <th className="p-4">Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">{t.client}</td>
                  <td className="p-4 text-slate-500">{t.type}</td>
                  <td className="p-4 text-slate-500">{t.date}</td>
                  <td className="p-4 font-bold text-emerald-600">${t.amount}</td>
                  <td className="p-4">
                    <Badge variant={t.status === 'Completed' ? 'success' : 'warning'}>
                      {t.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-indigo-600 hover:underline inline-flex items-center gap-1 font-mono cursor-pointer">
                      <Download className="w-3 h-3" />
                      <span>{t.id}</span>
                    </button>
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
