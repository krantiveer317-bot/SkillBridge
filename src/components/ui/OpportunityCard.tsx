import React from 'react';
import Image from 'next/image';
import { Opportunity } from '@/types';
import { Badge } from './Badge';
import { VerificationBadge } from './VerificationBadge';
import { MapPin, Clock, DollarSign, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export interface OpportunityCardProps {
  opportunity: Opportunity;
  className?: string;
  onApply?: (opp: Opportunity) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  className,
  onApply,
}) => {
  const typeBadgeVariant: Record<string, 'default' | 'purple' | 'success'> = {
    job: 'default',
    internship: 'purple',
    freelance: 'success',
  };

  const typeLabels = {
    job: 'Full-time Job',
    internship: 'Paid Internship',
    freelance: 'Freelance Gig',
  };

  return (
    <div
      className={`flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 transition-all duration-200 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 ${className || ''}`}
    >
      <div>
        {/* Top bar: Company & Type Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800">
              <Image
                src={opportunity.company.logo}
                alt={opportunity.company.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                {opportunity.company.name}
                {opportunity.company.verified && (
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 px-1.5 py-0.2 rounded-full border border-emerald-200/60">
                    Verified Employer
                  </span>
                )}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {opportunity.company.location} ({opportunity.locationType})
              </p>
            </div>
          </div>

          <Badge variant={typeBadgeVariant[opportunity.type]}>
            {typeLabels[opportunity.type]}
          </Badge>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
          {opportunity.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {opportunity.description}
        </p>

        {/* Required skills */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {opportunity.requiredSkills.map((skill) => (
            <span
              key={skill}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Compensation</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-0.5">
            <DollarSign className="w-3 h-3 text-emerald-600" />
            {opportunity.compensation}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {opportunity.minimumVerificationTier !== 'None' && (
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-400">Min. Proof</span>
              <VerificationBadge
                tier={
                  opportunity.minimumVerificationTier === 'Industry'
                    ? 'Level 3: Industry Audited'
                    : opportunity.minimumVerificationTier === 'Mentor'
                    ? 'Level 2: Mentor Reviewed'
                    : 'Level 1: Peer Verified'
                }
                size="sm"
              />
            </div>
          )}

          {onApply ? (
            <button
              onClick={() => onApply(opportunity)}
              className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
            >
              <span>Apply</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              href="/opportunities"
              className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3.5 py-1.5 rounded-lg text-xs transition-colors"
            >
              <span>Apply</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
