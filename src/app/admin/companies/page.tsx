'use client';

import React from 'react';
import Image from 'next/image';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockCompanies } from '@/data/mockData';
import { Building2, CheckCircle2 } from 'lucide-react';

export default function AdminCompaniesPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-purple-600" />
            <span>Hiring Partner Organizations</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Vet and manage technology companies hiring through SkillBridge proof-of-work.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Vetted Partner Companies ({mockCompanies.length})
            </h3>
            <span className="text-xs text-slate-400">All employers verified via corporate domain & D&B</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {mockCompanies.map((c) => (
              <div key={c.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                    <Image src={c.logo} alt={c.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      {c.name}
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </h4>
                    <p className="text-xs text-slate-500">{c.category} • {c.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{c.openRoles} Active Roles</span>
                  <Badge variant="success">Verified Partner</Badge>
                  <Button size="sm" variant="outline">Settings</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
