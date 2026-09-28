import React from 'react';
import { ClassificationType, ClassificationLabel } from '@/types';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface MatchingScoreBadgeProps {
  score: number;
  classification: ClassificationType;
  label?: ClassificationLabel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const MatchingScoreBadge: React.FC<MatchingScoreBadgeProps> = ({
  score,
  classification,
  label,
  size = 'md',
  showIcon = true,
}) => {
  const configs = {
    ALTA: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80 shadow-xs',
      icon: <CheckCircle2 className="shrink-0 text-emerald-600 dark:text-emerald-400" />,
      defaultLabel: 'Alta Aderência',
    },
    MEDIA: {
      bg: 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/80 shadow-xs',
      icon: <AlertTriangle className="shrink-0 text-amber-600 dark:text-amber-400" />,
      defaultLabel: 'Média Aderência',
    },
    BAIXA: {
      bg: 'bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/80 shadow-xs',
      icon: <XCircle className="shrink-0 text-red-600 dark:text-red-400" />,
      defaultLabel: 'Baixa Aderência',
    },
  };

  const current = configs[classification] || configs.BAIXA;
  const displayLabel = label || current.defaultLabel;

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 gap-1.5',
    md: 'text-xs sm:text-sm px-3 py-1 gap-2',
    lg: 'text-sm sm:text-base px-4 py-2 gap-2.5 font-bold',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span
      className={`inline-flex items-center rounded-xl font-semibold border font-sans ${current.bg} ${sizeClasses[size]}`}
    >
      {showIcon && React.cloneElement(current.icon, { className: `${iconSizes[size]} shrink-0` })}
      <span className="font-extrabold">{score}%</span>
      <span className="opacity-90 font-medium">({displayLabel})</span>
    </span>
  );
};
