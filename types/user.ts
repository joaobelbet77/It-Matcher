export type UserRole = 'ADMIN' | 'COMPANY' | 'Administrador' | 'Empresa' | 'Recrutador' | 'Auditor' | 'RECRUITER';
export type UserAccountType = 'administrador' | 'empresa' | 'recrutador' | 'ADMIN' | 'COMPANY' | 'RECRUITER';

export interface CompanyData {
  id?: string;
  name: string;
  cnpj?: string;
  email: string;
  phone?: string;
  contactName?: string;
  companyType?: string;
  companyIndustry?: string;
  segment?: string;
  companySize?: string;
  city?: string;
  state?: string;
  country?: string;
  website?: string;
  description?: string;
  logo?: string;
  jobsCount?: number;
  candidatesCount?: number;
  partnershipStatus?: string;
  jobId?: string;
  createdAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole | string;
  tipoUsuario?: UserAccountType;
  avatarUrl?: string;
  company?: string;
  department?: string;
  phone?: string;
  companyData?: CompanyData;
  jobId?: string;
  createdAt?: string;
}

export interface UpdateUserProfileInput {
  name: string;
  email: string;
  role?: UserRole | string;
  tipoUsuario?: UserAccountType;
  company?: string;
  department?: string;
  phone?: string;
  avatarUrl?: string;
  companyData?: CompanyData;
}

export const CURRENT_USER: User = {
  id: 'usr_admin_01',
  name: 'Administrador do Sistema',
  email: 'admin@itmatcher.com.br',
  role: 'Administrador',
  tipoUsuario: 'administrador',
  company: 'IT Matcher Platform',
  department: 'Administração Geral & Triagem Técnica',
  phone: '(11) 98765-4321',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  createdAt: '2026-01-15T09:00:00Z'
};
