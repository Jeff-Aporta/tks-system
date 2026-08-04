# LLM.md — demo de tk-*

Guía operativa para la galería de web components `tk-*` en
`src/components/demo/`. Léela antes de tocar el demo: la mitad de las trampas
ya nos costó una hora cada una.

## Qué hay aquí

```
src/components/demo/
├── index.html             ← shell (brand menu, theme-toggle, split-panel, iframe)
├── manifest.js            ← { tag, title, category, page, script }[]
├── demo-boot.js           ← tema antes del primer paint (shell)
├── preview-boot.js        ← tema antes del primer paint (iframes)
├── preview-chrome.js      ← sync theme/palette vía postMessage `is-context`
├── styles/
│   ├── shell.css          ← layout del gallery
│   └── preview.css        ← layout de cada preview
└── previews/              ← una .html por entrada del manifest + home
```

Reuso del kit `is-*` por CDN (commit-pinned, mismo que el visor
`index.html`). **No se añade ningún componente nuevo al kit**: cada `tk-*` ya
delega en `is-button`, `is-tag`, `is-tree`, `is-timeline`, `is-chart`, etc.

## Convenciones que se respetan

1. **Protocolo `?s=`**: el shell codifica en base64url
   `{ component, theme, palette }`. Los iframes usan `?s={ embed, theme, palette }`.
   `theme`/`palette` **no** se reescriben en la URL al cambiar (son UI, no
   estado de navegación). Esto replica el contrato de AppWebcomponents.
2. **`embed: true` en previews**: el preview-chrome oculta su toolbar y delega
   el theme/palette al shell. Lo activa `preview-boot.js` desde `?s=`.
3. **Path a `tk.all.js`**: desde `previews/foo.html` es `../../../../dist/cdn/tk.all.js`
   (4 niveles). Si lo cambias, ejecuta `tests/demo.test.mjs` (verifica el patrón).
4. **Path a `is-*` CDN**: `https://cdn.jsdelivr.net/gh/Jeff-Aporta/is-webcomponents@<commit>/dist/cdn/all.min.js`.
   El commit va fijo en cada `<script>`/`<link>` — no usar `@latest`.
5. **Carga de `tk-*`**: un solo `<script type="module" src=".../tk.all.js">`
   registra todos los `tk-*`. Cada preview instancia el componente que le toca
   con un payload realista y le asigna `.payload` o `.ticket` o `.bloque`
   (ver contrato en `src/components/tk/_shared.ts`).
6. **Categorías del nav**: `shell` (documento: view/ticket-head/actions/),
   `blocks` (todos los demás), orden estable.
7. **Tema `contapyme` por default** en el shell (la demo es jagudeloe, no
   InSoft). Las otras paletas sólo cambian el header.

## Anti-patrones explícitos

- **No escribir HTML con `Set-Content` de PowerShell**
  corrompe UTF-8 (doble encoding, mojibake tipo `vía` → `vÃ­a`).
  Usar `Write` (la herramienta) o `.NET` directo:
  `[System.IO.File]::WriteAllText($path, $content, [System.Text.UTF8Encoding]::new($false))`.
  Si ves `Â·`, `â€"`, `Ã±` en el output, **es mojibake, no es un cambio del
  usuario**. Reconstruir el archivo desde el origen limpio.

- **No inventar un protocolo `?s=` propio**. El shell importa `manifest.js`
  y reusa el mismo `b64url(JSON.stringify(...))` que AppWebcomponents. Si
  cambias el formato, los iframes no sincronizan.

- **No añadir lógica de "docs completas" al demo**. La demo Imita la
  presentación de AppWebcomponents (TOC, scrollspy, syntax highlight con
  CodeMirror) NO aplica aquí: los `tk-*` son componentes de bloque, no
  páginas de documentación. Cada preview es una página simple con título +
  descripción + demo en vivo.

- **No exigir el kit `is-*` por nmp** dentro de los previews. La CDN ya
  carga todos los `is-*` por commit-pinned. Si te falta un control, primero
  busca en el kit (`is-button`, `is-tag`, `is-tree`, …) y solo entonces
  escribe CSS plano.

- **No usar `isChart` u otros nombres con mayúscula** — los nombres de
  custom elements siempre son kebab-case en minúscula (`is-chart`,
  `is-bar-chart`). `customElements.define('IsChart', …)` falla silencioso.

- **No tocar el `manifest.js` sin ejecutar el test**. La pareja
  `tag` ↔ `page` debe existir (el test la verifica). Borrar un `tk-*` del
  manifest sin borrar su preview deja un archivo muerto.

- **No escribir `tk-all.js` con guion**. El archivo real es `tk.all.js`
  (punto). Lo genera `scripts/build.mjs` desde `src/components/tk/all.ts`.

- **No usar `ManageBOM` UTF-8 sin BOM** desde `Set-Content` en PowerShell 5.1
  (a veces lo agrega). Si los `.html` sirven con BOM, los `<script>` son
  válidos pero el `Content-Type: text/html` puede no detectarlo.

## Errores reales que nos costó tiempo

| Síntoma | Causa | Fix |
|---|---|---|
| Iframe devuelve 404 para `tk.all.js` | Path relativo con 3 `../` en vez de 4 | Contar: `previews/` → `demo/` → `components/` → `src/` → root. Cuatro niveles. |
| `<tk-view>` no renderiza dentro de jsdom | jsdom no carga módulos con `data:` URI | Renderizar solo contra el HTML estático; validar estructura, no pintar. |
| `tk-all.js` no se encuentra en dist | Olvidaste `npm run build` | `build` antes de `dev` o `test`. |
| `manifest.js` exportar `export default` | El browser lo soporta, pero jsdom lo quiere como ES module en `import components from './manifest.js'` | Sí, `export default [...]` está bien. Pero verifica que el archivo se sirve con `Content-Type: application/javascript` (no `text/plain`). |
| Las tildes se ven rotas en el iframe | Mojibake por el linter / Set-Content | Reconstruir el archivo con UTF-8 sin BOM. |
| `tk-html` no carga como iframe | El type MIME no se detecta | No aplica — nuestros `.html` sirven OK. |
| `tk-tree` no expande al cargar | `is-tree-item` sin `expanded` cuando el padre no es hoja | Ver `tk-file-tree.ts` — la marca `expanded` se aplica desde el shell. |
| `tk-timeline` no muestra gráfica | Sólo se pinta cuando hay ≥ 2 `date` válidos | Payload de muestra con 4 ISO dates. |
| `tk-chart` no se ve | `<is-chart>` necesita el `<script type="application/json">` con la config; el componente la lee de su primer hijo. | `tk-chart.ts` lo inyecta con `jsonScript`. |
| Pestaña "Inicio" no navega | `HOME = { tag: 'home', page: 'home.html' }` debe estar en el catálogo, no en el `manifest.js` | La galería hace `catalog = [HOME, ...components]`. |
| `localStorage` `is-theme` no persiste en iframe | Firefox trata storage de iframes de otro origen como particionado | Ok, mismo origen. Si el iframe no es del mismo origen, el preview-boot.js cae al `<html data-theme>` por defecto. |

## Cómo añadir un componente nuevo

1. Crear `src/components/tk/tk-mi-bloque.ts` (ver patrón en `tk-badges.ts`,
   `tk-table.ts`). Registrarlo en `src/components/tk/all.ts`.
2. `npm run build` → confirma que `dist/cdn/tk-mi-bloque.js` y `tk.all.js`
   se regeneran.
3. Crear `src/components/demo/previews/tk-mi-bloque.html` con plantilla
   idéntica a `tk-markdown.html` (reemplaza `<tk-markdown>` por `<tk-mi-bloque>`).
4. Añadir entrada en `src/components/demo/manifest.js`:
   `{ tag: 'tk-mi-bloque', title: '…', category: 'blocks', page: 'tk-mi-bloque.html', script: '../tk/tk-mi-bloque.ts' }`.
5. `npm run test` — falla si el manifest no resuelve o si el preview no
   tiene el tag correspondiente.

## Cómo añadir un componente nuevo al kit (no al visor)

Si el `tk-*` necesita un `is-*` que no existe aún:
1. **Antes**: confirmar que no se resuelve con un `is-*` ya disponible
   (`is-tree`, `is-callout`, `is-stat`, `is-tag`, `is-chart`…).
2. **Si todo falla**: añadir el `is-*` en `AppWebcomponents/components/`
   (otro repo). Exponerlo en `dist/cdn/all.min.js`.
3. **Solo entonces**: bumpear el commit CDN en `index.html` del visor Y en
   todos los previews del demo.

## Tests automatizados

`npm run test` corre dos suites:

- `tests/render.test.mjs` — humo del visor: parsing, despacho por `kind`,
  saneado de HTML, escape de markdown, registro de custom elements.
- `tests/export.test.mjs` — el HTML descargable: import map completo,
  cada URI `data:` decodifica al `.js` compilado, JSON del ticket saneado.
- `tests/demo.test.mjs` (este PR) — invariantes del demo: paths
  relativos, manifest ↔ preview, encoding UTF-8, is-* cargado por CDN.

Si rompes uno de estos, **el CI te lo dice antes de llegar al browser**.

## Comando útiles

```bash
npm run build           # compila ts → dist/cdn/*.js + tk.all.js
npm run typecheck       # tsc --noEmit, 0 errores
npm run test            # node --test tests/
npm run dev             # build + serve . en :4180
```

Smoke test manual después de un cambio:

```bash
curl -s http://localhost:4180/src/components/demo/index.html | grep "<title>"
# debe decir: <title>tk-* · demo de componentes</title>

curl -s -o /dev/null -w "%{http_code}\n" \
  http://localhost:4180/src/components/demo/previews/tk-table.html
# 200

curl -s -o /dev/null -w "%{http_code}\n" \
  http://localhost:4180/dist/cdn/tk.all.js
# 200
```
