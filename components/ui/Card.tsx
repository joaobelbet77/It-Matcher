import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-white dark:bg-[#121215] rounded-2xl border border-slate-200/90 dark:border-zinc-800 shadow-xs text-slate-900 dark:text-zinc-100 overflow-hidden transition-colors',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx('px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between', className)
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardContent: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div className={twMerge(clsx('p-6', className))} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx('px-6 py-3.5 bg-slate-50/70 dark:bg-zinc-900/50 border-t border-slate-100 dark:border-zinc-800 flex items-center', className)
      )}
      {...props}
    >
      {children}
    </div>
  );
};
