'use client';

import React from 'react';
import { Application } from '../types';

interface MyApplicationsProps {
  applications: Application[];
  onBrowseJobs: () => void;
  onCancelApplication: (id: string) => void;
}

export const MyApplications: React.FC<MyApplicationsProps> = ({
  applications,
  onBrowseJobs,
  onCancelApplication
}) => {
  if (applications.length === 0) {
    return (
      <div className="bg-white dark:bg-[#0c121e] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-12 text-center shadow-xs font-sans">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center text-2xl mx-auto mb-4 border border-blue-200 dark:border-blue-900">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-heading font-extrabold text-slate-900 dark:text-white mb-1">
          Nenhuma candidatura ativa registrada
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
          Navegue pelas vagas abertas no catálogo de oportunidades e envie sua candidatura com análise instantânea de aderência técnica.
        </p>
        <button
          onClick={onBrowseJobs}
          className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-700/20 transition-all"
        >
          Explorar Catálogo de Vagas &rarr;
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans">
      <div className="flex items-center justify-between pb-2">
        <div>
          <h3 className="text-base font-heading font-extrabold text-slate-900 dark:text-white">
            Processos em Acompanhamento ({applications.length})
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Status dos processos seletivos e aderência técnica submetida
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {applications.map((app) => (
          <div
            key={app.id}
            className="bg-white dark:bg-[#0c121e] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-blue-500/40 transition-all"
          >
            <div className="space-y-1">
              <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider font-heading">
                {app.company}
              </span>
              <h4 className="text-base font-heading font-bold text-slate-900 dark:text-white">
                {app.jobTitle}
              </h4>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>Submetida em: {app.appliedAt}</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {app.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 self-start sm:self-center shrink-0">
              <div className="text-right">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider font-heading">Índice Match</span>
                <span className={`inline-block px-3 py-1 rounded-lg text-xs font-black tabular-nums ${
                  app.score >= 70
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                }`}>
                  {app.score}% Compatível
                </span>
              </div>

              <button
                onClick={() => onCancelApplication(app.id)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors text-xs font-bold"
                title="Retirar candidatura"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
