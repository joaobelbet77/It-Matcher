import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error' | 'guardrail';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  className = '',
}) => {
  const styles = {
    info: {
      container: 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200',
      icon: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />,
      titleColor: 'text-blue-800 dark:text-blue-300 font-bold',
    },
    success: {
      container: 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />,
      titleColor: 'text-emerald-800 dark:text-emerald-300 font-bold',
    },
    warning: {
      container: 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />,
      titleColor: 'text-amber-800 dark:text-amber-300 font-bold',
    },
    error: {
      container: 'bg-red-50/80 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-900 dark:text-red-200',
      icon: <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />,
      titleColor: 'text-red-800 dark:text-red-300 font-bold',
    },
    guardrail: {
      container: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100 shadow-xs',
      icon: <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />,
      titleColor: 'text-blue-900 dark:text-blue-200 font-black',
    }
  };

  const current = styles[type];

  return (
    <div className={`p-4 rounded-2xl border flex items-start gap-3.5 text-xs sm:text-sm font-sans ${current.container} ${className}`}>
      {current.icon}
      <div className="flex-1 space-y-1">
        {title && <h5 className={current.titleColor}>{title}</h5>}
        <div className="opacity-95 leading-relaxed">{children}</div>
      </div>
    </div>
  );
};
