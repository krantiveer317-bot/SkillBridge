'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { mockCompanies } from '@/data/mockData';
import { Building2, Save, CheckCircle2 } from 'lucide-react';

export default function CompanyProfilePage() {
  const company = mockCompanies[0];
  const [saved, setSaved] = useState(false);
  const [desc, setDesc] = useState(company.description);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <DashboardShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-sky-600" />
            <span>Company Brand & Profile</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Display your culture, tech stack, and hiring standards to verified student builders.
          </p>
        </div>

        <form onSubmit={handleSave} className="p-6 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 space-y-5 shadow-xs">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="relative h-16 w-16 rounded-2xl overflow-hidden border border-slate-200 shrink-0">
              <Image src={company.logo} alt={company.name} fill className="object-cover" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{company.name}</h3>
              <p className="text-xs text-slate-500">{company.category} • {company.location}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company Name"
              defaultValue={company.name}
            />
            <Input
              label="Headquarters / Remote Policy"
              defaultValue={company.location}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              About the Engineering Team & Product
            </label>
            <textarea
              rows={4}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Production Tech Stack (Comma-separated)
            </label>
            <input
              type="text"
              defaultValue={company.techStack.join(', ')}
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {saved && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Company profile updated</span>
              </span>
            )}
            <div className="ml-auto">
              <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>
                Save Profile
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
