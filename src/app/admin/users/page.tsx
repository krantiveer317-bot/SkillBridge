'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Users, Search } from 'lucide-react';
import { apiFetch } from '@/lib/api';

type UserProfile = {
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
};

type AdminUser = {
  id: string;
  email: string;
  role: 'STUDENT' | 'MENTOR' | 'COMPANY' | 'ADMIN';
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  profile?: UserProfile | null;
};

type UsersResponse = {
  users: AdminUser[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
};

function getUserName(user: AdminUser) {
  const first = user.profile?.firstName?.trim() || '';
  const last = user.profile?.lastName?.trim() || '';
  const name = `${first} ${last}`.trim();

  return name || user.email.split('@')[0] || 'Unknown User';
}

function formatRole(role: AdminUser['role']) {
  return role.charAt(0) + role.slice(1).toLowerCase();
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await apiFetch<UsersResponse>(
        '/admin/users?page=1&limit=100'
      );

      setUsers(response.users || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load users.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) => {
      const name = getUserName(user).toLowerCase();

      return (
        name.includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      );
    });
  }, [users, search]);

  const toggleUserStatus = async (user: AdminUser) => {
    try {
      setUpdatingId(user.id);
      setError('');

      await apiFetch(`/admin/users/${user.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          isActive: !user.isActive,
        }),
      });

      setUsers((current) =>
        current.map((item) =>
          item.id === user.id
            ? { ...item, isActive: !item.isActive }
            : item
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update user status.'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
              <Users className="h-6 w-6 text-purple-600" />
              <span>User & Account Management</span>
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Audit user accounts, assign roles, and enforce platform trust &
              safety policies.
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />

            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Platform Registered Users ({filtered.length})
            </h3>

            <span className="text-xs text-slate-400">
              Total registered: {users.length}
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Loading users...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 bg-slate-50 font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-800/60">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Assigned Role</th>
                    <th className="p-4">Verification</th>
                    <th className="p-4">Joined</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-slate-700 dark:divide-slate-800 dark:text-slate-300">
                  {filtered.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                    >
                      <td className="p-4">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {getUserName(user)}
                        </div>

                        <div className="text-[11px] text-slate-400">
                          {user.email}
                        </div>
                      </td>

                      <td className="p-4">
                        <Badge
                          variant={
                            user.role === 'STUDENT'
                              ? 'default'
                              : user.role === 'MENTOR'
                                ? 'success'
                                : user.role === 'COMPANY'
                                  ? 'purple'
                                  : 'danger'
                          }
                        >
                          {formatRole(user.role)}
                        </Badge>
                      </td>

                      <td className="p-4">
                        <Badge
                          variant={user.isVerified ? 'success' : 'default'}
                        >
                          {user.isVerified ? 'Verified' : 'Unverified'}
                        </Badge>
                      </td>

                      <td className="p-4 text-slate-500">
                        {formatDate(user.createdAt)}
                      </td>

                      <td className="p-4">
                        <Badge
                          variant={user.isActive ? 'success' : 'danger'}
                        >
                          {user.isActive ? 'Active' : 'Suspended'}
                        </Badge>
                      </td>

                      <td className="p-4 text-right">
                        <Button
                          size="sm"
                          variant={user.isActive ? 'outline' : 'secondary'}
                          disabled={updatingId === user.id}
                          onClick={() => void toggleUserStatus(user)}
                        >
                          {updatingId === user.id
                            ? 'Updating...'
                            : user.isActive
                              ? 'Suspend'
                              : 'Activate'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
