'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Job } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Briefcase, ArrowRight, Search, Clock, Award } from 'lucide-react';

interface JobListProps {
  jobs: Job[];
}

export const JobList: React.FC<JobListProps> = ({ jobs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('ALL');

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.company || job.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesArea = selectedArea === 'ALL' || job.area === selectedArea;
    return matchesSearch && matchesArea;
  });

  const areas = Array.from(new Set(jobs.map((j) => j.area).filter(Boolean)));

  return (
    <div className="space-y-5 font-sans">
      {/* Barra de Busca e Filtros */}
      <div className="bg-white dark:bg-[#121215] p-4 rounded-2xl border border-slate-200/90 dark:border-zinc-800 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por cargo, competência (React, Python...) ou palavra-chave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-600 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="w-full md:w-48 px-3 py-2.5 text-xs sm:text-sm border border-slate-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-600 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 focus:outline-none font-medium"
          >
            <option value="ALL">Todas as Áreas</option>
            {areas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de Vagas */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:border-blue-500/50 dark:hover:border-zinc-700 transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="space-y-2.5 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-200 dark:border-blue-800/40">
                        <Briefcase className="w-4 h-4" />
                      </span>
                      <h3 className="text-base sm:text-lg font-heading font-bold text-slate-900 dark:text-white">{job.title}</h3>
                      {job.area && <Badge variant="purple" size="sm">{job.area}</Badge>}
                      {job.level && <Badge variant="default" size="sm">{job.level}</Badge>}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Competências com Pesos */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase mr-1 font-heading">Pesos:</span>
                      {job.skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border border-slate-200/80 dark:border-zinc-800 font-medium"
                        >
                          <span>{skill.name}</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">{skill.weight}%</span>
                        </span>
                      ))}
                    </div>

                    {job.minExperienceYears !== undefined && (
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-zinc-400 pt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Mínimo {job.minExperienceYears} ano(s) de experiência
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-center">
                    <Link href={`/vagas/${job.id}`}>
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                    </Link>
                    <Link href={`/matching/${job.id}`}>
                      <Button variant="primary" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                        Smart Matching & Ranking
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#121215] p-12 text-center rounded-3xl border border-slate-200/90 dark:border-zinc-800 shadow-xs">
          <Briefcase className="w-10 h-10 text-slate-400 dark:text-zinc-600 mx-auto mb-3" />
          <h4 className="text-base font-heading font-bold text-slate-900 dark:text-white">Nenhuma vaga encontrada</h4>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Tente ajustar seus termos de busca ou filtros.</p>
        </div>
      )}
    </div>
  );
};
