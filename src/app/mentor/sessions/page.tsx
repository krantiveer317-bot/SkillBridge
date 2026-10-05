'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Calendar, Video, Clock, CheckCircle2, PlusCircle } from 'lucide-react';

export default function MentorSessionsPage() {
  const [slotModalOpen, setSlotModalOpen] = useState(false);
  const [slotAdded, setSlotAdded] = useState(false);

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
              Manage your availability, upcoming video consultations, and mentee notes.
            </p>
          </div>

          <Button size="sm" onClick={() => { setSlotModalOpen(true); setSlotAdded(false); }} leftIcon={<PlusCircle className="w-4 h-4" />}>
            Add Availability Slot
          </Button>
        </div>

        {/* Sessions list */}
        <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Upcoming Scheduled Sessions (4)
            </h3>
            <span className="text-xs text-slate-400">All sessions conducted via Zoom WebRTC</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Distributed Raft Consensus Architecture • Alex Rivera
                  </h4>
                  <p className="text-xs text-slate-500">
                    Today • 4:00 PM - 5:00 PM PST • $85 Paid
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success">Confirmed</Badge>
                <Button size="sm">Launch Room</Button>
              </div>
            </div>

            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Mock Senior Systems Interview • Elena Rostova
                  </h4>
                  <p className="text-xs text-slate-500">
                    Tomorrow • 10:00 AM - 11:00 AM PST • $85 Paid
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default">Tomorrow</Badge>
                <Button size="sm" variant="outline">Prepare Notes</Button>
              </div>
            </div>

            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Portfolio & Code Audit • Marcus Vance
                  </h4>
                  <p className="text-xs text-slate-500">
                    Friday • 2:00 PM - 3:00 PM PST • $85 Paid
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default">Friday</Badge>
                <Button size="sm" variant="outline">Details</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Add Slot Modal */}
        <Modal
          isOpen={slotModalOpen}
          onClose={() => setSlotModalOpen(false)}
          title={slotAdded ? 'Slot Published!' : 'Add Mentorship Availability Slot'}
          description={
            slotAdded
              ? 'Mentees can now book this time directly from your public profile.'
              : 'Choose the date, time, and session duration.'
          }
        >
          <div className="space-y-4 text-xs">
            {slotAdded ? (
              <div className="text-center py-4 space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Availability Updated
                </h4>
                <Button onClick={() => setSlotModalOpen(false)} className="mt-2">
                  Done
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Date & Time
                  </label>
                  <input
                    type="text"
                    defaultValue="Saturday • 1:00 PM - 2:00 PM PST"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSlotModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setSlotAdded(true)}>
                    Add Slot
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </DashboardShell>
  );
}
