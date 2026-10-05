'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { mockExchangeRequests } from '@/data/mockData';
import { Repeat, PlusCircle, Sparkles, CheckCircle2, MessageSquare } from 'lucide-react';

export default function SkillExchangePage() {
  const [exchangeList, setExchangeList] = useState(mockExchangeRequests);
  const [modalOpen, setModalOpen] = useState(false);
  const [offering, setOffering] = useState('');
  const [seeking, setSeeking] = useState('');
  const [message, setMessage] = useState('');
  const [connectModalRequest, setConnectModalRequest] = useState<typeof mockExchangeRequests[0] | null>(null);
  const [connectSuccess, setConnectSuccess] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq = {
      id: `ex-${Date.now()}`,
      requester: {
        id: 'usr-current',
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces&auto=format&q=80',
        title: 'Full-Stack Systems Engineer',
      },
      offeringSkill: offering || 'Go & Distributed Systems',
      offeringSkillLevel: 'Expert' as const,
      seekingSkill: seeking || 'Kubernetes & Helm',
      seekingSkillLevel: 'Intermediate' as const,
      message: message || 'Looking to exchange backend system architecture sessions for hands-on Kubernetes deployment tutoring.',
      status: 'Open' as const,
      createdAt: 'Just now',
    };
    setExchangeList([newReq, ...exchangeList]);
    setModalOpen(false);
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
              Swap skills directly with peer builders. Trade your mastery for the knowledge you want to conquer next.
            </p>
          </div>

          <Button size="sm" onClick={() => setModalOpen(true)} leftIcon={<PlusCircle className="w-4 h-4" />}>
            Post Skill Swap
          </Button>
        </div>

        {/* Exchange listings grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exchangeList.map((req) => (
            <div
              key={req.id}
              className="p-6 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs hover:border-indigo-200 hover:shadow-md transition-all flex flex-col justify-between"
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

                <div className="space-y-2 mb-4 text-xs">
                  <div className="p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 flex justify-between">
                    <span className="text-emerald-800 dark:text-emerald-300 font-semibold">Offering:</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{req.offeringSkill}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 flex justify-between">
                    <span className="text-indigo-800 dark:text-indigo-300 font-semibold">Seeking:</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{req.seekingSkill}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  "{req.message}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Posted {req.createdAt}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setConnectModalRequest(req);
                    setConnectSuccess(false);
                  }}
                  leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                >
                  Connect & Swap
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Create Post Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Create a Skill Exchange Request"
          description="List what skill you can teach and what skill you want to learn in exchange."
        >
          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            <Input
              label="Skill You Can Offer"
              required
              placeholder="e.g. Next.js 15 & React Server Components"
              value={offering}
              onChange={(e) => setOffering(e.target.value)}
            />

            <Input
              label="Skill You Want to Learn"
              required
              placeholder="e.g. Docker, Kubernetes & Helm Deployment"
              value={seeking}
              onChange={(e) => setSeeking(e.target.value)}
            />

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Exchange Details & Pair Programming Plan
              </label>
              <textarea
                rows={3}
                required
                placeholder="Describe your availability and what project you'd like to collaborate on..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Publish Exchange Listing
              </Button>
            </div>
          </form>
        </Modal>

        {/* Connect Modal */}
        <Modal
          isOpen={!!connectModalRequest}
          onClose={() => setConnectModalRequest(null)}
          title={connectSuccess ? 'Swap Request Sent!' : `Connect with ${connectModalRequest?.requester.name}`}
          description={
            connectSuccess
              ? 'We have connected both of you via SkillBridge chat.'
              : `Swap: ${connectModalRequest?.offeringSkill} ⇄ ${connectModalRequest?.seekingSkill}`
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
                    Pair Programming Match Initiated
                  </h4>
                  <p className="text-slate-500 max-w-xs mx-auto">
                    {connectModalRequest.requester.name} has been notified and sent your profile link.
                  </p>
                  <Button onClick={() => setConnectModalRequest(null)} className="mt-2">
                    Done
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    You are offering to mentor on <strong>{connectModalRequest.seekingSkill}</strong> in return for learning <strong>{connectModalRequest.offeringSkill}</strong>.
                  </p>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Initial Message
                    </label>
                    <textarea
                      rows={3}
                      defaultValue={`Hey ${connectModalRequest.requester.name}, saw your exchange listing! I'm verified in ${connectModalRequest.seekingSkill} and would love to pair up.`}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setConnectModalRequest(null)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setConnectSuccess(true)}>
                      Send Swap Invite
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
