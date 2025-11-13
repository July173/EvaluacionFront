import API_BASE_URL, { ENDPOINTS } from "../config/ConfigApi";
import { ParentDto } from "../types/Parent";
import { fetchWithAuth } from "../http";

const parentBase = ENDPOINTS.Parent;

export default {
  async createParent(payload: Omit<ParentDto, 'Id'>) {
    const res = await fetchWithAuth(parentBase.createParent, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw data || { message: res.statusText };
    return data;
  },

  async getAllParents(): Promise<ParentDto[]> {
  const res = await fetchWithAuth(parentBase.getAllParents);
  const data = await res.json().catch(() => []);
  if (!res.ok) throw data || { message: res.statusText };
  return data;
  },

  async getParentById(id: number): Promise<ParentDto> {
    const url = parentBase.getParentById.replace('{id}', String(id));
  const res = await fetchWithAuth(url);
  const data = await res.json().catch(() => null);
  if (!res.ok) throw data || { message: res.statusText };
  return data;
  },

  async updateParent(id: number, payload: Omit<ParentDto, 'Id'>) {
    const url = parentBase.updateParent.replace('{id}', String(id));
    const res = await fetchWithAuth(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw data || { message: res.statusText };
    return data;
  },

  async deleteParentLogical(id: number) {
    const url = parentBase.deleteParent.replace('{id}', String(id));
    const res = await fetchWithAuth(url, {
      method: 'DELETE',
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw data || { message: res.statusText };
    return data;
  }
};
