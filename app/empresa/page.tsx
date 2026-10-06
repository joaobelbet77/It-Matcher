'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { useAuth } from '@/components/auth/AuthContext';
import { useToast } from '@/components/layout/Toast';
import { SkillWeightConfigurator, ConfiguredSkill } from '@/components/admin/vagas/VagaPesoSkills';
import { VagaTimeline, JobHealthScore } from '@/components/empresa/EmpresaDiferenciais';
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
  AlertCircle,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Globe,
  MapPin,
  FileText,
  Clock,
  ArrowRight,
  LogOut,
  Sparkles,
  Search,
  Filter,
  Calendar,
  Users,
  ExternalLink,
  Award,
  Layers,
} from 'lucide-react';

export default function EmpresaPage() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const isCompany = user?.tipoUsuario === 'empresa' || user?.role === 'COMPANY' || user?.role === 'Empresa';

  // Estados gerais
  const [loading, setLoading] = useState(true);
  const [companyJob, setCompanyJob] = useState<Job | null>(null);
  const [allCompanies, setAllCompanies] = useState<any[]>([]);

  // Filtros de busca de empresas parceiras
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState('Todos');

  // Modal / Form de Cadastro de Empresa (Visível para Recrutador)
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

  // Modal / Form de Cadastro de Vaga da Empresa
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

  // Carrega dados da empresa e vaga vinculada
  const fetchEmpresaData = async () => {
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
  };

  useEffect(() => {
    fetchEmpresaData();
  }, [user]);

  // Handler de Cadastro de Nova Empresa pelo Recrutador (REQUISITO 3 & 4)
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
        // Mensagem de erro caso e-mail já esteja vinculado: "Este e-mail já está vinculado a uma empresa."
        throw new Error(data.error || 'Este e-mail já está vinculado a uma empresa.');
      }

      // Informação do e-mail da empresa cadastrada (REQUISITO 4)
      setRegSuccessInfo({
        name: newCompName,
        cnpj: newCompCnpj,
        email: newCompEmail,
      });

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

  // Handler de Cadastro da Vaga da Empresa (REQUISITO 6, 7 & 9)
  const handleCreateJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setJobError(null);

    // REGRA DE SEGURANÇA 7: Apenas 1 vaga por empresa
    if (companyJob) {
      setJobError('Esta conta já possui uma vaga cadastrada.');
      showToast('Esta conta já possui uma vaga cadastrada.', 'warning');
      return;
    }

    // Validação de skills: Soma deve ser obrigatoriamente 100%
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

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erro ao enviar vaga');
      }

      showToast('Vaga enviada com sucesso!', 'success');
      setShowJobModal(false);
      fetchEmpresaData();
    } catch (err: any) {
      setJobError(err.message || 'Erro ao enviar vaga');
      showToast(err.message || 'Erro ao enviar vaga', 'error');
    } finally {
      setIsSubmittingJob(false);
    }
  };

  const companyName = user?.companyData?.name || user?.company || user?.name || 'Tech Solutions';
  const companyEmail = user?.companyData?.email || user?.email || 'empresa@techsolutions.com.br';
  const companyCnpj = user?.companyData?.cnpj || '00.000.000/0001-00';
  const companyType = user?.companyData?.companyType || 'Empresa de Tecnologia';
  const companyIndustry = user?.companyData?.companyIndustry || 'Desenvolvimento de Software';

  // Cálculos de métricas das empresas parceiras
  const totalJobsCount = allCompanies.reduce((acc, comp) => acc + (comp.companyData?.jobsCount || (comp.email === companyEmail && companyJob ? 1 : 1)), 0);
  const totalCandidatesCount = allCompanies.reduce((acc, comp) => acc + (comp.companyData?.candidatesCount || 12), 0);
  const activePartnersCount = allCompanies.filter((comp) => {
    const status = comp.companyData?.partnershipStatus || 'Ativa';
    return status !== 'Inativo' && status !== 'Cancelada';
  }).length;

  // Segmentos únicos dinâmicos
  const availableSegments = [
    'Todos',
    ...Array.from(
      new Set(
        allCompanies
          .map((c) => c.companyData?.segment || c.companyData?.companyIndustry)
          .filter(Boolean)
      )
    ),
  ];

  // Filtragem de empresas parceiras
  const filteredCompanies = allCompanies.filter((comp) => {
    const compData = comp.companyData || comp;
    const name = (compData.name || comp.name || '').toLowerCase();
    const segment = (compData.segment || compData.companyIndustry || compData.companyType || '').toLowerCase();
    const city = (compData.city || '').toLowerCase();
    const desc = (compData.description || '').toLowerCase();
    const status = (compData.partnershipStatus || 'Ativa').toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesSearch = !search || name.includes(search) || segment.includes(search) || city.includes(search) || desc.includes(search);
    const matchesSegment = selectedSegment === 'Todos' || segment.includes(selectedSegment.toLowerCase());
    const matchesStatus = selectedStatus === 'Todos' || status === selectedStatus.toLowerCase();

    return matchesSearch && matchesSegment && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <Header
        title={isCompany ? '🏢 Área da Empresa' : '🏢 Empresas Parceiras'}
        description={
          isCompany
            ? `Bem-vindo, ${companyName}! • E-mail: ${companyEmail}`
            : 'Ecossistema de empresas parceiras contratantes, vagas ativas e status das parcerias'
        }
      >
        <div className="flex items-center gap-2">
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
              Cadastrar Nova Empresa
            </Button>
          )}
          {isCompany && (
            <Button variant="outline" size="sm" icon={<LogOut className="w-4 h-4" />} onClick={logout}>
              Sair da Conta
            </Button>
          )}
        </div>
      </Header>

      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Confirmação de Cadastro para o Recrutador (REQUISITO 4) */}
        {regSuccessInfo && (
          <Alert type="success" title="Empresa Cadastrada com Sucesso!">
            <div className="space-y-1 text-xs">
              <p><strong>Empresa:</strong> {regSuccessInfo.name}</p>
              {regSuccessInfo.cnpj && <p><strong>CNPJ:</strong> {regSuccessInfo.cnpj}</p>}
              <p>
                <strong>E-mail de acesso da empresa:</strong>{' '}
                <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                  {regSuccessInfo.email}
                </span>
              </p>
              <p className="text-[11px] text-emerald-700 pt-1">
                Este e-mail está vinculado exclusivamente a esta conta da empresa para acesso direto ao sistema.
              </p>
            </div>
          </Alert>
        )}

        {/* VISÃO DA CONTA DO TIPO EMPRESA (REQUISITO 4 & 6) */}
        {isCompany && (
          <>
            {/* Card de Identificação da Empresa */}
            <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-400" />
                    {companyName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    E-mail oficial da conta: <strong className="text-slate-200">{companyEmail}</strong>
                  </p>
                </div>
                <Badge variant="success">Status da conta: Ativa</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="font-bold text-slate-400 uppercase block mb-0.5">CNPJ</span>
                  <span className="font-mono text-slate-200 font-semibold">{companyCnpj}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-400 uppercase block mb-0.5">Tipo de Organização</span>
                  <span className="text-slate-200 font-medium">{companyType}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-400 uppercase block mb-0.5">Área de Atuação</span>
                  <span className="text-slate-200 font-medium">{companyIndustry}</span>
                </div>
              </div>
            </div>

            {/* Card de Plano & Monetização Corporativa */}
            <div className="bg-gradient-to-r from-blue-950/60 to-slate-900/90 p-6 rounded-2xl border border-blue-900/40 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block font-heading">
                      Plano & Assinatura Corporativa
                    </span>
                    <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      {user?.companyData?.planName || 'Nenhum plano contratado'}
                      {user?.companyData?.subscriptionStatus === 'active' ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                          ● Ativo & Desbloqueado
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                          ● Bloqueado (Requer Assinatura)
                        </span>
                      )}
                    </h4>
                  </div>
                </div>

                <Link href="/planos">
                  <Button variant="primary" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                    {user?.companyData?.subscriptionStatus === 'active' ? 'Gerenciar Plano' : 'Contratar Plano de Acesso'}
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs border-t border-slate-800/80">
                <div className="text-slate-300">
                  <span className="text-slate-500 block text-[11px]">Smart Matching & Ranking:</span>
                  <strong className={user?.companyData?.subscriptionStatus === 'active' ? 'text-emerald-400' : 'text-amber-400'}>
                    {user?.companyData?.subscriptionStatus === 'active' ? '✓ Desbloqueado' : '🔒 Requer Plano Ativo'}
                  </strong>
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-500 block text-[11px]">Limite de Vagas:</span>
                  <strong className="text-slate-100">1 vaga simultânea</strong>
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-500 block text-[11px]">Relatórios & Compliance:</span>
                  <strong className="text-slate-100">RG01 a RG10 Habilitados</strong>
                </div>
              </div>
            </div>

            {/* Seção MINHA VAGA (REQUISITO 6, 7 & 9) */}
            <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                    MINHA VAGA
                  </h3>
                  <p className="text-xs text-slate-400">
                    Cada conta do tipo Empresa pode cadastrar e gerenciar no máximo 1 vaga.
                  </p>
                </div>

                {/* Botão + Cadastrar Nova Vaga (Aparece SOMENTE se NÃO houver vaga cadastrada - REQUISITO 7) */}
                {!companyJob ? (
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
                ) : (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/60">
                    ✓ Vaga Cadastrada
                  </span>
                )}
              </div>

              {/* Caso NENHUMA VAGA cadastrada ainda */}
              {!companyJob ? (
                <div className="text-center py-8 px-4 border-2 border-dashed border-slate-800 rounded-xl bg-slate-950/40 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-blue-950/60 text-blue-400 border border-blue-800/40 flex items-center justify-center mx-auto">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 text-sm">Você ainda não possui uma vaga cadastrada.</h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto pt-1">
                      Clique no botão acima para cadastrar a posição de TI da sua empresa e enviá-la para análise do administrador.
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
                /* Caso JÁ POSSUA UMA VAGA CADASTRADA (REQUISITO 7 & 9) */
                <div className="space-y-4">
                  <Alert type="info" title="Você já possui uma vaga cadastrada.">
                    Sua conta atingiu o limite de 1 vaga cadastrada. Acompanhe abaixo o status e os critérios da vaga enviada.
                  </Alert>

                  <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="font-black text-slate-100 text-base">{companyJob.title}</h4>
                        <span className="text-xs text-slate-400">
                          Enviada em: {companyJob.createdAt ? new Date(companyJob.createdAt).toLocaleDateString('pt-BR') : 'Recentemente'}
                        </span>
                      </div>
                      <Badge variant="warning">
                        {companyJob.status || 'Aguardando análise do administrador'}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-300">
                      <span className="bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">Área: {companyJob.area}</span>
                      <span className="bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">Nível: {companyJob.level}</span>
                      {companyJob.workModel && <span className="bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">Modelo: {companyJob.workModel}</span>}
                      {companyJob.contractType && <span className="bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">Contrato: {companyJob.contractType}</span>}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {companyJob.description}
                    </p>

                    <div className="pt-2 border-t border-slate-800">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Skills e Pesos Configurados ({companyJob.skills.length}):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {companyJob.skills.map((sk) => (
                          <span key={sk.id || sk.name} className="text-xs bg-slate-900 text-slate-200 font-bold px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1">
                            {sk.name} <span className="text-blue-400">({sk.weight}%)</span>
                            {sk.required && <span className="text-[9px] bg-blue-950 text-blue-300 border border-blue-800/60 px-1 rounded">Obg</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Diferenciais da Empresa: Timeline de Progresso e Saúde da Vaga */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <VagaTimeline job={companyJob} />
                    <JobHealthScore job={companyJob} />
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* VISÃO DA CONTA DO ADMINISTRADOR - LISTA COMPLETA DE EMPRESAS PARCEIRAS */}
        {!isCompany && (
          <div className="space-y-6">
            {/* 1. CARDS DE KPIS RESUMO DAS PARCERIAS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-[#121215] p-5 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-400 block">Total de Empresas</span>
                  <span className="text-2xl font-black font-heading text-slate-900 dark:text-white">{allCompanies.length}</span>
                  <span className="text-[11px] text-slate-500 dark:text-zinc-400 block mt-0.5">Parceiras cadastradas</span>
                </div>
              </div>

              <div className="bg-white dark:bg-[#121215] p-5 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-center shrink-0">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-400 block">Vagas Publicadas</span>
                  <span className="text-2xl font-black font-heading text-slate-900 dark:text-white">{totalJobsCount}</span>
                  <span className="text-[11px] text-slate-500 dark:text-zinc-400 block mt-0.5">Oportunidades ativas</span>
                </div>
              </div>

              <div className="bg-white dark:bg-[#121215] p-5 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-400 block">Candidatos no Funil</span>
                  <span className="text-2xl font-black font-heading text-slate-900 dark:text-white">{totalCandidatesCount}</span>
                  <span className="text-[11px] text-slate-500 dark:text-zinc-400 block mt-0.5">Aplicações e matches</span>
                </div>
              </div>

              <div className="bg-white dark:bg-[#121215] p-5 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-400 block">Parcerias Ativas</span>
                  <span className="text-2xl font-black font-heading text-slate-900 dark:text-white">{activePartnersCount}</span>
                  <span className="text-[11px] text-slate-500 dark:text-zinc-400 block mt-0.5">100% homologadas</span>
                </div>
              </div>
            </div>

            {/* 2. BARRA DE BUSCA E FILTROS */}
            <div className="bg-white dark:bg-[#121215] p-5 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                {/* Campo de Busca */}
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar empresas por nome, segmento, tecnologia ou cidade..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-900/70 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                {/* Filtro por Segmento */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Filter className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0 hidden sm:block" />
                  <select
                    value={selectedSegment}
                    onChange={(e) => setSelectedSegment(e.target.value)}
                    className="w-full md:w-52 px-3 py-2.5 bg-slate-50 dark:bg-zinc-900/70 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {availableSegments.map((seg) => (
                      <option key={seg} value={seg}>
                        {seg === 'Todos' ? 'Todos os Segmentos' : seg}
                      </option>
                    ))}
                  </select>

                  {/* Filtro por Status */}
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full md:w-44 px-3 py-2.5 bg-slate-50 dark:bg-zinc-900/70 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Todos">Todos os Status</option>
                    <option value="Parceiro Premium">Parceiro Premium</option>
                    <option value="Ativa">Ativa</option>
                    <option value="Estratégico">Estratégico</option>
                    <option value="Em Homologação">Em Homologação</option>
                  </select>
                </div>
              </div>

              {/* Contagem de resultados */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 pt-2 border-t border-slate-100 dark:border-zinc-800">
                <span>Exibindo <strong>{filteredCompanies.length}</strong> de <strong>{allCompanies.length}</strong> empresas parceiras</span>
                {(searchTerm || selectedSegment !== 'Todos' || selectedStatus !== 'Todos') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedSegment('Todos');
                      setSelectedStatus('Todos');
                    }}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            </div>

            {/* 3. LISTA DE CARDS DAS EMPRESAS PARCEIRAS */}
            {filteredCompanies.length === 0 ? (
              <div className="bg-white dark:bg-[#121215] p-12 text-center rounded-2xl border border-slate-200/80 dark:border-zinc-800 space-y-3">
                <Building2 className="w-10 h-10 text-slate-400 dark:text-zinc-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700 dark:text-zinc-300">Nenhuma empresa parceira encontrada</h4>
                <p className="text-xs text-slate-500 dark:text-zinc-500">Tente buscar por outro termo ou ajuste os filtros acima.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredCompanies.map((comp) => {
                  const compData = comp.companyData || comp;
                  const name = compData.name || comp.name || 'Empresa Parceira';
                  const email = compData.email || comp.email;
                  const cnpj = compData.cnpj || '00.000.000/0001-00';
                  const phone = compData.phone || '(11) 3456-7890';
                  const segment = compData.segment || compData.companyIndustry || compData.companyType || 'Tecnologia';
                  const description = compData.description || 'Empresa parceira credenciada na plataforma IT Matcher para recrutamento de talentos.';
                  const jobsCount = compData.jobsCount || (email === companyEmail && companyJob ? 1 : 1);
                  const candidatesCount = compData.candidatesCount || 15;
                  const status = compData.partnershipStatus || 'Ativa';
                  const createdAt = compData.createdAt || comp.createdAt || '2026-01-15T09:00:00Z';
                  const location = compData.city ? `${compData.city}, ${compData.state || 'Brasil'}` : 'São Paulo, SP';
                  const logoUrl = compData.logo;
                  const website = compData.website;

                  // Estilização do badge de status
                  const getStatusBadge = (st: string) => {
                    switch (st) {
                      case 'Parceiro Premium':
                        return (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                            Parceiro Premium
                          </span>
                        );
                      case 'Estratégico':
                        return (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                            <Award className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                            Estratégico
                          </span>
                        );
                      case 'Em Homologação':
                        return (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                            Em Homologação
                          </span>
                        );
                      default:
                        return (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            Ativa
                          </span>
                        );
                    }
                  };

                  return (
                    <div
                      key={comp.id || email}
                      className="bg-white dark:bg-[#121215] rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-5 shadow-xs hover:border-blue-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4 group"
                    >
                      <div className="space-y-3">
                        {/* Topo do Card: Logo + Nome + Status */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {logoUrl ? (
                              <img
                                src={logoUrl}
                                alt={name}
                                className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-zinc-800 shrink-0 shadow-xs"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black flex items-center justify-center text-lg shadow-md shrink-0">
                                {name.substring(0, 2).toUpperCase()}
                              </div>
                            )}

                            <div>
                              <h4 className="font-heading font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {name}
                              </h4>
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                                <Building2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                <span className="font-medium">{segment}</span>
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0">
                            {getStatusBadge(status)}
                          </div>
                        </div>

                        {/* Descrição da Empresa */}
                        <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed line-clamp-2">
                          {description}
                        </p>

                        {/* Grade de Informações de Parceria (Vagas, Candidatos, Data de Cadastro) */}
                        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-slate-50/80 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-800/80 text-xs">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 block mb-0.5">
                              Vagas
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                              <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                              {jobsCount} {jobsCount === 1 ? 'vaga' : 'vagas'}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 block mb-0.5">
                              Candidatos
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-emerald-500" />
                              {candidatesCount}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 block mb-0.5">
                              Cadastro
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-amber-500" />
                              {new Date(createdAt).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>

                        {/* Dados de Contato e Localização */}
                        <div className="space-y-1.5 text-xs text-slate-500 dark:text-zinc-400 pt-1">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{location}</span>
                            </span>
                            <span className="font-mono text-[11px] text-slate-600 dark:text-zinc-300">CNPJ: {cnpj}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 truncate">
                              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="font-mono text-blue-600 dark:text-blue-400 truncate">{email}</span>
                            </span>
                            {phone && (
                              <span className="flex items-center gap-1 text-[11px]">
                                <Phone className="w-3 h-3 text-slate-400" />
                                {phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Rodapé do Card com Ação / Link */}
                      <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                        <Link
                          href={`/matching`}
                          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
                        >
                          <span>Ver Candidatos Compatíveis</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        {website && (
                          <a
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 flex items-center gap-1 transition-colors"
                            title="Visitar website"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL DE CADASTRO DE EMPRESA PELO ADMINISTRADOR (REQUISITO 3) */}
      {showCompanyRegisterModal && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl border border-slate-800 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                Cadastrar Nova Empresa Contratante
              </h3>
              <button
                type="button"
                onClick={() => setShowCompanyRegisterModal(false)}
                className="text-slate-400 hover:text-slate-200 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {regError && (
              <Alert type="error" title="Erro no Cadastro">
                {regError}
              </Alert>
            )}

            <form onSubmit={handleRegisterCompanySubmit} className="space-y-4 text-xs">
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
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    CNPJ *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 00.000.000/0001-00"
                    value={newCompCnpj}
                    onChange={(e) => setNewCompCnpj(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    E-mail da Empresa (Acesso Único) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Ex: empresa@techsolutions.com.br"
                    value={newCompEmail}
                    onChange={(e) => setNewCompEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Telefone
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: (41) 99999-9999"
                    value={newCompPhone}
                    onChange={(e) => setNewCompPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Nome do Responsável
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Carlos Eduardo (Gerente RH)"
                    value={newCompContact}
                    onChange={(e) => setNewCompContact(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-500"
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
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCompanyRegisterModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isRegisteringComp}
                >
                  Cadastrar Empresa
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CADASTRO DE VAGA DA EMPRESA (REQUISITO 6, 7 & 8) */}
      {showJobModal && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl border border-slate-800 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-400" />
                Cadastrar Vaga da Empresa ({companyName})
              </h3>
              <button
                type="button"
                onClick={() => setShowJobModal(false)}
                className="text-slate-400 hover:text-slate-200 font-bold text-lg"
              >
                ✕
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
                    placeholder="Ex: Desenvolvedor Full Stack"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Área da Vaga *
                  </label>
                  <select
                    value={jobArea}
                    onChange={(e) => setJobArea(e.target.value as JobArea)}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Full Stack">Full Stack</option>
                    <option value="DevOps / Cloud">DevOps / Cloud</option>
                    <option value="Data & Analytics">Data & Analytics</option>
                    <option value="Mobile">Mobile</option>
                    <option value="QA / Testes">QA / Testes</option>
                    <option value="Segurança da Informação">Segurança da Informação</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Nível da Vaga *
                  </label>
                  <select
                    value={jobLevel}
                    onChange={(e) => setJobLevel(e.target.value as ProfessionalLevel)}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100"
                  >
                    <option value="Júnior">Júnior</option>
                    <option value="Pleno">Pleno</option>
                    <option value="Sênior">Sênior</option>
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
                    placeholder="Ex: São Paulo, SP (ou Remoto)"
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Salário Mínimo
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: R$ 7.000"
                      value={jobSalaryMin}
                      onChange={(e) => setJobSalaryMin(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Salário Máximo
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: R$ 10.000"
                      value={jobSalaryMax}
                      onChange={(e) => setJobSalaryMax(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-500"
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
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-500"
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
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-500"
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
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Benefícios
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ex: VR, VA, Plano de Saúde, PLR..."
                    value={jobBenefits}
                    onChange={(e) => setJobBenefits(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-500"
                  />
                </div>
              </div>

              {/* Seção Skills e Pesos (REQUISITO 7) */}
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
                  Enviar vaga
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
