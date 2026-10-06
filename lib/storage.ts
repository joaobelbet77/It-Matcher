import { Job, Candidate, HumanReview, AuditLog, CreateJobInput, CreateCandidateInput, CreateReviewInput, User, UpdateUserProfileInput, CURRENT_USER, Plan, CreatePlanInput, UpdatePlanInput, Subscription } from '@/types';
import { INITIAL_JOBS, INITIAL_CANDIDATES, INITIAL_REVIEWS, INITIAL_AUDIT_LOGS, INITIAL_PARTNER_COMPANIES, INITIAL_PLANS } from './mock-data';
import { createAuditLogEntry } from './security';

// Armazenamento em memória (Singleton padrão para Node.js / Next.js)
class InMemoryDataStore {
  private jobs: Map<string, Job> = new Map();
  private candidates: Map<string, Candidate> = new Map();
  private reviews: Map<string, HumanReview> = new Map();
  private auditLogs: AuditLog[] = [];
  private companyAccounts: Map<string, User> = new Map();
  private plans: Map<string, Plan> = new Map();
  private subscriptions: Subscription[] = [];
  private currentUser: User = { ...CURRENT_USER };

  constructor() {
    this.seed();
  }

  private seed() {
    INITIAL_JOBS.forEach((job) => this.jobs.set(job.id, { ...job }));
    INITIAL_CANDIDATES.forEach((cand) => this.candidates.set(cand.id, { ...cand }));
    INITIAL_REVIEWS.forEach((rev) => this.reviews.set(`${rev.jobId}_${rev.candidateId}`, { ...rev }));
    INITIAL_PLANS.forEach((plan) => this.plans.set(plan.id, { ...plan }));
    this.auditLogs = [...INITIAL_AUDIT_LOGS];

    // Seed de Empresas Parceiras para listagem completa
    INITIAL_PARTNER_COMPANIES.forEach((comp) => {
      this.companyAccounts.set(comp.email.toLowerCase(), { ...comp } as User);
    });
  }

  // --- CONTAS DE EMPRESA & AUTENTICAÇÃO ---
  public getCompanyByEmail(email: string): User | undefined {
    return this.companyAccounts.get(email.toLowerCase().trim());
  }

  public registerCompany(input: any): User {
    const emailKey = input.email.toLowerCase().trim();
    if (this.companyAccounts.has(emailKey)) {
      throw new Error('Este e-mail já está vinculado a uma empresa.');
    }

    const companyId = `emp-${Date.now().toString().slice(-4)}`;
    const newCompanyUser: User = {
      id: companyId,
      name: input.name,
      email: input.email.trim(),
      role: 'COMPANY',
      tipoUsuario: 'empresa',
      company: input.name,
      companyData: {
        id: companyId,
        name: input.name,
        cnpj: input.cnpj || '00.000.000/0001-00',
        email: input.email.trim(),
        phone: input.phone || '',
        contactName: input.contactName || '',
        companyType: input.companyType || 'Empresa de Tecnologia',
        companyIndustry: input.companyIndustry || 'Desenvolvimento de Software',
        companySize: input.companySize || '51–200 funcionários',
        city: input.city || 'São Paulo',
        state: input.state || 'SP',
        country: input.country || 'Brasil',
        website: input.website || '',
        description: input.description || '',
        createdAt: new Date().toISOString(),
      }
    };

    this.companyAccounts.set(emailKey, newCompanyUser);

    this.addAuditLog(
      createAuditLogEntry('CANDIDATE_CREATED', `Empresa "${newCompanyUser.name}" (${newCompanyUser.email}) cadastrada com sucesso.`, {
        companyId: newCompanyUser.id,
        companyName: newCompanyUser.name,
        cnpj: newCompanyUser.companyData?.cnpj,
      })
    );

    return newCompanyUser;
  }

  public getCompanyAccounts(): User[] {
    return Array.from(this.companyAccounts.values());
  }

  public setCurrentUser(user: User): User {
    this.currentUser = { ...user };
    return { ...this.currentUser };
  }

  public getCompanyJob(companyIdOrEmail: string): Job | undefined {
    return Array.from(this.jobs.values()).find(
      (job) => job.companyId === companyIdOrEmail || job.companyId === companyIdOrEmail.toLowerCase()
    );
  }

  // --- PERFIL DO USUÁRIO ATIVO ---
  public getUserProfile(): User {
    return { ...this.currentUser };
  }

  public updateUserProfile(input: UpdateUserProfileInput): User {
    this.currentUser = {
      ...this.currentUser,
      ...input,
    };

    if (input.companyData) {
      this.currentUser.companyData = { ...input.companyData };
      if (this.currentUser.email) {
        this.companyAccounts.set(this.currentUser.email.toLowerCase(), { ...this.currentUser });
      }
    }

    this.addAuditLog(
      createAuditLogEntry(
        'REVIEW_UPDATED',
        `Perfil de "${this.currentUser.name}" atualizado com sucesso.`,
        {
          actor: {
            name: this.currentUser.name,
            role: this.currentUser.role,
          }
        }
      )
    );

    return { ...this.currentUser };
  }

  // --- VAGAS (JOBS) ---
  public getJobs(): Job[] {
    return Array.from(this.jobs.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  public getJobById(id: string): Job | undefined {
    return this.jobs.get(id);
  }

  public createJob(input: CreateJobInput): Job {
    // REGRA DE NEGÓCIO E SEGURANÇA 5 & 11: UMA ÚNICA VAGA POR EMPRESA
    const companyIdentifier = input.companyId || (this.currentUser.tipoUsuario === 'empresa' ? (this.currentUser.companyData?.id || this.currentUser.email) : undefined);

    if (companyIdentifier) {
      const existingCompanyJob = this.getCompanyJob(companyIdentifier);
      if (existingCompanyJob) {
        throw new Error('Esta conta já possui uma vaga cadastrada.');
      }
    }

    const id = `vaga-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();
    
    const newJob: Job = {
      id,
      title: input.title,
      area: input.area,
      level: input.level,
      minExperienceYears: input.minExperienceYears,
      description: input.description,
      skills: input.skills.map((s, idx) => {
        const name = s.name || s.nome || '';
        const weight = s.weight !== undefined ? s.weight : (s.peso !== undefined ? s.peso : 0);
        const required = s.required !== undefined ? s.required : (s.obrigatoria !== undefined ? s.obrigatoria : true);
        return {
          id: `sk-${Date.now()}-${idx}`,
          name,
          weight,
          required,
          nome: name,
          peso: weight,
          obrigatoria: required,
        };
      }),
      status: 'ativa',
      createdAt: now,
      updatedAt: now,
      companyId: companyIdentifier,
      companyType: input.companyType || this.currentUser.companyData?.companyType,
      companyIndustry: input.companyIndustry || this.currentUser.companyData?.companyIndustry,
      companySize: input.companySize || this.currentUser.companyData?.companySize,
      companyCity: input.companyCity || this.currentUser.companyData?.city,
      companyState: input.companyState || this.currentUser.companyData?.state,
      companyCountry: input.companyCountry || this.currentUser.companyData?.country,
      companyLocation: input.companyLocation || (this.currentUser.companyData ? `${this.currentUser.companyData.city}, ${this.currentUser.companyData.state}, ${this.currentUser.companyData.country}` : [input.companyCity, input.companyState, input.companyCountry].filter(Boolean).join(', ')),
      companyWebsite: input.companyWebsite || this.currentUser.companyData?.website,
      companyDescription: input.companyDescription || this.currentUser.companyData?.description,
      workModel: input.workModel,
      location: input.location,
      salaryMin: input.salaryMin,
      salaryMax: input.salaryMax,
      salaryRange: input.salaryRange || (input.salaryMin && input.salaryMax ? `R$ ${input.salaryMin} - R$ ${input.salaryMax}` : undefined),
      contractType: input.contractType,
      mandatoryRequirements: input.mandatoryRequirements,
      desirableRequirements: input.desirableRequirements,
      benefits: input.benefits,
    };

    this.jobs.set(id, newJob);

    if (this.currentUser.tipoUsuario === 'empresa') {
      this.currentUser.jobId = id;
      if (this.currentUser.companyData) {
        this.currentUser.companyData.jobId = id;
      }
    }

    // Registro de auditoria RG10
    const weightsMap: Record<string, number> = {};
    newJob.skills.forEach(s => weightsMap[s.name] = s.weight);

    this.addAuditLog(
      createAuditLogEntry('JOB_CREATED', `Vaga "${newJob.title}" criada com ${newJob.skills.length} competências configuradas.`, {
        jobId: newJob.id,
        jobTitle: newJob.title,
        weightsUsed: weightsMap,
      })
    );

    return newJob;
  }

  // --- CANDIDATOS (CANDIDATES) ---
  public getCandidates(): Candidate[] {
    return Array.from(this.candidates.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getCandidateById(id: string): Candidate | undefined {
    return this.candidates.get(id);
  }

  public createCandidate(input: CreateCandidateInput): Candidate {
    const id = `cand-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();

    const newCandidate: Candidate = {
      id,
      name: input.name,
      email: input.email,
      phone: input.phone,
      experienceYears: input.experienceYears,
      technicalSkills: input.technicalSkills,
      level: input.level,
      bio: input.bio,
      resumeFileName: input.resumeFileName,
      resumeFileSize: input.resumeFileSize,
      resumeUploadedAt: input.resumeFileName ? now : undefined,
      hasResume: !!input.resumeFileName,
      createdAt: now,
      updatedAt: now,
    };

    this.candidates.set(id, newCandidate);

    // Registro de auditoria RG10
    this.addAuditLog(
      createAuditLogEntry('CANDIDATE_CREATED', `Candidato "${newCandidate.name}" cadastrado com ${newCandidate.technicalSkills.length} competências.`, {
        candidateId: newCandidate.id,
        candidateName: newCandidate.name,
      })
    );

    return newCandidate;
  }

  // --- REVISÕES HUMANAS (REVIEWS) ---
  public getReviews(): HumanReview[] {
    return Array.from(this.reviews.values()).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  public getReviewByJobAndCandidate(jobId: string, candidateId: string): HumanReview | undefined {
    return this.reviews.get(`${jobId}_${candidateId}`);
  }

  public saveReview(input: CreateReviewInput, score: number, jobTitle: string, candidateName: string): HumanReview {
    const key = `${input.jobId}_${input.candidateId}`;
    const existing = this.reviews.get(key);
    const now = new Date().toISOString();

    const review: HumanReview = {
      id: existing ? existing.id : `rev-${Date.now().toString().slice(-4)}`,
      jobId: input.jobId,
      candidateId: input.candidateId,
      candidateName,
      jobTitle,
      score,
      status: input.status,
      reviewerName: input.reviewerName || this.currentUser.name,
      reviewerRole: 'Recrutador',
      notes: input.notes,
      technicalFeedback: input.technicalFeedback,
      reviewedAt: now,
      createdAt: existing ? existing.createdAt : now,
      updatedAt: now,
    };

    this.reviews.set(key, review);

    // Registro de auditoria RG10
    this.addAuditLog(
      createAuditLogEntry(
        'REVIEW_UPDATED',
        `Revisão humana registrada para "${candidateName}" na vaga "${jobTitle}". Status definido como "${input.status}".`,
        {
          jobId: input.jobId,
          jobTitle,
          candidateId: input.candidateId,
          candidateName,
          score,
          previousStatus: existing ? existing.status : 'Pendente de revisão',
          newStatus: input.status,
          actor: {
            name: input.reviewerName || this.currentUser.name,
            role: 'Recrutador',
          },
        }
      )
    );

    return review;
  }

  // --- GESTÃO DE PLANOS & ASSINATURAS (MONETIZAÇÃO) ---
  public getPlans(): Plan[] {
    return Array.from(this.plans.values());
  }

  public getPlanById(id: string): Plan | undefined {
    return this.plans.get(id);
  }

  public createPlan(input: CreatePlanInput): Plan {
    const id = `plano-${Date.now().toString().slice(-6)}`;
    const newPlan: Plan = {
      id,
      name: input.name,
      description: input.description,
      price: Number(input.price),
      period: input.period || 'mês',
      features: input.features || [],
      maxJobs: input.maxJobs ?? 5,
      maxMatches: input.maxMatches ?? -1,
      status: input.status || 'active',
      isPopular: input.isPopular || false,
      badge: input.badge || '',
      createdAt: new Date().toISOString(),
    };

    this.plans.set(id, newPlan);

    this.addAuditLog(
      createAuditLogEntry('SETTINGS_UPDATED', `Plano "${newPlan.name}" (R$ ${newPlan.price}/${newPlan.period}) cadastrado com sucesso.`, {
        planId: newPlan.id,
        planName: newPlan.name,
        price: newPlan.price,
      })
    );

    return newPlan;
  }

  public updatePlan(input: UpdatePlanInput): Plan {
    const existing = this.plans.get(input.id);
    if (!existing) {
      throw new Error(`Plano com ID ${input.id} não encontrado.`);
    }

    const updated: Plan = {
      ...existing,
      ...input,
      price: input.price !== undefined ? Number(input.price) : existing.price,
    };

    this.plans.set(input.id, updated);

    this.addAuditLog(
      createAuditLogEntry('SETTINGS_UPDATED', `Plano "${updated.name}" atualizado.`, {
        planId: updated.id,
        changes: input,
      })
    );

    return updated;
  }

  public deletePlan(id: string): boolean {
    const existing = this.plans.get(id);
    if (!existing) return false;

    this.plans.delete(id);
    this.addAuditLog(
      createAuditLogEntry('SETTINGS_UPDATED', `Plano "${existing.name}" (${id}) excluído.`, {
        planId: id,
        planName: existing.name,
      })
    );
    return true;
  }

  public subscribeCompanyToPlan(companyEmail: string, planId: string, paymentMethod: 'PIX' | 'Cartão de Crédito' | 'Boleto Bancário' = 'PIX'): Subscription {
    const plan = this.plans.get(planId);
    if (!plan) {
      throw new Error('Plano selecionado não foi encontrado.');
    }

    const emailKey = companyEmail.toLowerCase().trim();
    let companyUser = this.companyAccounts.get(emailKey);
    if (!companyUser) {
      companyUser = {
        id: `emp-${Date.now().toString().slice(-4)}`,
        name: this.currentUser.company || 'Empresa Parceira',
        email: companyEmail,
        role: 'COMPANY',
        tipoUsuario: 'empresa',
        company: this.currentUser.company || 'Empresa Parceira',
        companyData: {
          id: `emp-${Date.now().toString().slice(-4)}`,
          name: this.currentUser.company || 'Empresa Parceira',
          email: companyEmail,
        }
      };
      this.companyAccounts.set(emailKey, companyUser);
    }

    const now = new Date();
    const expires = new Date();
    expires.setDate(expires.getDate() + (plan.period === 'ano' ? 365 : 30));

    const subscription: Subscription = {
      id: `sub-${Date.now()}`,
      companyId: companyUser.id,
      companyName: companyUser.name,
      companyEmail: companyUser.email,
      planId: plan.id,
      planName: plan.name,
      price: plan.price,
      period: plan.period,
      status: 'active',
      paymentMethod,
      subscribedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
    };

    this.subscriptions.unshift(subscription);

    // Atualiza dados da empresa
    if (companyUser.companyData) {
      companyUser.companyData.planId = plan.id;
      companyUser.companyData.planName = plan.name;
      companyUser.companyData.subscriptionStatus = 'active';
      companyUser.companyData.subscribedAt = now.toISOString();
      companyUser.companyData.expiresAt = expires.toISOString();
    }

    // Se usuário atual for essa empresa, atualiza currentUser
    if (this.currentUser.email.toLowerCase() === emailKey) {
      this.currentUser.companyData = {
        ...this.currentUser.companyData,
        ...companyUser.companyData,
      };
    }

    this.addAuditLog(
      createAuditLogEntry('SETTINGS_UPDATED', `Empresa "${companyUser.name}" assinou o "${plan.name}" (R$ ${plan.price}) via ${paymentMethod}.`, {
        companyId: companyUser.id,
        planId: plan.id,
        planName: plan.name,
        price: plan.price,
        paymentMethod,
      })
    );

    return subscription;
  }

  public getSubscriptions(): Subscription[] {
    return [...this.subscriptions];
  }

  public getCompanySubscription(companyEmail: string): Subscription | undefined {
    return this.subscriptions.find(
      (s) => s.companyEmail.toLowerCase() === companyEmail.toLowerCase().trim() && s.status === 'active'
    );
  }

  // --- AUDITORIA (AUDIT LOGS) ---
  public getAuditLogs(): AuditLog[] {
    return [...this.auditLogs].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  public addAuditLog(entry: AuditLog): void {
    this.auditLogs.unshift(entry);
    // Limite de segurança para memória
    if (this.auditLogs.length > 500) {
      this.auditLogs.pop();
    }
  }
}

// Global singleton para preservar estado durante hot reload em desenvolvimento
const globalForStore = globalThis as unknown as { itMatcherStore: InMemoryDataStore | undefined };

export const store = globalForStore.itMatcherStore ?? new InMemoryDataStore();

if (process.env.NODE_ENV !== 'production') {
  globalForStore.itMatcherStore = store;
}
