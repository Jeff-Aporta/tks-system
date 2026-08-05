/**
 * Repara mojibake UTF-8 leído como CP850 (p. ej. "c├│digo" → "código").
 * Copia del contrato del worker; defensa en el visor si el CDN aún sirve datos crudos.
 */
import { MOJIBAKE_PAIRS } from './mojibake-pairs.js';

const MARK = /[\u2500-\u257FÔ]|Ã[\x80-\xBF]|Â[\x80-\xBF]/;

export function fixMojibake(input: string): string {
  if (!input || !MARK.test(input)) return input;
  let out = input;
  for (const [bad, good] of MOJIBAKE_PAIRS) {
    if (out.includes(bad)) out = out.split(bad).join(good);
  }
  return out;
}

export function fixMojibakeDeep<T>(value: T): T {
  if (typeof value === 'string') return fixMojibake(value) as T;
  if (Array.isArray(value)) return value.map((v) => fixMojibakeDeep(v)) as T;
  if (value && typeof value === 'object') {
    const o: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      o[k] = fixMojibakeDeep(v);
    }
    return o as T;
  }
  return value;
}
