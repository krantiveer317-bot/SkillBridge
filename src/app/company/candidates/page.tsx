'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { Modal } from '@/components/ui/Modal';
import { mockFreelancers } from '@/data/mockData';
import { Search, Users, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';

export default function CandidatesPipelinePage() {
  const [search, setSearch] = useState('');
  const [inviteModalCandidate, setInviteModalCandidate] = useState<typeof mockFreelancers[0] | null>(null);
  const [invited, setInvited] = useState(false);

  const filteredCandidates = mockFreelancers.filter((c) => {
    return (
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Users className="w-6 h-6 text-sky-600" />
              <span>Verified Candidate Pipeline</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Engineers pre-vetted through reproducible test suites and senior mentor code reviews.
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by verified skill (Go, Rust, Next.js)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Candidate Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="p-6 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs hover:border-sky-200 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                      <Image src={candidate.avatar} alt={candidate.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        {candidate.name}
                        <VerificationBadge tier="Level 3: Industry Audited" size="sm" showLabel={false} />
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">{candidate.title}</p>
                    </div>
                  </div>

                  <Badge variant="success">96% Stack Match</Badge>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {candidate.bio}
                </p>

                <div className="space-y-2 mb-4">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Verified Competencies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.skills.map((s) => (
                      <span key={s} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">Passport Verified ✓</span>
                <Button
                  size="sm"
                  onClick={() => {
                    setInviteModalCandidate(candidate);
                    setInvited(false);
                  }}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Invite to Screen
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Invite Modal */}
        <Modal
          isOpen={!!inviteModalCandidate}
          onClose={() => setInviteModalCandidate(null)}
          title={invited ? 'Interview Invitation Transmitted!' : `Invite ${inviteModalCandidate?.name}`}
          description={
            invited
              ? 'Candidate has received calendar booking options for an initial engineering screen.'
              : `Fast-track ${inviteModalCandidate?.name} straight to technical screen.`
          }
        >
          {inviteModalCandidate && (
            <div className="space-y-4 text-xs">
              {invited ? (
                <div className="text-center py-6 space-y-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Interview Invite Dispatched
                  </h4>
                  <p className="text-slate-500 max-w-xs mx-auto">
                    Candidate notified with priority badge. Track responses in your dashboard.
                  </p>
                  <Button onClick={() => setInviteModalCandidate(null)} className="mt-2">
                    Done
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Select Role
                    </label>
                    <select className="w-full rounded-lg border border-slate-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                      <option>Full-Stack Engineer (Core Infrastructure) - Vercel</option>
                      <option>Edge Streaming Systems Engineer - Vercel</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Personalized Note to Candidate
                    </label>
                    <textarea
                      rows={3}
                      defaultValue={`Hi ${inviteModalCandidate.name}, we audited your Raft consensus project on SkillBridge and were very impressed with your zero-split-brain partition tests. We'd love to fast-track you to our round 2 screen!`}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setInviteModalCandidate(null)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setInvited(true)}>
                      Dispatch Fast-Track Invitation
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </DashboardShell>
  );
}
