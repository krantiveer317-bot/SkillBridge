'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProfileCard } from '@/components/ui/ProfileCard';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { mockFreelancers } from '@/data/mockData';
import { Search, Sparkles, CheckCircle2 } from 'lucide-react';

export default function FreelancersPage() {
  const [search, setSearch] = useState('');
  const [selectedFreelancer, setSelectedFreelancer] = useState<typeof mockFreelancers[0] | null>(null);
  const [messageSent, setMessageSent] = useState(false);

  const filteredFreelancers = mockFreelancers.filter((fl) => {
    return (
      fl.name.toLowerCase().includes(search.toLowerCase()) ||
      fl.title.toLowerCase().includes(search.toLowerCase()) ||
      fl.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Audited Freelance Talent</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Hire Verified Student Builders
          </h1>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Work with engineers whose technical skills and delivery records have been audited by senior mentors.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by skill, discipline, or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFreelancers.map((fl) => (
            <ProfileCard
              key={fl.id}
              id={fl.id}
              name={fl.name}
              avatar={fl.avatar}
              title={fl.title}
              bio={fl.bio}
              rating={fl.rating}
              reviewsCount={fl.completedJobs}
              hourlyRate={fl.rate}
              verifiedTier="industry"
              skills={fl.skills}
              type="freelancer"
              actionLabel="Hire Builder"
              onAction={() => {
                setSelectedFreelancer(fl);
                setMessageSent(false);
              }}
            />
          ))}
        </div>

        <Modal
          isOpen={!!selectedFreelancer}
          onClose={() => setSelectedFreelancer(null)}
          title={messageSent ? 'Proposal Transmitted!' : `Hire ${selectedFreelancer?.name}`}
          description={
            messageSent
              ? 'Your project inquiry has been delivered directly to the builder.'
              : `${selectedFreelancer?.title} (${selectedFreelancer?.rate})`
          }
        >
          {selectedFreelancer && (
            <div className="space-y-4 text-xs">
              {messageSent ? (
                <div className="text-center py-6 space-y-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Inquiry Sent with Escrow Protection
                  </h4>
                  <p className="text-slate-500 max-w-xs mx-auto">
                    {selectedFreelancer.name} typically responds within 4 hours. You will receive an email confirmation.
                  </p>
                  <Button onClick={() => setSelectedFreelancer(null)} className="mt-2">
                    Close
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Project Scope & Deliverables
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe the feature, architecture, or sprint requirements..."
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Estimated Budget (USD)
                    </label>
                    <input
                      type="text"
                      defaultValue="$2,500"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setSelectedFreelancer(null)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setMessageSent(true)}>
                      Send Contract Proposal
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </main>

      <Footer />
    </div>
  );
}
