'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === '/login';

  const role = (user?.tipoUsuario || user?.role || '').toLowerCase();
  const isCandidate = role === 'candidato' || role === 'candidate';
  const isCompany = role === 'empresa' || role === 'company';
  const isAdmin = role === 'administrador' || role === 'admin';

  useEffect(() => {
    if (isLoading) return;

    // Se não estiver logado, obriga ir para /login
    if (!isAuthenticated && !isLoginPage) {
      router.replace('/login');
      return;
    }

    // Se já estiver logado e tentar abrir /login, manda para a página inicial do respectivo perfil
    if (isAuthenticated) {
      if (isLoginPage) {
        if (isCandidate) {
          router.replace('/');
        } else if (isCompany) {
          router.replace('/empresa');
        } else {
          router.replace('/dashboard');
        }
        return;
      }

      // Regras de Isolamento de Perfil (RBAC):
      if (isCandidate) {
        // Candidato só pode acessar a home do candidato ('/')
        if (pathname !== '/') {
          router.replace('/');
        }
      } else if (isCompany) {
        // Empresa tem acesso restrito às suas páginas e não pode acessar rotas de admin ou de candidato
        const companyAllowedRoutes = ['/empresa', '/matching', '/planos', '/perfil', '/compliance', '/dashboard'];
        const isAllowed = companyAllowedRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'));
        
        if (!isAllowed || pathname === '/' || pathname.startsWith('/vagas') || pathname.startsWith('/candidatos') || pathname.startsWith('/auditoria') || pathname.startsWith('/revisoes')) {
          router.replace('/empresa');
        }
      } else if (isAdmin) {
        // Administrador tem acesso a todo o painel de gestão, mas não acessa a tela de aplicação de candidato sem trocar de conta
        if (pathname === '/') {
          router.replace('/dashboard');
        }
      }
    }
  }, [isAuthenticated, isLoading, pathname, isLoginPage, isCandidate, isCompany, isAdmin, router]);

  if (isLoading && !isLoginPage) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#09090b] text-slate-900 dark:text-white flex flex-col items-center justify-center space-y-4 font-sans">
        <span className="animate-spin w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full" />
        <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Carregando ItMatcher...</p>
      </div>
    );
  }

  if (!isAuthenticated && !isLoginPage) {
    return null;
  }

  return <>{children}</>;
};
