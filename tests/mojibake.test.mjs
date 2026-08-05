/**
 * mojibake.test.mjs — "c├│digo" no debe llegar al documento.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');

test('fixMojibake repara acentos CP850←UTF-8', async () => {
  const mod = await import(pathToFileURL(join(raiz, 'dist/cdn/fix-mojibake.js')).href);
  const { fixMojibake, fixMojibakeDeep } = mod;

  assert.equal(fixMojibake('Comparativa de volumen de c├│digo'), 'Comparativa de volumen de código');
  assert.equal(fixMojibake('capacitación'), 'capacitación'); // ya correcto
  assert.equal(fixMojibake('qu├®'), 'qué');
  assert.equal(fixMojibake('Despu├®s'), 'Después');
  assert.equal(fixMojibake('dise├▒o'), 'diseño');
  assert.equal(fixMojibake('expl├¡cito'), 'explícito');
  assert.equal(fixMojibake('din├ímicos'), 'dinámicos');
  assert.equal(fixMojibake('antes ÔÇö después'), 'antes — después');

  const deep = fixMojibakeDeep({
    title: 'c├│digo',
    nested: { html: '<b>soluci├│n</b>' },
    rows: ['patr├│n'],
  });
  assert.equal(deep.title, 'código');
  assert.equal(deep.nested.html, '<b>solución</b>');
  assert.deepEqual(deep.rows, ['patrón']);
});

test('api.ts aplica fixMojibakeDeep al consumir', async () => {
  const src = await readFile(join(raiz, 'src/js/api.ts'), 'utf8');
  assert.match(src, /fixMojibakeDeep/, 'api debe sanear respuestas/caché');
});
