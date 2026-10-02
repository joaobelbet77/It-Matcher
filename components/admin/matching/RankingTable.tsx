'use client';

import React, { useState } from 'react';
import { MatchingResult } from '@/types';
import { MatchingScoreBadge } from './MatchingScoreBadge';
import { ReviewStatusBadge } from '@/components/admin/revisoes/RevisaoStatusBadge';
import { MatchingBreakdownModal } from './MatchingBreakdownModal';
import { HumanReviewModal } from '@/components/admin/revisoes/RevisaoModal';
import { Button } from '@/components/ui/Button';
import { Eye, UserCheck, Check, X, Award, FileText } from 'lucide-react';

export type RankingItem = MatchingResult & {
  reviewStatus?: string;
  reviewNotes?: string;
  candidate?: any;
};

interface RankingTableProps {
  results: RankingItem[];
  onReviewUpdated?: () => void;
}

export const RankingTable: React.FC<RankingTableProps> = ({
  results,
  onReviewUpdated,
}) => {
  const [selectedForDetails, setSelectedForDetails] = useState<MatchingResult | null>(null);
  const [selectedForReview, setSelectedForReview] = useState<RankingItem | null>(null);

  if (results.length === 0) {
    return (
      <div className="bg-slate-900/90 p-12 text-center rounded-2xl border border-slate-800">
        <Award className="w-10 h-10 text-slate-600 mx-auto mb-2" />
        <h4 className="text-base font-bold text-slate-100">Nenhum candidato encontrado nos filtros</h4>
        <p className="text-xs text-slate-400 mt-1">
          Tente ajustar ou limpar os filtros de compatibilidade, competências ou senioridade.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold text-xs">
                <th className="py-3.5 px-4 text-center w-16">Posição</th>
                <th className="py-3.5 px-4">Candidato</th>
                <th className="py-3.5 px-4">Senioridade & Exp.</th>
                <th className="py-3.5 px-4">Compatibilidade (%)</th>
                <th className="py-3.5 px-4">Skills Compatíveis</th>
                <th className="py-3.5 px-4">Status da Triagem</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {results.map((item, index) => {
                const rankNumber = index + 1;
                const isTop = rankNumber <= 3 && item.score >= 80;
                const totalSkills = item.allRequirements.length;
                const matchedCount = item.matchedSkills.length;

                return (
                  <tr
                    key={item.candidateId}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Posição no Ranking */}
                    <td className="py-4 px-4 text-center font-black">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                          isTop
                            ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        #{rankNumber}
                      </span>
                    </td>

                    {/* Candidato */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-100 text-sm">{item.candidateName}</div>
                      {item.candidate?.hasResume && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60 mt-0.5">
                          <FileText className="w-3 h-3 text-emerald-400" /> CV Validado
                        </span>
                      )}
                    </td>

                    {/* Senioridade & Experiência */}
                    <td className="py-4 px-4">
                      <div className="text-xs font-semibold text-slate-200">{item.levelComparison.candidateLevel}</div>
                      <div className="text-[11px] text-slate-400">
                        {item.experienceComparison.candidateYears} ano(s) exp.
                      </div>
                    </td>

                    {/* Score & Classificação */}
                    <td className="py-4 px-4">
                      <MatchingScoreBadge
                        score={item.score}
                        classification={item.classification}
                        label={item.classificationLabel}
                        size="sm"
                      />
                    </td>

                    {/* Resumo de Requisitos e Contador Sintético (8 de 10) */}
                    <td className="py-4 px-4">
                      <div className="space-y-1 max-w-xs">
                        <div className="text-xs font-bold text-blue-400">
                          {matchedCount} de {totalSkills} skills compatíveis
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {item.matchedSkills.map((m) => (
                            <span
                              key={m.skillName}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 font-medium"
                              title={`✓ ${m.skillName} (+${m.weight}%)`}
                            >
                              <Check className="w-3 h-3 text-emerald-400" />
                              {m.skillName}
                            </span>
                          ))}
                          {item.missingSkills.map((m) => (
                            <span
                              key={m.skillName}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-rose-950/50 text-rose-300 border border-rose-800/50 font-medium opacity-75"
                              title={`✕ ${m.skillName} (${m.weight}% não pontuado)`}
                            >
                              <X className="w-3 h-3 text-rose-400" />
                              {m.skillName}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>

                    {/* Status de Revisão Humana */}
                    <td className="py-4 px-4">
                      <ReviewStatusBadge status={item.reviewStatus} size="sm" />
                    </td>

                    {/* Ações */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          icon={<Eye className="w-3.5 h-3.5" />}
                          onClick={() => setSelectedForDetails(item)}
                          title="Ver transparência e fórmula do matching"
                        >
                          Ver detalhes
                        </Button>
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          icon={<UserCheck className="w-3.5 h-3.5" />}
                          onClick={() => setSelectedForReview(item)}
                          title="Realizar revisão manual humana"
                        >
                          Revisar
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalhamento e Transparência */}
      <MatchingBreakdownModal
        isOpen={!!selectedForDetails}
        onClose={() => setSelectedForDetails(null)}
        matching={selectedForDetails}
        onOpenReview={(m) => {
          setSelectedForDetails(null);
          setSelectedForReview(m as RankingItem);
        }}
      />

      {/* Modal de Revisão Humana */}
      {selectedForReview && (
        <HumanReviewModal
          isOpen={!!selectedForReview}
          onClose={() => setSelectedForReview(null)}
          matching={selectedForReview}
          currentStatus={selectedForReview.reviewStatus}
          initialNotes={selectedForReview.reviewNotes}
          onReviewSaved={() => {
            if (onReviewUpdated) onReviewUpdated();
          }}
        />
      )}
    </>
  );
};
