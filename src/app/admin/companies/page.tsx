'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { apiFetch } from '@/lib/api';
import { Building2, CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  logoUrl?: string | null;
  website?: string | null;
  description?: string | null;
  industry?: string | null;
  size?: string | null;
  location?: string | null;
  isVerified: boolean;
  _count?: {
    opportunities: number;
  };
}

interface CompaniesResponse {
  companies: Company[];
  meta?: unknown;
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadCompanies() {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch<CompaniesResponse>(
        '/company?page=1&limit=100'
      );

      setCompanies(response.companies ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load companies.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCompanies();
  }, []);

  async function toggleVerification(company: Company) {
    try {
      setUpdatingId(company.id);

      await apiFetch(`/admin/companies/${company.id}/verify`, {
        method: 'PATCH',
      });

      await loadCompanies();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update company verification.'
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-purple-600" />
            <span>Hiring Partner Organizations</span>
          </h1>

          <p className="text-xs text-slate-500 mt-1">
            Review and manage companies registered on SkillBridge.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Registered Companies ({companies.length})
            </h3>

            <span className="text-xs text-slate-400">
              Verification status comes from the database
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Loading companies...
            </div>
          ) : companies.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No companies found.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                      {company.logoUrl ? (
                        <Image
                          src={company.logoUrl}
                          alt={company.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-slate-400" />
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        {company.name}

                        {company.isVerified && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        )}
                      </h4>

                      <p className="text-xs text-slate-500">
                        {company.industry || 'Industry not specified'}
                        {' • '}
                        {company.location || 'Location not specified'}
                      </p>

                      <p className="text-[11px] text-slate-400 mt-1">
                        {company._count?.opportunities ?? 0} opportunities
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {company.isVerified ? (
                      <Badge variant="success">
                        Verified Partner
                      </Badge>
                    ) : (
                      <Badge variant="warning">
                        Not Verified
                      </Badge>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={updatingId === company.id}
                      onClick={() => toggleVerification(company)}
                      leftIcon={
                        company.isVerified ? (
                          <XCircle className="w-3.5 h-3.5" />
                        ) : (
                          <ShieldCheck className="w-3.5 h-3.5" />
                        )
                      }
                    >
                      {updatingId === company.id
                        ? 'Updating...'
                        : company.isVerified
                          ? 'Unverify'
                          : 'Verify'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
