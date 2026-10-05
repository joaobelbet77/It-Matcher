import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { JobList } from '@/components/admin/vagas/VagaList';
import { Button } from '@/components/ui/Button';
import { store } from '@/lib/storage';
import { Plus } from 'lucide-react';

export const revalidate = 0;

export default async function VagasPage() {
  const jobs = store.getJobs();

  return (
    <div className="space-y-6">
      <Header
        title="Gestão de Vagas de TI"
        description="Painel de criação, acompanhamento e configuração de pesos de competências técnicas das vagas"
      >
        <Link href="/vagas/nova">
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
            Nova Vaga
          </Button>
        </Link>
      </Header>

      <JobList jobs={jobs} />
    </div>
  );
}
