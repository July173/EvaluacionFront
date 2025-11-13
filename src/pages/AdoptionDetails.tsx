import React, { useEffect, useState } from 'react';
import AdoptionDetailService from '@/Api/Services/AdoptionDetailService';
import ChildService from '@/Api/Services/ChildService';
import ParentService from '@/Api/Services/ParentService';
import AdoptionService from '@/Api/Services/AdoptionService';
import { AdoptionDetailDto } from '@/Api/types/AdoptionDetail';
import UiTable from '@/components/UiTable';
import UiButton from '@/components/UiButton';
import UiForm from '@/components/UiForm';
import UiModal from '@/components/UiModal';
import { toast } from '@/components/ui/sonner';

export const AdoptionDetails = () => {
  const [items, setItems] = useState<AdoptionDetailDto[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdoptionDetailDto | null>(null);

  const load = async () => {
    const res = await AdoptionDetailService.getAllAdoptionDetails();
    const normalized = (await import('@/utils/normalizeResponse')).normalizeArray(res) as unknown as AdoptionDetailDto[];
    setItems(normalized || []);
  };

  const [childOpts, setChildOpts] = useState<Array<{ label: string; value: number }>>([]);
  const [parentOpts, setParentOpts] = useState<Array<{ label: string; value: number }>>([]);
  const [adoptionOpts, setAdoptionOpts] = useState<Array<{ label: string; value: number }>>([]);

  const loadOptions = async () => {
    try {
      const [chs, prs, ads] = await Promise.all([ChildService.getAllChildren(), ParentService.getAllParents(), AdoptionService.getAllAdoptions()]);
      setChildOpts((chs || []).map((c) => ({ label: `${c.FirstName} ${c.LastName}`, value: c.Id })));
      setParentOpts((prs || []).map((p) => ({ label: `${p.FirstName} ${p.LastName}`, value: p.Id })));
      setAdoptionOpts((ads || []).map((a) => ({ label: `${a.AdoptionDate} - ${a.Status}`, value: a.Id })));
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { loadOptions(); }, []);

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      if (values && typeof values === 'object' && 'Id' in values) {
        const v = values as unknown as AdoptionDetailDto;
        await AdoptionDetailService.updateAdoptionDetail(v.Id, {
          adoption_id: Number(v.adoption_id ?? 0),
          parent_id: Number(v.parent_id ?? 0),
          child_id: Number(v.child_id ?? 0),
        });
      } else {
        const payload = { ...(values as unknown as Omit<AdoptionDetailDto, 'Id'>), active: true };
        await AdoptionDetailService.createAdoptionDetail(payload);
      }
      toast.success('Guardado correctamente');
      setShowForm(false);
      setEditing(null);
      await load();
    } catch (err: unknown) {
      const maybe = err && typeof err === 'object' ? err as Record<string, unknown> : null;
      toast.error(maybe && maybe['message'] ? String(maybe['message']) : String(err ?? 'Error'));
      throw err;
    }
  };

  const handleEdit = (item: AdoptionDetailDto) => { setEditing(item); setShowForm(true); };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-green-700">Detalle de Adopciones</h2>
        <UiButton label="Crear" onClick={() => { setEditing(null); setShowForm(true); }} />
      </div>

      <UiModal open={showForm} onClose={() => { setShowForm(false); setEditing(null); }} title={editing ? 'Editar Detalle' : 'Crear Detalle'}>
        <UiForm
          fields={[
            { name: 'adoption_id', label: 'Adopción', options: adoptionOpts },
            { name: 'parent_id', label: 'Padre', options: parentOpts },
            { name: 'child_id', label: 'Niño', options: childOpts },
          ]}
          initial={editing ? (editing as unknown as Record<string, unknown>) : {}}
          onSubmit={handleSubmit}
        />
      </UiModal>

      <UiTable
        columns={[
          { key: 'adoption_id', label: 'Adopción', render: (r: AdoptionDetailDto) => {
            const a = adoptionOpts.find((x) => x.value === r.adoption_id);
            return a ? a.label : String(r.adoption_id);
          } },
          { key: 'parent_id', label: 'Padre', render: (r: AdoptionDetailDto) => {
            const p = parentOpts.find((x) => x.value === r.parent_id);
            return p ? p.label : String(r.parent_id);
          } },
          { key: 'child_id', label: 'Niño', render: (r: AdoptionDetailDto) => {
            const c = childOpts.find((x) => x.value === r.child_id);
            return c ? c.label : String(r.child_id);
          } },
          { key: 'active', label: 'Activo', render: (r: AdoptionDetailDto) => r.active ? 'Sí' : 'No' },
        ]}
        data={items}
        actions={(row: AdoptionDetailDto) => (
          <div className="flex gap-2">
            <UiButton label="Editar" variant="secondary" onClick={() => handleEdit(row)} />
          </div>
        )}
      />
    </div>
  );
};

export default AdoptionDetails;
