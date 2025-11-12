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
    return res.json();
  },

  async getAllOrphanages(): Promise<OrphanageDto[]> {
  const res = await fetchWithAuth(base.getAllOrphanages);
  return res.json();
  },

  async getOrphanageById(id: number): Promise<OrphanageDto> {
    const url = base.getOrphanageById.replace('{id}', String(id));
  const res = await fetchWithAuth(url);
  return res.json();
  },

  async updateOrphanage(id: number, payload: Omit<OrphanageDto, 'Id'>) {
    const url = base.updateOrphanage.replace('{id}', String(id));
    const res = await fetchWithAuth(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async deleteOrphanageLogical(id: number) {
    const url = base.deleteOrphanage.replace('{id}', String(id));
    const res = await fetchWithAuth(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: false }),
    });
    return res.json();
  }
};
