"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { apiFetch } from "@/lib/api";
import {
  Globe,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Github } from "@/components/ui/Icons";

type Skill = {
  id: string;
  name: string;
  category: string;
};

type SkillsResponse = {
  data?: {
    skills?: Skill[];
  };
};

type CreateProjectResponse = {
  data?: {
    id?: string;
  };
};

export default function NewProjectPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [teamSize, setTeamSize] = useState("1");

  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);

  const [isLoadingSkills, setIsLoadingSkills] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;

    async function loadSkills() {
      try {
        setIsLoadingSkills(true);
        setError("");

        const result = await apiFetch<SkillsResponse>(
          "/skills?limit=100",
          { auth: false }
        );

        if (!cancelled) {
          setAvailableSkills(result.data?.skills ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load skills"
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingSkills(false);
        }
      }
    }

    loadSkills();

    return () => {
      cancelled = true;
    };
  }, []);

  function toggleSkill(skillId: string) {
    setSelectedSkillIds((current) => {
      if (current.includes(skillId)) {
        return current.filter((id) => id !== skillId);
      }

      if (current.length >= 10) {
        return current;
      }

      return [...current, skillId];
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    if (selectedSkillIds.length === 0) {
      setError("Select at least one skill.");
      return;
    }

    if (selectedSkillIds.length > 10) {
      setError("You can select at most 10 skills.");
      return;
    }

    const parsedTeamSize = Number(teamSize);

    if (
      !Number.isInteger(parsedTeamSize) ||
      parsedTeamSize < 1 ||
      parsedTeamSize > 50
    ) {
      setError("Team size must be between 1 and 50.");
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await apiFetch<CreateProjectResponse>(
        "/projects",
        {
          method: "POST",
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            githubUrl: githubUrl.trim(),
            liveUrl: liveUrl.trim(),
            skillIds: selectedSkillIds,
            teamSize: parsedTeamSize,
          }),
        }
      );

      const projectId = result.data?.id ?? null;

      setCreatedProjectId(projectId);
      setShowSuccessModal(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create project"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <DashboardShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Submit Project for Proof Verification
          </h1>

          <p className="text-xs text-slate-500 mt-1">
            Provide your public repository details to create a
            project and begin the verification process.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 space-y-5 shadow-xs"
        >
          <Input
            label="Project Title"
            required
            placeholder="e.g. NexusKV: Distributed Raft Consensus Key-Value Store"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Project Architecture & Technical Summary
            </label>

            <textarea
              required
              minLength={10}
              maxLength={500}
              rows={4}
              placeholder="Describe your project, architecture, testing strategy, and important technical decisions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="GitHub Repository URL"
              placeholder="https://github.com/username/project"
              leftIcon={<Github className="w-4 h-4" />}
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />

            <Input
              label="Live Production Demo URL"
              placeholder="https://project.dev"
              leftIcon={<Globe className="w-4 h-4" />}
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Skills
            </label>

            {isLoadingSkills ? (
              <p className="text-xs text-slate-500">
                Loading skills...
              </p>
            ) : availableSkills.length === 0 ? (
              <p className="text-xs text-slate-500">
                No active skills are available.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableSkills.map((skill) => {
                  const selected = selectedSkillIds.includes(skill.id);

                  return (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => toggleSkill(skill.id)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        selected
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                      }`}
                    >
                      {skill.name}
                    </button>
                  );
                })}
              </div>
            )}

            <p className="mt-2 text-[11px] text-slate-500">
              Select 1–10 skills.
            </p>
          </div>

          <Input
            label="Team Size"
            type="number"
            min={1}
            max={50}
            required
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
          />

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Verification</span>
            </h4>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Your project will be stored under your authenticated
              SkillBridge account. Verification can be requested after
              the project is created.
            </p>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Create Project
            </Button>
          </div>
        </form>

        <Modal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="Project Created"
          description="Your project has been successfully saved."
        >
          <div className="text-center py-4 space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Project Created Successfully
            </h4>

            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your project is now stored in SkillBridge under your
              authenticated account.
            </p>

            <div className="flex justify-center gap-2 pt-2">
              {createdProjectId && (
                <Button
                  onClick={() => {
                    setShowSuccessModal(false);
                    router.push(`/projects/${createdProjectId}`);
                  }}
                >
                  View Project
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push("/projects");
                }}
              >
                All Projects
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardShell>
  );
}