import React from 'react';
import { cn } from '@/lib/utils';
import { ShieldCheck, Award, CheckCircle, Sparkles } from 'lucide-react';
import { VerificationTier } from '@/types';

export interface VerificationBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tier: VerificationTier | 'Level 1: Peer Verified' | 'Level 2: Mentor Reviewed' | 'Level 3: Industry Audited' | 'Unverified';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  tier,
  size = 'md',
  showLabel = true,
  className,
  ...props
}) => {
  let normalizedTier: 'peer' | 'mentor' | 'industry' | 'none' = 'none';

  if (tier === 'industry' || tier === 'Level 3: Industry Audited') {
    normalizedTier = 'industry';
  } else if (tier === 'mentor' || tier === 'Level 2: Mentor Reviewed') {
    normalizedTier = 'mentor';
  } else if (tier === 'peer' || tier === 'Level 1: Peer Verified') {
    normalizedTier = 'peer';
  }

  const configs = {
    none: {
      label: 'Unverified',
      icon: ShieldCheck,
      styles: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
    },
    peer: {
      label: 'Peer Verified (L1)',
      icon: CheckCircle,
      styles: 'bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800',
    },
    mentor: {
      label: 'Mentor Reviewed (L2)',
      icon: Award,
      styles: 'bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800',
    },
    industry: {
      label: 'Industry Audited (L3)',
      icon: Sparkles,
      styles: 'bg-emerald-50 text-emerald-700 border-emerald-300/80 shadow-xs dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
    },
  };

  const current = configs[normalizedTier];
  const Icon = current.icon;

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border transition-all duration-150',
        current.styles,
        sizeStyles[size],
        className
      )}
      title={current.label}
      {...props}
    >
      <Icon className={cn('shrink-0', iconSizes[size])} />
      {showLabel && <span>{current.label}</span>}
    </span>
  );
};
