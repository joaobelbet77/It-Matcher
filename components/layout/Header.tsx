'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthContext';
import { useTheme } from '@/components/layout/ThemeContext';
import { LogoutModal } from '@/components/auth/LogoutModal';
import {
  User as UserIcon,
  Settings,
  Building2,
  LogOut,
  ArrowRight,
} from 'lucide-react';

interface HeaderProps {
  onMenuOpen?: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuOpen,
  title,
  description,
  children,
}) => {
  const { user, switchAccountType } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const isCompany = user?.tipoUsuario === 'empresa' || user?.role === 'COMPANY' || user?.role === 'Empresa';
  const userName = user?.name || (isCompany ? (user?.companyData?.name || 'Tech Solutions') : 'Carlos Eduardo Silva');
  const userRole = isCompany ? (user?.companyData?.companyIndustry || 'Empresa de Tecnologia') : (user?.role || 'Desenvolvedor Full Stack');
  const userInitial = userName ? userName.charAt(0).toUpperCase() : '👤';

  // Se chamado dentro da página passando título, renderiza o título da página
  if (title) {
    return (
      <div className="mb-6 pb-2 border-b border-slate-200/80 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-heading font-black text-slate-900 dark:text-white tracking-tight">{title}</h1>
          {description && <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">{description}</p>}
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    );
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 font-sans">
        {/* Barra principal idêntica à do candidato */}
        <div className="bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800 shadow-sm transition-colors">
          <div className="w-full px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between gap-4">

            {/* Esquerda: 3 Barras (Menu Hambúrguer) + Logo */}
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Botão 3 Barras */}
              <button
                onClick={onMenuOpen}
                className="w-12 h-12 flex flex-col items-center justify-center gap-[5px] rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#121215] hover:border-slate-300 dark:hover:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800/80 text-slate-800 dark:text-zinc-100 transition-all shadow-xs shrink-0 cursor-pointer"
                title="Abrir menu de navegação"
                aria-label="Abrir menu de navegação"
              >
                <span className="w-5 h-[2px] bg-slate-800 dark:bg-white rounded-full transition-colors" />
                <span className="w-5 h-[2px] bg-slate-800 dark:bg-white rounded-full transition-colors" />
                <span className="w-5 h-[2px] bg-slate-800 dark:bg-white rounded-full transition-colors" />
              </button>

              {/* Logo ItMatcher */}
              <Link
                href="/dashboard"
                className="flex items-center gap-3.5 cursor-pointer group shrink-0"
              >
                <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="5" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                  </svg>
                </div>
                <div>
                  <span className="font-heading font-black text-2xl tracking-tight text-slate-900 dark:text-white block leading-none">
                    ItMatcher
                  </span>
                </div>
              </Link>
            </div>

            {/* Direita: Alternador de tema + Perfil */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Toggle tema */}
              <button
                onClick={toggleTheme}
                className="p-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#121215] hover:border-slate-300 dark:hover:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-xs cursor-pointer"
                title={isDarkMode ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
              >
                {isDarkMode ? (
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {/* Avatar & Perfil Profissional */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#121215] hover:border-slate-300 dark:hover:border-zinc-700 shadow-xs transition-all group cursor-pointer"
                  title="Meu Perfil & Opções"
                >
                  {/* Avatar com status verde */}
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                      {userInitial}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#121215] rounded-full" />
                  </div>
                  
                  {/* Detalhes do Usuário */}
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-bold text-slate-900 dark:text-white leading-snug truncate max-w-[150px] font-heading">
                      {userName}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium leading-tight truncate max-w-[150px]">
                      {userRole}
                    </div>
                  </div>

                  <svg className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-zinc-200 transition-transform hidden sm:block ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Popover Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#121215] border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-2 text-xs text-slate-700 dark:text-zinc-200 z-50 animate-in fade-in slide-in-from-top-2">
                    <Link
                      href="/perfil"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 font-medium transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>Meu Perfil</span>
                    </Link>

                    <Link
                      href="/compliance"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 font-medium transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Configurações & Ética (RG01-10)</span>
                    </Link>

                    <Link
                      href="/"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>Ir ao Portal do Candidato</span>
                    </Link>

                    <div className="h-px bg-slate-200 dark:bg-zinc-800 my-1.5" />

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        switchAccountType(isCompany ? 'administrador' : 'empresa');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/50 text-blue-700 dark:text-blue-400 text-left font-semibold cursor-pointer transition-colors"
                    >
                      <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>{isCompany ? 'Entrar como Administrador' : 'Entrar como Empresa'}</span>
                    </button>

                    <div className="h-px bg-slate-200 dark:bg-zinc-800 my-1.5" />

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        setIsLogoutModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 text-left font-semibold cursor-pointer transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Sair da Conta</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modal de Logout */}
      <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} />
    </>
  );
};
