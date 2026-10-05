'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRole } from '@/context/RoleContext';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/Button';
import {
  Sparkles,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  GraduationCap,
  Users,
  Building2,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { role, setRole } = useRole();

  const publicNavLinks = [
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Skills', href: '/skills' },
    { name: 'Opportunities', href: '/opportunities' },
    { name: 'Freelancers', href: '/freelancers' },
    { name: 'Mentors', href: '/mentors' },
    { name: 'Companies', href: '/companies' },
    { name: 'About', href: '/about' },
  ];

  const rolesList: { role: UserRole; label: string; icon: React.ReactNode; dashboardUrl: string }[] = [
    { role: 'student', label: 'Student View', icon: <GraduationCap className="w-4 h-4 text-indigo-500" />, dashboardUrl: '/dashboard' },
    { role: 'mentor', label: 'Mentor View', icon: <Users className="w-4 h-4 text-emerald-500" />, dashboardUrl: '/mentor/dashboard' },
    { role: 'company', label: 'Company View', icon: <Building2 className="w-4 h-4 text-sky-500" />, dashboardUrl: '/company/dashboard' },
    { role: 'admin', label: 'Admin View', icon: <ShieldAlert className="w-4 h-4 text-purple-500" />, dashboardUrl: '/admin/dashboard' },
  ];

  const currentRoleConfig = rolesList.find((r) => r.role === role);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-slate-900 dark:text-slate-100">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-sm shadow-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg leading-tight font-extrabold tracking-tight">SkillBridge</span>
              <span className="text-[10px] font-medium tracking-widest text-indigo-600 dark:text-indigo-400 uppercase -mt-0.5">Proof of Work</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
            {publicNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg transition-colors hover:text-slate-900 hover:bg-slate-100 dark:hover:text-slate-100 dark:hover:bg-slate-900 ${
                    isActive ? 'text-indigo-600 font-semibold bg-indigo-50/70 dark:bg-indigo-950/40 dark:text-indigo-400' : ''
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side controls */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Quick Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 transition-colors cursor-pointer"
            >
              {currentRoleConfig?.icon}
              <span>Role: {currentRoleConfig?.label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Switch Experience View
                </div>
                {rolesList.map((item) => (
                  <button
                    key={item.role}
                    onClick={() => {
                      setRole(item.role);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                      role === item.role
                        ? 'bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-950/60 dark:text-indigo-300'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {role === item.role && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Go to Dashboard */}
          {currentRoleConfig && (
            <Link href={currentRoleConfig.dashboardUrl}>
              <Button size="sm" variant="outline" leftIcon={<LayoutDashboard className="w-3.5 h-3.5" />}>
                Go to Portal
              </Button>
            </Link>
          )}

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />

          <Link href="/login">
            <Button size="sm" variant="ghost">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          {currentRoleConfig && (
            <Link href={currentRoleConfig.dashboardUrl} className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
              Portal
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 py-5 dark:border-slate-800 dark:bg-slate-950">
          <div className="space-y-1 pb-4 border-b border-slate-100 dark:border-slate-800">
            {publicNavLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
              Select Demo Persona
            </div>
            <div className="grid grid-cols-2 gap-2">
              {rolesList.map((item) => (
                <button
                  key={item.role}
                  onClick={() => {
                    setRole(item.role);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-1.5 p-2 rounded-lg text-xs font-medium border ${
                    role === item.role
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                      : 'border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-300'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <Link href="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/register" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" className="w-full">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
