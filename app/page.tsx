'use client';

import React, { useState, useEffect } from 'react';
import { CandidateSidebar } from '../components/CandidateSidebar';
import { CandidateHeader } from '../components/CandidateHeader';
import { JobCard } from '../components/JobCard';
import { ApplyModal } from '../components/ApplyModal';
import { MyApplications } from '../components/MyApplications';
import { ProfileTab } from '../components/ProfileTab';
import { Job, Application, CandidateProfile, CandidateTabType } from '../types';
import { INITIAL_CANDIDATE_JOBS } from '../lib/mockJobs';

export default function CandidatePortalPage() {
  const [activeTab, setActiveTab] = useState<CandidateTabType>('jobs');
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

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('talentmatch_theme');
      if (savedTheme === 'dark') {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
      }

      const savedProfile = localStorage.getItem('talentmatch_candidate_profile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }

      const savedApps = localStorage.getItem('talentmatch_candidate_apps');
      if (savedApps) {
        setApplications(JSON.parse(savedApps));
      }
    } catch (e) {
      console.error('Erro ao ler localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('talentmatch_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('talentmatch_theme', 'light');
      }
      return next;
    });
  };

  const handleSaveProfile = (newProfile: CandidateProfile) => {
    setProfile(newProfile);
    localStorage.setItem('talentmatch_candidate_profile', JSON.stringify(newProfile));
  };

  const handleAddApplication = (newApp: Application) => {
    setApplications((prev) => {
      const updated = [newApp, ...prev.filter((a) => a.jobId !== newApp.jobId)];
      localStorage.setItem('talentmatch_candidate_apps', JSON.stringify(updated));
      return updated;
    });
  };

  const handleCancelApplication = (appId: string) => {
    setApplications((prev) => {
      const updated = prev.filter((a) => a.id !== appId);
      localStorage.setItem('talentmatch_candidate_apps', JSON.stringify(updated));
      return updated;
    });
  };

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.skills.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesModel =
      selectedModel === 'Todos' || j.workModel === selectedModel;

    return matchesSearch && matchesModel;
  });

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f8fafc] dark:bg-[#030712] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Barra Lateral com Abas na Esquerda e Perfil na Parte Inferior Esquerda */}
      <CandidateSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        applicationsCount={applications.length}
        profile={profile}
      />

      {/* Conteúdo Principal à Direita */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-6xl mx-auto w-full">
        {/* Header com Título e Botão de Tema no Canto Superior Direito */}
        <CandidateHeader
          activeTab={activeTab}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />

        {/* ABA 1: VAGAS DISPONÍVEIS */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {/* Barra de Busca e Filtros */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar vagas por cargo ou tecnologia (ex: React, Node, Python...)"
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#0c111d] border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
                <span className="absolute left-3.5 top-3.5 text-slate-400 text-xs">
                  🔍
                </span>
              </div>

              {/* Filtro Modelo de Trabalho */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {['Todos', 'Remoto', 'Híbrido', 'Presencial'].map((model) => (
                  <button
                    key={model}
                    onClick={() => setSelectedModel(model)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      selectedModel === model
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white dark:bg-[#0c111d] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-blue-300'
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            </div>

            {/* Informação do Match do Perfil */}
            {profile.skills.trim() && (
              <div className="p-4 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-2xl flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                    🎯
                  </span>
                  <div>
                    <span className="font-bold text-blue-900 dark:text-blue-300 block">
                      Calculando Match com base nas suas habilidades:
                    </span>
                    <span className="text-slate-600 dark:text-slate-400 text-[11px] truncate max-w-lg block">
                      {profile.skills}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
                >
                  Editar Perfil &rarr;
                </button>
              </div>
            )}

            {/* Lista de Vagas */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                <span>Encontradas {filteredJobs.length} vagas de tecnologia</span>
              </div>

              {filteredJobs.length === 0 ? (
                <div className="bg-white dark:bg-[#0c111d] border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-xs text-slate-400">
                  Nenhuma vaga encontrada com os filtros selecionados.
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
            onSaveProfile={handleSaveProfile}
          />
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
    </div>
  );
}
