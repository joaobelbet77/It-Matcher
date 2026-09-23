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
    <div className="space-y-6">
      <Header
        title="Smart Matching & Ranqueamento de Candidatos"
        description="Selecione uma vaga para visualizar a análise técnica ponderada e o ranking automatizado"
      />

      <div className="px-6 space-y-6">
        {/* Banner Informativo */}
        <div className="p-4 bg-blue-950/40 border border-blue-800/50 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-blue-400 shrink-0" />
            <div className="text-xs text-blue-200">
              <span className="font-bold block text-sm text-blue-100">Algoritmo de Apoio à Decisão Técnica</span>
              O percentual de compatibilidade é calculado exclusivamente a partir das competências ponderadas de cada vaga. A decisão final é sempre humana (RG03).
            </div>
          </div>
        </div>

        {/* Grid de Vagas para Matching */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobsWithStats.map(({ job, highCount, mediumCount, lowCount, topScore, topCandidateName }) => (
            <Card key={job.id} className="hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/5">
              <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-100 text-base">{job.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="purple" size="sm">{job.area}</Badge>
                        <Badge variant="default" size="sm">{job.level}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Skills com Pesos */}
                  <div className="flex flex-wrap gap-1">
                    {job.skills.map((s) => (
                      <span key={s.id} className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800 font-medium">
                        {s.name} <strong className="text-blue-400 font-bold">{s.weight}%</strong>
                      </span>
                    ))}
                  </div>

                  {/* Resumo de Compatibilidade */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
                    <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-300">
                      <span className="block text-base font-black text-emerald-400">{highCount}</span>
                      <span className="text-[10px] font-semibold text-emerald-400">Alta (&gt;=80%)</span>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-800/40 text-amber-300">
                      <span className="block text-base font-black text-amber-400">{mediumCount}</span>
                      <span className="text-[10px] font-semibold text-amber-400">Média (60-79%)</span>
                    </div>
                    <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-800/40 text-rose-300">
                      <span className="block text-base font-black text-rose-400">{lowCount}</span>
                      <span className="text-[10px] font-semibold text-rose-400">Baixa (&lt;60%)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 truncate max-w-[200px]">
                    Líder: <strong className="text-slate-200">{topCandidateName}</strong> ({topScore}%)
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
