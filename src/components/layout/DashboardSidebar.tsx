'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRole } from '@/context/RoleContext';
import {
  LayoutDashboard,
  UserCheck,
  FolderGit2,
  PlusCircle,
  ShieldCheck,
  Award,
  Repeat,
  Briefcase,
  Layers,
  GraduationCap,
  FileCheck2,
  DollarSign,
  Settings,
  Calendar,
  BookOpen,
  MessageSquare,
  Users,
  Search,
  Trophy,
  Building2,
  CreditCard,
  Flag,
  Sparkles,
  ChevronRight,
  LogOut,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

export const DashboardSidebar: React.FC = () => {
  const pathname = usePathname();
  const { role, setRole } = useRole();

  // Determine current active section based on URL or role
  let activeRoleSection = role;
  if (pathname.startsWith('/mentor')) {
    activeRoleSection = 'mentor';
  } else if (pathname.startsWith('/company')) {
    activeRoleSection = 'company';
  } else if (pathname.startsWith('/admin')) {
    activeRoleSection = 'admin';
  } else {
    activeRoleSection = 'student';
  }

  const studentNavItems: NavItem[] = [
    { label: 'Overview', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'My Profile', href: '/profile', icon: <UserCheck className="w-4 h-4" /> },
    { label: 'Projects', href: '/projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { label: 'Submit Project', href: '/projects/new', icon: <PlusCircle className="w-4 h-4" /> },
    { label: 'Verification Hub', href: '/verification', icon: <ShieldCheck className="w-4 h-4" />, badge: 'Active' },
    { label: 'Skill Passport', href: '/skill-passport', icon: <Award className="w-4 h-4" /> },
    { label: 'Skill Exchange', href: '/skill-exchange', icon: <Repeat className="w-4 h-4" /> },
    { label: 'Freelance Gigs', href: '/freelance', icon: <Briefcase className="w-4 h-4" /> },
    { label: 'Full-time Jobs', href: '/jobs', icon: <Layers className="w-4 h-4" /> },
    { label: 'Internships', href: '/internships', icon: <GraduationCap className="w-4 h-4" /> },
    { label: 'My Applications', href: '/applications', icon: <FileCheck2 className="w-4 h-4" />, badge: '4' },
    { label: 'Earnings & Invoices', href: '/earnings', icon: <DollarSign className="w-4 h-4" /> },
    { label: 'Settings', href: '/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const mentorNavItems: NavItem[] = [
    { label: 'Mentor Overview', href: '/mentor/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Mentor Profile', href: '/mentor/profile', icon: <UserCheck className="w-4 h-4" /> },
    { label: '1-on-1 Sessions', href: '/mentor/sessions', icon: <Calendar className="w-4 h-4" />, badge: '2 new' },
    { label: 'Courses & Guides', href: '/mentor/courses', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Reviews & Feedback', href: '/mentor/reviews', icon: <MessageSquare className="w-4 h-4" /> },
    { label: 'Payouts & Earnings', href: '/mentor/earnings', icon: <DollarSign className="w-4 h-4" /> },
  ];

  const companyNavItems: NavItem[] = [
    { label: 'Talent Dashboard', href: '/company/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Company Profile', href: '/company/profile', icon: <Building2 className="w-4 h-4" /> },
    { label: 'Manage Jobs', href: '/company/jobs', icon: <Briefcase className="w-4 h-4" /> },
    { label: 'Post a New Job', href: '/company/jobs/new', icon: <PlusCircle className="w-4 h-4" /> },
    { label: 'Candidate Pipeline', href: '/company/candidates', icon: <Search className="w-4 h-4" />, badge: '8 matches' },
    { label: 'Sponsored Projects', href: '/company/projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { label: 'Skill Challenges', href: '/company/challenges', icon: <Trophy className="w-4 h-4" /> },
  ];

  const adminNavItems: NavItem[] = [
    { label: 'Platform KPIs', href: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'User Management', href: '/admin/users', icon: <Users className="w-4 h-4" /> },
    { label: 'Project Moderation', href: '/admin/projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { label: 'Verification Queue', href: '/admin/verifications', icon: <ShieldCheck className="w-4 h-4" />, badge: '23' },
    { label: 'Job Postings', href: '/admin/jobs', icon: <Briefcase className="w-4 h-4" /> },
    { label: 'Company Partners', href: '/admin/companies', icon: <Building2 className="w-4 h-4" /> },
    { label: 'Ledger & Payments', href: '/admin/payments', icon: <CreditCard className="w-4 h-4" /> },
    { label: 'Abuse & Reports', href: '/admin/reports', icon: <Flag className="w-4 h-4" /> },
  ];

  const roleConfig = {
    student: {
      title: 'Student Portal',
      nav: studentNavItems,
      roleBadge: 'Student Builder',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    mentor: {
      title: 'Mentor Portal',
      nav: mentorNavItems,
      roleBadge: 'Staff Mentor',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    company: {
      title: 'Employer Portal',
      nav: companyNavItems,
      roleBadge: 'Hiring Partner',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    admin: {
      title: 'Admin Console',
      nav: adminNavItems,
      roleBadge: 'Master Admin',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
  };

  const currentRole = roleConfig[activeRoleSection as keyof typeof roleConfig] || roleConfig.student;

  return (
    <aside className="w-64 shrink-0 flex flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 min-h-screen">
      {/* Brand & Active Role Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <Link href="/" className="flex items-center gap-2 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            SkillBridge
          </span>
        </Link>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {currentRole.title}
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${currentRole.badgeColor}`}>
            {currentRole.roleBadge}
          </span>
        </div>
      </div>

      {/* Navigation items list */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {currentRole.nav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors group ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-950/60 dark:text-indigo-300'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge ? (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                  {item.badge}
                </span>
              ) : (
                <ChevronRight className={`w-3.5 h-3.5 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100 text-indigo-500' : ''}`} />
              )}
            </Link>
          );
        })}
      </div>

      {/* Role Quick Switcher footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-1">
          Switch Portal View
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <Link
            href="/dashboard"
            onClick={() => setRole('student')}
            className={`p-1.5 text-[11px] rounded-md font-medium text-center border transition-colors ${
              activeRoleSection === 'student'
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
            }`}
          >
            Student
          </Link>
          <Link
            href="/mentor/dashboard"
            onClick={() => setRole('mentor')}
            className={`p-1.5 text-[11px] rounded-md font-medium text-center border transition-colors ${
              activeRoleSection === 'mentor'
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
            }`}
          >
            Mentor
          </Link>
          <Link
            href="/company/dashboard"
            onClick={() => setRole('company')}
            className={`p-1.5 text-[11px] rounded-md font-medium text-center border transition-colors ${
              activeRoleSection === 'company'
                ? 'border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
            }`}
          >
            Company
          </Link>
          <Link
            href="/admin/dashboard"
            onClick={() => setRole('admin')}
            className={`p-1.5 text-[11px] rounded-md font-medium text-center border transition-colors ${
              activeRoleSection === 'admin'
                ? 'border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
            }`}
          >
            Admin
          </Link>
        </div>

        <Link
          href="/"
          className="flex items-center justify-center gap-1.5 w-full py-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit to Public Website</span>
        </Link>
      </div>
    </aside>
  );
};
