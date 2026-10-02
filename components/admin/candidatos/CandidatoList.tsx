'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Candidate } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { User, Search, FileText, CheckCircle2, ShieldCheck, Mail, Phone, Calendar, ArrowRight } from 'lucide-react';

interface CandidateListProps {
  candidates: Candidate[];
}

export const CandidateList: React.FC<CandidateListProps> = ({ candidates }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');

  const filtered = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.technicalSkills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLevel = levelFilter === 'ALL' || c.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-5 font-sans">
      {/* Barra de Filtros */}
      <div className="bg-white dark:bg-[#121215] p-4 rounded-2xl border border-slate-200/90 dark:border-zinc-800 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar candidato por nome ou competência técnica (React, SQL, Docker)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-600 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="w-full md:w-48 px-3 py-2.5 text-xs sm:text-sm border border-slate-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-600 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 focus:outline-none font-medium"
        >
          <option value="ALL">Todos os Níveis</option>
          <option value="Estágio">Estágio</option>
          <option value="Júnior">Júnior</option>
          <option value="Pleno">Pleno</option>
          <option value="Sênior">Sênior</option>
          <option value="Especialista">Especialista</option>
          <option value="Tech Lead">Tech Lead</option>
        </select>
      </div>

      {/* Lista Limpa de Candidatos */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((candidate) => (
            <Card key={candidate.id} className="hover:border-blue-500/50 dark:hover:border-zinc-700 transition-all hover:shadow-md">
              <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0 font-heading">
                        {candidate.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-slate-900 dark:text-white text-base">{candidate.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="purple" size="sm">{candidate.level}</Badge>
                          <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">{candidate.experienceYears} ano(s) exp.</span>
                        </div>
                      </div>
                    </div>

                    {candidate.hasResume ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/60 shrink-0 font-heading">
                        <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> PDF Validado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-zinc-700 shrink-0">
                        Sem PDF
                      </span>
                    )}
                  </div>

                  {/* Competências Sintéticas */}
                  <div>
                    <div className="flex flex-wrap gap-1.5">
                      {candidate.technicalSkills.slice(0, 6).map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 rounded-lg text-xs font-medium border border-slate-200/80 dark:border-zinc-800"
                        >
                          {skill}
                        </span>
                      ))}
                      {candidate.technicalSkills.length > 6 && (
                        <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 rounded-lg text-xs font-bold font-heading">
                          +{candidate.technicalSkills.length - 6}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-3.5 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Cadastrado em {candidate.createdAt ? new Date(candidate.createdAt).toLocaleDateString('pt-BR') : 'Hoje'}
                  </span>
                  
                  {/* Botão Ver Perfil */}
                  <Link href={`/candidatos/${candidate.id}`}>
                    <Button variant="primary" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                      Ver Perfil
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#121215] p-12 text-center rounded-3xl border border-slate-200/90 dark:border-zinc-800 shadow-xs">
          <User className="w-10 h-10 text-slate-400 dark:text-zinc-600 mx-auto mb-3" />
          <h4 className="text-base font-heading font-bold text-slate-900 dark:text-white">Nenhum candidato encontrado</h4>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Tente ajustar seus termos de busca ou filtros.</p>
        </div>
      )}
    </div>
  );
};
