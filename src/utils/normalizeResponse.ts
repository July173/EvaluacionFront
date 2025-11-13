export function normalizeItem<T>(o: Record<string, unknown>): T {
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(o)) {
    // keep `active` as lowercase because DTOs use `active` (not PascalCase)
    if (k.toLowerCase() === 'active') {
      out['active'] = o[k];
      continue;
    }
    // keep snake_case and already PascalCase as-is
    if (k.includes('_')) {
      out[k] = o[k];
      continue;
    }
    // if key already starts with uppercase, keep
    if (k[0] && k[0] === k[0].toUpperCase()) {
      out[k] = o[k];
      continue;
    }
    // convert first letter to uppercase (camelCase -> PascalCase)
    const nk = k.charAt(0).toUpperCase() + k.slice(1);
    out[nk] = o[k];
  }
  return out as unknown as T;
}

export function normalizeArray<T>(arr: unknown): T[] {
  const raw = arr as unknown as Record<string, unknown>[];
  if (!Array.isArray(raw)) return [];
  return raw.map((r) => normalizeItem<T>(r));
}
