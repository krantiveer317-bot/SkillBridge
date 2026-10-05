'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProfileCard } from '@/components/ui/ProfileCard';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { apiFetch } from '@/lib/api';
import {
  Search,
  Sparkles,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

interface Freelancer {
  id: string;
  name: string;
  title: string;
  avatar?: string | null;
  bio?: string | null;
  skills: string[];
  verified?: boolean;
  rating?: number;
  reviewsCount?: number;
  hourlyRate?: number;
  location?: string | null;
}

export default function FreelancersPage() {
  const [search, setSearch] = useState('');
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [selectedFreelancer, setSelectedFreelancer] =
    useState<Freelancer | null>(null);
  const [messageSent, setMessageSent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadFreelancers() {
      try {
        setLoading(true);
        setError('');

        const result = await apiFetch<any>(
          '/freelance?page=1&limit=100',
          { auth: false }
        );

        if (cancelled) return;

        const rows = Array.isArray(result)
          ? result
          : result?.freelancers ??
            result?.workers ??
            result?.data ??
            result?.contracts ??
            [];

        const mapped: Freelancer[] = rows
          .map((item: any) => {
            const worker =
              item?.worker ||
              item?.freelancer ||
              item?.user ||
              item?.client ||
              item;

            const profile =
              worker?.profile ||
              item?.profile ||
              {};

            const skills =
              item?.skills ??
              worker?.skills ??
              profile?.skills ??
              [];

            return {
              id: String(
                worker?.id ??
                  item?.workerId ??
                  item?.freelancerId ??
                  item?.id
              ),
              name:
                profile?.name ||
                worker?.name ||
                worker?.email?.split('@')[0] ||
                'SkillBridge Member',
              title:
                profile?.title ||
                item?.title ||
                'Freelance Builder',
              avatar:
                profile?.avatar ||
                worker?.avatar ||
                null,
              bio:
                profile?.bio ||
                item?.description ||
                item?.bio ||
                null,
              skills: Array.isArray(skills)
                ? skills.map((skill: any) =>
                    typeof skill === 'string'
                      ? skill
                      : skill?.skill?.name ||
                        skill?.name ||
                        ''
                  ).filter(Boolean)
                : [],
              verified:
                Boolean(
                  worker?.isVerified ??
                    item?.isVerified ??
                    profile?.isVerified
                ),
              rating:
                Number(
                  item?.rating ??
                    worker?.rating ??
                    0
                ) || 0,
              reviewsCount:
                Number(
                  item?.reviewsCount ??
                    worker?.reviewsCount ??
                    0
                ) || 0,
              hourlyRate:
                Number(
                  item?.hourlyRate ??
                    item?.rate ??
                    worker?.hourlyRate ??
                    0
                ) || 0,
              location:
                profile?.location ||
                item?.location ||
                null,
            };
          })
          .filter((item: Freelancer) => item.id);

        setFreelancers(mapped);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load freelancers.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadFreelancers();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredFreelancers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return freelancers;

    return freelancers.filter((fl) => {
      return (
        fl.name.toLowerCase().includes(query) ||
        fl.title.toLowerCase().includes(query) ||
        fl.bio?.toLowerCase().includes(query) ||
        fl.skills.some((skill) =>
          skill.toLowerCase().includes(query)
        )
      );
    });
  }, [freelancers, search]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Audited Freelance Talent</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Hire Verified Student Builders
          </h1>

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Discover builders and freelance talent available through
            SkillBridge.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />

            <input
              type="text"
              placeholder="Search by skill, discipline, or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Loader2 className="w-7 h-7 animate-spin text-indigo-600" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
            {error}
          </div>
        ) : filteredFreelancers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
            <Sparkles className="w-10 h-10 mx-auto text-slate-400 mb-3" />

            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              No freelancers found
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Try a different search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFreelancers.map((fl) => (
              <ProfileCard
                key={fl.id}
                id={fl.id}
                name={fl.name}
                avatar={
                  fl.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    fl.name
                  )}&background=4f46e5&color=ffffff`
                }
                title={fl.title}
                bio={fl.bio || "SkillBridge freelance builder"}
                skills={fl.skills}
                rating={fl.rating}
                reviewsCount={fl.reviewsCount}
                hourlyRate={fl.hourlyRate}
                verifiedTier={fl.verified ? "industry" : undefined}
                type="freelancer"
                actionLabel="Hire Builder"
                onAction={() => {
                  setSelectedFreelancer(fl);
                  setMessageSent(false);
                }}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />

      <Modal
        isOpen={!!selectedFreelancer}
        onClose={() => setSelectedFreelancer(null)}
        title={selectedFreelancer?.name || 'Freelancer'}
      >
        {selectedFreelancer && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-full overflow-hidden">
                <img
                  src={
                    selectedFreelancer.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      selectedFreelancer.name
                    )}&background=4f46e5&color=ffffff`
                  }
                  alt={selectedFreelancer.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100">
                  {selectedFreelancer.name}
                </h3>

                <p className="text-xs text-slate-500">
                  {selectedFreelancer.title}
                </p>
              </div>
            </div>

            {selectedFreelancer.bio && (
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {selectedFreelancer.bio}
              </p>
            )}

            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">
                Skills
              </p>

              <div className="flex flex-wrap gap-2">
                {selectedFreelancer.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {selectedFreelancer.rating || '—'}
                </p>
                <p className="text-[10px] text-slate-500">Rating</p>
              </div>

              <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {selectedFreelancer.reviewsCount || 0}
                </p>
                <p className="text-[10px] text-slate-500">Reviews</p>
              </div>

              <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {selectedFreelancer.hourlyRate
                    ? `$${selectedFreelancer.hourlyRate}`
                    : '—'}
                </p>
                <p className="text-[10px] text-slate-500">Hourly</p>
              </div>
            </div>

            {messageSent ? (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center dark:bg-emerald-950/20 dark:border-emerald-900/50">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  Contact request recorded.
                </p>
              </div>
            ) : (
              <div className="flex justify-end">
                <Button
                  onClick={() => setMessageSent(true)}
                >
                  Contact Freelancer
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}


