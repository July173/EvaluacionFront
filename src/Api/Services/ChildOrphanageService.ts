import { ENDPOINTS } from "../config/ConfigApi";
import { ChildOrphanageDto } from "../types/ChildOrphanage";
import { fetchWithAuth } from "../http";

const base = ENDPOINTS.ChildOrphanage;

export default {
  async createChildOrphanage(payload: Omit<ChildOrphanageDto, 'Id'>) {
    const res = await fetchWithAuth(base.createChildOrphanage, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw data || { message: res.statusText };
    return data;
  },

  async getAllChildOrphanages(): Promise<ChildOrphanageDto[]> {
    const res = await fetchWithAuth(base.getAllChildren);
    const data = await res.json().catch(() => []);
    if (!res.ok) throw data || { message: res.statusText };
    return data;
  },

  async getChildOrphanageById(id: number): Promise<ChildOrphanageDto> {
    const url = base.getChildById.replace('{id}', String(id));
    const res = await fetchWithAuth(url);
    const data = await res.json().catch(() => null);
    if (!res.ok) throw data || { message: res.statusText };
    return data;
  },

  async updateChildOrphanage(id: number, payload: Omit<ChildOrphanageDto, 'Id'>) {
    const url = base.updateChild.replace('{id}', String(id));
    const res = await fetchWithAuth(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw data || { message: res.statusText };
    return data;
  },

  async deleteChildOrphanageLogical(id: number) {
    const url = base.deleteChild.replace('{id}', String(id));
    const res = await fetchWithAuth(url, {
      method: 'DELETE',
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw data || { message: res.statusText };
    return data;
  }
};
