'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, ShieldCheck, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, description, children }) => {
  return (
    <header className="bg-slate-900/95 border-b border-slate-800 px-6 py-4 shadow-sm backdrop-blur-md sticky top-0 z-30">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">{title}</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-950/80 text-blue-300 border border-blue-800/60 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Guardrails Ativos
            </span>
          </div>
          {description && <p className="text-xs md:text-sm text-slate-400 mt-1">{description}</p>}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {children ? (
            children
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/vagas/nova">
                <Button size="sm" variant="outline" icon={<Plus className="w-4 h-4" />}>
                  Nova Vaga
                </Button>
              </Link>
              <Link href="/candidatos/novo">
                <Button size="sm" variant="primary" icon={<Plus className="w-4 h-4" />}>
                  Novo Candidato
                </Button>
              </Link>
              <Link href="/perfil" title="Meu Perfil">
                <Button size="sm" variant="ghost" icon={<User className="w-4 h-4 text-blue-400" />}>
                  Perfil
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
