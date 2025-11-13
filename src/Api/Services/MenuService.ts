import { ENDPOINTS } from "../config/ConfigApi";
import { MenuDto } from "../types/Menu";
import { fetchWithAuth } from "../http";

const base = ENDPOINTS.menu;

export default {
  async getMenuItems(userId: number): Promise<MenuDto[]> {
    const url = base.getMenuItems.replace('{userId}', String(userId));
    const res = await fetchWithAuth(url);
    // Normalize backend JSON (it may use lowercase properties) into the
    // expected MenuDto shape (PascalCase) so the UI code can rely on it.
    const raw = await res.json();
    if (!raw) return [];

    const arr = Array.isArray(raw) ? raw : [raw];

    const normalized: MenuDto[] = arr.map((m: unknown) => {
      const mm = m as Record<string, unknown>;
      const rawModules = (mm['ModuleForm'] ?? mm['moduleForm'] ?? []) as Array<Record<string, unknown>>;
      return {
        Rol: String(mm['Rol'] ?? mm['rol'] ?? ''),
        ModuleForm: rawModules.map((mf) => {
          const id = mf['Id'] ?? mf['id'] ?? 0;
          const rawForm = (mf['Form'] ?? mf['form'] ?? []) as Array<Record<string, unknown>>;
          return {
            Id: Number(id),
            Name: String(mf['Name'] ?? mf['name'] ?? ''),
            Form: rawForm.map((f) => ({
              Name: String(f['Name'] ?? f['name'] ?? ''),
              Path: String(f['Path'] ?? f['path'] ?? '')
            }))
          };
        })
      } as MenuDto;
    });

    return normalized;
  }
};
