'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { OpportunityCard } from '@/components/ui/OpportunityCard';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { mockOpportunities } from '@/data/mockData';
import { Opportunity } from '@/types';
import { Briefcase, Search, CheckCircle2 } from 'lucide-react';

export default function FreelanceGigsPage() {
  const [search, setSearch] = useState('');
  const [selectedGig, setSelectedGig] = useState<Opportunity | null>(null);
  const [proposalSubmitted, setProposalSubmitted] = useState(false);

  const freelanceGigs = mockOpportunities.filter(
    (o) =>
      o.type === 'freelance' &&
      (o.title.toLowerCase().includes(search.toLowerCase()) ||
        o.requiredSkills.some((s) => s.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-600" />
            <span>Vetted Freelance Gigs</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Apply with your verified Skill Passport. Milestones are protected with escrow guarantees.
          </p>
        </div>

        <div className="flex justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search gigs by keyword or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {freelanceGigs.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onApply={(o) => {
                setSelectedGig(o);
                setProposalSubmitted(false);
              }}
            />
          ))}
        </div>

        <Modal
          isOpen={!!selectedGig}
          onClose={() => setSelectedGig(null)}
          title={proposalSubmitted ? 'Proposal Sent!' : `Submit Proposal for ${selectedGig?.title}`}
          description={
            proposalSubmitted
              ? 'Your proposal and proof badge credentials have been submitted.'
              : `${selectedGig?.company.name} • ${selectedGig?.compensation}`
          }
        >
          {selectedGig && (
            <div className="space-y-4 text-xs">
              {proposalSubmitted ? (
                <div className="text-center py-6 space-y-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Proposal Transmitted
                  </h4>
                  <p className="text-slate-500 max-w-xs mx-auto">
                    {selectedGig.company.name} reviews proposals from verified builders within 24 hours.
                  </p>
                  <Button onClick={() => setSelectedGig(null)} className="mt-2">
                    Done
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Proposed Delivery Timeline
                    </label>
                    <input
                      type="text"
                      defaultValue="2 Weeks (Milestone 1 in 5 days)"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Technical Approach & Relevant Verified Repos
                    </label>
                    <textarea
                      rows={3}
                      defaultValue="I have built and verified high-performance WebAudio and real-time state architectures. I can deliver this module with full unit tests."
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setSelectedGig(null)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setProposalSubmitted(true)}>
                      Send Verified Proposal
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
