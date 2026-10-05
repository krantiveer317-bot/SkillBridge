'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { apiFetch } from '@/lib/api';
import {
  Repeat,
  PlusCircle,
  CheckCircle2,
  MessageSquare,
  Loader2,
  AlertCircle,
} from 'lucide-react';

type Skill = {
  id: string;
  name: string;
  category?: string;
};

type Exchange = {
  id: string;
  requesterId: string;
  receiverId?: string | null;
  offeringSkillId: string;
  seekingSkillId: string;
  offeringLevel: string;
  seekingLevel: string;
  message: string;
  status: string;
  completedAt?: string | null;
  createdAt: string;
  requester?: {
    id: string;
    profile?: {
      firstName?: string;
      lastName?: string;
      avatar?: string | null;
      title?: string | null;
    } | null;
  };
  receiver?: {
    id: string;
    profile?: {
      firstName?: string;
      lastName?: string;
      avatar?: string | null;
      title?: string | null;
    } | null;
  } | null;
  offeringSkill?: Skill;
  seekingSkill?: Skill;
};

type ApiListResponse<T> = {
  data?: T[];
  meta?: unknown;
  message?: string;
};

const fallbackAvatar =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces&auto=format&q=80';

function getName(user?: Exchange['requester']) {
  const first = user?.profile?.firstName ?? '';
  const last = user?.profile?.lastName ?? '';
  const name = `${first} ${last}`.trim();
  return name || 'SkillBridge Member';
}

function getAvatar(user?: Exchange['requester']) {
  return user?.profile?.avatar || fallbackAvatar;
}

export default function SkillExchangePage() {
  const [exchangeList, setExchangeList] = useState<Exchange[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [offeringSkillId, setOfferingSkillId] = useState('');
  const [seekingSkillId, setSeekingSkillId] = useState('');
  const [message, setMessage] = useState('');

  const [connectModalRequest, setConnectModalRequest] =
    useState<Exchange | null>(null);
  const [connectMessage, setConnectMessage] = useState('');
  const [connectSuccess, setConnectSuccess] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const [exchangeResponse, skillsResponse] = await Promise.all([
        apiFetch<ApiListResponse<Exchange> | Exchange[]>(
          '/skill-exchange?page=1&limit=100',
          { auth: false }
        ),
        apiFetch<ApiListResponse<Skill> | Skill[]>(
          '/skills?page=1&limit=100',
          { auth: false }
        ),
      ]);

      const exchanges = Array.isArray(exchangeResponse)
        ? exchangeResponse
        : exchangeResponse?.data ?? [];

      const loadedSkills = Array.isArray(skillsResponse)
        ? skillsResponse
        : skillsResponse?.data ?? [];

      setExchangeList(exchanges);
      setSkills(loadedSkills);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load skill exchange data.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!offeringSkillId || !seekingSkillId || !message.trim()) {
      setError('Please select both skills and enter exchange details.');
      return;
    }

    if (offeringSkillId === seekingSkillId) {
      setError('Offering and seeking skills must be different.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await apiFetch('/skill-exchange', {
        method: 'POST',
        body: JSON.stringify({
          offeringSkillId,
          seekingSkillId,
          offeringLevel: 'INTERMEDIATE',
          seekingLevel: 'INTERMEDIATE',
          message: message.trim(),
        }),
      });

      setOfferingSkillId('');
      setSeekingSkillId('');
      setMessage('');
      setModalOpen(false);

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create the skill exchange request.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleAccept = async () => {
    if (!connectModalRequest) return;

    setActionLoading(connectModalRequest.id);
    setError('');

    try {
      await apiFetch(`/skill-exchange/${connectModalRequest.id}/accept`, {
        method: 'POST',
      });

      setConnectSuccess(true);
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to accept the skill exchange request.'
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (id: string) => {
    setActionLoading(id);
    setError('');

    try {
      await apiFetch(`/skill-exchange/${id}/complete`, {
        method: 'POST',
      });

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to complete the skill exchange.'
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (id: string) => {
    setActionLoading(id);
    setError('');

    try {
      await apiFetch(`/skill-exchange/${id}`, {
        method: 'DELETE',
      });

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to cancel the skill exchange.'
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Repeat className="w-6 h-6 text-indigo-600" />
              <span>Peer Skill Exchange</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Swap skills directly with peer builders.
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => {
              setError('');
              setModalOpen(true);
            }}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Post Skill Swap
          </Button>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-7 h-7 animate-spin text-indigo-600" />
          </div>
        ) : exchangeList.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
            <Repeat className="w-10 h-10 mx-auto text-slate-400 mb-3" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              No skill exchanges yet
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Be the first person to post a skill swap.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exchangeList.map((req) => {
              const requesterName = getName(req.requester);
              const isOpen = req.status === 'OPEN';
              const isCompleted = req.status === 'COMPLETED';
              const isRequesterAction =
                typeof window !== 'undefined' &&
                localStorage.getItem('skillbridge_user_id') ===
                  req.requesterId;

              return (
                <div
                  key={req.id}
                  className="p-6 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                        <Image
                          src={getAvatar(req.requester)}
                          alt={requesterName}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {requesterName}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {req.requester?.profile?.title ||
                            'SkillBridge Member'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 text-xs">
                      <div className="p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 flex justify-between gap-3">
                        <span className="text-emerald-800 dark:text-emerald-300 font-semibold">
                          Offering:
                        </span>
                        <span className="font-semibold text-right text-slate-900 dark:text-slate-100">
                          {req.offeringSkill?.name || req.offeringSkillId}
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 flex justify-between gap-3">
                        <span className="text-indigo-800 dark:text-indigo-300 font-semibold">
                          Seeking:
                        </span>
                        <span className="font-semibold text-right text-slate-900 dark:text-slate-100">
                          {req.seekingSkill?.name || req.seekingSkillId}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                      "{req.message}"
                    </p>

                    <div className="text-[11px] text-slate-400">
                      {req.status}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>

                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    ) : isOpen ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setConnectModalRequest(req);
                          setConnectSuccess(false);
                          setConnectMessage('');
                        }}
                        leftIcon={
                          <MessageSquare className="w-3.5 h-3.5" />
                        }
                      >
                        Connect & Swap
                      </Button>
                    ) : req.receiverId ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={actionLoading === req.id}
                        onClick={() => void handleComplete(req.id)}
                      >
                        {actionLoading === req.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          'Mark Complete'
                        )}
                      </Button>
                    ) : isRequesterAction ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={actionLoading === req.id}
                        onClick={() => void handleCancel(req.id)}
                      >
                        {actionLoading === req.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          'Cancel'
                        )}
                      </Button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Modal
          isOpen={modalOpen}
          onClose={() => !submitting && setModalOpen(false)}
          title="Create a Skill Exchange Request"
          description="Select the skills you can teach and want to learn."
        >
          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Skill You Can Offer
              </label>
              <select
                required
                value={offeringSkillId}
                onChange={(e) => setOfferingSkillId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                <option value="">Select a skill</option>
                {skills.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Skill You Want to Learn
              </label>
              <select
                required
                value={seekingSkillId}
                onChange={(e) => setSeekingSkillId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                <option value="">Select a skill</option>
                {skills.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Exchange Details"
              required
              placeholder="Describe what you want to exchange..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={submitting}
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  'Publish Exchange Listing'
                )}
              </Button>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={!!connectModalRequest}
          onClose={() => !actionLoading && setConnectModalRequest(null)}
          title={
            connectSuccess
              ? 'Swap Request Accepted!'
              : `Connect with ${getName(connectModalRequest?.requester)}`
          }
          description={
            connectSuccess
              ? 'The exchange is now connected.'
              : 'Send your exchange request to this SkillBridge member.'
          }
        >
          {connectModalRequest && (
            <div className="space-y-4 text-xs">
              {connectSuccess ? (
                <div className="text-center py-6 space-y-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Exchange Connected
                  </h4>

                  <p className="text-slate-500 max-w-xs mx-auto">
                    The skill exchange has been accepted successfully.
                  </p>

                  <Button onClick={() => setConnectModalRequest(null)}>
                    Done
                  </Button>
                </div>
              ) : (
                <>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    You are offering{' '}
                    <strong>
                      {connectModalRequest.seekingSkill?.name ||
                        connectModalRequest.seekingSkillId}
                    </strong>{' '}
                    in exchange for{' '}
                    <strong>
                      {connectModalRequest.offeringSkill?.name ||
                        connectModalRequest.offeringSkillId}
                    </strong>
                    .
                  </p>

                  <textarea
                    rows={3}
                    value={connectMessage}
                    onChange={(e) => setConnectMessage(e.target.value)}
                    placeholder="Add an optional message..."
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                  />

                  <div className="pt-2 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      disabled={!!actionLoading}
                      onClick={() => setConnectModalRequest(null)}
                    >
                      Cancel
                    </Button>

                    <Button
                      disabled={!!actionLoading}
                      onClick={() => void handleAccept()}
                    >
                      {actionLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        'Accept Swap'
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </Modal>
      </div>
    </DashboardShell>
  );
}
