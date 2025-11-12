import { ENDPOINTS } from "../config/ConfigApi";
import { SocialWorkerDto } from "../types/SocialWorker";
import { fetchWithAuth } from "../http";

const base = ENDPOINTS.SocialWorker;

export default {
  async createSocialWorker(payload: Omit<SocialWorkerDto, 'Id'>) {
    const res = await fetchWithAuth(base.createSocialWorker, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async getAllSocialWorkers(): Promise<SocialWorkerDto[]> {
    const res = await fetchWithAuth(base.getAllSocialWorkers);
    return res.json();
  },

  async getSocialWorkerById(id: number): Promise<SocialWorkerDto> {
    const url = base.getSocialWorkerById.replace('{id}', String(id));
    const res = await fetchWithAuth(url);
    return res.json();
  },

  async updateSocialWorker(id: number, payload: Omit<SocialWorkerDto, 'Id'>) {
    const url = base.updateSocialWorker.replace('{id}', String(id));
    const res = await fetchWithAuth(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async deleteSocialWorkerLogical(id: number) {
    const url = base.deleteSocialWorker.replace('{id}', String(id));
    const res = await fetchWithAuth(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: false }),
    });
    return res.json();
  }
};
