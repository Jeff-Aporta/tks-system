/**
 * is-cdn.ts — URL del kit is-* (siempre tip de main en jsDelivr).
 *
 * El visor de tiquetes sigue el CDN publicado en `main` del kit; no se fija
 * un SHA. Tras cada push a Jeff-Aporta/is-webcomponents, jsDelivr sirve la
 * última revisión (a veces con caché corta de ~minutes).
 */
export const IS_CDN =
  'https://cdn.jsdelivr.net/gh/Jeff-Aporta/is-webcomponents@main/dist/cdn';
