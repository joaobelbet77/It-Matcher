'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { useAuth } from '@/components/auth/AuthContext';
import { useToast } from '@/components/layout/Toast';
import { SkillWeightConfigurator, ConfiguredSkill } from '@/components/jobs/SkillWeightConfigurator';
import {
  ProfessionalLevels,
  COMPANY_TYPES,
  COMPANY_INDUSTRIES,
  COMPANY_SIZES,
  WORK_MODELS,
  CONTRACT_TYPES,
} from '@/lib/validation';
import { JobArea, ProfessionalLevel, Job } from '@/types';
import {
  Building2,
  Briefcase,
  Plus,
  CheckCircle2,
  Mail,
  Phone,
  Globe,
  MapPin,
  FileText,
  LogOut,
  Pencil,
  Users,
  BarChart3,
  Star,
  TrendingUp,
  X,
  Save,
  ClipboardList,
  AlertCircle,
  ShieldCheck,
  Clock,
  GitCompare,
  Sparkles,
  Layers,
  ArrowUpRight,
  Award,
  Download,
  Share2,
  Filter,
} from 'lucide-react';
import {
  VagaTimeline,
  SkillsRadarChart,
  JobHealthScore,
  CandidatesPanel,
  ComparisonModal,
  EnrichedMatchingResult,
  MarketInsightsWidget,
  HiringFunnel,
  ActivityFeed,
} from '@/components/empresa/EmpresaDiferenciais';

// ─── Tipos locais ────────────────────────────────────────────────────────────

type TabId = 'visao-geral' | 'minha-vaga' | 'candidatos' | 'editar';
type AdminTabId = 'empresas' | 'cadastrar';

interface EmpresaStats {
  candidatesTotal: number;
  highMatches: number;
  mediumMatches: number;
  lowMatches: number;
  requiresReview: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function ScoreBadge({ score, classification }: { score: number; classification: string }) {
  const colorMap: Record<string, string> = {
    ALTA: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60',
    MEDIA: 'bg-amber-950/60 text-amber-400 border-amber-800/60',
    BAIXA: 'bg-red-950/60 text-red-400 border-red-800/60',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${colorMap[classification] || 'bg-slate-800 text-slate-300 border-slate-700'}`}
    >
      <Star className="w-3 h-3" />
      {score}%
    </span>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className={`p-4 rounded-xl border bg-slate-950/60 space-y-2 ${color}`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
        <div className="text-slate-400">{icon}</div>
      </div>
      <p className="text-2xl font-black text-slate-100">{value}</p>
    </div>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function EmpresaPage() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const isCompany =
    user?.tipoUsuario === 'empresa' || user?.role === 'COMPANY' || user?.role === 'Empresa';

  // ── Estado global ──
  const [loading, setLoading] = useState(true);
  const [companyJob, setCompanyJob] = useState<Job | null>(null);
  const [allCompanies, setAllCompanies] = useState<any[]>([]);

  // ── Tabs ──
  const [activeTab, setActiveTab] = useState<TabId>('visao-geral');
  const [adminTab, setAdminTab] = useState<AdminTabId>('empresas');

  // ── Matching / candidatos ──
  const [matchingResults, setMatchingResults] = useState<EnrichedMatchingResult[]>([]);
  const [stats, setStats] = useState<EmpresaStats | null>(null);
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  // ── Comparação de candidatos ──
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);


  // ── Modal de cadastro de empresa (admin) ──
  const [showCompanyRegisterModal, setShowCompanyRegisterModal] = useState(false);
  const [newCompName, setNewCompName] = useState('');
  const [newCompCnpj, setNewCompCnpj] = useState('');
  const [newCompEmail, setNewCompEmail] = useState('');
  const [newCompPhone, setNewCompPhone] = useState('');
  const [newCompContact, setNewCompContact] = useState('');
  const [newCompType, setNewCompType] = useState('Empresa de Tecnologia');
  const [newCompIndustry, setNewCompIndustry] = useState('Desenvolvimento de Software');
  const [newCompSize, setNewCompSize] = useState('51–200 funcionários');
  const [newCompCity, setNewCompCity] = useState('São Paulo');
  const [newCompState, setNewCompState] = useState('SP');
  const [newCompCountry, setNewCompCountry] = useState('Brasil');
  const [newCompWebsite, setNewCompWebsite] = useState('');
  const [newCompDescription, setNewCompDescription] = useState('');
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccessInfo, setRegSuccessInfo] = useState<any | null>(null);
  const [isRegisteringComp, setIsRegisteringComp] = useState(false);

  // ── Modal de cadastro de vaga ──
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobArea, setJobArea] = useState<JobArea>('Full Stack');
  const [jobLevel, setJobLevel] = useState<ProfessionalLevel>('Pleno');
  const [jobMinYears, setJobMinYears] = useState<number>(3);
  const [jobWorkModel, setJobWorkModel] = useState('Híbrido');
  const [jobContractType, setJobContractType] = useState('CLT');
  const [jobLocation, setJobLocation] = useState('');
  const [jobSalaryMin, setJobSalaryMin] = useState('');
  const [jobSalaryMax, setJobSalaryMax] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobMandatory, setJobMandatory] = useState('');
  const [jobDesirable, setJobDesirable] = useState('');
  const [jobBenefits, setJobBenefits] = useState('');
  const [jobSkills, setJobSkills] = useState<ConfiguredSkill[]>([
    { name: 'JavaScript', weight: 30, required: true },
    { name: 'React', weight: 25, required: true },
    { name: 'TypeScript', weight: 20, required: true },
    { name: 'Git', weight: 10, required: false },
    { name: 'Docker', weight: 15, required: false },
  ]);
  const [jobError, setJobError] = useState<string | null>(null);
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);

  // ── Editar dados da empresa ──
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editWebsite, setEditWebsite] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editState, setEditState] = useState('');
  const [editCountry, setEditCountry] = useState('');
  const [editType, setEditType] = useState('');
  const [editIndustry, setEditIndustry] = useState('');
  const [editSize, setEditSize] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // ─── Derivados ───────────────────────────────────────────────────────────

  const companyName = user?.companyData?.name || user?.company || user?.name || 'Tech Solutions';
  const companyEmail = user?.companyData?.email || user?.email || 'empresa@techsolutions.com.br';
  const companyCnpj = user?.companyData?.cnpj || '00.000.000/0001-00';
  const companyType = user?.companyData?.companyType || 'Empresa de Tecnologia';
  const companyIndustry = user?.companyData?.companyIndustry || 'Desenvolvimento de Software';
  const companySize = user?.companyData?.companySize || '51–200 funcionários';
  const companyCity = user?.companyData?.city || 'São Paulo';
  const companyState = user?.companyData?.state || 'SP';
  const companyWebsite = user?.companyData?.website || '';
  const companyDescription = user?.companyData?.description || '';

  // ─── Carregar dados ──────────────────────────────────────────────────────

  const fetchEmpresaData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/empresa');
      const data = await res.json();
      if (data.success) {
        setCompanyJob(data.data.job || null);
        if (data.data.allCompanies) {
          setAllCompanies(data.data.allCompanies);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchMatchingForJob = useCallback(async (jobId: string) => {
    setLoadingCandidates(true);
    try {
      const res = await fetch(`/api/matching/${jobId}`);
      const data = await res.json();
      if (data.success) {
        setMatchingResults(data.results || []);
        setStats({
          candidatesTotal: data.stats?.total ?? 0,
          highMatches: data.stats?.high ?? 0,
          mediumMatches: data.stats?.medium ?? 0,
          lowMatches: data.stats?.low ?? 0,
          requiresReview: data.stats?.requiresReviewCount ?? 0,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCandidates(false);
    }
  }, []);

  useEffect(() => {
    fetchEmpresaData();
  }, [fetchEmpresaData]);

  useEffect(() => {
    if (isCompany && companyJob?.id) {
      fetchMatchingForJob(companyJob.id);
    }
  }, [isCompany, companyJob?.id, fetchMatchingForJob]);

  // Preenche campos de edição quando usuário carrega
  useEffect(() => {
    if (user?.companyData) {
      setEditName(user.companyData.name || '');
      setEditPhone(user.companyData.phone || '');
      setEditWebsite(user.companyData.website || '');
      setEditDescription(user.companyData.description || '');
      setEditCity(user.companyData.city || '');
      setEditState(user.companyData.state || '');
      setEditCountry(user.companyData.country || 'Brasil');
      setEditType(user.companyData.companyType || 'Empresa de Tecnologia');
      setEditIndustry(user.companyData.companyIndustry || 'Desenvolvimento de Software');
      setEditSize(user.companyData.companySize || '51–200 funcionários');
    }
  }, [user]);

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleRegisterCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccessInfo(null);
    if (!newCompEmail.trim()) {
      setRegError('O e-mail da empresa é OBRIGATÓRIO.');
      return;
    }
    setIsRegisteringComp(true);
    try {
      const res = await fetch('/api/empresa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCompName,
          cnpj: newCompCnpj,
          email: newCompEmail,
          phone: newCompPhone,
          contactName: newCompContact,
          companyType: newCompType,
          companyIndustry: newCompIndustry,
          companySize: newCompSize,
          city: newCompCity,
          state: newCompState,
          country: newCompCountry,
          website: newCompWebsite,
          description: newCompDescription,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Este e-mail já está vinculado a uma empresa.');
      }
      setRegSuccessInfo({ name: newCompName, cnpj: newCompCnpj, email: newCompEmail });
      showToast(`Empresa "${newCompName}" cadastrada com sucesso!`, 'success');
      setShowCompanyRegisterModal(false);
      setNewCompName('');
      setNewCompCnpj('');
      setNewCompEmail('');
      setNewCompPhone('');
      setNewCompContact('');
      fetchEmpresaData();
    } catch (err: any) {
      setRegError(err.message || 'Este e-mail já está vinculado a uma empresa.');
      showToast(err.message || 'Erro ao cadastrar empresa', 'error');
    } finally {
      setIsRegisteringComp(false);
    }
  };

  const handleCreateJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setJobError(null);
    if (companyJob) {
      setJobError('Esta conta já possui uma vaga cadastrada.');
      showToast('Esta conta já possui uma vaga cadastrada.', 'warning');
      return;
    }
    const totalWeight = jobSkills.reduce((sum, s) => sum + (Number(s.weight) || 0), 0);
    if (totalWeight !== 100) {
      const msg = 'Os pesos das skills devem totalizar 100%.';
      setJobError(msg);
      showToast(msg, 'warning');
      return;
    }
    setIsSubmittingJob(true);
    try {
      const res = await fetch('/api/vagas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: jobTitle,
          area: jobArea,
          level: jobLevel,
          minExperienceYears: Number(jobMinYears),
          description: jobDescription,
          workModel: jobWorkModel,
          contractType: jobContractType,
          location: jobLocation,
          salaryMin: jobSalaryMin,
          salaryMax: jobSalaryMax,
          mandatoryRequirements: jobMandatory,
          desirableRequirements: jobDesirable,
          benefits: jobBenefits,
          status: 'Aguardando análise do recrutador',
          companyId: user?.companyData?.id || user?.email,
          companyName: user?.companyData?.name || user?.name,
          companyEmail: user?.companyData?.email || user?.email,
          cnpj: user?.companyData?.cnpj,
          skills: jobSkills.map((s) => ({
            name: s.name,
            weight: s.weight,
            required: s.required ?? true,
            nome: s.name,
            peso: s.weight,
            obrigatoria: s.required ?? true,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Erro ao enviar vaga');
      showToast('Vaga enviada com sucesso! Aguarde análise do recrutador.', 'success');
      setShowJobModal(false);
      fetchEmpresaData();
    } catch (err: any) {
      setJobError(err.message || 'Erro ao enviar vaga');
      showToast(err.message || 'Erro ao enviar vaga', 'error');
    } finally {
      setIsSubmittingJob(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingEdit(true);
    try {
      const updatedCompanyData = {
        ...user?.companyData,
        name: editName,
        phone: editPhone,
        website: editWebsite,
        description: editDescription,
        city: editCity,
        state: editState,
        country: editCountry,
        companyType: editType,
        companyIndustry: editIndustry,
        companySize: editSize,
      };
      const res = await fetch('/api/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          email: user?.email,
          companyData: updatedCompanyData,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Erro ao salvar dados');
      showToast('Dados da empresa atualizados com sucesso!', 'success');
      setActiveTab('visao-geral');
      fetchEmpresaData();
    } catch (err: any) {
      showToast(err.message || 'Erro ao salvar dados da empresa', 'error');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleSelectForComparison = useCallback((result: EnrichedMatchingResult) => {
    setSelectedForComparison(prev => {
      if (prev.includes(result.candidateId)) {
        return prev.filter(id => id !== result.candidateId);
      }
      if (prev.length >= 2) {
        showToast('Você só pode comparar até 2 candidatos simultaneamente.', 'warning');
        return prev;
      }
      const newSelection = [...prev, result.candidateId];
      if (newSelection.length === 2) {
        setShowComparison(true);
      }
      return newSelection;
    });
  }, [showToast]);

  // ─── Tabs da empresa ──────────────────────────────────────────────────────

  const companyTabs: { id: TabId; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'visao-geral', label: 'Visão Geral', icon: <Building2 className="w-4 h-4" /> },
    { id: 'minha-vaga', label: 'Minha Vaga', icon: <Briefcase className="w-4 h-4" /> },
    {
      id: 'candidatos',
      label: 'Candidatos',
      icon: <Users className="w-4 h-4" />,
      badge: stats?.highMatches,
    },
    { id: 'editar', label: 'Editar Perfil', icon: <Pencil className="w-4 h-4" /> },
  ];

  // ─── Render ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="space-y-6">
        <Header
          title="🏢 Área da Empresa"
          description="Carregando informações..."
        />
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <Header
        title={isCompany ? '🏢 Área da Empresa' : '🏢 Gestão de Empresas'}
        description={
          isCompany
            ? `Bem-vindo, ${companyName}! • ${companyEmail}`
            : 'Cadastre empresas contratantes, acompanhe vagas e gerencie o pipeline de contratação.'
        }
      >
        <div className="flex items-center gap-2">
          {isCompany && (
            <Button
              variant="outline"
              size="sm"
              icon={<LogOut className="w-4 h-4" />}
              onClick={logout}
            >
              Sair da Conta
            </Button>
          )}
          {!isCompany && (
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setRegError(null);
                setRegSuccessInfo(null);
                setShowCompanyRegisterModal(true);
              }}
            >
              Cadastrar Empresa
            </Button>
          )}
        </div>
      </Header>

      <div className="max-w-6xl mx-auto space-y-6">

        {/* ── Alerta de cadastro bem-sucedido (admin) ── */}
        {regSuccessInfo && (
          <Alert type="success" title="Empresa Cadastrada com Sucesso!">
            <div className="space-y-1 text-xs">
              <p><strong>Empresa:</strong> {regSuccessInfo.name}</p>
              {regSuccessInfo.cnpj && <p><strong>CNPJ:</strong> {regSuccessInfo.cnpj}</p>}
              <p>
                <strong>E-mail de acesso:</strong>{' '}
                <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                  {regSuccessInfo.email}
                </span>
              </p>
              <p className="text-[11px] text-emerald-700 pt-1">
                Este e-mail está vinculado exclusivamente a esta conta para acesso ao sistema.
              </p>
            </div>
          </Alert>
        )}

        {/* ════════════════════════════════════════════════════
            VISÃO EMPRESA
        ════════════════════════════════════════════════════ */}
        {isCompany && (
          <>
            {/* Stats rápidos */}
            {stats && companyJob && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard
                  label="Candidatos"
                  value={stats.candidatesTotal}
                  icon={<Users className="w-4 h-4" />}
                  color="border-slate-800"
                />
                <StatCard
                  label="Alta compatibilidade"
                  value={stats.highMatches}
                  icon={<Star className="w-4 h-4 text-emerald-400" />}
                  color="border-emerald-900/50"
                />
                <StatCard
                  label="Média compatibilidade"
                  value={stats.mediumMatches}
                  icon={<TrendingUp className="w-4 h-4 text-amber-400" />}
                  color="border-amber-900/50"
                />
                <StatCard
                  label="Aguarda revisão"
                  value={stats.requiresReview}
                  icon={<ClipboardList className="w-4 h-4 text-blue-400" />}
                  color="border-blue-900/50"
                />
              </div>
            )}

            {/* Tabs de navegação */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xs overflow-hidden">
              <div className="flex border-b border-slate-800 overflow-x-auto">
                {companyTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all relative ${
                      activeTab === tab.id
                        ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-950/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* ── Tab: Visão Geral ── */}
                {activeTab === 'visao-geral' && (
                  <div className="space-y-6">
                    {/* Hero Company Banner */}
                    <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-slate-800 relative overflow-hidden shadow-xl">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
                      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 border border-blue-400/30 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-500/20 shrink-0">
                            {companyName.charAt(0)}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h2 className="text-2xl font-black text-slate-100">{companyName}</h2>
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                                <ShieldCheck className="w-3 h-3" /> Conta Verificada
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5 text-blue-400" /> {companyEmail}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {companyCity}, {companyState}
                              </span>
                              <span className="flex items-center gap-1">
                                <Briefcase className="w-3.5 h-3.5 text-purple-400" /> {companyIndustry}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Quick action buttons */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {companyJob ? (
                            <Button
                              variant="primary"
                              size="sm"
                              icon={<Users className="w-4 h-4" />}
                              onClick={() => setActiveTab('candidatos')}
                            >
                              Ver Candidatos ({stats?.candidatesTotal || 0})
                            </Button>
                          ) : (
                            <Button
                              variant="primary"
                              size="sm"
                              icon={<Plus className="w-4 h-4" />}
                              onClick={() => {
                                setJobError(null);
                                setShowJobModal(true);
                              }}
                            >
                              + Cadastrar Vaga
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<Pencil className="w-4 h-4" />}
                            onClick={() => setActiveTab('editar')}
                          >
                            Editar Perfil
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Main Visão Geral Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Left 2 Cols: Funnel & Profile info */}
                      <div className="lg:col-span-2 space-y-6">
                        {/* Hiring Funnel */}
                        <HiringFunnel
                          totalCandidates={stats?.candidatesTotal || 0}
                          highMatches={stats?.highMatches || 0}
                          inReview={stats?.requiresReview || 0}
                          approved={Math.max(0, (stats?.highMatches || 0) - (stats?.requiresReview || 0))}
                        />

                        {/* Company Details Card */}
                        <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-blue-400" /> Informações Organizacionais
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <InfoRow icon={<FileText className="w-3.5 h-3.5" />} label="CNPJ" value={companyCnpj} mono />
                            <InfoRow icon={<Building2 className="w-3.5 h-3.5" />} label="Tipo de Organização" value={companyType} />
                            <InfoRow icon={<Briefcase className="w-3.5 h-3.5" />} label="Segmento" value={companyIndustry} />
                            <InfoRow icon={<Users className="w-3.5 h-3.5" />} label="Porte da Empresa" value={companySize} />
                            <InfoRow
                              icon={<MapPin className="w-3.5 h-3.5" />}
                              label="Sede"
                              value={`${companyCity}, ${companyState}`}
                            />
                            {companyWebsite && (
                              <InfoRow icon={<Globe className="w-3.5 h-3.5" />} label="Website Oficial" value={companyWebsite} link />
                            )}
                          </div>

                          {companyDescription && (
                            <div className="pt-3 border-t border-slate-800/80 space-y-1">
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sobre a Empresa</p>
                              <p className="text-xs text-slate-300 leading-relaxed">{companyDescription}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right 1 Col: Activity Feed & Job Quick Summary */}
                      <div className="space-y-6">
                        {/* Job Quick Summary Box */}
                        <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                              <Briefcase className="w-3.5 h-3.5 text-purple-400" /> Vaga Ativa
                            </p>
                            {companyJob && (
                              <Badge variant={companyJob.status?.toLowerCase().includes('aprovada') || companyJob.status?.toLowerCase().includes('ativa') ? 'success' : 'warning'}>
                                {companyJob.status || 'Em Análise'}
                              </Badge>
                            )}
                          </div>

                          {companyJob ? (
                            <div className="space-y-2">
                              <h4 className="font-bold text-slate-100 text-sm">{companyJob.title}</h4>
                              <p className="text-xs text-slate-400">
                                {companyJob.area} • {companyJob.level}
                              </p>
                              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800 text-slate-400">
                                <span>{companyJob.skills.length} skills configuradas</span>
                                <button
                                  onClick={() => setActiveTab('minha-vaga')}
                                  className="text-blue-400 hover:underline font-bold"
                                >
                                  Ver Detalhes →
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-4 space-y-2">
                              <p className="text-xs text-slate-500">Nenhuma vaga cadastrada.</p>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => {
                                  setJobError(null);
                                  setShowJobModal(true);
                                }}
                              >
                                Cadastrar Vaga
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Activity Feed */}
                        <ActivityFeed
                          jobTitle={companyJob?.title || 'Vaga em Geral'}
                          candidatesCount={stats?.candidatesTotal || 0}
                          highMatches={stats?.highMatches || 0}
                          requiresReview={stats?.requiresReview || 0}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Tab: Minha Vaga ── */}
                {activeTab === 'minha-vaga' && (
                  <div className="space-y-4">
                    {!companyJob ? (
                      <div className="text-center py-12 space-y-4">
                        <div className="w-14 h-14 rounded-full bg-blue-950/60 text-blue-400 border border-blue-800/40 flex items-center justify-center mx-auto">
                          <Briefcase className="w-7 h-7" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-200 text-sm">Nenhuma vaga cadastrada ainda</h4>
                          <p className="text-xs text-slate-400 max-w-md mx-auto pt-1">
                            Cadastre a posição de TI da sua empresa e envie para análise do recrutador.
                          </p>
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          icon={<Plus className="w-4 h-4" />}
                          onClick={() => {
                            setJobError(null);
                            setShowJobModal(true);
                          }}
                        >
                          + Cadastrar Nova Vaga
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <MarketInsightsWidget job={companyJob} candidatesCount={stats?.candidatesTotal || 0} />
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          {/* Coluna Principal: Detalhes da Vaga */}
                          <div className="lg:col-span-2 space-y-4">
                            <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-4">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-black text-slate-100 text-lg">{companyJob.title}</h4>
                                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                                    <Clock className="w-3 h-3" />
                                    Enviada em:{' '}
                                    {companyJob.createdAt
                                      ? new Date(companyJob.createdAt).toLocaleDateString('pt-BR')
                                      : 'Recentemente'}
                                  </p>
                                </div>
                                <Badge variant={companyJob.status?.toLowerCase().includes('aprovada') || companyJob.status?.toLowerCase().includes('ativa') ? 'success' : 'warning'}>
                                  {companyJob.status || 'Aguardando análise'}
                                </Badge>
                              </div>

                              <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-300">
                                <Tag label={`Área: ${companyJob.area}`} />
                                <Tag label={`Nível: ${companyJob.level}`} />
                                {companyJob.workModel && <Tag label={`Modelo: ${companyJob.workModel}`} />}
                                {companyJob.contractType && <Tag label={`Contrato: ${companyJob.contractType}`} />}
                                {companyJob.location && <Tag label={`Local: ${companyJob.location}`} />}
                                {(companyJob.salaryMin || companyJob.salaryMax) && (
                                  <Tag
                                    label={`Salário: ${companyJob.salaryMin || '?'} – ${companyJob.salaryMax || '?'}`}
                                  />
                                )}
                              </div>

                              {companyJob.description && (
                                <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-3">
                                  {companyJob.description}
                                </p>
                              )}

                              <div className="border-t border-slate-800 pt-3">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                  Skills e Pesos ({companyJob.skills.length}):
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {companyJob.skills.map((sk) => (
                                    <span
                                      key={sk.id || sk.name}
                                      className="text-xs bg-slate-900 text-slate-200 font-bold px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1"
                                    >
                                      {sk.name}{' '}
                                      <span className="text-blue-400">({sk.weight}%)</span>
                                      {sk.required && (
                                        <span className="text-[9px] bg-blue-950 text-blue-300 border border-blue-800/60 px-1 rounded">
                                          Obg
                                        </span>
                                      )}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Coluna Lateral: Timeline e Saúde */}
                          <div className="space-y-4">
                            <VagaTimeline job={companyJob} />
                            <JobHealthScore job={companyJob} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Tab: Candidatos ── */}
                {activeTab === 'candidatos' && (
                  <div className="space-y-4">
                    {!companyJob ? (
                      <div className="text-center py-12 space-y-3 text-slate-400">
                        <AlertCircle className="w-10 h-10 mx-auto text-slate-600" />
                        <p className="text-sm font-medium">
                          Cadastre uma vaga primeiro para ver os candidatos compatíveis.
                        </p>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setActiveTab('minha-vaga')}
                        >
                          Ir para Minha Vaga
                        </Button>
                      </div>
                    ) : loadingCandidates ? (
                      <div className="flex items-center justify-center py-16">
                        <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Lista de candidatos com o novo componente */}
                        <div className="lg:col-span-2">
                          <CandidatesPanel
                            results={matchingResults}
                            jobTitle={companyJob.title}
                            selectedForComparison={selectedForComparison}
                            onSelectForComparison={handleSelectForComparison}
                          />
                        </div>
                        
                        {/* Painel lateral: Radar de Skills */}
                        <div className="space-y-4">
                          <SkillsRadarChart 
                            jobSkills={companyJob.skills}
                            matchingResults={matchingResults}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Tab: Editar Perfil ── */}
                {activeTab === 'editar' && (
                  <form onSubmit={handleSaveEdit} className="space-y-5 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="md:col-span-2">
                        <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Nome da Empresa *
                        </label>
                        <input
                          type="text"
                          required
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Telefone
                        </label>
                        <input
                          type="text"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          placeholder="(11) 99999-9999"
                          className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-600"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Site / Website
                        </label>
                        <input
                          type="url"
                          value={editWebsite}
                          onChange={(e) => setEditWebsite(e.target.value)}
                          placeholder="https://suaempresa.com.br"
                          className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-600"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Tipo de Organização
                        </label>
                        <select
                          value={editType}
                          onChange={(e) => setEditType(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100"
                        >
                          {COMPANY_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Área de Atuação
                        </label>
                        <select
                          value={editIndustry}
                          onChange={(e) => setEditIndustry(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100"
                        >
                          {COMPANY_INDUSTRIES.map((ind) => (
                            <option key={ind} value={ind}>{ind}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Porte da Empresa
                        </label>
                        <select
                          value={editSize}
                          onChange={(e) => setEditSize(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100"
                        >
                          {COMPANY_SIZES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Cidade
                        </label>
                        <input
                          type="text"
                          value={editCity}
                          onChange={(e) => setEditCity(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Estado (UF)
                        </label>
                        <input
                          type="text"
                          value={editState}
                          onChange={(e) => setEditState(e.target.value)}
                          placeholder="SP"
                          className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-600"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Descrição da Empresa
                        </label>
                        <textarea
                          rows={3}
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="Conte sobre a missão, valores e cultura da empresa..."
                          className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-600"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab('visao-geral')}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        isLoading={isSavingEdit}
                        icon={<Save className="w-4 h-4" />}
                      >
                        Salvar Alterações
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </>
        )}

        {/* ════════════════════════════════════════════════════
            VISÃO ADMINISTRADOR
        ════════════════════════════════════════════════════ */}
        {!isCompany && (
          <div className="space-y-5">
            {/* Stats rápidos para admin */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <StatCard
                label="Empresas Cadastradas"
                value={allCompanies.length}
                icon={<Building2 className="w-4 h-4" />}
                color="border-slate-800"
              />
              <StatCard
                label="Com Vaga Ativa"
                value={allCompanies.filter((c) => c.jobId || c.companyData?.jobId).length}
                icon={<Briefcase className="w-4 h-4 text-emerald-400" />}
                color="border-emerald-900/50"
              />
              <StatCard
                label="Sem Vaga"
                value={allCompanies.filter((c) => !c.jobId && !c.companyData?.jobId).length}
                icon={<AlertCircle className="w-4 h-4 text-amber-400" />}
                color="border-amber-900/50"
              />
            </div>

            {/* Tabs admin */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xs overflow-hidden">
              <div className="flex border-b border-slate-800">
                {[
                  { id: 'empresas' as AdminTabId, label: `Empresas (${allCompanies.length})`, icon: <Building2 className="w-4 h-4" /> },
                  { id: 'cadastrar' as AdminTabId, label: 'Cadastrar Nova', icon: <Plus className="w-4 h-4" /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setAdminTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all ${
                      adminTab === tab.id
                        ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-950/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* Lista de empresas */}
                {adminTab === 'empresas' && (
                  <div className="space-y-3">
                    {allCompanies.length === 0 ? (
                      <div className="text-center py-10 text-slate-400">
                        <Building2 className="w-10 h-10 mx-auto text-slate-700 mb-3" />
                        <p className="text-sm">Nenhuma empresa cadastrada ainda.</p>
                        <Button
                          variant="primary"
                          size="sm"
                          className="mt-3"
                          onClick={() => setAdminTab('cadastrar')}
                        >
                          Cadastrar primeira empresa
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {allCompanies.map((comp) => {
                          const compData = comp.companyData || comp;
                          const hasJob = !!(comp.jobId || compData.jobId);
                          return (
                            <div
                              key={comp.id || comp.email}
                              className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3 hover:border-slate-700 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-9 h-9 rounded-xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center text-blue-300 text-sm font-black shrink-0">
                                    {(compData.name || comp.name || '?').charAt(0)}
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-100 text-sm">
                                      {compData.name || comp.name}
                                    </h4>
                                    <p className="text-[11px] text-slate-500">
                                      {compData.companyType || 'Tecnologia'}
                                    </p>
                                  </div>
                                </div>
                                <Badge variant={hasJob ? 'success' : 'warning'}>
                                  {hasJob ? 'Com Vaga' : 'Sem Vaga'}
                                </Badge>
                              </div>

                              <div className="space-y-1 text-xs text-slate-400">
                                {compData.cnpj && (
                                  <p>
                                    <strong>CNPJ:</strong>{' '}
                                    <span className="text-slate-200 font-mono">{compData.cnpj}</span>
                                  </p>
                                )}
                                <p>
                                  <strong>E-mail:</strong>{' '}
                                  <span className="font-mono font-semibold text-blue-400">{compData.email}</span>
                                </p>
                                {compData.phone && (
                                  <p>
                                    <strong>Telefone:</strong>{' '}
                                    <span className="text-slate-200">{compData.phone}</span>
                                  </p>
                                )}
                                {(compData.city || compData.state) && (
                                  <p className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {[compData.city, compData.state].filter(Boolean).join(', ')}
                                  </p>
                                )}
                              </div>

                              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                                <span className="text-slate-500">
                                  {compData.companyIndustry || 'Desenvolvimento de Software'}
                                </span>
                                <span className={`font-medium flex items-center gap-1 ${hasJob ? 'text-emerald-400' : 'text-slate-500'}`}>
                                  {hasJob ? (
                                    <>
                                      <CheckCircle2 className="w-3.5 h-3.5" /> Vaga cadastrada
                                    </>
                                  ) : (
                                    'Sem vaga cadastrada'
                                  )}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Cadastrar empresa */}
                {adminTab === 'cadastrar' && (
                  <form onSubmit={handleRegisterCompanySubmit} className="space-y-4 text-xs">
                    {regError && (
                      <Alert type="error" title="Erro no Cadastro">
                        {regError}
                      </Alert>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="md:col-span-2">
                        <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Nome da Empresa *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Tech Solutions Ltda"
                          value={newCompName}
                          onChange={(e) => setNewCompName(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-600"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                          CNPJ *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="00.000.000/0001-00"
                          value={newCompCnpj}
                          onChange={(e) => setNewCompCnpj(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-600"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                          E-mail de Acesso (Único) *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="empresa@techsolutions.com.br"
                          value={newCompEmail}
                          onChange={(e) => setNewCompEmail(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-600"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Telefone
                        </label>
                        <input
                          type="text"
                          placeholder="(11) 99999-9999"
                          value={newCompPhone}
                          onChange={(e) => setNewCompPhone(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-600"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Nome do Responsável
                        </label>
                        <input
                          type="text"
                          placeholder="Carlos Eduardo (Gerente RH)"
                          value={newCompContact}
                          onChange={(e) => setNewCompContact(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-600"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Tipo de Organização
                        </label>
                        <select
                          value={newCompType}
                          onChange={(e) => setNewCompType(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100"
                        >
                          {COMPANY_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Área de Atuação
                        </label>
                        <select
                          value={newCompIndustry}
                          onChange={(e) => setNewCompIndustry(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100"
                        >
                          {COMPANY_INDUSTRIES.map((ind) => (
                            <option key={ind} value={ind}>{ind}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Porte
                        </label>
                        <select
                          value={newCompSize}
                          onChange={(e) => setNewCompSize(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100"
                        >
                          {COMPANY_SIZES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Cidade
                        </label>
                        <input
                          type="text"
                          value={newCompCity}
                          onChange={(e) => setNewCompCity(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Estado (UF)
                        </label>
                        <input
                          type="text"
                          value={newCompState}
                          onChange={(e) => setNewCompState(e.target.value)}
                          placeholder="SP"
                          className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-600"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Site
                        </label>
                        <input
                          type="url"
                          value={newCompWebsite}
                          onChange={(e) => setNewCompWebsite(e.target.value)}
                          placeholder="https://empresa.com.br"
                          className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-600"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Descrição
                        </label>
                        <textarea
                          rows={2}
                          value={newCompDescription}
                          onChange={(e) => setNewCompDescription(e.target.value)}
                          placeholder="Descreva brevemente a empresa..."
                          className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-600"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setAdminTab('empresas')}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        isLoading={isRegisteringComp}
                        icon={<Building2 className="w-4 h-4" />}
                      >
                        Cadastrar Empresa
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════
          MODAL: Cadastro de Vaga (empresa)
      ════════════════════════════════════════════════════ */}
      {showJobModal && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-400" />
                Cadastrar Vaga — {companyName}
              </h3>
              <button
                type="button"
                onClick={() => setShowJobModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {jobError && (
              <Alert type="error" title="Validação de Vaga">
                {jobError}
              </Alert>
            )}

            <form onSubmit={handleCreateJobSubmit} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Título da Vaga *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Desenvolvedor Full Stack Sênior"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Área *
                  </label>
                  <select
                    value={jobArea}
                    onChange={(e) => setJobArea(e.target.value as JobArea)}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100"
                  >
                    {['Frontend', 'Backend', 'Full Stack', 'DevOps / Cloud', 'Data & Analytics', 'Mobile', 'QA / Testes', 'Segurança da Informação', 'Outros'].map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Nível *
                  </label>
                  <select
                    value={jobLevel}
                    onChange={(e) => setJobLevel(e.target.value as ProfessionalLevel)}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100"
                  >
                    {ProfessionalLevels.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Modelo de Trabalho *
                  </label>
                  <select
                    value={jobWorkModel}
                    onChange={(e) => setJobWorkModel(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100"
                  >
                    {WORK_MODELS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Tipo de Contratação *
                  </label>
                  <select
                    value={jobContractType}
                    onChange={(e) => setJobContractType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100"
                  >
                    {CONTRACT_TYPES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Local da Vaga
                  </label>
                  <input
                    type="text"
                    placeholder="São Paulo, SP (ou Remoto)"
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Exp. Mínima (anos)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={jobMinYears}
                    onChange={(e) => setJobMinYears(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Salário Mín.
                    </label>
                    <input
                      type="text"
                      placeholder="R$ 7.000"
                      value={jobSalaryMin}
                      onChange={(e) => setJobSalaryMin(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Salário Máx.
                    </label>
                    <input
                      type="text"
                      placeholder="R$ 12.000"
                      value={jobSalaryMax}
                      onChange={(e) => setJobSalaryMax(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-600"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Descrição da Vaga *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Descreva as responsabilidades e desafios do cargo..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-600"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Requisitos Obrigatórios
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Conhecimentos e graduações indispensáveis..."
                    value={jobMandatory}
                    onChange={(e) => setJobMandatory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-600"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Requisitos Desejáveis
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Diferenciais bem-vindos..."
                    value={jobDesirable}
                    onChange={(e) => setJobDesirable(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-600"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Benefícios
                  </label>
                  <textarea
                    rows={2}
                    placeholder="VR, VA, Plano de Saúde, PLR..."
                    value={jobBenefits}
                    onChange={(e) => setJobBenefits(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-600"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <SkillWeightConfigurator skills={jobSkills} onChange={setJobSkills} />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowJobModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSubmittingJob}
                  icon={<ShieldCheck className="w-4 h-4" />}
                >
                  Enviar Vaga para Análise
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Comparação */}
      {showComparison && selectedForComparison.length === 2 && (
        <ComparisonModal
          candidates={[
            matchingResults.find((r) => r.candidateId === selectedForComparison[0])!,
            matchingResults.find((r) => r.candidateId === selectedForComparison[1])!,
          ]}
          jobSkills={companyJob?.skills || []}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
}

// ─── Componentes auxiliares inline ──────────────────────────────────────────

function InfoRow({
  icon,
  label,
  value,
  mono,
  link,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
  link?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
        {icon}
        {label}
      </span>
      {link ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-blue-400 hover:underline ${mono ? 'font-mono' : 'font-semibold'} text-xs truncate`}
        >
          {value}
        </a>
      ) : (
        <span className={`${mono ? 'font-mono' : 'font-semibold'} text-slate-200 text-xs truncate`}>
          {value}
        </span>
      )}
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span className="bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800 text-xs font-medium text-slate-300">
      {label}
    </span>
  );
}
