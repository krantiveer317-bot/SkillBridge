'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatsCard } from '@/components/ui/StatsCard';
import { Badge } from '@/components/ui/Badge';
import { mockEarnings } from '@/data/mockData';
import { CreditCard, DollarSign, Download, ArrowUpRight } from 'lucide-react';

export default function AdminPaymentsPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-purple-600" />
            <span>Platform Ledger & Fees</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global transaction ledger, escrow balance reconciliation, and 5% platform take rate accounting.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            label="Total Platform Volume"
            value="$1,248,500"
            change="+31% MoM"
            isPositive={true}
            icon={<DollarSign className="w-4 h-4 text-purple-600" />}
          />
          <StatsCard
            label="Gross Platform Fees (5%)"
            value="$62,425"
            change="Net SaaS Margin"
            isPositive={true}
            icon={<ArrowUpRight className="w-4 h-4 text-emerald-600" />}
          />
          <StatsCard
            label="Escrow Collateral Held"
            value="$184,200"
            change="100% Reserve Backed"
            isPositive={true}
            icon={<CreditCard className="w-4 h-4 text-indigo-600" />}
          />
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Recent Settlement Ledger
            </h3>
            <span className="text-xs text-slate-400">Export Ledger CSV</span>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="p-4">Transaction / Entity</th>
                <th className="p-4">Type</th>
                <th className="p-4">Gross</th>
                <th className="p-4">Platform Fee (5%)</th>
                <th className="p-4">Net Builder Payout</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {mockEarnings.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="p-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{t.title}</div>
                    <div className="text-[11px] text-slate-400">{t.client}</div>
                  </td>
                  <td className="p-4 text-slate-500">{t.type}</td>
                  <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">${t.amount.toLocaleString()}</td>
                  <td className="p-4 font-semibold text-purple-600">${t.fee.toLocaleString()}</td>
                  <td className="p-4 font-bold text-emerald-600">${t.netAmount.toLocaleString()}</td>
                  <td className="p-4">
                    <Badge variant={t.status === 'Completed' ? 'success' : 'warning'}>
                      {t.status}
                    </Badge>
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
