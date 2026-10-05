'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { apiFetch } from '@/lib/api';
import {
  FolderGit2,
  ExternalLink,
  Eye,
  Star,
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  githubUrl?: string | null;
  liveUrl?: string | null;
  bannerImage?: string | null;
  status: string;
  verificationTier: string;
  starsCount: number;
  viewsCount: number;
  teamSize?: number | null;
  createdAt: string;
  author: {
    id: string;
    role: string;
    profile?: {
      avatar?: string | null;
      title?: string | null;
    } | null;
  };
  skills: {
    skill: {
      id: string;
      name: string;
      category: string;
    };
  }[];
}

interface ProjectsResponse {
  projects: Project[];
  meta?: unknown;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFetch<ProjectsResponse>(
          '/projects?page=1&limit=100&status=PUBLISHED',
          { auth: false }
        );

        if (!cancelled) {
          setProjects(response.projects ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load projects.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  function formatTier(tier: string) {
    return tier
      .toLowerCase()
      .replace(/^./, (char) => char.toUpperCase());
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-purple-600" />
            <span>Project Moderation Queue</span>
          </h1>

          <p className="text-xs text-slate-500 mt-1">
            Review published projects and inspect their real repository,
            verification and engagement data.
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
              Published Projects ({projects.length})
            </h3>

            <span className="text-xs text-slate-400">
              Real published project records
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No published projects found.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {projects.map((project) => {
                const authorTitle =
                  project.author.profile?.title ||
                  project.author.role ||
                  'SkillBridge Member';

                return (
                  <div
                    key={project.id}
                    className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {project.title}
                        </h4>

                        <Badge variant="success">
                          {formatTier(project.verificationTier)}
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 max-w-3xl">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-400">
                        <span>
                          Author: {authorTitle}
                        </span>

                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {project.viewsCount}
                        </span>

                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5" />
                          {project.starsCount}
                        </span>

                        <span>
                          Created:{' '}
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {project.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {project.skills.slice(0, 6).map(({ skill }) => (
                            <span
                              key={skill.id}
                              className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                            >
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            leftIcon={
                              <ExternalLink className="w-3.5 h-3.5" />
                            }
                          >
                            Repo
                          </Button>
                        </a>
                      )}

                      <Link href={`/projects/${project.id}`}>
                        <Button size="sm">
                          Audit Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
