import { ClassificationType } from './matching';
import { ReviewStatus } from './review';

export interface AuditLog {
  id: string;
  action: 'MATCHING_CALCULATED' | 'REVIEW_UPDATED' | 'RESUME_UPLOADED' | 'JOB_CREATED' | 'CANDIDATE_CREATED' | 'SETTINGS_UPDATED' | 'PLAN_CREATED' | 'PLAN_UPDATED' | 'PLAN_DELETED' | 'SUBSCRIPTION_CREATED';
  timestamp: string;
  jobId?: string;
  jobTitle?: string;
  candidateId?: string;
  candidateName?: string;
  companyId?: string;
  companyName?: string;
  cnpj?: string;
  planId?: string;
  planName?: string;
  price?: number;
  paymentMethod?: string;
  changes?: any;
  score?: number;
  classification?: ClassificationType;
  matchedSkills?: string[];
  missingSkills?: string[];
  weightsUsed?: Record<string, number>;
  previousStatus?: ReviewStatus | string;
  newStatus?: ReviewStatus | string;
  actor: {
    name: string;
    role: 'Recrutador' | 'Auditor' | 'Administrador' | 'Sistema' | 'Empresa' | 'RECRUITER' | 'COMPANY' | string;
  };
  details: string;
  immutableHash: string; // Garantia de integridade do registro
}
