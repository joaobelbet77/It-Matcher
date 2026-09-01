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
          title: 'Vagas em Tecnologia',
          subtitle: 'Descubra oportunidades e veja sua compatibilidade em tempo real'
        };
      case 'applications':
        return {
          title: 'Minhas Candidaturas',
          subtitle: 'Acompanhe as vagas para as quais você enviou seu perfil'
        };
      case 'profile':
        return {
          title: 'Meu Perfil Profissional',
          subtitle: 'Gerencie suas habilidades para calcular o match automaticamente'
        };
    }
  };

  const { title, subtitle } = getHeaderInfo();

  return (
    <header className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {title}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {subtitle}
        </p>
      </div>

      {/* Botão de Tema no Canto Superior Direito */}
      <button
        onClick={onToggleTheme}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c111d] hover:border-blue-500 dark:hover:border-blue-600 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm transition-all shrink-0"
        title="Alternar tema claro/escuro"
      >
        {isDarkMode ? (
          <>
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    </header>
  );
};
