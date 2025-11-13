import { ENDPOINTS, default as API_BASE_URL } from './config/ConfigApi';
import { fetchWithAuth } from './http';

export async function tryActivateEntity(entityKey: keyof typeof ENDPOINTS, id: number, payload?: unknown) {
  const base = ENDPOINTS[entityKey] as unknown as Record<string, string>;
  const candidates: Array<{ url: string; method: string; body?: unknown }> = [];

  // canonical update endpoint
  if (base && base.updateParent) {
    // special-case: many ENDPOINTS objects use different keys; try generic patterns
  }

  // Try to locate update and deleteLogical keys generically
  const updateKey = Object.keys(base).find((k) => /update/i.test(k));
  const deleteKey = Object.keys(base).find((k) => /delete/i.test(k));

  if (updateKey) candidates.push({ url: base[updateKey].replace('{id}', String(id)), method: 'PATCH', body: payload });
  if (deleteKey) candidates.push({ url: base[deleteKey].replace('{id}', String(id)), method: 'PATCH', body: { active: true } });

  // common restore/activate paths
  candidates.push({ url: `${API_BASE_URL}${entityKey}/${id}/restore/`, method: 'POST' });
  candidates.push({ url: `${API_BASE_URL}${entityKey}/${id}/activate/`, method: 'POST', body: { active: true } });

  let lastRes: Response | null = null;
  for (const c of candidates) {
    try {
      const init: RequestInit = { method: c.method, headers: { 'Accept': 'application/json' } };
      if (c.body !== undefined) {
        (init.headers as Record<string, string>)['Content-Type'] = 'application/json';
        init.body = JSON.stringify(c.body);
      }
      const res = await fetchWithAuth(c.url, init);
      lastRes = res;
      if (res.ok) return { ok: true, res };
      if (res.status === 405) continue;
      return { ok: false, res };
    } catch (err) {
      // continue
      console.warn('activate candidate failed', err);
      continue;
    }
  }
  return { ok: false, res: lastRes };
}

export default tryActivateEntity;
