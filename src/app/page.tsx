'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  CheckCircle2,
  Code2,
  FolderGit2,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

type Project = {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
};

type Opportunity = {
  id: string;
  title: string;
  type?: string;
  category?: string | null;
  company?: {
    name?: string | null;
  } | null;
};

type Mentor = {
  id: string;
  bio?: string | null;
  hourlyRate?: number | null;
  user?: {
    email?: string | null;
    profile?: {
      firstName?: string | null;
      lastName?: string | null;
    } | null;
  } | null;
};

type ListResponse<T> = {
  projects?: T[];
  opportunities?: T[];
  mentors?: T[];
};

export default function LandingPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [projectResult, opportunityResult, mentorResult] =
        await Promise.allSettled([
          apiFetch<ListResponse<Project>>('/projects?limit=6', {
            auth: false,
          }),
          apiFetch<ListResponse<Opportunity>>('/opportunity?limit=6', {
            auth: false,
          }),
          apiFetch<ListResponse<Mentor>>('/mentor?limit=6', {
            auth: false,
          }),
        ]);

      if (projectResult.status === 'fulfilled') {
        setProjects(projectResult.value.projects || []);
      }

      if (opportunityResult.status === 'fulfilled') {
        setOpportunities(opportunityResult.value.opportunities || []);
      }

      if (mentorResult.status === 'fulfilled') {
        setMentors(mentorResult.value.mentors || []);
      }
    };

    void loadData();
  }, []);

  const mentorName = (mentor: Mentor) => {
    const first = mentor.user?.profile?.firstName || '';
    const last = mentor.user?.profile?.lastName || '';
    return `${first} ${last}`.trim() || 'SkillBridge Mentor';
  };

  return (
    <>
      <Navbar />

      <main className="bg-white dark:bg-slate-950">
        <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
            <div className="max-w-4xl">
              <Badge variant="purple" dot>
                Proof-of-work professional network
              </Badge>

              <h1 className="mt-6 text-5xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-6xl lg:text-7xl">
                Build skills.
                <br />
                <span className="text-indigo-600">Prove them.</span>
                <br />
                Get hired.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                SkillBridge connects verified project work with internships,
                jobs, mentoring, freelance opportunities, and skill exchange.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/register">
                  <Button size="lg">
                    Start Building
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/projects">
                  <Button size="lg" variant="outline">
                    Explore Projects
                  </Button>
                </Link>
              </div>

              <div className="mt-10 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <FolderGit2 className="h-5 w-5 text-indigo-600" />
                  <p className="mt-2 text-xs font-semibold text-slate-900 dark:text-slate-100">
                    Real Projects
                  </p>
                </div>
                <div>
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <p className="mt-2 text-xs font-semibold text-slate-900 dark:text-slate-100">
                    Verified Skills
                  </p>
                </div>
                <div>
                  <Briefcase className="h-5 w-5 text-purple-600" />
                  <p className="mt-2 text-xs font-semibold text-slate-900 dark:text-slate-100">
                    Real Opportunities
                  </p>
                </div>
                <div>
                  <Users className="h-5 w-5 text-orange-600" />
                  <p className="mt-2 text-xs font-semibold text-slate-900 dark:text-slate-100">
                    Mentorship
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Code2,
                title: 'Build',
                text: 'Create projects that demonstrate practical engineering ability.',
              },
              {
                icon: ShieldCheck,
                title: 'Verify',
                text: 'Turn project evidence into trusted skill credentials.',
              },
              {
                icon: Award,
                title: 'Work',
                text: 'Use verified proof to discover jobs, internships and gigs.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
              >
                <item.icon className="h-6 w-6 text-indigo-600" />
                <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Live platform data
                </p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                  Recent projects
                </h2>
              </div>

              <Link
                href="/projects"
                className="hidden items-center gap-1 text-sm font-semibold text-indigo-600 sm:flex"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {projects.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
                <Sparkles className="mx-auto h-7 w-7 text-slate-400" />
                <p className="mt-3 text-sm text-slate-500">
                  No public projects are available yet.
                </p>
              </div>
            ) : (
              <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.slice(0, 6).map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                  >
                    <FolderGit2 className="h-5 w-5 text-indigo-600" />
                    <h3 className="mt-4 font-bold text-slate-900 dark:text-slate-100">
                      {project.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-500">
                      {project.description || 'Verified project on SkillBridge.'}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
                Opportunities
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                Find your next opportunity
              </h2>

              <div className="mt-6 space-y-3">
                {opportunities.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700">
                    No public opportunities are available yet.
                  </p>
                ) : (
                  opportunities.slice(0, 5).map((opportunity) => (
                    <Link
                      key={opportunity.id}
                      href="/opportunities"
                      className="block rounded-xl border border-slate-200 p-4 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {opportunity.title}
                          </h3>
                          <p className="mt-1 text-xs text-slate-500">
                            {opportunity.company?.name || 'SkillBridge'}
                          </p>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Mentorship
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                Learn from verified mentors
              </h2>

              <div className="mt-6 space-y-3">
                {mentors.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700">
                    No public mentors are available yet.
                  </p>
                ) : (
                  mentors.slice(0, 5).map((mentor) => (
                    <Link
                      key={mentor.id}
                      href="/mentors"
                      className="flex items-center justify-between rounded-xl border border-slate-200 p-4 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                    >
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {mentorName(mentor)}
                        </h3>
                        <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                          {mentor.bio || 'Verified SkillBridge mentor'}
                        </p>
                      </div>

                      <span className="text-xs font-semibold text-indigo-600">
                        {mentor.hourlyRate
                          ? `?${mentor.hourlyRate}/hr`
                          : 'View profile'}
                      </span>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-8">
            <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100">
              Your skills should speak for themselves.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500">
              Build real work, verify your capabilities, and connect with
              opportunities through SkillBridge.
            </p>

            <div className="mt-7">
              <Link href="/register">
                <Button size="lg">
                  Join SkillBridge
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
