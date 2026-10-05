'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { SkillBadge } from '@/components/ui/SkillBadge';
import { mockCurrentUser, mockSkills } from '@/data/mockData';
import {
  Award,
  ShieldCheck,
  QrCode,
  Copy,
  Check,
  Download,
  Share2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export default function SkillPassportPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Award className="w-6 h-6 text-indigo-600" />
              <span>Cryptographic Skill Passport</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Your portable, tamper-evident engineering credential ledger. Publicly verifiable by recruiters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleCopy} leftIcon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}>
              {copied ? 'Link Copied!' : 'Copy Public Passport URL'}
            </Button>
            <Button size="sm" leftIcon={<Download className="w-4 h-4" />}>
              Export PDF
            </Button>
          </div>
        </div>

        {/* Passport Certificate Canvas */}
        <div className="rounded-3xl border-2 border-indigo-200/80 bg-gradient-to-b from-indigo-50/40 via-white to-white dark:border-indigo-900/60 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 p-6 sm:p-10 shadow-xl space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-indigo-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-2xl overflow-hidden border-2 border-indigo-500 shadow-sm shrink-0">
                <Image src={mockCurrentUser.avatar} alt={mockCurrentUser.name} fill className="object-cover" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 dark:text-indigo-400">
                  Official SkillBridge Passport
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {mockCurrentUser.name}
                </h2>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  ID: SKP-2025-09214-ALX • Verified on SkillBridge Mainnet
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-1">
              <Badge variant="success" dot size="md">
                Active Tier 3 (Industry Audited)
              </Badge>
              <span className="text-[11px] text-slate-400">Cryptographic Hash: 0x8f2a...9d12</span>
            </div>
          </div>

          {/* Scores Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                Trust Index
              </span>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
                96 / 100
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">Zero plagiarism, 100% test pass</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                Audited Skills
              </span>
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1 block">
                9 Verified
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">Frontend, Systems & Distributed</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                Inspected Repositories
              </span>
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1 block">
                6 Projects
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">Average test coverage: 92.4%</p>
            </div>
          </div>

          {/* Verified Skills Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Verifiable Competencies & Endorsers</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mockSkills.slice(0, 6).map((skill) => (
                <div
                  key={skill.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 block">
                      {skill.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Audited by {skill.verifiedBy || 'SkillBridge Peer Ring'}
                    </span>
                  </div>
                  <VerificationBadge tier="Level 3: Industry Audited" size="sm" showLabel={false} />
                </div>
              ))}
            </div>
          </div>

          {/* Recruiter Verification Embed */}
          <div className="pt-4 border-t border-indigo-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                <QrCode className="w-7 h-7" />
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                  Scan to Verify Proof
                </span>
                <span className="text-[11px] text-slate-400">
                  Direct cryptographic verification endpoint for employers
                </span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400">
              Valid through: December 2026
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
