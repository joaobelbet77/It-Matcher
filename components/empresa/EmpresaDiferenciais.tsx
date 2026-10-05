'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  Clock,
  Briefcase,
  Zap,
  Users,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  X,
  ChevronDown,
  ChevronUp,
  Star,
  Award,
  BarChart3,
  ArrowRight,
  GitCompare,
  ShieldCheck,
  Crown,
  Target,
  Activity,
  Calendar,
  MessageSquare,
  Eye,
  Sparkles,
  Filter,
  ArrowUpRight,
  Flame,
  Trophy,
  Send,
  UserCheck,
  XCircle,
  Download,
  FileSpreadsheet,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface EnrichedMatchingResult {
  candidateId: string;
  jobId: string;
  score: number;
  classification: 'ALTA' | 'MEDIA' | 'BAIXA';
  requiresManualReview: boolean;
  reviewStatus?: string;
  candidateName?: string;
  insufficientData?: boolean;
  calculationBreakdown?: Array<{
    skillName: string;
    weight: number;
    status: 'Encontrado' | 'Nao encontrado';
    pointsAwarded: number;
  }>;
  experienceComparison?: {
    candidateYears: number;
    requiredYears: number;
    meetsRequirement: boolean;
    note: string;
  };
  levelComparison?: {
    candidateLevel: string;
    requiredLevel: string;
    meetsRequirement: boolean;
    note: string;
  };
  candidate?: {
    id: string;
    name: string;
    email?: string;
    level?: string;
    experienceYears?: number;
    technicalSkills?: string[];
    bio?: string;
  };
}

interface JobForHealth {
  id: string;
  title: string;
  skills: Array<{ name: string; weight: number; required?: boolean }>;
  description?: string;
  workModel?: string;
  contractType?: string;
  location?: string;
  salaryMin?: string | number;
  salaryMax?: string | number;
  status?: string;
  createdAt?: string | Date;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. TIMELINE DE PROGRESSO DA VAGA (REDESIGNED)
// ═══════════════════════════════════════════════════════════════════════════════

interface TimelineStep {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const TIMELINE_STEPS: TimelineStep[] = [
  {
    id: 'cadastrada',
    label: 'Vaga Cadastrada',
    description: 'Dados enviados para analise do recrutador',
    icon: <Briefcase className="w-4 h-4" />,
    color: 'emerald',
  },
  {
    id: 'analise',
    label: 'Em Analise',
    description: 'Recrutador revisando criterios e requisitos',
    icon: <Clock className="w-4 h-4" />,
    color: 'amber',
  },
  {
    id: 'aprovada',
    label: 'Aprovada',
    description: 'Vaga aprovada e publicada na plataforma',
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: 'blue',
  },
  {
    id: 'matching',
    label: 'Matching Ativo',
    description: 'IA realizando analise inteligente de candidatos',
    icon: <Zap className="w-4 h-4" />,
    color: 'purple',
  },
];

function getActiveStep(status?: string): number {
  if (!status) return 0;
  const s = status.toLowerCase();
  if (s.includes('matching') || s.includes('ativa')) return 3;
  if (s.includes('aprovada') || s.includes('ativo')) return 2;
  if (s.includes('analise') || s.includes('aguardando')) return 1;
  return 0;
}

export function VagaTimeline({ job }: { job: JobForHealth }) {
  const activeStep = getActiveStep(job.status);
  const daysSince = job.createdAt
    ? Math.floor((Date.now() - new Date(job.createdAt).getTime()) / 86400000)
    : 0;

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800/80 backdrop-blur-sm space-y-1 relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl" />

      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5 relative z-10">
        <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
        Progresso da Vaga
      </p>

      <div className="relative z-10">
        {/* Background line */}
        <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-slate-800/80" />

        {/* Animated progress line */}
        <div
          className="absolute left-5 top-5 w-0.5 transition-all duration-1000 ease-out"
          style={{
            height: `${(activeStep / (TIMELINE_STEPS.length - 1)) * 100}%`,
            background: 'linear-gradient(to bottom, #10b981, #3b82f6, #8b5cf6)',
          }}
        />

        <div className="space-y-6 relative">
          {TIMELINE_STEPS.map((step, idx) => {
            const isDone = idx <= activeStep;
            const isCurrent = idx === activeStep;

            const bgColors: Record<string, string> = {
              emerald: 'bg-emerald-500 shadow-emerald-500/40',
              amber: 'bg-amber-500 shadow-amber-500/40',
              blue: 'bg-blue-500 shadow-blue-500/40',
              purple: 'bg-purple-500 shadow-purple-500/40',
            };

            const textColors: Record<string, string> = {
              emerald: 'text-emerald-400',
              amber: 'text-amber-400',
              blue: 'text-blue-400',
              purple: 'text-purple-400',
            };

            return (
              <div key={step.id} className="flex items-start gap-4">
                <div
                  className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 shrink-0 ${
                    isDone
                      ? `${bgColors[step.color]} border-transparent text-white shadow-lg`
                      : 'bg-slate-900 border-slate-700 text-slate-600'
                  }`}
                >
                  {isDone && idx < activeStep ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    step.icon
                  )}
                  {isCurrent && (
                    <>
                      <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-current" />
                      <span className={`absolute -inset-1 rounded-full border-2 border-dashed ${textColors[step.color].replace('text-', 'border-')} opacity-30 animate-spin`} style={{ animationDuration: '8s' }} />
                    </>
                  )}
                </div>

                <div className={`pt-1.5 transition-opacity duration-300 ${isDone ? 'opacity-100' : 'opacity-40'}`}>
                  <p className={`text-xs font-bold ${isCurrent ? textColors[step.color] : isDone ? 'text-slate-200' : 'text-slate-500'}`}>
                    {step.label}
                    {isCurrent && (
                      <span className={`ml-2 text-[10px] font-bold ${textColors[step.color]} px-2 py-0.5 rounded-full border border-current/30 bg-current/10`}>
                        Atual
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mini stats bar */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 mt-4 relative z-10">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <Calendar className="w-3 h-3" />
          {job.createdAt ? new Date(job.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recente'}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400">
          <Activity className="w-3 h-3" />
          {daysSince} dia(s) ativo
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. GRAFICO DE SKILLS (com Radar SVG + barras)
// ═══════════════════════════════════════════════════════════════════════════════

export function SkillsRadarChart({
  jobSkills,
  matchingResults,
}: {
  jobSkills: Array<{ name: string; weight: number }>;
  matchingResults: EnrichedMatchingResult[];
}) {
  const skillStats = jobSkills.map((skill) => {
    const total = matchingResults.length;
    if (total === 0) return { name: skill.name, weight: skill.weight, matchRate: 0, count: 0, total: 0 };
    const matched = matchingResults.filter((r) =>
      r.calculationBreakdown?.some((b) => b.skillName === skill.name && b.status === 'Encontrado')
    ).length;
    return { name: skill.name, weight: skill.weight, matchRate: Math.round((matched / total) * 100), count: matched, total };
  });

  const sorted = [...skillStats].sort((a, b) => b.matchRate - a.matchRate);

  // Skill gap - hardest to find skills
  const hardestSkills = [...skillStats].filter(s => s.matchRate < 50).sort((a, b) => a.matchRate - b.matchRate);

  // SVG Radar chart
  const n = skillStats.length;
  const cx = 80, cy = 80, maxR = 60;
  const angleStep = (2 * Math.PI) / (n || 1);

  const radarPoints = skillStats.map((s, i) => {
    const angle = angleStep * i - Math.PI / 2;
    const r = (s.matchRate / 100) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
  const radarPath = radarPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';

  // Grid rings
  const rings = [25, 50, 75, 100];

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800/80 backdrop-blur-sm space-y-4 relative overflow-hidden">
      <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="flex items-center justify-between relative z-10">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
          Cobertura de Skills
        </p>
        <span className="text-[11px] text-slate-500">{matchingResults.length} avaliados</span>
      </div>

      {matchingResults.length === 0 ? (
        <p className="text-xs text-slate-500 text-center py-4">Nenhum candidato avaliado ainda.</p>
      ) : (
        <div className="relative z-10 space-y-4">
          {/* SVG Radar Chart */}
          {n >= 3 && (
            <div className="flex justify-center">
              <svg width="160" height="160" viewBox="0 0 160 160" className="opacity-90">
                <defs>
                  <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.15" />
                  </linearGradient>
                </defs>
                {/* Grid rings */}
                {rings.map((pct) => (
                  <circle key={pct} cx={cx} cy={cy} r={(pct / 100) * maxR} fill="none" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 2" />
                ))}
                {/* Axis lines */}
                {skillStats.map((_, i) => {
                  const angle = angleStep * i - Math.PI / 2;
                  return (
                    <line key={i} x1={cx} y1={cy} x2={cx + maxR * Math.cos(angle)} y2={cy + maxR * Math.sin(angle)} stroke="#334155" strokeWidth="0.5" />
                  );
                })}
                {/* Radar area */}
                {n > 0 && <path d={radarPath} fill="url(#radarFill)" stroke="#8b5cf6" strokeWidth="1.5" />}
                {/* Dots */}
                {radarPoints.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r="3" fill="#8b5cf6" stroke="#1e1b4b" strokeWidth="1.5" />
                ))}
                {/* Labels */}
                {skillStats.map((s, i) => {
                  const angle = angleStep * i - Math.PI / 2;
                  const lr = maxR + 14;
                  const lx = cx + lr * Math.cos(angle);
                  const ly = cy + lr * Math.sin(angle);
                  return (
                    <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" className="fill-slate-500 text-[6px] font-medium">
                      {s.name.length > 8 ? s.name.slice(0, 7) + '..' : s.name}
                    </text>
                  );
                })}
              </svg>
            </div>
          )}

          {/* Bars */}
          <div className="space-y-2.5">
            {sorted.map((skill) => {
              const pct = skill.matchRate;
              const barColor = pct >= 70 ? 'from-emerald-600 to-emerald-400' : pct >= 40 ? 'from-amber-600 to-amber-400' : 'from-red-600 to-red-400';
              return (
                <div key={skill.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-2">
                      {skill.name}
                      <span className="text-[10px] text-slate-600 font-normal">(peso {skill.weight}%)</span>
                    </span>
                    <span className={`font-bold text-xs ${pct >= 70 ? 'text-emerald-400' : pct >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                      {pct}%
                      <span className="text-slate-600 font-normal ml-1">({skill.count}/{skill.total})</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Skill Gap Indicator */}
          {hardestSkills.length > 0 && (
            <div className="p-3 rounded-xl bg-red-950/20 border border-red-900/30 space-y-1.5">
              <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3" />
                Skills mais dificeis de encontrar
              </p>
              <div className="flex flex-wrap gap-1.5">
                {hardestSkills.slice(0, 3).map(s => (
                  <span key={s.name} className="text-[10px] px-2 py-0.5 rounded-md bg-red-950/40 border border-red-800/40 text-red-300 font-medium">
                    {s.name} ({s.matchRate}%)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. SCORE DE SAUDE DA VAGA (REDESIGNED)
// ═══════════════════════════════════════════════════════════════════════════════

interface HealthTip {
  type: 'error' | 'warning' | 'success' | 'info';
  message: string;
  category: string;
  points: number;
  maxPoints: number;
}

function calculateJobHealth(job: JobForHealth): { score: number; tips: HealthTip[] } {
  const tips: HealthTip[] = [];
  let score = 0;

  if (job.skills.length === 0) {
    tips.push({ type: 'error', message: 'Adicione pelo menos uma skill tecnica.', category: 'Skills', points: 0, maxPoints: 35 });
  } else if (job.skills.length < 3) {
    tips.push({ type: 'warning', message: 'Vagas com 3+ skills tem matching 40% mais preciso.', category: 'Skills', points: 15, maxPoints: 35 });
    score += 15;
  } else if (job.skills.length >= 5) {
    tips.push({ type: 'success', message: `${job.skills.length} skills configuradas.`, category: 'Skills', points: 35, maxPoints: 35 });
    score += 35;
  } else {
    tips.push({ type: 'success', message: `${job.skills.length} skills configuradas.`, category: 'Skills', points: 25, maxPoints: 35 });
    score += 25;
  }

  if (!job.description || job.description.length < 50) {
    tips.push({ type: 'warning', message: 'Descricao muito curta. Detalhe responsabilidades.', category: 'Descricao', points: 5, maxPoints: 20 });
    score += 5;
  } else if (job.description.length >= 200) {
    tips.push({ type: 'success', message: 'Descricao completa e detalhada.', category: 'Descricao', points: 20, maxPoints: 20 });
    score += 20;
  } else {
    tips.push({ type: 'info', message: 'Descricao poderia ser mais detalhada.', category: 'Descricao', points: 12, maxPoints: 20 });
    score += 12;
  }

  if (!job.workModel) {
    tips.push({ type: 'info', message: 'Informe o modelo de trabalho.', category: 'Modelo', points: 0, maxPoints: 10 });
  } else {
    tips.push({ type: 'success', message: 'Modelo de trabalho informado.', category: 'Modelo', points: 10, maxPoints: 10 });
    score += 10;
  }

  if (!job.contractType) {
    tips.push({ type: 'info', message: 'Informe o tipo de contratacao.', category: 'Contrato', points: 0, maxPoints: 10 });
  } else {
    tips.push({ type: 'success', message: 'Tipo de contratacao informado.', category: 'Contrato', points: 10, maxPoints: 10 });
    score += 10;
  }

  if (!job.salaryMin && !job.salaryMax) {
    tips.push({ type: 'warning', message: 'Faixa salarial atrai 2x mais candidatos.', category: 'Salario', points: 0, maxPoints: 15 });
  } else {
    tips.push({ type: 'success', message: 'Faixa salarial informada.', category: 'Salario', points: 15, maxPoints: 15 });
    score += 15;
  }

  if (!job.location) {
    tips.push({ type: 'info', message: 'Adicione a localizacao.', category: 'Local', points: 0, maxPoints: 10 });
  } else {
    tips.push({ type: 'success', message: 'Localizacao informada.', category: 'Local', points: 10, maxPoints: 10 });
    score += 10;
  }

  return { score: Math.min(score, 100), tips };
}

export function JobHealthScore({ job }: { job: JobForHealth }) {
  const { score, tips } = calculateJobHealth(job);
  const [open, setOpen] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let frame: number;
    let start: number;
    const duration = 1200;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const color = score >= 80 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-red-400';
  const ringColor = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  const label = score >= 80 ? 'Excelente' : score >= 50 ? 'Regular' : 'Incompleta';

  const r = 42;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800/80 backdrop-blur-sm space-y-4 relative overflow-hidden">
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />

      <div className="flex items-center justify-between relative z-10">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Saude da Vaga
        </p>
        <button
          onClick={() => setOpen((p) => !p)}
          className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
        >
          Detalhes {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      <div className="flex items-center gap-5 relative z-10">
        {/* Bigger SVG Donut with gradient */}
        <div className="relative shrink-0">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={ringColor} />
                <stop offset="100%" stopColor={ringColor} stopOpacity="0.5" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle cx="50" cy="50" r={r} fill="none" stroke="#1e293b" strokeWidth="6" />
            <circle
              cx="50" cy="50" r={r}
              fill="none"
              stroke="url(#healthGrad)"
              strokeWidth="6"
              strokeDasharray={`${dash} ${circ}`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              filter="url(#glow)"
              style={{ transition: 'stroke-dasharray 1.2s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-black ${color}`}>{animatedScore}</span>
            <span className="text-[8px] text-slate-500 font-bold uppercase">pontos</span>
          </div>
        </div>

        <div className="flex-1">
          <p className={`text-lg font-black ${color}`}>{label}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {tips.filter((t) => t.type === 'error' || t.type === 'warning').length} ponto(s) de melhoria
          </p>
          <div className="h-1.5 w-full bg-slate-800 rounded-full mt-2.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${score}%`, background: `linear-gradient(90deg, ${ringColor}, ${ringColor}88)` }}
            />
          </div>
        </div>
      </div>

      {open && (
        <div className="space-y-2 pt-3 border-t border-slate-800/60 relative z-10">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <Target className="w-3 h-3" /> Criterios detalhados
          </p>
          {tips.map((tip, i) => {
            const pct = tip.maxPoints > 0 ? (tip.points / tip.maxPoints) * 100 : 0;
            const tipColors: Record<HealthTip['type'], string> = {
              error: 'text-red-400 border-red-900/40',
              warning: 'text-amber-400 border-amber-900/40',
              success: 'text-emerald-400 border-emerald-900/40',
              info: 'text-blue-400 border-blue-900/40',
            };
            const barColors: Record<HealthTip['type'], string> = {
              error: 'bg-red-500',
              warning: 'bg-amber-500',
              success: 'bg-emerald-500',
              info: 'bg-blue-500',
            };
            return (
              <div key={i} className={`p-2.5 rounded-lg bg-slate-950/50 border ${tipColors[tip.type]} space-y-1.5`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold ${tipColors[tip.type].split(' ')[0]}`}>{tip.category}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{tip.points}/{tip.maxPoints} pts</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${barColors[tip.type]} transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[10px] text-slate-500">{tip.message}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. PAINEL DE CANDIDATOS (REDESIGNED - com Top Pick e cards)
// ═══════════════════════════════════════════════════════════════════════════════

function classifColor(c: string) {
  if (c === 'ALTA') return { badge: 'text-emerald-400 border-emerald-800 bg-emerald-950/50', bar: 'bg-emerald-500', glow: 'shadow-emerald-500/20' };
  if (c === 'MEDIA') return { badge: 'text-amber-400 border-amber-800 bg-amber-950/50', bar: 'bg-amber-500', glow: 'shadow-amber-500/20' };
  return { badge: 'text-red-400 border-red-800 bg-red-950/50', bar: 'bg-red-500', glow: 'shadow-red-500/20' };
}

interface CandidatesPanelProps {
  results: EnrichedMatchingResult[];
  jobTitle: string;
  onSelectForComparison: (r: EnrichedMatchingResult) => void;
  selectedForComparison: string[];
}

export function CandidatesPanel({ results, jobTitle, onSelectForComparison, selectedForComparison }: CandidatesPanelProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'ALTA' | 'MEDIA' | 'BAIXA'>('ALL');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [candidateStatus, setCandidateStatus] = useState<Record<string, 'Novo' | 'Em Análise' | 'Entrevistado' | 'Aprovado' | 'Recusado'>>({});
  
  // Modais interativos
  const [messageModalCandidate, setMessageModalCandidate] = useState<EnrichedMatchingResult | null>(null);
  const [messageText, setMessageText] = useState('');
  const [messageSentSuccess, setMessageSentSuccess] = useState(false);

  const [scheduleModalCandidate, setScheduleModalCandidate] = useState<EnrichedMatchingResult | null>(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('14:00');
  const [interviewType, setInterviewType] = useState('Entrevista Online (Google Meet)');
  const [scheduleSentSuccess, setScheduleSentSuccess] = useState(false);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showInternalToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleStatusChange = (candidateId: string, status: 'Novo' | 'Em Análise' | 'Entrevistado' | 'Aprovado' | 'Recusado') => {
    setCandidateStatus((prev) => ({ ...prev, [candidateId]: status }));
    showInternalToast(`Status do candidato atualizado para "${status}"`);
  };

  const handleSendMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessageSentSuccess(true);
    setTimeout(() => {
      setMessageSentSuccess(false);
      setMessageModalCandidate(null);
      setMessageText('');
      showInternalToast('Mensagem enviada com sucesso para o candidato!');
    }, 1200);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScheduleSentSuccess(true);
    setTimeout(() => {
      setScheduleSentSuccess(false);
      setScheduleModalCandidate(null);
      showInternalToast('Entrevista agendada e convite enviado!');
    }, 1200);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Nome', 'Nivel', 'ExpAnos', 'Score', 'Classificacao', 'Status'];
    const rows = results.map(r => [
      r.candidateId,
      `"${r.candidate?.name || r.candidateName || 'Candidato'}"`,
      `"${r.candidate?.level || ''}"`,
      r.candidate?.experienceYears ?? 0,
      r.score,
      r.classification,
      candidateStatus[r.candidateId] || 'Novo'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `candidatos_${jobTitle.toLowerCase().replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showInternalToast('Relatorio em CSV exportado com sucesso!');
  };

  const filtered = results.filter((r) => {
    const matchFilter = filter === 'ALL' || r.classification === filter;
    const name = r.candidate?.name || r.candidateName || '';
    const matchSearch = name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const topPick = results.length > 0 ? results.reduce((best, r) => r.score > best.score ? r : best, results[0]) : null;

  // Score distribution mini chart
  const scoreDistribution = useMemo(() => {
    const buckets = [0, 0, 0, 0, 0]; // 0-20, 20-40, 40-60, 60-80, 80-100
    results.forEach(r => {
      const idx = Math.min(Math.floor(r.score / 20), 4);
      buckets[idx]++;
    });
    const max = Math.max(...buckets, 1);
    return buckets.map(b => (b / max) * 100);
  }, [results]);

  return (
    <div className="space-y-4">
      {/* Internal Notification Toast */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-blue-500 text-slate-100 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
          <p className="text-xs font-semibold">{toastMsg}</p>
        </div>
      )}

      {/* Top Pick Hero */}
      {topPick && topPick.score >= 70 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 via-yellow-950/20 to-amber-950/30 border border-amber-700/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
              <Crown className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Top Pick - Melhor Match</p>
              <p className="text-sm font-black text-slate-100">{topPick.candidate?.name || topPick.candidateName || 'Candidato'}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-amber-400">{topPick.score}%</p>
              <p className="text-[10px] text-amber-500/70">compatibilidade</p>
            </div>
          </div>
        </div>
      )}

      {/* Score Distribution */}
      {results.length > 0 && (
        <div className="flex items-end gap-1 h-8 px-2">
          {scoreDistribution.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <div
                className="w-full rounded-t-sm bg-gradient-to-t from-blue-600/60 to-blue-400/40 transition-all duration-500"
                style={{ height: `${Math.max(h, 4)}%` }}
              />
              <span className="text-[8px] text-slate-600">{i * 20}-{(i + 1) * 20}</span>
            </div>
          ))}
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Buscar candidato por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none transition-all"
        />
        <div className="flex gap-1 flex-wrap">
          {(['ALL', 'ALTA', 'MEDIA', 'BAIXA'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                filter === f
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {f === 'ALL' ? 'Todos' : f === 'ALTA' ? 'Alta' : f === 'MEDIA' ? 'Média' : 'Baixa'}
            </button>
          ))}
          <button
            onClick={() => setViewMode(v => v === 'list' ? 'cards' : 'list')}
            className="px-2.5 py-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all text-xs font-semibold"
            title={viewMode === 'list' ? 'Ver em cards' : 'Ver em lista'}
          >
            {viewMode === 'list' ? <Filter className="w-3.5 h-3.5 inline mr-1" /> : <BarChart3 className="w-3.5 h-3.5 inline mr-1" />}
            {viewMode === 'list' ? 'Cards' : 'Lista'}
          </button>
          <button
            onClick={handleExportCSV}
            className="px-2.5 py-1.5 rounded-lg border border-slate-800 text-emerald-400 hover:bg-emerald-950/30 hover:border-emerald-700/50 transition-all text-xs font-semibold flex items-center gap-1"
            title="Exportar dados dos candidatos em CSV"
          >
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500">
        <span>
          Mostrando <strong className="text-slate-300">{filtered.length}</strong> de{' '}
          <strong className="text-slate-300">{results.length}</strong> candidatos para{' '}
          <strong className="text-blue-400">{jobTitle}</strong>
        </span>
      </div>

      {selectedForComparison.length > 0 && (
        <div className="flex items-center justify-between px-3 py-2 bg-blue-950/30 border border-blue-800/40 rounded-xl text-xs text-blue-300">
          <span className="flex items-center gap-2">
            <GitCompare className="w-3.5 h-3.5 shrink-0" />
            {selectedForComparison.length === 1
              ? 'Selecione mais 1 candidato para comparar'
              : '2 candidatos selecionados para comparação'}
          </span>
          {selectedForComparison.length === 2 && (
            <span className="font-bold text-blue-400 underline cursor-pointer">Pronto para comparar!</span>
          )}
        </div>
      )}

      {/* Candidate List / Cards */}
      <div className={viewMode === 'cards' ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'space-y-2'}>
        {filtered.length === 0 && (
          <div className="text-center py-8 text-slate-500 col-span-2">
            <Users className="w-8 h-8 mx-auto mb-2 text-slate-700" />
            <p className="text-xs">Nenhum candidato corresponde aos filtros selecionados.</p>
          </div>
        )}
        {filtered.map((result) => {
          const name = result.candidate?.name || result.candidateName || 'Candidato';
          const colors = classifColor(result.classification);
          const isExpanded = expanded === result.candidateId;
          const isSelected = selectedForComparison.includes(result.candidateId);
          const isTopPick = topPick?.candidateId === result.candidateId && result.score >= 70;
          const rank = results.indexOf(result) + 1;
          const currentStatus = candidateStatus[result.candidateId] || 'Novo';

          const statusColors: Record<string, string> = {
            Novo: 'bg-blue-950/60 text-blue-400 border-blue-800/60',
            'Em Análise': 'bg-amber-950/60 text-amber-400 border-amber-800/60',
            Entrevistado: 'bg-purple-950/60 text-purple-400 border-purple-800/60',
            Aprovado: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60',
            Recusado: 'bg-red-950/60 text-red-400 border-red-800/60',
          };

          if (viewMode === 'cards') {
            return (
              <div
                key={result.candidateId}
                className={`p-4 rounded-2xl border transition-all duration-300 bg-slate-950/60 hover:bg-slate-900/60 ${
                  isTopPick ? 'border-amber-600/50 shadow-lg shadow-amber-500/10' : 'border-slate-800 hover:border-slate-700'
                } ${isSelected ? 'ring-2 ring-blue-600/50' : ''}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black border ${colors.badge}`}>
                    {name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-100 truncate flex items-center gap-1.5">
                      {name}
                      {isTopPick && <Crown className="w-3 h-3 text-amber-400" />}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-slate-500">{result.candidate?.level || '--'}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${statusColors[currentStatus]}`}>
                        {currentStatus}
                      </span>
                    </div>
                  </div>
                  <span className={`text-lg font-black ${colors.badge.split(' ')[0]}`}>{result.score}%</span>
                </div>
                <div className="h-1.5 bg-slate-800/80 rounded-full overflow-hidden mb-3">
                  <div className={`h-full rounded-full ${colors.bar} transition-all duration-700`} style={{ width: `${result.score}%` }} />
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => onSelectForComparison(result)} className={`flex-1 py-1.5 rounded-lg border text-[11px] font-bold transition-all ${isSelected ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-700 text-slate-400 hover:border-blue-600 hover:text-blue-400'}`}>
                    <GitCompare className="w-3 h-3 inline mr-1" />Comparar
                  </button>
                  <button onClick={() => setExpanded(isExpanded ? null : result.candidateId)} className="py-1.5 px-2.5 rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200 transition-all text-xs font-semibold">
                    <Eye className="w-3.5 h-3.5 inline mr-1" />
                    {isExpanded ? 'Ocultar' : 'Ver'}
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={result.candidateId}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isExpanded ? 'border-blue-700/60 shadow-lg shadow-blue-950/30' : isTopPick ? 'border-amber-700/40 shadow-md shadow-amber-950/20' : 'border-slate-800 hover:border-slate-700'
              } ${isSelected ? 'ring-2 ring-blue-600/50' : ''}`}
            >
              <div className="flex items-center gap-3 p-3.5 bg-slate-950/60">
                <span className="text-[11px] font-black text-slate-600 w-5 text-center shrink-0">
                  {rank === 1 && result.score >= 70 ? <Trophy className="w-3.5 h-3.5 text-amber-400 mx-auto" /> : rank}
                </span>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black shrink-0 border ${colors.badge}`}>
                  {name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-100 truncate flex items-center gap-1.5">
                      {name}
                      {isTopPick && <Flame className="w-3 h-3 text-amber-400" />}
                    </p>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${statusColors[currentStatus]}`}>
                      {currentStatus}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {result.candidate?.level || '--'}
                    {result.candidate?.experienceYears !== undefined ? ` • ${result.candidate.experienceYears} ano(s) exp.` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="hidden sm:flex flex-col gap-1 w-20">
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${colors.bar} transition-all duration-700`} style={{ width: `${result.score}%` }} />
                    </div>
                    <span className={`text-[10px] font-bold ${colors.badge.split(' ')[0]}`}>{result.score}%</span>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${colors.badge} hidden sm:inline`}>
                    {result.classification === 'ALTA' ? 'Alta' : result.classification === 'MEDIA' ? 'Média' : 'Baixa'}
                  </span>
                  <button onClick={() => onSelectForComparison(result)} title={isSelected ? 'Remover da comparação' : 'Adicionar à comparação'} className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all text-xs ${isSelected ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-700 text-slate-500 hover:border-blue-600 hover:text-blue-400'}`}>
                    <GitCompare className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setExpanded(isExpanded ? null : result.candidateId)} className="w-7 h-7 rounded-lg border border-slate-700 text-slate-500 hover:text-slate-200 hover:border-slate-600 flex items-center justify-center transition-colors">
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Expanded profile */}
              {isExpanded && (
                <div className="border-t border-slate-800 bg-slate-900/40 p-4 space-y-4">
                  {/* Pipeline Status Selector */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-blue-400" />
                      Status no Funil:
                    </span>
                    <div className="flex items-center gap-1 flex-wrap">
                      {(['Novo', 'Em Análise', 'Entrevistado', 'Aprovado', 'Recusado'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(result.candidateId, st)}
                          className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all ${
                            currentStatus === st
                              ? 'bg-blue-600 text-white border-blue-500 shadow-xs'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {result.calculationBreakdown && result.calculationBreakdown.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Skills Avaliadas</p>
                        <div className="space-y-1.5">
                          {result.calculationBreakdown.map((b) => (
                            <div key={b.skillName} className="flex items-center justify-between text-xs">
                              <span className="flex items-center gap-1.5">
                                {b.status === 'Encontrado' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <X className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                                <span className={b.status === 'Encontrado' ? 'text-slate-200' : 'text-slate-500'}>{b.skillName}</span>
                              </span>
                              <span className={`font-bold text-[10px] ${b.status === 'Encontrado' ? 'text-emerald-400' : 'text-slate-600'}`}>
                                {b.pointsAwarded > 0 ? `+${b.pointsAwarded}%` : `0% / ${b.weight}%`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="space-y-3">
                      {result.experienceComparison && (
                        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Experiência</p>
                          <div className="flex items-center gap-2">
                            <span className={`text-xl font-black ${result.experienceComparison.meetsRequirement ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {result.experienceComparison.candidateYears}
                            </span>
                            <span className="text-[11px] text-slate-500">anos <ArrowRight className="w-3 h-3 inline" /> req. {result.experienceComparison.requiredYears} ano(s)</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1">{result.experienceComparison.note}</p>
                        </div>
                      )}
                      {result.levelComparison && (
                        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nível Profissional</p>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-black ${result.levelComparison.meetsRequirement ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {result.levelComparison.candidateLevel}
                            </span>
                            <span className="text-[10px] text-slate-500"><ArrowRight className="w-3 h-3 inline" /> req. {result.levelComparison.requiredLevel}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1">{result.levelComparison.note}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {result.candidate?.technicalSkills && result.candidate.technicalSkills.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Skills do Candidato</p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.candidate.technicalSkills.map((sk) => (
                          <span key={sk} className="text-[11px] px-2 py-0.5 rounded-md border border-slate-700 bg-slate-900 text-slate-300 font-medium">{sk}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.candidate?.bio && (
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Bio / Resumo</p>
                      <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">{result.candidate.bio}</p>
                    </div>
                  )}
                  {/* Quick Actions */}
                  <div className="flex gap-2 pt-2 border-t border-slate-800/60">
                    <button
                      onClick={() => setMessageModalCandidate(result)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600/10 border border-blue-600/30 text-blue-400 text-[11px] font-bold hover:bg-blue-600/20 transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Enviar Mensagem
                    </button>
                    <button
                      onClick={() => setScheduleModalCandidate(result)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/10 border border-emerald-600/30 text-emerald-400 text-[11px] font-bold hover:bg-emerald-600/20 transition-all cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" /> Agendar Entrevista
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Modal Enviar Mensagem ── */}
      {messageModalCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                Mensagem para {messageModalCandidate.candidate?.name || messageModalCandidate.candidateName}
              </h4>
              <button onClick={() => setMessageModalCandidate(null)} className="text-slate-400 hover:text-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            {messageSentSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <p className="font-bold text-slate-100 text-sm">Mensagem enviada com sucesso!</p>
              </div>
            ) : (
              <form onSubmit={handleSendMessageSubmit} className="space-y-4 text-xs">
                <div>
                  <p className="text-slate-400 mb-2">Selecione um modelo rápido ou digite sua mensagem:</p>
                  <div className="flex gap-1.5 flex-wrap mb-3">
                    {[
                      'Olá! Gostamos do seu perfil para a vaga.',
                      'Gostaríamos de solicitar mais detalhes da sua experiência.',
                      'Você teria disponibilidade para um bate-papo esta semana?',
                    ].map((template) => (
                      <button
                        key={template}
                        type="button"
                        onClick={() => setMessageText(template)}
                        className="text-[10px] px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:border-blue-500/50"
                      >
                        {template.slice(0, 30)}...
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={4}
                    required
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Escreva sua mensagem diretamente ao candidato..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <Button type="button" variant="outline" size="sm" onClick={() => setMessageModalCandidate(null)}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" size="sm" icon={<Send className="w-3.5 h-3.5" />}>
                    Enviar Mensagem
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Modal Agendar Entrevista ── */}
      {scheduleModalCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                Agendar Entrevista — {scheduleModalCandidate.candidate?.name || scheduleModalCandidate.candidateName}
              </h4>
              <button onClick={() => setScheduleModalCandidate(null)} className="text-slate-400 hover:text-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            {scheduleSentSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <p className="font-bold text-slate-100 text-sm">Entrevista agendada com sucesso!</p>
              </div>
            ) : (
              <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">Data da Entrevista</label>
                  <input
                    type="date"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">Horário</label>
                  <input
                    type="time"
                    required
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">Formato / Link</label>
                  <select
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Entrevista Online (Google Meet)">Entrevista Online (Google Meet)</option>
                    <option value="Entrevista Online (Microsoft Teams)">Entrevista Online (Microsoft Teams)</option>
                    <option value="Presencial na Empresa">Presencial na Empresa</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <Button type="button" variant="outline" size="sm" onClick={() => setScheduleModalCandidate(null)}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" size="sm" icon={<Calendar className="w-3.5 h-3.5" />}>
                    Confirmar Agendamento
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. COMPARACAO LADO A LADO (REDESIGNED)
// ═══════════════════════════════════════════════════════════════════════════════

interface ComparisonModalProps {
  candidates: [EnrichedMatchingResult, EnrichedMatchingResult];
  jobSkills: Array<{ name: string; weight: number }>;
  onClose: () => void;
}

export function ComparisonModal({ candidates, jobSkills, onClose }: ComparisonModalProps) {
  const [a, b] = candidates;

  function winnerOf(field: 'score' | 'experience') {
    if (field === 'score') {
      if (a.score > b.score) return 0;
      if (b.score > a.score) return 1;
      return -1;
    }
    const aExp = a.experienceComparison?.candidateYears ?? 0;
    const bExp = b.experienceComparison?.candidateYears ?? 0;
    if (aExp > bExp) return 0;
    if (bExp > aExp) return 1;
    return -1;
  }

  const skillRows = jobSkills.map((skill) => {
    const aHas = a.calculationBreakdown?.some((bd) => bd.skillName === skill.name && bd.status === 'Encontrado');
    const bHas = b.calculationBreakdown?.some((bd) => bd.skillName === skill.name && bd.status === 'Encontrado');
    return { name: skill.name, weight: skill.weight, aHas, bHas };
  });

  const aName = a.candidate?.name || a.candidateName || 'Candidato A';
  const bName = b.candidate?.name || b.candidateName || 'Candidato B';
  const winner = winnerOf('score');

  // Score rings
  const r = 30;
  const circ = 2 * Math.PI * r;

  return (
    <div className="fixed inset-0 bg-slate-950/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-800 sticky top-0 bg-slate-900 z-10 rounded-t-3xl">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-slate-100">Comparacao de Candidatos</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Candidate headers with score rings */}
          <div className="grid grid-cols-2 gap-4">
            {[a, b].map((cand, i) => {
              const name = cand.candidate?.name || cand.candidateName || `Candidato ${i === 0 ? 'A' : 'B'}`;
              const colors = classifColor(cand.classification);
              const isWinner = winner === i;
              const dash = (cand.score / 100) * circ;
              const ringCol = cand.classification === 'ALTA' ? '#10b981' : cand.classification === 'MEDIA' ? '#f59e0b' : '#ef4444';

              return (
                <div key={i} className={`text-center p-5 rounded-2xl border relative overflow-hidden ${isWinner ? 'border-emerald-700/60 bg-emerald-950/10' : 'border-slate-800 bg-slate-950/40'}`}>
                  {isWinner && <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />}
                  <div className="relative inline-block mb-3">
                    <svg width="76" height="76" viewBox="0 0 76 76">
                      <circle cx="38" cy="38" r={r} fill="none" stroke="#1e293b" strokeWidth="4" />
                      <circle cx="38" cy="38" r={r} fill="none" stroke={ringCol} strokeWidth="4" strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform="rotate(-90 38 38)" style={{ transition: 'stroke-dasharray 0.8s ease' }} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-lg font-black ${colors.badge.split(' ')[0]}`}>{cand.score}%</span>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-slate-100 truncate">{name}</p>
                  <p className="text-[11px] text-slate-400">{cand.candidate?.level || '--'}</p>
                  {isWinner && (
                    <div className="mt-2 flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-400">
                      <Award className="w-3.5 h-3.5" /> Melhor match
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Comparison rows */}
          <CompareRow label="Score de Compatibilidade" aValue={`${a.score}%`} bValue={`${b.score}%`} winner={winner} highlight />
          <CompareRow label="Classificacao" aValue={a.classification} bValue={b.classification} winner={-1} />
          <CompareRow label="Anos de Experiencia" aValue={`${a.experienceComparison?.candidateYears ?? '?'} anos`} bValue={`${b.experienceComparison?.candidateYears ?? '?'} anos`} winner={winnerOf('experience')} />
          <CompareRow label="Nivel Profissional" aValue={a.levelComparison?.candidateLevel || a.candidate?.level || '--'} bValue={b.levelComparison?.candidateLevel || b.candidate?.level || '--'} winner={-1} />

          {/* Skills comparison */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Skills da Vaga</p>
            <div className="space-y-2">
              {skillRows.map((row) => (
                <div key={row.name} className="grid grid-cols-3 gap-4 items-center">
                  <span className="text-xs text-slate-300 font-medium truncate">
                    {row.name} <span className="text-[10px] text-slate-600 ml-1">({row.weight}%)</span>
                  </span>
                  {[row.aHas, row.bHas].map((has, i) => (
                    <div key={i} className="flex justify-center">
                      {has ? (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Sim
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] text-slate-600">
                          <X className="w-3.5 h-3.5" /> Nao
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          {winner >= 0 && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 to-blue-950/20 border border-emerald-800/40">
              <p className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Recomendacao IA
              </p>
              <p className="text-xs text-slate-300">
                Com base na analise de skills, experiencia e nivel, <strong className="text-emerald-300">{winner === 0 ? aName : bName}</strong> apresenta o melhor alinhamento com os requisitos da vaga, com uma vantagem de <strong className="text-emerald-300">{Math.abs(a.score - b.score)}%</strong> no score geral.
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <Button variant="outline" size="sm" onClick={onClose}>Fechar Comparacao</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompareRow({ label, aValue, bValue, winner, highlight }: { label: string; aValue: string; bValue: string; winner: number; highlight?: boolean }) {
  return (
    <div className={`grid grid-cols-3 gap-4 items-center py-3 border-b border-slate-800/60 ${highlight ? 'bg-slate-800/20 rounded-lg px-2' : ''}`}>
      <span className="text-xs text-slate-400 font-medium">{label}</span>
      <div className={`text-center text-xs font-bold rounded-lg py-1.5 ${winner === 0 ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/50' : 'text-slate-300'}`}>{aValue}</div>
      <div className={`text-center text-xs font-bold rounded-lg py-1.5 ${winner === 1 ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/50' : 'text-slate-300'}`}>{bValue}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. MARKET INSIGHTS (REDESIGNED - with glassmorphism)
// ═══════════════════════════════════════════════════════════════════════════════

export function MarketInsightsWidget({ job, candidatesCount }: { job: JobForHealth; candidatesCount: number }) {
  const timeToHire = candidatesCount > 10 ? '1-2 semanas' : '3-4 semanas';
  const hotSkills = ['React', 'Node.js', 'Python', 'AWS', 'TypeScript', 'Go', 'Kubernetes'];
  const demandScore = job.skills.some((s) => hotSkills.includes(s.name)) ? 'Alta' : 'Media';
  const competition = demandScore === 'Alta' ? 'Muitas empresas contratando' : 'Competicao equilibrada';
  const confidence = candidatesCount > 5 ? 85 : candidatesCount > 0 ? 60 : 30;

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-950/40 via-slate-900/80 to-purple-950/20 border border-slate-800/60 shadow-2xl relative overflow-hidden group">
      {/* Decorative orbs */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors duration-700" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/8 transition-colors duration-700" />

      <div className="relative z-10 space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Market Insights IA
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-800/40">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-bold">{confidence}% confianca</span>
            </div>
            <Badge variant="info">Beta</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/60 backdrop-blur-sm hover:border-slate-700 hover:bg-slate-900/50 transition-all duration-300 group/card">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Tempo Estimado
            </p>
            <p className="text-xl font-black text-slate-100 group-hover/card:text-blue-300 transition-colors">{timeToHire}</p>
            <p className="text-[10px] text-emerald-400 mt-1.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Mais rapido que a media
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/60 backdrop-blur-sm hover:border-slate-700 hover:bg-slate-900/50 transition-all duration-300 group/card">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Demanda das Skills
            </p>
            <p className="text-xl font-black text-slate-100 group-hover/card:text-amber-300 transition-colors">{demandScore}</p>
            <p className="text-[10px] text-amber-400 mt-1.5 flex items-center gap-1">
              <Users className="w-3 h-3" /> {competition}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/60 backdrop-blur-sm hover:border-slate-700 hover:bg-slate-900/50 transition-all duration-300 group/card">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> Atratividade
            </p>
            <p className="text-xl font-black text-slate-100 group-hover/card:text-emerald-300 transition-colors">Competitiva</p>
            <p className="text-[10px] text-slate-400 mt-1.5">Baseado na faixa salarial</p>
          </div>
        </div>

        {/* Mini trend */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/40">
          <ArrowUpRight className="w-4 h-4 text-emerald-400 shrink-0" />
          <p className="text-[11px] text-slate-400">
            <strong className="text-slate-200">Tendencia:</strong> A demanda por profissionais com este perfil cresceu <strong className="text-emerald-400">23%</strong> nos ultimos 3 meses na regiao.
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. FUNIL DE CONTRATACAO (NOVO)
// ═══════════════════════════════════════════════════════════════════════════════

interface HiringFunnelProps {
  totalCandidates: number;
  highMatches: number;
  inReview: number;
  approved: number;
}

export function HiringFunnel({ totalCandidates, highMatches, inReview, approved }: HiringFunnelProps) {
  const steps = [
    { label: 'Total Candidatos', value: totalCandidates, color: 'from-blue-600 to-blue-400', textColor: 'text-blue-400' },
    { label: 'Compativeis', value: highMatches, color: 'from-purple-600 to-purple-400', textColor: 'text-purple-400' },
    { label: 'Em Revisao', value: inReview, color: 'from-amber-600 to-amber-400', textColor: 'text-amber-400' },
    { label: 'Aprovados', value: approved, color: 'from-emerald-600 to-emerald-400', textColor: 'text-emerald-400' },
  ];

  const maxVal = Math.max(totalCandidates, 1);

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800/80 backdrop-blur-sm space-y-4 relative overflow-hidden">
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-purple-500/5 rounded-full blur-3xl" />
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 relative z-10">
        <Filter className="w-3.5 h-3.5 text-purple-400" />
        Funil de Contratacao
      </p>
      <div className="space-y-3 relative z-10">
        {steps.map((step, i) => {
          const widthPct = maxVal > 0 ? Math.max((step.value / maxVal) * 100, 8) : 8;
          return (
            <div key={step.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">{step.label}</span>
                <span className={`font-black ${step.textColor}`}>{step.value}</span>
              </div>
              <div className="h-6 bg-slate-800/50 rounded-lg overflow-hidden relative">
                <div
                  className={`h-full rounded-lg bg-gradient-to-r ${step.color} transition-all duration-700 flex items-center justify-end pr-2`}
                  style={{ width: `${widthPct}%` }}
                >
                  {step.value > 0 && (
                    <span className="text-[9px] font-bold text-white/80">{Math.round((step.value / maxVal) * 100)}%</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Conversion rate */}
      {totalCandidates > 0 && (
        <div className="pt-3 border-t border-slate-800/60 relative z-10">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Taxa de conversao</span>
            <span className="font-bold text-emerald-400">
              {Math.round((highMatches / totalCandidates) * 100)}% compativeis
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 8. FEED DE ATIVIDADES (NOVO)
// ═══════════════════════════════════════════════════════════════════════════════

interface ActivityItem {
  id: string;
  type: 'candidate_applied' | 'review_completed' | 'score_updated' | 'job_approved';
  message: string;
  timestamp: string;
}

interface ActivityFeedProps {
  jobTitle: string;
  candidatesCount: number;
  highMatches: number;
  requiresReview: number;
}

export function ActivityFeed({ jobTitle, candidatesCount, highMatches, requiresReview }: ActivityFeedProps) {
  // Generate mock activities based on real data
  const activities: ActivityItem[] = useMemo(() => {
    const items: ActivityItem[] = [];
    if (candidatesCount > 0) {
      items.push({
        id: '1',
        type: 'candidate_applied',
        message: `${candidatesCount} candidato(s) analisados para "${jobTitle}"`,
        timestamp: 'Agora',
      });
    }
    if (highMatches > 0) {
      items.push({
        id: '2',
        type: 'score_updated',
        message: `${highMatches} candidato(s) com alta compatibilidade identificados`,
        timestamp: 'Recente',
      });
    }
    if (requiresReview > 0) {
      items.push({
        id: '3',
        type: 'review_completed',
        message: `${requiresReview} candidato(s) aguardando revisao humana`,
        timestamp: 'Pendente',
      });
    }
    items.push({
      id: '4',
      type: 'job_approved',
      message: `Vaga "${jobTitle}" esta ativa no sistema de matching`,
      timestamp: 'Ativo',
    });
    return items;
  }, [jobTitle, candidatesCount, highMatches, requiresReview]);

  const iconMap: Record<ActivityItem['type'], { icon: React.ReactNode; color: string }> = {
    candidate_applied: { icon: <Users className="w-3.5 h-3.5" />, color: 'text-blue-400 bg-blue-950/50 border-blue-800/40' },
    review_completed: { icon: <Eye className="w-3.5 h-3.5" />, color: 'text-amber-400 bg-amber-950/50 border-amber-800/40' },
    score_updated: { icon: <TrendingUp className="w-3.5 h-3.5" />, color: 'text-emerald-400 bg-emerald-950/50 border-emerald-800/40' },
    job_approved: { icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: 'text-purple-400 bg-purple-950/50 border-purple-800/40' },
  };

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800/80 backdrop-blur-sm space-y-3 relative overflow-hidden">
      <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-500/5 rounded-full blur-3xl" />
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 relative z-10">
        <Activity className="w-3.5 h-3.5 text-blue-400" />
        Atividade Recente
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      </p>
      <div className="space-y-2 relative z-10">
        {activities.map((item) => {
          const { icon, color } = iconMap[item.type];
          return (
            <div key={item.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-800/30 transition-colors">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 ${color}`}>
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-slate-300 leading-relaxed">{item.message}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">{item.timestamp}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
