'use client';

import React, { useState } from 'react';
import { Job, MatchResult } from '../types';
import { calculateMatch } from '../lib/matcher';

interface CandidateFormProps {
  jobs: Job[];
  selectedJobId: string | null;
  onSelectJobId: (id: string) => void;
  onMatchCalculated: (result: MatchResult) => void;
}

const COMMON_CANDIDATE_SKILLS = ['React', 'TypeScript', 'Node.js', 'HTML/CSS', 'Git', 'SQL', 'Python', 'Docker', 'Figma'];

export const CandidateForm: React.FC<CandidateFormProps> = ({
  jobs,
  selectedJobId,
  onSelectJobId,
  onMatchCalculated
}) => {
  const [candidateName, setCandidateName] = useState('');
  const [candidateSkills, setCandidateSkills] = useState('');

  const currentJob = jobs.find((j) => j.id === selectedJobId) || jobs[0] || null;

  const handleAddQuickSkill = (skill: string) => {
    if (!candidateSkills.trim()) {
      setCandidateSkills(skill);
    } else {
      const list = candidateSkills.split(',').map((s) => s.trim().toLowerCase());
      if (!list.includes(skill.toLowerCase())) {
        setCandidateSkills(`${candidateSkills.trim()}, ${skill}`);
      }
    }
  };

  const handleProcessMatch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentJob) {
      alert('Você precisa criar ou selecionar uma vaga no Passo 1 primeiro.');
      return;
    }

    const trimmedName = candidateName.trim();
    const trimmedSkills = candidateSkills.trim();

    if (!trimmedName) {
      alert('Por favor, informe o nome do candidato.');
      return;
    }
    if (!trimmedSkills) {
      alert('Por favor, digite as habilidades que o candidato possui.');
      return;
    }

    const result = calculateMatch(trimmedName, trimmedSkills, currentJob);
    onMatchCalculated(result);

    setCandidateName('');
    setCandidateSkills('');
  };

  return (
    <div className="bg-white dark:bg-[#0c111d] border-2 border-blue-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      <form onSubmit={handleProcessMatch}>
        {/* Step Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-blue-700 text-white font-black text-xs flex items-center justify-center">
              2
            </span>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Passo 2: Avaliar um Candidato
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Coloque o nome e as habilidades da pessoa</p>
            </div>
          </div>

          {jobs.length > 0 && (
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-slate-500 dark:text-slate-400 font-medium">Comparar com:</label>
              <select
                value={selectedJobId || (currentJob ? currentJob.id : '')}
                onChange={(e) => onSelectJobId(e.target.value)}
                className="text-xs bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-blue-950 dark:text-blue-300 font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 max-w-[170px] truncate"
              >
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* 1. Nome do Candidato */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Nome do Candidato(a):
          </label>
          <input
            type="text"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            placeholder="Ex: Maria Silva ou João Santos"
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* 2. Habilidades do Candidato */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Habilidades no currículo (separadas por vírgula):
          </label>
          <textarea
            rows={3}
            value={candidateSkills}
            onChange={(e) => setCandidateSkills(e.target.value)}
            placeholder="Ex: React, JavaScript, Node.js, Git, TypeScript (separe por vírgula)"
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
          />

          {/* Sugestões de clique */}
          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Clique para adicionar:</span>
            {COMMON_CANDIDATE_SKILLS.map((sk) => (
              <button
                key={sk}
                type="button"
                onClick={() => handleAddQuickSkill(sk)}
                className="text-[10px] bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-semibold px-2 py-0.5 rounded-md border border-blue-200 dark:border-slate-700 transition-colors"
              >
                + {sk}
              </button>
            ))}
          </div>
        </div>

        {/* Informação sobre a vaga selecionada */}
        {currentJob && (
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 mb-3 flex items-center justify-between">
            <span>
              Vaga comparada: <strong className="text-slate-900 dark:text-white font-bold">{currentJob.title}</strong>
            </span>
            <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-950 px-2 py-0.5 rounded text-[10px] font-bold">
              {currentJob.skills.length} requisitos
            </span>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span>Ver Compatibilidade (Calcular Match)</span>
        </button>
      </form>
    </div>
  );
};
