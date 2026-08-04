/**
 * demo.test.mjs — invariantes de `src/components/demo/`.
 *
 * Cubre los errores que nos costaron una hora cada uno y que un typecheck /
 * build no detectan: paths relativos, manifest ↔ preview, encoding UTF-8,
 * CDN pinneada, previews que cargan el bundle correcto.
 *
 *   npm run test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const demo = join(raiz, 'src', 'components', 'demo');
const previews = join(demo, 'previews');
const manifestUrl = pathToFileURL(join(demo, 'manifest.js')).href;
const { default: manifest } = await import(manifestUrl);
const shellHtml = readFileSync(join(demo, 'index.html'), 'utf8');

/** Lector UTF-8 con rechazo de BOM. La ausencia de BOM es invariante. */
function readUtf8SinBom(ruta) {
  const buf = readFileSync(ruta);
  if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    throw new Error(`BOM no permitido en ${ruta}`);
  }
  return buf.toString('utf8').replace(/^﻿/, '');
}

test('el manifest tiene la forma esperada (string[] de {tag…})', () => {
  assert.ok(Array.isArray(manifest), 'manifest.js debe exportar un array');
  assert.ok(manifest.length > 0, 'manifest vacío');
  for (const entry of manifest) {
    assert.equal(typeof entry.tag, 'string', `tag no es string: ${JSON.stringify(entry)}`);
    // `home` es la única excepción al patrón `tk-*`: es la portada, no un
    // componente del kit. El shell la añade aparte con `HOME = { tag: 'home' }`.
    if (entry.tag !== 'home') {
      assert.match(entry.tag, /^tk-[a-z][a-z0-9-]*$/, `tag mal formado: ${entry.tag}`);
    }
    assert.equal(typeof entry.title, 'string', `${entry.tag} sin title`);
    assert.equal(typeof entry.category, 'string', `${entry.tag} sin category`);
    assert.equal(typeof entry.page, 'string', `${entry.tag} sin page`);
    assert.equal(typeof entry.script, 'string', `${entry.tag} sin script`);
  }
});

test('cada page del manifest apunta a un preview que existe en disco', () => {
  for (const entry of manifest) {
    const ruta = join(previews, entry.page);
    assert.ok(existsSync(ruta), `preview inexistente: ${entry.tag} → ${entry.page}`);
  }
});

test('cada preview existe en una sola categoría y reference coincide', () => {
  const vistos = new Map();
  for (const entry of manifest) {
    assert.ok(!vistos.has(entry.page), `page duplicada: ${entry.page}`);
    vistos.set(entry.page, entry.tag);
  }
});

test('cada preview declara el <tk-*> esperado en su HTML', () => {
  for (const entry of manifest) {
    if (entry.tag === 'home') continue; // home no es un <tk-*>
    const html = readUtf8SinBom(join(previews, entry.page));
    const tag = entry.tag;
    const re = new RegExp(`<${tag}(\\s|>)`, 'i');
    assert.ok(re.test(html), `${entry.page} no contiene <${tag}>`);
  }
});

test('cada preview carga tk.all.js con el path relativo correcto', () => {
  // 4 niveles: previews/ → demo/ → components/ → src/ → root
  const esperado = '../../../../dist/cdn/tk.all.js';
  for (const entry of manifest) {
    const html = readUtf8SinBom(join(previews, entry.page));
    assert.ok(
      html.includes(`src="${esperado}"`),
      `${entry.page} no carga ${esperado}`,
    );
    // Y NO usa la versión mala con 3 niveles (path legacy bug).
    assert.ok(
      !html.includes(`src="../../../dist/cdn/tk.all.js"`),
      `${entry.page} tiene path mal calculado (legado)`,
    );
  }
});

test('cada preview carga el kit is-* por CDN con commit pinneado', () => {
  // La regla es: commit hex fijo, NUNCA @latest.
  const reCdn = /https:\/\/cdn\.jsdelivr\.net\/gh\/Jeff-Aporta\/is-webcomponents@([a-f0-9]{7,})/;
  for (const entry of manifest) {
    const html = readUtf8SinBom(join(previews, entry.page));
    const m = reCdn.exec(html);
    assert.ok(m, `${entry.page} no carga el kit is-* desde jsDelivr`);
    assert.ok(html.includes('dist/cdn/all.min.js'), `${entry.page} no apunta a all.min.js`);
  }
  // El shell también debe usar el mismo commit (consistencia visual).
  const m = reCdn.exec(shellHtml);
  assert.ok(m, 'shell no carga is-* por CDN');
});

test('la rama "tag duplicada en dos previews" no existe', () => {
  const tags = manifest.map((e) => e.tag);
  assert.equal(new Set(tags).size, tags.length, 'hay tags repetidos en el manifest');
});

test('los previews están en UTF-8 sin BOM y sin mojibake típico', () => {
  // Mojibake por doble encoding: `á` (0xC3 0xA1) leído como Latin-1 →
  // `Ã¡` (0xC3 0xA1 visible, 0xC2 0xA1 origen). Si aparece `Ã` seguido de
  // [áéíóúñ¡¿], el archivo está corrupto.
  const patronMojibake = /Ã[áéíóúñ¡¿]/;
  for (const archivo of readdirSync(previews)) {
    if (!archivo.endsWith('.html')) continue;
    const ruta = join(previews, archivo);
    const html = readUtf8SinBom(ruta);
    assert.ok(
      !patronMojibake.test(html),
      `${archivo} contiene mojibake (doble encoding UTF-8)`,
    );
    assert.ok(html.includes('<meta charset="UTF-8">'), `${archivo} sin meta charset`);
  }
});

test('el shell referencia el manifest y la barra', () => {
  assert.match(shellHtml, /import\s+components\s+from\s+['"]\.\/manifest\.js['"]/);
  assert.match(shellHtml, /<nav class="shell-nav"/);
  assert.match(shellHtml, /<iframe class="preview-frame"/);
  assert.match(shellHtml, /is-split-panel/);
  assert.match(shellHtml, /is-theme-toggle/);
});

test('los boot scripts existen y pueden parsearse', () => {
  for (const nombre of ['demo-boot.js', 'preview-boot.js', 'preview-chrome.js']) {
    const js = readUtf8SinBom(join(demo, nombre));
    // Detección barata: balanceo de llaves y paréntesis razonable.
    const abr = (js.match(/{/g) || []).length;
    const cie = (js.match(/}/g) || []).length;
    assert.equal(abr, cie, `${nombre} llaves desbalanceadas (${abr} vs ${cie})`);
    const pAbr = (js.match(/\(/g) || []).length;
    const pCie = (js.match(/\)/g) || []).length;
    assert.equal(pAbr, pCie, `${nombre} paréntesis desbalanceados`);
  }
});

test('demo-boot.js y preview-boot.js aplican tema sin flash', () => {
  // El script debe correr en <head> con `defer` desactivado: módulo
  // sincrónico, no `type="module"`. Si alguien lo cambia a `type="module"`,
  // el primer paint usará los defaults del html estático.
  for (const nombre of ['demo-boot.js', 'preview-boot.js']) {
    const js = readUtf8SinBom(join(demo, nombre));
    assert.ok(!/type\s*=\s*["']module["']/.test(js), `${nombre} no es type="module"`);
    // Y el html que lo invoca tampoco.
    if (nombre === 'demo-boot.js') {
      assert.match(shellHtml, /<script src="demo-boot\.js"><\/script>/);
    }
  }
});

test('preview-chrome.js expone el listener is-context', () => {
  const js = readUtf8SinBom(join(demo, 'preview-chrome.js'));
  assert.match(js, /'is-context'|"is-context"/);
  assert.match(js, /addEventListener\(['"]message['"]/);
});

test('no hay archivos muertos en previews (cada .html está en el manifest)', () => {
  const enManifest = new Set(manifest.map((e) => e.page));
  for (const archivo of readdirSync(previews)) {
    if (!archivo.endsWith('.html')) continue;
    assert.ok(
      enManifest.has(archivo),
      `preview huérfano: ${archivo} no aparece en el manifest`,
    );
  }
});

test('shell.css y preview.css existen y declaran variables --demo-*', () => {
  for (const archivo of ['shell.css', 'preview.css']) {
    const ruta = join(demo, 'styles', archivo);
    assert.ok(existsSync(ruta), `falta ${ruta}`);
    const css = readUtf8SinBom(ruta);
    assert.match(css, /--demo-[a-z-]+\s*:/, `${archivo} no usa variables --demo-*`);
  }
});

test('la build del demo no está en node_modules ni en dist', () => {
  // Trampa frecuente: alguien mete el demo dentro de dist/cdn y deja el
  // shell apuntando a un bundle. Mantener la separación src/components/demo
  // (todo estático, sin compilar) y dist/cdn (módulos tk-*).
  const demoEnDist = join(raiz, 'dist', 'demo');
  assert.ok(!existsSync(demoEnDist), 'demo/ no debe vivir en dist/');
});

test('home.html existe, no declara tk-* específico y carga el kit', () => {
  const home = readUtf8SinBom(join(previews, 'home.html'));
  // home es la portada; debe tener al menos un is-* (botón/link) pero
  // no es estrictamente un tk-* del catálogo.
  assert.match(home, /is-button|is-icon|tk-block/);
  assert.ok(home.includes('tk.all.js'));
});
