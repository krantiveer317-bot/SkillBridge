'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Trophy, PlusCircle, Users, ArrowRight, Sparkles } from 'lucide-react';

export default function CompanyChallengesPage() {
  const challenges = [
    {
      id: 'ch-1',
      title: 'Vercel Edge Streaming Hackathon 2025',
      prizePool: '$25,000 in Bounties',
      participants: 340,
      daysLeft: 14,
      category: 'Systems & Web Frameworks',
      status: 'In Progress',
    },
    {
      id: 'ch-2',
      title: 'Serverless Real-Time CRDT Canvas Challenge',
      prizePool: '$15,000 in Bounties',
      participants: 210,
      daysLeft: 22,
      category: 'Real-time WebRTC & CRDTs',
      status: 'Open Registration',
    },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-sky-600" />
              <span>Hackathons & Coding Challenges</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Host competitive engineering hackathons to discover and recruit high-velocity builders.
            </p>
          </div>

          <Button size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Host a Hackathon
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((ch) => (
            <div
              key={ch.id}
              className="p-6 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={ch.status === 'In Progress' ? 'success' : 'info'}>
                    {ch.status}
                  </Badge>
                  <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                    {ch.prizePool}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {ch.title}
                </h3>
                <p className="text-xs text-slate-500 mb-4">{ch.category}</p>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ch.participants} Enrolled Builders</span>
                  </span>
                  <span>{ch.daysLeft} days remaining</span>
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Judged by Staff Engineers</span>
                <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Challenge Console
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
