'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { Button } from '@/components/ui/Button';
import { mockProjects } from '@/data/mockData';
import { PlusCircle, Search, Sparkles } from 'lucide-react';

export default function ProjectsDirectoryPage() {
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');

  const filteredProjects = mockProjects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    const matchesFilter =
      filterLevel === 'all' ||
      (filterLevel === 'l3' && p.verificationLevel.includes('Level 3')) ||
      (filterLevel === 'l2' && p.verificationLevel.includes('Level 2')) ||
      (filterLevel === 'l1' && p.verificationLevel.includes('Level 1'));

    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Proof Projects
            </h1>
            <p className="text-xs text-slate-500">
              Inspect verified repositories, fault-injection tests, and architecture reviews.
            </p>
          </div>

          <Link href="/projects/new">
            <Button size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
              Submit New Project
            </Button>
          </Link>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, stack (Go, Rust, Next.js)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {[
              { id: 'all', label: 'All Projects' },
              { id: 'l3', label: 'Level 3: Industry' },
              { id: 'l2', label: 'Level 2: Mentor' },
              { id: 'l1', label: 'Level 1: Peer' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterLevel(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  filterLevel === tab.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
