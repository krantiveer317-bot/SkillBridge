'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { OpportunityCard } from '@/components/ui/OpportunityCard';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { apiFetch } from '@/lib/api';
import { Opportunity } from '@/types';
import { Search, Sparkles, CheckCircle2 } from 'lucide-react';

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
  isActive: boolean;
  isFeatured: boolean;
  applicantCount: number;
  createdAt: string;
  updatedAt: string;
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

type OpportunitiesResponse = {
  opportunities: ApiOpportunity[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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

  type:
    opp.type === 'JOB'
      ? 'job'
      : opp.type === 'INTERNSHIP'
        ? 'internship'
        : 'freelance',

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
export default function OpportunitiesPage() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const [opportunities, setOpportunities] = useState<ApiOpportunity[]>([]);
  const [selectedOppForApply, setSelectedOppForApply] =
    useState<ApiOpportunity | null>(null);

  const [coverLetter, setCoverLetter] = useState('');
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOpportunities = async () => {
      try {
        setLoading(true);
        setError('');

        const params = new URLSearchParams({
          page: '1',
          limit: '100',
        });

        if (search.trim()) {
          params.set('q', search.trim());
        }

        if (selectedType !== 'all') {
          params.set('type', selectedType.toUpperCase());
        }

        const result = await apiFetch<OpportunitiesResponse>(
          `/opportunity?${params.toString()}`,
          { auth: false }
        );

        setOpportunities(result.opportunities ?? []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load opportunities.'
        );
        setOpportunities([]);
      } finally {
        setLoading(false);
      }
    };

    const timeout = window.setTimeout(loadOpportunities, 250);

    return () => window.clearTimeout(timeout);
  }, [search, selectedType]);

  const handleApply = (opp: Opportunity) => {
    const apiOpportunity = opportunities.find(
      (item) => item.id === opp.id
    );

    if (!apiOpportunity) {
      setError('Opportunity details could not be found.');
      return;
    }

    setSelectedOppForApply(apiOpportunity);
    setCoverLetter('');
    setApplicationSubmitted(false);
    setError('');
  };

  const handleConfirmApplication = async () => {
    if (!selectedOppForApply) return;

    try {
      setApplying(true);
      setError('');

      await apiFetch('/applications', {
        method: 'POST',
        body: JSON.stringify({
          opportunityId: selectedOppForApply.id,
          coverLetter: coverLetter.trim() || undefined,
        }),
      });

      setApplicationSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to submit application.'
      );
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Hiring Marketplace</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Opportunities Board
          </h1>

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Full-time roles, competitive internships, and freelance gigs with
            proof-of-work hiring fast-tracks.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />

            <input
              type="text"
              placeholder="Search roles, skills, or companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {[
              { id: 'all', label: 'All Opportunities' },
              { id: 'job', label: 'Full-Time Jobs' },
              { id: 'internship', label: 'Paid Internships' },
              { id: 'freelance', label: 'Freelance Gigs' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  selectedType === tab.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-16 text-center text-sm text-slate-500">
            Loading opportunities...
          </div>
        )}

        {/* Error */}
        {!loading && error && !selectedOppForApply && (
          <div className="py-16 text-center">
            <p className="text-sm text-red-500">{error}</p>

            <Button
              className="mt-4"
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && opportunities.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm text-slate-500">
              No opportunities found.
            </p>
          </div>
        )}

        {/* Opportunities */}
        {!loading && !error && opportunities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={mapOpportunity(opp)}
                onApply={handleApply}
              />
            ))}
          </div>
        )}

        {/* Apply Modal */}
        <Modal
          isOpen={!!selectedOppForApply}
          onClose={() => {
            if (!applying) {
              setSelectedOppForApply(null);
            }
          }}
          title={
            applicationSubmitted
              ? 'Application Sent!'
              : `Apply to ${selectedOppForApply?.company.name ?? ''}`
          }
          description={
            applicationSubmitted
              ? 'Your application has been submitted successfully.'
              : selectedOppForApply?.title
          }
        >
          {selectedOppForApply && (
            <div className="space-y-4 text-xs">
              {applicationSubmitted ? (
                <div className="text-center py-6 space-y-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Application Successfully Submitted
                  </h4>

                  <p className="text-slate-500 max-w-xs mx-auto">
                    Your application was submitted to{' '}
                    {selectedOppForApply.company.name}.
                  </p>

                  <Button
                    onClick={() => setSelectedOppForApply(null)}
                    className="mt-2"
                  >
                    Done
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 space-y-1">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {selectedOppForApply.title}
                    </div>

                    <p className="text-slate-500 text-[11px]">
                      {selectedOppForApply.company.name} Â·{' '}
                      {selectedOppForApply.compensation}
                    </p>

                    <p className="text-slate-500 text-[11px]">
                      Required verification:{' '}
                      {selectedOppForApply.minimumVerificationTier}
                    </p>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Cover Letter / Note (Optional)
                    </label>

                    <textarea
                      rows={5}
                      maxLength={3000}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Highlight relevant projects, skills, repositories, or experience..."
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                    />

                    <div className="text-right text-[10px] text-slate-400 mt-1">
                      {coverLetter.length}/3000
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
                      onClick={() => setSelectedOppForApply(null)}
                    >
                      Cancel
                    </Button>

                    <Button
                      disabled={applying}
                      onClick={handleConfirmApplication}
                    >
                      {applying
                        ? 'Submitting...'
                        : 'Submit Application'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </main>

      <Footer />
    </div>
  );
}
