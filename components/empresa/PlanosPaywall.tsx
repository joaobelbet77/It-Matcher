'use client';

import React, { useState } from 'react';
import { Plan, Subscription } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/layout/Toast';
import { useAuth } from '@/components/auth/AuthContext';
import {
  Lock,
  Sparkles,
  CheckCircle2,
  CreditCard,
  QrCode,
  FileText,
  ShieldCheck,
  Zap,
  ArrowRight,
  Star,
  Check,
  Building2,
  X,
} from 'lucide-react';

interface PlanosPaywallProps {
  plans: Plan[];
  onSubscriptionSuccess?: (subscription: Subscription) => void;
  title?: string;
  subtitle?: string;
}

export const PlanosPaywall: React.FC<PlanosPaywallProps> = ({
  plans,
  onSubscriptionSuccess,
  title = 'Acesso Exclusivo: Smart Matching & Rankings de TI',
  subtitle = 'Escolha um plano corporativo para desbloquear a visualização completa de candidatos ranqueados, percentuais de compatibilidade e pareceres técnicos.',
}) => {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'Cartão de Crédito' | 'Boleto Bancário'>('PIX');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);

  // Form states de pagamento simulado
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8899');
  const [cardName, setCardName] = useState(user?.name || 'Tech Solutions');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');

  const activePlans = plans.filter((p) => p.status === 'active');

  const handleOpenCheckout = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setIsProcessing(true);
    try {
      const companyEmail = user?.companyData?.email || user?.email || 'empresa@techsolutions.com.br';

      const res = await fetch('/api/planos/assinar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan.id,
          companyEmail,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erro ao processar assinatura.');
      }

      await refreshUser();
      setActiveSubscription(data.data);
      setIsSuccessModalOpen(true);
      showToast(`Plano ${selectedPlan.name} ativado com sucesso!`, 'success', 'Pagamento Confirmado');

      if (onSubscriptionSuccess) {
        onSubscriptionSuccess(data.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Erro ao processar pagamento.', 'error', 'Falha no Pagamento');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner Principal de Bloqueio & Proposta de Valor */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-8 sm:p-10 border border-blue-800/40 text-white shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Lock className="w-48 h-48 text-blue-400" />
        </div>
        <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold font-heading">
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            <span>Recurso Corporativo Premium</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white leading-tight">
            {title}
          </h2>

          <p className="text-sm sm:text-base text-blue-100/80 leading-relaxed font-sans">
            {subtitle}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="block text-base font-bold text-white font-heading">⚡ Match Instantâneo</span>
              <span className="text-xs text-blue-200">Algoritmo ponderado por skills técnicas</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="block text-base font-bold text-white font-heading">🎯 Rankings Precisos</span>
              <span className="text-xs text-blue-200">Classificação em Alta, Média e Baixa aderência</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="block text-base font-bold text-white font-heading">🛡️ Conformidade RG01-10</span>
              <span className="text-xs text-blue-200">Trilha de auditoria e decisão 100% humana</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grade de Planos */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900 dark:text-white tracking-tight">
            Planos de Acesso Corporativo
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
            Selecione o plano mais adequado para o volume de contratações técnicas da sua empresa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activePlans.map((plan) => {
            const isHighlight = plan.isPopular;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 border ${
                  isHighlight
                    ? 'bg-gradient-to-b from-blue-900/10 via-white to-white dark:from-blue-950/40 dark:via-[#121215] dark:to-[#121215] border-blue-500 dark:border-blue-500 shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/30'
                    : 'bg-white dark:bg-[#121215] border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 shadow-sm'
                }`}
              >
                {/* Badge Destaque */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-md shadow-blue-600/30">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="pt-2">
                    <h4 className="text-lg font-black font-heading text-slate-900 dark:text-white">
                      {plan.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2">
                      {plan.description}
                    </p>
                  </div>

                  {/* Preço */}
                  <div className="py-2 border-y border-slate-100 dark:border-zinc-800/80">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-bold text-slate-400 dark:text-zinc-500">R$</span>
                      <span className="text-3xl sm:text-4xl font-black font-heading text-slate-900 dark:text-white">
                        {plan.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                        /{plan.period}
                      </span>
                    </div>
                  </div>

                  {/* Limites */}
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-300 font-medium">
                    <div className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-blue-500" />
                      <span>{plan.maxJobs === -1 ? 'Vagas Ilimitadas' : `Até ${plan.maxJobs} vagas ativas`}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                      <span>{plan.maxMatches === -1 ? 'Candidatos Ilimitados por vaga' : `Até ${plan.maxMatches} candidatos/vaga`}</span>
                    </div>
                  </div>

                  {/* Lista de Recursos */}
                  <div className="pt-2 space-y-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-heading block">
                      Recursos Inclusos:
                    </span>
                    <ul className="space-y-2">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-zinc-300">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-zinc-800">
                  <Button
                    variant={isHighlight ? 'primary' : 'outline'}
                    size="md"
                    className="w-full justify-center"
                    onClick={() => handleOpenCheckout(plan)}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Assinar {plan.name}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Checkout / Pagamento */}
      {selectedPlan && !isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121215] border border-slate-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                    Checkout Seguro • {selectedPlan.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Valor: R$ {selectedPlan.price.toFixed(2)} / {selectedPlan.period}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlan(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Seleção do Método de Pagamento */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider block font-heading">
                Forma de Pagamento
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('PIX')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'PIX'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400'
                      : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-emerald-500" />
                  <span>PIX Instantâneo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cartão de Crédito')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'Cartão de Crédito'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400'
                      : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-500" />
                  <span>Cartão de Crédito</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Boleto Bancário')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'Boleto Bancário'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400'
                      : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <FileText className="w-5 h-5 text-amber-500" />
                  <span>Boleto Bancário</span>
                </button>
              </div>
            </div>

            {/* Conteúdo Dinâmico por Método */}
            <form onSubmit={handleConfirmPayment} className="space-y-4">
              {paymentMethod === 'PIX' && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-center space-y-3">
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 block">
                    ⚡ Liberação Imediata via Chave / QR Code PIX
                  </span>
                  <div className="w-36 h-36 bg-white p-2 rounded-xl mx-auto shadow-sm flex items-center justify-center border border-slate-200">
                    <QrCode className="w-28 h-28 text-slate-900" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                    Chave PIX: <code className="font-mono font-bold text-emerald-700 dark:text-emerald-400">financeiro@itmatcher.com.br</code>
                  </p>
                </div>
              )}

              {paymentMethod === 'Cartão de Crédito' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-zinc-300">Número do Cartão</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-zinc-300">Validade</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-zinc-300">CVV</label>
                      <input
                        type="text"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'Boleto Bancário' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-center space-y-2 text-xs text-slate-600 dark:text-zinc-300">
                  <FileText className="w-8 h-8 text-amber-500 mx-auto" />
                  <p className="font-bold text-slate-900 dark:text-white">Boleto com compensação automática</p>
                  <p className="text-[11px] text-slate-500">O código de barras será emitido e a conta liberada.</p>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedPlan(null)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isProcessing}
                  icon={<ShieldCheck className="w-4 h-4" />}
                >
                  Confirmar Assinatura (R$ {selectedPlan.price.toFixed(2)})
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Sucesso */}
      {isSuccessModalOpen && activeSubscription && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121215] border border-emerald-500/40 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-black font-heading text-slate-900 dark:text-white">
                Assinatura Ativada!
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                Sua empresa agora possui acesso completo ao Smart Matching e todos os rankings de candidatos técnicos.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-left space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Plano Ativo:</span>
                <strong className="text-slate-900 dark:text-white">{activeSubscription.planName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">● Ativo & Desbloqueado</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Método:</span>
                <span className="text-slate-700 dark:text-zinc-300">{activeSubscription.paymentMethod}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full justify-center"
              onClick={() => {
                setIsSuccessModalOpen(false);
                setSelectedPlan(null);
                window.location.reload();
              }}
            >
              Acessar Rankings de Candidatos &rarr;
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
