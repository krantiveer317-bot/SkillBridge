'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { mockCurrentUser } from '@/data/mockData';
import { Settings, Save, CheckCircle2, Shield, Bell } from 'lucide-react';
import { Github } from '@/components/ui/Icons';

export default function StudentSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(mockCurrentUser.name);
  const [title, setTitle] = useState(mockCurrentUser.title);
  const [bio, setBio] = useState(mockCurrentUser.bio || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <DashboardShell>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-600" />
            <span>Account Settings & Preferences</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your public profile, notification settings, and GitHub integration.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Profile Details */}
          <div className="p-6 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
              Public Profile Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Primary Professional Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Bio & Engineering Focus
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="GitHub Profile URL"
                defaultValue={mockCurrentUser.githubUrl}
              />
              <Input
                label="Personal Website / Portfolio"
                defaultValue={mockCurrentUser.portfolioUrl}
              />
            </div>
          </div>

          {/* Connected Accounts */}
          <div className="p-6 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
              Connected Developer Integrations
            </h3>

            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <Github className="w-5 h-5 text-slate-900 dark:text-slate-100" />
                <div>
                  <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">GitHub Organization Sync</div>
                  <p className="text-[11px] text-slate-500">Connected as @alexrivera-dev (Public repos & test CI access)</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                Connected
              </span>
            </div>
          </div>

          {/* Notifications */}
          <div className="p-6 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
              Notification Preferences
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer">
                <span className="text-slate-700 dark:text-slate-300">Email alerts when a project proof is verified</span>
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              </label>
              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer">
                <span className="text-slate-700 dark:text-slate-300">New job or internship matches based on my Skill Passport</span>
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              </label>
              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer">
                <span className="text-slate-700 dark:text-slate-300">Freelance proposal status changes and escrow milestones</span>
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {saved && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Changes successfully saved</span>
              </span>
            )}
            <div className="ml-auto">
              <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>
                Save Preferences
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
