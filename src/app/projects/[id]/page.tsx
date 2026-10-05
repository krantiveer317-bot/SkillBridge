'use client';

import React, { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { mockProjects } from '@/data/mockData';
import {
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Star,
  Eye,
  ArrowLeft,
  Terminal,
  Activity,
} from 'lucide-react';
import { Github } from '@/components/ui/Icons';

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const project = mockProjects.find((p) => p.id === resolvedParams.id) || mockProjects[0];

  return (
    <DashboardShell>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Back navigation */}
        <Link href="/projects" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </Link>

        {/* Header Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <VerificationBadge tier={project.verificationLevel} size="md" />
              <span className="text-xs text-slate-400">Created {project.createdAt}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {project.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer">
                <Button size="sm" variant="outline" leftIcon={<Github className="w-4 h-4" />}>
                  GitHub Repository
                </Button>
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer">
                <Button size="sm" leftIcon={<ExternalLink className="w-4 h-4" />}>
                  Live Production Demo
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Banner image */}
        {project.bannerImage && (
          <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
            <Image src={project.bannerImage} alt={project.title} fill className="object-cover" priority />
          </div>
        )}

        {/* Verification Proof Audit Box */}
        {project.proofDetails && (
          <div className="p-6 rounded-2xl border border-indigo-200/80 bg-indigo-50/40 dark:border-indigo-900/60 dark:bg-slate-900 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Official Proof-of-Work Verification Certificate
                </h3>
              </div>
              <Badge variant="success">Audit Passed</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Test Coverage</span>
                <span className="text-base font-bold text-slate-900 dark:text-slate-100">{project.proofDetails.testCoverage}</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Benchmark Score</span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">{project.proofDetails.performanceScore}</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Architecture Verified</span>
                <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">Yes (Zero Race Conditions)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
              <span className="font-semibold text-slate-900 dark:text-slate-100 block mb-1">
                Auditor & Senior Mentor Feedback:
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                "{project.proofDetails.reviewerNotes}"
              </p>
            </div>
          </div>
        )}

        {/* Project Description & Architecture */}
        <div className="p-6 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            System Architecture & Deep Dive
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {project.longDescription || project.description}
          </p>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Verified Skills Applied
            </span>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
