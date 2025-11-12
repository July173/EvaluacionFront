import { ENDPOINTS } from "../config/ConfigApi";
import { MenuDto } from "../types/Menu";
import { fetchWithAuth } from "../http";

const base = ENDPOINTS.menu;

export default {
  async getMenuItems(userId: number): Promise<MenuDto[]> {
    const url = base.getMenuItems.replace('{userId}', String(userId));
    const res = await fetchWithAuth(url);
    return res.json();
  }
};
