'use client';

import React from 'react';
import { MatchingFilterOptions, ClassificationType, ProfessionalLevel, ReviewStatus } from '@/types';
import { ProfessionalLevels } from '@/lib/validation';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MatchingFilterBarProps {
  filters: MatchingFilterOptions;
  availableSkills: string[];
  onChange: (filters: MatchingFilterOptions) => void;
  onReset: () => void;
}

export const MatchingFilterBar: React.FC<MatchingFilterBarProps> = ({
  filters,
  availableSkills,
  onChange,
  onReset,
}) => {
  const handleUpdate = (patch: Partial<MatchingFilterOptions>) => {
    onChange({ ...filters, ...patch });
  };

  const hasActiveFilters = 
    filters.searchTerm || 
    (filters.classification && filters.classification !== 'ALL') ||
    (filters.level && filters.level !== 'ALL') ||
    (filters.minExperience && filters.minExperience > 0) ||
    filters.requiredSkill ||
    filters.reviewStatus;

  return (
    <div className="bg-white dark:bg-[#121215] p-4 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-sm space-y-3">
      {/* Linha Superior: Busca Geral */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrar candidatos por nome ou palavras-chave..."
            value={filters.searchTerm || ''}
            onChange={(e) => handleUpdate({ searchTerm: e.target.value })}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500"
          />
        </div>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            icon={<RotateCcw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
            className="text-xs shrink-0 self-end sm:self-center text-blue-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
          >
            Limpar Filtros
          </Button>
        )}
      </div>

      {/* Linha de Filtros Combinados (Requisito 10) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-1">
        {/* Filtro de Compatibilidade */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
            Compatibilidade
          </label>
          <select
            value={filters.classification || 'ALL'}
            onChange={(e) => handleUpdate({ classification: e.target.value as ClassificationType | 'ALL' })}
            className="w-full px-2.5 py-2 text-xs border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100"
          >
            <option value="ALL">Todas as Faixas</option>
            <option value="ALTA">Alta (80% a 100%)</option>
            <option value="MEDIA">Média (60% a 79%)</option>
            <option value="BAIXA">Baixa (Abaixo de 60%)</option>
          </select>
        </div>

        {/* Filtro de Nível */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
            Nível Profissional
          </label>
          <select
            value={filters.level || 'ALL'}
            onChange={(e) => handleUpdate({ level: e.target.value as ProfessionalLevel | 'ALL' })}
            className="w-full px-2.5 py-2 text-xs border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100"
          >
            <option value="ALL">Todos os Níveis</option>
            {ProfessionalLevels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro de Experiência Mínima */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
            Experiência Mínima
          </label>
          <select
            value={filters.minExperience || 0}
            onChange={(e) => handleUpdate({ minExperience: Number(e.target.value) })}
            className="w-full px-2.5 py-2 text-xs border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100"
          >
            <option value={0}>Qualquer Tempo</option>
            <option value={1}>1+ ano</option>
            <option value={3}>3+ anos</option>
            <option value={5}>5+ anos</option>
            <option value={7}>7+ anos</option>
          </select>
        </div>

        {/* Filtro por Competência Específica */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
            Possui Competência
          </label>
          <select
            value={filters.requiredSkill || ''}
            onChange={(e) => handleUpdate({ requiredSkill: e.target.value || undefined })}
            className="w-full px-2.5 py-2 text-xs border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100"
          >
            <option value="">Todas as Skills</option>
            {availableSkills.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Status de Revisão */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
            Status da Revisão
          </label>
          <select
            value={filters.reviewStatus || ''}
            onChange={(e) => handleUpdate({ reviewStatus: e.target.value || undefined })}
            className="w-full px-2.5 py-2 text-xs border border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100"
          >
            <option value="">Todos os Status</option>
            <option value="Pendente de revisão">Pendente de revisão</option>
            <option value="Revisado">Revisado</option>
            <option value="Aprovado para próxima etapa">Aprovado para próxima etapa</option>
            <option value="Não recomendado">Não recomendado</option>
          </select>
        </div>
      </div>
    </div>
  );
};
