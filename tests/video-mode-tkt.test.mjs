/**
 * `?mode-tkt=free` es lo único que muestra los videos de un tiquete.
 *
 * Por defecto se ocultan: la ficha se comparte e imprime, y el video es
 * divulgación, no expediente. La regla vive en `<tk-view>` — una página que
 * olvide filtrar no debe poder publicar el video por accidente.
 */
import test, { before, after } from 'node:test';
import assert from 'node:assert';
import { JSDOM } from 'jsdom';

const cdn = (n) => new URL(`../dist/cdn/${n}.js`, import.meta.url).href;

const TICKET = {
  iticket: 'TK-1459279',
  space: 'clientesis',
  titulo: 'Migración del módulo de conocimiento',
  content: [
    { kind: 'markdown', sortkey: 0, payload: { docLane: 'solicitud', title: 'El síntoma', text: 'Dos conteos que no cuadran.' } },
    { kind: 'video', sortkey: 1, payload: { docLane: 'otros', title: 'Video del tiquete', youtubeid: 'dQw4w9WgXcQ' } },
    { kind: 'youtube', sortkey: 2, payload: { docLane: 'otros', title: 'Otro video', youtubeid: 'dQw4w9WgXcQ' } },
  ],
};

let dom;

before(async () => {
  // Un único jsdom para todo el archivo: los custom elements se registran una
  // vez por proceso, y volcar un `window` nuevo sobre el global a mitad de la
  // suite deja referencias cruzadas que acaban en recursión infinita.
  dom = new JSDOM('<!doctype html><html data-theme="dark"><body></body></html>', {
    url: 'https://ejemplo.test/docs/ficha.html',
    pretendToBeVisual: true,
  });
  dom.window.CSSStyleSheet = class { replaceSync() {} };
  Object.defineProperty(dom.window.ShadowRoot.prototype, 'adoptedStyleSheets', {
    configurable: true,
    get() { return this._hojas ?? []; },
    set(v) { this._hojas = v; },
  });
  const RESERVADOS = new Set([
    'window', 'document', 'globalThis',
    'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval',
    'queueMicrotask', 'fetch', 'Response', 'Request', 'Headers',
  ]);
  for (const clave of Object.getOwnPropertyNames(dom.window)) {
    if (RESERVADOS.has(clave)) continue;
    const d = Object.getOwnPropertyDescriptor(globalThis, clave);
    if (d && !d.configurable) continue;
    try { globalThis[clave] = dom.window[clave]; } catch { /* no configurable */ }
  }
  Object.defineProperty(globalThis, 'document', { value: dom.window.document, configurable: true });
  await import(cdn('tk.all'));
});

after(() => { dom?.window?.close?.(); });

/** Cambia la query de la página, monta un `<tk-view>` y cuenta los videos. */
function contarVideos(query) {
  // `bloquesDe` lee `location.search` en cada render: basta reconfigurar la URL.
  dom.reconfigure({ url: `https://ejemplo.test/docs/ficha.html${query}` });
  dom.window.document.body.innerHTML = '';

  const el = dom.window.document.createElement('tk-view');
  el.setAttribute('embebido', '');
  dom.window.document.body.append(el);
  el.ticket = TICKET;

  const kinds = [...el.shadowRoot.querySelectorAll('tk-block')].map((b) => String(b.bloque?.kind ?? ''));
  return { videos: kinds.filter((k) => k === 'video' || k === 'youtube').length, total: kinds.length };
}

test('sin query, los videos no se pintan', () => {
  const r = contarVideos('');
  assert.strictEqual(r.videos, 0, 'el video no debe aparecer sin mode-tkt=free');
  assert.strictEqual(r.total, 1, 'el resto del documento sí se pinta');
});

test('con ?mode-tkt=free, los videos se pintan', () => {
  const r = contarVideos('?mode-tkt=free');
  assert.strictEqual(r.videos, 2, 'los dos bloques de video deben aparecer');
  assert.strictEqual(r.total, 3);
});

test('otro valor de mode-tkt no destapa los videos', () => {
  const r = contarVideos('?mode-tkt=1');
  assert.strictEqual(r.videos, 0, 'solo el valor exacto `free` los muestra');
});
