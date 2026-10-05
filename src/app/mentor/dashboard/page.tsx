'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatsCard } from '@/components/ui/StatsCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { apiFetch } from '@/lib/api';
import {
  Users,
  Calendar,
  Star,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Video,
} from 'lucide-react';

type AnyRecord = Record<string, any>;

export default function MentorDashboardPage() {
  const [mentor, setMentor] = useState<AnyRecord | null>(null);
  const [sessions, setSessions] = useState<AnyRecord[]>([]);
  const [payments, setPayments] = useState<AnyRecord[]>([]);
  const [verificationRequests, setVerificationRequests] = useState<AnyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError('');

        const results = await Promise.allSettled([
          apiFetch<any>('/mentor/my'),
          apiFetch<any>('/mentor/sessions/my'),
          apiFetch<any>('/payments/my?limit=100'),
          apiFetch<any>('/verification/my'),
        ]);

        if (!mounted) return;

        const mentorResult = results[0];
        const sessionsResult = results[1];
        const paymentsResult = results[2];
        const verificationResult = results[3];

        if (mentorResult.status === 'fulfilled') {
          setMentor(mentorResult.value?.mentor ?? mentorResult.value ?? null);
        }

        if (sessionsResult.status === 'fulfilled') {
          const value = sessionsResult.value;
          setSessions(
            Array.isArray(value)
              ? value
              : value?.sessions ?? value?.data ?? []
          );
        }

        if (paymentsResult.status === 'fulfilled') {
          const value = paymentsResult.value;
          setPayments(
            Array.isArray(value)
              ? value
              : value?.transactions ?? value?.data ?? []
          );
        }

        if (verificationResult.status === 'fulfilled') {
          const value = verificationResult.value;
          setVerificationRequests(
            Array.isArray(value)
              ? value
              : value?.requests ?? value?.verifications ?? value?.data ?? []
          );
        }

        const failed = results.filter(
          (result) => result.status === 'rejected'
        );

        if (
          !mentorResult ||
          mentorResult.status === 'rejected'
        ) {
          throw new Error(
            mentorResult.status === 'rejected'
              ? mentorResult.reason?.message || 'Unable to load mentor profile.'
              : 'Unable to load mentor profile.'
          );
        }

        if (failed.length > 0) {
          console.warn('Some mentor dashboard requests failed:', failed);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err?.message || 'Unable to load mentor dashboard.');
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

  const profile = mentor?.user?.profile ?? mentor?.profile ?? {};
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

  const hourlyRate =
    Number(mentor?.hourlyRate ?? 0);

  const rating =
    Number(mentor?.rating ?? 0);

  const reviewsCount =
    Number(
      mentor?.reviewsCount ??
      mentor?._count?.reviews ??
      mentor?.reviews?.length ??
      0
    );

  const upcomingSessions = sessions.filter((session) => {
    const status = String(session?.status ?? '').toUpperCase();
    return !['COMPLETED', 'CANCELLED', 'CANCELED', 'REJECTED'].includes(status);
  });

  const pendingVerifications = verificationRequests.filter((request) => {
    const status = String(request?.status ?? '').toUpperCase();
    return !['APPROVED', 'REJECTED', 'COMPLETED'].includes(status);
  });

  const revenue = payments.reduce((sum, payment) => {
    const status = String(payment?.status ?? '').toUpperCase();

    if (
      ['FAILED', 'CANCELLED', 'CANCELED', 'REFUNDED'].includes(status)
    ) {
      return sum;
    }

    return sum + Number(
      payment?.amount ??
      payment?.total ??
      payment?.netAmount ??
      0
    );
  }, 0);

  const sessionStudentName = (session: AnyRecord) =>
    session?.student?.profile?.name ||
    session?.student?.name ||
    session?.student?.profile?.firstName ||
    session?.studentName ||
    'Mentee';

  const sessionTitle = (session: AnyRecord) =>
    session?.title ||
    session?.topic ||
    session?.notes ||
    'Mentorship Session';

  const formatDate = (value: any) => {
    if (!value) return 'Date not specified';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-slate-500">Loading mentor dashboard...</p>
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
      <div className="space-y-8">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50/80 via-white to-white dark:border-slate-800 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl overflow-hidden border-2 border-emerald-500/30 shrink-0 bg-slate-100 flex items-center justify-center">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold text-emerald-600">
                  {name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Mentor Hub: {name}
                </h1>

                {mentor?.isVerified && (
                  <Badge variant="success">Verified Mentor</Badge>
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {upcomingSessions.length} active upcoming session
                {upcomingSessions.length === 1 ? '' : 's'} and{' '}
                {pendingVerifications.length} pending verification request
                {pendingVerifications.length === 1 ? '' : 's'}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/mentor/sessions">
              <Button size="sm" leftIcon={<Calendar className="w-3.5 h-3.5" />}>
                Sessions
              </Button>
            </Link>

            <Link href="/mentor/profile">
              <Button size="sm" variant="outline">
                Edit Rate
                {hourlyRate > 0 ? ` ($${hourlyRate}/hr)` : ''}
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Mentees / Sessions"
            value={`${upcomingSessions.length}`}
            change="Active sessions"
            isPositive={true}
            icon={<Users className="w-4 h-4 text-emerald-600" />}
            description="Based on current session records"
          />

          <StatsCard
            label="Upcoming Sessions"
            value={`${upcomingSessions.length}`}
            change="Scheduled"
            isPositive={true}
            icon={<Calendar className="w-4 h-4 text-indigo-600" />}
            description="From your mentor session records"
          />

          <StatsCard
            label="Review Rating"
            value={rating > 0 ? `${rating.toFixed(2)} / 5.0` : 'Not rated'}
            change={`${reviewsCount} reviews`}
            isPositive={rating > 0}
            icon={<Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
            description="Reported by the mentor profile"
          />

          <StatsCard
            label="Recorded Revenue"
            value={`$${revenue.toFixed(2)}`}
            change={`${payments.length} transactions`}
            isPositive={revenue > 0}
            icon={<DollarSign className="w-4 h-4 text-purple-600" />}
            description="From payment records"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Upcoming Sessions
                </h3>
                <p className="text-xs text-slate-500">
                  Sessions returned by your mentor account
                </p>
              </div>

              <Link href="/mentor/sessions">
                <Button
                  variant="ghost"
                  size="sm"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  View All
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingSessions.slice(0, 5).map((session) => (
                <div
                  key={session.id}
                  className="p-4 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600">
                      <Video className="w-5 h-5" />
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {sessionTitle(session)}
                      </h4>

                      <p className="text-xs text-slate-500">
                        {sessionStudentName(session)} ·{' '}
                        {formatDate(
                          session.startTime ??
                          session.scheduledAt ??
                          session.date
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Badge variant="success">
                      {session.status || 'Scheduled'}
                    </Badge>
                  </div>
                </div>
              ))}

              {upcomingSessions.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                  No upcoming sessions found.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verification Queue</span>
              </h3>

              <span className="text-xs text-slate-400">
                {pendingVerifications.length} Pending
              </span>
            </div>

            <div className="space-y-3">
              {pendingVerifications.slice(0, 5).map((request) => (
                <div
                  key={request.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 space-y-2 text-xs"
                >
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {request.project?.title ||
                      request.projectTitle ||
                      'Verification Request'}
                  </div>

                  <p className="text-slate-500">
                    Status: {request.status || 'Pending'}
                  </p>

                  <div className="pt-1">
                    <Link href="/verification">
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}

              {pendingVerifications.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500">
                  No pending verification requests.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardShell>
  );
}
