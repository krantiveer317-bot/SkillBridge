'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatsCard } from '@/components/ui/StatsCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockMentors, mockVerificationRequests } from '@/data/mockData';
import {
  Users,
  Calendar,
  Star,
  DollarSign,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Video,
} from 'lucide-react';

export default function MentorDashboardPage() {
  const mentor = mockMentors[0]; // Sarah Chen

  return (
    <DashboardShell>
      <div className="space-y-8">
        {/* Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50/80 via-white to-white dark:border-slate-800 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 rounded-2xl overflow-hidden border-2 border-emerald-500/30 shrink-0">
              <Image src={mentor.avatar} alt={mentor.name} fill className="object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Mentor Hub: {mentor.name}
                </h1>
                <Badge variant="success">Staff Mentor @ {mentor.company}</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                You have 2 upcoming 1-on-1 sessions today and 3 pull request audits in your queue.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/mentor/sessions">
              <Button size="sm" leftIcon={<Calendar className="w-3.5 h-3.5" />}>
                Manage Slots
              </Button>
            </Link>
            <Link href="/mentor/profile">
              <Button size="sm" variant="outline">
                Edit Rate (${mentor.hourlyRate}/hr)
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Total Mentees"
            value="112 Mentees"
            change="+14 this month"
            isPositive={true}
            icon={<Users className="w-4 h-4 text-emerald-600" />}
            description="Across 28 universities"
          />
          <StatsCard
            label="Upcoming Sessions"
            value="4 Scheduled"
            change="2 today"
            isPositive={true}
            icon={<Calendar className="w-4 h-4 text-indigo-600" />}
            description="Next in 2 hours"
          />
          <StatsCard
            label="Review Rating"
            value="4.98 / 5.0"
            change="64 reviews"
            isPositive={true}
            icon={<Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
            description="100% positive feedback"
          />
          <StatsCard
            label="Monthly Revenue"
            value="$4,280"
            change="+22% MoM"
            isPositive={true}
            icon={<DollarSign className="w-4 h-4 text-purple-600" />}
            description="Direct deposit enabled"
          />
        </div>

        {/* Sessions and Audit Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 cols: Upcoming sessions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Upcoming 1-on-1 Sessions
                </h3>
                <p className="text-xs text-slate-500">Confirmed video consultations with student builders</p>
              </div>
              <Link href="/mentor/sessions">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Calendar
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Distributed Systems Architecture with Alex Rivera
                    </h4>
                    <p className="text-xs text-slate-500">
                      Today • 4:00 PM - 5:00 PM PST • Raft consensus review
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Badge variant="success">Confirmed</Badge>
                  <Button size="sm">Join Video Room</Button>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Mock System Design Screen with Elena Rostova
                    </h4>
                    <p className="text-xs text-slate-500">
                      Tomorrow • 10:00 AM - 11:00 AM PST • High-throughput telemetry
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Badge variant="default">Tomorrow</Badge>
                  <Button size="sm" variant="outline">Prepare Notes</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right 1 col: Pending Code Audit Queue */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Audits In Queue</span>
              </h3>
              <span className="text-xs text-slate-400">3 Pending</span>
            </div>

            <div className="space-y-3">
              {mockVerificationRequests.slice(0, 2).map((vr) => (
                <div
                  key={vr.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 space-y-2 text-xs"
                >
                  <div className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                    {vr.projectTitle}
                  </div>
                  <p className="text-slate-500">Applicant: {vr.applicantName}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-indigo-600 font-medium">{vr.requestedLevel}</span>
                    <Button size="sm" variant="outline">Review Code</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
