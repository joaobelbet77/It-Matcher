import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { store } from '@/lib/storage';
import { calculateMatching, rankCandidates } from '@/lib/matching';
import { GitCompare, ArrowRight, Briefcase, Users, Award, ShieldCheck } from 'lucide-react';

export const revalidate = 0;

export default async function MatchingOverviewPage() {
  const jobs = store.getJobs();
  const candidates = store.getCandidates();

  const jobsWithStats = jobs.map((job) => {
    const matchings = candidates.map((c) => calculateMatching(job, c));
    const ranked = rankCandidates(matchings);
    return {
      job,
      totalCandidates: candidates.length,
      highCount: ranked.filter((r) => r.classification === 'ALTA').length,
      mediumCount: ranked.filter((r) => r.classification === 'MEDIA').length,
      lowCount: ranked.filter((r) => r.classification === 'BAIXA').length,
      topScore: ranked[0]?.score || 0,
      topCandidateName: ranked[0]?.candidateName || 'Nenhum',
    };
  });

  return (
    <div className="space-y-6 font-sans">
      <Header
        title="Smart Matching & Ranqueamento de Candidatos"
        description="Selecione uma vaga para visualizar a análise técnica ponderada e o ranking automatizado"
      />

      <div className="space-y-6">
        {/* Banner Informativo */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-2xl flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0" />
            <div className="text-xs text-blue-900 dark:text-blue-200">
              <span className="font-bold block text-sm font-heading text-blue-950 dark:text-blue-100">Algoritmo de Apoio à Decisão Técnica</span>
              O percentual de compatibilidade é calculado exclusivamente a partir das competências ponderadas de cada vaga. A decisão final é sempre humana (RG03).
            </div>
          </div>
        </div>

        {/* Grid de Vagas para Matching */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobsWithStats.map(({ job, highCount, mediumCount, lowCount, topScore, topCandidateName }) => (
            <Card key={job.id} className="hover:border-blue-500/50 dark:hover:border-zinc-700 transition-all hover:shadow-md">
              <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base sm:text-lg">{job.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {job.area && <Badge variant="purple" size="sm">{job.area}</Badge>}
                        {job.level && <Badge variant="default" size="sm">{job.level}</Badge>}
                      </div>
                    </div>
                  </div>

                  {/* Skills com Pesos */}
                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.map((s) => (
                      <span key={s.id} className="text-xs bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-zinc-800 font-medium">
                        {s.name} <strong className="text-blue-600 dark:text-blue-400 font-bold">{s.weight}%</strong>
                      </span>
                    ))}
                  </div>

                  {/* Resumo de Compatibilidade */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-zinc-800 text-center font-heading">
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-300">
                      <span className="block text-xl font-black text-emerald-700 dark:text-emerald-400">{highCount}</span>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Alta (&ge;70%)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-300">
                      <span className="block text-xl font-black text-amber-700 dark:text-amber-400">{mediumCount}</span>
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">Média (30-69%)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 text-red-900 dark:text-red-300">
                      <span className="block text-xl font-black text-red-700 dark:text-red-400">{lowCount}</span>
                      <span className="text-[11px] font-bold text-red-600 dark:text-red-400">Baixa (&lt;30%)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-zinc-400 truncate max-w-[200px]">
                    Líder: <strong className="text-slate-800 dark:text-zinc-200 font-bold">{topCandidateName}</strong> ({topScore}%)
                  </span>
                  <Link href={`/matching/${job.id}`}>
                    <Button variant="primary" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                      Acessar Ranking
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
