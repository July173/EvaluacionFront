import { ENDPOINTS } from "../config/ConfigApi";
import { AdoptionDetailDto } from "../types/AdoptionDetail";
import { fetchWithAuth } from "../http";

const base = ENDPOINTS.AdoptionDetail;

export default {
  async createAdoptionDetail(payload: Omit<AdoptionDetailDto, 'Id'>) {
    const res = await fetchWithAuth(base.createAdoptionDetail, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw data || { message: res.statusText };
    return data;
  },

  async getAllAdoptionDetails(): Promise<AdoptionDetailDto[]> {
    const res = await fetchWithAuth(base.getAllAdoptionDetails);
    const data = await res.json().catch(() => []);
    if (!res.ok) throw data || { message: res.statusText };
    return data;
  },

  async getAdoptionDetailById(id: number): Promise<AdoptionDetailDto> {
    const url = base.getAdoptionDetailById.replace('{id}', String(id));
    const res = await fetchWithAuth(url);
    const data = await res.json().catch(() => null);
    if (!res.ok) throw data || { message: res.statusText };
    return data;
  },

  async updateAdoptionDetail(id: number, payload: Omit<AdoptionDetailDto, 'Id'>) {
    const url = base.updateAdoptionDetail.replace('{id}', String(id));
    const res = await fetchWithAuth(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw data || { message: res.statusText };
    return data;
  },

  async deleteAdoptionDetailLogical(id: number) {
    const url = base.deleteAdoptionDetail.replace('{id}', String(id));
    const res = await fetchWithAuth(url, {
      method: 'DELETE',
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw data || { message: res.statusText };
    return data;
  }
};
