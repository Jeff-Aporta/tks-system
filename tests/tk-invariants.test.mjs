/**
 * tk-invariants.test.mjs — detecta regresiones de producto leyendo fuente.
 *
 * Motivo: errores que no fallan en runtime silencioso (toolbar del grid,
 * metrics fuera del barril/index, pestaña ISP a medias, hints como texto).
 * El LLM.md lista el anti-patrón; este test lo hace imposible de
 * reintroducir sin rojo.
 *
 *   npm run test
 *
 * Convención: `*.test.mjs` + node:test (no `*.test.ts`). `tests/` se versiona.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = (...p) => join(raiz, 'src', ...p);

/** Tags que tk-view monta con createElement — deben existir en index.html. */
const CE_SHELL_CREATE = [
  'tk-ticket-head',
  'tk-block',
  'tk-commits',
  'tk-metrics',
];

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

test('index.html carga tk-metrics.js (modo metrics del shell)', async () => {
  const html = await readFile(join(raiz, 'index.html'), 'utf8');
  assert.match(
    html,
    /src=["']\.\/dist\/cdn\/tk-metrics\.js["']/,
    'sin este script el FAB de métricas monta un CE sin upgrade (vista vacía)',
  );
});

test('tk-view importa tk-metrics (createElement no registra el tag)', async () => {
  const codigo = await readFile(src('components', 'tk', 'tk-view.ts'), 'utf8');
  assert.match(
    codigo,
    /import\s+['"]\.\/tk-metrics\.js['"]/,
    'tk-view debe importar tk-metrics para registrar el CE al cargar el módulo',
  );
});

test('index.html carga todos los CE que tk-view crea con createElement', async () => {
  const html = await readFile(join(raiz, 'index.html'), 'utf8');
  const view = await readFile(src('components', 'tk', 'tk-view.ts'), 'utf8');

  for (const tag of CE_SHELL_CREATE) {
    assert.match(
      view,
      new RegExp(`createElement\\(\\s*['"]${tag}['"]\\s*\\)`),
      `tk-view debe crear <${tag}> (lista CE_SHELL_CREATE desfasada?)`,
    );
    assert.match(
      html,
      new RegExp(`src=["']\\.\\/dist\\/cdn\\/${tag}\\.js["']`),
      `index.html debe cargar ${tag}.js — createElement sin módulo = UI vacía`,
    );
  }
});

test('tk-view importa sus dependencias createElement (redundancia segura)', async () => {
  const codigo = await readFile(src('components', 'tk', 'tk-view.ts'), 'utf8');
  for (const tag of CE_SHELL_CREATE) {
    assert.match(
      codigo,
      new RegExp(`import\\s+['"]\\.\\/${tag}\\.js['"]`),
      `tk-view debe import './${tag}.js' para registrar el CE`,
    );
  }
});

test('tk-file-tree: hints solo vía is-tooltip', async () => {
  const codigo = await readFile(src('components', 'tk', 'tk-file-tree.ts'), 'utf8');
  assert.match(codigo, /<is-tooltip\b/, 'las pistas deben usar <is-tooltip>');
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

test('cadena ISP Svelte: tipo + api + tab + nav', async () => {
  const tipos = await readFile(src('types', 'tk.d.ts'), 'utf8');
  const api = await readFile(src('js', 'api.ts'), 'utf8');
  const app = await readFile(src('components', 'app', 'tk-app.ts'), 'utf8');
  const nav = await readFile(src('components', 'app', 'tk-nav.ts'), 'utf8');

  assert.match(
    tipos,
    /TkSpace\s*=\s*[^;]*'isp-svelte'/,
    'TkSpace debe incluir isp-svelte (space virtual)',
  );
  assert.match(
    api,
    /SPACES[\s\S]*isp-svelte/,
    'api.SPACES debe listar isp-svelte para listarTodos',
  );
  assert.match(
    app,
    /panel=["']isp-svelte["']/,
    'tk-app header debe tener tab ISP Svelte',
  );
  assert.match(
    app,
    /name=["']isp-svelte["']/,
    'tk-app debe tener is-tab-panel isp-svelte',
  );
  assert.match(
    nav,
    /isp-svelte/,
    'tk-nav debe aceptar contexto isp-svelte',
  );
  assert.match(
    nav,
    /esIspSvelte|TK-ISP-/,
    'filtro ISP no puede ser solo space===isp-svelte (heurística obligatoria)',
  );
});

test('LLM.md documenta createElement / ISP / métricas vacías', async () => {
  const demo = await readFile(src('components', 'demo', 'LLM.md'), 'utf8');
  const root = await readFile(join(raiz, 'LLM.md'), 'utf8');

  for (const doc of [demo, root]) {
    assert.match(doc, /createElement|upgrade|tk-metrics\.js/i, 'debe advertir CE sin upgrade');
    assert.match(doc, /isp-svelte|ISP Svelte/i, 'debe documentar space ISP');
  }
  assert.match(demo, /vista.*vac[ií]a|FAB.*m[eé]tricas/i, 'error real FAB vacío en tabla');
});
