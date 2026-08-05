/**
 * export.test.mjs — el HTML descargable carga módulos por CDN absoluto.
 *
 * Ya no incrusta `data:` URIs ni import maps: esos fallan en `file://`.
 * El test valida estructura, pin CDN y saneado del JSON.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');

const TICKET = {
  iticket: 'TK-1439155',
  space: 'clientesis',
  titulo: 'Calificación de mensajes en el hilo',
  estado: 'cerrado',
  content: [
    { kind: 'markdown', sortkey: 0, payload: { docLane: 'solicitud', text: 'El asesor necesita **calificar** cada respuesta.' } },
    { kind: 'url', sortkey: 1, payload: { docLane: 'solucion', href: 'https://insoft.com.co', label: 'Portal' } },
  ],
};

/** Reproduce la plantilla de `js/export.ts` sin navegador. */
function generar(tk, pin = 'main') {
  const escapar = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const isCdn = 'https://cdn.jsdelivr.net/gh/Jeff-Aporta/is-webcomponents@main/dist/cdn';
  const tkCdn = `https://cdn.jsdelivr.net/gh/Jeff-Aporta/jagudeloe-tks-front@${pin}/dist/cdn`;
  const json = JSON.stringify(tk).replace(/<\/(script)/gi, '<\\/$1');
  const titulo = `${tk.iticket} · ${tk.titulo ?? 'Tiquete'}`;

  return `<!doctype html>
<html lang="es"><head>
<title>${escapar(titulo)}</title>
<link rel="stylesheet" href="${isCdn}/is-base.min.css">
<script type="module" src="${isCdn}/all.min.js"><\/script>
<script type="module" src="${tkCdn}/tk.all.js"><\/script>
</head><body>
<tk-view embebido></tk-view>
<script type="application/json" id="tk-datos">${json}<\/script>
<script type="module">
  const datos = JSON.parse(document.getElementById('tk-datos').textContent);
  const vista = document.querySelector('tk-view');
  customElements.whenDefined('tk-view').then(() => { vista.json = datos; });
<\/script>
</body></html>`;
}

test('el HTML carga tk.all.js por URL https absoluta (portable en file://)', () => {
  const html = generar(TICKET);
  assert.match(html, /src="https:\/\/cdn\.jsdelivr\.net\/gh\/Jeff-Aporta\/jagudeloe-tks-front@[^"]+\/dist\/cdn\/tk\.all\.js"/);
  assert.doesNotMatch(html, /importmap/);
  assert.doesNotMatch(html, /data:text\/javascript/);
  assert.doesNotMatch(html, /from ['"]\.\/_shared\.js['"]/);
});

test('el JSON del ticket queda saneado', () => {
  const conCierre = generar({ ...TICKET, titulo: 'Cierre </script> falso' });
  assert.ok(!/<\/script>[^<]*falso/.test(conCierre), 'un </script> en el dato no debe cerrar el <script> contenedor');
  assert.match(conCierre, /id="tk-datos"/);
  assert.match(conCierre, /whenDefined\('tk-view'\)/);
});

test('src/js/export.ts apunta al repo y al bundle tk.all.js', () => {
  const exportTs = readFileSync(join(raiz, 'src/js/export.ts'), 'utf8');
  assert.match(exportTs, /jagudeloe-tks-front/);
  assert.match(exportTs, /tk\.all\.js/);
  assert.match(exportTs, /TK_PIN/);
  assert.ok(readFileSync(join(raiz, 'dist/cdn/tk.all.js'), 'utf8').length > 1000, 'falta dist/cdn/tk.all.js (npm run build)');
});
