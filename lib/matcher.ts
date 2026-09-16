import { Job, Application } from '../types';

export function calculateCandidateMatch(
  candidateName: string,
  candidateEmail: string,
  candidateSkillsRaw: string,
  targetJob: Job
): Application {
  const candidateSkillsArr = candidateSkillsRaw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  let totalWeight = 0;
  let matchedWeight = 0;
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  targetJob.skills.forEach((req) => {
    totalWeight += req.weight;
    const reqLower = req.name.toLowerCase().trim();

    const hasSkill = candidateSkillsArr.some(
      (cSkill) => cSkill === reqLower || cSkill.includes(reqLower) || reqLower.includes(cSkill)
    );

    if (hasSkill) {
      matchedWeight += req.weight;
      matchedSkills.push(req.name);
    } else {
      missingSkills.push(req.name);
    }
  });

  const score = totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0;

  return {
    id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    jobId: targetJob.id,
    jobTitle: targetJob.title,
    company: targetJob.company,
    candidateName: candidateName.trim(),
    candidateEmail: candidateEmail.trim(),
    candidateSkills: candidateSkillsArr,
    score,
    matchedSkills,
    missingSkills,
    appliedAt: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    status: score >= 70 ? 'Perfil Compatível' : 'Candidatura Enviada'
  };
}

/**
 * Calcula apenas a porcentagem de match de um perfil de habilidades pré-salvo contra uma vaga
 */
export function getQuickScore(candidateSkillsRaw: string, targetJob: Job): number {
  if (!candidateSkillsRaw.trim()) return 0;

  const candidateSkillsArr = candidateSkillsRaw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  let totalWeight = 0;
  let matchedWeight = 0;

  targetJob.skills.forEach((req) => {
    totalWeight += req.weight;
    const reqLower = req.name.toLowerCase().trim();

    const hasSkill = candidateSkillsArr.some(
      (cSkill) => cSkill === reqLower || cSkill.includes(reqLower) || reqLower.includes(cSkill)
    );

    if (hasSkill) {
      matchedWeight += req.weight;
    }
  });

  return totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0;
}
