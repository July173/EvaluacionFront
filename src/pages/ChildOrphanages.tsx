import React, { useEffect, useState } from 'react';
import ChildOrphanageService from '@/Api/Services/ChildOrphanageService';
import ChildService from '@/Api/Services/ChildService';
import OrphanageService from '@/Api/Services/OrphanageService';
import { ChildOrphanageDto } from '@/Api/types/ChildOrphanage';
import UiTable from '@/components/UiTable';
import UiButton from '@/components/UiButton';
import UiForm from '@/components/UiForm';
import UiModal from '@/components/UiModal';
import { toast } from '@/components/ui/sonner';

export const ChildOrphanages = () => {
  const [items, setItems] = useState<ChildOrphanageDto[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ChildOrphanageDto | null>(null);

  const load = async () => {
    const res = await ChildOrphanageService.getAllChildOrphanages();
    const normalized = (await import('@/utils/normalizeResponse')).normalizeArray(res) as unknown as ChildOrphanageDto[];
    setItems(normalized || []);
  };

  const [childrenOpts, setChildrenOpts] = useState<Array<{ label: string; value: number }>>([]);
  const [orphanageOpts, setOrphanageOpts] = useState<Array<{ label: string; value: number }>>([]);

  const loadOptions = async () => {
    try {
      const [chs, orps] = await Promise.all([ChildService.getAllChildren(), OrphanageService.getAllOrphanages()]);
      setChildrenOpts((chs || []).map((c) => ({ label: `${c.FirstName} ${c.LastName}`, value: c.Id })));
      setOrphanageOpts((orps || []).map((o) => ({ label: o.Name, value: o.Id })));
    } catch (err) {
      // ignore; options optional
    }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { loadOptions(); }, []);

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      if (values && typeof values === 'object' && 'Id' in values) {
        const v = values as unknown as ChildOrphanageDto;
        await ChildOrphanageService.updateChildOrphanage(v.Id, {
          child_id: Number(v.child_id ?? 0),
          orphanage_id: Number(v.orphanage_id ?? 0),
          EntryDate: String(v.EntryDate ?? ''),
          ExitDate: String(v.ExitDate ?? ''),
        });
      } else {
        const payload = { ...(values as unknown as Omit<ChildOrphanageDto, 'Id'>), active: true };
        await ChildOrphanageService.createChildOrphanage(payload);
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

  const handleEdit = (item: ChildOrphanageDto) => { setEditing(item); setShowForm(true); };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-green-700">Asignación Niño - Orfanato</h2>
        <UiButton label="Crear" onClick={() => { setEditing(null); setShowForm(true); }} />
      </div>

      <UiModal open={showForm} onClose={() => { setShowForm(false); setEditing(null); }} title={editing ? 'Editar Asignación' : 'Crear Asignación'}>
        <UiForm
          fields={[
            { name: 'child_id', label: 'Niño', options: childrenOpts },
            { name: 'orphanage_id', label: 'Orfanato', options: orphanageOpts },
            { name: 'EntryDate', label: 'Fecha de Entrada', type: 'date' },
            { name: 'ExitDate', label: 'Fecha de Salida', type: 'date' },
          ]}
          initial={editing ? (editing as unknown as Record<string, unknown>) : {}}
          onSubmit={handleSubmit}
        />
      </UiModal>

      <UiTable
        columns={[
          { key: 'child_id', label: 'Niño', render: (r: ChildOrphanageDto) => {
            const c = childrenOpts.find((x) => x.value === r.child_id);
            return c ? c.label : String(r.child_id);
          } },
          { key: 'orphanage_id', label: 'Orfanato', render: (r: ChildOrphanageDto) => {
            const o = orphanageOpts.find((x) => x.value === r.orphanage_id);
            return o ? o.label : String(r.orphanage_id);
          } },
          { key: 'EntryDate', label: 'Entrada' },
          { key: 'ExitDate', label: 'Salida' },
          { key: 'active', label: 'Activo', render: (r: ChildOrphanageDto) => r.active ? 'Sí' : 'No' },
        ]}
        data={items}
        actions={(row: ChildOrphanageDto) => (
          <div className="flex gap-2">
            <UiButton label="Editar" variant="secondary" onClick={() => handleEdit(row)} />
          </div>
        )}
      />
    </div>
  );
};

export default ChildOrphanages;
