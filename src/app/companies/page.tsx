import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { mockCompanies } from '@/data/mockData';
import { Sparkles, Building2, MapPin, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function CompaniesPage() {
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
            Discover tier-1 technology organizations that bypass traditional resumes and hire through SkillBridge proof-of-work.
          </p>
          <div className="mt-6">
            <Link href="/company/dashboard">
              <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
                Are you an employer? Post a Role
              </Button>
            </Link>
          </div>
        </div>

        {/* Company Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockCompanies.map((comp) => (
            <div
              key={comp.id}
              className="p-6 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs hover:border-indigo-200 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                      <Image src={comp.logo} alt={comp.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        {comp.name}
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {comp.location}
                      </p>
                    </div>
                  </div>

                  <Badge variant="info">
                    {comp.openRoles} Open Roles
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {comp.description}
                </p>

                <div className="space-y-2 mb-4">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Core Tech Stack
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {comp.techStack.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500">{comp.activeChallenges} active proof challenges</span>
                <Link href="/opportunities">
                  <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    View Jobs
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
