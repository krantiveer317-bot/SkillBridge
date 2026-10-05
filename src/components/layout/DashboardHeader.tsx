'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { mockCurrentUser } from '@/data/mockData';
import { useRole } from '@/context/RoleContext';
import { useAuth } from '@/context/AuthContext';
import {
  Bell,
  Search,
  ShieldCheck,
  Menu,
  ChevronDown,
  Sparkles,
  Award,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export const DashboardHeader: React.FC<{ onToggleMobileSidebar?: () => void }> = ({
  onToggleMobileSidebar,
}) => {
  const { role, setRole } = useRole();
  const { user } = useAuth();

  const userName = user?.name || user?.email?.split('@')[0] || 'User';

  const userAvatar =
    user?.avatar ||
    "https://ui-avatars.com/api/?name=" + encodeURIComponent(userName) + "&background=4f46e5&color=ffffff";
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'Project Verified!', desc: 'NexusKV verified by Staff Engineer @ Stripe (Level 3)', time: '2h ago', unread: true },
    { id: 2, title: 'Interview Scheduled', desc: 'Vercel scheduled an engineering screen for Thursday', time: '5h ago', unread: true },
    { id: 3, title: 'Milestone Escrow Funded', desc: 'Resend funded $1,900 for Milestone 1', time: '1d ago', unread: false },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xs sm:px-6 dark:border-slate-800 dark:bg-slate-950/95">
      {/* Left: Mobile trigger & Search */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="relative w-full max-w-sm hidden sm:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects, skills, opportunities..."
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Proof / Trust score pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-200/80 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Trust Score: {mockCurrentUser.trustScore}/100</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Notifications</span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer">Mark all read</span>
              </div>
              <div className="space-y-1 py-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      n.unread ? 'bg-indigo-50/50 dark:bg-indigo-950/30' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 line-clamp-1">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User profile dropdown trigger */}
        <button
          onClick={() => setProfileModalOpen(true)}
          className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <div className="relative h-8 w-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
            <Image
              src={userAvatar}
              alt={userName}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-none">
              {userName}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
              {role} View
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
        </button>
      </div>

      {/* Profile quick preview modal */}
      <Modal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title="Account & Portal Controls"
        description="Switch persona roles or view profile details"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <div className="relative h-12 w-12 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
              <Image src={userAvatar} alt={userName} fill className="object-cover"
              unoptimized
            />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{userName}</h4>
              <p className="text-xs text-slate-500">{user?.email}</p>
              <span className="inline-block text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full mt-1">
                L3 Industry Verified Builder
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Active Experience
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/dashboard" onClick={() => { setRole('student'); setProfileModalOpen(false); }}>
                <Button variant={role === 'student' ? 'primary' : 'outline'} size="sm" className="w-full">
                  Student
                </Button>
              </Link>
              <Link href="/mentor/dashboard" onClick={() => { setRole('mentor'); setProfileModalOpen(false); }}>
                <Button variant={role === 'mentor' ? 'primary' : 'outline'} size="sm" className="w-full">
                  Mentor
                </Button>
              </Link>
              <Link href="/company/dashboard" onClick={() => { setRole('company'); setProfileModalOpen(false); }}>
                <Button variant={role === 'company' ? 'primary' : 'outline'} size="sm" className="w-full">
                  Company
                </Button>
              </Link>
              <Link href="/admin/dashboard" onClick={() => { setRole('admin'); setProfileModalOpen(false); }}>
                <Button variant={role === 'admin' ? 'primary' : 'outline'} size="sm" className="w-full">
                  Admin
                </Button>
              </Link>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between">
            <Link href="/settings" onClick={() => setProfileModalOpen(false)}>
              <Button variant="ghost" size="sm">
                Settings
              </Button>
            </Link>
            <Link href="/" onClick={() => setProfileModalOpen(false)}>
              <Button variant="secondary" size="sm">
                Sign Out
              </Button>
            </Link>
          </div>
        </div>
      </Modal>
    </header>
  );
};





