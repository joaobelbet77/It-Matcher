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

  return (
    <div className="bg-white dark:bg-[#0c111d] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:border-blue-400 dark:hover:border-blue-700 transition-all flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
              {job.company}
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
              <span>📍 {job.location}</span>
              <span>•</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{job.workModel}</span>
              <span>•</span>
              <span>{job.level}</span>
            </div>
          </div>

          {/* Salário & Match preview */}
          <div className="flex flex-col sm:items-end gap-1 shrink-0">
            <span className="text-xs font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-lg">
              {job.salary}
            </span>
            {candidateSkills.trim() && (
              <span className={`text-[11px] font-black px-2 py-0.5 rounded-md border ${
                matchScore >= 70
                  ? 'bg-blue-700 text-white border-blue-700'
                  : 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-900'
              }`}>
                {matchScore}% de Match com você
              </span>
            )}
          </div>
        </div>

        {/* Descrição curta */}
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skills Requeridas */}
        <div className="mb-5">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-2">
            Requisitos da vaga:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {job.skills.map((skill) => (
              <span
                key={skill.id}
                className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 text-xs font-medium"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Publicada {job.postedAt}
        </span>

        {hasApplied ? (
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-950 text-xs font-bold">
            <span>✓</span> Já Candidatado
          </span>
        ) : (
          <button
            onClick={() => onApply(job)}
            className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
          >
            <span>Ver Detalhes & Candidatar-se</span>
            <span>&rarr;</span>
          </button>
        )}
      </div>
    </div>
  );
};
