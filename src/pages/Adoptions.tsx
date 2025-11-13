import React, { useEffect, useState } from 'react';
import AdoptionService from '@/Api/Services/AdoptionService';
import tryActivateEntity from '@/Api/restoreHelper';
import SocialWorkerService from '@/Api/Services/SocialWorkerService';
import { AdoptionDto } from '@/Api/types/Adoption';
import UiTable from '@/components/UiTable';
import UiButton from '@/components/UiButton';
import UiForm from '@/components/UiForm';
import UiModal from '@/components/UiModal';
import UiConfirm from '@/components/UiConfirm';
import { toast } from '@/components/ui/sonner';

export const Adoptions = () => {
  const [items, setItems] = useState<AdoptionDto[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdoptionDto | null>(null);

  const load = async () => {
    const res = await AdoptionService.getAllAdoptions();
    const normalized = (await import('@/utils/normalizeResponse')).normalizeArray(res) as unknown as AdoptionDto[];
    setItems(normalized || []);
  };

  const [swOpts, setSwOpts] = useState<Array<{ label: string; value: number }>>([]);
  const loadOptions = async () => {
    try {
      const sws = await SocialWorkerService.getAllSocialWorkers();
      setSwOpts((sws || []).map((s) => ({ label: `${s.FirstName} ${s.LastName}`, value: s.Id })));
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { loadOptions(); }, []);

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      if (values && typeof values === 'object' && 'Id' in values) {
        const v = values as unknown as AdoptionDto;
        await AdoptionService.updateAdoption(v.Id, {
          AdoptionDate: String(v.AdoptionDate ?? ''),
          Status: String(v.Status ?? ''),
          socialworker_id: Number(v.socialworker_id ?? 0),
        });
      } else {
        const payload = { ...(values as unknown as Omit<AdoptionDto, 'Id'>), active: true };
        await AdoptionService.createAdoption(payload);
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

  const handleEdit = (item: AdoptionDto) => { setEditing(item); setShowForm(true); };
  const [confirm, setConfirm] = useState<{ open: boolean; id?: number }>({ open: false });
  const handleDeleteConfirmed = async (id?: number) => {
    try {
      if (!id) return;
      await AdoptionService.deleteAdoptionLogical(id);
      toast.success('Adopción eliminada');
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
      AdoptionDate: String(item.AdoptionDate ?? ''),
      Status: String(item.Status ?? ''),
      socialworker_id: Number(item.socialworker_id ?? 0),
      active: true,
    } as Omit<AdoptionDto, 'Id'>;
    const result = await tryActivateEntity('Adoption', id, payload);
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
        <h2 className="text-2xl font-bold text-green-700">Adopciones</h2>
        <UiButton label="Crear" onClick={() => { setEditing(null); setShowForm(true); }} />
      </div>

      <UiModal open={showForm} onClose={() => { setShowForm(false); setEditing(null); }} title={editing ? 'Editar Adopción' : 'Crear Adopción'}>
        <UiForm
          fields={[
            { name: 'AdoptionDate', label: 'Fecha de Adopción', type: 'date' },
            { name: 'Status', label: 'Estado' },
            { name: 'socialworker_id', label: 'Trabajador Social', options: swOpts },
          ]}
          initial={editing ? (editing as unknown as Record<string, unknown>) : {}}
          onSubmit={handleSubmit}
        />
      </UiModal>

      <UiTable
        columns={[
          { key: 'AdoptionDate', label: 'Fecha' },
          { key: 'Status', label: 'Estado' },
          { key: 'socialworker_id', label: 'Trabajador Social', render: (r: AdoptionDto) => {
            const s = swOpts.find((x) => x.value === r.socialworker_id);
            return s ? s.label : String(r.socialworker_id);
          } },
        ]}
        data={items}
        actions={(row: AdoptionDto) => (
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
        title="Eliminar adopción"
        message="¿Deseas eliminar esta adopción?"
        onConfirm={() => handleDeleteConfirmed(confirm.id)}
        onCancel={() => setConfirm({ open: false })}
      />
    </div>
  );
};

export default Adoptions;
