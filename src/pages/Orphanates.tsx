import React, { useEffect, useState } from 'react';
import OrphanageService from '@/Api/Services/OrphanageService';
import tryActivateEntity from '@/Api/restoreHelper';
import { OrphanageDto } from '@/Api/types/Orphanage';
import UiTable from '@/components/UiTable';
import UiButton from '@/components/UiButton';
import UiModal from '@/components/UiModal';
import UiForm from '@/components/UiForm';
import UiConfirm from '@/components/UiConfirm';
import { toast } from '@/components/ui/sonner';

export const Orphanates = () => {
  const [items, setItems] = useState<OrphanageDto[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<OrphanageDto | null>(null);
  const [confirm, setConfirm] = useState<{ open: boolean; id?: number }>({ open: false });

  const load = async () => {
    try {
      const res = await OrphanageService.getAllOrphanages();
      const normalized = (await import('@/utils/normalizeResponse')).normalizeArray(res) as unknown as OrphanageDto[];
      setItems(normalized || []);
    } catch (err: unknown) {
      const maybe = err && typeof err === 'object' ? err as Record<string, unknown> : null;
      toast.error(maybe && maybe['message'] ? String(maybe['message']) : String(err ?? 'Error al cargar orfanatos'));
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      if (values && 'Id' in values) {
        const v = values as unknown as OrphanageDto;
        await OrphanageService.updateOrphanage(v.Id, {
          Name: String(v.Name ?? ''),
          Address: String(v.Address ?? ''),
          Phone: String(v.Phone ?? ''),
          Capacity: Number(v.Capacity ?? 0),
          FoundationDate: String(v.FoundationDate ?? ''),
        });
        toast.success('Orfanato actualizado');
      } else {
          const payload = { ...(values as unknown as Omit<OrphanageDto, 'Id'>), active: true };
          await OrphanageService.createOrphanage(payload);
        toast.success('Orfanato creado');
      }
      setShowForm(false);
      setEditing(null);
      await load();
    } catch (err: unknown) {
      const maybe = err && typeof err === 'object' ? err as Record<string, unknown> : null;
      toast.error(maybe && maybe['message'] ? String(maybe['message']) : String(err ?? 'Error'));
      throw err;
    }
  };

  const handleEdit = (item: OrphanageDto) => { setEditing(item); setShowForm(true); };

  const handleDeleteConfirmed = async (id?: number) => {
    try {
      if (!id) return;
      await OrphanageService.deleteOrphanageLogical(id);
      toast.success('Orfanato eliminado');
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
      Name: String(item.Name ?? ''),
      Address: String(item.Address ?? ''),
      Phone: String(item.Phone ?? ''),
      Capacity: Number(item.Capacity ?? 0),
      FoundationDate: String(item.FoundationDate ?? ''),
      active: true,
    } as Omit<OrphanageDto, 'Id'>;
    const result = await tryActivateEntity('Orphanage', id, payload);
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
        <h2 className="text-2xl font-bold text-green-700">Orfanatos</h2>
        <UiButton label="Crear" onClick={() => { setEditing(null); setShowForm(true); }} />
      </div>

      <UiModal open={showForm} onClose={() => { setShowForm(false); setEditing(null); }} title={editing ? 'Editar Orfanato' : 'Crear Orfanato'}>
        <UiForm
          fields={[
            { name: 'Name', label: 'Nombre', required: true },
            { name: 'Address', label: 'Dirección', required: true },
            { name: 'Phone', label: 'Teléfono' },
            { name: 'Capacity', label: 'Capacidad', type: 'number' },
            { name: 'FoundationDate', label: 'Fecha de fundación', type: 'date' },
          ]}
          initial={editing ? (editing as unknown as Record<string, unknown>) : {}}
          onSubmit={handleSubmit}
        />
      </UiModal>

      <UiTable
        columns={[
          { key: 'Name', label: 'Nombre' },
          { key: 'Address', label: 'Dirección' },
          { key: 'Phone', label: 'Teléfono' },
          { key: 'Capacity', label: 'Capacidad' },
          { key: 'FoundationDate', label: 'Fundación' },
        { key: 'active', label: 'Activo', render: (r: OrphanageDto) => r.active ? 'Sí' : 'No' },
          
        ]}
        data={items}
        actions={(row: OrphanageDto) => (
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
        title="Eliminar orfanato"
        message="¿Deseas eliminar este orfanato?"
        onConfirm={() => handleDeleteConfirmed(confirm.id)}
        onCancel={() => setConfirm({ open: false })}
      />
    </div>
  );
};

export default Orphanates;
