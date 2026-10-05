import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Sparkles, ShieldCheck, Award, Users, Terminal, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="py-20 border-b border-slate-100 dark:border-slate-800 text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Mission</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Replacing the Resume with Real Proof-of-Work
            </h1>
            <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              We believe engineering talent should be evaluated on verified code, architectural judgment, and demonstrated output—not pedigree, connections, or keyword stuffing.
            </p>
          </div>
        </section>

        {/* The Problem & Solution */}
        <section className="py-16 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500">The Problem</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                The Tech Hiring Pipeline is Broken
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Over 70% of candidate resumes contain inflated claims. Automated ATS filters discard world-class self-taught builders while drowning recruiters in thousands of spam submissions. Students spend hundreds of hours submitting applications into a void.
              </p>
            </div>

            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">The Solution</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                Verifiable Competency Proofs
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                SkillBridge turns student repositories into cryptographically auditable proof points. With peer review rings and industry mentor validations, employers know with 100% certainty that candidates can ship reliable code on Day 1.
              </p>
            </div>
          </div>
        </section>

        {/* Impact Numbers */}
        <section className="py-16 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <span className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">14,800+</span>
                <p className="text-xs font-medium text-slate-500 mt-2 uppercase tracking-wider">Active Student Builders</p>
              </div>
              <div>
                <span className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">4,200+</span>
                <p className="text-xs font-medium text-slate-500 mt-2 uppercase tracking-wider">Verified Projects</p>
              </div>
              <div>
                <span className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">168+</span>
                <p className="text-xs font-medium text-slate-500 mt-2 uppercase tracking-wider">Hiring Partner Teams</p>
              </div>
              <div>
                <span className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">$1.2M+</span>
                <p className="text-xs font-medium text-slate-500 mt-2 uppercase tracking-wider">Earned by Students</p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Principles */}
        <section className="py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              Our Core Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                01
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Proof Over Pedigree</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                A verified distributed key-value store with zero partition anomalies carries more weight than any university transcript.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
                02
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Collaborative Peer Rings</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Engineers learn fastest when reading and auditing other builders' code. Peer review fosters rigorous engineering instincts.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-sky-50 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400 font-bold">
                03
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Real Economic Value</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Students shouldn't build in isolation. We connect verified builders directly to real client gigs, paid internships, and full-time contracts.
              </p>
            </div>
          </div>

          <div className="mt-14 text-center">
            <Link href="/register">
              <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Join the Movement
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
