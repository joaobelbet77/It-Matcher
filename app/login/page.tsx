'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/components/auth/AuthContext';
import { useToast } from '@/components/layout/Toast';
import { Lock, Mail, ShieldCheck, ArrowRight, ArrowLeft, Building2, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [loginType, setLoginType] = useState<'administrador' | 'empresa'>('administrador');
  const [email, setEmail] = useState('admin@itmatcher.com.br');
  const [password, setPassword] = useState('123456');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTabSwitch = (type: 'administrador' | 'empresa') => {
    setLoginType(type);
    if (type === 'administrador') {
      setEmail('admin@itmatcher.com.br');
    } else {
      setEmail('empresa@techsolutions.com.br');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const isCompany = loginType === 'empresa';
      const success = await login(email, password, isCompany);
      if (success) {
        showToast(`Login efetuado com sucesso como ${isCompany ? 'Empresa' : 'Administrador'}!`, 'success');
        router.push(isCompany ? '/empresa' : '/dashboard');
      }
    } catch (err: any) {
      showToast(err.message || 'Erro ao efetuar login', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Luzes de fundo decorativas */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/95 text-slate-100 rounded-3xl p-8 shadow-2xl border border-slate-800 relative z-10 space-y-6">
        {/* Logo Oficial com Alvo e Flecha Azul */}
        <div className="text-center space-y-2">
          <Logo size="xl" className="mx-auto" />
          <h2 className="text-xl font-black text-slate-100 tracking-tight pt-2">Acesso ao IT MATCHER</h2>
          <p className="text-xs text-slate-400">
            Plataforma de Smart Recruitment & Gestão de Vagas Tecnológicas
          </p>
        </div>

        {/* Abas de Seleção: Administrador vs Empresa */}
        <div className="flex bg-slate-950 p-1 rounded-xl gap-1 border border-slate-800">
          <button
            type="button"
            onClick={() => handleTabSwitch('administrador')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              loginType === 'administrador'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Administrador
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('empresa')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              loginType === 'empresa'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Conta Empresa
          </button>
        </div>

        {/* Formulário de Login */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              {loginType === 'empresa' ? 'E-mail da Empresa' : 'E-mail do Administrador'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-500"
                placeholder={loginType === 'empresa' ? 'empresa@tech.com.br' : 'admin@itmatcher.com.br'}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Senha de Acesso
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-950 text-slate-100 placeholder-slate-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Dica para Acesso Rápido de Demonstração */}
          <div className="p-3 bg-blue-950/60 border border-blue-900/60 rounded-xl text-xs text-blue-200 space-y-0.5">
            <span className="font-bold flex items-center gap-1 text-blue-300">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Modo {loginType === 'empresa' ? 'EMPRESA' : 'ADMINISTRADOR'}:
            </span>
            <p className="text-[11px] text-blue-300/80">
              {loginType === 'empresa'
                ? 'Acesse a área exclusiva da Empresa para cadastrar e gerenciar sua vaga.'
                : 'Acesse o painel completo de controle, gestão de empresas, vagas e candidatos.'}
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            icon={<ArrowRight className="w-5 h-5" />}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-md cursor-pointer"
          >
            {loginType === 'empresa' ? 'Entrar na Área da Empresa' : 'Entrar como Administrador'}
          </Button>

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-blue-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao Portal do Candidato</span>
            </Link>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-slate-800 text-[11px] text-slate-400">
          Guardrails Éticos & Segurança da Informação RG01–RG10 Ativos
        </div>
      </div>
    </div>
  );
}
