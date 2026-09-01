'use client';

import React from 'react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  jobsCount: number;
  candidatesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  jobsCount,
  candidatesCount
}) => {
  const navItems: { id: TabType; label: string; icon: string; badge?: number }[] = [
    {
      id: 'dashboard',
      label: 'Início / Triagem',
      icon: '🏠'
    },
    {
      id: 'jobs',
      label: 'Vagas Cadastradas',
      badge: jobsCount,
      icon: '📋'
    },
    {
      id: 'candidates',
      label: 'Resultados dos Testes',
      badge: candidatesCount,
      icon: '👥'
    },
    {
      id: 'guide',
      label: 'Como Funciona a Nota',
      icon: '💡'
    }
  ];

  return (
    <aside className="w-full lg:w-64 bg-white dark:bg-[#050811] text-slate-900 dark:text-white flex flex-col justify-between p-5 shrink-0 border-r border-slate-200 dark:border-slate-800 shadow-sm">
      <div>
        {/* Brand */}
        <div className="flex items-center gap-3 px-2 mb-8 cursor-pointer" onClick={() => onTabChange('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-lg font-black shadow-md shadow-blue-500/20">
            🎯
          </div>
          <div>
            <h2 className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">TalentMatch</h2>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Smart Recruiting</span>
          </div>
        </div>

        {/* Navigation Menu com as 4 Abas */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-black ${
                    isActive ? 'bg-blue-800 text-white' : 'bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-blue-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col gap-1 mt-6 lg:mt-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <span className="text-slate-700 dark:text-slate-300 font-bold">Sistema Ativo</span>
        </div>
        <span>Triagem automatizada • v2.0</span>
      </div>
    </aside>
  );
};
