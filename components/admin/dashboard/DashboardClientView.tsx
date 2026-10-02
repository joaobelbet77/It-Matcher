'use client';

import React from 'react';
import Link from 'next/link';
import { StatCard } from './StatCard';
import { CompatibilityChart } from './CompatibilityChart';
import { RecentAnalysesTable } from './RecentAnalysesTable';
import { Job, Candidate, HumanReview, MatchingResult } from '@/types';
import { useAuth } from '@/components/auth/AuthContext';
import {
  Briefcase,
  Users,
  GitCompare,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface DashboardClientViewProps {
  jobs: Job[];
  candidates: Candidate[];
  reviews: HumanReview[];
  allMatchings: MatchingResult[];
  rankedRecent: MatchingResult[];
  highCount: number;
  mediumCount: number;
  lowCount: number;
  pendingReviewsCount: number;
}

export const DashboardClientView: React.FC<DashboardClientViewProps> = ({
  jobs,
  candidates,
  reviews,
  allMatchings,
  rankedRecent,
  highCount,
  mediumCount,
  lowCount,
  pendingReviewsCount,
}) => {
  const { user } = useAuth();
  const isCompany = user?.tipoUsuario === 'empresa' || user?.role === 'COMPANY' || user?.role === 'Empresa';

  // Filtro específico para a vaga da empresa se for empresa
  const companyJob = isCompany 
    ? jobs.find(j => j.companyId === (user?.companyData?.id || user?.email) || j.companyId === user?.email?.toLowerCase())
    : null;

  const companyMatchings = companyJob
    ? allMatchings.filter(m => m.jobId === companyJob.id)
    : allMatchings;

  const companyHigh = companyMatchings.filter(m => m.classification === 'ALTA').length;

  return (
    <div className="space-y-6 font-sans">
      {/* 1. CARDS DE KPIS PRINCIPAIS */}
      {isCompany ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Minha Vaga de TI"
            value={companyJob ? '1 Vaga' : '0 Vaga'}
            subtitle={companyJob ? companyJob.title : 'Cadastre sua vaga'}
            icon={<Briefcase className="w-5 h-5 text-blue-500" />}
            variant="indigo"
          />
          <StatCard
            title="Candidatos Compatíveis"
            value={companyHigh}
            subtitle="Alta aderência técnica"
            icon={<Users className="w-5 h-5 text-emerald-500" />}
            variant="emerald"
          />
          <StatCard
            title="Aderência Média"
            value={companyMatchings.length > 0 ? `${Math.round(companyMatchings.reduce((acc, m) => acc + m.score, 0) / companyMatchings.length)}%` : '0%'}
            subtitle="Média ponderada de skills"
            icon={<GitCompare className="w-5 h-5 text-amber-500" />}
            variant="amber"
          />
          <StatCard
            title="Total Avaliados"
            value={companyMatchings.length}
            subtitle="Candidatos ranqueados"
            icon={<Clock className="w-5 h-5 text-indigo-500" />}
            variant="slate"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Vagas Cadastradas"
            value={jobs.length}
            subtitle={`${jobs.filter(j => j.status === 'ativa').length} vagas ativas`}
            icon={<Briefcase className="w-5 h-5 text-blue-500" />}
            variant="indigo"
          />
          <StatCard
            title="Banco de Candidatos"
            value={candidates.length}
            subtitle="Perfis técnicos indexados"
            icon={<Users className="w-5 h-5 text-blue-500" />}
            variant="slate"
          />
          <StatCard
            title="Compatibilidade Alta"
            value={highCount}
            subtitle="Match ≥ 70% calculado"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            variant="emerald"
          />
          <StatCard
            title="Análises Pendentes"
            value={pendingReviewsCount > 0 ? pendingReviewsCount : 0}
            subtitle="Aguardando revisão humana"
            icon={<Clock className="w-5 h-5 text-amber-500" />}
            variant="amber"
          />
        </div>
      )}

      {/* 2. GRÁFICO DE COMPATIBILIDADE & AÇÕES RÁPIDAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CompatibilityChart
            highCount={highCount}
            mediumCount={mediumCount}
            lowCount={lowCount}
            total={allMatchings.length}
          />
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-[#121215] p-5 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-zinc-800">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h4 className="text-sm font-heading font-bold text-slate-900 dark:text-white">
                {isCompany ? 'Ações da Minha Empresa' : 'Acesso Rápido'}
              </h4>
            </div>

            <div className="space-y-2">
              {isCompany ? (
                <>
                  <Link href="/empresa" className="block">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/80 dark:border-zinc-800 transition-colors flex items-center justify-between group">
                      <span className="text-xs font-bold text-slate-700 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {companyJob ? 'Gerenciar Requisitos da Vaga' : '+ Cadastrar Vaga da Empresa'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </Link>

                  <Link href="/matching" className="block">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/80 dark:border-zinc-800 transition-colors flex items-center justify-between group">
                      <span className="text-xs font-bold text-slate-700 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">Ver Ranking de Candidatos</span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/vagas/nova" className="block">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/80 dark:border-zinc-800 transition-colors flex items-center justify-between group">
                      <span className="text-xs font-bold text-slate-700 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">+ Cadastrar Nova Vaga</span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </Link>

                  <Link href="/candidatos/novo" className="block">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/80 dark:border-zinc-800 transition-colors flex items-center justify-between group">
                      <span className="text-xs font-bold text-slate-700 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">+ Adicionar Candidato</span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </Link>

                  <Link href="/matching" className="block">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/80 dark:border-zinc-800 transition-colors flex items-center justify-between group">
                      <span className="text-xs font-bold text-slate-700 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">⚡ Motor de Smart Matching</span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. TABELA DE ÚLTIMAS ANÁLISES & MATCHINGS */}
      <RecentAnalysesTable analyses={companyJob ? companyMatchings.slice(0, 6) : rankedRecent.slice(0, 6)} />
    </div>
  );
};
