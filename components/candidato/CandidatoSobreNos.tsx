'use client';

import React from 'react';

export const AboutUsTab: React.FC = () => {
  return (
    <div className="w-full space-y-8 animate-fadeIn font-sans">
      {/* Hero Section */}
      <section className="bg-white dark:bg-[#121215] border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-7 sm:p-10 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold mb-4 font-heading">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <span>Manifesto & Metodologia de Compatibilidade</span>
        </div>

        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
          Por que o <span className="text-blue-700 dark:text-blue-400">ItMatcher</span> foi concebido?
        </h2>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          <p>
            O mercado global de tecnologia evolui em ritmo exponencial, mas os métodos tradicionais de recrutamento ainda dependem de formulários genéricos, triagens opacas e ausência de retorno assertivo para o candidato.
          </p>
          <p>
            O <strong>ItMatcher Enterprise</strong> foi desenvolvido para solucionar essa assimetria. Através de um algoritmo de ponderação técnica em tempo real, eliminamos a subjetividade dos processos seletivos e conectamos profissionais qualificados diretamente aos requisitos essenciais das empresas.
          </p>
        </div>
      </section>

      {/* Pilares Corporativos */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-heading">
          Pilares Estratégicos da Plataforma
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1 */}
          <div className="bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between group hover:border-blue-500/40 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-sm font-heading font-bold text-slate-900 dark:text-zinc-100 mb-2">
                Triagem Ponderada e Transparente
              </h4>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                Métricas auditáveis de correspondência técnica calculadas a partir da relevância de cada stack para o projeto.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between group hover:border-blue-500/40 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-sm font-heading font-bold text-slate-900 dark:text-zinc-100 mb-2">
                Eficiência Operacional & Zero Fricção
              </h4>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                Aplicação instantânea sem questionários redundantes. Submissão direta do perfil com análise imediata de compatibilidade.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between group hover:border-blue-500/40 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h4 className="text-sm font-heading font-bold text-slate-900 dark:text-zinc-100 mb-2">
                Direcionamento e Upskilling Técnico
              </h4>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                Diagnóstico claro das competências complementares necessárias para preencher gaps técnicos em cada oportunidade.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between group hover:border-blue-500/40 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-sm font-heading font-bold text-slate-900 dark:text-zinc-100 mb-2">
                Foco no Profissional de Engenharia
              </h4>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                Valorização da senioridade e domínio real de ferramentas, conectando desenvolvedores a líderes de engenharia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Missão & Visão Corporativas */}
      <section className="bg-slate-50 dark:bg-[#121215] border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-100 block mb-2 font-heading">
              Missão Corporativa
            </span>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
              Otimizar a alocação de talentos técnicos em organizações de tecnologia através de inteligência algorítmica e transparência de competências.
            </p>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-100 block mb-2 font-heading">
              Visão de Longo Prazo
            </span>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
              Consolidar-se como a infraestrutura de referência para avaliação e contratação técnica nas principais empresas de tecnologia do Brasil e exterior.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
