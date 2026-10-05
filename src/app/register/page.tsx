'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useRole } from '@/context/RoleContext';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

import {
  Sparkles,
  ArrowRight,
  GraduationCap,
  Users,
  Building2,
  MailCheck,
  RefreshCw,
} from 'lucide-react';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export default function RegisterPage() {
  const router = useRouter();

  const { setRole } = useRole();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] =
    useState<UserRole>('student');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [otp, setOtp] = useState('');

  const [step, setStep] = useState<'register' | 'verify'>(
    'register'
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /*
   * ============================================================
   * REGISTER
   * ============================================================
   */
  const handleRegister = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    /*
     * Client-side validation
     */
    if (cleanName.length < 2) {
      setError(
        'Name must be at least 2 characters.'
      );
      return;
    }

    if (!cleanEmail) {
      setError('Email is required.');
      return;
    }

    if (password.length < 8) {
      setError(
        'Password must be at least 8 characters.'
      );
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError(
        'Password must contain at least one uppercase letter.'
      );
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError(
        'Password must contain at least one number.'
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            name: cleanName,
            email: cleanEmail,
            password,
            role: selectedRole.toUpperCase(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || 'Registration failed'
        );
      }

      /*
       * Registration is successful.
       *
       * Backend does NOT return access/refresh tokens yet.
       * User must verify OTP first.
       */
      setEmail(cleanEmail);
      setStep('verify');

      setSuccess(
        'Account created successfully. Enter the 6-digit OTP to verify your email.'
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Registration failed'
      );
    } finally {
      setIsLoading(false);
    }
  };

  /*
   * ============================================================
   * VERIFY OTP
   * ============================================================
   */
  const handleVerifyOtp = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    const cleanOtp = otp.trim();

    if (!/^\d{6}$/.test(cleanOtp)) {
      setError(
        'OTP must be exactly 6 digits.'
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/auth/verify-email`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            email,
            code: cleanOtp,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || 'OTP verification failed'
        );
      }

      /*
       * Email is now verified.
       *
       * Login automatically using the same credentials.
       */
      await login(email, password);

      setRole(selectedRole);

      if (selectedRole === 'mentor') {
        router.push('/mentor/dashboard');
      } else if (selectedRole === 'company') {
        router.push('/company/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'OTP verification failed'
      );
    } finally {
      setIsLoading(false);
    }
  };

  /*
   * ============================================================
   * RESEND OTP
   * ============================================================
   */
  const handleResendOtp = async () => {
    setError('');
    setSuccess('');
    setIsResending(true);

    try {
      const response = await fetch(
        `${API_URL}/auth/resend-verification`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            email,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || 'Could not resend OTP'
        );
      }

      setSuccess(
        'A new OTP has been generated. Check the backend terminal.'
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not resend OTP'
      );
    } finally {
      setIsResending(false);
    }
  };

  /*
   * ============================================================
   * OTP SCREEN
   * ============================================================
   */
  if (step === 'verify') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />

        <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-lg space-y-6">

            <div className="text-center space-y-3">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md">
                <MailCheck className="h-7 w-7" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                Verify Your Email
              </h1>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                We created your account. Enter the
                6-digit OTP to verify:
              </p>

              <p className="font-semibold text-indigo-600 dark:text-indigo-400">
                {email}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">

              <form
                onSubmit={handleVerifyOtp}
                className="space-y-5"
              >

                <Input
                  label="6-Digit OTP"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => {
                    const value =
                      e.target.value
                        .replace(/\D/g, '')
                        .slice(0, 6);

                    setOtp(value);
                  }}
                  placeholder="Enter 6-digit OTP"
                />

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
                    {success}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isLoading}
                  rightIcon={
                    <ArrowRight className="w-4 h-4" />
                  }
                >
                  Verify Email
                </Button>

              </form>

              <div className="mt-5 text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:underline disabled:opacity-50 dark:text-indigo-400"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${
                      isResending
                        ? 'animate-spin'
                        : ''
                    }`}
                  />

                  {isResending
                    ? 'Sending...'
                    : 'Resend OTP'}
                </button>
              </div>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep('register');
                    setOtp('');
                    setError('');
                    setSuccess('');
                  }}
                  className="text-xs text-slate-500 hover:underline"
                >
                  ← Back to registration
                </button>
              </div>

            </div>

          </div>
        </main>

        <Footer />
      </div>
    );
  }

  /*
   * ============================================================
   * REGISTRATION SCREEN
   * ============================================================
   */
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">

      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">

        <div className="w-full max-w-lg space-y-6">

          <div className="text-center space-y-2">

            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20 mb-2">
              <Sparkles className="h-6 w-6" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Join the Proof-First Economy
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Create your real SkillBridge account
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <div className="mb-6">

              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                I am joining as:
              </label>

              <div className="grid grid-cols-3 gap-2">

                <button
                  type="button"
                  onClick={() =>
                    setSelectedRole('student')
                  }
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center ${
                    selectedRole === 'student'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold'
                      : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400'
                  }`}
                >
                  <GraduationCap className="w-5 h-5 mb-1" />
                  <span className="text-xs">
                    Student
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedRole('mentor')
                  }
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center ${
                    selectedRole === 'mentor'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold'
                      : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400'
                  }`}
                >
                  <Users className="w-5 h-5 mb-1" />
                  <span className="text-xs">
                    Mentor
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedRole('company')
                  }
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center ${
                    selectedRole === 'company'
                      ? 'border-sky-600 bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 font-semibold'
                      : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400'
                  }`}
                >
                  <Building2 className="w-5 h-5 mb-1" />
                  <span className="text-xs">
                    Company
                  </span>
                </button>

              </div>

            </div>

            <form
              onSubmit={handleRegister}
              className="space-y-4"
            >

              <Input
                label="Full Name"
                type="text"
                required
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter your name"
              />

              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="you@example.com"
              />

              <Input
                label="Password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="At least 8 characters"
              />

              {selectedRole === 'student' && (
                <Select
                  label="Primary Technical Discipline"
                  options={[
                    {
                      value: 'frontend',
                      label:
                        'Frontend & Full-Stack Engineering',
                    },
                    {
                      value: 'systems',
                      label:
                        'Systems & Distributed Computing',
                    },
                    {
                      value: 'ai_ml',
                      label:
                        'AI Engineering & Machine Learning',
                    },
                    {
                      value: 'cloud',
                      label:
                        'DevOps, Cloud & Infrastructure',
                    },
                    {
                      value: 'design',
                      label:
                        'Design Systems & Product Design',
                    },
                  ]}
                />
              )}

              {selectedRole === 'mentor' && (
                <Input
                  label="Current Employer / Company"
                  placeholder="e.g. Staff Engineer @ Stripe"
                />
              )}

              {selectedRole === 'company' && (
                <Select
                  label="Hiring Scale"
                  options={[
                    {
                      value: 'seed',
                      label:
                        'Early-stage Startup (1-15)',
                    },
                    {
                      value: 'growth',
                      label:
                        'Growth Stage (15-200)',
                    },
                    {
                      value: 'enterprise',
                      label:
                        'Enterprise / Scaleup (200+)',
                    },
                  ]}
                />
              )}

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
                  {success}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
                rightIcon={
                  <ArrowRight className="w-4 h-4" />
                }
              >
                Create Account
              </Button>

            </form>

          </div>

          <div className="text-center text-xs text-slate-500 dark:text-slate-400">

            Already have an account?{' '}

            <Link
              href="/login"
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Sign In
            </Link>

          </div>

        </div>

      </main>

      <Footer />

    </div>
  );
}