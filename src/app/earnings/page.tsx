'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatsCard } from '@/components/ui/StatsCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { mockEarnings } from '@/data/mockData';
import { DollarSign, Download, CreditCard, CheckCircle2, ArrowUpRight } from 'lucide-react';

export default function EarningsPage() {
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-indigo-600" />
              <span>Earnings & Payouts</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Track contract milestones, hackathon prize bounties, and escrow settlements.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                setWithdrawModalOpen(true);
                setWithdrawSuccess(false);
              }}
              leftIcon={<CreditCard className="w-4 h-4" />}
            >
              Withdraw Funds
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            label="Available Balance"
            value="$10,320.00"
            change="Ready for payout"
            isPositive={true}
            icon={<DollarSign className="w-4 h-4 text-emerald-600" />}
          />
          <StatsCard
            label="Pending in Escrow"
            value="$1,900.00"
            change="Milestone 1 Active"
            isPositive={true}
            icon={<CreditCard className="w-4 h-4 text-amber-600" />}
            description="Releases on PR review"
          />
          <StatsCard
            label="Lifetime Earnings"
            value="$18,400.00"
            change="4 Contracts & Prizes"
            isPositive={true}
            icon={<ArrowUpRight className="w-4 h-4 text-indigo-600" />}
          />
        </div>

        {/* Transactions Table */}
        <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Transaction History & Invoices
            </h3>
            <span className="text-xs text-slate-500">{mockEarnings.length} records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-4">Description / Client</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Gross Amount</th>
                  <th className="p-4">Net Payout</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {mockEarnings.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{txn.title}</div>
                      <div className="text-[11px] text-slate-400">{txn.client}</div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{txn.type}</td>
                    <td className="p-4 text-slate-500">{txn.date}</td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">${txn.amount.toLocaleString()}</td>
                    <td className="p-4 font-bold text-emerald-600">${txn.netAmount.toLocaleString()}</td>
                    <td className="p-4">
                      <Badge variant={txn.status === 'Completed' ? 'success' : 'warning'}>
                        {txn.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-indigo-600 dark:text-indigo-400 hover:underline font-mono inline-flex items-center gap-1 cursor-pointer">
                        <Download className="w-3 h-3" />
                        <span>{txn.invoiceId}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Withdraw Modal */}
        <Modal
          isOpen={withdrawModalOpen}
          onClose={() => setWithdrawModalOpen(false)}
          title={withdrawSuccess ? 'Transfer Initiated!' : 'Withdraw to Linked Bank Account'}
          description={
            withdrawSuccess
              ? '$10,320.00 is on its way to your Chase Checking account.'
              : 'ACH Direct Deposit takes 1-2 business days with $0 fee.'
          }
        >
          <div className="space-y-4 text-xs">
            {withdrawSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Payout Processing
                </h4>
                <p className="text-slate-500 max-w-xs mx-auto">
                  Estimated arrival: Tomorrow by 5:00 PM. Transaction receipt sent to alex.rivera@stanford.edu.
                </p>
                <Button onClick={() => setWithdrawModalOpen(false)} className="mt-2">
                  Done
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-semibold block">Destination</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">Chase Bank •••• 4128</span>
                  </div>
                  <Badge variant="success">Verified ACH</Badge>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Withdrawal Amount (USD)
                  </label>
                  <input
                    type="text"
                    defaultValue="$10,320.00"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 font-semibold"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setWithdrawModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setWithdrawSuccess(true)}>
                    Confirm Transfer
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </DashboardShell>
  );
}
