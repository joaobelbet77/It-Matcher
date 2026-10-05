'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  GitCompare,
  Building2,
  FileText,
  ArrowRight,
  ShieldAlert,
  User as UserIcon,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { LogoutModal } from '@/components/auth/LogoutModal';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose = () => {} }) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const isCompany = user?.tipoUsuario === 'empresa' || user?.role === 'COMPANY' || user?.role === 'Empresa';
  const userName = user?.name || (isCompany ? 'Tech Solutions' : 'Carlos Eduardo');

  const companyNavItems = [
    { label: 'Painel da Empresa', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Minha Vaga', href: '/empresa', icon: Briefcase },
    { label: 'Candidatos Compatíveis', href: '/matching', icon: GitCompare },
  ];

  const adminNavItems = [
    { label: 'Dashboard Geral', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Empresas Parceiras', href: '/empresa', icon: Building2 },
    { label: 'Gestão de Vagas', href: '/vagas', icon: Briefcase },
    { label: 'Banco de Candidatos', href: '/candidatos', icon: Users },
    { label: 'Smart Matching', href: '/matching', icon: GitCompare },
    { label: 'Auditoria & Logs', href: '/auditoria', icon: FileText },
  ];

  const navItems = isCompany ? companyNavItems : adminNavItems;

  return (
    <>
      {/* Overlay escurecido ao abrir */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-white dark:bg-[#0c0c0e] text-slate-900 dark:text-zinc-100 flex flex-col justify-between p-6 border-r border-slate-200/80 dark:border-zinc-800 shadow-2xl font-sans transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Topo da Sidebar: Logo + Fechar */}
          <div className="flex items-center justify-between mb-6 px-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 cursor-pointer group"
              onClick={onClose}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-md shadow-blue-600/30 group-hover:scale-[1.02] transition-transform">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="5" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                  ItMatcher
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 font-heading block mt-0.5">
                  {isCompany ? 'Portal da Empresa' : 'Painel Admin'}
                </span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              title="Fechar menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Guardrail Banner */}
          <div className="my-2 p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 rounded-2xl text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-snug">
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Decisão Humana (RG03)</span>
              {isCompany 
                ? 'Área da Empresa: consulte seus candidatos ranqueados.' 
                : 'Controle executivo e decisões finais do Administrador.'}
            </div>
          </div>

          {/* Section label */}
          <div className="px-2 mb-2 mt-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-heading">
              Navegação
            </span>
          </div>

          {/* Links de Navegação */}
          <nav className="flex flex-col gap-1.5 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all text-left ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-600/15 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/40 font-bold shadow-xs'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-zinc-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-zinc-500'}`} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}

            {/* Divisor & Link para o Portal do Candidato */}
            <div className="pt-3 mt-3 border-t border-slate-100 dark:border-zinc-800">
              <Link
                href="/"
                onClick={onClose}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-50/70 dark:bg-zinc-900/50 hover:bg-blue-50/70 dark:hover:bg-blue-950/40 border border-slate-200/80 dark:border-zinc-800 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
                  <span>Portal do Candidato</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-slate-400 group-hover:text-blue-500" />
              </Link>
            </div>

            {/* Divisor & Links de Conta */}
            <div className="pt-3 mt-3 border-t border-slate-100 dark:border-zinc-800">
              <div className="px-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-heading">
                  Conta & Configurações
                </span>
              </div>

              <Link
                href="/perfil"
                onClick={onClose}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  pathname === '/perfil'
                    ? 'bg-blue-50 dark:bg-blue-600/15 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/40 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-zinc-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <UserIcon className={`w-4 h-4 ${pathname === '/perfil' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-zinc-500'}`} />
                  <span>Minha Conta</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                  {isCompany ? 'Empresa' : 'Admin'}
                </span>
              </Link>

              <Link
                href="/compliance"
                onClick={onClose}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all mt-1 ${
                  pathname === '/compliance'
                    ? 'bg-blue-50 dark:bg-blue-600/15 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/40 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-zinc-800/60 border border-transparent'
                }`}
              >
                <Settings className={`w-4 h-4 ${pathname === '/compliance' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-zinc-500'}`} />
                <span>Configurações & Ética</span>
              </Link>

              {/* Botão Sair */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setIsLogoutModalOpen(true);
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 border border-transparent transition-all mt-1 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-red-500 dark:text-red-400" />
                <span>Sair da Conta</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Rodapé da Sidebar: Perfil resumido */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-zinc-800">
          <Link
            href="/perfil"
            onClick={onClose}
            className="w-full p-3 rounded-2xl text-left border border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-[#121215] hover:border-slate-300 dark:hover:border-zinc-700 transition-all flex items-center gap-3 group"
          >
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs border border-blue-400/30">
                {userName ? userName.charAt(0).toUpperCase() : '👤'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#0c0c0e] rounded-full"></span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate font-heading">
                {userName}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium truncate capitalize">
                {isCompany ? 'Empresa Parceira' : 'Administrador'}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
          </Link>
        </div>
      </aside>

      {/* Modal de Logout */}
      <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} />
    </>
  );
};
