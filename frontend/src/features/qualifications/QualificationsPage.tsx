import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';
import type { Qualification } from '../../api/types';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';

function useQualifications() {
  return useQuery<Qualification[]>({
    queryKey: ['qualifications'],
    queryFn: async () => (await api.get('/qualifications')).data,
  });
}

export default function QualificationsPage() {
  const { data: qualifications, isLoading } = useQualifications();
  const [showCreate, setShowCreate] = useState(false);
  const qc = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; hourlyRateEur: number }) =>
      (await api.post('/qualifications', data)).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['qualifications'] }); setShowCreate(false); },
  });

  const [form, setForm] = useState({ name: '', hourlyRateEur: null as number | null });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Qualifications</h1>
        <Button label="New Qualification" icon="pi pi-plus" onClick={() => setShowCreate(!showCreate)} />
      </div>

      {showCreate && (
        <Card className="mb-4 max-w-md">
          <form onSubmit={async (e) => {
            e.preventDefault();
            await createMutation.mutateAsync({ name: form.name, hourlyRateEur: form.hourlyRateEur! });
            setForm({ name: '', hourlyRateEur: null });
          }} className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm mb-1">Name</label>
              <InputText value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full" required />
            </div>
            <div className="w-40">
              <label className="block text-sm mb-1">Rate EUR/hr</label>
              <InputNumber value={form.hourlyRateEur}
                onValueChange={e => setForm({ ...form, hourlyRateEur: e.value ?? null })}
                minFractionDigits={0} maxFractionDigits={2} mode="currency" currency="EUR" className="w-full" />
            </div>
            <Button type="submit" label="Add" icon="pi pi-check"
              loading={createMutation.isPending} disabled={!form.name || form.hourlyRateEur == null} />
          </form>
        </Card>
      )}

      <DataTable value={qualifications ?? []} loading={isLoading} emptyMessage="No qualifications yet"
        stripedRows size="small">
        <Column field="name" header="Name" sortable />
        <Column header="Hourly Rate (EUR)" sortable sortField="hourlyRateEur"
          body={(q) => Number(q.hourlyRateEur).toFixed(2)} />
        <Column header="Status" body={(q) => (
          <Tag value={q.active ? 'Active' : 'Inactive'} severity={q.active ? 'success' : 'secondary'} />
        )} />
      </DataTable>
    </div>
  );
}
