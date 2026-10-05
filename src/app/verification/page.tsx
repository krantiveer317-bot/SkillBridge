"use client";

import React, { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { apiFetch } from "@/lib/api";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import {
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  X,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description?: string | null;
  verificationTier?: "NONE" | "PEER" | "MENTOR" | "INDUSTRY" | null;
}

interface VerificationRequest {
  id: string;
  projectId: string;
  requestedTier: "PEER" | "MENTOR" | "INDUSTRY";
  status: string;
  proofArtifacts?: string[];
  createdAt: string;
  submittedAt?: string | null;
  reviewedAt?: string | null;
  reviewerNotes?: string | null;
  project?: {
    title?: string;
  };
}

interface ProjectsResponse {
  data?: Project[];
  projects?: Project[];
}

interface VerificationResponse {
  data?: VerificationRequest[];
  requests?: VerificationRequest[];
}

function tierLabel(
  tier: "PEER" | "MENTOR" | "INDUSTRY"
) {
  switch (tier) {
    case "PEER":
      return "Peer Verification";
    case "MENTOR":
      return "Mentor Reviewed";
    case "INDUSTRY":
      return "Industry Audited";
  }
}

function tierBadgeValue(
  tier: "PEER" | "MENTOR" | "INDUSTRY"
) {
  switch (tier) {
    case "PEER":
      return "peer" as const;
    case "MENTOR":
      return "mentor" as const;
    case "INDUSTRY":
      return "industry" as const;
  }
}

function statusVariant(status: string) {
  switch (status) {
    case "APPROVED":
      return "success" as const;
    case "REJECTED":
      return "danger" as const;
    case "CHANGES_REQUESTED":
      return "warning" as const;
    default:
      return "default" as const;
  }
}

export default function VerificationHubPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [projectId, setProjectId] = useState("");
  const [requestedTier, setRequestedTier] = useState<
    "PEER" | "MENTOR" | "INDUSTRY"
  >("PEER");
  const [proofArtifacts, setProofArtifacts] = useState([""]);

  async function loadVerificationData() {
    try {
      setLoading(true);
      setError(null);

      const [projectResponse, verificationResponse] = await Promise.all([
        apiFetch<ProjectsResponse>("/projects/my?limit=100"),
        apiFetch<VerificationResponse>("/verification/my?limit=100"),
      ]);

      setProjects(
        projectResponse.data ?? projectResponse.projects ?? []
      );

      setRequests(
        verificationResponse.data ??
          verificationResponse.requests ??
          []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load verification data."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVerificationData();
  }, []);

  function addProofArtifact() {
    setProofArtifacts((current) => [...current, ""]);
  }

  function removeProofArtifact(index: number) {
    setProofArtifacts((current) =>
      current.length === 1
        ? current
        : current.filter((_, itemIndex) => itemIndex !== index)
    );
  }

  function updateProofArtifact(index: number, value: string) {
    setProofArtifacts((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? value : item
      )
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitting(true);
    setSubmitError(null);
    setSuccess(null);

    const artifacts = proofArtifacts
      .map((value) => value.trim())
      .filter(Boolean);

    if (!projectId) {
      setSubmitError("Please select a project.");
      setSubmitting(false);
      return;
    }

    if (artifacts.length === 0) {
      setSubmitError("Add at least one proof artifact URL.");
      setSubmitting(false);
      return;
    }

    try {
      await apiFetch("/verification/request", {
        method: "POST",
        body: JSON.stringify({
          projectId,
          requestedTier,
          proofArtifacts: artifacts,
        }),
      });

      setSuccess("Verification request submitted successfully.");
      setProjectId("");
      setRequestedTier("PEER");
      setProofArtifacts([""]);
      setShowForm(false);

      await loadVerificationData();
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Failed to submit verification request."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <DashboardShell>
        <LoadingState />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Skill Verification Hub
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Submit your projects for peer, mentor, or industry verification.
            </p>
          </div>

          <Button
            size="sm"
            leftIcon={<PlusCircle className="h-4 w-4" />}
            onClick={() => {
              setShowForm((current) => !current);
              setSubmitError(null);
              setSuccess(null);
            }}
          >
            {showForm ? "Close Request Form" : "Request Verification"}
          </Button>
        </div>

        {error && <ErrorState message={error} />}

        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {showForm && (
          <div className="rounded-2xl border border-indigo-200 bg-white p-6 shadow-xs dark:border-indigo-900 dark:bg-slate-900">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Request Verification
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Select one of your projects and provide proof artifact URLs.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-700"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {submitError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {submitError}
              </div>
            )}

            {projects.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700">
                You need to create a project before requesting verification.
                <div className="mt-4">
                  <Link href="/projects/new">
                    <Button size="sm">Create Project</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-900 dark:text-slate-100">
                    Project
                  </label>

                  <select
                    value={projectId}
                    onChange={(event) => setProjectId(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                    required
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100">
                    Requested Verification Tier
                  </label>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {(
                      ["PEER", "MENTOR", "INDUSTRY"] as const
                    ).map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setRequestedTier(tier)}
                        className={`rounded-xl border p-4 text-left ${
                          requestedTier === tier
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30"
                            : "border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        <VerificationBadge
                          tier={tierBadgeValue(tier)}
                          size="sm"
                        />

                        <p className="mt-2 text-xs text-slate-500">
                          {tierLabel(tier)}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      Proof Artifact URLs
                    </label>

                    <button
                      type="button"
                      onClick={addProofArtifact}
                      className="text-xs font-medium text-indigo-600 hover:underline"
                    >
                      + Add URL
                    </button>
                  </div>

                  <div className="space-y-3">
                    {proofArtifacts.map((artifact, index) => (
                      <div
                        key={index}
                        className="flex gap-2"
                      >
                        <input
                          type="url"
                          value={artifact}
                          onChange={(event) =>
                            updateProofArtifact(
                              index,
                              event.target.value
                            )
                          }
                          placeholder="https://github.com/..."
                          required
                          className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                        />

                        {proofArtifacts.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeProofArtifact(index)
                            }
                            className="rounded-lg border border-slate-300 px-3 text-slate-500 hover:text-red-600"
                            aria-label="Remove proof URL"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end border-t border-slate-200 pt-5 dark:border-slate-800">
                  <Button type="submit" disabled={submitting}>
                    {submitting
                      ? "Submitting..."
                      : "Submit Verification Request"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2 rounded-xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <VerificationBadge tier="Level 1: Peer Verified" />
            <h3 className="pt-1 text-sm font-bold text-slate-900 dark:text-slate-100">
              Peer Verification
            </h3>
            <p className="text-xs leading-relaxed text-slate-500">
              Request the Peer verification tier for your project.
            </p>
          </div>

          <div className="space-y-2 rounded-xl border border-indigo-200/80 bg-indigo-50/30 p-5 dark:border-indigo-900/60 dark:bg-slate-900">
            <VerificationBadge tier="Level 2: Mentor Reviewed" />
            <h3 className="pt-1 text-sm font-bold text-slate-900 dark:text-slate-100">
              Mentor Reviewed
            </h3>
            <p className="text-xs leading-relaxed text-slate-500">
              Request mentor-level review for your project.
            </p>
          </div>

          <div className="space-y-2 rounded-xl border border-emerald-200/80 bg-emerald-50/30 p-5 dark:border-emerald-900/60 dark:bg-slate-900">
            <VerificationBadge tier="Level 3: Industry Audited" />
            <h3 className="pt-1 text-sm font-bold text-slate-900 dark:text-slate-100">
              Industry Audited
            </h3>
            <p className="text-xs leading-relaxed text-slate-500">
              Request the highest verification tier currently supported by the API.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              My Verification Submissions
            </h3>

            <span className="text-xs text-slate-500">
              {requests.length} submission
              {requests.length === 1 ? "" : "s"}
            </span>
          </div>

          {requests.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">
              You have not submitted any verification requests yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {request.project?.title ||
                          projects.find(
                            (project) =>
                              project.id === request.projectId
                          )?.title ||
                          "Project"}
                      </h4>

                      <Badge variant={statusVariant(request.status)}>
                        {request.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                      <span>
                        Target: {tierLabel(request.requestedTier)}
                      </span>

                      <span>
                        Submitted:{" "}
                        {new Date(
                          request.submittedAt || request.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    {request.reviewerNotes && (
                      <p className="mt-2 max-w-2xl text-xs text-slate-500">
                        Reviewer notes: {request.reviewerNotes}
                      </p>
                    )}
                  </div>

                  <Link href={`/projects/${request.projectId}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      rightIcon={
                        <ArrowRight className="h-3.5 w-3.5" />
                      }
                    >
                      View Project
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
