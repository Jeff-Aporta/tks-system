// tests/full-mode.test.mjs — `?s=...` con `full:true` debe esconder header
// y panel izquierdo desde el primer render, no solo desde el segundo.
//
// Bug real (2026-08-06): TkApp.connectedCallback llamaba #render() antes de
// que #arrancar() (async) leyera el estado de la URL y recién ahí pusiera
// el atributo `full`. Sin attributeChangedCallback que reaccione, header y
// split panel ya estaban armados para cuando el atributo llegaba — el modo
// "vista" (para incrustar/compartir un solo tiquete) nunca escondía nada.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const SRC = readFileSync(
  join(import.meta.dirname, '..', 'src', 'components', 'app', 'tk-app.ts'),
  'utf8',
);

test('connectedCallback aplica el estado `full` de la URL antes de #render()', () => {
  const m = SRC.match(/connectedCallback\(\):\s*void\s*\{([\s\S]*?)\n  \}/);
  assert.ok(m, 'No se encontró connectedCallback en tk-app.ts');
  const cuerpo = m[1];

  const idxFull = cuerpo.search(/estado\.leer\(\)\.full/);
  const idxRender = cuerpo.search(/this\.#render\(\)/);

  assert.notEqual(idxFull, -1, 'connectedCallback debe leer estado.leer().full');
  assert.notEqual(idxRender, -1, 'connectedCallback debe llamar this.#render()');
  assert.ok(
    idxFull < idxRender,
    'estado.leer().full debe aplicarse ANTES de this.#render() — si no, header/panel ' +
      'ya quedaron armados para cuando el atributo `full` se pone (no hay ' +
      'attributeChangedCallback que reaccione y vuelva a renderizar)',
  );
});

test('#render() no construye header/split cuando this.full es true', () => {
  const src = readFileSync(
    join(import.meta.dirname, '..', 'src', 'components', 'app', 'tk-app.ts'),
    'utf8',
  );
  const m = src.match(/#render\(\):\s*void\s*\{([\s\S]*?)\n  \}\n\}/);
  assert.ok(m, 'No se encontró #render() en tk-app.ts');
  assert.match(
    m[1],
    /if\s*\(this\.full\)\s*\{[\s\S]*?return;/,
    '#render() debe cortar temprano (solo el visor, sin header/split) cuando this.full es true',
  );
});
