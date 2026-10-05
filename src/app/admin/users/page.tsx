'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Users, Search, MoreVertical, ShieldCheck, UserX, UserCheck } from 'lucide-react';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([
    { id: 'u1', name: 'Alex Rivera', email: 'alex.rivera@stanford.edu', role: 'Student', status: 'Active', verifiedTier: 'L3 Industry', joined: 'Jan 2025' },
    { id: 'u2', name: 'Sarah Chen', email: 'sarah.chen@stripe.com', role: 'Mentor', status: 'Active', verifiedTier: 'Staff Mentor', joined: 'Dec 2024' },
    { id: 'u3', name: 'Guillermo Rauch', email: 'rauchg@vercel.com', role: 'Company', status: 'Active', verifiedTier: 'Verified Partner', joined: 'Nov 2024' },
    { id: 'u4', name: 'Elena Rostova', email: 'erostova@berkeley.edu', role: 'Student', status: 'Active', verifiedTier: 'L3 Industry', joined: 'Feb 2025' },
    { id: 'u5', name: 'Marcus Vance', email: 'mvance@mit.edu', role: 'Student', status: 'Active', verifiedTier: 'L1 Peer', joined: 'Mar 2025' },
  ]);

  const toggleUserStatus = (id: string) => {
    setUsers(users.map((u) => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
  };

  const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              <span>User & Account Management</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Audit user accounts, assign roles, and enforce platform trust & safety policies.
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Platform Registered Users ({filtered.length})
            </h3>
            <span className="text-xs text-slate-400">Total registered: 14,820</span>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Assigned Role</th>
                <th className="p-4">Verification Tier</th>
                <th className="p-4">Joined</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="p-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{user.name}</div>
                    <div className="text-[11px] text-slate-400">{user.email}</div>
                  </td>
                  <td className="p-4">
                    <Badge variant={user.role === 'Student' ? 'default' : user.role === 'Mentor' ? 'success' : 'purple'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="p-4 font-medium">{user.verifiedTier}</td>
                  <td className="p-4 text-slate-500">{user.joined}</td>
                  <td className="p-4">
                    <Badge variant={user.status === 'Active' ? 'success' : 'danger'}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      size="sm"
                      variant={user.status === 'Active' ? 'outline' : 'secondary'}
                      onClick={() => toggleUserStatus(user.id)}
                    >
                      {user.status === 'Active' ? 'Suspend' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
