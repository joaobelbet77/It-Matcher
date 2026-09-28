'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isCandidatePortal = pathname === '/';
  const isLoginPage = pathname === '/login';
  const isPublicRoute = isCandidatePortal || isLoginPage;
  const isCompany = user?.tipoUsuario === 'empresa' || user?.role === 'COMPANY' || user?.role === 'Empresa';

  useEffect(() => {
    if (isLoading) return;

    if (isCandidatePortal) {
      return;
    }

    if (!isAuthenticated && !isPublicRoute) {
      router.replace('/login');
    } else if (isAuthenticated && isLoginPage) {
      router.replace(isCompany ? '/empresa' : '/dashboard');
    }
  }, [isAuthenticated, isLoading, pathname, isPublicRoute, isCandidatePortal, isLoginPage, isCompany, router]);

  if (isCandidatePortal) {
    return <>{children}</>;
  }

  if (isLoading && !isPublicRoute) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#09090b] text-slate-900 dark:text-white flex flex-col items-center justify-center space-y-4 font-sans">
        <span className="animate-spin w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full" />
        <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Carregando painel...</p>
      </div>
    );
  }

  if (!isAuthenticated && !isPublicRoute) {
    return null;
  }

  return <>{children}</>;
};
