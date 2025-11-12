import API_BASE_URL, { ENDPOINTS } from "../config/ConfigApi";
import { ParentDto } from "../types/Parent";

const parentBase = ENDPOINTS.Parent;

export default {
  async createParent(payload: Omit<ParentDto, 'Id'>) {
    const res = await fetch(parentBase.createParent, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async getAllParents(): Promise<ParentDto[]> {
    const res = await fetch(parentBase.getAllParents);
    return res.json();
  },

  async getParentById(id: number): Promise<ParentDto> {
    const url = parentBase.getParentById.replace('{id}', String(id));
    const res = await fetch(url);
    return res.json();
  },

  async updateParent(id: number, payload: Omit<ParentDto, 'Id'>) {
    const url = parentBase.updateParent.replace('{id}', String(id));
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async deleteParentLogical(id: number) {
    const url = parentBase.deleteParent.replace('{id}', String(id));
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: false }),
    });
    return res.json();
  }
};
