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

  const handleSwitchRole = async () => {
    setIsSwitching(true);
    try {
      const target = isCompany ? 'administrador' : 'empresa';
      await switchAccountType(target);
      showToast(`Conta alternada para modo ${target === 'empresa' ? 'Empresa' : 'Administrador'}!`, 'info', 'Perfil Alternado');
    } catch (err) {
      showToast('Erro ao alternar tipo de conta.', 'error');
    } finally {
      setIsSwitching(false);
    }
  };

  const userInitial = name ? name.charAt(0).toUpperCase() : (user?.name?.charAt(0).toUpperCase() || '👤');

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header com Título da Página */}
      <Header
        title="Minha Conta & Perfil Corporativo"
        description="Gerencie os dados cadastrais da sua conta, níveis de acesso corporativo e diretrizes de conformidade ética."
      >
        <Button
          variant="outline"
          size="sm"
          onClick={handleSwitchRole}
          disabled={isSwitching}
          icon={<RefreshCw className={`w-3.5 h-3.5 ${isSwitching ? 'animate-spin' : ''}`} />}
        >
          {isCompany ? 'Alternar para Admin' : 'Alternar para Empresa'}
        </Button>
      </Header>

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
                <Badge variant={isCompany ? 'indigo' : 'default'} className="text-xs">
                  {isCompany ? 'Perfil Empresa' : 'Administrador do Sistema'}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de Dados Cadastrais (2 colunas em telas grandes) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Informações da Conta</h3>
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
                      placeholder="admin@itmatcher.com.br"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121215] border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      placeholder="(11) 98765-4321"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121215] border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  {/* Empresa */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      Empresa / Instituição
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Tech Solutions"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121215] border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Departamento */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      Departamento / Área
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Recrutamento & Seleção"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121215] border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  {/* Cargo */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-slate-400" />
                      Papel de Acesso
                    </label>
                    <input
                      type="text"
                      value={role}
                      disabled
                      className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-500 dark:text-zinc-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-zinc-800">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={isSaving}
                    icon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Coluna Lateral: Conformidade, Segurança & Ações */}
        <div className="space-y-6">
          {/* Card de Guardrails & Conformidade */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100 dark:border-zinc-800">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Conformidade & Ética</h3>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">Diretrizes ativas no seu perfil</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800">
                  <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">RG01 & RG02: Privacidade</span>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                      Mascaramento de dados e isolamento de permissões ativos.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800">
                  <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">RG03: Decisão Humana</span>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                      O Smart Matching atua apenas como suporte à decisão do recrutador.
                    </p>
                  </div>
                </div>

                <Link
                  href="/compliance"
                  className="w-full flex items-center justify-between p-2.5 rounded-xl text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 font-bold transition-all border border-blue-200/60 dark:border-blue-900/40 text-xs"
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
                  onClick={handleSwitchRole}
                  disabled={isSwitching}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900 hover:bg-blue-50 dark:hover:bg-blue-950/50 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-xs font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <RefreshCw className={`w-3.5 h-3.5 ${isSwitching ? 'animate-spin' : ''}`} />
                    <span>{isCompany ? 'Mudar para Administrador' : 'Mudar para Empresa'}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-red-50/80 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-950/70 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 transition-colors text-xs font-bold"
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

      {/* Modal de confirmação de Logout */}
      <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} />
    </div>
  );
}
