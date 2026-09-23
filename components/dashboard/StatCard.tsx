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
      bg: 'bg-blue-950/80 text-blue-400 border-blue-800/80 shadow-xs',
      valueColor: 'text-white',
    },
    emerald: {
      bg: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80 shadow-xs',
      valueColor: 'text-emerald-400',
    },
    amber: {
      bg: 'bg-amber-950/80 text-amber-400 border-amber-800/80 shadow-xs',
      valueColor: 'text-amber-400',
    },
    rose: {
      bg: 'bg-rose-950/80 text-rose-400 border-rose-800/80 shadow-xs',
      valueColor: 'text-rose-400',
    },
    slate: {
      bg: 'bg-slate-800/90 text-slate-300 border-slate-700 shadow-xs',
      valueColor: 'text-slate-200',
    },
  };

  const style = variantStyles[variant];

  return (
    <Card className="hover:border-blue-500/50 transition-all hover:shadow-md hover:shadow-blue-950/30">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
            <h3 className={`text-2xl font-black ${style.valueColor}`}>{value}</h3>
            {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-xl border ${style.bg} shrink-0`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
