'use client';

import React, { useState } from 'react';
import { Job, Skill } from '../types';
import { getWeightLabel } from '../lib/matcher';

interface JobFormProps {
  onSaveJob: (job: Job) => void;
  activeJob: Job | null;
}

const COMMON_SUGGESTIONS = ['React', 'TypeScript', 'Node.js', 'Python', 'SQL', 'Docker', 'AWS', 'Git', 'Tailwind CSS'];

export const JobForm: React.FC<JobFormProps> = ({ onSaveJob, activeJob }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [skillName, setSkillName] = useState('');
  const [skillWeight, setSkillWeight] = useState<number>(4);
  const [tempSkills, setTempSkills] = useState<Skill[]>([
    { id: '1', name: 'React', weight: 5 },
    { id: '2', name: 'TypeScript', weight: 4 },
    { id: '3', name: 'Node.js', weight: 4 }
  ]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAddSkill = (nameToAdd?: string) => {
    const targetName = (nameToAdd || skillName).trim();
    if (!targetName) return;

    if (tempSkills.some((s) => s.name.toLowerCase() === targetName.toLowerCase())) {
      alert(`A habilidade "${targetName}" já está na lista.`);
      return;
    }

    const newSkill: Skill = {
      id: `skill-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: targetName,
      weight: skillWeight
    };

    setTempSkills((prev) => [...prev, newSkill]);
    if (!nameToAdd) {
      setSkillName('');
      setSkillWeight(4);
    }
  };

  const handleRemoveSkill = (id: string) => {
    setTempSkills((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSaveJob = () => {
    const trimmedTitle = jobTitle.trim();
    if (!trimmedTitle) {
      alert('Por favor, digite o cargo ou nome da vaga (ex: Desenvolvedor Web).');
      return;
    }
    if (tempSkills.length === 0) {
      alert('Por favor, adicione pelo menos uma habilidade necessária para a vaga.');
      return;
    }

    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: trimmedTitle,
      skills: [...tempSkills],
      createdAt: new Date().toISOString()
    };

    onSaveJob(newJob);
    setJobTitle('');
    setFeedback(`Vaga "${trimmedTitle}" salva com sucesso! Agora você já pode testar candidatos no Passo 2.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="bg-white dark:bg-[#0c111d] border-2 border-blue-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      <div>
        {/* Step Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-blue-700 text-white font-black text-xs flex items-center justify-center">
              1
            </span>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Passo 1: Criar ou Escolher a Vaga
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Defina o cargo e o que a pessoa precisa saber</p>
            </div>
          </div>

          {activeJob && (
            <span className="text-[11px] bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-950 px-2.5 py-1 rounded-full font-bold truncate max-w-[170px]">
              Vaga ativa: {activeJob.title}
            </span>
          )}
        </div>

        {feedback && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-950 dark:bg-blue-950/60 dark:border-blue-900 dark:text-blue-200 text-xs font-semibold rounded-xl flex items-center gap-2">
            <span>{feedback}</span>
          </div>
        )}

        {/* 1. Nome da Vaga */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Qual é o nome do cargo / vaga?
          </label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Ex: Desenvolvedor Frontend Júnior, Analista de Dados..."
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* 2. Adicionar Habilidade */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Adicionar habilidade necessária:
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              placeholder="Digite uma habilidade (ex: React, Inglês, Excel)"
              className="flex-1 px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

            <select
              value={skillWeight}
              onChange={(e) => setSkillWeight(Number(e.target.value))}
              className="px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value={5}>Obrigatória (Peso 5)</option>
              <option value={4}>Muito Importante (Peso 4)</option>
              <option value={3}>Importância Média (Peso 3)</option>
              <option value={2}>Desejável (Peso 2)</option>
              <option value={1}>Diferencial (Peso 1)</option>
            </select>

            <button
              type="button"
              onClick={() => handleAddSkill()}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-sm"
            >
              + Adicionar
            </button>
          </div>

          {/* Sugestões rápidas */}
          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Sugestões rápidas:</span>
            {COMMON_SUGGESTIONS.map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => handleAddSkill(sug)}
                className="text-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-700 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 font-semibold px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 transition-colors"
              >
                + {sug}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Lista de Habilidades */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Habilidades requeridas nesta vaga ({tempSkills.length}):
            </span>
            <span className="text-[11px] text-slate-400">Clique no &times; para remover</span>
          </div>

          <div className="flex flex-wrap gap-2 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 min-h-[50px] items-center">
            {tempSkills.length === 0 ? (
              <span className="text-xs text-slate-400 italic">Nenhuma habilidade adicionada.</span>
            ) : (
              tempSkills.map((skill) => {
                const info = getWeightLabel(skill.weight);
                return (
                  <span
                    key={skill.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border ${info.badgeClass} shadow-2xs`}
                  >
                    <span>{skill.name}</span>
                    <span className="text-[10px] opacity-80">({info.short})</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill.id)}
                      className="ml-1 hover:opacity-100 opacity-70 font-black text-sm"
                      title="Remover"
                    >
                      &times;
                    </button>
                  </span>
                );
              })
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSaveJob}
        className="w-full mt-3 py-3 px-4 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
        <span>Salvar Esta Vaga</span>
      </button>
    </div>
  );
};
