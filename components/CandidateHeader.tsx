'use client';

import React from 'react';
import Link from 'next/link';
import { CandidateTabType, CandidateProfile } from '../types';

interface CandidateHeaderProps {
  activeTab: CandidateTabType;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onMenuOpen: () => void;
  profile: CandidateProfile;
  onProfileClick: () => void;
  onTabChange: (tab: CandidateTabType) => void;
}

export const CandidateHeader: React.FC<CandidateHeaderProps> = ({
  activeTab,
  isDarkMode,
  onToggleTheme,
  onMenuOpen,
  profile,
  onProfileClick,
  onTabChange,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 font-sans">
      {/* Barra principal */}
      <div className="bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800 shadow-sm transition-colors">
        <div className="w-full px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between gap-4">

          {/* Esquerda: 3 Barras (Menu Hambúrguer) + Logo */}
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Botão 3 Barras */}
            <button
              onClick={onMenuOpen}
              className="w-12 h-12 flex flex-col items-center justify-center gap-[5px] rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#121215] hover:border-slate-300 dark:hover:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800/80 text-slate-800 dark:text-zinc-100 transition-all shadow-xs shrink-0"
              title="Abrir menu de navegação"
              aria-label="Abrir menu de navegação"
            >
              <span className="w-5 h-[2px] bg-slate-800 dark:bg-white rounded-full transition-colors" />
              <span className="w-5 h-[2px] bg-slate-800 dark:bg-white rounded-full transition-colors" />
              <span className="w-5 h-[2px] bg-slate-800 dark:bg-white rounded-full transition-colors" />
            </button>

            {/* Logo ItMatcher */}
            <div
              className="flex items-center gap-3.5 cursor-pointer group shrink-0"
              onClick={() => onTabChange('home')}
            >
              <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="5" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <div>
                <span className="font-heading font-black text-2xl tracking-tight text-slate-900 dark:text-white block leading-none">
                  ItMatcher
                </span>
              </div>
            </div>
          </div>

          {/* Direita: Alternador de tema + Perfil */}
          <div className="flex items-center gap-3 shrink-0">

            {/* Toggle tema */}
            <button
              onClick={onToggleTheme}
              className="p-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#121215] hover:border-slate-300 dark:hover:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-xs"
              title={isDarkMode ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
            >
              {isDarkMode ? (
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Avatar & Perfil Profissional */}
            <button
              onClick={onProfileClick}
              className={`flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded-2xl border transition-all group ${
                activeTab === 'profile'
                  ? 'border-blue-500 dark:border-blue-500 bg-blue-50/80 dark:bg-blue-600/15 shadow-sm ring-1 ring-blue-500/30'
                  : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#121215] hover:border-slate-300 dark:hover:border-zinc-700'
              } shadow-xs`}
              title="Meu Perfil & Conta"
            >
              {/* Avatar com status */}
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : '👤'}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#121215] rounded-full" />
              </div>
              
              {/* Detalhes do Usuário */}
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-snug truncate max-w-[140px] font-heading">
                  {profile.name || 'Minha Conta'}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium leading-tight truncate max-w-[140px]">
                  {profile.roleTitle || 'Configurar Perfil'}
                </div>
              </div>

              <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-zinc-200 transition-colors hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
