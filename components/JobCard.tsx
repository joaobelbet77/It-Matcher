'use client';

import React from 'react';
import { Job } from '../types';
import { getQuickScore } from '../lib/matcher';

interface JobCardProps {
  job: Job;
  candidateSkills: string;
  hasApplied: boolean;
  onApply: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  candidateSkills,
  hasApplied,
  onApply
}) => {
  const matchScore = getQuickScore(candidateSkills, job);

  // Status visual corporativo do score
  const getScoreBadge = () => {
    if (!candidateSkills.trim()) return null;
    if (matchScore >= 70) {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          <span>{matchScore}% Match • Alta Aderência</span>
        </div>
      );
    }
    if (matchScore >= 40) {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
          <span>{matchScore}% Match • Aderência Média</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold">
        <span>{matchScore}% Match</span>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-[#0c121e] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all flex flex-col justify-between group font-sans">
      <div>
        {/* Top: Empresa, Vaga & Badges */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-heading font-black text-base shadow-xs shrink-0">
              {job.company.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 font-heading">
                  {job.company}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {job.postedAt}
                </span>
              </div>
              <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white mt-1 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                {job.title}
              </h3>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                <span className="inline-flex items-center gap-1 font-medium">
                  📍 {job.location}
                </span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                  {job.workModel}
                </span>
                <span>•</span>
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  {job.level}
                </span>
              </div>
            </div>
          </div>

          {/* Salário & Match Score Badge */}
          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {job.salary}
            </div>
            {getScoreBadge()}
          </div>
        </div>

        {/* Descrição */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-5 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Requisitos Técnicos */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-heading">
              Stack & Competências Exigidas
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {job.skills.map((skill) => (
              <span
                key={skill.id}
                className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 text-xs font-medium"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer com Ação Corporativa */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Vaga Auditada & Verificada
        </span>

        {hasApplied ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 text-xs font-bold">
            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <span>Candidatura Submetida</span>
          </div>
        ) : (
          <button
            onClick={() => onApply(job)}
            className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-2"
          >
            <span>Analisar Vaga & Aplicar</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
