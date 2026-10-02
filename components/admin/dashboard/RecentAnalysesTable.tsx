'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MatchingResult } from '@/types';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { MatchingScoreBadge } from '@/components/admin/matching/MatchingScoreBadge';
import { ReviewStatusBadge } from '@/components/admin/revisoes/RevisaoStatusBadge';
import { MatchingBreakdownModal } from '@/components/admin/matching/MatchingBreakdownModal';
import { HumanReviewModal } from '@/components/admin/revisoes/RevisaoModal';
import { Button } from '@/components/ui/Button';
import { Clock, Eye, UserCheck, ArrowRight } from 'lucide-react';

interface RecentAnalysesTableProps {
  analyses: MatchingResult[];
  onReviewSaved?: () => void;
}

export const RecentAnalysesTable: React.FC<RecentAnalysesTableProps> = ({
  analyses,
  onReviewSaved,
}) => {
  const [selectedDetails, setSelectedDetails] = useState<MatchingResult | null>(null);
  const [selectedReview, setSelectedReview] = useState<MatchingResult | null>(null);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">Últimas Análises e Matchings Calculados</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Histórico recente de triagem técnica automatizada</p>
            </div>
          </div>
          <Link href="/matching">
            <Button variant="ghost" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
              Ver Todos os Matchings
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-zinc-900/60 border-b border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 font-bold uppercase tracking-wider text-[11px] font-heading">
                  <th className="py-3 px-4">Candidato</th>
                  <th className="py-3 px-4">Vaga</th>
                  <th className="py-3 px-4">Matching & Classificação</th>
                  <th className="py-3 px-4">Data da Análise</th>
                  <th className="py-3 px-4">Status da Triagem</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
                {analyses.slice(0, 6).map((item, idx) => (
                  <tr key={`${item.jobId}-${item.candidateId}-${idx}`} className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white text-sm font-heading">
                      {item.candidateName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-zinc-300 font-medium">
                      {item.jobTitle}
                    </td>
                    <td className="py-3.5 px-4">
                      <MatchingScoreBadge
                        score={item.score}
                        classification={item.classification}
                        label={item.classificationLabel}
                        size="sm"
                      />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-zinc-400">
                      {item.calculatedAt ? new Date(item.calculatedAt).toLocaleDateString('pt-BR') : 'Hoje'}
                    </td>
                    <td className="py-3.5 px-4">
                      <ReviewStatusBadge status="Pendente de revisão" size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Eye className="w-3.5 h-3.5" />}
                          onClick={() => setSelectedDetails(item)}
                        >
                          Ver
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          icon={<UserCheck className="w-3.5 h-3.5" />}
                          onClick={() => setSelectedReview(item)}
                        >
                          Revisar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modais */}
      <MatchingBreakdownModal
        isOpen={!!selectedDetails}
        onClose={() => setSelectedDetails(null)}
        matching={selectedDetails}
        onOpenReview={(m) => {
          setSelectedDetails(null);
          setSelectedReview(m);
        }}
      />

      {selectedReview && (
        <HumanReviewModal
          isOpen={!!selectedReview}
          onClose={() => setSelectedReview(null)}
          matching={selectedReview}
          onReviewSaved={() => {
            if (onReviewSaved) onReviewSaved();
          }}
        />
      )}
    </>
  );
};
