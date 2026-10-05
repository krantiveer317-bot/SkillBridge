'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { apiFetch } from '@/lib/api';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock3,
  Loader2,
  RefreshCw,
} from 'lucide-react';

interface VerificationRequest {
  id: string;
  requestedTier: string;
  status: string;
  reviewerNotes?: string | null;
  submittedAt: string;
  project?: {
    title: string;
  };
  applicant?: {
    email?: string;
    profile?: {
      avatar?: string | null;
      title?: string | null;
    } | null;
  };
  reviewer?: {
    profile?: {
      title?: string | null;
    } | null;
  } | null;
}

type ReviewStatus = 'APPROVED' | 'CHANGES_REQUESTED' | 'REJECTED';

export default function AdminVerificationsPage() {
  const [queue, setQueue] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [error, setError] = useState('');
  const [auditTarget, setAuditTarget] = useState<VerificationRequest | null>(null);

  const loadQueue = async () => {
    try {
      setLoading(true);
      setError('');

      const result = await apiFetch<{
        data: VerificationRequest[];
      }>('/admin/verifications?page=1&limit=100');

      setQueue(result.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load verification requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleReview = async (status: ReviewStatus) => {
    if (!auditTarget) return;

    try {
      setReviewing(true);
      setError('');

      await apiFetch(`/verification/${auditTarget.id}/review`, {
        method: 'PATCH',
        body: JSON.stringify({
          status,
          reviewerNotes:
            status === 'APPROVED'
              ? 'Approved by administrator.'
              : status === 'CHANGES_REQUESTED'
                ? 'Changes requested by administrator.'
                : 'Rejected by administrator.',
        }),
      });

      setAuditTarget(null);
      await loadQueue();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to review verification request');
    } finally {
      setReviewing(false);
    }
  };

  const statusVariant = (status: string) => {
    if (status === 'APPROVED') return 'success';
    if (status === 'REJECTED') return 'danger';
    if (status === 'CHANGES_REQUESTED') return 'warning';
    return 'warning';
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-purple-600" />
              <span>Verification Queue & Certificate Issuance</span>
            </h1>

            <p className="text-xs text-slate-500 mt-1">
              Review verification requests using the real verification workflow.
            </p>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={loadQueue}
            leftIcon={
              loading
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <RefreshCw className="w-3.5 h-3.5" />
            }
          >
            Refresh
          </Button>
        </div>

        {error && (
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Verification Requests ({queue.length})
            </h3>

            <span className="text-xs text-slate-400">
              Live backend data
            </span>
          </div>

          {loading ? (
            <div className="p-10 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            </div>
          ) : queue.length === 0 ? (
            <div className="p-10 text-center">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-3" />
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                No verification requests found
              </p>
              <p className="text-xs text-slate-500 mt-1">
                The current verification queue is empty.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {queue.map((req) => (
                <div
                  key={req.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {req.project?.title || 'Untitled Project'}
                      </h4>

                      <Badge variant={statusVariant(req.status)}>
                        {req.status}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-500">
                      Applicant: {req.applicant?.email || 'Unknown'} • Target:{' '}
                      {req.requestedTier} • Submitted:{' '}
                      {new Date(req.submittedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {['PENDING', 'IN_PROGRESS'].includes(req.status) && (
                      <Button
                        size="sm"
                        onClick={() => setAuditTarget(req)}
                        leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
                      >
                        Inspect & Review
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Modal
          isOpen={!!auditTarget}
          onClose={() => !reviewing && setAuditTarget(null)}
          title={`Audit: ${auditTarget?.project?.title || 'Verification Request'}`}
          description={`Applicant: ${auditTarget?.applicant?.email || 'Unknown'} • Target: ${auditTarget?.requestedTier || 'Unknown'}`}
        >
          {auditTarget && (
            <div className="space-y-5 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <Clock3 className="w-4 h-4 text-slate-400" />
                  <span>
                    Submitted:{' '}
                    {new Date(auditTarget.submittedAt).toLocaleString()}
                  </span>
                </div>

                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">
                    Requested verification tier
                  </p>
                  <p className="text-slate-500 mt-1">
                    {auditTarget.requestedTier}
                  </p>
                </div>

                {auditTarget.reviewerNotes && (
                  <div>
                    <p className="font-semibold text-slate-700 dark:text-slate-200">
                      Existing reviewer notes
                    </p>
                    <p className="text-slate-500 mt-1">
                      {auditTarget.reviewerNotes}
                    </p>
                  </div>
                )}

                <p className="text-slate-500">
                  Review the submitted verification evidence before selecting
                  the final status.
                </p>
              </div>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Button
                  variant="danger"
                  size="sm"
                  disabled={reviewing}
                  onClick={() => handleReview('REJECTED')}
                  leftIcon={
                    reviewing
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <XCircle className="w-3.5 h-3.5" />
                  }
                >
                  Reject
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={reviewing}
                  onClick={() => handleReview('CHANGES_REQUESTED')}
                >
                  Request Changes
                </Button>

                <Button
                  size="sm"
                  disabled={reviewing}
                  onClick={() => handleReview('APPROVED')}
                  leftIcon={
                    reviewing
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <CheckCircle2 className="w-3.5 h-3.5" />
                  }
                >
                  Approve
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardShell>
  );
}
