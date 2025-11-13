import React, { useEffect, useState } from 'react';
import ParentService from '@/Api/Services/ParentService';
import { ENDPOINTS, default as API_BASE_URL } from '@/Api/config/ConfigApi';
import { fetchWithAuth } from '@/Api/http';
import { ParentDto } from '@/Api/types/Parent';
import UiTable from '@/components/UiTable';
import UiButton from '@/components/UiButton';
import UiForm from '@/components/UiForm';
import UiModal from '@/components/UiModal';
import UiConfirm from '@/components/UiConfirm';
import { toast } from '@/components/ui/sonner';

export const Parents = () => {
  const [items, setItems] = useState<ParentDto[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ParentDto | null>(null);

  const load = async () => {
    const res = await ParentService.getAllParents();
    const normalized = (await import('@/utils/normalizeResponse')).normalizeArray(res) as unknown as ParentDto[];
    setItems(normalized || []);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      if (values && typeof values === 'object' && 'Id' in values) {
        const v = values as unknown as ParentDto;
        await ParentService.updateParent(v.Id, {
          FirstName: String(v.FirstName ?? ''),
          LastName: String(v.LastName ?? ''),
          Identification: String(v.Identification ?? ''),
          Phone: String(v.Phone ?? ''),
          Address: String(v.Address ?? ''),
          Occupation: String(v.Occupation ?? ''),
        });
      } else {
        const payload = { ...(values as unknown as Omit<ParentDto, 'Id'>), active: true };
        await ParentService.createParent(payload);
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

  const handleEdit = (item: ParentDto) => { setEditing(item); setShowForm(true); };
  const [confirm, setConfirm] = useState<{ open: boolean; id?: number }>({ open: false });
  const handleDeleteConfirmed = async (id?: number) => {
    try {
      if (!id) return;
      await ParentService.deleteParentLogical(id);
      toast.success('Padre eliminado');
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

    // Build candidate requests to try activating the record.
    const base = ENDPOINTS.Parent;
    const payload = {
      FirstName: String(item.FirstName ?? ''),
      LastName: String(item.LastName ?? ''),
      Identification: String(item.Identification ?? ''),
      Phone: String(item.Phone ?? ''),
      Address: String(item.Address ?? ''),
      Occupation: String(item.Occupation ?? ''),
      active: true,
    } as Omit<ParentDto, 'Id'>;

    const candidates: Array<{ url: string; method: string; body?: unknown }> = [
      // try PATCH to the canonical update endpoint
      { url: base.updateParent.replace('{id}', String(id)), method: 'PATCH', body: payload },
      // try PATCH to the deleteLogical endpoint (some APIs accept a PATCH here)
      { url: base.deleteParent.replace('{id}', String(id)), method: 'PATCH', body: { active: true } },
      // try a POST to common restore/activate patterns
      { url: `${API_BASE_URL}Parent/${id}/restore/`, method: 'POST' },
      { url: `${API_BASE_URL}Parent/${id}/activate/`, method: 'POST', body: { active: true } },
    ];

    let lastRes: Response | null = null;
    try {
      for (const c of candidates) {
        try {
          const init: RequestInit = { method: c.method, headers: { 'Accept': 'application/json' } };
          if (c.body !== undefined) {
            (init.headers as Record<string, string>)['Content-Type'] = 'application/json';
            init.body = JSON.stringify(c.body);
          }
          const res = await fetchWithAuth(c.url, init);
          lastRes = res;
          if (res.ok) {
            toast.success('Registro activado');
            await load();
            return;
          }
          // if 405, try next candidate
          if (res.status === 405) continue;
          // other non-ok -> try parse message and abort
          const data = await res.json().catch(() => null);
            const msg = data && typeof data === 'object' && 'message' in data ? String((data as Record<string, unknown>)['message']) : res.statusText;
          toast.error(String(msg ?? 'Error al activar'));
          return;
        } catch (innerErr) {
          // network or parse error — continue to next candidate
          console.warn('activate candidate failed', innerErr);
          continue;
        }
      }
      // none succeeded
      if (lastRes) {
        const allow = lastRes.headers.get('allow') || lastRes.headers.get('Allow') || '';
        toast.error(`No se pudo activar (server allow: ${allow || 'none'})`);
      } else {
        toast.error('No se pudo activar el registro (no response)');
      }
    } catch (err: unknown) {
      const maybe = err && typeof err === 'object' ? err as Record<string, unknown> : null;
      toast.error(maybe && maybe['message'] ? String(maybe['message']) : String(err ?? 'Error'));
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-green-700">Padres</h2>
        <UiButton label="Crear" onClick={() => { setEditing(null); setShowForm(true); }} />
      </div>

      <UiModal open={showForm} onClose={() => { setShowForm(false); setEditing(null); }} title={editing ? 'Editar Padre' : 'Crear Padre'}>
        <UiForm
          fields={[
            { name: 'FirstName', label: 'Nombre' },
            { name: 'LastName', label: 'Apellido' },
            { name: 'Identification', label: 'Identificación' },
            { name: 'Phone', label: 'Teléfono' },
            { name: 'Address', label: 'Dirección' },
            { name: 'Occupation', label: 'Ocupación' },
          ]}
          initial={editing ? (editing as unknown as Record<string, unknown>) : {}}
          onSubmit={handleSubmit}
        />
      </UiModal>

      <UiTable
        columns={[
          { key: 'FirstName', label: 'Nombre' },
          { key: 'LastName', label: 'Apellido' },
          { key: 'Identification', label: 'Identificación' },
          { key: 'Phone', label: 'Teléfono' },
          { key: 'Address', label: 'Dirección' },
          { key: 'active', label: 'Activo', render: (r: ParentDto) => r.active ? 'Sí' : 'No' },
        ]}
        data={items}
        actions={(row: ParentDto) => (
          <div className="flex gap-2">
            <UiButton label="Editar" variant="secondary" onClick={() => handleEdit(row)} />
              <UiButton label={row.active ? 'Eliminar' : 'Activar'} variant={row.active ? 'danger' : 'primary'} onClick={() => row.active ? handleDelete(row.Id) : handleActivate(row.Id)} />
          </div>
        )}
      />
      <UiConfirm
        open={confirm.open}
        title="Eliminar padre"
        message="¿Deseas eliminar este padre?"
        onConfirm={() => handleDeleteConfirmed(confirm.id)}
        onCancel={() => setConfirm({ open: false })}
      />
    </div>
  );
};

export default Parents;
