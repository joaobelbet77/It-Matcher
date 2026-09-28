import React from 'react';
import { ReviewStatus } from '@/types';
import { Clock, CheckCircle2, UserCheck, XCircle } from 'lucide-react';

interface ReviewStatusBadgeProps {
  status?: ReviewStatus | string;
  size?: 'sm' | 'md';
}

export const ReviewStatusBadge: React.FC<ReviewStatusBadgeProps> = ({
  status = 'Pendente de revisão',
  size = 'md',
}) => {
  const configs: Record<string, { bg: string; icon: React.ReactNode }> = {
    'Pendente de revisão': {
      bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/80',
      icon: <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
    },
    'Revisado': {
      bg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/80',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />,
    },
    'Aprovado para próxima etapa': {
      bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80',
      icon: <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
    },
    'Não recomendado': {
      bg: 'bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800/80',
      icon: <XCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />,
    },
  };

  const current = configs[status] || configs['Pendente de revisão'];

  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-0.5 gap-1.5',
    md: 'text-xs px-3 py-1 gap-2 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center rounded-xl font-sans border ${current.bg} ${sizeClasses[size]}`}
    >
      {current.icon}
      <span>{status}</span>
    </span>
  );
};
