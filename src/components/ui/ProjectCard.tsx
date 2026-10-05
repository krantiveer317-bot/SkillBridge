import React from "react";
import type { VerificationTier } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { VerificationBadge } from "./VerificationBadge";
import { ExternalLink, Star, Eye } from "lucide-react";
import { Github } from "@/components/ui/Icons";

export interface ProjectCardProject {
  id: string;
  title: string;
  description: string;
  githubUrl?: string | null;
  liveUrl?: string | null;
  bannerImage?: string | null;
  verificationTier?: VerificationTier | string | null;
  starsCount: number;
  viewsCount: number;
  author?: {
    id: string;
    role?: string;
    name?: string;
    avatar?: string | null;
    title?: string | null;
    profile?: {
      avatar?: string | null;
      title?: string | null;
    } | null;
  };
  skills: Array<string | {
    skill: {
      id: string;
      name: string;
      category: string;
    };
  }>;
}

export interface ProjectCardProps {
  project: ProjectCardProject;
  className?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  className,
}) => {
  const authorName =
    project.author?.name ||
    project.author?.profile?.title ||
    project.author?.title ||
    project.author?.role ||
    "SkillBridge Member";

  const skills = project.skills.map((item) => typeof item === "string" ? item : item.skill.name);

  return (
    <div
      className={`group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white transition-all duration-200 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 ${
        className || ""
      }`}
    >
      <div>
        <div className="relative h-44 w-full overflow-hidden rounded-t-xl bg-slate-100 dark:bg-slate-800">
          {project.bannerImage ? (
            <Image
              src={project.bannerImage}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 dark:from-slate-800 dark:to-slate-900">
              <span className="font-mono text-xs">
                SkillBridge Proof of Work
              </span>
            </div>
          )}

          <div className="absolute top-3 right-3">
            <VerificationBadge
              tier={project.verificationTier === "peer" || project.verificationTier === "mentor" || project.verificationTier === "industry" || project.verificationTier === "none" ? project.verificationTier : "none"}
              size="sm"
            />
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative h-6 w-6 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
              {(project.author?.avatar || project.author?.profile?.avatar) ? (
                <Image
                  src={project.author?.avatar || project.author?.profile?.avatar || "/placeholder-avatar.png"}
                  alt={authorName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[9px] font-bold text-slate-500">
                  {authorName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              {authorName}
            </span>
          </div>

          <Link
            href={`/projects/${project.id}`}
            className="block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
          >
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 line-clamp-1 mb-1.5">
              {project.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                {skill}
              </span>
            ))}

            {skills.length > 4 && (
              <span className="text-[10px] text-slate-400 self-center">
                +{skills.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{project.starsCount}</span>
          </span>

          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>{project.viewsCount}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title="GitHub Repo"
            >
              <Github className="w-4 h-4" />
            </a>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1 rounded text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              title="Live Demo"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};












