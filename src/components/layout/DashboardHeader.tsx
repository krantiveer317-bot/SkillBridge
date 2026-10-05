'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRole } from '@/context/RoleContext';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import {
  Bell,
  Search,
  ShieldCheck,
  Menu,
  ChevronDown,
  Sparkles,
  Award,
  Loader2,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface Notification {
  id: string;
  title: string;
  body?: string;
  desc?: string;
  isRead?: boolean;
  createdAt?: string;
  link?: string | null;
}

export const DashboardHeader: React.FC<{
  onToggleMobileSidebar?: () => void;
}> = ({ onToggleMobileSidebar }) => {
  const { role, setRole } = useRole();
  const { user } = useAuth();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  const userName =
    user?.name || user?.email?.split('@')[0] || 'User';

  const userAvatar =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      userName
    )}&background=4f46e5&color=ffffff`;

  useEffect(() => {
    let cancelled = false;

    async function loadNotifications() {
      try {
        setNotificationsLoading(true);

        const result = await apiFetch<any>(
          '/notifications?limit=20'
        );

        if (cancelled) return;

        const rows = Array.isArray(result)
          ? result
          : result?.notifications ?? result?.data ?? [];

        setNotifications(rows);
      } catch {
        if (!cancelled) {
          setNotifications([]);
        }
      } finally {
        if (!cancelled) {
          setNotificationsLoading(false);
        }
      }
    }

    if (user) {
      void loadNotifications();
    }

    return () => {
      cancelled = true;
    };
  }, [user]);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xs sm:px-6 dark:border-slate-800 dark:bg-slate-950/95">
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

      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-950/40 dark:border-indigo-900/50 dark:text-indigo-300">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-wide">
            Verified Profile
          </span>
        </div>

        <div className="relative">
          <button
            onClick={() => setNotificationsOpen((value) => !value)}
            className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />

            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-11 w-80 rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span className="text-[10px] text-indigo-600 font-semibold">
                    {unreadCount} unread
                  </span>
                )}
              </div>

              {notificationsLoading ? (
                <div className="p-8 flex justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No notifications yet.
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b border-slate-100 dark:border-slate-800 last:border-b-0 ${
                        !notification.isRead
                          ? 'bg-indigo-50/40 dark:bg-indigo-950/20'
                          : ''
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {!notification.isRead && (
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-600 shrink-0" />
                        )}

                        <div className={!notification.isRead ? '' : 'ml-3'}>
                          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                            {notification.title}
                          </p>
                          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                            {notification.body ||
                              notification.desc ||
                              ''}
                          </p>

                          {notification.createdAt && (
                            <p className="mt-1 text-[10px] text-slate-400">
                              {new Date(
                                notification.createdAt
                              ).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => setProfileModalOpen(true)}
          className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <div className="relative h-8 w-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
            <Image
              src={userAvatar}
              alt={userName}
              fill
              className="object-cover"
            />
          </div>

          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              {userName}
            </p>
            <p className="text-[10px] text-slate-500 uppercase">
              {role || user?.role || 'Student'}
            </p>
          </div>

          <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
        </button>
      </div>

      <Modal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title="Account"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-full overflow-hidden">
              <Image
                src={userAvatar}
                alt={userName}
                fill
                className="object-cover"
              />
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                {userName}
              </h3>
              <p className="text-xs text-slate-500">
                {user?.email || 'No email available'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link href="/profile" onClick={() => setProfileModalOpen(false)}>
              <Button variant="outline" className="w-full">
                Profile
              </Button>
            </Link>

            <Link href="/settings" onClick={() => setProfileModalOpen(false)}>
              <Button variant="outline" className="w-full">
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </Modal>
    </header>
  );
};
