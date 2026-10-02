'use client';

import React, { useState, useEffect } from 'react';
import { CandidateSidebar } from '@/components/candidato/CandidatoSidebar';
import { CandidateHeader } from '@/components/candidato/CandidatoHeader';
import { JobCard } from '@/components/candidato/CandidatoVagas';
import { ApplyModal } from '@/components/candidato/CandidatoModalVaga';
import { MyApplications } from '@/components/candidato/CandidatoInscricoes';
import { ProfileTab } from '@/components/candidato/CandidatoPerfil';
import { AboutUsTab } from '@/components/candidato/CandidatoSobreNos';
import { HomeTab } from '@/components/candidato/CandidatoHome';
import { CandidateFooter } from '@/components/candidato/CandidatoFooter';
import { Job, Application, CandidateProfile, CandidateTabType } from '../types';
import { INITIAL_CANDIDATE_JOBS } from '../lib/mockJobs';

export default function CandidatePortalPage() {
  const [activeTab, setActiveTab] = useState<CandidateTabType>('home');
  const [jobs, setJobs] = useState<Job[]>(INITIAL_CANDIDATE_JOBS);
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>('Todos');
  const [selectedJobToApply, setSelectedJobToApply] = useState<Job | null>(null);

  const [profile, setProfile] = useState<CandidateProfile>({
    name: 'Carlos Eduardo Silva',
    email: 'carlos.silva@email.com',
    roleTitle: 'Desenvolvedor Full Stack',
    skills: 'React, TypeScript, Node.js, Next.js, Git, SQL, Tailwind CSS'
  });

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLanding, setShowLanding] = useState(true);


  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('itmatcher_theme');
      if (savedTheme === 'dark') {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
      }

      const savedProfile = localStorage.getItem('itmatcher_candidate_profile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }

      const savedApps = localStorage.getItem('itmatcher_candidate_apps');
      if (savedApps) {
        setApplications(JSON.parse(savedApps));
      }
    } catch (e) {
      console.error('Erro ao ler localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Rolar para o topo sempre que trocar de aba
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeTab]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('itmatcher_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('itmatcher_theme', 'light');
      }
      return next;
    });
  };

  const handleSaveProfile = (newProfile: CandidateProfile) => {
    setProfile(newProfile);
    localStorage.setItem('itmatcher_candidate_profile', JSON.stringify(newProfile));
  };

  const handleLogout = () => {
    if (window.confirm('Deseja realmente sair da sua conta?')) {
      const guestProfile: CandidateProfile = {
        name: '',
        email: '',
        roleTitle: 'Visitante / Sem conta',
        skills: '',
        isLoggedIn: false
      };
      setProfile(guestProfile);
      localStorage.removeItem('itmatcher_candidate_profile');
      alert('Você saiu da sua conta.');
    }
  };

  const handleLoginOrCreateAccount = (newProfile: CandidateProfile) => {
    setProfile(newProfile);
    localStorage.setItem('itmatcher_candidate_profile', JSON.stringify(newProfile));
  };

  const handleAddApplication = (newApp: Application) => {
    setApplications((prev) => {
      const updated = [newApp, ...prev.filter((a) => a.jobId !== newApp.jobId)];
      localStorage.setItem('itmatcher_candidate_apps', JSON.stringify(updated));
      return updated;
    });
  };

  const handleCancelApplication = (appId: string) => {
    setApplications((prev) => {
      const updated = prev.filter((a) => a.id !== appId);
      localStorage.setItem('itmatcher_candidate_apps', JSON.stringify(updated));
      return updated;
    });
  };

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (j.company || j.companyName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.skills.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));


    const matchesModel =
      selectedModel === 'Todos' || j.workModel === selectedModel;

    return matchesSearch && matchesModel;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 transition-colors">
      {/* Sidebar hambúrguer (overlay) */}
      <CandidateSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        applicationsCount={applications.length}
        profile={profile}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Header fixo no topo */}
      <CandidateHeader
        activeTab={activeTab}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onMenuOpen={() => setIsSidebarOpen(true)}
        profile={profile}
        onProfileClick={() => setActiveTab('profile')}
        onTabChange={setActiveTab}
      />

      {/* Conteúdo Principal — 100% largura sem cortes laterais */}
      <main className="pt-24 px-4 sm:px-8 lg:px-12 pb-24 w-full">

        {/* ABA 0: INÍCIO & VISÃO GERAL */}
        {activeTab === 'home' && (
          <HomeTab
            onNavigate={setActiveTab}
            featuredJobs={jobs}
            userSkills={profile.skills}
          />
        )}

        {/* ABA 1: VAGAS DISPONÍVEIS */}
        {activeTab === 'jobs' && (
          <div className="space-y-8">
            {/* Barra de Busca e Filtros Corporativos */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar vagas corporativas por cargo ou stack (ex: React, Next.js, Node, Python, AWS...)"
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#121215] border border-slate-200/90 dark:border-zinc-800 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
                />
                <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Filtro Modelo de Trabalho */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {['Todos', 'Remoto', 'Híbrido', 'Presencial'].map((model) => (
                  <button
                    key={model}
                    onClick={() => setSelectedModel(model)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      selectedModel === model
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white dark:bg-[#121215] text-slate-600 dark:text-zinc-400 border border-slate-200/90 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            </div>

            {/* Informação do Match do Perfil Corporativo */}
            {profile.skills.trim() && (
              <div className="p-4 sm:p-4.5 bg-blue-50/70 dark:bg-[#121215] border border-blue-200/80 dark:border-zinc-800 rounded-2xl flex items-center justify-between gap-4 text-xs shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-heading font-bold text-slate-900 dark:text-zinc-100 block">
                      Triagem em tempo real ativa com a sua stack:
                    </span>
                    <span className="text-slate-500 dark:text-zinc-400 text-[11px] truncate max-w-lg block mt-0.5">
                      {profile.skills}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors shrink-0 flex items-center gap-1 font-heading"
                >
                  <span>Gerenciar Stack</span>
                  <span>&rarr;</span>
                </button>
              </div>
            )}

            {/* Lista de Vagas */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 px-1 font-heading">
                <span className="font-bold uppercase tracking-wider">Oportunidades Auditadas ({filteredJobs.length})</span>
                <span>Filtro por Aderência Técnica</span>
              </div>

              {filteredJobs.length === 0 ? (
                <div className="bg-white dark:bg-[#121215] border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-12 text-center text-xs sm:text-sm text-slate-500 dark:text-zinc-400 shadow-xs">
                  Nenhuma oportunidade encontrada com os critérios selecionados.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      candidateSkills={profile.skills}
                      hasApplied={applications.some((a) => a.jobId === job.id)}
                      onApply={(j) => setSelectedJobToApply(j)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABA 2: MINHAS CANDIDATURAS */}
        {activeTab === 'applications' && (
          <MyApplications
            applications={applications}
            onBrowseJobs={() => setActiveTab('jobs')}
            onCancelApplication={handleCancelApplication}
          />
        )}

        {/* ABA 3: MEU PERFIL */}
        {activeTab === 'profile' && (
          <ProfileTab
            profile={profile}
            applicationsCount={applications.length}
            onSaveProfile={handleSaveProfile}
            onLogout={handleLogout}
            onLoginOrCreateAccount={handleLoginOrCreateAccount}
          />
        )}

        {/* ABA 4: SOBRE NÓS */}
        {activeTab === 'about' && (
          <AboutUsTab />
        )}

        {/* Modal de Candidatura */}
        {selectedJobToApply && (
          <ApplyModal
            job={selectedJobToApply}
            savedProfile={profile}
            onClose={() => setSelectedJobToApply(null)}
            onSubmitApplication={handleAddApplication}
          />
        )}
      </main>

      {/* Rodapé Corporativo ItMatcher */}
      <CandidateFooter onTabChange={setActiveTab} />
    </div>
  );
}

