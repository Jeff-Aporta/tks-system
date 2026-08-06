/**
 * video-layout.test.mjs — el video del ticket no se come el documento.
 *
 * ago/2026: `--tk-video-max: 100%` hacía el embed a viewport completo; además
 * centrarlo rompía el ritmo del documento. Contrato: tope 36rem, alineado
 * a la izquierda, lite-youtube (sin iframe YouTube al cargar).
 *
 *   npm run test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = (...p) => join(raiz, 'src', 'components', 'tk', ...p);

test('tk-view fija --tk-video-max a 36rem (no 100%)', async () => {
  const codigo = await readFile(src('tk-view.ts'), 'utf8');

  assert.match(
    codigo,
    /--tk-video-max:\s*36rem/,
    'sin tope fijo el video ocupa todo el ancho del documento',
  );
  assert.doesNotMatch(
    codigo,
    /--tk-video-max:\s*100%/,
    'prohibido --tk-video-max: 100% (regresión ago/2026)',
  );
});

test('tk-video respeta el tope y alinea a la izquierda', async () => {
  const codigo = await readFile(src('tk-video.ts'), 'utf8');

  assert.match(
    codigo,
    /max-width:\s*min\(100%,\s*var\(--tk-video-max,\s*36rem\)\)/,
    'el embed debe acotarse con --tk-video-max (default 36rem)',
  );
  assert.match(
    codigo,
    /margin-inline:\s*0/,
    'el video se alinea al flujo del documento, no se centra como hero',
  );
  assert.doesNotMatch(
    codigo,
    /margin-inline:\s*auto/,
    'prohibido centrar el video con margin-inline: auto',
  );
});

test('tk-video usa lite-youtube (no iframe YouTube al cargar)', async () => {
  const codigo = await readFile(src('tk-video.ts'), 'utf8');

  assert.match(
    codigo,
    /lite-youtube/,
    'lite-youtube-embed: iframe real solo tras el click (evita “loop” pesado)',
  );
  assert.doesNotMatch(
    codigo,
    /youtube-nocookie\.com\/embed\//,
    'prohibido iframe YouTube autocargado en el template',
  );
});
