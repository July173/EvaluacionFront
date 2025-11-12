import { ENDPOINTS } from "../config/ConfigApi";
import { AdoptionDto } from "../types/Adoption";

const base = ENDPOINTS.Adoption;

export default {
  async createAdoption(payload: Omit<AdoptionDto, 'Id'>) {
    const res = await fetch(base.createAdoption, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async getAllAdoptions(): Promise<AdoptionDto[]> {
    const res = await fetch(base.getAllAdoptions);
    return res.json();
  },

  async getAdoptionById(id: number): Promise<AdoptionDto> {
    const url = base.getAdoptionById.replace('{id}', String(id));
    const res = await fetch(url);
    return res.json();
  },

  async updateAdoption(id: number, payload: Omit<AdoptionDto, 'Id'>) {
    const url = base.updateAdoption.replace('{id}', String(id));
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async deleteAdoptionLogical(id: number) {
    const url = base.deleteAdoption.replace('{id}', String(id));
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: false }),
    });
    return res.json();
  }
};
