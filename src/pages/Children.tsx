import React, { useEffect, useState } from 'react';
import ChildService from '@/Api/Services/ChildService';
import tryActivateEntity from '@/Api/restoreHelper';
import { ChildDto } from '@/Api/types/Child';
import UiTable from '@/components/UiTable';
import UiButton from '@/components/UiButton';
import UiForm from '@/components/UiForm';
import UiModal from '@/components/UiModal';
import UiConfirm from '@/components/UiConfirm';
import { toast } from '@/components/ui/sonner';

export const Children = () => {
  const [items, setItems] = useState<ChildDto[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ChildDto | null>(null);

  const load = async () => {
    const res = await ChildService.getAllChildren();
    const normalized = (await import('@/utils/normalizeResponse')).normalizeArray(res) as unknown as ChildDto[];
    setItems(normalized || []);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      if (values && typeof values === 'object' && 'Id' in values) {
        const v = values as unknown as ChildDto;
        await ChildService.updateChild(v.Id, {
          FirstName: String(v.FirstName ?? ''),
          LastName: String(v.LastName ?? ''),
          BirthDate: String(v.BirthDate ?? ''),
          Gender: String(v.Gender ?? ''),
          AdmissionDate: String(v.AdmissionDate ?? ''),
          CurrentStatus: String(v.CurrentStatus ?? ''),
        });
      } else {
        const payload = { ...(values as unknown as Omit<ChildDto, 'Id'>), active: true };
        await ChildService.createChild(payload);
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

  const handleEdit = (item: ChildDto) => { setEditing(item); setShowForm(true); };
  const [confirm, setConfirm] = useState<{ open: boolean; id?: number }>({ open: false });
  const handleDeleteConfirmed = async (id?: number) => {
    try {
      if (!id) return;
      await ChildService.deleteChildLogical(id);
      toast.success('Niño eliminado');
      await load();
    } catch (err: unknown) {
      const maybe = err && typeof err === 'object' ? err as Record<string, unknown> : null;
      toast.error(maybe && maybe['message'] ? String(maybe['message']) : String(err ?? 'Error'));
    } finally {
      setConfirm({ open: false });
    }
  };

  const handleDelete = (id: number) => setConfirm({ open: true, id });

  const handleActivate = async (id: number) => {
    const item = items.find((x) => x.Id === id);
    if (!item) return;
    const payload = {
      FirstName: String(item.FirstName ?? ''),
      LastName: String(item.LastName ?? ''),
      BirthDate: String(item.BirthDate ?? ''),
      Gender: String(item.Gender ?? ''),
      AdmissionDate: String(item.AdmissionDate ?? ''),
      CurrentStatus: String(item.CurrentStatus ?? ''),
      active: true,
    } as Omit<ChildDto, 'Id'>;
    const result = await tryActivateEntity('Child', id, payload);
    if (result.ok) {
      toast.success('Registro activado');
      await load();
      return;
    }
    const allow = result.res ? (result.res.headers.get('allow') || result.res.headers.get('Allow') || '') : '';
    toast.error(`No se pudo activar (server allow: ${allow || 'none'})`);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-green-700">Niños</h2>
        <UiButton label="Crear" onClick={() => { setEditing(null); setShowForm(true); }} />
      </div>

      <UiModal open={showForm} onClose={() => { setShowForm(false); setEditing(null); }} title={editing ? 'Editar Niño' : 'Crear Niño'}>
        <UiForm
          fields={[
            { name: 'FirstName', label: 'Nombre' },
            { name: 'LastName', label: 'Apellido' },
            { name: 'BirthDate', label: 'Fecha de Nacimiento', type: 'date' },
            { name: 'Gender', label: 'Género' },
            { name: 'AdmissionDate', label: 'Fecha de Ingreso', type: 'date' },
            { name: 'CurrentStatus', label: 'Estado', required: true },
          ]}
          initial={editing ? (editing as unknown as Record<string, unknown>) : {}}
          onSubmit={handleSubmit}
        />
      </UiModal>

      <UiTable
        columns={[
          { key: 'FirstName', label: 'Nombre' },
          { key: 'LastName', label: 'Apellido' },
          { key: 'BirthDate', label: 'Fecha Nac.' },
          { key: 'Gender', label: 'Género' },
          { key: 'CurrentStatus', label: 'Estado' },
          { key: 'active', label: 'Activo', render: (r: ChildDto) => r.active ? 'Sí' : 'No' },
        ]}
        data={items}
        actions={(row: ChildDto) => (
          <div className="flex gap-2">
            <UiButton label="Editar" variant="secondary" onClick={() => handleEdit(row)} />
            <UiButton
              label={row.active ? 'Eliminar' : 'Activar'}
              variant={row.active ? 'danger' : 'primary'}
              onClick={() => row.active ? handleDelete(row.Id) : handleActivate(row.Id)}
            />
          </div>
        )}
      />
      <UiConfirm
        open={confirm.open}
        title="Eliminar niño"
        message="¿Deseas eliminar este niño?"
        onConfirm={() => handleDeleteConfirmed(confirm.id)}
        onCancel={() => setConfirm({ open: false })}
      />
    </div>
  );
};

export default Children;
