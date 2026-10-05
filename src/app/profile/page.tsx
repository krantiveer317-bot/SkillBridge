'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Globe,
  Edit,
  Award,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/Button';
import { SkillBadge } from '@/components/ui/SkillBadge';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { ProjectCard, ProjectCardProject } from '@/components/ui/ProjectCard';
import { Github, Linkedin } from '@/components/ui/Icons';
import { apiFetch } from '@/lib/api';

interface UserSkill {
  id: string;
  isVerified: boolean;
  skill: {
    id: string;
    name: string;
    category: string;
  };
}

interface UserProfile {
  name?: string | null;
  avatar?: string | null;
  bio?: string | null;
  title?: string | null;
  location?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  websiteUrl?: string | null;
}

interface CurrentUser {
  id: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  profile?: UserProfile | null;
  skills: UserSkill[];
  _count: {
    projects: number;
    applications: number;
  };
}

interface ProjectsResponse {
  projects: ProjectCardProject[];
  meta?: unknown;
}

export default function StudentProfilePage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [projects, setProjects] = useState<ProjectCardProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);

        const [userResponse, projectsResponse] = await Promise.all([
          apiFetch<CurrentUser>('/users/me'),
          apiFetch<ProjectsResponse>('/projects/my'),
        ]);

        if (cancelled) return;

        setUser(userResponse);
        setProjects(projectsResponse.projects ?? []);
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load your profile.'
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-sm text-slate-500">
            Loading your profile...
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (error || !user) {
    return (
      <DashboardShell>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/20">
          <h2 className="text-base font-bold text-red-700 dark:text-red-400">
            Unable to load profile
          </h2>
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {error || 'Your profile could not be loaded.'}
          </p>
        </div>
      </DashboardShell>
    );
  }

  const profile = user.profile;

  const displayName =
    profile?.name?.trim() ||
    user.email.split('@')[0] ||
    'User';

  const avatar = profile?.avatar || null;
  const title = profile?.title || 'SkillBridge Member';
  const bio = profile?.bio || 'No bio added yet.';
  const location = profile?.location || 'Location not specified';

  const githubUrl = profile?.githubUrl || '';
  const linkedinUrl = profile?.linkedinUrl || '';
  const portfolioUrl =
    profile?.portfolioUrl ||
    profile?.websiteUrl ||
    '';

  return (
    <DashboardShell>
      <div className="space-y-8">
        {/* Profile Header Banner */}
        <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-xs">
          <div className="h-32 bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-900 relative">
            <div className="absolute top-4 right-4 flex gap-2">
              <Link href="/skill-passport">
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={<Award className="w-3.5 h-3.5" />}
                >
                  Skill Passport
                </Button>
              </Link>
            </div>
          </div>

          <div className="px-6 pb-6 pt-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 mb-4">
              <div className="relative h-24 w-24 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-900 shadow-md bg-slate-100 dark:bg-slate-800">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-indigo-600">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Link href="/settings">
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<Edit className="w-3.5 h-3.5" />}
                  >
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {displayName}
                </h1>

                {user.isVerified && (
                  <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
                    Verified
                  </span>
                )}
              </div>

              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                {title}
              </p>

              <p className="text-xs text-slate-500 max-w-2xl mt-2 leading-relaxed">
                {bio}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {location}
                </span>

                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    GitHub
                  </a>
                )}

                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    LinkedIn
                  </a>
                )}

                {portfolioUrl && (
                  <a
                    href={portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Portfolio
                  </a>
                )}
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
              <p className="text-xs text-slate-500">
                Skills validated by peer audits and staff engineers
              </p>
            </div>

            <Link href="/verification">
              <Button size="sm" variant="outline">
                Submit Skill for Audit
              </Button>
            </Link>
          </div>

          {user.skills.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
              <p className="text-sm text-slate-500">
                No skills have been added to your profile yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {user.skills.slice(0, 6).map((userSkill) => (
                <div
                  key={userSkill.id}
                  className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <SkillBadge
                      name={userSkill.skill.name}
                      level={undefined}
                      isVerified={userSkill.isVerified}
                      size="sm"
                    />
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Category:{' '}
                    <span className="text-slate-600 dark:text-slate-300 font-medium">
                      {userSkill.skill.category}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Projects Showcase */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Verified Proof Repositories
              </h3>
              <p className="text-xs text-slate-500">
                Live projects with verified test suites and architecture reviews
              </p>
            </div>

            <Link href="/projects/new">
              <Button size="sm">
                Add Project
              </Button>
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
              <p className="text-sm text-slate-500">
                You have not created any projects yet.
              </p>

              <Link href="/projects/new" className="mt-4 inline-block">
                <Button size="sm">
                  Create Your First Project
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}


