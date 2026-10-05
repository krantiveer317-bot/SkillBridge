'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { apiFetch } from '@/lib/api';
import {
  Sparkles,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Building2,
  Users,
  Globe,
} from 'lucide-react';

type ApiCompany = {
  id: string;
  name: string;
  logoUrl: string | null;
  website: string | null;
  description: string | null;
  industry: string | null;
  size: string | null;
  location: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

type CompaniesResponse = {
  companies: ApiCompany[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<ApiCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setLoading(true);
        setError('');

        const result = await apiFetch<CompaniesResponse>(
          '/company?page=1&limit=100',
          { auth: false }
        );

        setCompanies(result.companies ?? []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load companies.'
        );
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verified Hiring Network</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Hiring Partners & Engineering Teams
          </h1>

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Discover technology organizations that hire through
            SkillBridge proof-of-work.
          </p>

          <div className="mt-6">
            <Link href="/company/dashboard">
              <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
                Are you an employer? Post a Role
              </Button>
            </Link>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
              Loading companies...
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="max-w-2xl mx-auto rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-950/20">
            <Building2 className="mx-auto mb-3 h-8 w-8 text-red-500" />
            <h2 className="font-semibold text-red-700 dark:text-red-400">
              Unable to load companies
            </h2>
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && companies.length === 0 && (
          <div className="max-w-2xl mx-auto rounded-xl border border-slate-200 bg-slate-50 p-10 text-center dark:border-slate-800 dark:bg-slate-900">
            <Building2 className="mx-auto mb-3 h-10 w-10 text-slate-400" />
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">
              No companies available
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Companies will appear here once they create their SkillBridge
              profiles.
            </p>
          </div>
        )}

        {!loading && !error && companies.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {companies.map((company) => (
              <div
                key={company.id}
                className="p-6 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs hover:border-indigo-200 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        {company.logoUrl ? (
                          <Image
                            src={company.logoUrl}
                            alt={company.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Building2 className="w-6 h-6 text-slate-400" />
                        )}
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          {company.name}

                          {company.isVerified && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          )}
                        </h3>

                        {company.location && (
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {company.location}
                          </p>
                        )}
                      </div>
                    </div>

                    {company.isVerified && (
                      <Badge variant="info">
                        Verified
                      </Badge>
                    )}
                  </div>

                  {company.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      {company.description}
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {company.industry && (
                      <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                          Industry
                        </span>
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {company.industry}
                        </span>
                      </div>
                    )}

                    {company.size && (
                      <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                          Company Size
                        </span>
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {company.size}
                        </span>
                      </div>
                    )}
                  </div>

                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Company Website
                    </a>
                  )}
                </div>

                <div className="pt-4 mt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Explore opportunities
                  </span>

                  <Link href="/opportunities">
                    <Button
                      size="sm"
                      variant="outline"
                      rightIcon={
                        <ArrowRight className="w-3.5 h-3.5" />
                      }
                    >
                      View Jobs
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
