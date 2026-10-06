'use client';

import React from 'react';
import { MatchingResult } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { MatchingScoreBadge } from './MatchingScoreBadge';
import { ReviewStatusBadge } from '@/components/admin/revisoes/RevisaoStatusBadge';
import { Button } from '@/components/ui/Button';
import { Check, X, Info, ShieldCheck, AlertTriangle, UserCheck, Briefcase } from 'lucide-react';

interface MatchingBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  matching: MatchingResult | null;
  onOpenReview?: (matching: MatchingResult) => void;
}

export const MatchingBreakdownModal: React.FC<MatchingBreakdownModalProps> = ({
  isOpen,
  onClose,
  matching,
  onOpenReview,
}) => {
  if (!matching) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transparência e Detalhamento do Smart Matching"
      subtitle={`Candidato: ${matching.candidateName} • Vaga: ${matching.jobTitle}`}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Painel de Pontuação e Status */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-blue-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold tracking-wider text-blue-300 uppercase">
              Resultado do Algoritmo Técnico (RG04)
            </span>
            <h3 className="text-2xl font-black">{matching.candidateName}</h3>
            <p className="text-xs text-slate-300">
              Vaga analisada: <span className="font-semibold text-white">{matching.jobTitle}</span>
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <MatchingScoreBadge
              score={matching.score}
              classification={matching.classification}
              label={matching.classificationLabel}
              size="lg"
            />
            <span className="text-[11px] text-slate-400">
              Calculado em: {new Date(matching.calculatedAt).toLocaleString('pt-BR')}
            </span>
          </div>
        </div>

        {/* Alerta de Suficiência de Dados (RG06/RG07) */}
        {matching.insufficientData ? (
          <div className="p-4 rounded-xl bg-amber-950/50 border border-amber-800/60 text-amber-200 text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Informações insuficientes para calcular o matching com precisão.</p>
              <p className="text-xs mt-1 text-amber-300/90">
                O candidato foi encaminhado para revisão manual obrigatória devido à ausência de competências técnicas cadastradas.
              </p>
            </div>
          </div>
        ) : null}

        {/* Seção Obrigatória: "Como o percentual foi calculado" (Requisito 11 e RG04) */}
        <div className="bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-zinc-800">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h4 className="text-base font-bold text-slate-900 dark:text-zinc-100">Como o percentual foi calculado</h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 font-semibold bg-slate-50 dark:bg-zinc-900/80">
                  <th className="py-2.5 px-3">Competência Exigida</th>
                  <th className="py-2.5 px-3 text-center">Peso na Vaga</th>
                  <th className="py-2.5 px-3 text-center">Status no Candidato</th>
                  <th className="py-2.5 px-3 text-right">Pontos Obtidos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                {matching.calculationBreakdown.map((item, idx) => {
                  const isFound = item.status === 'Encontrado';
                  return (
                    <tr key={idx} className={isFound ? 'bg-emerald-50/60 dark:bg-emerald-950/20' : 'bg-rose-50/60 dark:bg-rose-950/20'}>
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-zinc-200 flex items-center gap-2">
                        {isFound ? (
                          <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/60 flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800/60 flex items-center justify-center shrink-0">
                            <X className="w-3.5 h-3.5" />
                          </span>
                        )}
                        <span>{item.skillName}</span>
                      </td>

                      <td className="py-3 px-3 text-center font-bold text-slate-700 dark:text-zinc-300">
                        {item.weight}%
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full font-semibold text-[11px] ${
                            isFound
                              ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                              : 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right font-extrabold text-slate-900 dark:text-zinc-100">
                        +{item.pointsAwarded}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200 dark:border-zinc-700 font-bold bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-sm">
                  <td colSpan={3} className="py-3 px-3 text-right">
                    Total Final de Compatibilidade:
                  </td>
                  <td className="py-3 px-3 text-right text-blue-600 dark:text-blue-400 font-black text-base">
                    {matching.score}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Fórmula e Soma Explícita */}
          <div className="p-3.5 bg-slate-50 dark:bg-zinc-950/70 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs text-slate-700 dark:text-zinc-300">
            <span className="font-bold text-slate-900 dark:text-zinc-100 block mb-1">Demonstração Aritmética da Fórmula:</span>
            <code className="text-blue-700 dark:text-blue-300 font-mono text-xs block bg-white dark:bg-zinc-950 p-2.5 rounded-lg border border-slate-200 dark:border-zinc-800">
              {matching.totalFormulaExplanation}
            </code>
          </div>
        </div>

        {/* Comparativo de Critérios Complementares */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-[#121215] space-y-2">
            <h5 className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
              Experiência Profissional
            </h5>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-500 dark:text-zinc-400">Exigido pela vaga:</span>
              <span className="font-bold text-slate-900 dark:text-zinc-200 text-sm">
                {matching.experienceComparison.requiredYears} ano(s)
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-500 dark:text-zinc-400">Candidato possui:</span>
              <span className="font-bold text-slate-900 dark:text-zinc-200 text-sm">
                {matching.experienceComparison.candidateYears} ano(s)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 pt-1 border-t border-slate-200 dark:border-zinc-800">
              {matching.experienceComparison.note}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-[#121215] space-y-2">
            <h5 className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
              Nível de Senioridade
            </h5>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-500 dark:text-zinc-400">Perfil da vaga:</span>
              <span className="font-bold text-slate-900 dark:text-zinc-200 text-sm">
                {matching.levelComparison.requiredLevel}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-500 dark:text-zinc-400">Nível do candidato:</span>
              <span className="font-bold text-slate-900 dark:text-zinc-200 text-sm">
                {matching.levelComparison.candidateLevel}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 pt-1 border-t border-slate-200 dark:border-zinc-800">
              {matching.levelComparison.note}
            </p>
          </div>
        </div>

        {/* Rodapé com Ações de Decisão Humana */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Auditado conforme Guardrail RG10</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={onClose} className="flex-1 sm:flex-initial">
              Fechar
            </Button>
            {onOpenReview && (
              <Button
                variant="primary"
                size="sm"
                icon={<UserCheck className="w-4 h-4" />}
                onClick={() => {
                  onClose();
                  onOpenReview(matching);
                }}
                className="flex-1 sm:flex-initial"
              >
                Efetuar Revisão Humana
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
