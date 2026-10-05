"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";

interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  iconUrl?: string | null;
}

interface SkillsResponse {
  data?: Skill[];
  skills?: Skill[];
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSkills() {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFetch<SkillsResponse>(
          "/skills?limit=100",
          { auth: false }
        );

        const data = response.data ?? response.skills ?? [];

        if (!cancelled) {
          setSkills(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load skills."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSkills();

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const values = Array.from(
      new Set(skills.map((skill) => skill.category).filter(Boolean))
    );

    return ["ALL", ...values];
  }, [skills]);

  const filteredSkills = useMemo(() => {
    const query = search.trim().toLowerCase();

    return skills.filter((skill) => {
      const matchesSearch =
        !query ||
        skill.name.toLowerCase().includes(query) ||
        (skill.description ?? "").toLowerCase().includes(query);

      const matchesCategory =
        category === "ALL" || skill.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [skills, search, category]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <ErrorState message={error} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Skills</h1>
        <p className="mt-1 text-sm text-gray-500">
          Explore the skills available on SkillBridge.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search skills..."
          />
        </div>

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          {categories.map((value) => (
            <option key={value} value={value}>
              {value === "ALL" ? "All categories" : value}
            </option>
          ))}
        </select>
      </div>

      {filteredSkills.length === 0 ? (
        <Card>
          <div className="p-8 text-center">
            <h2 className="font-semibold">No skills found</h2>
            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or category filter.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSkills.map((skill) => (
            <Card key={skill.id}>
              <div className="p-5">
                <div className="flex items-start gap-3">
                  {skill.iconUrl ? (
                    <img
                      src={skill.iconUrl}
                      alt=""
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold">
                      {skill.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold">{skill.name}</h2>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                      {skill.category}
                    </p>
                  </div>
                </div>

                {skill.description && (
                  <p className="mt-4 text-sm leading-6 text-gray-600">
                    {skill.description}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
