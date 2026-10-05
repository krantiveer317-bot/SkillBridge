'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Calendar, Video, Clock } from 'lucide-react';
import { apiFetch } from '@/lib/api';

type AnyRecord = Record<string, any>;

export default function MentorSessionsPage() {
  const [sessions, setSessions] = useState<AnyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const result = await apiFetch<any>('/mentor/sessions/my');

        if (!mounted) return;

        setSessions(
          Array.isArray(result)
            ? result
            : result?.sessions ?? result?.data ?? []
        );
      } catch (err: any) {
        if (mounted) {
          setError(err?.message || 'Unable to load sessions.');
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

  const activeSessions = sessions.filter((session) => {
    const status = String(session?.status ?? '').toUpperCase();

    return ![
      'COMPLETED',
      'CANCELLED',
      'CANCELED',
      'REJECTED',
    ].includes(status);
  });

  const getStudentName = (session: AnyRecord) =>
    session?.student?.profile?.name ||
    session?.student?.name ||
    session?.studentName ||
    'Mentee';

  const getTitle = (session: AnyRecord) =>
    session?.title ||
    session?.topic ||
    'Mentorship Session';

  const getDate = (session: AnyRecord) => {
    const value =
      session?.startTime ??
      session?.scheduledAt ??
      session?.date ??
      session?.createdAt;

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
          <p className="text-sm text-slate-500">
            Loading sessions...
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

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-emerald-600" />
              <span>1-on-1 Mentorship Sessions</span>
            </h1>

            <p className="text-xs text-slate-500 mt-1">
              Sessions returned by your mentor account.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-xs">

          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Active Sessions ({activeSessions.length})
            </h3>

            <span className="text-xs text-slate-400">
              Backend session records
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">

            {activeSessions.map((session) => {
              const status =
                session?.status || 'Scheduled';

              return (
                <div
                  key={session.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600">
                      <Video className="w-5 h-5" />
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {getTitle(session)}
                      </h4>

                      <p className="text-xs text-slate-500">
                        {getStudentName(session)} · {getDate(session)}
                      </p>

                      {session?.duration && (
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {session.duration} minutes
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="success">
                      {status}
                    </Badge>
                  </div>
                </div>
              );
            })}

            {activeSessions.length === 0 && (
              <div className="p-10 text-center text-sm text-slate-500">
                No active sessions found.
              </div>
            )}
          </div>
        </div>

        {sessions.length > activeSessions.length && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
            {sessions.length - activeSessions.length} completed or cancelled
            session record(s) are also stored in the backend.
          </div>
        )}

      </div>
    </DashboardShell>
  );
}
