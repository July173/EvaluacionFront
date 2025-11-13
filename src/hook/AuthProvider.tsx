import React, { createContext, useEffect, useState } from "react";
import AuthService from "../Api/Services/AuthService";
import { LoginUserDto, RegisterUserDto } from "../Api/types/Auth";
import { clearTokens } from "../Api/http";

export type AuthContextType = {
  accessToken: string | null;
  refreshToken: string | null;
  user: { id: string; email?: string; role?: number; person?: string } | null;
  login: (payload: LoginUserDto) => Promise<boolean>;
  logout: () => void;
  register: (payload: RegisterUserDto) => Promise<boolean>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem("access_token"));
  const [refreshToken, setRefreshToken] = useState<string | null>(() => localStorage.getItem("refresh_token"));
  const [user, setUser] = useState<{ id: string; email?: string; role?: number; person?: string } | null>(() => {
    try {
      const s = localStorage.getItem('user_data');
      if (!s) return null;
      const parsed = JSON.parse(s) as Record<string, unknown>;
      return {
        id: String(parsed['id'] || parsed['Id'] || ''),
        email: (parsed['email'] as string) || undefined,
        role: parsed['role'] ? Number(parsed['role']) : undefined,
        person: parsed['person'] ? String(parsed['person']) : undefined,
      };
    } catch (e) {
      console.warn('Failed to read persisted user_data', e);
      return null;
    }
  });

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "access_token") setAccessToken(e.newValue);
      if (e.key === "refresh_token") setRefreshToken(e.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = async (payload: LoginUserDto) => {
    const data = await AuthService.login(payload);
    if (data && data.access_token) {
      localStorage.setItem("access_token", data.access_token);
      if (data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token || null);
      // Extract some basic user info from the JWT and persist a minimal `user_data`
      try {
        const parseJwt = (token: string) => {
          const p = token.split('.')[1] || '';
          const normalized = p.replace(/-/g, '+').replace(/_/g, '/');
          const decodedJson = atob(normalized);
          return JSON.parse(decodedJson) as Record<string, unknown>;
        };

        const payload = parseJwt(data.access_token);
  const id = (payload['nameid'] || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || payload['sub'] || payload['unique_name'])?.toString?.() ?? '';
  const email = (payload['email'] || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']) as string || '';
  const roleNum = payload['rol_id'] ? Number(payload['rol_id'] as unknown) : undefined;

  const userData = { id: id, email: email || undefined, role: roleNum, person: undefined };
  // keep a minimal persisted user id/email for convenience across reloads
  try { localStorage.setItem('user_data', JSON.stringify(userData)); } catch (e) { console.warn('Failed to persist user_data', e); }
  setUser(userData);
      } catch (e) {
        // ignore parsing errors — tokens still valid for auth
        console.warn('Failed to parse JWT for user_data', e);
      }

      return true;
    }
    return false;
  };

  const logout = () => {
    clearTokens();
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  const register = async (payload: RegisterUserDto) => {
    const data = await AuthService.register(payload);
    return !!(data && data.isSuccess);
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
