'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { OpportunityCard } from '@/components/ui/OpportunityCard';
import { mockOpportunities } from '@/data/mockData';
import { GraduationCap, Search } from 'lucide-react';

export default function StudentInternshipsPage() {
  const [search, setSearch] = useState('');

  const internships = mockOpportunities.filter(
    (o) =>
      o.type === 'internship' &&
      (o.title.toLowerCase().includes(search.toLowerCase()) ||
        o.requiredSkills.some((s) => s.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
            <span>Paid Engineering Internships</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            High-compensation university & developer internships with direct engineering mentorship.
          </p>
        </div>

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search internships (e.g. Supabase, Scale AI)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
