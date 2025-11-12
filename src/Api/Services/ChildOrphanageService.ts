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
    return res.json();
  },

  async getAllChildOrphanages(): Promise<ChildOrphanageDto[]> {
    const res = await fetchWithAuth(base.getAllChildren);
    return res.json();
  },

  async getChildOrphanageById(id: number): Promise<ChildOrphanageDto> {
    const url = base.getChildById.replace('{id}', String(id));
    const res = await fetchWithAuth(url);
    return res.json();
  },

  async updateChildOrphanage(id: number, payload: Omit<ChildOrphanageDto, 'Id'>) {
    const url = base.updateChild.replace('{id}', String(id));
    const res = await fetchWithAuth(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async deleteChildOrphanageLogical(id: number) {
    const url = base.deleteChild.replace('{id}', String(id));
    const res = await fetchWithAuth(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: false }),
    });
    return res.json();
  }
};
