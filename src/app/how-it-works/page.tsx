'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Code2,
  Terminal,
  Search,
  ShieldCheck,
  Briefcase,
  Users,
  Building2,
  GraduationCap,
} from 'lucide-react';

export default function HowItWorksPage() {
  const [activeRoleTab, setActiveRoleTab] = useState<'student' | 'mentor' | 'company'>('student');

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="py-20 border-b border-slate-100 dark:border-slate-800 text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step-by-Step Architecture</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              How SkillBridge Works
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Explore how builders, mentors, and technology companies interact through our verified proof-of-work pipeline.
            </p>

            {/* Persona Switcher Tabs */}
            <div className="mt-8 inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setActiveRoleTab('student')}
                className={`flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeRoleTab === 'student'
                    ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-900 dark:text-indigo-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>For Students</span>
              </button>
              <button
                onClick={() => setActiveRoleTab('mentor')}
                className={`flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeRoleTab === 'mentor'
                    ? 'bg-white text-emerald-700 shadow-xs dark:bg-slate-900 dark:text-emerald-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>For Mentors</span>
              </button>
              <button
                onClick={() => setActiveRoleTab('company')}
                className={`flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeRoleTab === 'company'
                    ? 'bg-white text-sky-700 shadow-xs dark:bg-slate-900 dark:text-sky-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>For Companies</span>
              </button>
            </div>
          </div>
        </section>

        {/* Tab Content */}
        <section className="py-16 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {activeRoleTab === 'student' && (
            <div className="space-y-12">
              <div className="text-center max-w-xl mx-auto mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  The Student Builder Lifecycle
                </h2>
                <p className="text-xs text-slate-500 mt-1">Transform side projects into fast-tracked job offers and paid contracts.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 space-y-3">
                  <span className="text-xs font-mono font-bold text-indigo-600">PHASE 1</span>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Connect GitHub & Build</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Write clean, modular code with automated CI test suites. Include architecture diagrams and reproducibility guides in your repository.
                  </p>
                </div>

                <div className="p-6 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 space-y-3">
                  <span className="text-xs font-mono font-bold text-indigo-600">PHASE 2</span>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Request Proof Audit</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Submit your pull request to the SkillBridge verification queue. Receive structured feedback from peers and senior industry mentors.
                  </p>
                </div>

                <div className="p-6 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 space-y-3">
                  <span className="text-xs font-mono font-bold text-indigo-600">PHASE 3</span>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Get Hired & Paid</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Verified badges automatically match you to open roles at companies like Vercel, Supabase, and Linear, bypassing traditional resume filters.
                  </p>
                </div>
              </div>

              <div className="text-center pt-6">
                <Link href="/register">
                  <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Get Started as a Student Builder
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {activeRoleTab === 'mentor' && (
            <div className="space-y-12">
              <div className="text-center max-w-xl mx-auto mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  The Mentor & Code Reviewer Workflow
                </h2>
                <p className="text-xs text-slate-500 mt-1">Shape the next generation of engineers while monetizing your expertise.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 space-y-3">
                  <span className="text-xs font-mono font-bold text-emerald-600">STEP 1</span>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Set Availability & Rate</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Configure your consulting hourly rate and sync your calendar for 1-on-1 architecture consultations and mock interviews.
                  </p>
                </div>

                <div className="p-6 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 space-y-3">
                  <span className="text-xs font-mono font-bold text-emerald-600">STEP 2</span>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Audit Proof Submissions</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Review candidate pull requests, examine test logs, and issue Level 2 Mentor Verified badges to exceptional implementations.
                  </p>
                </div>

                <div className="p-6 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 space-y-3">
                  <span className="text-xs font-mono font-bold text-emerald-600">STEP 3</span>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Receive Direct Payouts</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Get paid weekly directly to your bank account via automated platform deposits.
                  </p>
                </div>
              </div>

              <div className="text-center pt-6">
                <Link href="/register">
                  <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Apply to Become a Mentor
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {activeRoleTab === 'company' && (
            <div className="space-y-12">
              <div className="text-center max-w-xl mx-auto mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  The Company Talent Pipeline
                </h2>
                <p className="text-xs text-slate-500 mt-1">Direct access to verified engineers who have solved real problems.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 space-y-3">
                  <span className="text-xs font-mono font-bold text-sky-600">STEP 1</span>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Set Verification Filters</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Post roles with minimum proof requirements (e.g., Level 2 Mentor Reviewed in Go or Next.js).
                  </p>
                </div>

                <div className="p-6 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 space-y-3">
                  <span className="text-xs font-mono font-bold text-sky-600">STEP 2</span>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Inspect Audited Code</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Skip first-round take-home tests. Review candidate test suites, git commit history, and peer reviews immediately.
                  </p>
                </div>

                <div className="p-6 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 space-y-3">
                  <span className="text-xs font-mono font-bold text-sky-600">STEP 3</span>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Make Fast Offers</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Reduce time-to-hire by 68%. Extend offers with confidence knowing code capabilities are pre-validated.
                  </p>
                </div>
              </div>

              <div className="text-center pt-6">
                <Link href="/register">
                  <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Start Hiring on SkillBridge
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
