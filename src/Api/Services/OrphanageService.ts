import { ENDPOINTS } from "../config/ConfigApi";
import { OrphanageDto } from "../types/Orphanage";
import { fetchWithAuth } from "../http";

const base = ENDPOINTS.Orphanage;

export default {
  async createOrphanage(payload: Omit<OrphanageDto, 'Id'>) {
    const res = await fetch(base.createOrphanage, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw data || { message: res.statusText };
    return data;
  },

  async getAllOrphanages(): Promise<OrphanageDto[]> {
  const res = await fetchWithAuth(base.getAllOrphanages);
  const data = await res.json().catch(() => []);
  if (!res.ok) throw data || { message: res.statusText };
  return data;
  },

  async getOrphanageById(id: number): Promise<OrphanageDto> {
    const url = base.getOrphanageById.replace('{id}', String(id));
  const res = await fetchWithAuth(url);
  const data = await res.json().catch(() => null);
  if (!res.ok) throw data || { message: res.statusText };
  return data;
  },

  async updateOrphanage(id: number, payload: Omit<OrphanageDto, 'Id'>) {
    const url = base.updateOrphanage.replace('{id}', String(id));
    const res = await fetchWithAuth(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw data || { message: res.statusText };
    return data;
  },

  async deleteOrphanageLogical(id: number) {
    const url = base.deleteOrphanage.replace('{id}', String(id));
    const res = await fetchWithAuth(url, {
      method: 'DELETE',
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw data || { message: res.statusText };
    return data;
  }
};
