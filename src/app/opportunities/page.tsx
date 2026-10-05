'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { OpportunityCard } from '@/components/ui/OpportunityCard';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { mockOpportunities } from '@/data/mockData';
import { Opportunity } from '@/types';
import { Search, Sparkles, CheckCircle2 } from 'lucide-react';

export default function OpportunitiesPage() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedOppForApply, setSelectedOppForApply] = useState<Opportunity | null>(null);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const filteredOpportunities = mockOpportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(search.toLowerCase()) ||
      opp.company.name.toLowerCase().includes(search.toLowerCase()) ||
      opp.requiredSkills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesType = selectedType === 'all' || opp.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleApply = (opp: Opportunity) => {
    setSelectedOppForApply(opp);
    setApplicationSubmitted(false);
  };

  const handleConfirmApplication = () => {
    setApplicationSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Hiring Marketplace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Opportunities Board
          </h1>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Full-time roles, competitive internships, and freelance gigs with proof-of-work hiring fast-tracks.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search roles, skills, or companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {[
              { id: 'all', label: 'All Opportunities' },
              { id: 'job', label: 'Full-Time Jobs' },
              { id: 'internship', label: 'Paid Internships' },
              { id: 'freelance', label: 'Freelance Gigs' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  selectedType === tab.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onApply={handleApply}
            />
          ))}
        </div>

        {/* Apply Modal */}
        <Modal
          isOpen={!!selectedOppForApply}
          onClose={() => setSelectedOppForApply(null)}
          title={applicationSubmitted ? 'Application Sent!' : `Apply to ${selectedOppForApply?.company.name}`}
          description={
            applicationSubmitted
              ? 'Your verified Skill Passport has been transmitted to the engineering team.'
              : selectedOppForApply?.title
          }
        >
          {selectedOppForApply && (
            <div className="space-y-4 text-xs">
              {applicationSubmitted ? (
                <div className="text-center py-6 space-y-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Application Successfully Submitted
                  </h4>
                  <p className="text-slate-500 max-w-xs mx-auto">
                    {selectedOppForApply.company.name} reviews verified builders within 48 hours. Track status on your student dashboard.
                  </p>
                  <Button onClick={() => setSelectedOppForApply(null)} className="mt-2">
                    Done
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 space-y-1">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">Submitting with Alex Rivera&apos;s Skill Passport</div>
                    <p className="text-slate-500 text-[11px]">Includes verified Level 3 proof for Go, Next.js, and Raft consensus.</p>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Note to Engineering Team (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Highlight relevant project repositories or benchmarks..."
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setSelectedOppForApply(null)}>
                      Cancel
                    </Button>
                    <Button onClick={handleConfirmApplication}>
                      Submit Verified Application
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
