"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { SkillBadge } from "@/components/ui/SkillBadge";
import { apiFetch } from "@/lib/api";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import {
  Award,
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";

interface Profile {
  name?: string | null;
  avatar?: string | null;
  title?: string | null;
  location?: string | null;
}

interface Skill {
  id: string;
  level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT" | string;
  isVerified?: boolean;
  verificationTier?: "NONE" | "PEER" | "MENTOR" | "INDUSTRY" | null;
  skill?: {
    id: string;
    name: string;
    category?: string;
  };
}

interface User {
  id: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  profile?: Profile | null;
  skills?: Skill[];
  _count?: {
    projects?: number;
    applications?: number;
  };
}

interface VerificationRequest {
  id: string;
  status: string;
  requestedTier?: "NONE" | "PEER" | "MENTOR" | "INDUSTRY" | null;
  reviewerNotes?: string | null;
  createdAt: string;
  reviewedAt?: string | null;
  projectId: string;
  project?: {
    title?: string;
    skills?: Array<{
      skill?: {
        name?: string;
      };
    }>;
  };
}

interface UserResponse {
  data?: User;
  user?: User;
}

interface VerificationResponse {
  data?: VerificationRequest[];
  requests?: VerificationRequest[];
}

function tierLabel(
  tier?: "NONE" | "PEER" | "MENTOR" | "INDUSTRY" | null
) {
  switch (tier) {
    case "INDUSTRY":
      return "Industry Audited";
    case "MENTOR":
      return "Mentor Reviewed";
    case "PEER":
      return "Peer Verified";
    default:
      return "Unverified";
  }
}

function tierValue(
  tier?: "NONE" | "PEER" | "MENTOR" | "INDUSTRY" | null
) {
  switch (tier) {
    case "INDUSTRY":
      return "industry" as const;
    case "MENTOR":
      return "mentor" as const;
    case "PEER":
      return "peer" as const;
    default:
      return "Unverified" as const;
  }
}

export default function SkillPassportPage() {
  const [user, setUser] = useState<User | null>(null);
  const [verificationRequests, setVerificationRequests] = useState<
    VerificationRequest[]
  >([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPassport() {
      try {
        setLoading(true);
        setError(null);

        const [userResponse, verificationResponse] = await Promise.all([
          apiFetch<UserResponse>("/users/me"),
          apiFetch<VerificationResponse>("/verification/my?limit=100"),
        ]);

        const currentUser = userResponse.data ?? userResponse.user;
        const requests =
          verificationResponse.data ?? verificationResponse.requests ?? [];

        if (!currentUser) {
          throw new Error("Authenticated user data was not returned.");
        }

        if (!cancelled) {
          setUser(currentUser);
          setVerificationRequests(requests);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load your Skill Passport."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPassport();

    return () => {
      cancelled = true;
    };
  }, []);

  const verifiedSkills = useMemo(
    () =>
      (user?.skills ?? []).filter(
        (item) =>
          item.isVerified ||
          (item.verificationTier && item.verificationTier !== "NONE")
      ),
    [user]
  );

  const approvedRequests = useMemo(
    () =>
      verificationRequests.filter(
        (request) => request.status === "APPROVED"
      ),
    [verificationRequests]
  );

  const highestTier = useMemo(() => {
    const tiers = ["INDUSTRY", "MENTOR", "PEER", "NONE"] as const;

    for (const tier of tiers) {
      if (
        verifiedSkills.some((skill) => skill.verificationTier === tier) ||
        approvedRequests.some((request) => request.requestedTier === tier)
      ) {
        return tier;
      }
    }

    return "NONE" as const;
  }, [verifiedSkills, approvedRequests]);

  const projectCount = user?._count?.projects ?? 0;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell>
        <LoadingState />
      </DashboardShell>
    );
  }

  if (error || !user) {
    return (
      <DashboardShell>
        <div className="mx-auto max-w-4xl p-6">
          <ErrorState message={error ?? "Unable to load your passport."} />
        </div>
      </DashboardShell>
    );
  }

  const profile = user.profile;

  return (
    <DashboardShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
              <Award className="h-6 w-6 text-indigo-600" />
              Skill Passport
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              A summary of your verified SkillBridge skills, projects, and
              verification activity.
            </p>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            leftIcon={
              copied ? (
                <Check className="h-4 w-4 text-emerald-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )
            }
          >
            {copied ? "Link Copied!" : "Copy Passport URL"}
          </Button>
        </div>

        <div className="space-y-8 rounded-3xl border-2 border-indigo-200/80 bg-gradient-to-b from-indigo-50/40 via-white to-white p-6 shadow-xl dark:border-indigo-900/60 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 sm:p-10">
          <div className="flex flex-col gap-6 border-b border-indigo-100 pb-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-indigo-500 bg-slate-100">
                {profile?.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt={profile.name || "Profile"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl font-bold text-slate-500">
                    {(profile?.name || user.email).charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                  SkillBridge Passport
                </span>

                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {profile?.name || "Unnamed user"}
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  {profile?.title || user.role}
                  {profile?.location ? ` • ${profile.location}` : ""}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Account ID: {user.id}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1 sm:items-end">
              <Badge
                variant={user.isVerified ? "success" : "default"}
                dot
                size="md"
              >
                {user.isVerified ? "Account Verified" : "Account Not Verified"}
              </Badge>

              <span className="text-[11px] text-slate-400">
                Member since{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Highest Verification
              </span>

              <span className="mt-1 block text-xl font-bold text-indigo-600 dark:text-indigo-400">
                {tierLabel(highestTier)}
              </span>

              <p className="mt-0.5 text-[11px] text-slate-500">
                Based on approved verification records.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Verified Skills
              </span>

              <span className="mt-1 block text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {verifiedSkills.length}
              </span>

              <p className="mt-0.5 text-[11px] text-slate-500">
                Skills with verification recorded on your profile.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Projects
              </span>

              <span className="mt-1 block text-xl font-bold text-purple-600 dark:text-purple-400">
                {projectCount}
              </span>

              <p className="mt-0.5 text-[11px] text-slate-500">
                Projects associated with your account.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-slate-100">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
              Verified Skills
            </h3>

            {verifiedSkills.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700">
                You do not have any verified skills yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {verifiedSkills.map((item) => {
                  const tier = item.verificationTier ?? "NONE";

                  return (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <span className="block font-semibold text-xs text-slate-900 dark:text-slate-100">
                            {item.skill?.name || "Unknown skill"}
                          </span>

                          <span className="mt-1 block text-[10px] text-slate-400">
                            Level: {item.level || "Not specified"}
                          </span>
                        </div>

                        <VerificationBadge
                          tier={tierValue(tier)}
                          size="sm"
                          showLabel={false}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-3 border-t border-indigo-100 pt-6 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Verification Activity
            </h3>

            {verificationRequests.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700">
                No verification requests have been submitted yet.
              </div>
            ) : (
              <div className="space-y-3">
                {verificationRequests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                          {request.project?.title || "Project verification"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Requested tier:{" "}
                          {tierLabel(request.requestedTier)}
                        </p>

                        {request.reviewedAt && (
                          <p className="mt-1 text-[11px] text-slate-400">
                            Reviewed{" "}
                            {new Date(
                              request.reviewedAt
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      <Badge
                        variant={
                          request.status === "APPROVED"
                            ? "success"
                            : request.status === "REJECTED"
                              ? "danger"
                              : "default"
                        }
                      >
                        {request.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 border-t border-indigo-100 pt-6 text-xs text-slate-500 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                Recruiter verification
              </p>
              <p className="mt-1">
                This page displays data retrieved from your authenticated
                SkillBridge account.
              </p>
            </div>

            <a
              href="/profile"
              className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:underline"
            >
              View public profile
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
