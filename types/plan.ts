export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  period: 'mês' | 'ano' | 'único';
  features: string[];
  maxJobs: number;
  maxMatches: number; // -1 for unlimited
  status: 'active' | 'inactive';
  isPopular?: boolean;
  badge?: string;
  createdAt: string;
}

export interface CreatePlanInput {
  name: string;
  description: string;
  price: number;
  period: 'mês' | 'ano' | 'único';
  features: string[];
  maxJobs?: number;
  maxMatches?: number;
  status?: 'active' | 'inactive';
  isPopular?: boolean;
  badge?: string;
}

export interface UpdatePlanInput extends Partial<CreatePlanInput> {
  id: string;
}

export interface Subscription {
  id: string;
  companyId: string;
  companyName: string;
  companyEmail: string;
  planId: string;
  planName: string;
  price: number;
  period: string;
  status: 'active' | 'cancelled' | 'expired';
  paymentMethod: 'PIX' | 'Cartão de Crédito' | 'Boleto Bancário';
  subscribedAt: string;
  expiresAt: string;
}
