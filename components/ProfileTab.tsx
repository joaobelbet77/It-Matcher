'use client';

import React, { useState } from 'react';
import { CandidateProfile } from '../types';

interface ProfileTabProps {
  profile: CandidateProfile;
  onSaveProfile: (profile: CandidateProfile) => void;
}

const COMMON_SKILLS = [
  'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js',
  'Python', 'Django', 'SQL', 'PostgreSQL', 'Docker', 'AWS',
  'Flutter', 'Git', 'Tailwind CSS', 'GraphQL', 'Kubernetes'
];

export const ProfileTab: React.FC<ProfileTabProps> = ({ profile, onSaveProfile }) => {
  const [name, setName] = useState(profile.name || '');
  const [email, setEmail] = useState(profile.email || '');
  const [roleTitle, setRoleTitle] = useState(profile.roleTitle || '');
  const [skills, setSkills] = useState(profile.skills || '');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAddQuickSkill = (skill: string) => {
    if (!skills.trim()) {
      setSkills(skill);
    } else {
      const list = skills.split(',').map((s) => s.trim().toLowerCase());
      if (!list.includes(skill.toLowerCase())) {
        setSkills(`${skills.trim()}, ${skill}`);
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      name: name.trim(),
      email: email.trim(),
      roleTitle: roleTitle.trim(),
      skills: skills.trim()
    });
    setFeedback('Seu perfil foi salvo! Agora todas as vagas mostrarão seu percentual de match automaticamente.');
    setTimeout(() => setFeedback(null), 4500);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-[#0c111d] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Meu Perfil Profissional
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Salve suas habilidades para calcular automaticamente o seu Match em todas as vagas disponíveis!
        </p>
      </div>

      {feedback && (
        <div className="mb-6 p-3.5 bg-blue-50 border border-blue-200 text-blue-900 dark:bg-blue-950/60 dark:border-blue-800 dark:text-blue-200 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <span>✓ {feedback}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Seu Nome
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Carlos Eduardo Silva"
            className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Seu E-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ex: seuemail@exemplo.com"
            className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Cargo ou Especialidade
          </label>
          <input
            type="text"
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
            placeholder="Ex: Desenvolvedor Frontend Pleno / React"
            className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Suas Habilidades & Tecnologias (separadas por vírgula):
          </label>
          <textarea
            rows={4}
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Ex: React, TypeScript, Next.js, Node.js, Git, SQL, Tailwind CSS"
            className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />

          <div className="mt-2.5">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mb-1.5">
              Clique para adicionar rapidamente ao seu perfil:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_SKILLS.map((sk) => (
                <button
                  key={sk}
                  type="button"
                  onClick={() => handleAddQuickSkill(sk)}
                  className="text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 font-semibold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  + {sk}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all"
        >
          Salvar Meu Perfil
        </button>
      </form>
    </div>
  );
};
