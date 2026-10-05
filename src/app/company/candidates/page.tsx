'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { Modal } from '@/components/ui/Modal';
import { apiFetch } from '@/lib/api';
import {
  Search,
  Users,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

type Skill = {
  id: string;
  name: string;
};

type Applicant = {
  profile: {
    id?: string;
    name?: string;
    avatarUrl?: string | null;
    title?: string | null;
    bio?: string | null;
    location?: string | null;
    githubUrl?: string | null;
    linkedinUrl?: string | null;
    portfolioUrl?: string | null;
  } | null;
  skills: {
    skill: Skill;
  }[];
};

type Application = {
  id: string;
  status: string;
  feedback?: string | null;
  coverLetter?: string | null;
  appliedAt: string;
  applicant: Applicant;
};

type Opportunity = {
  id: string;
  title: string;
  type: string;
  isActive: boolean;
  applicantCount: number;
};

type Company = {
  id: string;
  name: string;
  opportunities: Opportunity[];
};

type ApplicationsResponse = {
  applications: Application[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type Candidate = Application & {
  opportunityTitle: string;
  opportunityId: string;
};

export default function CandidatesPipelinePage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCandidate, setSelectedCandidate] =
    useState<Candidate | null>(null);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        setLoading(true);
        setError('');

        const companyData = await apiFetch<Company>('/company/my');

        setCompany(companyData);

        const activeOpportunities = (companyData.opportunities ?? []).filter(
          (opp) => opp.isActive
        );

        const applicationResults = await Promise.all(
          activeOpportunities.map(async (opp) => {
            try {
              const result = await apiFetch<ApplicationsResponse>(
                `/opportunity/${opp.id}/applications?page=1&limit=100`
              );

              return (result.applications ?? []).map((application) => ({
                ...application,
                opportunityTitle: opp.title,
                opportunityId: opp.id,
              }));
            } catch {
              return [];
            }
          })
        );

        setCandidates(applicationResults.flat());
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load candidate applications.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadCandidates();
  }, []);

  const filteredCandidates = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return candidates;

    return candidates.filter((candidate) => {
      const profile = candidate.applicant.profile;
      const skills = candidate.applicant.skills.map((s) => s.skill.name);

      return (
        profile?.name?.toLowerCase().includes(query) ||
        profile?.title?.toLowerCase().includes(query) ||
        profile?.bio?.toLowerCase().includes(query) ||
        candidate.opportunityTitle.toLowerCase().includes(query) ||
        skills.some((skill) => skill.toLowerCase().includes(query))
      );
    });
  }, [candidates, search]);

  const updateApplicationStatus = async (status: string) => {
    if (!selectedCandidate) return;

    try {
      setUpdatingStatus(true);
      setStatusMessage('');

      await apiFetch(`/applications/${selectedCandidate.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          status,
        }),
      });

      setCandidates((current) =>
        current.map((candidate) =>
          candidate.id === selectedCandidate.id
            ? { ...candidate, status }
            : candidate
        )
      );

      setSelectedCandidate((current) =>
        current ? { ...current, status } : current
      );

      setStatusMessage(`Application marked as ${status.toLowerCase()}.`);
    } catch (err) {
      setStatusMessage(
        err instanceof Error
          ? err.message
          : 'Failed to update application status.'
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getCandidateName = (candidate: Candidate) =>
    candidate.applicant.profile?.name || 'Unnamed applicant';

  const getCandidateTitle = (candidate: Candidate) =>
    candidate.applicant.profile?.title || 'SkillBridge applicant';

  const getCandidateAvatar = (candidate: Candidate) =>
    candidate.applicant.profile?.avatarUrl || '';

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'success' as const;
      case 'REJECTED':
        return 'danger' as const;
      case 'REVIEWING':
        return 'info' as const;
      default:
        return 'default' as const;
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Users className="w-6 h-6 text-sky-600" />
              <span>Candidate Pipeline</span>
            </h1>

            <p className="text-xs text-slate-500 mt-1">
              Review candidates who have actually applied to your active
              SkillBridge opportunities.
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />

            <input
              type="text"
              placeholder="Search candidates, skills or roles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-sky-600" />
              Loading candidates...
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-950/20">
            <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-500" />

            <h2 className="font-semibold text-red-700 dark:text-red-400">
              Unable to load candidates
            </h2>

            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && filteredCandidates.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <Users className="mx-auto mb-3 h-10 w-10 text-slate-400" />

            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              No candidates found
            </h2>

            <p className="mt-2 text-xs text-slate-500">
              {search
                ? 'Try a different candidate name, skill or role.'
                : 'Candidates will appear here after they apply to your active opportunities.'}
            </p>
          </div>
        )}

        {!loading && !error && filteredCandidates.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Showing {filteredCandidates.length} candidate
                {filteredCandidates.length === 1 ? '' : 's'}
              </p>

              <p className="text-xs text-slate-400">
                {company?.name || 'Company'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCandidates.map((candidate) => {
                const profile = candidate.applicant.profile;
                const skills = candidate.applicant.skills.map(
                  (item) => item.skill
                );

                return (
                  <div
                    key={candidate.id}
                    className="p-6 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs hover:border-sky-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-12 w-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          {getCandidateAvatar(candidate) ? (
                            <img
                              src={getCandidateAvatar(candidate)}
                              alt={getCandidateName(candidate)}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Users className="w-5 h-5 text-slate-400" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                            {getCandidateName(candidate)}
                          </h3>

                          <p className="text-xs text-slate-500 font-medium truncate">
                            {getCandidateTitle(candidate)}
                          </p>
                        </div>
                      </div>

                      <Badge variant={getStatusVariant(candidate.status)}>
                        {candidate.status}
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Applied For
                      </span>

                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                        {candidate.opportunityTitle}
                      </p>
                    </div>

                    {profile?.bio && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">
                        {profile.bio}
                      </p>
                    )}

                    <div className="space-y-2 mb-4">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Skills
                      </span>

                      {skills.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {skills.map((skill) => (
                            <span
                              key={skill.id}
                              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                            >
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">
                          No skills listed
                        </span>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                      <span className="text-xs text-slate-500">
                        Applied{' '}
                        {new Date(candidate.appliedAt).toLocaleDateString()}
                      </span>

                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedCandidate(candidate);
                          setSelectedOpportunityId(candidate.opportunityId);
                          setStatusMessage('');
                        }}
                        rightIcon={
                          <ArrowRight className="w-3.5 h-3.5" />
                        }
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <Modal
          isOpen={!!selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          title={
            selectedCandidate
              ? getCandidateName(selectedCandidate)
              : 'Candidate'
          }
          description={
            selectedCandidate
              ? `Application for ${selectedCandidate.opportunityTitle}`
              : ''
          }
        >
          {selectedCandidate && (
            <div className="space-y-5 text-xs">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                  {getCandidateAvatar(selectedCandidate) ? (
                    <img
                      src={getCandidateAvatar(selectedCandidate)}
                      alt={getCandidateName(selectedCandidate)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Users className="w-5 h-5 text-slate-400" />
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    {getCandidateName(selectedCandidate)}
                  </h3>

                  <p className="text-slate-500">
                    {getCandidateTitle(selectedCandidate)}
                  </p>
                </div>
              </div>

              {selectedCandidate.applicant.profile?.location && (
                <div>
                  <span className="font-semibold text-slate-500">
                    Location
                  </span>
                  <p className="mt-1 text-slate-700 dark:text-slate-300">
                    {selectedCandidate.applicant.profile.location}
                  </p>
                </div>
              )}

              <div>
                <span className="font-semibold text-slate-500">
                  Skills
                </span>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedCandidate.applicant.skills.length > 0 ? (
                    selectedCandidate.applicant.skills.map(({ skill }) => (
                      <span
                        key={skill.id}
                        className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {skill.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400">
                      No skills listed
                    </span>
                  )}
                </div>
              </div>

              {selectedCandidate.applicant.profile?.bio && (
                <div>
                  <span className="font-semibold text-slate-500">
                    Bio
                  </span>
                  <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedCandidate.applicant.profile.bio}
                  </p>
                </div>
              )}

              {selectedCandidate.coverLetter && (
                <div>
                  <span className="font-semibold text-slate-500">
                    Cover Letter
                  </span>
                  <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {selectedCandidate.coverLetter}
                  </p>
                </div>
              )}

              <div>
                <span className="font-semibold text-slate-500">
                  Application Status
                </span>

                <div className="mt-2">
                  <Badge
                    variant={getStatusVariant(selectedCandidate.status)}
                  >
                    {selectedCandidate.status}
                  </Badge>
                </div>
              </div>

              {statusMessage && (
                <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-slate-600 dark:text-slate-300">
                  {statusMessage}
                </div>
              )}

              <div className="pt-2 flex flex-wrap justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedCandidate(null)}
                >
                  Close
                </Button>

                <Button
                  variant="outline"
                  disabled={updatingStatus}
                  onClick={() => updateApplicationStatus('REVIEWING')}
                >
                  Mark Reviewing
                </Button>

                <Button
                  disabled={updatingStatus}
                  onClick={() => updateApplicationStatus('ACCEPTED')}
                >
                  {updatingStatus ? 'Updating...' : 'Accept'}
                </Button>

                <Button
                  variant="outline"
                  disabled={updatingStatus}
                  onClick={() => updateApplicationStatus('REJECTED')}
                >
                  Reject
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardShell>
  );
}
