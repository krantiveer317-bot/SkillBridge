'use client';

import React from 'react';
import Image from 'next/image';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatsCard } from '@/components/ui/StatsCard';
import { MessageSquare, Star, CheckCircle2 } from 'lucide-react';

export default function MentorReviewsPage() {
  const reviews = [
    {
      id: 'rev-1',
      author: 'Alex Rivera',
      title: 'Full-Stack Systems Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces&auto=format&q=80',
      rating: 5,
      date: '3 days ago',
      comment: 'Sarah’s architecture review of my Raft consensus project was incredible. She pointed out a subtle split-brain edge condition in my log compaction logic that would have failed under heavy network partitioning. 10/10 recommend her sessions.',
      sessionType: '1-on-1 Distributed Systems Audit',
    },
    {
      id: 'rev-2',
      author: 'Elena Rostova',
      title: 'DevOps & SRE Builder',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces&auto=format&q=80',
      rating: 5,
      date: '1 week ago',
      comment: 'Did a mock staff engineering interview with Sarah. The feedback on communication clarity, whiteboard system sizing, and trade-off justification helped me land my offer at Spotify!',
      sessionType: 'Mock System Design Screen',
    },
    {
      id: 'rev-3',
      author: 'Marcus Vance',
      title: 'Cryptographic Systems Builder',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces&auto=format&q=80',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Super thorough code auditor. Reviewed my Go memory allocations and helped benchmark our write-ahead log under extreme contention.',
      sessionType: 'Code Audit & Profiling',
    },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-600" />
            <span>Mentee Reviews & Feedback</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Verified feedback from students and junior builders you’ve mentored.
          </p>
        </div>

        {/* Rating Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            label="Average Rating"
            value="4.98 / 5.0"
            change="Top 1% Mentor"
            isPositive={true}
            icon={<Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
          />
          <StatsCard
            label="Total Reviews"
            value="64 Reviews"
            change="100% Recommended"
            isPositive={true}
            icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          />
          <StatsCard
            label="Completion Rate"
            value="99.2%"
            change="Zero missed calls"
            isPositive={true}
            icon={<MessageSquare className="w-4 h-4 text-indigo-600" />}
          />
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden border border-slate-200 shrink-0">
                    <Image src={rev.author} alt={rev.author} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{rev.author}</h4>
                    <p className="text-xs text-slate-400">{rev.title} • {rev.sessionType}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <div className="flex items-center text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">{rev.date}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-13">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
