/**
 * estado.ts — estado de navegación en la URL y avisos al usuario.
 *
 * Un único parámetro `?s=` con JSON en base64url, igual que el resto del
 * ecosistema (`is-webcomponents`, front anterior). Ventaja concreta: el enlace
 * que se comparte lleva tiquete, espacio, tema y modo de página completa en un
 * solo valor, y añadir campos no rompe los enlaces ya repartidos.
 */
import { b64url } from '../components/tk/_shared.js';

/**
 * Raíz del proyecto: base para resolver los fuentes al exportar.
 *
 * Se calcula defensivamente porque este módulo ya no lo carga solo el visor:
 * `<tk-view>` lo arrastra vía `api.js`, y una ficha suelta puede vivir en un
 * documento sin base resoluble (`about:blank` en tests con jsdom, o un `srcdoc`).
 * Ahí `new URL('.', baseURI)` lanza y tumbaba la carga entera del componente.
 */
export const raiz = (() => {
  try {
    return new URL('.', document.baseURI).href;
  } catch {
    return '';
  }
})();

const leer = (): TkEstadoUrl => {
  const params = new URLSearchParams(location.search);
  const s = params.get('s');
  if (!s) return {};
  try {
    return JSON.parse(b64url.decode(s)) as TkEstadoUrl;
  } catch {
    // Un `?s=` corrupto no debe dejar la aplicación en blanco.
    return {};
  }
};

const escribir = (parcial: TkEstadoUrl, reemplazar = false): TkEstadoUrl => {
  const siguiente: TkEstadoUrl = { ...leer(), ...parcial };
  // Los campos vacíos no viajan: mantiene el enlace corto y legible.
  const limpio = Object.fromEntries(
    Object.entries(siguiente).filter(([, v]) => v != null && v !== '' && v !== false),
  ) as TkEstadoUrl;

  const url = new URL(location.href);
  if (Object.keys(limpio).length) url.searchParams.set('s', b64url.encode(JSON.stringify(limpio)));
  else url.searchParams.delete('s');

  history[reemplazar ? 'replaceState' : 'pushState']({}, '', url);
  return limpio;
};

const enlace = (parcial: TkEstadoUrl): string => {
  const url = new URL(location.href);
  url.searchParams.set('s', b64url.encode(JSON.stringify(parcial)));
  return url.href;
};

export const estado: TkEstadoApi = { leer, escribir, enlace };

/** Aviso efímero. Sin <is-toast> montado, degrada a consola: nunca lanza. */
export const aviso = (mensaje: string, color: TkAvisoColor = 'brand'): void => {
  type Toast = HTMLElement & { create?(m: string, o: Record<string, unknown>): unknown };
  const host = document.querySelector('is-toast') as Toast | null;
  if (host?.create) {
    host.create(mensaje, { color, duration: color === 'warning' || color === 'danger' ? 8000 : 4000 });
    return;
  }
  if (color === 'danger' || color === 'warning') console.warn(`[tk] ${mensaje}`);
  else console.info(`[tk] ${mensaje}`);
};
