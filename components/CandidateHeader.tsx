'use client';

import React from 'react';
import { CandidateTabType } from '../types';

interface CandidateHeaderProps {
  activeTab: CandidateTabType;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const CandidateHeader: React.FC<CandidateHeaderProps> = ({
  activeTab,
  isDarkMode,
  onToggleTheme
}) => {
  const getHeaderInfo = () => {
    switch (activeTab) {
      case 'jobs':
        return {
          breadcrumb: 'Oportunidades & Carreiras',
          title: 'Vagas em Tecnologia',
          subtitle: 'Catálogo executivo de vagas abertas com cálculo de compatibilidade algorítmica'
        };
      case 'applications':
        return {
          breadcrumb: 'Gestão de Candidaturas',
          title: 'Minhas Candidaturas',
          subtitle: 'Acompanhamento do status de processos seletivos e aderência técnica'
        };
      case 'profile':
        return {
          breadcrumb: 'Gestão de Conta & Competências',
          title: 'Perfil Profissional',
          subtitle: 'Configurações de stack técnica, pretensão salarial e preferências de contratação'
        };
      case 'about':
        return {
          breadcrumb: 'Institucional',
          title: 'Sobre o ItMatcher Enterprise',
          subtitle: 'Conheça o propósito, tecnologia e metodologia de compatibilidade técnica'
        };
    }
  };

  const { breadcrumb, title, subtitle } = getHeaderInfo();

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200/80 dark:border-zinc-800 font-sans">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-heading">
            {breadcrumb}
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Plataforma Ativa
          </span>
        </div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Ações do Header: Alternador de Tema */}
      <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
        <button
          onClick={onToggleTheme}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121215] hover:border-slate-300 dark:hover:border-zinc-700 text-xs font-bold text-slate-700 dark:text-zinc-200 shadow-xs hover:shadow-sm transition-all"
          title="Alternar modo claro / escuro"
        >
          {isDarkMode ? (
            <>
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Modo Claro</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <span>Modo Escuro</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
