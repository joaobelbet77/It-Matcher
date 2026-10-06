'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/components/auth/AuthContext';
import { useToast } from '@/components/layout/Toast';
import { useTheme } from '@/components/layout/ThemeContext';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Building2,
  User,
  Zap,
  TrendingUp,
  Sun,
  Moon,
  UserPlus,
  LogIn,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();
  const { isDarkMode, toggleTheme } = useTheme();

  // Modo: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Tipo de conta: 'candidato' | 'empresa' | 'administrador'
  const [accountType, setAccountType] = useState<'candidato' | 'empresa' | 'administrador'>('candidato');
  
  // Campos de Formulário
  const [name, setName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [skills, setSkills] = useState('');
  const [email, setEmail] = useState('candidato@itmatcher.com.br');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAccountTypeChange = (type: 'candidato' | 'empresa' | 'administrador') => {
    setAccountType(type);
    setErrorMessage(null);
    if (authMode === 'login') {
      if (type === 'candidato') {
        setEmail('candidato@itmatcher.com.br');
        setPassword('123456');
      } else if (type === 'empresa') {
        setEmail('empresa@techsolutions.com.br');
        setPassword('123456');
      } else {
        setEmail('admin@itmatcher.com.br');
        setPassword('123456');
      }
    }
  };

  const handleModeSwitch = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setErrorMessage(null);
    if (mode === 'register') {
      setName('');
      setRoleTitle('');
      setSkills('');
      setEmail('');
      setPassword('');
    } else {
      handleAccountTypeChange(accountType);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (!email.trim() || !password.trim()) {
        throw new Error('Por favor, preencha todos os campos obrigatórios.');
      }

      if (authMode === 'register' && !name.trim()) {
        throw new Error('Por favor, informe seu nome completo.');
      }

      const isCompany = accountType === 'empresa';

      // Se for registro de candidato, salva o perfil
      if (authMode === 'register' && accountType === 'candidato') {
        const candidateProfile = {
          name: name.trim(),
          email: email.trim(),
          roleTitle: roleTitle.trim() || 'Profissional de TI',
          skills: skills.trim() || 'React, TypeScript, Node.js',
          isLoggedIn: true
        };
        localStorage.setItem('itmatcher_candidate_profile', JSON.stringify(candidateProfile));
      }

      const success = await login(email, password, accountType);

      if (success) {
        showToast(
          authMode === 'register' ? 'Conta criada com sucesso! Bem-vindo(a) ao ItMatcher.' : 'Login efetuado com sucesso!',
          'success'
        );
        if (accountType === 'candidato') {
          router.push('/');
        } else if (accountType === 'empresa') {
          router.push('/empresa');
        } else {
          router.push('/dashboard');
        }
      } else {
        throw new Error('E-mail ou senha inválidos. Tente novamente.');
      }
    } catch (err: any) {
      const msg = err.message || 'Erro durante a autenticação.';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      const fallbackEmail = accountType === 'candidato' ? 'candidato@itmatcher.com.br' : accountType === 'empresa' ? 'empresa@techsolutions.com.br' : 'admin@itmatcher.com.br';
      await login(email || fallbackEmail, 'google-auth', accountType);
      showToast('Autenticado via Google com sucesso!', 'success');
      if (accountType === 'candidato') {
        router.push('/');
      } else if (accountType === 'empresa') {
        router.push('/empresa');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      showToast('Erro ao autenticar com o Google.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50 dark:bg-[#090a0f] text-slate-900 dark:text-zinc-100 font-sans transition-colors relative">
      
      {/* Botão de Tema Flutuante */}
      <button
        onClick={toggleTheme}
        className="fixed top-5 right-5 z-50 p-2.5 rounded-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121215] text-slate-700 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white shadow-md hover:scale-105 transition-all cursor-pointer"
        title={isDarkMode ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
        aria-label="Alternar tema"
      >
        {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
      </button>

      {/* PAINEL ESQUERDO (VISUAL CORPORATIVO COM ALVO AZUL & GRADIENTE) */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-900 via-blue-700 to-sky-600 text-white relative overflow-hidden">
        {/* Círculos translúcidos decorativos */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/10 blur-xl pointer-events-none" />

        {/* Topo do Painel Esquerdo: Logo com Alvo Azul */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-3">
            {/* Alvo Azul Corporativo */}
            <div className="w-11 h-11 rounded-2xl bg-blue-600 border border-white/20 flex items-center justify-center text-white font-black shadow-xl shadow-blue-950/40">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="5.2" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="2" fill="white" stroke="white" strokeWidth="0.5" />
              </svg>
            </div>
            <span className="font-heading font-black text-2xl tracking-tight text-white leading-none">
              ItMatcher
            </span>
          </div>
        </div>

        {/* Conteúdo Central do Painel Esquerdo */}
        <div className="relative z-10 max-w-lg space-y-6 my-auto py-12">
          <h2 className="text-3xl sm:text-4xl font-black font-heading tracking-tight text-white leading-tight">
            Seu próximo passo em TI começa aqui.
          </h2>

          <p className="text-blue-100 text-base leading-relaxed">
            Acesse as melhores oportunidades de engenharia de software e tecnologia conectadas ao seu perfil e competências técnicas.
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3.5 text-white/95 text-sm font-medium">
              <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span>Match em tempo real com vagas tech</span>
            </div>

            <div className="flex items-center gap-3.5 text-white/95 text-sm font-medium">
              <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span>Perfil seguro, verificado e auditável (RG01–RG10)</span>
            </div>

            <div className="flex items-center gap-3.5 text-white/95 text-sm font-medium">
              <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span>Direcionamento de carreira inteligente por competências</span>
            </div>
          </div>
        </div>

        {/* Estatísticas no Rodapé do Painel Esquerdo */}
        <div className="relative z-10 grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
          <div>
            <strong className="block text-2xl sm:text-3xl font-black font-heading text-white">+5.000</strong>
            <span className="text-xs text-blue-100 font-medium">Profissionais</span>
          </div>
          <div>
            <strong className="block text-2xl sm:text-3xl font-black font-heading text-white">+1.200</strong>
            <span className="text-xs text-blue-100 font-medium">Vagas ativas</span>
          </div>
          <div>
            <strong className="block text-2xl sm:text-3xl font-black font-heading text-white">98%</strong>
            <span className="text-xs text-blue-100 font-medium">Satisfação</span>
          </div>
        </div>
      </div>

      {/* PAINEL DIREITO (FORMULÁRIO DE ENTRAR / CRIAR CONTA) */}
      <div className="flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">

          {/* Logo Mobile */}
          <div className="lg:hidden flex items-center gap-3 pb-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/30">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="5.2" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="2" fill="white" stroke="white" strokeWidth="0.5" />
              </svg>
            </div>
            <span className="font-heading font-black text-2xl tracking-tight text-slate-900 dark:text-white leading-none">
              ItMatcher
            </span>
          </div>

          {/* Abas Alternar: Entrar vs Criar Conta */}
          <div className="flex bg-slate-200/80 dark:bg-zinc-900 p-1 rounded-2xl border border-slate-200 dark:border-zinc-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => handleModeSwitch('login')}
              className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white dark:bg-[#18181b] text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Entrar</span>
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('register')}
              className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-white dark:bg-[#18181b] text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Criar Conta</span>
            </button>
          </div>

          {/* Cabeçalho do Formulário */}
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-slate-900 dark:text-white">
              {authMode === 'login' ? 'Entrar na plataforma' : 'Cadastre-se gratuitamente'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
              {authMode === 'login'
                ? 'Informe suas credenciais para acessar sua área exclusiva.'
                : 'Crie sua conta para acessar vagas, candidaturas e avaliações técnicas.'}
            </p>
          </div>

          {/* Seletor de Perfil: Candidato | Empresa | Administrador */}
          <div className="p-1 bg-slate-100 dark:bg-zinc-900/80 rounded-2xl border border-slate-200 dark:border-zinc-800 grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => handleAccountTypeChange('candidato')}
              className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                accountType === 'candidato'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Candidato</span>
            </button>

            <button
              type="button"
              onClick={() => handleAccountTypeChange('empresa')}
              className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                accountType === 'empresa'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Empresa</span>
            </button>

            <button
              type="button"
              onClick={() => handleAccountTypeChange('administrador')}
              className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                accountType === 'administrador'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>

          {/* Mensagem de Erro */}
          {errorMessage && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
              <span className="font-bold">Aviso:</span> {errorMessage}
            </div>
          )}

          {/* Formulário Principal */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campos extras ao criar conta */}
            {authMode === 'register' && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 font-heading">
                    {accountType === 'empresa' ? 'Nome da Empresa / Razão Social' : 'Nome Completo'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={accountType === 'empresa' ? 'Ex: Tech Solutions SA' : 'Ex: Carlos Eduardo Silva'}
                    className="w-full px-4 py-3 bg-white dark:bg-[#121215] border border-slate-200 dark:border-zinc-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs"
                  />
                </div>

                {accountType === 'candidato' && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 font-heading">
                      Especialidade / Cargo Pretendido
                    </label>
                    <input
                      type="text"
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                      placeholder="Ex: Desenvolvedor Full Stack Sênior"
                      className="w-full px-4 py-3 bg-white dark:bg-[#121215] border border-slate-200 dark:border-zinc-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs"
                    />
                  </div>
                )}
              </>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 font-heading">
                E-mail {accountType === 'empresa' ? 'Corporativo' : ''}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#121215] border border-slate-200 dark:border-zinc-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 font-heading">
                Senha de Acesso
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                  className="w-full pl-10 pr-11 py-3 bg-white dark:bg-[#121215] border border-slate-200 dark:border-zinc-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 p-1 cursor-pointer"
                  title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Divisor "ou" */}
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-[1px] bg-slate-200 dark:bg-zinc-800" />
              <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium">ou</span>
              <div className="flex-1 h-[1px] bg-slate-200 dark:bg-zinc-800" />
            </div>

            {/* Botão Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121215] hover:bg-slate-50 dark:hover:bg-zinc-800/60 text-slate-700 dark:text-zinc-200 text-xs sm:text-sm font-semibold flex items-center justify-center gap-3 transition-all shadow-2xs cursor-pointer"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Continuar com o Google</span>
            </button>

            {/* Botão de Envio Principal */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              icon={<ArrowRight className="w-4 h-4" />}
              className="w-full justify-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-md shadow-blue-600/20 cursor-pointer mt-2"
            >
              {authMode === 'login'
                ? `Entrar como ${accountType === 'candidato' ? 'Candidato' : accountType === 'empresa' ? 'Empresa' : 'Administrador'}`
                : `Criar Conta & Acessar como ${accountType === 'candidato' ? 'Candidato' : accountType === 'empresa' ? 'Empresa' : 'Admin'}`}
            </Button>
          </form>

          {/* Rodapé Informativo & Alternador de Modo */}
          <div className="text-center pt-2 space-y-2">
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              {authMode === 'login' ? (
                <>
                  Não possui uma conta?{' '}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('register')}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Cadastre-se gratuitamente
                  </button>
                </>
              ) : (
                <>
                  Já tem conta registrada?{' '}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('login')}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Faça login aqui
                  </button>
                </>
              )}
            </p>

            <div className="pt-4 border-t border-slate-200/80 dark:border-zinc-800 text-[11px] text-slate-400 dark:text-zinc-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Ambiente Protegido & Conexão Criptografada (RG01–RG10)</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
