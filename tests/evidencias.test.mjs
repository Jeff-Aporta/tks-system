/**
 * evidencias.test.mjs — la galería de evidencias no repite ni desborda.
 *
 * ago/2026:
 *   1) TK-1447428: misma captura 3× (seed R2) + miniatura a ancho completo.
 *   2) Imágenes consecutivas sin fusionar → cada `image` apilado full-width;
 *      rejilla con `1fr` / `auto-fit` estira la única celda.
 *
 * Contrato: `fusionarImagenes` en tk-view → `image-group`; CSS `auto-fill` +
 * tope 18rem + `justify-content: start`; dedupe por URL.
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

test('imágenes consecutivas se fusionan y no repiten la misma URL', () => {
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

  // Corrida de image → un solo image-group (un tk-image).
  const imagenes = [...vista.shadowRoot.querySelectorAll('tk-block')]
    .map((b) => b.shadowRoot.querySelector('tk-image'))
    .filter(Boolean);
  assert.equal(imagenes.length, 1, 'image consecutivos deben fusionarse en un image-group');

  const figuras = imagenes[0].shadowRoot.querySelectorAll('figure');
  assert.equal(figuras.length, 2, 'la misma URL no debe repetirse dentro del grupo');
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
    /minmax\(\s*min\(14rem,\s*100%\)\s*,\s*18rem\s*\)/,
    'tope fijo 18rem (no 1fr): con pocas evidencias no se estiran',
  );
  assert.match(
    codigo,
    /justify-content:\s*start/,
    'las celdas se empaquetan al inicio, no se reparte el espacio libre',
  );
  assert.match(
    codigo,
    /object-fit:\s*cover/,
    'la miniatura recorta a una altura fija; el detalle se ve en el lightbox',
  );
  assert.doesNotMatch(
    codigo,
    /grid-template-columns:[^;]*1fr/,
    'prohibido 1fr en la rejilla de evidencias',
  );
  assert.doesNotMatch(
    codigo,
    /figuras\.length > 1 \? 'rejilla'/,
    'la rejilla aplica también con una sola evidencia',
  );
});

test('tk-view fusiona image consecutivos en image-group (fuente)', async () => {
  const codigo = await readFile(join(raiz, 'src', 'components', 'tk', 'tk-view.ts'), 'utf8');

  assert.match(
    codigo,
    /fusionarImagenes/,
    'sin fusionarImagenes cada image se pinta a ancho completo apilado',
  );
  assert.match(
    codigo,
    /kind:\s*['"]image-group['"]/,
    'la corrida de evidencias debe emitir kind image-group',
  );
  assert.match(
    codigo,
    /fusionarImagenes\s*\(/,
    'fusionarImagenes debe usarse al montar los bloques del ticket',
  );
});
