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
      bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80 shadow-xs',
      icon: <CheckCircle2 className="shrink-0 text-emerald-400" />,
      defaultLabel: 'Alta compatibilidade',
    },
    MEDIA: {
      bg: 'bg-amber-950/80 text-amber-300 border-amber-800/80 shadow-xs',
      icon: <AlertTriangle className="shrink-0 text-amber-400" />,
      defaultLabel: 'Média compatibilidade',
    },
    BAIXA: {
      bg: 'bg-rose-950/80 text-rose-300 border-rose-800/80 shadow-xs',
      icon: <XCircle className="shrink-0 text-rose-400" />,
      defaultLabel: 'Baixa compatibilidade',
    },
  };

  const current = configs[classification] || configs.BAIXA;
  const displayLabel = label || current.defaultLabel;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-sm px-3 py-1 gap-2',
    lg: 'text-base px-4 py-2 gap-2.5 font-bold',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold border ${current.bg} ${sizeClasses[size]}`}
    >
      {showIcon && React.cloneElement(current.icon, { className: `${iconSizes[size]} shrink-0` })}
      <span className="font-extrabold">{score}%</span>
      <span className="opacity-90 font-medium">({displayLabel})</span>
    </span>
  );
};
