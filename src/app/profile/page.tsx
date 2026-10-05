'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SkillBadge } from '@/components/ui/SkillBadge';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { mockCurrentUser, mockSkills, mockProjects } from '@/data/mockData';
import {
  MapPin,
  Globe,
  Share2,
  Edit,
  Award,
  ShieldCheck,
  CheckCircle2,
  Download,
} from 'lucide-react';
import { Github, Linkedin } from '@/components/ui/Icons';

export default function StudentProfilePage() {
  const userProjects = mockProjects.filter((p) => p.author.id === mockCurrentUser.id);

  return (
    <DashboardShell>
      <div className="space-y-8">
        {/* Profile Header Banner */}
        <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-xs">
          <div className="h-32 bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-900 relative">
            <div className="absolute top-4 right-4 flex gap-2">
              <Link href="/skill-passport">
                <Button size="sm" variant="secondary" leftIcon={<Award className="w-3.5 h-3.5" />}>
                  Skill Passport
                </Button>
              </Link>
            </div>
          </div>

          <div className="px-6 pb-6 pt-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 mb-4">
              <div className="relative h-24 w-24 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-900 shadow-md">
                <Image src={mockCurrentUser.avatar} alt={mockCurrentUser.name} fill className="object-cover" />
              </div>

              <div className="flex items-center gap-2">
                <Link href="/settings">
                  <Button size="sm" variant="outline" leftIcon={<Edit className="w-3.5 h-3.5" />}>
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {mockCurrentUser.name}
                </h1>
                <VerificationBadge tier="Level 3: Industry Audited" />
              </div>

              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                {mockCurrentUser.title}
              </p>

              <p className="text-xs text-slate-500 max-w-2xl mt-2 leading-relaxed">
                {mockCurrentUser.bio}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {mockCurrentUser.location}
                </span>
                <a
                  href={mockCurrentUser.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  github.com/alexrivera-dev
                </a>
                <a
                  href={mockCurrentUser.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  LinkedIn
                </a>
                <a
                  href={mockCurrentUser.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  alexrivera.dev
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Verified Skills Matrix */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Verified Skill Credentials
              </h3>
              <p className="text-xs text-slate-500">Skills validated by peer audits and staff engineers</p>
            </div>
            <Link href="/verification">
              <Button size="sm" variant="outline">
                Submit Skill for Audit
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {mockSkills.slice(0, 6).map((s) => (
              <div
                key={s.id}
                className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <SkillBadge name={s.name} level={s.level} isVerified={s.isVerified} size="sm" />
                </div>
                {s.verifiedBy && (
                  <p className="text-[11px] text-slate-400">
                    Audited by: <span className="text-slate-600 dark:text-slate-300 font-medium">{s.verifiedBy}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Completed Projects Showcase */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Verified Proof Repositories
              </h3>
              <p className="text-xs text-slate-500">Live projects with verified test suites and architecture reviews</p>
            </div>
            <Link href="/projects/new">
              <Button size="sm">
                Add Project
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
