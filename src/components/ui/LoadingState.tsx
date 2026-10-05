import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface LoadingStateProps {
  message?: string;
  className?: string;
  type?: 'spinner' | 'skeleton';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading data...',
  className,
  type = 'spinner',
}) => {
  if (type === 'skeleton') {
    return (
      <div className={cn('space-y-4 animate-pulse w-full', className)}>
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3" />
        <div className="h-32 bg-slate-100 dark:bg-slate-800/60 rounded-xl w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-24 bg-slate-100 dark:bg-slate-800/60 rounded-xl" />
          <div className="h-24 bg-slate-100 dark:bg-slate-800/60 rounded-xl" />
          <div className="h-24 bg-slate-100 dark:bg-slate-800/60 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center',
        className
      )}
    >
      <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400 mb-3" />
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
};
