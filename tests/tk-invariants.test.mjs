/**
 * tk-invariants.test.mjs — detecta regresiones de producto leyendo fuente.
 *
 * Motivo: errores que no fallan en runtime silencioso (toolbar del grid
 * otra vez, metrics fuera del barril, hints como texto). El LLM.md lista
 * el anti-patrón; este test lo hace imposible de reintroducir sin rojo.
 *
 *   npm run test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = (...p) => join(raiz, 'src', ...p);

test('tk-table: documento sin chrome de toolbar (fuente)', async () => {
  const codigo = await readFile(src('components', 'tk', 'tk-table.ts'), 'utf8');

  assert.match(
    codigo,
    /setAttribute\(\s*['"]toolbar-tools['"]\s*,\s*['"]false['"]\s*\)/,
    'tk-table debe forzar toolbar-tools="false" en is-data-grid',
  );
  assert.doesNotMatch(
    codigo,
    /setAttribute\(\s*['"](?:show-toolbar|quick-filter)['"]/,
    'prohibido show-toolbar / quick-filter en tablas del documento',
  );
  assert.doesNotMatch(
    codigo,
    /\.(showToolbar|quickFilter)\s*=\s*true/,
    'prohibido activar showToolbar/quickFilter por propiedad',
  );
});

test('tk-metrics registrado en el barril all.ts', async () => {
  const all = await readFile(src('components', 'tk', 'all.ts'), 'utf8');
  assert.match(all, /tk-metrics/, 'all.ts debe importar tk-metrics (modo metrics del visor)');
});

test('tk-file-tree: hints solo vía is-tooltip', async () => {
  const codigo = await readFile(src('components', 'tk', 'tk-file-tree.ts'), 'utf8');
  assert.match(codigo, /<is-tooltip\b/, 'las pistas deben usar <is-tooltip>');
  // Evitar reintroducir texto de pista visible al lado del path (clase típica).
  assert.doesNotMatch(
    codigo,
    /class=["']hint["']/,
    'no pintar hints como texto inline (class="hint")',
  );
});

test('tk-view: modos doc | metrics documentados en fuente', async () => {
  const codigo = await readFile(src('components', 'tk', 'tk-view.ts'), 'utf8');
  assert.match(codigo, /['"]doc['"]\s*\|\s*['"]metrics['"]|TkVistaModo/, 'debe tipar modos doc|metrics');
  assert.match(codigo, /tk-metrics/, 'modo metrics monta tk-metrics');
  assert.match(codigo, /tk-modo|modo/, 'debe exponer modo / evento de cambio');
});
