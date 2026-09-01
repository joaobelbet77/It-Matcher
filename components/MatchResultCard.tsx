'use client';

import React from 'react';
import { MatchResult } from '../types';
import { getScoreEvaluation } from '../lib/matcher';

interface MatchResultCardProps {
  result: MatchResult;
  onDelete?: (id: string) => void;
}

export const MatchResultCard: React.FC<MatchResultCardProps> = ({ result, onDelete }) => {
  const evalInfo = getScoreEvaluation(result.score);

  return (
    <div className="bg-white dark:bg-[#0c111d] border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 transition-all">
      {/* Header Info & Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">
              {result.candidateName}
            </h4>
            <span className="text-xs text-slate-400 font-medium">
              Avaliado às {result.processedAt}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Candidatando-se para: <strong className="text-blue-600 dark:text-blue-400 font-bold">{result.jobTitle}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 border ${evalInfo.badgeClass}`}>
            <span>{evalInfo.title}</span>
            <span className="text-base font-black">({result.score}%)</span>
          </div>

          {onDelete && (
            <button
              onClick={() => onDelete(result.id)}
              className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title="Excluir este resultado"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Explanation Box */}
      <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/50 text-xs text-slate-700 dark:text-slate-300 mb-4 flex items-start gap-2.5">
        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
          i
        </div>
        <div>
          <strong className="text-blue-900 dark:text-blue-200">Resumo da Avaliação: </strong>
          <span>{evalInfo.description}</span>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="space-y-1.5 mb-5">
        <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
          <span>Aderência aos Requisitos da Vaga</span>
          <span className="text-blue-600 dark:text-blue-400 font-extrabold">{result.score}%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
          <div
            className={`h-full ${evalInfo.progressBarColor} transition-all duration-700 ease-out`}
            style={{ width: `${result.score}%` }}
          />
        </div>
      </div>

      {/* Skills Comparison Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        {/* Matched Skills */}
        <div className="bg-blue-50/40 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-200 dark:border-blue-900/40">
          <h5 className="text-xs font-black text-blue-900 dark:text-blue-300 mb-2.5 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            <span>Habilidades que o candidato TEM ({result.matchedSkills.length})</span>
          </h5>
          <div className="flex flex-wrap gap-1.5">
            {result.matchedSkills.length > 0 ? (
              result.matchedSkills.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-bold bg-white dark:bg-[#0c111d] text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800 rounded-lg shadow-2xs"
                >
                  {s}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">Nenhuma habilidade compatível encontrada</span>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <h5 className="text-xs font-black text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Habilidades que o candidato NÃO TEM ({result.missingSkills.length})</span>
          </h5>
          <div className="flex flex-wrap gap-1.5">
            {result.missingSkills.length > 0 ? (
              result.missingSkills.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-bold bg-white dark:bg-[#0c111d] text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 rounded-lg shadow-2xs"
                >
                  {s}
                </span>
              ))
            ) : (
              <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">Candidato possui 100% dos requisitos!</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
