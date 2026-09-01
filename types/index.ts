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
  name: string;
  email: string;
  roleTitle: string;
  skills: string; // comma separated
}

export type CandidateTabType = 'jobs' | 'applications' | 'profile';
