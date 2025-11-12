import { ENDPOINTS } from "../config/ConfigApi";
import { AdoptionDetailDto } from "../types/AdoptionDetail";

const base = ENDPOINTS.AdoptionDetail;

export default {
  async createAdoptionDetail(payload: Omit<AdoptionDetailDto, 'Id'>) {
    const res = await fetch(base.createAdoptionDetail, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async getAllAdoptionDetails(): Promise<AdoptionDetailDto[]> {
    const res = await fetch(base.getAllAdoptionDetails);
    return res.json();
  },

  async getAdoptionDetailById(id: number): Promise<AdoptionDetailDto> {
    const url = base.getAdoptionDetailById.replace('{id}', String(id));
    const res = await fetch(url);
    return res.json();
  },

  async updateAdoptionDetail(id: number, payload: Omit<AdoptionDetailDto, 'Id'>) {
    const url = base.updateAdoptionDetail.replace('{id}', String(id));
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async deleteAdoptionDetailLogical(id: number) {
    const url = base.deleteAdoptionDetail.replace('{id}', String(id));
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: false }),
    });
    return res.json();
  }
};
