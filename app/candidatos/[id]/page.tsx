import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MatchingScoreBadge } from '@/components/admin/matching/MatchingScoreBadge';
import { store } from '@/lib/storage';
import { calculateMatching } from '@/lib/matching';
import { maskEmail, maskPhone } from '@/lib/security';
import { User, FileText, Mail, Phone, Calendar, ArrowRight, ChevronLeft, ShieldCheck, Award } from 'lucide-react';

export const revalidate = 0;

export default async function DetalhesCandidatoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const candidate = store.getCandidateById(id);

  if (!candidate) {
    notFound();
  }

  const jobs = store.getJobs();
  const evaluations = jobs.map((job) => ({
    job,
    matching: calculateMatching(job, candidate),
  })).sort((a, b) => b.matching.score - a.matching.score);

  return (
    <div className="space-y-6">
      <Header
        title={candidate.name}
        description={`Perfil do Candidato • ${candidate.level} • ${candidate.experienceYears} ano(s) de experiência`}
      >
        <Link href="/candidatos">
          <Button variant="outline" size="sm" icon={<ChevronLeft className="w-4 h-4" />}>
            Voltar para Lista
          </Button>
        </Link>
      </Header>

      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Card de Perfil */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-blue-500/20">
                {candidate.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-100">{candidate.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="purple">{candidate.level}</Badge>
                  <span className="text-xs text-slate-400 font-medium">
                    {candidate.experienceYears} ano(s) de experiência profissional
                  </span>
                </div>
              </div>
            </div>

            {candidate.hasResume && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex items-center gap-2 text-xs text-emerald-400">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>
                  Currículo PDF validado ({((candidate.resumeFileSize || 0) / 1024).toFixed(0)} KB)
                </span>
              </div>
            )}
          </div>

          {/* Dados de Contato Mascarados (RG01) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-500" />
              <span className="text-slate-400">E-mail:</span>
              <span className="font-semibold text-slate-200">{maskEmail(candidate.email)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-500" />
              <span className="text-slate-400">Telefone:</span>
              <span className="font-semibold text-slate-200">{maskPhone(candidate.phone)}</span>
            </div>
          </div>

          {candidate.bio && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Resumo Profissional
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">{candidate.bio}</p>
            </div>
          )}

          {/* Competências Técnicas */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Competências Técnicas Cadastradas ({candidate.technicalSkills.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {candidate.technicalSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-blue-950/80 text-blue-300 border border-blue-800/60 rounded-lg text-xs font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Compatibilidade com as Vagas do Sistema */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Compatibilidade com as Vagas Abertas
              </h3>
              <p className="text-xs text-slate-400">
                Comparação automática de competências e pesos técnicos
              </p>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {evaluations.length} vaga(s) analisada(s)
            </span>
          </div>

          <div className="space-y-3">
            {evaluations.map(({ job, matching }) => (
              <div
                key={job.id}
                className="p-4 rounded-xl border border-slate-800 hover:border-blue-500/50 bg-slate-950/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-100 text-sm">{job.title}</h4>
                    <Badge variant="purple" size="sm">{job.area}</Badge>
                  </div>
                  <p className="text-xs text-slate-400">
                    Exige {job.level} • Mínimo {job.minExperienceYears} ano(s)
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <MatchingScoreBadge
                    score={matching.score}
                    classification={matching.classification}
                    label={matching.classificationLabel}
                    size="sm"
                  />
                  <Link href={`/matching/${job.id}`}>
                    <Button variant="outline" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Ver Ranking
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
