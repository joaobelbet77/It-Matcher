'use client';

import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { PieChart, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface CompatibilityChartProps {
  highCount: number;
  mediumCount: number;
  lowCount: number;
  total: number;
}

export const CompatibilityChart: React.FC<CompatibilityChartProps> = ({
  highCount,
  mediumCount,
  lowCount,
  total,
}) => {
  const highPercent = total > 0 ? Math.round((highCount / total) * 100) : 0;
  const mediumPercent = total > 0 ? Math.round((mediumCount / total) * 100) : 0;
  const lowPercent = total > 0 ? Math.max(0, 100 - highPercent - mediumPercent) : 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">Distribuição de Compatibilidade</h3>
        </div>
        <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Total: {total} avaliações</span>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Barra de Progresso Segmentada */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden flex shadow-inner border border-slate-200 dark:border-zinc-700">
            <div
              className="bg-emerald-500 h-full transition-all duration-500 shadow-xs"
              style={{ width: `${highPercent}%` }}
              title={`Alta: ${highPercent}%`}
            />
            <div
              className="bg-amber-500 h-full transition-all duration-500 shadow-xs"
              style={{ width: `${mediumPercent}%` }}
              title={`Média: ${mediumPercent}%`}
            />
            <div
              className="bg-red-500 h-full transition-all duration-500 shadow-xs"
              style={{ width: `${lowPercent}%` }}
              title={`Baixa: ${lowPercent}%`}
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 text-center">
            Proporção de candidatos distribuídos por faixa de aderência técnica
          </p>
        </div>

        {/* Detalhes Numéricos e Legendas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Alta */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1 font-heading">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Alta Aderência</span>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-heading font-black text-emerald-700 dark:text-emerald-300">{highPercent}%</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{highCount} cand.</span>
            </div>
            <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 mt-1 font-medium">Faixa: 70% a 100%</span>
          </div>

          {/* Média */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 mb-1 font-heading">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Média Aderência</span>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-heading font-black text-amber-700 dark:text-amber-300">{mediumPercent}%</span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{mediumCount} cand.</span>
            </div>
            <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80 mt-1 font-medium">Faixa: 30% a 69%</span>
          </div>

          {/* Baixa */}
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-900 dark:text-red-200 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-700 dark:text-red-400 mb-1 font-heading">
              <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span>Baixa Aderência</span>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-heading font-black text-red-700 dark:text-red-300">{lowPercent}%</span>
              <span className="text-xs font-bold text-red-600 dark:text-red-400">{lowCount} cand.</span>
            </div>
            <span className="text-[10px] text-red-600/80 dark:text-red-400/80 mt-1 font-medium">Faixa: 0% a 29%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
