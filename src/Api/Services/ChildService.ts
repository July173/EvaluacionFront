import { ENDPOINTS } from "../config/ConfigApi";
import { ChildDto } from "../types/Child";
import { fetchWithAuth } from "../http";

const base = ENDPOINTS.Child;

export default {
  async createChild(payload: Omit<ChildDto, 'Id'>) {
    const res = await fetchWithAuth(base.createChild, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw data || { message: res.statusText };
    return data;
  },

  async getAllChildren(): Promise<ChildDto[]> {
  const res = await fetchWithAuth(base.getAllChildren);
  const data = await res.json().catch(() => []);
  if (!res.ok) throw data || { message: res.statusText };
  return data;
  },

  async getChildById(id: number): Promise<ChildDto> {
    const url = base.getChildById.replace('{id}', String(id));
  const res = await fetchWithAuth(url);
  const data = await res.json().catch(() => null);
  if (!res.ok) throw data || { message: res.statusText };
  return data;
  },

  async updateChild(id: number, payload: Omit<ChildDto, 'Id'>) {
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

  async deleteChildLogical(id: number) {
    const url = base.deleteChild.replace('{id}', String(id));
    const res = await fetchWithAuth(url, {
      method: 'DELETE',
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw data || { message: res.statusText };
    return data;
  }
};
