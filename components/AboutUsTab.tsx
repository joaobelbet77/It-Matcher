'use client';

import React from 'react';

export const AboutUsTab: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Hero Section */}
      <section className="bg-white dark:bg-[#0c111d] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-950 text-blue-800 dark:text-blue-300 text-xs font-bold mb-4">
          <span>🌱</span>
          <span>Nossa História & Propósito</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
          Por que o <span className="text-blue-700 dark:text-blue-400">ItMatcher</span> nasceu?
        </h2>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            O mercado de tecnologia cresce em um ritmo acelerado, mas o processo de encontrar um emprego continua sendo burocrático, desgastante e pouco transparente. Quantas vezes você já se candidatou a dezenas de vagas sem saber se o seu perfil realmente atendia aos requisitos ou por que não foi chamado para uma entrevista?
          </p>
          <p>
            O <strong>ItMatcher</strong> surgiu com uma missão clara: <strong>simplificar, agilizar e humanizar a busca por empregos em tecnologia</strong>. Acreditamos que o talento técnico não deve se perder em processos seletivos confusos. Criamos uma ponte direta e inteligente entre desenvolvedores e oportunidades reais.
          </p>
        </div>
      </section>

      {/* Pilares / Diferenciais */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          O que nos move e faz a diferença:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1 */}
          <div className="bg-white dark:bg-[#0c111d] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center text-lg font-black mb-3">
                🎯
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                Match Transparente e Sem Segredos
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Você visualiza na hora o seu percentual de compatibilidade com cada vaga, sabendo exatamente quais requisitos já domina antes mesmo de enviar seu currículo.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-[#0c111d] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center text-lg font-black mb-3">
                ⚡
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                Economia de Tempo e Foco
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Chega de preencher formulários intermináveis de 10 páginas. Com o ItMatcher, você aplica em 1 clique e foca apenas nas vagas que fazem sentido para seu momento profissional.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-[#0c111d] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center text-lg font-black mb-3">
                🧭
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                Direcionamento de Carreira
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Caso você não tenha 100% de aderência a uma vaga desejada, o sistema aponta claramente quais tecnologias você pode estudar para alcançar o cargo dos seus sonhos.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white dark:bg-[#0c111d] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center text-lg font-black mb-3">
                🤝
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                Foco no Desenvolvedor
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Nascemos de quem vive a tecnologia para quem constrói a tecnologia. Respeitamos seu tempo, valorizamos sua senioridade e simplificamos sua jornada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Missão e Visão */}
      <section className="bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-950/60 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider block mb-1">
              Nossa Missão
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Conectar talentos de tecnologia às melhores oportunidades do mercado através de tecnologia precisa, eliminando ruídos e acelerando contratações justas.
            </p>
          </div>
          <div>
            <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider block mb-1">
              Nossa Visão
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Ser o ecossistema de recrutamento técnico mais confiável e intuitivo, onde cada profissional encontra seu próximo desafio em segundos.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
