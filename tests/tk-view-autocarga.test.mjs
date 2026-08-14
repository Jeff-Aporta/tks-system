/**
 * Contrato de autocarga de <tk-view>: la página que lo embebe declara `tk` y el
 * componente resuelve solo (caché → worker → `fallback`), sin JavaScript propio.
 *
 * Se aísla del resto de la suite porque necesita interceptar `fetch` y arrancar
 * su propio jsdom con una URL http (una ficha real nunca vive en `about:blank`).
 */
import test, { before, after } from 'node:test';
import assert from 'node:assert';
import { setTimeout as esperar } from 'node:timers/promises';
import { JSDOM } from 'jsdom';

const cdn = (n) => new URL(`../dist/cdn/${n}.js`, import.meta.url).href;

const TICKET = {
  iticket: 'TK-1426669',
  space: 'clientesis',
  titulo: 'Forma del campo en seguridad del curso',
  solicitante: 'Ingeniero Camilo Rámirez',
  resumen: 'Reportado por Viviana Restrepo con evidencia en https://cdn.example.com/jagudeloe-tks/a.png',
  content: [{ kind: 'markdown', sortkey: 0, payload: { docLane: 'solicitud', title: 'Solicitud', text: 'Detalle.' } }],
};

let dom;
const llamadas = [];

before(async () => {
  dom = new JSDOM('<!doctype html><html data-theme="dark"><body></body></html>', {
    url: 'https://ejemplo.test/docs/TK-1426669-ficha.html',
    pretendToBeVisual: true,
  });
  dom.window.CSSStyleSheet = class { replaceSync() {} };
  Object.defineProperty(dom.window.ShadowRoot.prototype, 'adoptedStyleSheets', {
    configurable: true,
    get() { return this._hojas ?? []; },
    set(v) { this._hojas = v; },
  });
  // Los timers de jsdom delegan en el global; si se vuelcan encima del global
  // acaban llamándose a sí mismos y desbordan la pila en la primera espera.
  // `Response`/`fetch` se dejan también en la versión de Node (jsdom no trae).
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

  // IndexedDB no existe en jsdom: la caché se degrada sola (está en try/catch),
  // así que cada lectura sale a red. Es justo lo que interesa comprobar aquí.
  globalThis.fetch = async (url) => {
    const u = String(url);
    llamadas.push(u);
    if (u.includes('jeffaporta.workers.dev')) {
      return new Response(JSON.stringify({ ok: true, ticket: TICKET }), {
        status: 200, headers: { 'content-type': 'application/json' },
      });
    }
    if (u.endsWith('-tk.json')) {
      return new Response(JSON.stringify(TICKET), {
        status: 200, headers: { 'content-type': 'application/json' },
      });
    }
    return new Response('no', { status: 404 });
  };

  await import(cdn('tk.all'));
});

after(() => { dom?.window?.close?.(); });

/** Monta el elemento y espera al evento de resolución. */
async function montar(atributos) {
  dom.window.document.body.innerHTML = '';
  const el = dom.window.document.createElement('tk-view');
  for (const [k, v] of Object.entries(atributos)) el.setAttribute(k, v);
  // Timers de Node, no los de jsdom: el harness vuelca `window` sobre
  // `globalThis`, y el `setTimeout` de jsdom reenvía al global — que para
  // entonces es él mismo. Llamarlo aquí desborda la pila.
  const resuelto = new Promise((ok, fail) => {
    el.addEventListener('tk-datos', (e) => ok(e.detail));
    el.addEventListener('tk-error', (e) => fail(new Error(e.detail.error)));
    esperar(5000).then(() => fail(new Error('sin respuesta en 5 s')));
  });
  dom.window.document.body.append(el);
  return { el, detalle: await resuelto };
}

test('con `tk` declarado, el componente pide el tiquete al worker solo', async () => {
  llamadas.length = 0;
  const { el, detalle } = await montar({ tk: 'TK-1426669', space: 'clientesis', embebido: '' });
  assert.strictEqual(detalle.origen, 'red', 'sin caché disponible debe salir a red');
  assert.ok(
    llamadas.some((u) => u.includes('/api/tk/clientesis/tickets/TK-1426669')),
    `esperaba la ruta del worker, hubo: ${llamadas.join(', ')}`,
  );
  // El título vive en `tk-ticket-head`, que tiene su propio shadow root: el
  // texto del padre no lo incluye. Se comprueba el dato y el montaje.
  assert.strictEqual(el.ticket.titulo, TICKET.titulo);
  assert.ok(el.shadowRoot.querySelector('tk-ticket-head'), 'falta la cabecera del tiquete');
  assert.match(el.shadowRoot.textContent, /Solicitud/);
});

test('`sanear` aplica R51 sin romper las URLs', async () => {
  const { el } = await montar({ tk: 'TK-1426669', space: 'clientesis', sanear: '' });
  // Sobre el ticket, no sobre el textContent: los bloques anidan shadow roots y
  // el texto del padre no los incluye — daría un verde falso.
  const plano = JSON.stringify(el.ticket);
  assert.ok(!/Viviana|Restrepo|Camilo/.test(plano), `quedó un nombre propio: ${plano.slice(0, 200)}`);
  assert.match(el.ticket.resumen, /https:\/\/cdn\.example\.com\/jagudeloe-tks\/a\.png/);
});

test('sin `sanear` el dato llega tal cual del worker', async () => {
  const { el } = await montar({ tk: 'TK-1426669', space: 'clientesis' });
  assert.match(el.ticket.solicitante, /Camilo/);
});

test('si el worker falla, cae al `fallback` local', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async (url) => {
    const u = String(url);
    if (u.includes('jeffaporta.workers.dev')) throw new Error('red caída');
    return original(url);
  };
  try {
    const { detalle } = await montar({
      tk: 'TK-1426669', space: 'clientesis', fallback: './TK-1426669-tk.json',
    });
    assert.strictEqual(detalle.origen, 'archivo local');
  } finally {
    globalThis.fetch = original;
  }
});

test('sin worker ni fallback, avisa en vez de quedarse en blanco', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error('red caída'); };
  try {
    await assert.rejects(montar({ tk: 'TK-1426669', space: 'clientesis' }));
    const el = dom.window.document.querySelector('tk-view');
    assert.match(el.shadowRoot.textContent, /No se pudo obtener/);
  } finally {
    globalThis.fetch = original;
  }
});
