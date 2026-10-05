"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Button } from "@/components/ui/Button";
import { apiFetch } from "@/lib/api";
import { PlusCircle, Search } from "lucide-react";

type Project = {
  id: string;
  title: string;
  description: string;
  longDescription?: string | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
  bannerImage?: string | null;
  status: string;
  verificationTier?: string | null;
  starsCount: number;
  viewsCount: number;
  teamSize: number;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    role: string;
    profile?: {
      avatar?: string | null;
      title?: string | null;
    } | null;
  };
  skills: Array<{
    skill: {
      id: string;
      name: string;
      category: string;
    };
  }>;
};

export default function ProjectsDirectoryPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      try {
        setIsLoading(true);
        setError("");

        const result = await apiFetch<{
          data?: {
            projects?: Project[];
          };
        }>("/projects?limit=100", {
          auth: false,
        });

        if (!cancelled) {
          setProjects(result.data?.projects ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load projects"
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects.filter((project) => {
      const skillNames = project.skills.map(
        (item) => item.skill.name
      );

      const matchesSearch =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        skillNames.some((skill) =>
          skill.toLowerCase().includes(query)
        );

      const tier = project.verificationTier?.toLowerCase() ?? "";

      const matchesFilter =
        filterLevel === "all" ||
        (filterLevel === "l3" && tier.includes("3")) ||
        (filterLevel === "l2" && tier.includes("2")) ||
        (filterLevel === "l1" && tier.includes("1"));

      return matchesSearch && matchesFilter;
    });
  }, [projects, search, filterLevel]);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Proof Projects
            </h1>

            <p className="text-xs text-slate-500">
              Inspect verified repositories, fault-injection tests,
              and architecture reviews.
            </p>
          </div>

          <Link href="/projects/new">
            <Button
              size="sm"
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Submit New Project
            </Button>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />

            <input
              type="text"
              placeholder="Search by title, stack..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {[
              { id: "all", label: "All Projects" },
              { id: "l3", label: "Level 3: Industry" },
              { id: "l2", label: "Level 2: Mentor" },
              { id: "l1", label: "Level 1: Peer" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterLevel(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  filterLevel === tab.id
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="py-12 text-center text-sm text-slate-500">
            Loading projects...
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!isLoading && !error && filteredProjects.length === 0 && (
          <div className="py-12 text-center text-sm text-slate-500">
            No projects found.
          </div>
        )}

        {!isLoading && !error && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}