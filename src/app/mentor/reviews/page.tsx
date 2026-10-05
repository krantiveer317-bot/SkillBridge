'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatsCard } from '@/components/ui/StatsCard';
import { MessageSquare, Star, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';

type AnyRecord = Record<string, any>;

export default function MentorReviewsPage() {
  const [mentor, setMentor] = useState<AnyRecord | null>(null);
  const [reviews, setReviews] = useState<AnyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const mine = await apiFetch<any>('/mentor/my');

        if (!mounted) return;

        const mentorData = mine?.mentor ?? mine;

        setMentor(mentorData);

        const mentorId = mentorData?.id;

        if (!mentorId) {
          setReviews([]);
          return;
        }

        const detail = await apiFetch<any>(
          `/mentor/${mentorId}`,
          { auth: true }
        );

        if (!mounted) return;

        const detailData = detail?.mentor ?? detail;

        setReviews(
          Array.isArray(detailData?.reviews)
            ? detailData.reviews
            : []
        );
      } catch (err: any) {
        if (mounted) {
          setError(err?.message || 'Unable to load mentor reviews.');
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

  const rating = Number(mentor?.rating ?? 0);

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-slate-500">
            Loading reviews...
          </p>
        </div>
      </DashboardShell>
    );
  }

  if (error) {
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
      <div className="space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-600" />
            <span>Mentee Reviews & Feedback</span>
          </h1>

          <p className="text-xs text-slate-500 mt-1">
            Reviews returned by your mentor profile.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            label="Average Rating"
            value={rating > 0 ? `${rating.toFixed(2)} / 5.0` : 'Not rated'}
            change="Current mentor rating"
            isPositive={rating > 0}
            icon={<Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
          />

          <StatsCard
            label="Total Reviews"
            value={`${reviews.length}`}
            change="Returned by backend"
            isPositive={true}
            icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          />

          <StatsCard
            label="Feedback"
            value={reviews.length > 0 ? 'Available' : 'None'}
            change="Current profile data"
            isPositive={reviews.length > 0}
            icon={<MessageSquare className="w-4 h-4 text-indigo-600" />}
          />
        </div>

        <div className="space-y-4">
          {reviews.map((review) => {
            const reviewer =
              review?.user ??
              review?.student ??
              review?.reviewer ??
              review?.author ??
              {};

            const profile =
              reviewer?.profile ??
              {};

            const name =
              profile?.name ??
              reviewer?.name ??
              review?.authorName ??
              'Mentee';

            const comment =
              review?.comment ??
              review?.content ??
              review?.feedback ??
              'No written feedback provided.';

            const reviewRating =
              Number(review?.rating ?? 0);

            const dateValue =
              review?.createdAt ??
              review?.date;

            let date = '—';

            if (dateValue) {
              const parsed = new Date(dateValue);
              date = Number.isNaN(parsed.getTime())
                ? String(dateValue)
                : parsed.toLocaleDateString();
            }

            return (
              <div
                key={review.id}
                className="p-6 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center text-sm font-bold text-emerald-600">
                      {name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {name}
                      </h4>

                      <p className="text-xs text-slate-400">
                        {review?.session?.title ||
                          review?.sessionType ||
                          'Mentorship Session'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-amber-500">
                      {[...Array(Math.max(0, Math.min(5, reviewRating)))].map(
                        (_, index) => (
                          <Star
                            key={index}
                            className="w-3.5 h-3.5 fill-amber-500"
                          />
                        )
                      )}
                    </div>

                    <span className="text-xs text-slate-400">
                      {date}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  “{comment}”
                </p>
              </div>
            );
          })}

          {reviews.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
              No reviews are currently available for this mentor profile.
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
