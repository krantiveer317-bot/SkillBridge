'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { mockMentors } from '@/data/mockData';
import { Save, CheckCircle2, UserCheck, Star } from 'lucide-react';

export default function MentorProfilePage() {
  const mentor = mockMentors[0];
  const [rate, setRate] = useState(mentor.hourlyRate.toString());
  const [bio, setBio] = useState(mentor.bio);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <DashboardShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-emerald-600" />
            <span>Mentor Profile & Rates</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure your public mentor bio, areas of expertise, and hourly consulting rate.
          </p>
        </div>

        <form onSubmit={handleSave} className="p-6 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 space-y-5 shadow-xs">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="relative h-16 w-16 rounded-2xl overflow-hidden border border-slate-200 shrink-0">
              <Image src={mentor.avatar} alt={mentor.name} fill className="object-cover" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{mentor.name}</h3>
              <p className="text-xs text-slate-500">{mentor.title} @ {mentor.company}</p>
              <div className="flex items-center gap-1 text-xs text-amber-500 mt-1 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <span>{mentor.rating} ({mentor.reviewsCount} reviews)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Hourly Consulting Rate (USD)"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="e.g. 85"
            />
            <Input
              label="Current Employer / Title"
              defaultValue={`${mentor.title} at ${mentor.company}`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Mentor Bio & Mentoring Philosophy
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Expertise & Domains (Comma-separated)
            </label>
            <input
              type="text"
              defaultValue={mentor.expertise.join(', ')}
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {saved && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile updated</span>
              </span>
            )}
            <div className="ml-auto">
              <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>
                Save Profile
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
