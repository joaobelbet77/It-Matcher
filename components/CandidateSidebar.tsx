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
    <aside className="w-full lg:w-72 bg-white dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex flex-col justify-between p-6 shrink-0 border-r border-slate-200/80 dark:border-slate-800/80 shadow-xs lg:h-screen lg:sticky lg:top-0 z-30 font-sans">
      <div className="flex flex-col">
        {/* Brand Corporativo */}
        <div 
          className="flex items-center gap-3.5 px-1 mb-8 cursor-pointer group"
          onClick={() => onTabChange('jobs')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-blue-800 to-slate-950 flex items-center justify-center text-white font-black shadow-md shadow-blue-900/20 group-hover:scale-[1.02] transition-transform">
            <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-heading font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                ItMatcher
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                PRO
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Enterprise Talent Platform
            </span>
          </div>
        </div>

        {/* Section Label: Oportunidades */}
        <div className="px-3 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-heading">
            Navegação Principal
          </span>
        </div>

        {/* Abas Corporativas */}
        <nav className="flex flex-col gap-1.5">
          <button
            onClick={() => onTabChange('jobs')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all text-left ${
              activeTab === 'jobs'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-900/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className={`w-4 h-4 ${activeTab === 'jobs' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Vagas Disponíveis</span>
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
              Live
            </span>
          </button>

          <button
            onClick={() => onTabChange('applications')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all text-left ${
              activeTab === 'applications'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-900/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className={`w-4 h-4 ${activeTab === 'applications' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Minhas Candidaturas</span>
            </div>
            {applicationsCount > 0 && (
              <span className={`text-[11px] px-2 py-0.5 rounded-md font-bold tabular-nums ${
                activeTab === 'applications' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
                {applicationsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onTabChange('about')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all text-left ${
              activeTab === 'about'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-900/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className={`w-4 h-4 ${activeTab === 'about' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Sobre o ItMatcher</span>
            </div>
          </button>
        </nav>

        {/* Banner Informativo Corporativo */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-50 dark:bg-[#0c121e] border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Algoritmo de Match
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Triagem ponderada em tempo real com base na aderência técnica da sua stack.
          </p>
        </div>
      </div>

      {/* Perfil Corporativo no Canto Inferior Esquerdo */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 mt-6 lg:mt-0">
        <button
          onClick={() => onTabChange('profile')}
          className={`w-full p-3 rounded-2xl text-left border transition-all flex items-center gap-3 group ${
            activeTab === 'profile'
              ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-400 dark:border-blue-700 shadow-xs ring-1 ring-blue-500/20'
              : 'bg-slate-50/70 dark:bg-[#0c121e] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
          title="Gerenciar Minha Conta & Perfil"
        >
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-xs border border-blue-600/30">
              {profile.name ? profile.name.charAt(0).toUpperCase() : '👤'}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#070b14] rounded-full"></span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate font-heading">
                {profile.name || 'Minha Conta'}
              </h4>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
              {profile.roleTitle || 'Configurar Perfil'}
            </p>
          </div>
          <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </aside>
  );
};
