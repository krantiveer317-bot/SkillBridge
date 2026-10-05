'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Save, CheckCircle2, UserCheck, Star } from 'lucide-react';
import { apiFetch } from '@/lib/api';

type AnyRecord = Record<string, any>;

export default function MentorProfilePage() {
  const [mentor, setMentor] = useState<AnyRecord | null>(null);

  const [rate, setRate] = useState('');
  const [bio, setBio] = useState('');
  const [expertise, setExpertise] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const result = await apiFetch<any>('/mentor/my');

        if (!mounted) return;

        const data = result?.mentor ?? result;

        setMentor(data);

        setRate(
          data?.hourlyRate !== undefined &&
          data?.hourlyRate !== null
            ? String(data.hourlyRate)
            : ''
        );

        setBio(data?.bio ?? '');

        const expertiseValue = data?.expertise;

        setExpertise(
          Array.isArray(expertiseValue)
            ? expertiseValue.join(', ')
            : expertiseValue ?? ''
        );
      } catch (err: any) {
        if (mounted) {
          setError(err?.message || 'Unable to load mentor profile.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();

    setSaving(true);
    setSaved(false);
    setError('');

    try {
      const parsedRate = Number(rate);

      if (!Number.isFinite(parsedRate) || parsedRate < 0) {
        throw new Error('Hourly rate must be a valid non-negative number.');
      }

      const expertiseArray = expertise
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

      const result = await apiFetch<any>('/mentor/my', {
        method: 'PATCH',
        body: JSON.stringify({
          hourlyRate: parsedRate,
          bio,
          expertise: expertiseArray,
        }),
      });

      const updated = result?.mentor ?? result;

      if (updated) {
        setMentor(updated);
      }

      setSaved(true);
    } catch (err: any) {
      setError(err?.message || 'Unable to update mentor profile.');
    } finally {
      setSaving(false);
    }
  }

  const profile =
    mentor?.user?.profile ??
    mentor?.profile ??
    {};

  const name =
    mentor?.user?.name ||
    profile?.name ||
    mentor?.name ||
    'Mentor';

  const avatar =
    profile?.avatarUrl ||
    profile?.avatar ||
    mentor?.avatarUrl ||
    mentor?.avatar;

  const rating =
    Number(mentor?.rating ?? 0);

  const reviewsCount =
    Number(
      mentor?.reviewsCount ??
      mentor?._count?.reviews ??
      0
    );

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-slate-500">
            Loading mentor profile...
          </p>
        </div>
      </DashboardShell>
    );
  }

  if (error && !mentor) {
    return (
      <DashboardShell>
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      </DashboardShell>
    );
  }

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

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSave}
          className="p-6 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 space-y-5 shadow-xs"
        >

          <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="h-16 w-16 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-emerald-600">
                  {name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {name}
              </h3>

              <div className="flex items-center gap-1 text-xs text-amber-500 mt-1 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-500" />

                <span>
                  {rating > 0 ? rating.toFixed(2) : 'Not rated'}
                  {' '}
                  ({reviewsCount} reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Hourly Consulting Rate (USD)"
              type="number"
              min="0"
              step="0.01"
              value={rate}
              onChange={(event) => setRate(event.target.value)}
              placeholder="e.g. 85"
            />

            <Input
              label="Mentor Status"
              value={
                mentor?.isVerified
                  ? 'Verified Mentor'
                  : 'Mentor'
              }
              readOnly
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Mentor Bio & Mentoring Philosophy
            </label>

            <textarea
              rows={5}
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Expertise & Domains
            </label>

            <input
              type="text"
              value={expertise}
              onChange={(event) => setExpertise(event.target.value)}
              placeholder="React, Node.js, System Design"
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />

            <p className="text-[11px] text-slate-400 mt-1">
              Separate expertise areas with commas.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            {saved && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile updated</span>
              </span>
            )}

            <div className="ml-auto">
              <Button
                type="submit"
                disabled={saving}
                leftIcon={<Save className="w-4 h-4" />}
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </div>

        </form>
      </div>
    </DashboardShell>
  );
}
