'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { mockVerificationRequests } from '@/data/mockData';
import { ShieldCheck, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

export default function AdminVerificationsPage() {
  const [queue, setQueue] = useState(mockVerificationRequests);
  const [auditTarget, setAuditTarget] = useState<typeof mockVerificationRequests[0] | null>(null);

  const handleApprove = (id: string) => {
    setQueue(queue.map((q) => q.id === id ? { ...q, status: 'Approved' } : q));
    setAuditTarget(null);
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-600" />
            <span>Verification Queue & Certificate Issuance</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review test run artifacts and peer review summaries to issue official Skill Passport credentials.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Active Verification Requests ({queue.length})
            </h3>
            <span className="text-xs text-slate-400">Jepsen & AST Test Suites Passed</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {queue.map((req) => (
              <div key={req.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {req.projectTitle}
                    </h4>
                    <Badge variant={req.status === 'Approved' ? 'success' : 'warning'}>
                      {req.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500">
                    Applicant: {req.applicantName} • Target: {req.requestedLevel} • Assigned Auditor: {req.assignedReviewer || 'Unassigned'}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Button size="sm" onClick={() => setAuditTarget(req)}>
                    Inspect & Sign
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Modal
          isOpen={!!auditTarget}
          onClose={() => setAuditTarget(null)}
          title={`Audit: ${auditTarget?.projectTitle}`}
          description={`Applicant: ${auditTarget?.applicantName} (${auditTarget?.requestedLevel})`}
        >
          {auditTarget && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1.5 font-mono">
                <p className="text-emerald-600 font-bold">✓ Automated test coverage: 94.6%</p>
                <p className="text-emerald-600 font-bold">✓ 0 Memory leaks detected</p>
                <p className="text-slate-600 dark:text-slate-300">Proof artifacts attached: 3 documents</p>
              </div>

              <div className="pt-2 flex justify-between gap-2">
                <Button variant="danger" size="sm" onClick={() => setAuditTarget(null)}>
                  Request Changes
                </Button>
                <Button size="sm" onClick={() => handleApprove(auditTarget.id)}>
                  Approve & Issue Certificate
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardShell>
  );
}
