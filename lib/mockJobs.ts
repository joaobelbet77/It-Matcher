import { Job } from '../types';

export const INITIAL_CANDIDATE_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Desenvolvedor Frontend Next.js & React',
    company: 'TechFlow Solutions',
    location: 'São Paulo, SP',
    workModel: 'Remoto',
    level: 'Pleno',
    salary: 'R$ 7.500 - R$ 9.500',
    description: 'Buscamos desenvolvedor(a) frontend com sólida experiência em React, Next.js e TypeScript para atuar na criação de aplicações web de alto desempenho e interfaces modernas.',
    skills: [
      { id: 's1', name: 'React', weight: 5 },
      { id: 's2', name: 'Next.js', weight: 5 },
      { id: 's3', name: 'TypeScript', weight: 4 },
      { id: 's4', name: 'Tailwind CSS', weight: 3 },
      { id: 's5', name: 'Git', weight: 3 }
    ],
    postedAt: 'Há 1 dia'
  },
  {
    id: 'job-2',
    title: 'Desenvolvedor Full Stack Node & TypeScript',
    company: 'Nexus Digital',
    location: 'Belo Horizonte, MG',
    workModel: 'Remoto',
    level: 'Sênior',
    salary: 'R$ 11.000 - R$ 14.000',
    description: 'Oportunidade para atuar em arquitetura de microserviços escaláveis, APIs REST/GraphQL em Node.js e interfaces integradas em React.',
    skills: [
      { id: 's1', name: 'Node.js', weight: 5 },
      { id: 's2', name: 'TypeScript', weight: 5 },
      { id: 's3', name: 'React', weight: 4 },
      { id: 's4', name: 'PostgreSQL', weight: 4 },
      { id: 's5', name: 'Docker', weight: 3 },
      { id: 's6', name: 'AWS', weight: 3 }
    ],
    postedAt: 'Há 2 dias'
  },
  {
    id: 'job-3',
    title: 'Engenheiro de Software Backend (Python / Django)',
    company: 'CloudScale Data',
    location: 'Curitiba, PR',
    workModel: 'Híbrido',
    level: 'Pleno',
    salary: 'R$ 8.000 - R$ 10.500',
    description: 'Venha desenvolver pipelines de dados e APIs robustas utilizando Python, FastAPI/Django e bancos relacionais em infraestrutura de nuvem.',
    skills: [
      { id: 's1', name: 'Python', weight: 5 },
      { id: 's2', name: 'SQL', weight: 4 },
      { id: 's3', name: 'Django', weight: 4 },
      { id: 's4', name: 'Docker', weight: 3 },
      { id: 's5', name: 'Git', weight: 3 }
    ],
    postedAt: 'Há 3 dias'
  },
  {
    id: 'job-4',
    title: 'Desenvolvedor Mobile (Flutter / React Native)',
    company: 'Appfy Mobile',
    location: 'Florianópolis, SC',
    workModel: 'Remoto',
    level: 'Júnior / Pleno',
    salary: 'R$ 5.500 - R$ 7.500',
    description: 'Desenvolvimento e publicação de aplicativos móveis iOS e Android com foco em excelente experiência de usuário e consumo de APIs REST.',
    skills: [
      { id: 's1', name: 'Flutter', weight: 5 },
      { id: 's2', name: 'Dart', weight: 5 },
      { id: 's3', name: 'Git', weight: 4 },
      { id: 's4', name: 'Firebase', weight: 3 },
      { id: 's5', name: 'REST APIs', weight: 3 }
    ],
    postedAt: 'Há 4 dias'
  },
  {
    id: 'job-5',
    title: 'Especialista DevOps & Cloud AWS',
    company: 'Inovare Cloud',
    location: 'Rio de Janeiro, RJ',
    workModel: 'Remoto',
    level: 'Sênior',
    salary: 'R$ 13.000 - R$ 16.500',
    description: 'Responsável pela infraestrutura como código (Terraform), esteiras CI/CD automatizadas, Kubernetes e orquestração na nuvem AWS.',
    skills: [
      { id: 's1', name: 'AWS', weight: 5 },
      { id: 's2', name: 'Kubernetes', weight: 5 },
      { id: 's3', name: 'Terraform', weight: 4 },
      { id: 's4', name: 'Docker', weight: 4 },
      { id: 's5', name: 'Linux', weight: 3 }
    ],
    postedAt: 'Há 5 dias'
  }
];
