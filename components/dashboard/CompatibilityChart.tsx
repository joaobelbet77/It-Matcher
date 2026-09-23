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
          <PieChart className="w-5 h-5 text-blue-400" />
          <h3 className="text-base font-bold text-white">Distribuição de Compatibilidade</h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">Total: {total} avaliações</span>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Barra de Progresso Segmentada */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden flex shadow-inner border border-slate-800">
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
              className="bg-rose-500 h-full transition-all duration-500 shadow-xs"
              style={{ width: `${lowPercent}%` }}
              title={`Baixa: ${lowPercent}%`}
            />
          </div>
          <p className="text-[11px] text-slate-400 text-center">
            Proporção de candidatos distribuídos por faixa de aderência técnica
          </p>
        </div>

        {/* Detalhes Numéricos e Legendas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Alta */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-800/60 text-emerald-200 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Alta Compatibilidade</span>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-emerald-300">{highPercent}%</span>
              <span className="text-xs font-semibold text-emerald-400">{highCount} cand.</span>
            </div>
            <span className="text-[10px] text-emerald-400/80 mt-1">Faixa: 80% a 100%</span>
          </div>

          {/* Média */}
          <div className="p-3.5 rounded-2xl bg-amber-950/50 border border-amber-800/60 text-amber-200 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Média Compatibilidade</span>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-amber-300">{mediumPercent}%</span>
              <span className="text-xs font-semibold text-amber-400">{mediumCount} cand.</span>
            </div>
            <span className="text-[10px] text-amber-400/80 mt-1">Faixa: 60% a 79%</span>
          </div>

          {/* Baixa */}
          <div className="p-3.5 rounded-2xl bg-rose-950/50 border border-rose-800/60 text-rose-200 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 mb-1">
              <XCircle className="w-4 h-4 text-rose-400" />
              <span>Baixa Compatibilidade</span>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-rose-300">{lowPercent}%</span>
              <span className="text-xs font-semibold text-rose-400">{lowCount} cand.</span>
            </div>
            <span className="text-[10px] text-rose-400/80 mt-1">Faixa: Abaixo de 60%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
