'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BookOpen, PlusCircle, Users, Star, ArrowRight } from 'lucide-react';

export default function MentorCoursesPage() {
  const courses = [
    {
      id: 'c-1',
      title: 'Distributed Systems & Consensus from First Principles',
      description: 'A 4-week cohort-based masterclass covering Raft, Paxos, write-ahead logs, and Jepsen verification tests in Go.',
      enrolled: 42,
      rating: 4.97,
      lessons: 12,
      status: 'Active Cohort',
      price: '$249',
    },
    {
      id: 'c-2',
      title: 'Production Go: High-Throughput Microservice Architecture',
      description: 'Deep dive into Go scheduler internals, sync.Pool memory optimization, gRPC streaming, and profiling with pprof.',
      enrolled: 68,
      rating: 4.95,
      lessons: 8,
      status: 'Self-Paced',
      price: '$189',
    },
    {
      id: 'c-3',
      title: 'Database Sharding & Replication Masterclass',
      description: 'Architecting horizontal scale for Postgres databases with Vitess and Citus.',
      enrolled: 29,
      rating: 5.0,
      lessons: 6,
      status: 'Upcoming',
      price: '$199',
    },
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-emerald-600" />
              <span>Masterclasses & Guides</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Create curriculum tracks, host live cohorts, and earn recurring revenue.
            </p>
          </div>

          <Button size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Create New Masterclass
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="p-6 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={course.status === 'Active Cohort' ? 'success' : 'default'}>
                    {course.status}
                  </Badge>
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {course.price}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2">
                  {course.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                  {course.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{course.enrolled} Builders</span>
                  </span>
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{course.rating}</span>
                  </span>
                  <span>{course.lessons} Modules</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="text-[11px] text-slate-400">Cohorts running</span>
                <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Manage
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
