'use client';

import React from 'react';
import { Job } from '../types';

interface QuickTemplatesProps {
  onLoadTemplate: (job: Job, candidateName: string, candidateSkills: string) => void;
}

export const QuickTemplates: React.FC<QuickTemplatesProps> = ({ onLoadTemplate }) => {
  const templates = [
    {
      title: 'Exemplo: Desenvolvedor Full Stack',
      badge: 'React + Node',
      description: 'Testa vaga Full Stack contra o candidato Carlos (78% de Aderência)',
      job: {
        id: 'job-tpl-fullstack',
        title: 'Desenvolvedor Full Stack',
        skills: [
          { id: 's1', name: 'React', weight: 5 },
          { id: 's2', name: 'TypeScript', weight: 4 },
          { id: 's3', name: 'Node.js', weight: 4 },
          { id: 's4', name: 'SQL', weight: 3 },
          { id: 's5', name: 'Docker', weight: 3 }
        ],
        createdAt: new Date().toISOString()
      },
      candidateName: 'Carlos Eduardo',
      candidateSkills: 'React, TypeScript, Node.js, Next.js, SQL, Git'
    },
    {
      title: 'Exemplo: Desenvolvedor Frontend',
      badge: 'Next.js + UI',
      description: 'Testa vaga Frontend contra a candidata Elaine (90% de Aderência)',
      job: {
        id: 'job-tpl-frontend',
        title: 'Desenvolvedor Frontend',
        skills: [
          { id: 's1', name: 'Next.js', weight: 5 },
          { id: 's2', name: 'TypeScript', weight: 5 },
          { id: 's3', name: 'Tailwind CSS', weight: 4 },
          { id: 's4', name: 'HTML/CSS', weight: 3 }
        ],
        createdAt: new Date().toISOString()
      },
      candidateName: 'Elaine Costa',
      candidateSkills: 'Next.js, TypeScript, Tailwind CSS, HTML/CSS, Git, Figma'
    },
    {
      title: 'Exemplo: Cloud & DevOps',
      badge: 'AWS + Docker',
      description: 'Testa vaga Cloud contra o candidato Lucas (52% de Aderência)',
      job: {
        id: 'job-tpl-devops',
        title: 'Especialista Cloud & DevOps',
        skills: [
          { id: 's1', name: 'Kubernetes', weight: 5 },
          { id: 's2', name: 'AWS', weight: 5 },
          { id: 's3', name: 'Terraform', weight: 4 },
          { id: 's4', name: 'Docker', weight: 3 },
          { id: 's5', name: 'Linux', weight: 3 }
        ],
        createdAt: new Date().toISOString()
      },
      candidateName: 'Lucas Lima',
      candidateSkills: 'Docker, Linux, AWS, Python, Git'
    }
  ];

  return (
    <div className="bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-950/60 rounded-2xl p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-blue-950 dark:text-blue-300 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-blue-700 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quer testar agora mesmo sem digitar nada?
          </span>
        </div>
        <span className="text-xs text-blue-800/80 dark:text-blue-400 font-medium">
          Clique em qualquer modelo abaixo para carregar:
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {templates.map((tpl, i) => (
          <button
            key={i}
            onClick={() => onLoadTemplate(tpl.job, tpl.candidateName, tpl.candidateSkills)}
            className="flex flex-col justify-between p-3.5 bg-white dark:bg-[#0c111d] hover:bg-blue-50/50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-left transition-all group shadow-sm hover:shadow hover:border-blue-400 dark:hover:border-blue-700"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                  {tpl.title}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                {tpl.description}
              </p>
            </div>
            <div className="mt-3 text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1">
              <span>Carregar teste</span>
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
