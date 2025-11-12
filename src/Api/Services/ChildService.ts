import { ENDPOINTS } from "../config/ConfigApi";
import { ChildDto } from "../types/Child";

const base = ENDPOINTS.Child;

export default {
  async createChild(payload: Omit<ChildDto, 'Id'>) {
    const res = await fetch(base.createChild, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async getAllChildren(): Promise<ChildDto[]> {
    const res = await fetch(base.getAllChildren);
    return res.json();
  },

  async getChildById(id: number): Promise<ChildDto> {
    const url = base.getChildById.replace('{id}', String(id));
    const res = await fetch(url);
    return res.json();
  },

  async updateChild(id: number, payload: Omit<ChildDto, 'Id'>) {
    const url = base.updateChild.replace('{id}', String(id));
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async deleteChildLogical(id: number) {
    const url = base.deleteChild.replace('{id}', String(id));
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: false }),
    });
    return res.json();
  }
};
