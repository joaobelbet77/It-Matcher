'use client';

import React from 'react';

interface LogoProps {
  variant?: 'full' | 'iconOnly';
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: { iconBox: 'w-8 h-8 rounded-xl', iconSize: 'w-4 h-4', text: 'text-lg', sub: 'text-[9px]' },
    md: { iconBox: 'w-10 h-10 rounded-xl', iconSize: 'w-5 h-5', text: 'text-xl', sub: 'text-[10px]' },
    lg: { iconBox: 'w-11 h-11 rounded-2xl', iconSize: 'w-6 h-6', text: 'text-2xl', sub: 'text-[10px]' },
    xl: { iconBox: 'w-14 h-14 rounded-2xl', iconSize: 'w-7 h-7', text: 'text-3xl', sub: 'text-xs' },
  };

  const dim = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Símbolo do Alvo Azul Corporativo */}
      <div className={`${dim.iconBox} bg-blue-600 flex items-center justify-center text-white font-black shadow-md shadow-blue-600/30 shrink-0 transition-transform hover:scale-105`}>
        <svg className={`${dim.iconSize} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="12" r="5" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      </div>

      {/* Nome ItMatcher */}
      {variant === 'full' && (
        <div className="flex flex-col">
          <span className={`font-heading font-black tracking-tight ${dim.text} text-slate-900 dark:text-white leading-none`}>
            ItMatcher
          </span>
          <span className={`font-heading font-bold uppercase tracking-widest ${dim.sub} text-blue-600 dark:text-blue-400 mt-0.5`}>
            Enterprise Platform
          </span>
        </div>
      )}
    </div>
  );
};
