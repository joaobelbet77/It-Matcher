'use client';

import React from 'react';
import { CandidateTabType, CandidateProfile } from '../types';

interface CandidateSidebarProps {
  activeTab: CandidateTabType;
  onTabChange: (tab: CandidateTabType) => void;
  applicationsCount: number;
  profile: CandidateProfile;
}

export const CandidateSidebar: React.FC<CandidateSidebarProps> = ({
  activeTab,
  onTabChange,
  applicationsCount,
  profile
}) => {
  return (
    <aside className="w-full lg:w-64 bg-white dark:bg-[#050811] text-slate-900 dark:text-white flex flex-col justify-between p-5 shrink-0 border-r border-slate-200 dark:border-slate-800 shadow-sm lg:h-screen lg:sticky lg:top-0">
      <div>
        {/* Brand */}
        <div className="flex items-center gap-3 px-2 mb-8 cursor-pointer" onClick={() => onTabChange('jobs')}>
          <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white text-lg font-black shadow-md shadow-blue-600/20">
            🎯
          </div>
          <div>
            <h2 className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">ItMatcher</h2>
            <span className="text-xs text-blue-700 dark:text-blue-400 font-semibold">Portal de Vagas</span>
          </div>
        </div>

        {/* Abas na Parte Esquerda */}
        <nav className="flex flex-col gap-1.5">
          <button
            onClick={() => onTabChange('jobs')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'jobs'
                ? 'bg-blue-700 text-white shadow-md shadow-blue-700/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <span>💼</span>
              <span>Vagas Disponíveis</span>
            </div>
          </button>

          <button
            onClick={() => onTabChange('applications')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'applications'
                ? 'bg-blue-700 text-white shadow-md shadow-blue-700/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <span>📄</span>
              <span>Minhas Candidaturas</span>
            </div>
            {applicationsCount > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-black ${
                activeTab === 'applications' ? 'bg-blue-900 text-white' : 'bg-blue-100 dark:bg-slate-800 text-blue-800 dark:text-blue-300'
              }`}>
                {applicationsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onTabChange('about')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'about'
                ? 'bg-blue-700 text-white shadow-md shadow-blue-700/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <span>ℹ️</span>
              <span>Sobre Nós</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Perfil na Parte Inferior Esquerda */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-6 lg:mt-0">
        <button
          onClick={() => onTabChange('profile')}
          className={`w-full p-3 rounded-2xl text-left border transition-all flex items-center gap-3 ${
            activeTab === 'profile'
              ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-400 dark:border-blue-700 shadow-sm ring-1 ring-blue-600/30'
              : 'bg-slate-50 dark:bg-[#0c111d] border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800'
          }`}
          title="Acessar Minha Conta e Habilidades"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center shrink-0 shadow-sm text-sm">
              {profile.name ? profile.name.charAt(0).toUpperCase() : '👤'}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-blue-600 border-2 border-white dark:border-[#050811] rounded-full"></span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {profile.name || 'Minha Conta'}
            </h4>
            <p className="text-[10px] text-blue-700 dark:text-blue-400 font-semibold truncate">
              {profile.roleTitle || 'Ver Perfil & Config'}
            </p>
          </div>
          <span className="text-xs text-slate-400">⚙️</span>
        </button>
      </div>
    </aside>
  );
};
