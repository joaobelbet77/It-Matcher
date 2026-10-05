'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthContext';
import { useToast } from '@/components/layout/Toast';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LogoutModal } from '@/components/auth/LogoutModal';
import {
  User as UserIcon,
  Mail,
  Phone,
  Building2,
  Briefcase,
  ShieldCheck,
  Shield,
  Key,
  CheckCircle2,
  RefreshCw,
  LogOut,
  ArrowRight,
  Sparkles,
  Lock,
  FileCheck,
  Check,
} from 'lucide-react';

export default function PerfilPage() {
  const { user, refreshUser, switchAccountType } = useAuth();
  const { showToast } = useToast();

  const isCompany = user?.tipoUsuario === 'empresa' || user?.role === 'COMPANY' || user?.role === 'Empresa';

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '(11) 98765-4321');
      setCompany(user.company || (isCompany ? (user.companyData?.name || 'Tech Solutions') : 'IT Matcher Platform'));
      setDepartment(user.department || (isCompany ? 'Recrutamento & Talent Acquisition' : 'Administração Geral & Triagem Técnica'));
      setRole(isCompany ? 'Empresa / Recrutador Corporativo' : (user.role || 'Administrador do Sistema'));
    }
  }, [user, isCompany]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Nome e e-mail são obrigatórios.', 'error', 'Campos Inválidos');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...user,
        name,
        email,
        phone,
        company,
        department,
        role: isCompany ? 'Empresa' : 'Administrador',
      };

      const res = await fetch('/api/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        await refreshUser();
        showToast('Perfil atualizado com sucesso!', 'success', 'Salvo');
      } else {
        showToast(data.error || 'Erro ao salvar perfil.', 'error', 'Falha');
      }
    } catch (error) {
      showToast('Erro de conexão ao salvar perfil.', 'error', 'Erro');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectAccountType = async (target: 'administrador' | 'empresa') => {
    if ((target === 'empresa' && isCompany) || (target === 'administrador' && !isCompany)) {
      return;
    }
    setIsSwitching(true);
    try {
      await switchAccountType(target);
      showToast(
        `Conta alterada com sucesso para modo ${target === 'empresa' ? 'Empresa' : 'Administrador'}!`,
        'success',
        'Acesso Alterado'
      );
    } catch (err) {
      showToast('Erro ao alternar tipo de conta.', 'error');
    } finally {
      setIsSwitching(false);
    }
  };

  const userInitial = name ? name.charAt(0).toUpperCase() : (user?.name?.charAt(0).toUpperCase() || '👤');

  return (
    <div className="space-y-6">
      {/* Header com Título da Página */}
      <Header
        title="Minha Conta & Perfil Corporativo"
        description="Gerencie os dados cadastrais da sua conta, níveis de acesso corporativo e diretrizes de conformidade ética."
      />

      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Cartão de Resumo do Perfil */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-blue-800/40">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 right-0 p-6 opacity-10 hidden sm:block">
            <ShieldCheck className="w-32 h-32" />
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Avatar Grande */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-600 border-2 border-blue-400/40 flex items-center justify-center text-white font-extrabold text-2xl sm:text-3xl shadow-lg shadow-blue-900/50">
                  {userInitial}
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#09090b] rounded-full" title="Sessão Ativa" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                    {name || user?.name || 'Administrador do Sistema'}
                  </h2>
                  <Badge variant={isCompany ? 'info' : 'default'} className="text-xs">
                    {isCompany ? 'Modo Empresa Ativo' : 'Modo Administrador Ativo'}
                  </Badge>
                </div>

                <p className="text-xs sm:text-sm text-blue-200/80 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>{email || user?.email || 'admin@itmatcher.com.br'}</span>
                </p>
                <p className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{company} • {department}</span>
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto justify-end pt-4 sm:pt-0 border-t border-white/10 sm:border-0">
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Sessão Autenticada
              </span>
              <span className="text-[10px] text-zinc-400">ID: {user?.id || 'usr_admin_01'}</span>
            </div>
          </div>
        </div>

        {/* SEÇÃO PRINCIPAL DE TROCA DE TIPO DE CONTA (ADMIN vs EMPRESA) */}
        <Card className="border-blue-500/30 bg-white dark:bg-[#121215] shadow-md">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <RefreshCw className={`w-4 h-4 ${isSwitching ? 'animate-spin' : ''}`} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Tipo de Acesso da Conta</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Selecione o modo de visualização e permissões do sistema</p>
                </div>
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-lg border border-blue-200 dark:border-blue-900/60">
                {isCompany ? 'Empresa' : 'Administrador'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Opção: Administrador */}
              <button
                type="button"
                onClick={() => handleSelectAccountType('administrador')}
                disabled={isSwitching}
                className={`p-5 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                  !isCompany
                    ? 'border-blue-600 dark:border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 shadow-sm ring-2 ring-blue-600/20'
                    : 'border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 hover:border-slate-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      !isCompany ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                    }`}>
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Painel do Administrador</h4>
                      <span className="text-[11px] text-slate-500 dark:text-zinc-400">Gestão Global da Plataforma</span>
                    </div>
                  </div>
                  {!isCompany && (
                    <span className="p-1 rounded-full bg-blue-600 text-white">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed mb-4">
                  Acesso total: banco de candidatos, criação e gestão de vagas, matriz de compatibilidade ponderada, trilha de auditoria e empresas parceiras.
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 dark:border-zinc-800/80">
                  <span className={`text-[11px] font-bold ${!isCompany ? 'text-blue-700 dark:text-blue-400' : 'text-slate-500 dark:text-zinc-400'}`}>
                    {!isCompany ? '● Modo Ativo Atualmente' : 'Clique para Ativar Modo Admin'}
                  </span>
                  <Link
                    href="/dashboard"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    Ir ao Dashboard &rarr;
                  </Link>
                </div>
              </button>

              {/* Opção: Empresa */}
              <button
                type="button"
                onClick={() => handleSelectAccountType('empresa')}
                disabled={isSwitching}
                className={`p-5 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                  isCompany
                    ? 'border-blue-600 dark:border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 shadow-sm ring-2 ring-blue-600/20'
                    : 'border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 hover:border-slate-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      isCompany ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                    }`}>
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Portal da Empresa</h4>
                      <span className="text-[11px] text-slate-500 dark:text-zinc-400">Ambiente do Contratante</span>
                    </div>
                  </div>
                  {isCompany && (
                    <span className="p-1 rounded-full bg-blue-600 text-white">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed mb-4">
                  Acesso corporativo: cadastro de vagas da empresa, acompanhamento do status, visualização de candidatos ranqueados e pareceres técnicos.
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 dark:border-zinc-800/80">
                  <span className={`text-[11px] font-bold ${isCompany ? 'text-blue-700 dark:text-blue-400' : 'text-slate-500 dark:text-zinc-400'}`}>
                    {isCompany ? '● Modo Ativo Atualmente' : 'Clique para Ativar Modo Empresa'}
                  </span>
                  <Link
                    href="/empresa"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    Ir à Área da Empresa &rarr;
                  </Link>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário de Dados Cadastrais */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">Informações Cadastrais</h3>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">Atualize seus dados pessoais e institucionais</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Nome */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                        <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Carlos Eduardo Silva"
                        required
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121215] border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    {/* E-mail */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        E-mail Institucional
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Ex: carlos@empresa.com.br"
                        required
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121215] border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    {/* Telefone */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        Telefone / Ramal
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ex: (11) 98765-4321"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121215] border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    {/* Organização */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        Empresa / Organização
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Ex: Tech Solutions"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121215] border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    {/* Departamento */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        Departamento / Área
                      </label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="Ex: Recrutamento & Talent Acquisition"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121215] border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-zinc-800">
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      isLoading={isSaving}
                      icon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      Salvar Alterações
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita: Atalhos & Segurança */}
          <div className="space-y-6">
            {/* Card de Guardrails Éticos (RG01-RG10) */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100 dark:border-zinc-800">
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Conformidade & Ética</h3>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">Guardrails ativos no sistema</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-600 dark:text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-blue-500" />
                    <span><strong>RG01:</strong> Dados PII Protegidos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-purple-500" />
                    <span><strong>RG03:</strong> Decisão 100% Humana</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span><strong>RG10:</strong> Trilha de Auditoria Ativa</span>
                  </div>

                  <Link
                    href="/compliance"
                    className="w-full flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800 text-blue-600 dark:text-blue-400 hover:underline font-bold text-xs"
                  >
                    <span>Ver todas as 10 regras (RG01-10)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Card de Segurança da Conta & Logout */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100 dark:border-zinc-800">
                  <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Segurança & Sessão</h3>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">Controle de acesso da conta</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-red-50/80 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-950/70 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 transition-colors text-xs font-bold cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <LogOut className="w-3.5 h-3.5 text-red-500" />
                      <span>Sair da Conta</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de confirmação de Logout */}
      <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} />
    </div>
  );
}
