'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProfileCard } from '@/components/ui/ProfileCard';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { apiFetch } from '@/lib/api';
import { Search, Sparkles, CheckCircle2, Calendar, Loader2 } from 'lucide-react';

type MentorRecord = {
  id: string;
  userId?: string;
  bio?: string | null;
  hourlyRate?: number;
  rating?: number;
  reviewsCount?: number;
  sessionsCompleted?: number;
  isAvailable?: boolean;
  expertise?: string[];
  user?: {
    profile?: {
      name?: string;
      title?: string;
      avatarUrl?: string;
      avatar?: string;
      company?: string;
    } | null;
  } | null;
};

type BookingResponse = {
  id?: string;
  scheduledAt?: string;
  durationMins?: number;
  topic?: string | null;
  price?: number;
  status?: string;
  meetingUrl?: string | null;
};

function unwrapList(value: any): MentorRecord[] {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.mentors)) return value.mentors;
  if (Array.isArray(value?.data)) return value.data;
  return [];
}

function unwrapItem(value: any): MentorRecord | null {
  if (!value) return null;
  return value?.mentor ?? value?.data ?? value;
}

function getMentorName(mentor: MentorRecord) {
  return (
    mentor.user?.profile?.name ||
    mentor.user?.profile?.title ||
    'Mentor'
  );
}

function getMentorTitle(mentor: MentorRecord) {
  return mentor.user?.profile?.title || 'Technology Mentor';
}

function getMentorCompany(mentor: MentorRecord) {
  return mentor.user?.profile?.company || 'SkillBridge';
}

function getMentorAvatar(mentor: MentorRecord) {
  return (
    mentor.user?.profile?.avatarUrl ||
    mentor.user?.profile?.avatar ||
    ''
  );
}

function getMentorBio(mentor: MentorRecord) {
  return mentor.bio || 'Experienced professional ready to help you grow your technical skills.';
}

export default function MentorsPage() {
  const [search, setSearch] = useState('');
  const [mentors, setMentors] = useState<MentorRecord[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<MentorRecord | null>(null);

  const [scheduledAt, setScheduledAt] = useState('');
  const [topic, setTopic] = useState('');
  const [durationMins, setDurationMins] = useState(60);

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingResult, setBookingResult] = useState<BookingResponse | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadMentors() {
      try {
        setLoading(true);
        setError('');

        const result = await apiFetch<any>('/mentor?page=1&limit=100', {
          auth: false,
        });

        if (!mounted) return;

        setMentors(unwrapList(result));
      } catch (err: any) {
        if (mounted) {
          setError(err?.message || 'Unable to load mentors.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadMentors();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredMentors = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return mentors;

    return mentors.filter((mentor) => {
      const name = getMentorName(mentor).toLowerCase();
      const title = getMentorTitle(mentor).toLowerCase();
      const company = getMentorCompany(mentor).toLowerCase();
      const bio = getMentorBio(mentor).toLowerCase();
      const expertise = (mentor.expertise || []).join(' ').toLowerCase();

      return (
        name.includes(query) ||
        title.includes(query) ||
        company.includes(query) ||
        bio.includes(query) ||
        expertise.includes(query)
      );
    });
  }, [mentors, search]);

  function openBooking(mentor: MentorRecord) {
    setSelectedMentor(mentor);
    setScheduledAt('');
    setTopic('');
    setDurationMins(60);
    setBookingConfirmed(false);
    setBookingResult(null);
    setError('');
  }

  async function confirmBooking() {
    if (!selectedMentor) return;

    if (!scheduledAt) {
      setError('Please select a date and time.');
      return;
    }

    const selectedDate = new Date(scheduledAt);

    if (Number.isNaN(selectedDate.getTime())) {
      setError('Please select a valid date and time.');
      return;
    }

    if (selectedDate <= new Date()) {
      setError('The session must be scheduled for a future date and time.');
      return;
    }

    try {
      setBooking(true);
      setError('');

      const result = await apiFetch<any>('/mentor/sessions', {
        method: 'POST',
        body: JSON.stringify({
          mentorId: selectedMentor.id,
          scheduledAt: selectedDate.toISOString(),
          durationMins,
          topic: topic.trim() || undefined,
        }),
      });

      const booking = (result?.data ?? result) as BookingResponse;

      setBookingResult(booking);
      setBookingConfirmed(true);
    } catch (err: any) {
      setError(err?.message || 'Unable to book the session.');
    } finally {
      setBooking(false);
    }
  }

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
              placeholder="Search by company, skill, or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading mentors...
            </div>
          </div>
        ) : error && mentors.length === 0 ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        ) : filteredMentors.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              No mentors found.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Try a different name, company, or skill.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <ProfileCard
                key={mentor.id}
                id={mentor.id}
                name={getMentorName(mentor)}
                avatar={getMentorAvatar(mentor)}
                title={getMentorTitle(mentor)}
                company={getMentorCompany(mentor)}
                bio={getMentorBio(mentor)}
                rating={mentor.rating ?? 0}
                reviewsCount={mentor.reviewsCount ?? 0}
                hourlyRate={mentor.hourlyRate ?? 0}
                verifiedTier="industry"
                skills={mentor.expertise || []}
                type="mentor"
                actionLabel={mentor.isAvailable === false ? 'Unavailable' : 'Schedule Session'}
                onAction={() => {
                  if (mentor.isAvailable !== false) {
                    openBooking(mentor);
                  }
                }}
              />
            ))}
          </div>
        )}

        <Modal
          isOpen={!!selectedMentor}
          onClose={() => {
            if (!booking) {
              setSelectedMentor(null);
            }
          }}
          title={
            bookingConfirmed
              ? 'Session Confirmed!'
              : `Book 1-on-1 with ${selectedMentor ? getMentorName(selectedMentor) : ''}`
          }
          description={
            bookingConfirmed
              ? 'Your mentorship session has been created successfully.'
              : selectedMentor
                ? `${getMentorTitle(selectedMentor)} • ${getMentorCompany(selectedMentor)} • $${selectedMentor.hourlyRate ?? 0}/hr`
                : ''
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
                    Session booked successfully
                  </h4>

                  <p className="text-slate-500 max-w-xs mx-auto">
                    {bookingResult?.scheduledAt
                      ? new Date(bookingResult.scheduledAt).toLocaleString()
                      : 'Your selected session has been created.'}
                  </p>

                  {bookingResult?.price !== undefined && (
                    <p className="font-semibold text-slate-700 dark:text-slate-200">
                      Session price: ${bookingResult.price}
                    </p>
                  )}

                  {bookingResult?.meetingUrl && (
                    <a
                      href={bookingResult.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex text-indigo-600 hover:text-indigo-700 font-semibold"
                    >
                      Join meeting
                    </a>
                  )}

                  <Button onClick={() => setSelectedMentor(null)} className="mt-2">
                    Done
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Select Date & Time
                    </label>

                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />

                      <input
                        type="datetime-local"
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                        min={new Date(Date.now() + 5 * 60 * 1000)
                          .toISOString()
                          .slice(0, 16)}
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Session Duration
                    </label>

                    <select
                      value={durationMins}
                      onChange={(e) => setDurationMins(Number(e.target.value))}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                    >
                      <option value={30}>30 minutes</option>
                      <option value={60}>60 minutes</option>
                      <option value={90}>90 minutes</option>
                      <option value={120}>120 minutes</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      What would you like to cover?
                    </label>

                    <textarea
                      rows={3}
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g. Distributed system architecture review or mock system design interview."
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="rounded-lg bg-slate-50 dark:bg-slate-900/70 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Hourly rate</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        ${selectedMentor.hourlyRate ?? 0}/hr
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <span className="text-slate-500">Duration</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {durationMins} min
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedMentor(null)}
                      disabled={booking}
                    >
                      Cancel
                    </Button>

                    <Button
                      onClick={confirmBooking}
                      disabled={booking}
                    >
                      {booking ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Booking...
                        </>
                      ) : (
                        'Confirm Booking'
                      )}
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
