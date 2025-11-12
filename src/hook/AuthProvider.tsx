import React, { createContext, useEffect, useState } from "react";
import AuthService from "../Api/Services/AuthService";
import { LoginUserDto, RegisterUserDto } from "../Api/types/Auth";
import { clearTokens } from "../Api/http";

export type AuthContextType = {
  accessToken: string | null;
  refreshToken: string | null;
  login: (payload: LoginUserDto) => Promise<boolean>;
  logout: () => void;
  register: (payload: RegisterUserDto) => Promise<boolean>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem("access_token"));
  const [refreshToken, setRefreshToken] = useState<string | null>(() => localStorage.getItem("refresh_token"));

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
      return true;
    }
    return false;
  };

  const logout = () => {
    clearTokens();
    setAccessToken(null);
    setRefreshToken(null);
  };

  const register = async (payload: RegisterUserDto) => {
    const data = await AuthService.register(payload);
    return !!(data && data.isSuccess);
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
