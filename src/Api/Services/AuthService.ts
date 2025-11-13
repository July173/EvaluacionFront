import { ENDPOINTS } from "../config/ConfigApi";
import { LoginUserDto, RegisterUserDto } from "../types/Auth";

const base = ENDPOINTS.Auth;

export default {
  async register(payload: RegisterUserDto) {
    // Debug: print resolved endpoint so we can confirm the exact URL used by fetch
    try {
      console.debug("AuthService.register -> URL:", base.register);
    } catch (e) {
      /* ignore in non-browser envs */
    }

    const res = await fetch(base.register, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async login(payload: LoginUserDto) {
    const res = await fetch(base.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async refreshToken(token: string) {
    const res = await fetch(base.refreshToken, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    return res.json();
  },

  async revokeToken(token: string) {
    const res = await fetch(base.revokeToken, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    return res.json();
  }
};
