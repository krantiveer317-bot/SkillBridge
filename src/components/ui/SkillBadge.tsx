import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';
import { SkillLevel } from '@/types';

export interface SkillBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  level?: SkillLevel;
  isVerified?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({
  name,
  level,
  isVerified = false,
  size = 'md',
  className,
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1 gap-1',
    md: 'text-xs px-3 py-1.5 gap-1.5',
    lg: 'text-sm px-3.5 py-2 gap-2',
  };

  const levelPillStyles: Record<SkillLevel, string> = {
    Beginner: 'text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400',
    Intermediate: 'text-sky-700 bg-sky-100/70 dark:bg-sky-950/60 dark:text-sky-300',
    Advanced: 'text-indigo-700 bg-indigo-100/70 dark:bg-indigo-950/60 dark:text-indigo-300',
    Expert: 'text-purple-700 bg-purple-100/70 dark:bg-purple-950/60 dark:text-purple-300',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg border border-slate-200/80 bg-white font-medium text-slate-800 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200',
        isVerified && 'border-indigo-200 bg-indigo-50/40 dark:border-indigo-900/50 dark:bg-indigo-950/20',
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {isVerified && (
        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
      )}
      <span className="font-semibold text-slate-900 dark:text-slate-100">{name}</span>
      {level && (
        <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-sm uppercase tracking-wider ml-0.5', levelPillStyles[level])}>
          {level}
        </span>
      )}
    </span>
  );
};
