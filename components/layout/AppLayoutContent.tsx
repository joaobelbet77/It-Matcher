'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AuthGuard } from '@/components/auth/AuthGuard';

export const AppLayoutContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const isCandidatePortal = pathname === '/';
  const isLoginPage = pathname === '/login';

  if (isCandidatePortal) {
    return <>{children}</>;
  }

  if (isLoginPage) {
    return <AuthGuard>{children}</AuthGuard>;
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 transition-colors font-sans">
        {/* Header idêntico ao portal do candidato com 3 barras, logo, tema e perfil */}
        <Header onMenuOpen={() => setIsSidebarOpen(true)} />

        {/* Sidebar gaveta idêntica à do candidato */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Conteúdo principal com espaçamento superior para o header fixo */}
        <main className="pt-28 px-4 sm:px-8 lg:px-12 pb-24 w-full">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
};
