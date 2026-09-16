'use client';

import React, { useState, useEffect } from 'react';
import { Job, Application, CandidateProfile } from '../types';
import { calculateCandidateMatch } from '../lib/matcher';

interface ApplyModalProps {
  job: Job | null;
  savedProfile: CandidateProfile;
  onClose: () => void;
  onSubmitApplication: (app: Application) => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  job,
  savedProfile,
  onClose,
  onSubmitApplication
}) => {
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidateSkills, setCandidateSkills] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (savedProfile.name) setCandidateName(savedProfile.name);
    if (savedProfile.email) setCandidateEmail(savedProfile.email);
    if (savedProfile.skills) setCandidateSkills(savedProfile.skills);
  }, [savedProfile]);

  if (!job) return null;

  const previewApp = candidateSkills.trim()
    ? calculateCandidateMatch(
        candidateName || 'Candidato',
        candidateEmail || 'candidato@email.com',
        candidateSkills,
        job
      )
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim() || !candidateEmail.trim() || !candidateSkills.trim()) {
      alert('Por favor, preencha seu nome, e-mail e suas competências técnicas.');
      return;
    }

    const application = calculateCandidateMatch(
      candidateName,
      candidateEmail,
      candidateSkills,
      job
    );

    onSubmitApplication(application);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="bg-white dark:bg-[#0c121e] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
        {/* Fechar */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xl font-bold p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          &times;
        </button>

        {isSuccess ? (
          <div className="text-center py-10">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-emerald-600/30">
              ✓
            </div>
            <h3 className="text-xl font-heading font-black text-slate-900 dark:text-white mb-2">
              Candidatura Submetida com Sucesso!
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              O relatório de aderência técnica ({previewApp?.score}% de match) foi enviado para a equipe de atração de talentos de <strong>{job.company}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header da vaga */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 font-heading">
                  {job.company}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Processo Seletivo Oficial</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white mt-0.5">
                {job.title}
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-medium">📍 {job.location}</span>
                <span>•</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{job.workModel}</span>
                <span>•</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{job.salary}</span>
              </div>
            </div>

            {/* Descrição */}
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50/70 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
              <strong className="block text-slate-800 dark:text-slate-200 mb-1 font-heading text-xs uppercase tracking-wider">
                Sobre a Oportunidade:
              </strong>
              {job.description}
            </div>

            {/* Formulário do Candidato */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-heading">
                Dados do Profissional
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="Ex: Carlos Eduardo Silva"
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    E-mail Corporativo / Pessoal *
                  </label>
                  <input
                    type="email"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    placeholder="Ex: carlos.silva@email.com"
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Stack Técnica & Tecnologias (separadas por vírgula) *
                </label>
                <textarea
                  rows={3}
                  value={candidateSkills}
                  onChange={(e) => setCandidateSkills(e.target.value)}
                  placeholder="Ex: React, TypeScript, Node.js, Next.js, Git, Tailwind CSS"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none leading-relaxed"
                  required
                />
              </div>
            </div>

            {/* Prévia do Match em tempo real */}
            {previewApp && (
              <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white font-heading">
                    Índice de Aderência Técnica:
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-blue-700 text-white text-xs font-black tabular-nums">
                    {previewApp.score}% Match
                  </span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-700 transition-all duration-300 rounded-full"
                    style={{ width: `${previewApp.score}%` }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                  <div>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                      ✓ Requisitos Atendidos ({previewApp.matchedSkills.length}):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {previewApp.matchedSkills.length > 0 ? (
                        previewApp.matchedSkills.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-400">Nenhum requisito atendido</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      💡 Tecnologias Complementares ({previewApp.missingSkills.length}):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {previewApp.missingSkills.length > 0 ? (
                        previewApp.missingSkills.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-400">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-blue-700 font-bold">100% de cobertura técnica!</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Ações */}
            <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-[2] py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-700/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Submeter Candidatura</span>
                <span>&rarr;</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
