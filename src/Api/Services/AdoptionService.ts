import { ENDPOINTS } from "../config/ConfigApi";
import { AdoptionDto } from "../types/Adoption";
import { fetchWithAuth } from "../http";

const base = ENDPOINTS.Adoption;

export default {
  async createAdoption(payload: Omit<AdoptionDto, 'Id'>) {
    const res = await fetchWithAuth(base.createAdoption, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw data || { message: res.statusText };
    return data;
  },

  async getAllAdoptions(): Promise<AdoptionDto[]> {
    const res = await fetchWithAuth(base.getAllAdoptions);
    const data = await res.json().catch(() => []);
    if (!res.ok) throw data || { message: res.statusText };
    return data;
  },

  async getAdoptionById(id: number): Promise<AdoptionDto> {
    const url = base.getAdoptionById.replace('{id}', String(id));
    const res = await fetchWithAuth(url);
    const data = await res.json().catch(() => null);
    if (!res.ok) throw data || { message: res.statusText };
    return data;
  },

  async updateAdoption(id: number, payload: Omit<AdoptionDto, 'Id'>) {
    const url = base.updateAdoption.replace('{id}', String(id));
    const res = await fetchWithAuth(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw data || { message: res.statusText };
    return data;
  },

  async deleteAdoptionLogical(id: number) {
    const url = base.deleteAdoption.replace('{id}', String(id));
    const res = await fetchWithAuth(url, {
      method: 'DELETE',
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw data || { message: res.statusText };
    return data;
  }
};
