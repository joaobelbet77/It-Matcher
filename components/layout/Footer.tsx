'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthContext';

export const Footer: React.FC = () => {
  const { user, logout } = useAuth();
  const isCompany = user?.tipoUsuario === 'empresa' || user?.role === 'COMPANY' || user?.role === 'Empresa';

  return (
    <footer className="w-full bg-white dark:bg-[#0c0c0e] border-t border-slate-200/80 dark:border-zinc-800 font-sans transition-colors mt-20">
      {/* Container Principal */}
      <div className="w-full px-4 sm:px-8 lg:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Coluna 1: Marca & Apresentação (2 colunas no desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <Link 
              href="/dashboard"
              className="flex items-center gap-3.5 cursor-pointer group w-fit"
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="5.2" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="2" fill="white" stroke="white" strokeWidth="0.5" />
                </svg>
              </div>
              <div>
                <span className="font-heading font-black text-2xl tracking-tight text-slate-900 dark:text-white block leading-none">
                  ItMatcher
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 font-heading block mt-1">
                  {isCompany ? 'Portal da Empresa' : 'Painel Administrativo'}
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed max-w-sm">
              Infraestrutura inteligente de compatibilidade técnica. Conectando profissionais qualificados às maiores oportunidades de engenharia de software e tecnologia com governança e auditoria.
            </p>

            {/* Badges de Destaque */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-zinc-900 text-[11px] font-bold text-slate-700 dark:text-zinc-300 border border-slate-200/80 dark:border-zinc-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Algoritmo em Tempo Real
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-zinc-900 text-[11px] font-bold text-slate-700 dark:text-zinc-300 border border-slate-200/80 dark:border-zinc-800">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                100% Auditável (RG01-10)
              </span>
            </div>
          </div>

          {/* Coluna 2: Navegação Principal */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-heading">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500 dark:text-zinc-400">
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left font-medium block"
                >
                  Dashboard Geral
                </Link>
              </li>
              <li>
                <Link
                  href="/empresa"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left font-medium block"
                >
                  {isCompany ? 'Minha Vaga & Gestão' : 'Empresas Parceiras'}
                </Link>
              </li>
              <li>
                <Link
                  href="/matching"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left font-medium block"
                >
                  Smart Matching & Rankings
                </Link>
              </li>
              {!isCompany && (
                <>
                  <li>
                    <Link
                      href="/vagas"
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left font-medium block"
                    >
                      Gestão de Vagas
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/candidatos"
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left font-medium block"
                    >
                      Banco de Candidatos
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/auditoria"
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left font-medium block"
                    >
                      Auditoria & Logs (RG10)
                    </Link>
                  </li>
                </>
              )}
              <li className="pt-2 mt-2 border-t border-slate-100 dark:border-zinc-800/80">
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 text-red-600 dark:text-red-400 hover:underline font-bold text-xs cursor-pointer block text-left"
                >
                  <span>Sair da Conta</span>
                  <span>&rarr;</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Especialidades & Stacks */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-heading">
              Stacks Populares
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500 dark:text-zinc-400">
              <li className="hover:text-slate-900 dark:hover:text-zinc-200 transition-colors font-medium">
                React & Next.js
              </li>
              <li className="hover:text-slate-900 dark:hover:text-zinc-200 transition-colors font-medium">
                Node.js & TypeScript
              </li>
              <li className="hover:text-slate-900 dark:hover:text-zinc-200 transition-colors font-medium">
                Python & Django
              </li>
              <li className="hover:text-slate-900 dark:hover:text-zinc-200 transition-colors font-medium">
                DevOps & Cloud (AWS / Docker)
              </li>
            </ul>
          </div>

          {/* Coluna 4: Institucional & Conformidade */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-heading">
              Institucional
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500 dark:text-zinc-400">
              <li>
                <Link href="/perfil" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium block">
                  Minha Conta & Perfil
                </Link>
              </li>
              <li>
                <Link href="/compliance" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium block">
                  Configurações & Ética (RG01-10)
                </Link>
              </li>
              <li className="hover:text-slate-900 dark:hover:text-zinc-200 transition-colors font-medium">
                Manifesto Corporativo
              </li>
              <li className="hover:text-slate-900 dark:hover:text-zinc-200 transition-colors font-medium">
                Segurança & LGPD
              </li>
            </ul>
          </div>

        </div>

        {/* Linha Inferior com Copyright e Status */}
        <div className="pt-8 mt-10 border-t border-slate-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-zinc-500">
          <p>© {new Date().getFullYear()} ItMatcher Enterprise. Todos os direitos reservados.</p>
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Ambiente Seguro & Conexão Criptografada</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
