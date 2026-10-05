'use client';

import Link from 'next/link';
import {
  Award,
  FolderGit2,
  FileCheck2,
  DollarSign,
  PlusCircle,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatsCard } from '@/components/ui/StatsCard';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

export default function StudentDashboardPage() {
  const { user } = useAuth();

  // Use the real profile name first.
  // Do NOT use the email as the primary name.
  const userName =
    user?.profile?.name ||
    user?.name ||
    'User';

  const firstName =
    userName.trim().split(' ')[0] || 'User';

  return (
    <DashboardShell>
      <div className="space-y-8">

        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-white to-white dark:border-slate-800 dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-900">

          <div className="flex items-center gap-4">

            {/* User initials */}
            <div className="flex items-center justify-center h-14 w-14 rounded-2xl border-2 border-indigo-500/30 bg-indigo-600 text-white text-lg font-bold shrink-0">
              {firstName.charAt(0).toUpperCase()}
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                Welcome back, {userName}
              </h1>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your SkillBridge dashboard is ready. Start building,
                verifying, and showcasing your skills.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">

            <Link href="/projects/new">
              <Button
                size="sm"
                leftIcon={
                  <PlusCircle className="w-3.5 h-3.5" />
                }
              >
                Submit Project
              </Button>
            </Link>

            <Link href="/skill-passport">
              <Button
                size="sm"
                variant="outline"
                leftIcon={
                  <Award className="w-3.5 h-3.5" />
                }
              >
                Skill Passport
              </Button>
            </Link>

          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <StatsCard
            label="Verified Skills"
            value="0 Skills"
            change="Get started"
            isPositive={false}
            icon={
              <Award className="w-4 h-4 text-indigo-600" />
            }
            description="No skills verified yet"
          />

          <StatsCard
            label="Completed Projects"
            value="0 Projects"
            change="Get started"
            isPositive={false}
            icon={
              <FolderGit2 className="w-4 h-4 text-emerald-600" />
            }
            description="Submit your first project"
          />

          <StatsCard
            label="Applications"
            value="0 Active"
            change="No applications"
            isPositive={false}
            icon={
              <FileCheck2 className="w-4 h-4 text-sky-600" />
            }
            description="No active applications"
          />

          <StatsCard
            label="Total Earnings"
            value="$0"
            change="No earnings"
            isPositive={false}
            icon={
              <DollarSign className="w-4 h-4 text-purple-600" />
            }
            description="No earnings yet"
          />

        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Applications */}
            <div>

              <div className="flex items-center justify-between mb-4">

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Active Opportunity Pipeline
                  </h3>

                  <p className="text-xs text-slate-500">
                    Your active applications will appear here.
                  </p>
                </div>

                <Link href="/applications">
                  <Button
                    variant="ghost"
                    size="sm"
                    rightIcon={
                      <ArrowRight className="w-3.5 h-3.5" />
                    }
                  >
                    View All
                  </Button>
                </Link>

              </div>

              <div className="p-8 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center bg-white dark:bg-slate-900">

                <FileCheck2 className="w-8 h-8 mx-auto text-slate-400 mb-3" />

                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  No active applications
                </h4>

                <p className="text-xs text-slate-500 mt-1">
                  Your applications will appear here after you apply
                  for opportunities.
                </p>

                <Link href="/opportunities" className="inline-block mt-4">
                  <Button
                    size="sm"
                    rightIcon={
                      <ArrowRight className="w-3.5 h-3.5" />
                    }
                  >
                    Explore Opportunities
                  </Button>
                </Link>

              </div>
            </div>

            {/* Recommended Opportunities */}
            <div className="pt-4">

              <div className="flex items-center justify-between mb-4">

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    Recommended for You
                  </h3>

                  <p className="text-xs text-slate-500">
                    Recommendations will appear based on your skills
                    and profile.
                  </p>
                </div>

                <Link href="/opportunities">
                  <Button
                    variant="ghost"
                    size="sm"
                    rightIcon={
                      <ArrowRight className="w-3.5 h-3.5" />
                    }
                  >
                    Explore All
                  </Button>
                </Link>

              </div>

              <div className="p-8 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center bg-white dark:bg-slate-900">

                <Sparkles className="w-8 h-8 mx-auto text-slate-400 mb-3" />

                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Build your Skill Passport
                </h4>

                <p className="text-xs text-slate-500 mt-1">
                  Add skills and projects to receive personalized
                  opportunities.
                </p>

                <Link href="/skills" className="inline-block mt-4">
                  <Button
                    size="sm"
                    rightIcon={
                      <ArrowRight className="w-3.5 h-3.5" />
                    }
                  >
                    Add Skills
                  </Button>
                </Link>

              </div>

            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Projects */}
            <div>

              <div className="flex items-center justify-between mb-4">

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Featured Proof Project
                </h3>

                <Link
                  href="/projects"
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  All Projects
                </Link>

              </div>

              <div className="p-8 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center bg-white dark:bg-slate-900">

                <FolderGit2 className="w-8 h-8 mx-auto text-slate-400 mb-3" />

                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  No projects yet
                </h4>

                <p className="text-xs text-slate-500 mt-1">
                  Add your first project to showcase your skills.
                </p>

                <Link href="/projects/new" className="inline-block mt-4">
                  <Button
                    size="sm"
                    leftIcon={
                      <PlusCircle className="w-3.5 h-3.5" />
                    }
                  >
                    Add Project
                  </Button>
                </Link>

              </div>

            </div>

            {/* Verification */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 space-y-4">

              <div className="flex items-center justify-between">

                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Verification Status
                </span>

                <span className="text-xs font-bold text-slate-500">
                  Not started
                </span>

              </div>

              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full rounded-full w-0" />
              </div>

              <div className="flex justify-between text-xs text-slate-500">
                <span>Trust Score: 0/100</span>
                <span>Build your profile</span>
              </div>

              <Link
                href="/verification"
                className="block pt-2"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  leftIcon={
                    <ShieldCheck className="w-3.5 h-3.5" />
                  }
                >
                  Start Verification
                </Button>
              </Link>

            </div>

          </div>

        </div>

      </div>
    </DashboardShell>
  );
} 