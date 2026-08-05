/**
 * api.ts — acceso a los tiquetes públicos del worker `jagudeloe-tks`.
 *
 * Política de lectura, en este orden:
 *   1. Caché vigente (< 15 min) → se sirve sin tocar la red.
 *   2. Red → se sirve y se refresca la caché.
 *   3. Red caída + caché vencida → se sirve la copia vieja y se avisa por toast.
 *   4. Sin red ni caché → error explícito.
 *
 * Solo se consumen GET, que en el worker son públicos (`auth-guard`: las
 * mutaciones piden JWT, las lecturas no). Este visor nunca escribe.
 */
import { cache } from './cache.js';
import { aviso } from './estado.js';
import { fixMojibakeDeep } from './fix-mojibake.js';

const BASE_REMOTA = 'https://jagudeloe-tks.jeffaporta.workers.dev';
const ESPERA_MS = 12_000;

// Por defecto siempre el worker desplegado: `127.0.0.1` es la IP del propio
// visor servido en local (Live Server), no implica que `wrangler dev` esté
// corriendo. Para apuntar a un worker local se pasa `?api=http://127.0.0.1:8786`.
const base = new URLSearchParams(location.search).get('api') ?? BASE_REMOTA;

const SPACES: readonly TkSpace[] = ['patyia', 'clientesis', 'isp-svelte'];

/** Un solo aviso de degradación por sesión: repetirlo es ruido, no información. */
let avisadoSinRed = false;

const avisarDegradado = (guardadoEn: number): void => {
  if (avisadoSinRed) return;
  avisadoSinRed = true;
  const edad = Math.round((Date.now() - guardadoEn) / 60000);
  aviso(
    `El servidor de tiquetes no respondió. Se muestra la copia local de hace ${edad} min.`,
    'warning',
  );
};

const pedir = async <T>(ruta: string): Promise<T> => {
  const control = new AbortController();
  const corte = setTimeout(() => control.abort(), ESPERA_MS);
  try {
    const res = await fetch(`${base}${ruta}`, {
      signal: control.signal,
      headers: { accept: 'application/json' },
    });
    if (!res.ok) {
      let detail = `HTTP ${res.status}`;
      try {
        const body = await res.json() as { error?: string };
        if (body?.error) detail = `${detail}: ${body.error}`;
      } catch {
        /* cuerpo no JSON */
      }
      throw new Error(detail);
    }
    return await res.json() as T;
  } finally {
    clearTimeout(corte);
  }
};

/**
 * Lee con caché. `clave` identifica el recurso en IndexedDB; `valido`
 * descarta respuestas con forma inesperada para no cachear basura.
 */
const conCache = async <T>(
  clave: string,
  ruta: string,
  valido: (data: T) => boolean,
): Promise<TkResultado<T>> => {
  const guardado = await cache.leer<T>(clave);

  if (guardado && !guardado.vencida) {
    return { data: fixMojibakeDeep(guardado.data), origen: 'cache', guardadoEn: guardado.guardadoEn };
  }

  try {
    const data = await pedir<T>(ruta);
    if (!valido(data)) throw new Error('Respuesta inesperada del worker');
    const limpio = fixMojibakeDeep(data);
    const guardadoEn = await cache.escribir(clave, limpio);
    return { data: limpio, origen: 'red', guardadoEn };
  } catch (e) {
    const motivo = e instanceof Error ? e.message : String(e);
    if (guardado) {
      avisarDegradado(guardado.guardadoEn);
      return {
        data: fixMojibakeDeep(guardado.data),
        origen: 'cache-vencida',
        guardadoEn: guardado.guardadoEn,
        error: motivo,
      };
    }
    throw new Error(`No se pudo obtener ${ruta}: ${motivo}`);
  }
};

export const api: TkApiCliente = {
  base,
  spaces: SPACES,

  async listar(space: TkSpace): Promise<TkResultado<readonly TkTicketRow[]>> {
    const r = await conCache<TkListResponse>(
      `lista:${space}`,
      `/api/tk/${space}/tickets?limit=200`,
      (d) => !!d?.ok && Array.isArray(d.rows),
    );
    return { ...r, data: r.data.rows };
  },

  async listarTodos(): Promise<TkResultado<readonly TkTicketRow[]>> {
    const partes = await Promise.allSettled(SPACES.map((s) => api.listar(s)));
    const ok = partes.filter((p): p is PromiseFulfilledResult<TkResultado<readonly TkTicketRow[]>> =>
      p.status === 'fulfilled');
    if (!ok.length) throw new Error('Ningún espacio de tiquetes respondió');

    // Primero patyia/clientesis (space real); luego isp-svelte solo añade
    // ids nuevos. El filtro de pestaña usa heurística, no solo `space`.
    const porId = new Map<string, TkTicketRow>();
    for (const p of ok) {
      for (const fila of p.value.data) {
        const id = String(fila.iticket ?? '');
        if (!id || porId.has(id)) continue;
        porId.set(id, fila);
      }
    }
    const filas = [...porId.values()];
    const origen: TkOrigen = ok.some((p) => p.value.origen === 'cache-vencida')
      ? 'cache-vencida'
      : ok.every((p) => p.value.origen === 'red') ? 'red' : 'cache';

    filas.sort((a, b) => String(b.fechasolicitud ?? '').localeCompare(String(a.fechasolicitud ?? '')));
    return {
      data: filas,
      origen,
      guardadoEn: Math.min(...ok.map((p) => p.value.guardadoEn)),
    };
  },

  async ticket(space: TkSpace, iticket: string): Promise<TkResultado<TkTicket>> {
    // No uppercasing: en PG `TK-ISP-Svelte` ≠ `TK-ISP-SVELTE` (seed preservó casing).
    const trimmed = iticket.trim();
    const id = /^TK-/i.test(trimmed) ? trimmed : `TK-${trimmed}`;
    const r = await conCache<TkDetailResponse>(
      `tk:${id}`,
      `/api/tk/${space}/tickets/${encodeURIComponent(id)}`,
      (d) => !!d?.ok && !!d.ticket?.iticket,
    );
    return { ...r, data: r.data.ticket! };
  },

  async refrescar(): Promise<void> {
    await cache.limpiar();
    avisadoSinRed = false;
  },
};
