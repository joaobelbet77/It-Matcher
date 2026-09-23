'use client';

import React, { useState } from 'react';
import { CandidateTabType, Job } from '../types';
import { getQuickScore } from '../lib/matcher';

interface HomeTabProps {
  onNavigate: (tab: CandidateTabType) => void;
  featuredJobs: Job[];
  userSkills: string;
}

const PRESET_STACKS = [
  { label: 'Full Stack Node + React', skills: 'React, TypeScript, Node.js, PostgreSQL, Docker, AWS' },
  { label: 'Frontend Moderno', skills: 'React, Next.js, TypeScript, Tailwind CSS, GraphQL' },
  { label: 'Backend Python', skills: 'Python, Django, PostgreSQL, Docker, Redis, AWS' },
  { label: 'Mobile Engineer', skills: 'Flutter, Dart, Firebase, REST APIs, Git' },
];

export const HomeTab: React.FC<HomeTabProps> = ({ onNavigate, featuredJobs, userSkills }) => {
  const [demoSkills, setDemoSkills] = useState(userSkills || 'React, TypeScript, Node.js, PostgreSQL');

  return (
    <div className="w-full space-y-12 animate-fadeIn font-sans pb-12">
      
      {/* 1. HERO PRINCIPAL: Apresentação da Plataforma */}
      <section className="relative w-full rounded-3xl overflow-hidden min-h-[460px] md:min-h-[500px] shadow-2xl border border-slate-200/80 dark:border-zinc-800/80 flex items-center">
        <img
          src="/tech-banner.jpg"
          alt="ItMatcher Inteligência em Recrutamento"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/95 via-[#09090b]/85 to-[#09090b]/50" />

        <div className="relative z-10 w-full p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 text-xs font-bold font-heading mb-5 w-fit backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span>Plataforma Inteligente de Recrutamento Técnico</span>
          </div>

          <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-6xl text-white leading-tight mb-5 max-w-3xl tracking-tight">
            Descubra seu <span className="text-blue-400">match perfeito</span> com vagas de tecnologia.
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-zinc-300 max-w-2xl leading-relaxed mb-8">
            O <strong>ItMatcher</strong> calcula em tempo real o índice de compatibilidade entre as suas habilidades técnicas e os requisitos essenciais de cada vaga. Sem triagens opacas e sem formulários repetitivos.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate('jobs')}
              className="px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-600/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2.5 font-heading"
            >
              <span>Explorar Vagas Abertas</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <button
              onClick={() => onNavigate('profile')}
              className="px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-sm backdrop-blur-md hover:scale-[1.02] active:scale-95 transition-all font-heading"
            >
              Configurar Minha Stack
            </button>
          </div>

          {/* Métricas Rápidas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl pt-8 mt-8 border-t border-white/10">
            <div>
              <div className="font-heading font-black text-2xl sm:text-3xl text-white">100%</div>
              <div className="text-[11px] font-semibold text-zinc-400 mt-0.5">Triagem Algorítmica</div>
            </div>
            <div>
              <div className="font-heading font-black text-2xl sm:text-3xl text-blue-400">Instantâneo</div>
              <div className="text-[11px] font-semibold text-zinc-400 mt-0.5">Cálculo de Aderência</div>
            </div>
            <div>
              <div className="font-heading font-black text-2xl sm:text-3xl text-white">0% Fricção</div>
              <div className="text-[11px] font-semibold text-zinc-400 mt-0.5">Candidatura Direta</div>
            </div>
            <div>
              <div className="font-heading font-black text-2xl sm:text-3xl text-emerald-400">Verificadas</div>
              <div className="text-[11px] font-semibold text-zinc-400 mt-0.5">Vagas com Salário</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMO FUNCIONA: 3 Passos Simples */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 font-heading">
            Metodologia & Transparência
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
            Como o ItMatcher funciona na prática?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
            Uma experiência construída para valorizar a senioridade e as competências reais do desenvolvedor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Passo 1 */}
          <div className="bg-white dark:bg-[#121215] border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-7 shadow-xs relative overflow-hidden group hover:border-blue-500/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-400 flex items-center justify-center font-heading font-black text-lg shadow-xs">
                01
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                Defina suas Competências
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                Informe as tecnologias e linguagens que você domina (React, Node, Python, AWS, Docker...). Sem cartas de apresentação intermináveis.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-slate-100 dark:border-zinc-800/80 text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <span>Stack salva automaticamente</span>
              <span>✓</span>
            </div>
          </div>

          {/* Passo 2 */}
          <div className="bg-white dark:bg-[#121215] border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-7 shadow-xs relative overflow-hidden group hover:border-blue-500/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-heading font-black text-lg shadow-xs">
                02
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                Algoritmo Calcula o Match
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                Nosso motor pondera a importância de cada requisito da vaga e calcula instantaneamente sua aderência técnica (0% a 100%).
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-slate-100 dark:border-zinc-800/80 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span>Feedback claro de requisitos & gaps</span>
              <span>✓</span>
            </div>
          </div>

          {/* Passo 3 */}
          <div className="bg-white dark:bg-[#121215] border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-7 shadow-xs relative overflow-hidden group hover:border-blue-500/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-900 text-purple-700 dark:text-purple-400 flex items-center justify-center font-heading font-black text-lg shadow-xs">
                03
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                Candidatura com 1 Clique
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                Submeta sua candidatura e o relatório técnico completo é enviado diretamente aos líderes e tech recruiters da empresa contratante.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-slate-100 dark:border-zinc-800/80 text-[11px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
              <span>Acompanhamento direto em tela</span>
              <span>✓</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SIMULADOR INTERATIVO AO VIVO: Experimente o Algoritmo */}
      <section className="bg-white dark:bg-[#121215] border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-400 text-xs font-bold font-heading mb-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Simulador Interativo em Tempo Real</span>
            </div>
            <h2 className="font-heading font-black text-xl sm:text-2xl text-slate-900 dark:text-white">
              Teste o algoritmo agora mesmo
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
              Escolha ou digite suas competências e veja o score de aderência mudar ao vivo nas vagas abaixo:
            </p>
          </div>
        </div>

        {/* Input & Presets de Stack */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300 font-heading">
            Sua Stack Técnica de Teste:
          </label>
          <input
            type="text"
            value={demoSkills}
            onChange={(e) => setDemoSkills(e.target.value)}
            placeholder="Ex: React, Node.js, TypeScript, PostgreSQL, AWS..."
            className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs font-medium"
          />

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 font-heading">
              Stacks prontas:
            </span>
            {PRESET_STACKS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => setDemoSkills(preset.skills)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-900 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-slate-700 dark:text-zinc-300 hover:text-blue-700 dark:hover:text-blue-400 border border-slate-200 dark:border-zinc-800 text-xs font-semibold transition-all"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resultados do Match nas Vagas em Destaque */}
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 font-heading">
            <span className="font-bold uppercase tracking-wider">Aderência Calculada nas Oportunidades:</span>
            <span>{featuredJobs.length} vagas simuladas</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredJobs.slice(0, 3).map((job) => {
              const score = getQuickScore(demoSkills, job);
              const badgeClass =
                score >= 70
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : score >= 30
                  ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                  : 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
              
              const dotColor = score >= 70 ? 'bg-emerald-500' : score >= 30 ? 'bg-amber-500' : 'bg-red-500';
              const label = score >= 70 ? 'Alta Aderência' : score >= 30 ? 'Média Aderência' : 'Baixa Aderência';

              return (
                <div
                  key={job.id}
                  className="bg-slate-50/70 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-5 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-heading">
                        {job.company || job.companyName || 'Empresa Parceira'}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400">
                        {job.workModel}
                      </span>
                    </div>
                    <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white leading-snug">
                      {job.title}
                    </h4>
                  </div>

                  {/* Score */}
                  <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-zinc-800/80">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-500 dark:text-zinc-400">Compatibilidade:</span>
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${badgeClass}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
                        <span>{score}% • {label}</span>
                      </div>
                    </div>
                    
                    {/* Barra */}
                    <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          score >= 70 ? 'bg-emerald-500' : score >= 30 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. COMPARATIVO: Por que ItMatcher vs Métodos Tradicionais */}
      <section className="bg-white dark:bg-[#121215] border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 font-heading">
            Diferenciais de Mercado
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
            Por que escolher a ItMatcher?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tradicional */}
          <div className="p-6 rounded-2xl bg-red-50/50 dark:bg-red-950/10 border border-red-200/60 dark:border-red-900/30 space-y-4">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-heading font-bold text-sm">
              <span>✕</span>
              <span>Recrutamento Tradicional</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>Preenchimento manual de dezenas de formulários repetitivos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>Ausência de retorno e processos seletivos sem transparência.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>Falta de clareza sobre faixas salariais e stack exigida.</span>
              </li>
            </ul>
          </div>

          {/* ItMatcher */}
          <div className="p-6 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 space-y-4">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-heading font-bold text-sm">
              <span>✓</span>
              <span>Com a ItMatcher Enterprise</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>Sua stack técnica salva uma única vez e comparada em tempo real.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>Cálculo matemático de compatibilidade antes mesmo de se candidatar.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>Vagas auditadas com faixa salarial e modelo de trabalho definidos.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. CTA FINAL */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl space-y-6">
        <h2 className="font-heading font-black text-2xl sm:text-4xl max-w-2xl mx-auto leading-tight">
          Pronto para encontrar sua próxima oportunidade técnica?
        </h2>
        <p className="text-xs sm:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
          Navegue pelas vagas auditadas ou complete seu perfil para ver seus índices de compatibilidade em tempo real.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => onNavigate('jobs')}
            className="px-8 py-3.5 bg-white text-blue-700 hover:bg-blue-50 font-heading font-bold text-sm rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            Ver Todas as Vagas &rarr;
          </button>
          <button
            onClick={() => onNavigate('profile')}
            className="px-8 py-3.5 bg-blue-800/60 hover:bg-blue-800 text-white border border-white/30 font-heading font-bold text-sm rounded-2xl backdrop-blur-md hover:scale-105 active:scale-95 transition-all"
          >
            Acessar Meu Perfil
          </button>
        </div>
      </section>

    </div>
  );
};
