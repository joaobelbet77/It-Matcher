'use client';

import React, { useState } from 'react';
import { CandidateProfile } from '../types';

interface ProfileTabProps {
  profile: CandidateProfile;
  applicationsCount: number;
  onSaveProfile: (profile: CandidateProfile) => void;
  onLogout: () => void;
  onLoginOrCreateAccount: (newProfile: CandidateProfile) => void;
}

const COMMON_SKILLS = [
  'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js',
  'Python', 'Django', 'FastAPI', 'SQL', 'PostgreSQL', 'MongoDB',
  'Docker', 'Kubernetes', 'AWS', 'Flutter', 'Git', 'Tailwind CSS',
  'GraphQL', 'CI/CD', 'Java', 'Spring Boot'
];

export const ProfileTab: React.FC<ProfileTabProps> = ({
  profile,
  applicationsCount,
  onSaveProfile,
  onLogout,
  onLoginOrCreateAccount
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');

  // Form de edição
  const [name, setName] = useState(profile.name || '');
  const [email, setEmail] = useState(profile.email || '');
  const [phone, setPhone] = useState(profile.phone || '(11) 98765-4321');
  const [location, setLocation] = useState(profile.location || 'São Paulo, SP - Brasil');
  const [roleTitle, setRoleTitle] = useState(profile.roleTitle || '');
  const [seniority, setSeniority] = useState<'Júnior' | 'Pleno' | 'Sênior' | 'Especialista'>(profile.seniority || 'Pleno');
  const [workPreference, setWorkPreference] = useState<'Remoto' | 'Híbrido' | 'Presencial' | 'Indiferente'>(profile.workPreference || 'Remoto');
  const [salaryExpectation, setSalaryExpectation] = useState(profile.salaryExpectation || 'R$ 8.000,00');
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedinUrl || 'linkedin.com/in/carlossilva-dev');
  const [githubUrl, setGithubUrl] = useState(profile.githubUrl || 'github.com/carlossilva');
  const [portfolioUrl, setPortfolioUrl] = useState(profile.portfolioUrl || 'carlossilva.dev');
  const [skills, setSkills] = useState(profile.skills || '');
  const [bio, setBio] = useState(
    profile.bio ||
      'Engenheiro de software focado em ecossistema TypeScript, React, Next.js e Node.js. Sólida experiência em arquitetura de microserviços e interfaces de alta performance.'
  );
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form do modal de auth
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authRole, setAuthRole] = useState('');
  const [authSkills, setAuthSkills] = useState('');

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
    if (!name.trim() || !email.trim()) {
      alert('Por favor, informe seu nome e e-mail corporativo.');
      return;
    }

    const updated: CandidateProfile = {
      ...profile,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      location: location.trim(),
      roleTitle: roleTitle.trim(),
      seniority,
      workPreference,
      salaryExpectation: salaryExpectation.trim(),
      linkedinUrl: linkedinUrl.trim(),
      githubUrl: githubUrl.trim(),
      portfolioUrl: portfolioUrl.trim(),
      skills: skills.trim(),
      bio: bio.trim(),
      isLoggedIn: true
    };

    onSaveProfile(updated);
    setFeedback('Perfil executivo e competências técnicas atualizados com sucesso!');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) {
      alert('Por favor, preencha o e-mail e a senha.');
      return;
    }

    if (authMode === 'register') {
      if (!authName.trim()) {
        alert('Por favor, informe seu nome.');
        return;
      }
      const newProf: CandidateProfile = {
        name: authName.trim(),
        email: authEmail.trim(),
        roleTitle: authRole.trim() || 'Engenheiro(a) de Software',
        seniority: 'Pleno',
        workPreference: 'Remoto',
        skills: authSkills.trim() || 'React, TypeScript, Node.js, Git',
        isLoggedIn: true
      };
      onLoginOrCreateAccount(newProf);
      setName(newProf.name);
      setEmail(newProf.email);
      setRoleTitle(newProf.roleTitle);
      setSkills(newProf.skills);
      setShowAuthModal(false);
      setFeedback(`Bem-vindo(a), ${newProf.name}! Sua conta corporativa foi criada.`);
    } else {
      const newProf: CandidateProfile = {
        ...profile,
        email: authEmail.trim(),
        name: authName.trim() || profile.name || 'Candidato',
        isLoggedIn: true
      };
      onLoginOrCreateAccount(newProf);
      setShowAuthModal(false);
      setFeedback('Sessão iniciada com sucesso. Bem-vindo de volta.');
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  // Completude do perfil
  const calculateCompleteness = () => {
    let score = 0;
    if (name) score += 15;
    if (email) score += 15;
    if (phone) score += 10;
    if (roleTitle) score += 15;
    if (skills && skills.length > 5) score += 20;
    if (bio) score += 10;
    if (linkedinUrl || githubUrl) score += 15;
    return Math.min(score, 100);
  };

  const completeness = calculateCompleteness();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12 font-sans">
      {/* Toast Feedback */}
      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-200 text-xs font-bold rounded-2xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">✓</span>
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-sm font-bold opacity-60 hover:opacity-100">&times;</button>
        </div>
      )}

      {/* Header Corporativo do Usuário */}
      <div className="bg-white dark:bg-[#0c121e] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-7 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 text-white font-heading font-black text-2xl flex items-center justify-center shadow-md shadow-blue-900/20 shrink-0 border border-blue-600/30">
              {name ? name.charAt(0).toUpperCase() : '👤'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {name || 'Meu Perfil Executivo'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Conta Verificada
                </span>
              </div>
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mt-1 font-heading">
                {roleTitle || 'Engenheiro de Software'} • {seniority}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
                <span>📧 {email || 'sem e-mail cadastrado'}</span>
                <span>📍 {location}</span>
              </p>
            </div>
          </div>

          {/* Botões de Ação Corporativa */}
          <div className="flex items-center gap-2 flex-wrap self-start sm:self-center shrink-0">
            <button
              onClick={() => {
                setAuthMode('register');
                setShowAuthModal(true);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <span>➕</span>
              <span>Cadastrar Nova Conta</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 transition-colors flex items-center gap-1.5"
              title="Encerrar sessão"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sair da Conta</span>
            </button>
          </div>
        </div>

        {/* Métricas do Perfil */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-[#080d17] border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1 font-heading">
              Aderência do Perfil
            </span>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-lg font-heading font-extrabold text-slate-900 dark:text-white tabular-nums">
                {completeness}%
              </span>
              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400">
                {completeness === 100 ? 'Auditado' : 'Em progresso'}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-700 transition-all duration-500 rounded-full"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-[#080d17] border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1 font-heading">
              Candidaturas Submetidas
            </span>
            <span className="text-lg font-heading font-extrabold text-slate-900 dark:text-white block tabular-nums">
              {applicationsCount} processos
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
              Sincronizado com o RH
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-[#080d17] border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1 font-heading">
              Regime de Trabalho
            </span>
            <span className="text-lg font-heading font-extrabold text-blue-700 dark:text-blue-400 block">
              {workPreference}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
              Alvo: {salaryExpectation}
            </span>
          </div>
        </div>
      </div>

      {/* Formulário Principal */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Bloco 1: Informações Pessoais */}
        <div className="bg-white dark:bg-[#0c121e] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-heading flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-700"></span>
              <span>1. Informações Pessoais & Contato Corporativo</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Carlos Eduardo Silva"
                className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                E-mail Corporativo *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: carlos.silva@email.com"
                className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Telefone / WhatsApp
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: (11) 98765-4321"
                className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Localização (Cidade & Estado)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: São Paulo, SP"
                className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>
          </div>
        </div>

        {/* Bloco 2: Carreira */}
        <div className="bg-white dark:bg-[#0c121e] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-heading flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-700"></span>
              <span>2. Carreira, Senioridade & Condições Contratuais</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Especialidade ou Cargo Atual
              </label>
              <input
                type="text"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="Ex: Desenvolvedor Full Stack Sênior"
                className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nível de Senioridade
              </label>
              <select
                value={seniority}
                onChange={(e) => setSeniority(e.target.value as any)}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-700"
              >
                <option value="Júnior">Júnior (0 a 2 anos)</option>
                <option value="Pleno">Pleno (2 a 5 anos)</option>
                <option value="Sênior">Sênior (5+ anos)</option>
                <option value="Especialista">Especialista / Tech Lead</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Modelo de Trabalho Preferido
              </label>
              <select
                value={workPreference}
                onChange={(e) => setWorkPreference(e.target.value as any)}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-700"
              >
                <option value="Remoto">100% Remoto</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Presencial">Presencial</option>
                <option value="Indiferente">Indiferente</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Pretensão Salarial Mensal
              </label>
              <input
                type="text"
                value={salaryExpectation}
                onChange={(e) => setSalaryExpectation(e.target.value)}
                placeholder="Ex: R$ 8.000,00"
                className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>
          </div>
        </div>

        {/* Bloco 3: Stack Técnica */}
        <div className="bg-white dark:bg-[#0c121e] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-heading flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-700"></span>
              <span>3. Stack de Engenharia & Tecnologias Dominadas</span>
            </h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Lista de Tecnologias (separadas por vírgula):
            </label>
            <textarea
              rows={4}
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Ex: React, TypeScript, Next.js, Node.js, Git, SQL, Tailwind CSS, Docker"
              className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 resize-none leading-relaxed"
            />

            <div className="mt-3">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium block mb-2 font-heading uppercase tracking-wider">
                Adicionar rapidamente à stack:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_SKILLS.map((sk) => (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => handleAddQuickSkill(sk)}
                    className="text-[11px] bg-slate-100 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-700 dark:hover:text-blue-300 text-slate-700 dark:text-slate-300 font-semibold px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-700 transition-colors"
                  >
                    + {sk}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bloco 4: Links Profissionais */}
        <div className="bg-white dark:bg-[#0c121e] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-heading flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-700"></span>
              <span>4. Links Profissionais & Resumo Executivo</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                LinkedIn
              </label>
              <input
                type="text"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="linkedin.com/in/seuperfil"
                className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                GitHub
              </label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="github.com/seuperfil"
                className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Portfólio / Site
              </label>
              <input
                type="text"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="seusite.dev"
                className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Resumo Profissional (Mini Bio):
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Apresente sua trajetória, projetos principais e domínio arquitetural..."
              className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Rodapé de Ação */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white dark:bg-[#0c121e] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
            Os dados salvos recalculam instantaneamente os percentuais de compatibilidade com todas as vagas.
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white text-xs font-black rounded-xl shadow-md shadow-blue-700/20 transition-all flex items-center justify-center gap-2"
          >
            <span>💾 Salvar Alterações</span>
          </button>
        </div>
      </form>

      {/* Modal de Login / Cadastro */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#0c121e] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xl font-bold p-1 rounded-lg"
            >
              &times;
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-700 to-slate-950 text-white flex items-center justify-center text-xl font-black mx-auto mb-3 shadow-md shadow-blue-900/20">
                🎯
              </div>
              <h3 className="text-lg font-heading font-extrabold text-slate-900 dark:text-white">
                {authMode === 'register' ? 'Criar Nova Conta no ItMatcher' : 'Acessar Conta'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {authMode === 'register'
                  ? 'Cadastre seu perfil técnico para calcular compatibilidade e candidatar-se.'
                  : 'Acesse seu histórico de candidaturas e perfil auditado.'}
              </p>
            </div>

            <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl mb-5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  authMode === 'register'
                    ? 'bg-white dark:bg-[#0c121e] text-blue-700 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Criar Conta
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  authMode === 'login'
                    ? 'bg-white dark:bg-[#0c121e] text-blue-700 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Entrar
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="Ex: Carlos Eduardo Silva"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  E-mail Corporativo
                </label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="Ex: seuemail@exemplo.com"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  required
                />
              </div>

              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Especialidade
                    </label>
                    <input
                      type="text"
                      value={authRole}
                      onChange={(e) => setAuthRole(e.target.value)}
                      placeholder="Ex: Engenheiro Full Stack"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Stack Principal (separada por vírgula)
                    </label>
                    <input
                      type="text"
                      value={authSkills}
                      onChange={(e) => setAuthSkills(e.target.value)}
                      placeholder="Ex: React, TypeScript, Node.js, Git"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-700/20 transition-all mt-4"
              >
                {authMode === 'register' ? 'Criar Conta e Acessar' : 'Entrar na Conta'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
