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
      container: 'bg-blue-950/60 border-blue-800/80 text-blue-200',
      icon: <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />,
      titleColor: 'text-blue-300 font-bold',
    },
    success: {
      container: 'bg-emerald-950/60 border-emerald-800/80 text-emerald-200',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
      titleColor: 'text-emerald-300 font-bold',
    },
    warning: {
      container: 'bg-amber-950/60 border-amber-800/80 text-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
      titleColor: 'text-amber-300 font-bold',
    },
    error: {
      container: 'bg-rose-950/60 border-rose-800/80 text-rose-200',
      icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />,
      titleColor: 'text-rose-300 font-bold',
    },
    guardrail: {
      container: 'bg-blue-950/70 border-blue-700/80 text-blue-100 shadow-md',
      icon: <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />,
      titleColor: 'text-blue-200 font-black',
    }
  };

  const current = styles[type];

  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3 text-sm ${current.container} ${className}`}>
      {current.icon}
      <div className="flex-1 space-y-1">
        {title && <h5 className={current.titleColor}>{title}</h5>}
        <div className="opacity-90 leading-relaxed">{children}</div>
      </div>
    </div>
  );
};
