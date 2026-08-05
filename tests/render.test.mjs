/**
 * render.test.mjs — humo del visor sin navegador.
 *
 * Carga los módulos ya compilados (`dist/cdn/*.js`, generados por
 * `npm run build`) como ES modules nativos sobre un `document` de jsdom, y
 * comprueba que un ticket real (fixture tomado del worker) produce el
 * documento esperado. Cubre lo que un typecheck no ve: registro de custom
 * elements, plantillas `html` y despacho por `kind`.
 *
 *   npm run build && node --test tests/
 */
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const cdn = (nombre) => pathToFileURL(join(raiz, 'dist/cdn', `${nombre}.js`)).href;

/** `tk-view` crea estos tags con `document.createElement`, no con `import`: hay que registrarlos todos. */
const FUENTES = [
  'tk-markdown', 'tk-html', 'tk-badges', 'tk-table', 'tk-image', 'tk-code',
  'tk-url', 'tk-cambio-bd', 'tk-steps', 'tk-file-tree', 'tk-timeline',
  'tk-sequence', 'tk-stepper', 'tk-chart', 'tk-diagram', 'tk-block',
  'tk-commits', 'tk-tiempos', 'tk-metrics',
  'tk-ticket-head', 'tk-view',
];

/** Un único `document` compartido: los custom elements no se desregistran entre tests. */
before(async () => {
  const dom = new JSDOM('<!doctype html><html data-theme="dark"><body></body></html>', {
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });

  // jsdom aún no trae hojas constructables; el CSS no afecta a estas aserciones.
  dom.window.CSSStyleSheet = class {
    replaceSync() {}
  };
  Object.defineProperty(dom.window.ShadowRoot.prototype, 'adoptedStyleSheets', {
    configurable: true,
    get() { return this._hojas ?? []; },
    set(v) { this._hojas = v; },
  });

  // Los módulos compilados asumen un entorno de navegador (HTMLElement, document,
  // customElements…) como globals implícitos, igual que en index.html.
  for (const clave of Object.getOwnPropertyNames(dom.window)) {
    // `window`/`document`/`globalThis` ya existen como getters de solo lectura en Node.
    if (clave === 'window' || clave === 'document' || clave === 'globalThis') continue;
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, clave);
    if (descriptor && !descriptor.configurable) continue;
    try { globalThis[clave] = dom.window[clave]; } catch { /* propiedades no configurables del host */ }
  }
  Object.defineProperty(globalThis, 'document', { value: dom.window.document, configurable: true });

  for (const nombre of FUENTES) await import(cdn(nombre));

  globalThis.__dom__ = dom;
});

/** Documento con el visor cargado: un `<body>` limpio por test. */
function montar() {
  const dom = globalThis.__dom__;
  dom.window.document.body.innerHTML = '';
  return dom;
}

const TICKET = {
  iticket: 'TK-1447812',
  space: 'patyia',
  titulo: 'Cierre de conversación antes de tiempo',
  estado: 'cerrado',
  solicitante: 'Asesora Viviana Restrepo Quintero',
  resumen: 'Criterio correcto: **4 h** sin actividad (`FHULTACT`).',
  fechasolicitud: '2026-07-09T13:13:00.000Z',
  fechaentrega: '2026-07-09T21:00:00.000Z',
  tiempoTotalMinutos: 215,
  content: [
    { kind: 'markdown', sortkey: 0, payload: { title: 'Solicitud y objetivo', docLane: 'solicitud', text: '## Objetivo\n\nRecovery respeta `FHULTACT`.' } },
    { kind: 'badge', sortkey: 1, payload: { tone: 'success', label: 'Solucionado', docLane: 'solicitud' } },
    { kind: 'table', sortkey: 2, payload: { title: 'Información del tiquete', docLane: 'evidencias', headers: ['Campo', 'Valor'], rows: [['Código TK', '1447812'], ['Estado', 'Cerrado']] } },
    { kind: 'code', sortkey: 3, payload: { language: 'sql', code: "SELECT * FROM TK_TICKET WHERE ITICKET = 'TK-1447812';", docLane: 'solucion' } },
    { kind: 'file-tree', sortkey: 4, payload: { docLane: 'solucion', rootLabel: 'ISS-AyudasCPIA', paths: ['src/functions/TIMER-CerrarConversaciones.ts'], hints: { 'TIMER-CerrarConversaciones.ts': 'Recovery respeta inactividad.' } } },
    { kind: 'inexistente', sortkey: 5, payload: { text: 'algo' } },
    { kind: 'markdown', sortkey: 6, payload: { text: '   ' } },
  ],
};

test('el visor pinta cabecera, secciones y bloques del ticket', () => {
  const { window } = montar();
  const vista = window.document.createElement('tk-view');
  vista.ticket = TICKET;
  window.document.body.append(vista);

  const raiz = vista.shadowRoot;
  assert.ok(raiz, 'tk-view debe tener shadow root');

  const cabecera = raiz.querySelector('tk-ticket-head');
  assert.ok(cabecera, 'falta la cabecera del ticket');
  assert.match(cabecera.shadowRoot.querySelector('h1').textContent, /Cierre de conversación/);
  assert.match(cabecera.shadowRoot.textContent, /TK-1447812/);

  const secciones = [...raiz.querySelectorAll('section')].map((s) => s.getAttribute('aria-label'));
  assert.deepEqual(secciones, ['Solicitud', 'Evidencias', 'Solución', 'Detalle']);

  const fab = raiz.querySelector('.fab-btn');
  assert.ok(fab, 'debe existir el botón flotante doc/metrics');
  assert.equal(fab.getAttribute('aria-pressed'), 'false');
  fab.click();
  assert.equal(vista.modo, 'metrics');
  assert.ok(raiz.querySelector('tk-metrics'), 'modo metrics monta <tk-metrics>');
  assert.equal(raiz.querySelector('.fab-btn')?.getAttribute('aria-pressed'), 'true');
});

test('cada kind llega a su componente y los vacíos se ocultan', () => {
  const { window } = montar();
  const vista = window.document.createElement('tk-view');
  vista.ticket = TICKET;
  window.document.body.append(vista);

  const bloques = [...vista.shadowRoot.querySelectorAll('tk-block')];
  const pintados = bloques.map((b) => b.shadowRoot.firstElementChild?.tagName.toLowerCase());

  assert.deepEqual(pintados, [
    'tk-markdown', 'tk-badges', 'tk-table', 'tk-code', 'tk-file-tree', 'is-callout', undefined,
  ]);

  // El markdown en blanco no aporta nada al documento: se oculta, no se pinta vacío.
  assert.ok(bloques.at(-1).hasAttribute('oculto'));
  // Un kind desconocido se denuncia en vez de desaparecer en silencio.
  assert.match(bloques[5].shadowRoot.textContent, /sin representación/);
});

test('markdown, tabla y código producen su marca esperada', () => {
  const { window } = montar();
  const vista = window.document.createElement('tk-view');
  vista.ticket = TICKET;
  window.document.body.append(vista);

  const bloques = [...vista.shadowRoot.querySelectorAll('tk-block')];
  const md = bloques[0].shadowRoot.querySelector('tk-markdown').shadowRoot;
  // `##` del payload baja dos niveles: el h1/h2 del documento los pone el visor.
  assert.match(md.innerHTML, /<h4>Objetivo<\/h4>/);
  assert.match(md.innerHTML, /<code>FHULTACT<\/code>/);

  // Dos columnas en todas las filas = ficha Campo/Valor, no rejilla de datos.
  const tabla = bloques[2].shadowRoot.querySelector('tk-table').shadowRoot;
  assert.ok(tabla.querySelector('dl.ficha'), 'la ficha debe usar lista de definición');
  assert.equal(tabla.querySelectorAll('dl.ficha dt').length, 2);

  const codigo = bloques[3].shadowRoot.querySelector('tk-code').shadowRoot;
  assert.match(codigo.innerHTML, /class="key">SELECT</);
  assert.ok(codigo.querySelector('is-copy-button'), 'el código debe reusar is-copy-button');
});

test('matriz de datos: is-data-grid sin búsqueda ni tools de toolbar', () => {
  const { window } = montar();
  const tabla = window.document.createElement('tk-table');
  tabla.payload = {
    title: 'Matriz de pruebas realizadas',
    headers: ['Caso', 'Resultado', 'Notas'],
    rows: [
      ['Login', 'OK', 'JWT lab'],
      ['PATCH doc', 'OK', 'docLane'],
    ],
  };
  window.document.body.append(tabla);

  const grid = tabla.shadowRoot.querySelector('is-data-grid');
  assert.ok(grid, 'filas con >2 columnas deben montar is-data-grid');
  assert.equal(grid.getAttribute('toolbar-tools'), 'false', 'toolbar-tools=false obligatorio');
  assert.equal(grid.hasAttribute('quick-filter'), false, 'sin quick-filter en documento');
  assert.equal(grid.hasAttribute('show-toolbar'), false, 'sin show-toolbar en documento');
});

test('el escape del markdown neutraliza HTML incrustado', () => {
  const { window } = montar();
  const bloque = window.document.createElement('tk-markdown');
  bloque.payload = { text: 'Ojo <img src=x onerror="alert(1)"> fin' };
  window.document.body.append(bloque);

  const html = bloque.shadowRoot.innerHTML;
  assert.ok(!html.includes('<img'), 'el HTML del payload no debe ejecutarse');
  assert.match(html, /&lt;img/);
});

test('tk-html sanea scripts y atributos de evento', () => {
  const { window } = montar();
  const bloque = window.document.createElement('tk-html');
  bloque.payload = { html: '<p onclick="alert(1)">hola</p><script>alert(2)<\/script><a href="javascript:alert(3)">x</a>' };
  window.document.body.append(bloque);

  const html = bloque.shadowRoot.innerHTML;
  assert.ok(!html.includes('<script'), 'los <script> deben eliminarse');
  assert.ok(!html.includes('onclick'), 'los atributos on* deben eliminarse');
  assert.ok(!html.includes('javascript:'), 'las URL javascript: deben eliminarse');
  assert.match(html, /hola/);
});
