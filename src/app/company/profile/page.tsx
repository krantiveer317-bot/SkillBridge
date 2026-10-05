'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { apiFetch } from '@/lib/api';
import { Building2, Save, CheckCircle2, AlertCircle } from 'lucide-react';

type Company = {
  id: string;
  name: string;
  logoUrl: string | null;
  website: string | null;
  description: string | null;
  industry: string | null;
  size: string | null;
  location: string | null;
  isVerified: boolean;
};

export default function CompanyProfilePage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState('');
  const [location, setLocation] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCompany = async () => {
      try {
        setLoading(true);
        setError('');

        const result = await apiFetch<Company>('/company/my');

        setCompany(result);
        setName(result.name ?? '');
        setWebsite(result.website ?? '');
        setDescription(result.description ?? '');
        setIndustry(result.industry ?? '');
        setSize(result.size ?? '');
        setLocation(result.location ?? '');
        setLogoUrl(result.logoUrl ?? '');
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load company profile.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadCompany();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setSaved(false);
      setError('');

      const updated = await apiFetch<Company>('/company/my', {
        method: 'PATCH',
        body: JSON.stringify({
          name,
          website,
          description,
          industry,
          size,
          location,
          logoUrl,
        }),
      });

      setCompany(updated);

      setName(updated.name ?? '');
      setWebsite(updated.website ?? '');
      setDescription(updated.description ?? '');
      setIndustry(updated.industry ?? '');
      setSize(updated.size ?? '');
      setLocation(updated.location ?? '');
      setLogoUrl(updated.logoUrl ?? '');

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update company profile.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-sky-600" />
            Loading company profile...
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (error && !company) {
    return (
      <DashboardShell>
        <div className="max-w-2xl mx-auto rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-950/20">
          <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-500" />
          <h2 className="font-semibold text-red-700 dark:text-red-400">
            Unable to load company profile
          </h2>
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-sky-600" />
            <span>Company Brand & Profile</span>
          </h1>

          <p className="text-xs text-slate-500 mt-1">
            Manage the company information shown across SkillBridge.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSave}
          className="p-6 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 space-y-5 shadow-xs"
        >
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="h-16 w-16 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={name || 'Company'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 className="w-7 h-7 text-slate-400" />
              )}
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {name || 'Company'}
              </h3>

              <div className="flex items-center gap-2 mt-1">
                {company?.isVerified && (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-xs text-emerald-600">
                      Verified company
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Bengaluru, India"
            />

            <Input
              label="Industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. Software / Technology"
            />

            <Input
              label="Company Size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="e.g. 51-200"
            />

            <Input
              label="Website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
            />

            <Input
              label="Logo URL"
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Company Description
            </label>

            <textarea
              rows={5}
              maxLength={3000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your company, products and engineering culture..."
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />

            <div className="text-right text-[10px] text-slate-400 mt-1">
              {description.length}/3000
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {saved ? (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Company profile updated
              </span>
            ) : (
              <span className="text-[11px] text-slate-400">
                Changes are saved to your company profile.
              </span>
            )}

            <Button
              type="submit"
              disabled={saving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
