'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProfileCard } from '@/components/ui/ProfileCard';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { mockMentors } from '@/data/mockData';
import { Mentor } from '@/types';
import { Search, Sparkles, CheckCircle2, Calendar } from 'lucide-react';

export default function MentorsPage() {
  const [search, setSearch] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const filteredMentors = mockMentors.filter((m) => {
    return (
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.company.toLowerCase().includes(search.toLowerCase()) ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.expertise.some((e) => e.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Senior Engineering Mentors</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Book 1-on-1 Sessions with Tech Leaders
          </h1>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Get your architecture reviewed, prepare for high-stakes interviews, and receive honest code audits.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by company (Stripe, Spotify), skill, or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <ProfileCard
              key={mentor.id}
              id={mentor.id}
              name={mentor.name}
              avatar={mentor.avatar}
              title={mentor.title}
              company={mentor.company}
              bio={mentor.bio}
              rating={mentor.rating}
              reviewsCount={mentor.reviewsCount}
              hourlyRate={mentor.hourlyRate}
              verifiedTier="industry"
              skills={mentor.expertise}
              type="mentor"
              actionLabel="Schedule Session"
              onAction={() => {
                setSelectedMentor(mentor);
                setBookingConfirmed(false);
              }}
            />
          ))}
        </div>

        <Modal
          isOpen={!!selectedMentor}
          onClose={() => setSelectedMentor(null)}
          title={bookingConfirmed ? 'Session Confirmed!' : `Book 1-on-1 with ${selectedMentor?.name}`}
          description={
            bookingConfirmed
              ? 'Calendar invite and Zoom video link sent to your email.'
              : `${selectedMentor?.title} @ ${selectedMentor?.company} ($${selectedMentor?.hourlyRate}/hr)`
          }
        >
          {selectedMentor && (
            <div className="space-y-4 text-xs">
              {bookingConfirmed ? (
                <div className="text-center py-6 space-y-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Session Booked for Tomorrow 10:00 AM PST
                  </h4>
                  <p className="text-slate-500 max-w-xs mx-auto">
                    {selectedMentor.name} has been notified and sent session preparation notes.
                  </p>
                  <Button onClick={() => setSelectedMentor(null)} className="mt-2">
                    Done
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Select Available Slot
                    </label>
                    <div className="space-y-2">
                      {selectedMentor.availableSlots.map((slot, i) => (
                        <label
                          key={slot}
                          className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="slot"
                            defaultChecked={i === 0}
                            className="text-indigo-600"
                          />
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-slate-800 dark:text-slate-200">{slot}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      What would you like to cover?
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Distributed system architecture review for my Raft project, or mock system design interview."
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setSelectedMentor(null)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setBookingConfirmed(true)}>
                      Confirm Booking (${selectedMentor.hourlyRate})
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
