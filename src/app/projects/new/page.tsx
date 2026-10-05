'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import {
  FolderGit2,
  Globe,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { Github } from '@/components/ui/Icons';

export default function NewProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [skills, setSkills] = useState('Go, Raft, Distributed Systems, Docker');
  const [requestedTier, setRequestedTier] = useState('Level 2: Mentor Reviewed');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
    }, 600);
  };

  return (
    <DashboardShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Submit Project for Proof Verification
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Provide your public repository details to initiate the automated test runner and peer code review ring.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 space-y-5 shadow-xs">
          <Input
            label="Project Title"
            required
            placeholder="e.g. NexusKV: Distributed Raft Consensus Key-Value Store"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Project Architecture & Technical Summary
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe concurrency primitives, memory management, testing strategies, and edge conditions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="GitHub Repository URL"
              required
              placeholder="https://github.com/username/project"
              leftIcon={<Github className="w-4 h-4" />}
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />

            <Input
              label="Live Production Demo URL (Optional)"
              placeholder="https://project.dev"
              leftIcon={<Globe className="w-4 h-4" />}
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
            />
          </div>

          <Input
            label="Key Technologies / Skills (Comma-separated)"
            required
            placeholder="Go, Raft Consensus, gRPC, Docker, PostgreSQL"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />

          <Select
            label="Requested Verification Tier"
            value={requestedTier}
            onChange={(e) => setRequestedTier(e.target.value)}
            options={[
              { value: 'Level 1: Peer Verified', label: 'Level 1: Peer Verified (Automated tests + 2 peer audits)' },
              { value: 'Level 2: Mentor Reviewed', label: 'Level 2: Mentor Reviewed (Senior Staff Engineer architecture review)' },
              { value: 'Level 3: Industry Audited', label: 'Level 3: Industry Audited (Direct hiring partner audit)' },
            ]}
          />

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Automated Verification Criteria</span>
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Once submitted, our bot will verify repository commits, analyze test coverage (minimum 80% required for L2/L3), and assign two reviewers from your technical domain.
            </p>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Submit for Proof Audit
            </Button>
          </div>
        </form>

        {/* Success Modal */}
        <Modal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            router.push('/verification');
          }}
          title="Project Submitted for Verification"
          description="Your repository has been added to the active audit queue."
        >
          <div className="text-center py-4 space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Audit Pipeline Running
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Automated tests are compiling. Track your review comments in the Verification Hub.
            </p>
            <Button
              className="mt-2"
              onClick={() => {
                setShowSuccessModal(false);
                router.push('/verification');
              }}
            >
              Go to Verification Hub
            </Button>
          </div>
        </Modal>
      </div>
    </DashboardShell>
  );
}
