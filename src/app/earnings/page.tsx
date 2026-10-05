'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatsCard } from '@/components/ui/StatsCard';
import { Badge } from '@/components/ui/Badge';
import { DollarSign, CreditCard, TrendingUp } from 'lucide-react';
import { apiFetch } from '@/lib/api';

type AnyRecord = Record<string, any>;

export default function EarningsPage() {
  const [transactions, setTransactions] = useState<AnyRecord[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError('');

        const result = await apiFetch<any>('/payments/my?limit=100');

        if (!mounted) return;

        const rows = Array.isArray(result)
          ? result
          : result?.transactions ?? result?.data ?? [];

        setTransactions(Array.isArray(rows) ? rows : []);
        setTotalEarnings(Number(result?.totalEarnings ?? 0));
      } catch (err: any) {
        if (mounted) {
          setError(
            err?.message ||
              'Unable to load earnings and payment records.'
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const validTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const status = String(
        transaction?.status ?? ''
      ).toUpperCase();

      return ![
        'FAILED',
        'CANCELLED',
        'CANCELED',
        'REFUNDED',
      ].includes(status);
    });
  }, [transactions]);

  const calculatedEarnings = useMemo(() => {
    return validTransactions.reduce((sum, transaction) => {
      return (
        sum +
        Number(
          transaction?.amount ??
            transaction?.total ??
            transaction?.netAmount ??
            0
        )
      );
    }, 0);
  }, [validTransactions]);

  const earnings =
    totalEarnings > 0
      ? totalEarnings
      : calculatedEarnings;

  const formatDate = (value: any) => {
    if (!value) return '—';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleDateString();
  };

  const getAmount = (transaction: AnyRecord) =>
    Number(
      transaction?.amount ??
        transaction?.total ??
        transaction?.netAmount ??
        0
    );

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-slate-500">
            Loading earnings...
          </p>
        </div>
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell>
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-8">

        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-600" />
            Earnings
          </h1>

          <p className="text-xs text-slate-500 mt-1">
            Your earnings and payment transactions from the platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <StatsCard
            label="Total Earnings"
            value={`$${earnings.toFixed(2)}`}
            change="Backend reported"
            isPositive={earnings > 0}
            icon={
              <DollarSign className="w-4 h-4 text-emerald-600" />
            }
          />

          <StatsCard
            label="Transactions"
            value={`${transactions.length}`}
            change="Payment records"
            isPositive={true}
            icon={
              <CreditCard className="w-4 h-4 text-indigo-600" />
            }
          />

          <StatsCard
            label="Recorded Volume"
            value={`$${calculatedEarnings.toFixed(2)}`}
            change="Calculated from transactions"
            isPositive={calculatedEarnings > 0}
            icon={
              <TrendingUp className="w-4 h-4 text-purple-600" />
            }
          />

        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-xs">

          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Payment History
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Transactions returned by your authenticated account.
            </p>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-left text-xs">

              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-4">Transaction</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">

                {transactions.map((transaction) => {
                  const status =
                    transaction?.status || 'Unknown';

                  const amount = getAmount(transaction);

                  return (
                    <tr
                      key={transaction?.id ?? `${transaction?.createdAt}-${amount}`}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                    >

                      <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">
                        {transaction?.id || '—'}
                      </td>

                      <td className="p-4 text-slate-500">
                        {transaction?.type ||
                          transaction?.description ||
                          transaction?.paymentType ||
                          'Payment'}
                      </td>

                      <td className="p-4 text-slate-500">
                        {formatDate(
                          transaction?.createdAt ??
                            transaction?.date ??
                            transaction?.paidAt
                        )}
                      </td>

                      <td className="p-4 font-bold text-emerald-600">
                        ${amount.toFixed(2)}
                      </td>

                      <td className="p-4">
                        <Badge
                          variant={
                            String(status).toUpperCase() ===
                            'COMPLETED'
                              ? 'success'
                              : 'warning'
                          }
                        >
                          {status}
                        </Badge>
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

          {transactions.length === 0 && (
            <div className="p-10 text-center text-sm text-slate-500">
              No payment transactions found.
            </div>
          )}

        </div>

      </div>
    </DashboardShell>
  );
}
