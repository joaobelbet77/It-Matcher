export interface Skill {
  id: string;
  name: string;
  weight: number; // 1 a 5
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  workModel: 'Remoto' | 'Híbrido' | 'Presencial';
  level: 'Júnior' | 'Pleno' | 'Sênior' | 'Especialista';
  salary: string;
  description: string;
  skills: Skill[];
  postedAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  candidateName: string;
  candidateEmail: string;
  candidateSkills: string[];
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  appliedAt: string;
  status: 'Candidatura Enviada' | 'Perfil Compatível' | 'Em Avaliação';
}

export interface CandidateProfile {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  roleTitle: string;
  seniority?: 'Júnior' | 'Pleno' | 'Sênior' | 'Especialista';
  workPreference?: 'Remoto' | 'Híbrido' | 'Presencial' | 'Indiferente';
  salaryExpectation?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  skills: string; // comma separated
  bio?: string;
  isLoggedIn?: boolean;
}

export type CandidateTabType = 'home' | 'jobs' | 'applications' | 'profile' | 'about';
