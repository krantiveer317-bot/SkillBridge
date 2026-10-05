'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockProjects } from '@/data/mockData';
import { FolderGit2, CheckCircle2, AlertTriangle, ExternalLink, ShieldCheck } from 'lucide-react';

export default function AdminProjectsPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-purple-600" />
            <span>Project Moderation Queue</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Audit public repository submissions for plagiarism, malicious packages, and proof validity.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Published Projects Under Surveillance ({mockProjects.length})
            </h3>
            <span className="text-xs text-slate-400">Automated AST virus & plagiarism scans: 100% clean</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {mockProjects.map((p) => (
              <div key={p.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {p.title}
                    </h4>
                    <Badge variant="success">Verified {p.verificationLevel}</Badge>
                  </div>
                  <p className="text-xs text-slate-500">
                    Author: {p.author.name} • Created: {p.createdAt} • Views: {p.viewsCount}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {p.githubUrl && (
                    <a href={p.githubUrl} target="_blank" rel="noreferrer">
                      <Button size="sm" variant="outline" leftIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                        Repo
                      </Button>
                    </a>
                  )}
                  <Link href={`/projects/${p.id}`}>
                    <Button size="sm">Audit Details</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
