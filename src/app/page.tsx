'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { OpportunityCard } from '@/components/ui/OpportunityCard';
import { ProfileCard } from '@/components/ui/ProfileCard';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import {
  mockProjects,
  mockOpportunities,
  mockMentors,
  mockCompanies,
  mockFreelancers,
  mockExchangeRequests,
} from '@/data/mockData';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Code2,
  Repeat,
  Users,
  FolderGit2,
  Briefcase,
  Layers,
  Award,
  Building2,
  Terminal,
  ExternalLink,
  ChevronRight,
  Zap,
} from 'lucide-react';

export default function LandingPage() {
  const journeySteps = [
    { step: '01', title: 'LEARN', desc: 'Master in-demand production technologies through roadmaps and hands-on curriculums.' },
    { step: '02', title: 'BUILD', desc: 'Construct full-stack systems, tools, and apps with clean architecture and real tests.' },
    { step: '03', title: 'VERIFY', desc: 'Submit code for strict peer, mentor, and industry proof-of-work review.' },
    { step: '04', title: 'SHOWCASE', desc: 'Mint your tamper-proof Skill Passport and display verified project credentials.' },
    { step: '05', title: 'WORK', desc: 'Take on vetted freelance milestones and gain real client track records.' },
    { step: '06', title: 'EARN', desc: 'Secure high-paying full-time roles, competitive internships, and gig bounties.' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-slate-100 dark:border-slate-800/80">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-50/70 dark:bg-indigo-950/20 blur-3xl -z-10 rounded-full pointer-events-none" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            {/* Top pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-200/80 bg-indigo-50 text-indigo-800 dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-300 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>The Next-Generation Proof-of-Work Platform</span>
              <span className="h-1 w-1 rounded-full bg-indigo-400" />
              <span className="font-normal text-indigo-600 dark:text-indigo-300">No resumes. Just verified code.</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 max-w-4xl mx-auto leading-[1.1]">
              Your Skills. <br className="hidden sm:inline" />
              Your Proof. <br className="hidden sm:inline" />
              <span className="text-indigo-600 dark:text-indigo-400">Your Opportunity.</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Learn skills, exchange knowledge, build real projects, prove what you can do, freelance, and connect with companies.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto px-8" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Get Started
                </Button>
              </Link>
              <Link href="/opportunities">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8">
                  Explore Opportunities
                </Button>
              </Link>
            </div>

            {/* Micro proof badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero Fake Resumes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Peer & Mentor Code Reviews</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Direct Fast-Track Interviews</span>
              </div>
            </div>

            {/* Partner companies ticker banner */}
            <div className="mt-16 pt-10 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-6">
                Talent trusted and hired by engineers from
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
                <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-slate-200">VERCEL</span>
                <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-slate-200">STRIPE</span>
                <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-slate-200">SUPABASE</span>
                <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-slate-200">LINEAR</span>
                <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-slate-200">POSTHOG</span>
                <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-slate-200">RESEND</span>
              </div>
            </div>
          </div>
        </section>

        {/* THE SKILLBRIDGE JOURNEY BANNER */}
        <section className="py-16 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200/80 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                The Proof-of-Work Pipeline
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
                The SkillBridge Journey
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
                From your first commit to signed employment offers, your progression is verifiable every step of the way.
              </p>
            </div>

            {/* Journey chain */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              {journeySteps.map((j, idx) => (
                <div
                  key={j.title}
                  className="relative flex flex-col justify-between p-5 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 transition-all hover:border-indigo-200 hover:shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {j.step}
                      </span>
                      {idx < journeySteps.length - 1 && (
                        <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700 hidden lg:block -mr-2" />
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5 tracking-tight">
                      {j.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {j.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8 SPECIFIC FEATURE SECTIONS */}

        {/* 1. SKILL VERIFICATION */}
        <section className="py-20 border-b border-slate-100 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Feature 01: Skill Verification</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                  Code Review Over Resume Claims
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Anyone can write "Full-Stack Engineer" on a resume. SkillBridge proves it through automated test suite validation, peer audits, and senior mentor evaluations. Every verified badge corresponds to inspected commits, architectural diagrams, and performance benchmarks.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded-md bg-sky-100 text-sky-700 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Level 1: Peer Verified</h4>
                      <p className="text-xs text-slate-500">Cross-inspected by two active platform developers with reproducible execution tests.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded-md bg-indigo-100 text-indigo-700 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Level 2: Mentor Reviewed</h4>
                      <p className="text-xs text-slate-500">Detailed architecture, code safety, and scalability feedback by experienced industry mentors.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded-md bg-emerald-100 text-emerald-700 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Level 3: Industry Audited</h4>
                      <p className="text-xs text-slate-500">Production-grade readiness audit accepted for direct interview bypass by hiring partners.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <Link href="/verification">
                    <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Explore Verification Engine
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Code Verification Interactive Visual */}
              <div className="rounded-2xl border border-slate-200 bg-slate-900 text-slate-100 p-6 shadow-xl space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-500" />
                    <span className="h-3 w-3 rounded-full bg-amber-500" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span className="text-slate-400 ml-2 font-sans font-medium">proof_audit_pipeline.log</span>
                  </div>
                  <Badge variant="success">Passed 14/14</Badge>
                </div>

                <div className="space-y-2 text-slate-300 leading-loose">
                  <p className="text-emerald-400">✓ Ingesting repo: https://github.com/alexrivera-dev/nexus-kv</p>
                  <p className="text-slate-400">→ Running Jepsen partition simulation: 100,000 txs</p>
                  <p className="text-emerald-400">✓ Raft leader re-election latency: 18ms (SLA &lt; 50ms)</p>
                  <p className="text-emerald-400">✓ Zero data loss during simulated 3-node partition split</p>
                  <p className="text-slate-400">→ Static analysis & memory leak check: zero leaks found</p>
                  <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 space-y-1 my-2">
                    <p className="text-indigo-300 font-semibold font-sans">Staff Reviewer: Sarah Chen (Stripe)</p>
                    <p className="text-slate-400 font-sans text-[11px]">"Exemplary implementation of log compaction and snapshotting. High-quality production code."</p>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-400 font-sans">Verification Issued:</span>
                    <VerificationBadge tier="Level 3: Industry Audited" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. SKILL EXCHANGE */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200/80 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold mb-3">
                  <Repeat className="w-3.5 h-3.5" />
                  <span>Feature 02: Skill Exchange</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                  Peer Knowledge Barter
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
                  Trade your strengths to conquer your gaps. Teach Rust in exchange for Figma UI design, or pair program on Postgres optimization in exchange for Next.js mastery.
                </p>
              </div>

              <Link href="/skill-exchange" className="mt-4 md:mt-0">
                <Button variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Browse Exchange Board
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockExchangeRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex flex-col justify-between p-6 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs hover:border-indigo-200 hover:shadow-md transition-all"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                        <Image src={req.requester.avatar} alt={req.requester.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{req.requester.name}</h4>
                        <p className="text-xs text-slate-500">{req.requester.title}</p>
                      </div>
                    </div>

                    <div className="space-y-2.5 mb-4 text-xs">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60">
                        <span className="text-emerald-800 dark:text-emerald-300 font-semibold">Offering:</span>
                        <span className="text-slate-900 dark:text-slate-100 font-medium">{req.offeringSkill}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60">
                        <span className="text-indigo-800 dark:text-indigo-300 font-semibold">Seeking:</span>
                        <span className="text-slate-900 dark:text-slate-100 font-medium">{req.seekingSkill}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      "{req.message}"
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Posted {req.createdAt}</span>
                    <Link href="/skill-exchange">
                      <Button size="sm" variant="outline">Connect & Swap</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. EXPERT SESSIONS */}
        <section className="py-20 border-b border-slate-100 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold mb-3">
                  <Users className="w-3.5 h-3.5" />
                  <span>Feature 03: Expert Sessions</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                  1-on-1 Mentorship from Tech Leaders
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
                  Get direct architecture advice, mock technical interviews, and code reviews from Staff Engineers and Design Leads at Stripe, Spotify, Figma, and Google.
                </p>
              </div>

              <Link href="/mentors" className="mt-4 md:mt-0">
                <Button variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Browse All Mentors
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockMentors.slice(0, 3).map((mentor) => (
                <ProfileCard
                  key={mentor.id}
                  id={mentor.id}
                  name={mentor.name}
                  avatar={mentor.avatar}
                  title={mentor.title}
                  company={mentor.company}
                  bio={mentor.bio}
                  rating={mentor.rating}
                  reviewsCount={mentor.reviewsCount}
                  hourlyRate={mentor.hourlyRate}
                  verifiedTier="industry"
                  skills={mentor.expertise}
                  type="mentor"
                  actionLabel="Book Mentorship"
                />
              ))}
            </div>
          </div>
        </section>

        {/* 4. PROJECTS SHOWCASE */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200/80 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold mb-3">
                  <FolderGit2 className="w-3.5 h-3.5" />
                  <span>Feature 04: Real-World Projects</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                  Projects that Stand Out
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
                  No to-do apps or generic tutorials. SkillBridge showcases production-level distributed systems, WebAudio DAWs, and eBPF tracing probes with verified test reports.
                </p>
              </div>

              <Link href="/projects" className="mt-4 md:mt-0">
                <Button variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Explore Verified Projects
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockProjects.slice(0, 3).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>

        {/* 5. FREELANCING */}
        <section className="py-20 border-b border-slate-100 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold mb-3">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Feature 05: Vetted Freelancing</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                  Earn with Proof-Backed Contracts
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
                  Hire verified student builders for short-term sprints, component architecture, and backend optimizations. Secure milestone payments with platform-guaranteed escrow.
                </p>
              </div>

              <Link href="/freelancers" className="mt-4 md:mt-0">
                <Button variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Browse Top Freelancers
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockFreelancers.slice(0, 3).map((fl) => (
                <ProfileCard
                  key={fl.id}
                  id={fl.id}
                  name={fl.name}
                  avatar={fl.avatar}
                  title={fl.title}
                  bio={fl.bio}
                  rating={fl.rating}
                  reviewsCount={fl.completedJobs}
                  hourlyRate={fl.rate}
                  verifiedTier="industry"
                  skills={fl.skills}
                  type="freelancer"
                  actionLabel="Hire Talent"
                />
              ))}
            </div>
          </div>
        </section>

        {/* 6. JOBS & INTERNSHIPS */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200/80 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold mb-3">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Feature 06: Jobs & Internships</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                  Bypass the Resume Blackhole
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
                  Companies hire directly from verified skill badges. When your project passes Level 2 or Level 3 verification, your application jumps directly to the engineering team.
                </p>
              </div>

              <Link href="/opportunities" className="mt-4 md:mt-0">
                <Button variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  View All Open Roles
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockOpportunities.slice(0, 3).map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </div>
          </div>
        </section>

        {/* 7. SKILL PASSPORT */}
        <section className="py-20 border-b border-slate-100 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold">
                  <Award className="w-3.5 h-3.5" />
                  <span>Feature 07: Portable Skill Passport</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                  Cryptographically Verifiable Digital Credentials
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Your Skill Passport is your permanent engineering ledger. Every verified skill, peer review, and completed milestone is cryptographically signed and publicly verifiable. Embed your passport link in LinkedIn, GitHub, or direct job applications.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                    <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">99.8%</span>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Verification Integrity Rate</p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">4.2x</span>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Faster Recruiter Response</p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/skill-passport">
                    <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
                      View Sample Skill Passport
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Passport Visual Mockup */}
              <div className="rounded-2xl border border-indigo-200/80 bg-gradient-to-b from-indigo-50/50 to-white p-6 dark:border-indigo-900/60 dark:from-slate-900 dark:to-slate-950 shadow-xl space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-indigo-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                      SB
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">Official Skill Passport</h4>
                      <p className="text-xs font-mono text-indigo-600 dark:text-indigo-400">ID: SKP-2025-09214-ALX</p>
                    </div>
                  </div>
                  <Badge variant="success" dot>Verified Active</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Holder Name</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">Alex Rivera</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Trust Index</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">96 / 100 (Tier 3)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Audited Core Competencies</span>
                  <div className="flex flex-wrap gap-1.5">
                    <VerificationBadge tier="Level 3: Industry Audited" />
                    <span className="text-xs px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-medium">Distributed Raft Consensus</span>
                    <span className="text-xs px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-medium">Go High-Throughput I/O</span>
                    <span className="text-xs px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-medium">TypeScript Next.js 19</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. COMPANY HIRING */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200/80 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">Employer Candidate Filter</span>
                  </div>
                  <Badge variant="purple">Pre-Filtered 94.2%</Badge>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">Alex Rivera</h4>
                      <p className="text-[11px] text-slate-500">Go, Raft Consensus, Distributed Systems</p>
                    </div>
                    <VerificationBadge tier="Level 3: Industry Audited" size="sm" />
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">Elena Rostova</h4>
                      <p className="text-[11px] text-slate-500">Rust, eBPF Kernel Tracing, Kubernetes</p>
                    </div>
                    <VerificationBadge tier="Level 3: Industry Audited" size="sm" />
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">Tariq Al-Mansoor</h4>
                      <p className="text-[11px] text-slate-500">Design Systems, Tailwind CSS, Accessibility</p>
                    </div>
                    <VerificationBadge tier="Level 2: Mentor Reviewed" size="sm" />
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center text-xs text-slate-500">
                  <span>Match Algorithm: Proof-of-Work verified criteria</span>
                  <Link href="/company/dashboard" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                    Company Console →
                  </Link>
                </div>
              </div>

              <div className="order-1 lg:order-2 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Feature 08: Company Hiring</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                  Hire Vetted Engineers in Days, Not Months
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Stop sifting through hundreds of ChatGPT-crafted resumes. SkillBridge allows engineering hiring managers to filter directly for students and juniors who have written verifiable production code in your specific tech stack.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Post roles and challenges with minimum proof verification thresholds</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Audit candidate pull requests, test coverage reports, and peer evaluations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Sponsor hackathons and coding challenges with built-in hiring bounties</span>
                  </li>
                </ul>

                <div className="pt-2 flex gap-3">
                  <Link href="/companies">
                    <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Partner With Us
                    </Button>
                  </Link>
                  <Link href="/company/dashboard">
                    <Button variant="outline">
                      Employer Portal
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="py-20 text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Ready to Prove What You Can Build?
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
              Join thousands of student builders, mentors, and hiring managers bridging real ability to real opportunities.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register">
                <Button size="lg" className="px-8" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Create Free Account
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="px-8">
                  Read the Handbook
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
