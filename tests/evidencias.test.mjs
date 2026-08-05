/**
 * evidencias.test.mjs — la galería de evidencias no repite ni desborda.
 *
 * ago/2026: TK-1447428 mostraba tres veces la misma captura (el seed subió el
 * mismo PNG a tres claves R2) y las miniaturas ocupaban el ancho completo del
 * documento. El origen se corrigió en los datos; esto blinda el visor.
 *
 *   npm run test
 */
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const cdn = (nombre) => pathToFileURL(join(raiz, 'dist/cdn', `${nombre}.js`)).href;

const R2 = 'https://pub-1c290cc606c8478899f5764899278571.r2.dev/patyia/diligencias';

before(async () => {
  const dom = new JSDOM('<!doctype html><html data-theme="dark"><body></body></html>', {
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });
  dom.window.CSSStyleSheet = class { replaceSync() {} };
  Object.defineProperty(dom.window.ShadowRoot.prototype, 'adoptedStyleSheets', {
    configurable: true,
    get() { return this._hojas ?? []; },
    set(v) { this._hojas = v; },
  });
  for (const clave of Object.getOwnPropertyNames(dom.window)) {
    if (clave === 'window' || clave === 'document' || clave === 'globalThis') continue;
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, clave);
    if (descriptor && !descriptor.configurable) continue;
    try { globalThis[clave] = dom.window[clave]; } catch { /* propiedades no configurables del host */ }
  }
  Object.defineProperty(globalThis, 'document', { value: dom.window.document, configurable: true });

  for (const nombre of ['tk-image', 'tk-block', 'tk-markdown', 'tk-ticket-head', 'tk-view']) {
    await import(cdn(nombre));
  }
  globalThis.__dom__ = dom;
});

const ticketCon = (bloques) => ({
  iticket: 'TK-1447428',
  space: 'patyia',
  titulo: 'Conversaciones no obtiene el módulo',
  estado: 'cerrado',
  content: bloques,
});

test('la misma captura en varios bloques se pinta una sola vez', () => {
  const { window } = globalThis.__dom__;
  window.document.body.innerHTML = '';

  const url = `${R2}/tk1447428-solicitud-insoft.png`;
  const vista = window.document.createElement('tk-view');
  vista.ticket = ticketCon([
    { kind: 'image', sortkey: 0, payload: { url, alt: 'Solicitud', docLane: 'evidencias' } },
    { kind: 'image', sortkey: 1, payload: { url, alt: 'Problema', docLane: 'evidencias' } },
    { kind: 'image', sortkey: 2, payload: { url: `${R2}/tk1447428-bd-insoft.png`, alt: 'BD', docLane: 'evidencias' } },
  ]);
  window.document.body.append(vista);

  // Cada bloque vive en el shadow de su <tk-block>.
  const imagenes = [...vista.shadowRoot.querySelectorAll('tk-block')]
    .map((b) => b.shadowRoot.querySelector('tk-image'))
    .filter(Boolean);
  assert.equal(imagenes.length, 2, 'las evidencias con la misma URL no deben repetirse');
});

test('tk-image no repite figuras dentro de un image-group', () => {
  const { window } = globalThis.__dom__;
  window.document.body.innerHTML = '';

  const url = `${R2}/tk1447446-solicitud-insoft.png`;
  const bloque = window.document.createElement('tk-image');
  bloque.bloques = [
    { kind: 'image', payload: { url, alt: 'Una' } },
    { kind: 'image', payload: { url, alt: 'Otra' } },
  ];
  bloque.payload = { title: 'Evidencias' };
  window.document.body.append(bloque);

  assert.equal(bloque.shadowRoot.querySelectorAll('figure').length, 1);
});

test('las miniaturas van en rejilla acotada, no a ancho completo', async () => {
  const codigo = await readFile(join(raiz, 'src', 'components', 'tk', 'tk-image.ts'), 'utf8');

  assert.match(
    codigo,
    /repeat\(auto-fill,\s*minmax\(/,
    'auto-fit estira la única evidencia a todo el ancho: la rejilla usa auto-fill',
  );
  assert.match(
    codigo,
    /object-fit:\s*cover/,
    'la miniatura recorta a una altura fija; el detalle se ve en el lightbox',
  );
  assert.doesNotMatch(
    codigo,
    /figuras\.length > 1 \? 'rejilla'/,
    'la rejilla aplica también con una sola evidencia',
  );
});
