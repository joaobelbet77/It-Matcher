import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  variant?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  variant = 'indigo',
}) => {
  const variantStyles = {
    indigo: {
      bg: 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/80 shadow-xs',
      valueColor: 'text-slate-900 dark:text-white',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/80 shadow-xs',
      valueColor: 'text-emerald-700 dark:text-emerald-400',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/80 shadow-xs',
      valueColor: 'text-amber-700 dark:text-amber-400',
    },
    rose: {
      bg: 'bg-red-50 dark:bg-red-950/80 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/80 shadow-xs',
      valueColor: 'text-red-700 dark:text-red-400',
    },
    slate: {
      bg: 'bg-slate-100 dark:bg-zinc-800/90 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 shadow-xs',
      valueColor: 'text-slate-800 dark:text-zinc-200',
    },
  };

  const style = variantStyles[variant];

  return (
    <Card className="hover:border-blue-500/50 dark:hover:border-zinc-700 transition-all hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-heading">{title}</p>
            <h3 className={`text-2xl sm:text-3xl font-heading font-black ${style.valueColor}`}>{value}</h3>
            {subtitle && <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-2xl border ${style.bg} shrink-0`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
