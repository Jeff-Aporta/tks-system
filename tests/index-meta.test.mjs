/**
 * index-meta.test.mjs — SEO y marca del shell no se “olvidan”.
 *
 * ago/2026: el visor en Pages compartía sin favicon/OG/canonical. Contrato
 * en index.html + assets en src/assets/brand/.
 *
 *   npm run test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const CANONICAL = 'https://jeff-aporta.github.io/jagudeloe-tks-front/';

test('index.html trae title, description, canonical y marca', async () => {
  const html = await readFile(join(raiz, 'index.html'), 'utf8');

  assert.match(html, /<title>[^<]*Tiquetes jagudeloe/, 'title de marca');
  assert.match(
    html,
    /<meta\s+name=["']description["']\s+content=["'][^"']+["']/,
    'meta description obligatoria',
  );
  assert.match(
    html,
    new RegExp(`rel=["']canonical["']\\s+href=["']${CANONICAL.replace(/\./g, '\\.')}`),
    `canonical debe ser ${CANONICAL}`,
  );
  assert.match(
    html,
    /rel=["']icon["'][^>]+href=["']https:\/\/api\.iconify\.design\/[^"']+\.svg[^"']*["']/,
    'favicon vía Iconify API (sin favicon.svg local)',
  );
  assert.doesNotMatch(
    html,
    /favicon\.svg/,
    'prohibido favicon.svg local: usar api.iconify.design',
  );
  assert.match(
    html,
    /rel=["']apple-touch-icon["'][^>]+href=["']\.\/src\/assets\/brand\/apple-touch-icon\.png["']/,
    'apple-touch-icon',
  );
});

test('index.html trae Open Graph y Twitter Card', async () => {
  const html = await readFile(join(raiz, 'index.html'), 'utf8');

  for (const prop of [
    'og:type',
    'og:title',
    'og:description',
    'og:url',
    'og:image',
    'og:site_name',
  ]) {
    assert.match(
      html,
      new RegExp(`property=["']${prop}["']`),
      `falta meta ${prop}`,
    );
  }

  assert.match(
    html,
    new RegExp(`property=["']og:url["']\\s+content=["']${CANONICAL.replace(/\./g, '\\.')}`),
    'og:url = canonical Pages',
  );
  assert.match(
    html,
    /og:image["']\s+content=["']https:\/\/jeff-aporta\.github\.io\/jagudeloe-tks-front\/src\/assets\/brand\/og\.jpg["']/,
    'og:image apunta a brand/og.jpg en Pages',
  );
  assert.match(html, /name=["']twitter:card["']/, 'twitter:card');
  assert.match(html, /name=["']twitter:image["']/, 'twitter:image');
});

test('assets de marca existen en disco (sin favicon.svg local)', async () => {
  const brand = join(raiz, 'src', 'assets', 'brand');
  for (const nombre of ['icon-512.png', 'apple-touch-icon.png', 'og.jpg']) {
    await access(join(brand, nombre));
  }
  await assert.rejects(
    () => access(join(brand, 'favicon.svg')),
    /ENOENT/,
    'favicon.svg no debe existir: el icono va por Iconify API',
  );
});
