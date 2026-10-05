import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { Github, Twitter, Linkedin } from '@/components/ui/Icons';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-slate-900 dark:text-slate-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-lg font-extrabold tracking-tight">SkillBridge</span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              The verifiable proof-of-work platform where talent learns real skills, collaborates on production code, earns peer & mentor verification, and lands roles at tier-1 technology teams.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Students Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              For Builders
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link href="/skill-passport" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Skill Passport
                </Link>
              </li>
              <li>
                <Link href="/verification" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Get Skills Verified
                </Link>
              </li>
              <li>
                <Link href="/skill-exchange" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Peer Skill Exchange
                </Link>
              </li>
              <li>
                <Link href="/opportunities" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Jobs & Gigs
                </Link>
              </li>
            </ul>
          </div>

          {/* Mentors & Companies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Ecosystem
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/mentors" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Browse Mentors
                </Link>
              </li>
              <li>
                <Link href="/mentor/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Mentor Portal
                </Link>
              </li>
              <li>
                <Link href="/companies" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Hiring Partners
                </Link>
              </li>
              <li>
                <Link href="/company/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Company Portal
                </Link>
              </li>
              <li>
                <Link href="/freelancers" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Freelance Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  How Proof Works
                </Link>
              </li>
              <li>
                <Link href="/skills" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Skills Directory
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  About SkillBridge
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
                  <span>Admin Console</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} SkillBridge Inc. All rights reserved. Built for modern engineers.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer">Verification Manifesto</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
