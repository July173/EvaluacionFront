import React, { useEffect, useState } from 'react';
import SocialWorkerService from '@/Api/Services/SocialWorkerService';
import tryActivateEntity from '@/Api/restoreHelper';
import { SocialWorkerDto } from '@/Api/types/SocialWorker';
import UiTable from '@/components/UiTable';
import UiButton from '@/components/UiButton';
import UiForm from '@/components/UiForm';
import UiModal from '@/components/UiModal';
import UiConfirm from '@/components/UiConfirm';
import { toast } from '@/components/ui/sonner';

export const SocialWorkers = () => {
  const [items, setItems] = useState<SocialWorkerDto[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<SocialWorkerDto | null>(null);

  const load = async () => {
    const res = await SocialWorkerService.getAllSocialWorkers();
    const normalized = (await import('@/utils/normalizeResponse')).normalizeArray(res) as unknown as SocialWorkerDto[];
    setItems(normalized || []);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (values: Record<string, unknown>) => {
    // normalize incoming values into SocialWorkerDto shapes
    try {
      if (values && typeof values === 'object' && 'Id' in values) {
        const v = values as unknown as SocialWorkerDto;
        await SocialWorkerService.updateSocialWorker(v.Id, {
          FirstName: String(v.FirstName ?? ''),
          LastName: String(v.LastName ?? ''),
          Profession: String(v.Profession ?? ''),
          Phone: String(v.Phone ?? ''),
          Email: String(v.Email ?? ''),
        });
      } else {
        const payload = { ...(values as unknown as Omit<SocialWorkerDto, 'Id'>), active: true };
        await SocialWorkerService.createSocialWorker(payload);
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

  const handleEdit = (item: SocialWorkerDto) => {
    setEditing(item);
    setShowForm(true);
  };

  const [confirm, setConfirm] = useState<{ open: boolean; id?: number }>({ open: false });

  const handleDeleteConfirmed = async (id?: number) => {
    try {
      if (!id) return;
      await SocialWorkerService.deleteSocialWorkerLogical(id);
      toast.success('Trabajador social eliminado');
      await load();
    } catch (err: unknown) {
      const maybe = err && typeof err === 'object' ? err as Record<string, unknown> : null;
      toast.error(maybe && maybe['message'] ? String(maybe['message']) : String(err ?? 'Error'));
    } finally {
      setConfirm({ open: false });
    }
  };

  const handleDelete = (id: number) => {
    setConfirm({ open: true, id });
  };

  const handleActivate = async (id: number) => {
    const item = items.find((x) => x.Id === id);
    if (!item) return;
    const payload = {
      FirstName: String(item.FirstName ?? ''),
      LastName: String(item.LastName ?? ''),
      Profession: String(item.Profession ?? ''),
      Phone: String(item.Phone ?? ''),
      Email: String(item.Email ?? ''),
      active: true,
    } as Omit<SocialWorkerDto, 'Id'>;

    const result = await tryActivateEntity('SocialWorker', id, payload);
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
        <h2 className="text-2xl font-bold text-green-700">Trabajadores Sociales</h2>
        <UiButton label="Crear" onClick={() => { setEditing(null); setShowForm(true); }} />
      </div>

      <UiModal open={showForm} onClose={() => { setShowForm(false); setEditing(null); }} title={editing ? 'Editar Trabajador Social' : 'Crear Trabajador Social'}>
        <UiForm
          fields={[
            { name: 'FirstName', label: 'Nombre' },
            { name: 'LastName', label: 'Apellido' },
            { name: 'Profession', label: 'Profesión' },
            { name: 'Phone', label: 'Teléfono' },
            { name: 'Email', label: 'Correo' },
          ]}
          initial={editing ? (editing as unknown as Record<string, unknown>) : {}}
          onSubmit={handleSubmit}
        />
      </UiModal>

      <UiTable
        columns={[
          { key: 'FirstName', label: 'Nombre' },
          { key: 'LastName', label: 'Apellido' },
          { key: 'Profession', label: 'Profesión' },
          { key: 'Phone', label: 'Teléfono' },
          { key: 'Email', label: 'Correo' },
          { key: 'active', label: 'Activo', render: (r: SocialWorkerDto) => r.active ? 'Sí' : 'No' },
        ]}
        data={items}
        actions={(row: SocialWorkerDto) => (
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
        title="Eliminar trabajador"
        message="¿Deseas eliminar este trabajador social? Esta acción es lógica y se puede revertir desde el backend si es necesario."
        onConfirm={() => handleDeleteConfirmed(confirm.id)}
        onCancel={() => setConfirm({ open: false })}
      />
    </div>
  );
};

export default SocialWorkers;
