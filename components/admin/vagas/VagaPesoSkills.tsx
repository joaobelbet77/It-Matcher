'use client';

import React, { useState } from 'react';
import { Plus, Trash2, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface ConfiguredSkill {
  name: string;
  weight: number;
  required?: boolean;
}

interface SkillWeightConfiguratorProps {
  skills: ConfiguredSkill[];
  onChange: (skills: ConfiguredSkill[]) => void;
}

const COMMON_TECH_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
  'Python', 'SQL', 'PostgreSQL', 'Git', 'Docker',
  'Kubernetes', 'AWS', 'Tailwind CSS', 'GraphQL', 'Java'
];

export const SkillWeightConfigurator: React.FC<SkillWeightConfiguratorProps> = ({
  skills,
  onChange,
}) => {
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillWeight, setNewSkillWeight] = useState<number>(20);
  const [newSkillRequired, setNewSkillRequired] = useState<boolean>(true);

  const totalWeight = skills.reduce((sum, s) => sum + (Number(s.weight) || 0), 0);
  const isValidTotal = totalWeight === 100;

  const handleAddSkill = (nameToAdd?: string, weightToAdd?: number) => {
    const name = (nameToAdd || newSkillName).trim();
    const weight = weightToAdd !== undefined ? weightToAdd : Number(newSkillWeight) || 0;

    if (!name) return;
    if (skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) return;

    onChange([...skills, { name, weight, required: newSkillRequired }]);
    setNewSkillName('');
    setNewSkillWeight(15);
  };

  const handleToggleRequired = (index: number) => {
    const updated = [...skills];
    updated[index].required = !(updated[index].required ?? true);
    onChange(updated);
  };

  const handleUpdateWeight = (index: number, newWeight: number) => {
    const updated = [...skills];
    updated[index].weight = Math.max(0, Math.min(100, newWeight));
    onChange(updated);
  };

  const handleRemoveSkill = (index: number) => {
    const updated = skills.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleDistributeEqually = () => {
    if (skills.length === 0) return;
    const baseWeight = Math.floor(100 / skills.length);
    const remainder = 100 % skills.length;
    const updated = skills.map((s, idx) => ({
      ...s,
      weight: idx === 0 ? baseWeight + remainder : baseWeight,
    }));
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="block text-sm font-bold text-slate-900 dark:text-zinc-100">
            Skills e Pesos *
          </label>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Adicione cada skill necessária, defina a obrigatoriedade (Sim/Não) e distribua os pesos até somar 100%.
          </p>
        </div>

        {skills.length > 0 && (
          <button
            type="button"
            onClick={handleDistributeEqually}
            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Distribuir pesos igualmente
          </button>
        )}
      </div>

      {/* Barra de Progresso do Peso Total */}
      <div className="bg-slate-50 dark:bg-zinc-900/60 rounded-xl p-3 border border-slate-200 dark:border-zinc-800">
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
          <span className="text-slate-700 dark:text-zinc-300 font-bold uppercase tracking-wide">
            PESO TOTAL: {totalWeight}%
          </span>
          <span className={`flex items-center gap-1 font-bold ${
            isValidTotal ? 'text-emerald-600 dark:text-emerald-400' : totalWeight > 100 ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'
          }`}>
            {isValidTotal ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% (Válido)
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5" /> Os pesos das skills devem totalizar 100%.
              </>
            )}
          </span>
        </div>

        <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden flex">
          {skills.map((s, idx) => {
            const colors = [
              'bg-blue-600', 'bg-sky-500', 'bg-cyan-500', 'bg-teal-500',
              'bg-emerald-500', 'bg-blue-500', 'bg-blue-400', 'bg-sky-600'
            ];
            const color = colors[idx % colors.length];
            return (
              <div
                key={idx}
                className={`${color} h-full transition-all duration-300`}
                style={{ width: `${Math.min(Math.max(0, s.weight), 100)}%` }}
                title={`${s.name}: ${s.weight}% (${(s.required ?? true) ? 'Obrigatória: Sim' : 'Obrigatória: Não'})`}
              />
            );
          })}
        </div>
      </div>

      {/* Lista de Skills Configuradas */}
      {skills.length > 0 ? (
        <div className="space-y-2 border border-slate-200 dark:border-zinc-800 rounded-xl p-3 bg-white dark:bg-[#121215]">
          <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-500 dark:text-zinc-400 px-2 pb-1 border-b border-slate-100 dark:border-zinc-800 items-center">
            <div className="col-span-5">Nome da Skill</div>
            <div className="col-span-3 text-center">Obrigatória?</div>
            <div className="col-span-3 text-center">Peso (%)</div>
            <div className="col-span-1 text-right">Ação</div>
          </div>

          {skills.map((skill, index) => {
            const isRequired = skill.required ?? true;
            return (
              <div
                key={index}
                className="grid grid-cols-12 gap-2 items-center p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors"
              >
                <div className="col-span-5 font-medium text-sm text-slate-800 dark:text-zinc-200 flex items-center gap-2 truncate">
                  <span className={`w-2 h-2 rounded-full ${isRequired ? 'bg-blue-600' : 'bg-slate-400 dark:bg-zinc-600'}`} />
                  <span className="truncate">{skill.name}</span>
                </div>

                <div className="col-span-3 flex justify-center">
                  <button
                    type="button"
                    onClick={() => handleToggleRequired(index)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full border cursor-pointer transition-colors ${
                      isRequired
                        ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60 hover:bg-blue-100 dark:hover:bg-blue-900/60'
                        : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700 hover:bg-slate-200'
                    }`}
                  >
                    {isRequired ? 'Sim' : 'Não'}
                  </button>
                </div>

                <div className="col-span-3 flex items-center justify-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={skill.weight}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (isNaN(val)) return;
                      handleUpdateWeight(index, val);
                    }}
                    className="w-16 px-2 py-1 text-center font-bold text-slate-900 dark:text-zinc-100 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs text-slate-500 dark:text-zinc-400">%</span>
                </div>

                <div className="col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(index)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                    aria-label="Remover skill"
                    title="Remover skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-xl bg-slate-50/50 dark:bg-zinc-950/40">
          <p className="text-xs text-slate-500 dark:text-zinc-400">Nenhuma skill adicionada ainda.</p>
        </div>
      )}

      {/* Inserção de Nova Skill */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
        <input
          type="text"
          placeholder="Ex: JavaScript, React, Docker..."
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddSkill();
            }
          }}
          className="flex-1 px-3 py-2 text-sm border border-slate-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500"
        />

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="1"
              max="100"
              placeholder="Peso %"
              value={newSkillWeight}
              onChange={(e) => {
                const val = Number(e.target.value);
                setNewSkillWeight(isNaN(val) ? 0 : Math.max(0, Math.min(100, val)));
              }}
              className="w-20 px-3 py-2 text-sm text-center border border-slate-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100"
            />
            <span className="text-xs text-slate-500 dark:text-zinc-400">%</span>
          </div>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleAddSkill()}
            disabled={!newSkillName.trim()}
            icon={<Plus className="w-4 h-4" />}
          >
            + Adicionar Skill
          </Button>
        </div>
      </div>

      {/* Sugestões Rápidas de Skills */}
      <div className="pt-2">
        <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block mb-1.5">
          Sugestões rápidas de TI:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_TECH_SKILLS.filter(
            (common) => !skills.some((s) => s.name.toLowerCase() === common.toLowerCase())
          ).slice(0, 10).map((tech) => (
            <button
              key={tech}
              type="button"
              onClick={() => handleAddSkill(tech, 20)}
              className="px-2.5 py-1 rounded-md text-xs bg-slate-100 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-700 dark:hover:text-blue-300 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 transition-colors cursor-pointer"
            >
              + {tech}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
