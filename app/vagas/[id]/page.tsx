import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { store } from '@/lib/storage';
import { calculateMatching, rankCandidates } from '@/lib/matching';
import { Briefcase, ArrowRight, Award, ChevronLeft, Building2, MapPin, DollarSign, FileText, Globe } from 'lucide-react';

export const revalidate = 0;

export default async function DetalhesVagaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = store.getJobById(id);

  if (!job) {
    notFound();
  }

  const candidates = store.getCandidates();
  const matchings = rankCandidates(candidates.map((c) => calculateMatching(job, c)));
  const topCandidates = matchings.slice(0, 3);

  const hasCompanyInfo = job.companyType || job.companyIndustry || job.companySize || job.companyLocation || job.companyWebsite || job.companyDescription;

  return (
    <div className="space-y-6">
      <Header
        title={job.title}
        description={`Área: ${job.area} • Nível: ${job.level} • Mínimo de ${job.minExperienceYears} anos`}
      >
        <div className="flex items-center gap-2">
          <Link href="/vagas">
            <Button variant="outline" size="sm" icon={<ChevronLeft className="w-4 h-4" />}>
              Voltar
            </Button>
          </Link>
          <Link href={`/matching/${job.id}`}>
            <Button variant="primary" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
              Ver Ranking & Matching
            </Button>
          </Link>
        </div>
      </Header>

      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Card da Empresa / Organização (se houver dados) */}
        {hasCompanyInfo && (
          <div className="bg-white dark:bg-[#121215] p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-sm space-y-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-zinc-800">
              <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Empresa / Organização Contratante
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {job.companyType && (
                <div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block">Tipo</span>
                  <span className="text-sm font-medium text-slate-800 dark:text-zinc-200">{job.companyType}</span>
                </div>
              )}

              {job.companyIndustry && (
                <div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block">Área de Atuação</span>
                  <span className="text-sm font-medium text-slate-800 dark:text-zinc-200">{job.companyIndustry}</span>
                </div>
              )}

              {job.companySize && (
                <div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block">Porte / Tamanho</span>
                  <span className="text-sm font-medium text-slate-800 dark:text-zinc-200">{job.companySize}</span>
                </div>
              )}

              {job.companyLocation && (
                <div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block">Localização</span>
                  <span className="text-sm font-medium text-slate-800 dark:text-zinc-200 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                    {job.companyLocation}
                  </span>
                </div>
              )}

              {job.companyWebsite && (
                <div className="md:col-span-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block">Website Oficial</span>
                  <a
                    href={job.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    {job.companyWebsite}
                  </a>
                </div>
              )}
            </div>

            {job.companyDescription && (
              <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
                <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block mb-1">Sobre a Organização</span>
                <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">{job.companyDescription}</p>
              </div>
            )}
          </div>
        )}

        {/* Card Principal da Vaga */}
        <div className="bg-white dark:bg-[#121215] p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="purple">{job.area}</Badge>
            <Badge variant="default">{job.level}</Badge>
            {job.workModel && <Badge variant="info">{job.workModel}</Badge>}
            {job.contractType && <Badge variant="warning">{job.contractType}</Badge>}
            <Badge variant="success">Vaga {job.status}</Badge>
            <span className="text-xs text-slate-500 dark:text-zinc-400 ml-auto">
              Cadastrada em: {job.createdAt ? new Date(job.createdAt).toLocaleDateString('pt-BR') : 'Recentemente'}
            </span>
          </div>

          {(job.location || job.salaryRange) && (
            <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-600 dark:text-zinc-300 pt-1 pb-2 border-b border-slate-100 dark:border-zinc-800">
              {job.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                  Local da vaga: <strong className="text-slate-900 dark:text-zinc-100">{job.location}</strong>
                </span>
              )}
              {job.salaryRange && (
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                  Faixa salarial: <strong className="text-slate-900 dark:text-zinc-100">{job.salaryRange}</strong>
                </span>
              )}
            </div>
          )}

          <div>
            <h4 className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
              Descrição Geral e Responsabilidades
            </h4>
            <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {job.mandatoryRequirements && (
            <div className="pt-3 border-t border-slate-100 dark:border-zinc-800">
              <h4 className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                Requisitos Obrigatórios
              </h4>
              <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                {job.mandatoryRequirements}
              </p>
            </div>
          )}

          {job.desirableRequirements && (
            <div className="pt-3 border-t border-slate-100 dark:border-zinc-800">
              <h4 className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                Requisitos Desejáveis
              </h4>
              <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                {job.desirableRequirements}
              </p>
            </div>
          )}

          {job.benefits && (
            <div className="pt-3 border-t border-slate-100 dark:border-zinc-800">
              <h4 className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                Benefícios Oferecidos
              </h4>
              <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                {job.benefits}
              </p>
            </div>
          )}
        </div>

        {/* Distribuição de Pesos de Competências (Requisito 4) */}
        <div className="bg-white dark:bg-[#121215] p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h4 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                Competências Técnicas e Pesos de Importância
              </h4>
            </div>
            <span className="text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200 dark:border-emerald-800/60">
              Soma: 100%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {job.skills.map((skill) => {
              const isRequired = skill.required ?? true;
              return (
                <div
                  key={skill.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-900/60 flex items-center justify-between"
                >
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-zinc-200 text-sm">{skill.name}</h5>
                    <span
                      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 ${
                        isRequired
                          ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60'
                          : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                      }`}
                    >
                      {isRequired ? 'Obrigatória' : 'Desejável'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-blue-600 dark:text-blue-400">{skill.weight}%</span>
                    <span className="block text-[10px] text-slate-400 dark:text-zinc-500">peso no matching</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Preview dos Melhores Candidatos para a Vaga */}
        <div className="bg-white dark:bg-[#121215] p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-zinc-100">Top Candidatos Compatíveis</h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Prévia do ranqueamento calculado</p>
            </div>
            <Link href={`/matching/${job.id}`}>
              <Button variant="outline" size="sm">
                Ver Todos ({matchings.length})
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topCandidates.map((m, idx) => (
              <div key={m.candidateId} className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-900/60 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800/60 px-2 py-0.5 rounded">
                    #{idx + 1} no Ranking
                  </span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{m.score}%</span>
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-zinc-100 text-sm">{m.candidateName}</h5>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">{m.experienceComparison.candidateYears} anos • {m.levelComparison.candidateLevel}</p>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                  {m.matchedSkills.length} de {job.skills.length} skills encontradas
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
