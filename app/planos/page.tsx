'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/layout/Toast';
import { Plan, Subscription } from '@/types';
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Users,
  TrendingUp,
  DollarSign,
  Zap,
  Sparkles,
  ShieldCheck,
  Check,
  X,
  AlertCircle,
  Building2,
  Calendar,
} from 'lucide-react';

export default function AdminPlanosPage() {
  const { showToast } = useToast();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal de Criação / Edição de Plano
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('199');
  const [period, setPeriod] = useState<'mês' | 'ano' | 'único'>('mês');
  const [maxJobs, setMaxJobs] = useState('5');
  const [maxMatches, setMaxMatches] = useState('-1');
  const [featuresText, setFeaturesText] = useState('Acesso ao Smart Matching\nVisualização de Rankings\nRelatórios de Compatibilidade');
  const [badge, setBadge] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const fetchPlansData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/planos');
      const data = await res.json();
      if (data.success) {
        setPlans(data.data);
      }
    } catch (e) {
      console.error(e);
      showToast('Erro ao carregar planos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlansData();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingPlan(null);
    setName('');
    setDescription('');
    setPrice('299');
    setPeriod('mês');
    setMaxJobs('5');
    setMaxMatches('-1');
    setFeaturesText('Acesso ao Smart Matching & Rankings\nDetalhamento de Competências Ponderadas\nSuporte Prioritário');
    setBadge('');
    setIsPopular(false);
    setStatus('active');
    setShowModal(true);
  };

  const handleOpenEditModal = (plan: Plan) => {
    setEditingPlan(plan);
    setName(plan.name);
    setDescription(plan.description);
    setPrice(plan.price.toString());
    setPeriod(plan.period);
    setMaxJobs(plan.maxJobs.toString());
    setMaxMatches(plan.maxMatches.toString());
    setFeaturesText(plan.features.join('\n'));
    setBadge(plan.badge || '');
    setIsPopular(!!plan.isPopular);
    setStatus(plan.status);
    setShowModal(true);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      showToast('Nome e Preço são obrigatórios.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const features = featuresText.split('\n').map((f) => f.trim()).filter(Boolean);
      const payload = {
        name,
        description,
        price: parseFloat(price),
        period,
        maxJobs: parseInt(maxJobs) || 5,
        maxMatches: parseInt(maxMatches) || -1,
        features,
        badge,
        isPopular,
        status,
      };

      let res;
      if (editingPlan) {
        res = await fetch('/api/planos', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingPlan.id, ...payload }),
        });
      } else {
        res = await fetch('/api/planos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erro ao salvar plano.');
      }

      showToast(`Plano ${editingPlan ? 'atualizado' : 'criado'} com sucesso!`, 'success');
      setShowModal(false);
      fetchPlansData();
    } catch (err: any) {
      showToast(err.message || 'Erro ao salvar plano.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePlan = async (id: string, planName: string) => {
    if (!confirm(`Tem certeza que deseja excluir o plano "${planName}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/planos?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erro ao excluir plano.');
      }
      showToast(`Plano "${planName}" excluído com sucesso!`, 'info');
      fetchPlansData();
    } catch (err: any) {
      showToast(err.message || 'Erro ao excluir plano.', 'error');
    }
  };

  const handleToggleStatus = async (plan: Plan) => {
    const newStatus = plan.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch('/api/planos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: plan.id, status: newStatus }),
      });
      if (res.ok) {
        showToast(`Plano ${newStatus === 'active' ? 'ativado' : 'desativado'} com sucesso!`, 'info');
        fetchPlansData();
      }
    } catch (e) {
      showToast('Erro ao atualizar status', 'error');
    }
  };

  const activePlansCount = plans.filter((p) => p.status === 'active').length;
  const estimatedRevenue = plans.reduce((acc, p) => acc + (p.status === 'active' ? p.price * 2 : 0), 2490.00);

  return (
    <div className="space-y-6">
      <Header
        title="Gestão de Planos & Monetização"
        description="Configure os planos de assinatura corporativa, valores, limites de matching e pacotes de acesso para empresas contratantes"
      >
        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenCreateModal}
          icon={<Plus className="w-4 h-4" />}
        >
          Novo Plano
        </Button>
      </Header>

      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#121215] p-5 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-400 block">Planos Cadastrados</span>
              <span className="text-2xl font-black font-heading text-slate-900 dark:text-white">{plans.length}</span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">{activePlansCount} ativos</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#121215] p-5 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-400 block">MRR Estimado</span>
              <span className="text-2xl font-black font-heading text-slate-900 dark:text-white">R$ {estimatedRevenue.toFixed(2)}</span>
              <span className="text-[11px] text-slate-500 dark:text-zinc-400 block mt-0.5">Receita recorrente mensal</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#121215] p-5 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-400 block">Empresas Habilitadas</span>
              <span className="text-2xl font-black font-heading text-slate-900 dark:text-white">14</span>
              <span className="text-[11px] text-purple-600 dark:text-purple-400 font-bold block mt-0.5">Parceiras ativas</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#121215] p-5 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-400 block">Ticket Médio</span>
              <span className="text-2xl font-black font-heading text-slate-900 dark:text-white">R$ 565,00</span>
              <span className="text-[11px] text-slate-500 dark:text-zinc-400 block mt-0.5">Média por contratação</span>
            </div>
          </div>
        </div>

        {/* Grade de Planos Configuráveis */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">
              Planos Oferecidos às Empresas Contratantes
            </h3>
            <span className="text-xs text-slate-500 dark:text-zinc-400">
              {plans.length} planos cadastrados
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500">
              <span className="animate-spin w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full inline-block mb-2" />
              <p className="text-xs">Carregando catálogo de planos...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const isActive = plan.status === 'active';

                return (
                  <Card
                    key={plan.id}
                    className={`relative flex flex-col justify-between transition-all ${
                      !isActive ? 'opacity-60 bg-slate-50 dark:bg-zinc-950' : 'hover:border-blue-500/50'
                    }`}
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-base font-heading text-slate-900 dark:text-white">
                              {plan.name}
                            </h4>
                            {plan.isPopular && (
                              <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full">
                                Destaque
                              </span>
                            )}
                          </div>
                          {plan.badge && (
                            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                              {plan.badge}
                            </span>
                          )}
                        </div>

                        <Badge variant={isActive ? 'success' : 'default'} size="sm">
                          {isActive ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2">
                        {plan.description}
                      </p>

                      <div className="py-2 border-y border-slate-100 dark:border-zinc-800 flex items-baseline gap-1">
                        <span className="text-xs text-slate-400 font-bold">R$</span>
                        <span className="text-3xl font-black font-heading text-slate-900 dark:text-white">
                          {plan.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">/{plan.period}</span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-300 font-medium">
                        <div className="flex items-center gap-2">
                          <Zap className="w-3.5 h-3.5 text-blue-500" />
                          <span>{plan.maxJobs === -1 ? 'Vagas Ilimitadas' : `Até ${plan.maxJobs} vagas`}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                          <span>{plan.maxMatches === -1 ? 'Candidatos Ilimitados' : `Até ${plan.maxMatches} candidatos/vaga`}</span>
                        </div>
                      </div>

                      {/* Benefícios */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-heading block">
                          Recursos ({plan.features.length}):
                        </span>
                        <ul className="space-y-1.5">
                          {plan.features.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-zinc-300">
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Ações */}
                      <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleToggleStatus(plan)}
                          className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-colors ${
                            isActive
                              ? 'text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                              : 'text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                          }`}
                        >
                          {isActive ? 'Desativar' : 'Ativar'}
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(plan)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                            title="Editar Plano"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePlan(plan.id, plan.name)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                            title="Excluir Plano"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Criação / Edição de Plano */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121215] border border-slate-200 dark:border-zinc-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                    {editingPlan ? 'Editar Plano Corporativo' : 'Novo Plano Corporativo'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Defina preços, limites de matching e benefícios
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Nome do Plano *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Plano Growth / Recrutamento Ágil"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Descrição Comercial</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Ideal para empresas com mais de 5 vagas abertas por mês"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Preço (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="499.00"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Periodicidade</label>
                  <select
                    value={period}
                    onChange={(e: any) => setPeriod(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  >
                    <option value="mês">Mensal (mês)</option>
                    <option value="ano">Anual (ano)</option>
                    <option value="único">Pagamento Único (por vaga)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Limite de Vagas (-1 para ilimitado)</label>
                  <input
                    type="number"
                    value={maxJobs}
                    onChange={(e) => setMaxJobs(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Limite de Candidatos/Vaga (-1 para ilimitado)</label>
                  <input
                    type="number"
                    value={maxMatches}
                    onChange={(e) => setMaxMatches(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                  Benefícios e Recursos (um por linha)
                </label>
                <textarea
                  rows={4}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder="Acesso ao Smart Matching&#10;Visualização Ilimitada de Candidatos&#10;Relatórios Detalhados"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">Badge Promocional</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Ex: Mais Popular / Oferta"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5 flex flex-col justify-end pb-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPopular}
                      onChange={(e) => setIsPopular(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Destacar como "Mais Popular"</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSaving}
                  icon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Salvar Plano
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
