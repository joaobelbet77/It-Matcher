import React from 'react';
import Link from 'next/link';
import { JobList } from '@/components/admin/vagas/VagaList';
import { Button } from '@/components/ui/Button';
import { store } from '@/lib/storage';
import { Plus } from 'lucide-react';

export const revalidate = 0;

export default async function VagasPage() {
  const jobs = store.getJobs();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Vagas</h1>
        <Link href="/vagas/nova">
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
            Nova Vaga
          </Button>
        </Link>
      </div>

      <JobList jobs={jobs} />
    </div>
  );
}
