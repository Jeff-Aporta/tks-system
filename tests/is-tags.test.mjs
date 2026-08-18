/**
 * is-tags.test.mjs — `IS_TAGS` ↔ los `is-*` que el código usa de verdad.
 *
 * El HTML descargable ya no carga el `all.min.js` del kit (211 módulos, 2,1 MB):
 * le pide al loader solo los tags de `js/is-tags.ts`. Esa lista es a mano, así
 * que se desincroniza sola: alguien agrega un `<is-avatar>` a un bloque, en el
 * visor funciona (ahí sí se carga todo el kit) y el documento descargado sale
 * con un hueco donde debía ir el componente — sin error en consola, porque un
 * custom element no definido es un `<div>` vacío.
 *
 *   npm run test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const dirTk = join(raiz, 'src', 'components', 'tk');
const { IS_TAGS, IS_TAGS_CUBIERTOS } = await import(
  pathToFileURL(join(raiz, 'dist', 'cdn', 'is-tags.js')).href
);

/** Tags `<is-…>` que aparecen en el markup de los componentes `tk-*`. */
function tagsUsados() {
  const hallados = new Set();
  for (const f of readdirSync(dirTk).filter((n) => n.endsWith('.ts'))) {
    const src = readFileSync(join(dirTk, f), 'utf8');
    // `<is-foo …>` en las plantillas y `createElement('is-foo')` en el TS.
    for (const m of src.matchAll(/<(is-[a-z0-9-]+)[\s>/]/g)) hallados.add(m[1]);
    for (const m of src.matchAll(/createElement\(['"](is-[a-z0-9-]+)['"]/g)) hallados.add(m[1]);
  }
  return hallados;
}

test('IS_TAGS cubre todos los <is-*> que usan los componentes tk-*', () => {
  const declarados = new Set([...IS_TAGS, ...IS_TAGS_CUBIERTOS]);
  const faltan = [...tagsUsados()].filter((t) => !declarados.has(t)).sort();
  assert.deepStrictEqual(faltan, [], 'agrégalos a src/js/is-tags.ts (o a IS_TAGS_CUBIERTOS si otro módulo ya los define)');
});

test('IS_TAGS no lista componentes que ya nadie usa', () => {
  // `is-theme-toggle` va en la barra del HTML exportado, no en los `tk-*`.
  const enPlantilla = new Set(['is-theme-toggle']);
  const usados = tagsUsados();
  const sobran = IS_TAGS.filter((t) => !usados.has(t) && !enPlantilla.has(t));
  assert.deepStrictEqual(sobran, [], 'quítalos de src/js/is-tags.ts: cada uno es peso que el documento baja de más');
});

test('el HTML exportado no carga el all.min.js del kit', () => {
  const exportTs = readFileSync(join(raiz, 'src', 'js', 'export.ts'), 'utf8');
  assert.ok(
    !/\$\{IS_CDN\}\/all\.min\.js/.test(exportTs),
    'volvió el bundle completo del kit: son 2,1 MB por documento',
  );
  assert.match(exportTs, /loader\.min\.js/, 'falta el loader del kit');
  assert.match(exportTs, /IS_TAGS/, 'falta la lista de tags');
});

test('la ficha ya no lleva pie de firma', () => {
  const view = readFileSync(join(dirTk, 'tk-view.ts'), 'utf8');
  assert.ok(!/documentación generada desde/.test(view), 'volvió el footer de la ficha');
  assert.ok(!/class="firma"/.test(view), 'quedó el markup del footer');
});
