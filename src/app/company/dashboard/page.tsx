'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatsCard } from '@/components/ui/StatsCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { mockCompanies, mockOpportunities, mockFreelancers } from '@/data/mockData';
import {
  Building2,
  Briefcase,
  Users,
  PlusCircle,
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function CompanyDashboardPage() {
  const company = mockCompanies[0]; // Vercel

  return (
    <DashboardShell>
      <div className="space-y-8">
        {/* Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50/80 via-white to-white dark:border-slate-800 dark:from-sky-950/30 dark:via-slate-900 dark:to-slate-900">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 rounded-2xl overflow-hidden border-2 border-sky-500/30 shrink-0">
              <Image src={company.logo} alt={company.name} fill className="object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {company.name} Talent Portal
                </h1>
                <Badge variant="info">Verified Employer Partner</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Filtering applicants strictly by verified proof-of-work (Next.js, Edge, Go).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/company/jobs/new">
              <Button size="sm" leftIcon={<PlusCircle className="w-3.5 h-3.5" />}>
                Post New Role
              </Button>
            </Link>
            <Link href="/company/candidates">
              <Button size="sm" variant="outline" leftIcon={<Search className="w-3.5 h-3.5" />}>
                Find Candidates
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Active Roles"
            value="8 Open"
            change="3 departments"
            isPositive={true}
            icon={<Briefcase className="w-4 h-4 text-sky-600" />}
            description="Core infra, edge, UI"
          />
          <StatsCard
            label="Proof-Matched Candidates"
            value="42 Verified"
            change="+12 this week"
            isPositive={true}
            icon={<Users className="w-4 h-4 text-indigo-600" />}
            description="Minimum L2 verified"
          />
          <StatsCard
            label="Interview Velocity"
            value="4.2 Days"
            change="68% faster"
            isPositive={true}
            icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
            description="Avg time to offer"
          />
          <StatsCard
            label="Hires Completed"
            value="6 Engineers"
            change="100% retention"
            isPositive={true}
            icon={<CheckCircle2 className="w-4 h-4 text-purple-600" />}
            description="Past 6 months"
          />
        </div>

        {/* Active Job Postings & Matched Candidates */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 cols: Active listings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Active Engineering Openings
                </h3>
                <p className="text-xs text-slate-500">Live roles receiving verified candidate submissions</p>
              </div>
              <Link href="/company/jobs">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Manage All
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {mockOpportunities.slice(0, 3).map((opp) => (
                <div
                  key={opp.id}
                  className="p-5 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {opp.title}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {opp.compensation} • {opp.locationType} • Posted {opp.postedAt}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {opp.requiredSkills.map((s) => (
                        <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {opp.applicantCount} applicants
                    </span>
                    <Link href="/company/candidates">
                      <Button size="sm" variant="outline">
                        View Pipeline
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 1 col: Top Matched Candidates */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Top Matched Builders
              </h3>
              <Link href="/company/candidates" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                View All (42)
              </Link>
            </div>

            <div className="space-y-3">
              {mockFreelancers.slice(0, 3).map((candidate) => (
                <div
                  key={candidate.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 space-y-2 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden border border-slate-200 shrink-0">
                      <Image src={candidate.avatar} alt={candidate.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {candidate.name}
                      </div>
                      <p className="text-slate-400 text-[11px] truncate">{candidate.title}</p>
                    </div>
                    <VerificationBadge tier="Level 3: Industry Audited" size="sm" showLabel={false} />
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-emerald-600 font-semibold">96% Match Score</span>
                    <Link href="/company/candidates">
                      <Button size="sm" variant="ghost">Audit Code</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
