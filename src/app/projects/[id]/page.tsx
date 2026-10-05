'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/Button';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { apiFetch } from '@/lib/api';
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

interface ProjectSkill {
  skill: {
    id: string;
    name: string;
    category: string;
  };
}

interface ProjectAuthor {
  id: string;
  role: string;
  profile?: {
    avatar?: string | null;
    title?: string | null;
  } | null;
}

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
  bannerImage?: string | null;
  status?: string;
  verificationTier?: 'NONE' | 'PEER' | 'MENTOR' | 'INDUSTRY' | null;
  starsCount: number;
  viewsCount: number;
  teamSize?: number;
  createdAt: string;
  updatedAt: string;
  author?: ProjectAuthor | null;
  skills: ProjectSkill[];
}

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProject() {
      try {
        setLoading(true);
        setError(null);

        const result = await apiFetch<Project>(
          `/projects/${resolvedParams.id}`,
          { auth: false }
        );

        if (!cancelled) {
          setProject(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load project.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProject();

    return () => {
      cancelled = true;
    };
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-slate-500">
            Loading project...
          </p>
        </div>
      </DashboardShell>
    );
  }

  if (error || !project) {
    return (
      <DashboardShell>
        <div className="max-w-5xl mx-auto space-y-6">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Projects</span>
          </Link>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/20">
            <h2 className="text-base font-bold text-red-700 dark:text-red-400">
              Unable to load project
            </h2>
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error || 'Project not found.'}
            </p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  const verificationTier =
    project.verificationTier || 'Unverified';

  const createdDate = new Date(project.createdAt).toLocaleDateString(
    undefined,
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
  );

  const skills = project.skills?.map(
    (item) => item.skill.name
  ) ?? [];

  return (
    <DashboardShell>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Back navigation */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </Link>

        {/* Header Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <VerificationBadge
                tier={
                  verificationTier === 'PEER'
                    ? 'peer'
                    : verificationTier === 'MENTOR'
                      ? 'mentor'
                      : verificationTier === 'INDUSTRY'
                        ? 'industry'
                        : 'Unverified'
                }
                size="md"
              />

              <span className="text-xs text-slate-400">
                Created {createdDate}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {project.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Github className="w-4 h-4" />}
                >
                  GitHub Repository
                </Button>
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  size="sm"
                  leftIcon={
                    <ExternalLink className="w-4 h-4" />
                  }
                >
                  Live Production Demo
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Banner image */}
        {project.bannerImage && (
          <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
            <img
              src={project.bannerImage}
              alt={project.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Project description */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                About This Project
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 leading-7">
                {project.description}
              </p>
            </div>

            {project.longDescription && (
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Detailed Description
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-7 whitespace-pre-line">
                  {project.longDescription}
                </p>
              </div>
            )}
          </div>

          {/* Project statistics */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Project Stats
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                <div className="flex items-center gap-2 text-slate-500">
                  <Star className="w-4 h-4" />
                  <span className="text-xs">Stars</span>
                </div>
                <p className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">
                  {project.starsCount}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                <div className="flex items-center gap-2 text-slate-500">
                  <Eye className="w-4 h-4" />
                  <span className="text-xs">Views</span>
                </div>
                <p className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">
                  {project.viewsCount}
                </p>
              </div>
            </div>

            {project.teamSize && (
              <div className="text-xs text-slate-500">
                Team size:{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {project.teamSize}
                </span>
              </div>
            )}

            {project.status && (
              <div className="text-xs text-slate-500">
                Status:{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {project.status}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Verification information */}
        <div className="p-6 rounded-2xl border border-indigo-200/80 bg-indigo-50/40 dark:border-indigo-900/60 dark:bg-slate-900 shadow-xs space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-indigo-100 p-2 dark:bg-indigo-950/50">
              <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Verification Status
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                This project uses the verification status stored in
                the SkillBridge backend.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {project.verificationTier ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {verificationTier}
                </span>
              </>
            ) : (
              <>
                <Activity className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-500">
                  Not verified yet
                </span>
              </>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Technologies & Skills
            </h2>

            <div className="flex flex-wrap gap-2 mt-4">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Technical Proof */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />

            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Technical Proof
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Detailed automated test and reviewer metrics will
                appear here when supported by the backend verification
                record.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}






