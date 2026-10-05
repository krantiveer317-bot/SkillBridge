'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Briefcase, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function NewJobPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [comp, setComp] = useState('$140,000 - $170,000 / yr');
  const [skills, setSkills] = useState('Next.js, TypeScript, Distributed Systems');
  const [tier, setTier] = useState('Mentor');
  const [desc, setDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
    }, 500);
  };

  return (
    <DashboardShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-sky-600" />
            <span>Post a New Role</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Specify verified proof criteria to automatically filter for qualified engineers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 space-y-5 shadow-xs">
          <Input
            label="Role Title"
            required
            placeholder="e.g. Senior Infrastructure Engineer (Edge Compute)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Opportunity Type"
              options={[
                { value: 'job', label: 'Full-Time Engineering Job' },
                { value: 'internship', label: 'Paid Engineering Internship' },
                { value: 'freelance', label: 'Contract / Freelance Sprint' },
              ]}
            />
            <Select
              label="Location Policy"
              options={[
                { value: 'remote', label: '100% Remote (Global)' },
                { value: 'hybrid', label: 'Hybrid (San Francisco, CA)' },
                { value: 'onsite', label: 'On-site Only' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Compensation / Stipend"
              required
              value={comp}
              onChange={(e) => setComp(e.target.value)}
              placeholder="e.g. $140,000 - $170,000 / yr"
            />
            <Select
              label="Minimum Required Proof-of-Work Tier"
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              options={[
                { value: 'None', label: 'Open (No minimum proof required)' },
                { value: 'Peer', label: 'Level 1: Peer Verified (At least 2 peer reviews)' },
                { value: 'Mentor', label: 'Level 2: Mentor Reviewed (Recommended)' },
                { value: 'Industry', label: 'Level 3: Industry Audited (Direct bypass)' },
              ]}
            />
          </div>

          <Input
            label="Required Verified Skills (Comma-separated)"
            required
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. Go, Raft, Distributed Systems, Next.js"
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Role Scope & Technical Responsibilities
            </label>
            <textarea
              rows={4}
              required
              placeholder="Describe what the engineer will build, key architectural challenges, and team structure..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Publish Role to Marketplace
            </Button>
          </div>
        </form>

        <Modal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            router.push('/company/jobs');
          }}
          title="Role Successfully Published!"
          description="Your opening is now live and matched against verified student builders."
        >
          <div className="text-center py-4 space-y-3 text-xs">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Live on SkillBridge Marketplace
            </h4>
            <p className="text-slate-500 max-w-sm mx-auto">
              Candidates meeting your Level {tier} requirement will be notified immediately.
            </p>
            <Button
              className="mt-2"
              onClick={() => {
                setShowSuccessModal(false);
                router.push('/company/jobs');
              }}
            >
              View Active Jobs
            </Button>
          </div>
        </Modal>
      </div>
    </DashboardShell>
  );
}
