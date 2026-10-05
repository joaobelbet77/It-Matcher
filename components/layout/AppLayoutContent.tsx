'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
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
      <div className="min-h-screen flex flex-col justify-between bg-[#f8fafc] dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 transition-colors font-sans">
        <div>
          {/* Header idêntico ao portal do candidato com 3 barras, logo, tema */}
          <Header onMenuOpen={() => setIsSidebarOpen(true)} />

          {/* Sidebar gaveta idêntica à do candidato */}
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

          {/* Conteúdo principal com espaçamento superior para o header fixo */}
          <main className="pt-28 px-4 sm:px-8 lg:px-12 pb-12 w-full">
            {children}
          </main>
        </div>

        {/* Rodapé institucional idêntico ao do candidato em todas as páginas */}
        <Footer />
      </div>
    </AuthGuard>
  );
};
