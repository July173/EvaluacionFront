import { ENDPOINTS } from "../config/ConfigApi";
import { MenuDto } from "../types/Menu";

const base = ENDPOINTS.menu;

export default {
  async getMenuItems(userId: number): Promise<MenuDto> {
    const url = base.getMenuItems.replace('{userId}', String(userId));
    const res = await fetch(url);
    return res.json();
  }
};
