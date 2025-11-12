import { ENDPOINTS } from "./config/ConfigApi";
import AuthService from "./Services/AuthService";

type FetchInput = Parameters<typeof fetch>[0];
type FetchInit = Parameters<typeof fetch>[1];

/**
 * Simple fetch wrapper that adds Authorization header from localStorage.
 * On 401 it will attempt to refresh the access token using the refresh endpoint
 * and retry the original request once.
 */
export async function fetchWithAuth(input: FetchInput, init?: FetchInit) {
  const access = localStorage.getItem("access_token");
  const headers = new Headers(init?.headers as HeadersInit);
  if (access) headers.set("Authorization", `Bearer ${access}`);
  headers.set("Accept", "application/json");

  const merged: RequestInit = { ...(init || {}), headers };

  let res = await fetch(input, merged);

  if (res.status !== 401) return res;

  // Try refresh
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) return res;

  try {
    const refreshed = await AuthService.refreshToken(refresh);
    if (refreshed && refreshed.access_token) {
      localStorage.setItem("access_token", refreshed.access_token);
      if (refreshed.refresh_token) localStorage.setItem("refresh_token", refreshed.refresh_token);

      // retry original request with new token
      const headers2 = new Headers(init?.headers as HeadersInit);
      headers2.set("Authorization", `Bearer ${refreshed.access_token}`);
      headers2.set("Accept", "application/json");
      const merged2: RequestInit = { ...(init || {}), headers: headers2 };
      res = await fetch(input, merged2);
    }
  } catch (err) {
    // refresh failed — propagate original 401
    return res;
  }

  return res;
}

export function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}
