import React from 'react';
import { Job, MatchResult } from '../types';

interface StatsSummaryProps {
  jobs: Job[];
  matchResults: MatchResult[];
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ jobs, matchResults }) => {
  const totalMatches = matchResults.length;
  
  const avgScore = totalMatches > 0
    ? Math.round(matchResults.reduce((acc, curr) => acc + curr.score, 0) / totalMatches)
    : 0;

  const highMatchesCount = matchResults.filter((m) => m.score >= 70).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Vagas */}
      <div className="bg-white dark:bg-[#0c111d] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <span className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-400 tracking-wider">Vagas Cadastradas</span>
        <div className="flex items-baseline justify-between mt-1">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">{jobs.length}</h3>
          <span className="text-xs text-blue-700 dark:text-blue-400 font-bold">Cargos ativos</span>
        </div>
      </div>

      {/* Candidatos */}
      <div className="bg-white dark:bg-[#0c111d] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <span className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-400 tracking-wider">Candidatos Testados</span>
        <div className="flex items-baseline justify-between mt-1">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">{totalMatches}</h3>
          <span className="text-xs text-blue-700 dark:text-blue-400 font-bold">Avaliações</span>
        </div>
      </div>

      {/* Aprovados */}
      <div className="bg-white dark:bg-[#0c111d] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <span className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-400 tracking-wider">Altamente Qualificados (70%+)</span>
        <div className="flex items-baseline justify-between mt-1">
          <h3 className="text-2xl font-black text-blue-700 dark:text-blue-400">{highMatchesCount}</h3>
          <span className="text-xs text-blue-700 dark:text-blue-400 font-bold">Recomendados</span>
        </div>
      </div>

      {/* Média */}
      <div className="bg-white dark:bg-[#0c111d] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <span className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-400 tracking-wider">Média de Compatibilidade</span>
        <div className="flex items-baseline justify-between mt-1">
          <h3 className="text-2xl font-black text-blue-700 dark:text-blue-400">{avgScore}%</h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">Nota média</span>
        </div>
      </div>
    </div>
  );
};
