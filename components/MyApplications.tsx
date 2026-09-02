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
      <div className="bg-white dark:bg-[#0c111d] border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center text-2xl mx-auto mb-4">
          📄
        </div>
        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
          Você ainda não se candidatou a nenhuma vaga
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
          Explore as vagas abertas em tecnologia e veja na hora o seu percentual de compatibilidade com cada uma!
        </p>
        <button
          onClick={onBrowseJobs}
          className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all"
        >
          Explorar Vagas Disponíveis
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Candidaturas Enviadas ({applications.length})
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Acompanhe o status e a compatibilidade do seu perfil
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {applications.map((app) => (
          <div
            key={app.id}
            className="bg-white dark:bg-[#0c111d] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                {app.company}
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {app.jobTitle}
              </h4>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>Enviada em: {app.appliedAt}</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 font-semibold text-blue-700 dark:text-blue-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-700"></span>
                  {app.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
              <div className="text-right">
                <span className="block text-[10px] text-slate-400 font-medium uppercase">Seu Match</span>
                <span className={`inline-block px-3 py-1 rounded-xl text-xs font-black ${
                  app.score >= 70
                    ? 'bg-blue-700 text-white'
                    : 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-950'
                }`}>
                  {app.score}% de Compatibilidade
                </span>
              </div>

              <button
                onClick={() => onCancelApplication(app.id)}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors text-xs font-bold"
                title="Cancelar candidatura"
              >
                &times;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
