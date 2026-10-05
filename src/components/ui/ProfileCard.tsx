import React from 'react';
import Image from 'next/image';
import { Star, ShieldCheck, ArrowRight, MessageSquare } from 'lucide-react';
import { VerificationBadge } from './VerificationBadge';
import { Button } from './Button';

export interface ProfileCardProps {
  id: string;
  name: string;
  avatar: string;
  title: string;
  company?: string;
  bio: string;
  rating?: number;
  reviewsCount?: number;
  hourlyRate?: number | string;
  verifiedTier?: 'peer' | 'mentor' | 'industry';
  skills: string[];
  type?: 'freelancer' | 'mentor' | 'student';
  onAction?: () => void;
  actionLabel?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  avatar,
  title,
  company,
  bio,
  rating,
  reviewsCount,
  hourlyRate,
  verifiedTier,
  skills,
  type = 'freelancer',
  onAction,
  actionLabel,
}) => {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 transition-all duration-200 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div>
        <div className="flex items-start gap-4 mb-4">
          <div className="relative h-14 w-14 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-800">
            <Image
              src={avatar}
              alt={name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
                {name}
              </h4>
              {verifiedTier && (
                <VerificationBadge tier={verifiedTier} size="sm" showLabel={false} />
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium line-clamp-1">
              {title} {company ? `• ${company}` : ''}
            </p>

            {rating && (
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-0.5 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{rating}</span>
                </div>
                {reviewsCount && (
                  <span>({reviewsCount} reviews)</span>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {bio}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
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

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          {hourlyRate && (
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Rate</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {typeof hourlyRate === 'number' ? `$${hourlyRate}/hr` : hourlyRate}
              </span>
            </div>
          )}
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={onAction}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          {actionLabel || (type === 'mentor' ? 'Book Session' : 'View Profile')}
        </Button>
      </div>
    </div>
  );
};
