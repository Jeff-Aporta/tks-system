/**
 * build.mjs — compila `src/**\/*.ts` a JavaScript plano en `dist/cdn/`.
 *
 * Sin bundler: cada archivo se transpila por separado (esbuild solo le quita
 * los tipos y minifica) y se aplana a un único directorio, porque todos los
 * nombres de archivo del proyecto ya son únicos. Los `import` relativos se
 * reescriben para apuntar a ese directorio plano.
 *
 * El resultado es lo que carga `index.html` con `<script type="module">` y lo
 * que empaqueta `js/export.ts` en el HTML descargable — ninguno de los dos
 * necesita Babel en el navegador.
 */
import { readdirSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, basename } from 'node:path';
import esbuild from 'esbuild';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const SRC = join(ROOT, 'src');
const OUT = join(ROOT, 'dist', 'cdn');

const listarTs = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = join(dir, e.name);
  if (e.isDirectory()) return listarTs(p);
  return e.name.endsWith('.ts') ? [p] : [];
});

const BARRIL = join(SRC, 'components', 'tk', 'all.ts');

const archivos = [
  ...listarTs(join(SRC, 'components')),
  ...listarTs(join(SRC, 'js')),
].filter((a) => a !== BARRIL);

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

for (const archivo of archivos) {
  const resultado = await esbuild.build({
    entryPoints: [archivo],
    bundle: false,
    write: false,
    format: 'esm',
    target: 'es2022',
    minify: true,
    loader: { '.ts': 'ts' },
  });

  const nombre = basename(archivo, '.ts');
  let js = resultado.outputFiles[0].text;
  // Aplana cualquier ruta relativa ("./x.js", "../tk/x.js", "../../js/x.js")
  // al nombre suelto: en dist/cdn todos los módulos son hermanos.
  js = js.replace(/from"(\.[\w./-]+)"/g, (_m, ruta) => `from"./${basename(ruta).replace(/\.[jt]s$/, '')}.js"`);

  writeFileSync(join(OUT, `${nombre}.js`), js);
}

// `tk.all.js` — bundle único con todos los componentes `tk-*` (documento y
// bloques, sin el shell `tk-app`/`tk-nav`), para incrustarlo con un solo
// <script type="module"> en vez de listar cada archivo.
const bundle = await esbuild.build({
  entryPoints: [BARRIL],
  bundle: true,
  write: false,
  format: 'esm',
  target: 'es2022',
  minify: true,
  loader: { '.ts': 'ts' },
});
writeFileSync(join(OUT, 'tk.all.js'), bundle.outputFiles[0].text);

console.log(`dist/cdn: ${archivos.length} módulos + tk.all.js compilados.`);
