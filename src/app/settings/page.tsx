"use client";

import { FormEvent, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";

interface Profile {
  name?: string | null;
  avatar?: string | null;
  bio?: string | null;
  title?: string | null;
  location?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  websiteUrl?: string | null;
}

interface User {
  id: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  profile?: Profile | null;
}

interface ApiResponse {
  data?: User;
  user?: User;
}

interface FormState {
  name: string;
  title: string;
  bio: string;
  location: string;
  avatar: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  websiteUrl: string;
}

const emptyForm: FormState = {
  name: "",
  title: "",
  bio: "",
  location: "",
  avatar: "",
  githubUrl: "",
  linkedinUrl: "",
  portfolioUrl: "",
  websiteUrl: "",
};

export default function SettingsPage() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFetch<ApiResponse>("/users/me");
        const user = response.data ?? response.user;

        if (!user) {
          throw new Error("Profile data was not returned by the server.");
        }

        if (cancelled) return;

        const profile = user.profile;

        setEmail(user.email);
        setRole(user.role);
        setIsVerified(user.isVerified);

        setForm({
          name: profile?.name ?? "",
          title: profile?.title ?? "",
          bio: profile?.bio ?? "",
          location: profile?.location ?? "",
          avatar: profile?.avatar ?? "",
          githubUrl: profile?.githubUrl ?? "",
          linkedinUrl: profile?.linkedinUrl ?? "",
          portfolioUrl: profile?.portfolioUrl ?? "",
          websiteUrl: profile?.websiteUrl ?? "",
        });
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load your settings."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setSuccess(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const payload = {
        name: form.name.trim(),
        title: form.title.trim(),
        bio: form.bio.trim(),
        location: form.location.trim(),
        avatar: form.avatar.trim(),
        githubUrl: form.githubUrl.trim(),
        linkedinUrl: form.linkedinUrl.trim(),
        portfolioUrl: form.portfolioUrl.trim(),
        websiteUrl: form.websiteUrl.trim(),
      };

      const response = await apiFetch<ApiResponse>("/users/me", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      const user = response.data ?? response.user;

      if (user) {
        const profile = user.profile;

        setForm({
          name: profile?.name ?? "",
          title: profile?.title ?? "",
          bio: profile?.bio ?? "",
          location: profile?.location ?? "",
          avatar: profile?.avatar ?? "",
          githubUrl: profile?.githubUrl ?? "",
          linkedinUrl: profile?.linkedinUrl ?? "",
          portfolioUrl: profile?.portfolioUrl ?? "",
          websiteUrl: profile?.websiteUrl ?? "",
        });
      }

      setSuccess("Profile settings saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save your settings."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your profile information and public links.
        </p>
      </div>

      {error && <ErrorState message={error} />}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div>
            <h2 className="text-lg font-semibold">Account</h2>
            <p className="mt-1 text-sm text-gray-500">
              Account information is controlled by your authenticated account.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <Input value={email} disabled />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Role</label>
              <Input value={role} disabled />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isVerified ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            {isVerified ? "Account verified" : "Account not verified"}
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold">Profile</h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Name
                </label>
                <Input
                  value={form.name}
                  onChange={(event) =>
                    updateField("name", event.target.value)
                  }
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Title
                </label>
                <Input
                  value={form.title}
                  onChange={(event) =>
                    updateField("title", event.target.value)
                  }
                  placeholder="e.g. Full Stack Developer"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Location
                </label>
                <Input
                  value={form.location}
                  onChange={(event) =>
                    updateField("location", event.target.value)
                  }
                  placeholder="Your location"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Avatar URL
                </label>
                <Input
                  type="url"
                  value={form.avatar}
                  onChange={(event) =>
                    updateField("avatar", event.target.value)
                  }
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium">Bio</label>
              <textarea
                value={form.bio}
                onChange={(event) =>
                  updateField("bio", event.target.value)
                }
                maxLength={1000}
                rows={5}
                placeholder="Tell people about yourself..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                {form.bio.length}/1000
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold">Public Links</h2>

            <div className="mt-4 grid gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  GitHub URL
                </label>
                <Input
                  type="url"
                  value={form.githubUrl}
                  onChange={(event) =>
                    updateField("githubUrl", event.target.value)
                  }
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  LinkedIn URL
                </label>
                <Input
                  type="url"
                  value={form.linkedinUrl}
                  onChange={(event) =>
                    updateField("linkedinUrl", event.target.value)
                  }
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Portfolio URL
                </label>
                <Input
                  type="url"
                  value={form.portfolioUrl}
                  onChange={(event) =>
                    updateField("portfolioUrl", event.target.value)
                  }
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Website URL
                </label>
                <Input
                  type="url"
                  value={form.websiteUrl}
                  onChange={(event) =>
                    updateField("websiteUrl", event.target.value)
                  }
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t pt-6">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
