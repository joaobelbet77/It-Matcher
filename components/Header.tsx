'use client';

import React from 'react';
import { TabType } from '../types';

interface HeaderProps {
  activeTab: TabType;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, isDarkMode, onToggleTheme }) => {
  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Início & Triagem',
          subtitle: 'Cadastre a vaga e avalie a compatibilidade dos candidatos'
        };
      case 'jobs':
        return {
          title: 'Vagas Cadastradas',
          subtitle: 'Gerenciamento de todas as vagas e requisitos de competências'
        };
      case 'candidates':
        return {
          title: 'Resultados dos Testes',
          subtitle: 'Histórico completo das avaliações realizadas'
        };
      case 'guide':
        return {
          title: 'Como Funciona a Nota',
          subtitle: 'Entenda os critérios de pontuação e pesos das habilidades'
        };
    }
  };

  const { title, subtitle } = getHeaderTitle();

  return (
    <header className="flex items-center justify-between pb-5 mb-6 border-b border-slate-200 dark:border-slate-800">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {title}
          </h1>
          <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-950">
            ItMatcher
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {subtitle}
        </p>
      </div>

      {/* Botão de Tema no Canto Superior Direito */}
      <button
        onClick={onToggleTheme}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c111d] hover:border-blue-600 dark:hover:border-blue-700 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm transition-all"
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
            <svg className="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <span>Modo Escuro</span>
          </>
        )}
      </button>
    </header>
  );
};
