'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { OpportunityCard } from '@/components/ui/OpportunityCard';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { apiFetch } from '@/lib/api';
import { Opportunity } from '@/types';
import { Briefcase, Search, CheckCircle2 } from 'lucide-react';

type ApiOpportunity = {
  id: string;
  type: 'JOB' | 'INTERNSHIP' | 'FREELANCE';
  title: string;
  category: string;
  description: string;
  compensation: string;
  locationType: 'REMOTE' | 'HYBRID' | 'ONSITE';
  minimumVerificationTier: 'NONE' | 'PEER' | 'MENTOR' | 'INDUSTRY';
  deadline: string | null;
  applicantCount: number;
  isFeatured: boolean;
  createdAt: string;
  company: {
    id: string;
    name: string;
    logoUrl: string | null;
    isVerified: boolean;
    location: string | null;
  };
  skills: {
    skill: {
      id: string;
      name: string;
    };
  }[];
};

type ApiResponse = {
  opportunities: ApiOpportunity[];
};

const mapOpportunity = (opp: ApiOpportunity): Opportunity => ({
  id: opp.id,
  title: opp.title,
  company: {
    id: opp.company.id,
    name: opp.company.name,
    logo: opp.company.logoUrl ?? '',
    verified: opp.company.isVerified,
    location: opp.company.location ?? '',
  },
  type: 'freelance',
  category: opp.category,
  description: opp.description,
  compensation: opp.compensation,
  locationType:
    opp.locationType === 'REMOTE'
      ? 'Remote'
      : opp.locationType === 'HYBRID'
        ? 'Hybrid'
        : 'On-site',
  requiredSkills: opp.skills.map(({ skill }) => skill.name),
  minimumVerificationTier:
    opp.minimumVerificationTier === 'NONE'
      ? 'None'
      : opp.minimumVerificationTier === 'PEER'
        ? 'Peer'
        : opp.minimumVerificationTier === 'MENTOR'
          ? 'Mentor'
          : 'Industry',
  deadline: opp.deadline ?? undefined,
  postedAt: opp.createdAt,
  applicantCount: opp.applicantCount,
  featured: opp.isFeatured,
});

export default function FreelanceGigsPage() {
  const [search, setSearch] = useState('');
  const [gigs, setGigs] = useState<ApiOpportunity[]>([]);

  const [selectedGig, setSelectedGig] =
    useState<ApiOpportunity | null>(null);

  const [proposal, setProposal] = useState('');
  const [proposalSubmitted, setProposalSubmitted] = useState(false);

  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadGigs = async () => {
      try {
        setLoading(true);
        setError('');

        const params = new URLSearchParams({
          type: 'FREELANCE',
          page: '1',
          limit: '100',
        });

        if (search.trim()) {
          params.set('q', search.trim());
        }

        const result = await apiFetch<ApiResponse>(
          `/opportunity?${params.toString()}`,
          { auth: false }
        );

        setGigs(result.opportunities ?? []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load freelance gigs.'
        );
        setGigs([]);
      } finally {
        setLoading(false);
      }
    };

    const timeout = window.setTimeout(loadGigs, 250);

    return () => window.clearTimeout(timeout);
  }, [search]);

  const handleApply = (opportunity: Opportunity) => {
    const gig = gigs.find((item) => item.id === opportunity.id);

    if (!gig) {
      setError('Freelance opportunity could not be found.');
      return;
    }

    setSelectedGig(gig);
    setProposal('');
    setProposalSubmitted(false);
    setError('');
  };

  const submitProposal = async () => {
    if (!selectedGig) return;

    try {
      setApplying(true);
      setError('');

      await apiFetch('/applications', {
        method: 'POST',
        body: JSON.stringify({
          opportunityId: selectedGig.id,
          coverLetter: proposal.trim() || undefined,
        }),
      });

      setProposalSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to submit proposal.'
      );
    } finally {
      setApplying(false);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-600" />
            <span>Vetted Freelance Gigs</span>
          </h1>

          <p className="text-xs text-slate-500 mt-1">
            Apply with your verified Skill Passport. Milestones are protected
            with escrow guarantees.
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

        {loading && (
          <div className="py-12 text-center text-sm text-slate-500">
            Loading freelance gigs...
          </div>
        )}

        {!loading && error && !selectedGig && (
          <div className="py-12 text-center text-sm text-red-500">
            {error}
          </div>
        )}

        {!loading && !error && gigs.length === 0 && (
          <div className="py-12 text-center text-sm text-slate-500">
            No freelance gigs found.
          </div>
        )}

        {!loading && !error && gigs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map((gig) => (
              <OpportunityCard
                key={gig.id}
                opportunity={mapOpportunity(gig)}
                onApply={handleApply}
              />
            ))}
          </div>
        )}

        <Modal
          isOpen={!!selectedGig}
          onClose={() => {
            if (!applying) {
              setSelectedGig(null);
            }
          }}
          title={
            proposalSubmitted
              ? 'Proposal Sent!'
              : `Submit Proposal for ${selectedGig?.title ?? ''}`
          }
          description={
            proposalSubmitted
              ? 'Your application has been submitted successfully.'
              : selectedGig
                ? `${selectedGig.company.name} · ${selectedGig.compensation}`
                : undefined
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
                    Proposal Submitted
                  </h4>

                  <p className="text-slate-500 max-w-xs mx-auto">
                    Your proposal was submitted to{' '}
                    {selectedGig.company.name}.
                  </p>

                  <Button
                    onClick={() => setSelectedGig(null)}
                    className="mt-2"
                  >
                    Done
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 space-y-1">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {selectedGig.title}
                    </div>

                    <p className="text-slate-500 text-[11px]">
                      {selectedGig.company.name} ·{' '}
                      {selectedGig.compensation}
                    </p>

                    <p className="text-slate-500 text-[11px]">
                      Required verification:{' '}
                      {selectedGig.minimumVerificationTier}
                    </p>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Proposal / Technical Approach
                    </label>

                    <textarea
                      rows={6}
                      maxLength={3000}
                      value={proposal}
                      onChange={(e) => setProposal(e.target.value)}
                      placeholder="Explain your approach, relevant verified projects, skills, and delivery plan..."
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                    />

                    <div className="text-right text-[10px] text-slate-400 mt-1">
                      {proposal.length}/3000
                    </div>
                  </div>

                  {error && (
                    <p className="text-xs text-red-500">
                      {error}
                    </p>
                  )}

                  <div className="pt-2 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      disabled={applying}
                      onClick={() => setSelectedGig(null)}
                    >
                      Cancel
                    </Button>

                    <Button
                      disabled={applying}
                      onClick={submitProposal}
                    >
                      {applying
                        ? 'Submitting...'
                        : 'Send Verified Proposal'}
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
