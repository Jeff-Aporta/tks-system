# LLM.md — demo de tk-* + visor de jagudeloe

Guía operativa para el visor de tiquetes en web components y su galería de demos.
**Léela antes de tocar el código: la mitad de las trampas ya nos costó una hora
cada una.**

## Qué hay aquí

```
src/
├── components/
│   ├── tk/                 ← bloques de documento (tk-view, tk-table, …)
│   └── app/                ← shell del visor (tk-app, tk-nav)
├── js/                     ← estado (URL), api, cache, boot, export
├── types/tk.d.ts           ← contrato compartido
└── components/demo/        ← galería de demos del visor
    ├── index.html          ← shell del gallery (drawer + iframe)
    ├── manifest.js         ← { tag, title, category, page, script }[]
    ├── demo-boot.js        ← tema antes del primer paint (shell)
    ├── preview-boot.js     ← tema antes del primer paint (iframes)
    ├── preview-chrome.js   ← sync theme/palette vía postMessage `is-context`
    ├── styles/
    │   ├── shell.css       ← layout del gallery
    │   └── preview.css     ← layout de las páginas de demo
    └── previews/           ← una .html por entrada del manifest + home
```

Reuso del kit `is-*` por CDN (commit-pinned). **Nunca** se reimplementa un
control que ya existe en `is-webcomponents/`: `is-button`, `is-tag`,
`is-tree`, `is-timeline`, `is-chart`, `is-copy-button`, `is-stat`,
`is-callout`, `is-drawer`, `is-palette-selector`, `is-toast`,
`is-theme-toggle`, `is-split-panel`, `is-input`, `is-icon`, `is-lightbox`,
`is-sequence-diagram`, `is-stepper`, `is-data-grid`, `is-details`, `is-spinner`,
`is-main`, `is-banner`, `is-cdn-snippet`, `is-image`, `is-popover`, etc.

## Convenciones que se respetan

### Demo (`src/components/demo/`)

1. **Protocolo `?s=`**: el shell codifica en base64url
   `{ component, theme, palette }`. Los iframes usan `?s={ embed, theme, palette }`.
   `theme`/`palette` **no** se reescriben en la URL al cambiar (son UI, no
   estado de navegación). Contrato idéntico a AppWebcomponents.
2. **`embed: true` en previews**: el preview-chrome oculta su toolbar y delega
   el theme/palette al shell. Lo activa `preview-boot.js` desde `?s=`.
3. **Path a `tk.all.js`**: desde `previews/foo.html` es `../../../../dist/cdn/tk.all.js`
   (4 niveles). El test `tests/demo.test.mjs` bloquea cualquier cambio.
4. **Path a `is-*` CDN**: `https://cdn.jsdelivr.net/gh/Jeff-Aporta/is-webcomponents@main/dist/cdn/all.min.js` (tip de `main`).
   Commit fijo en cada `<script>`/`<link>` — **nunca** `@latest`.
5. **Carga de `tk-*`**: un solo `<script type="module" src=".../tk.all.js">`
   registra todos los `tk-*`. Cada preview instancia el componente que le toca
   con un payload realista y le asigna `.payload` / `.ticket` / `.bloque`
   (ver contrato en `src/components/tk/_shared.ts`).
6. **Categorías del nav**: `shell` (documento: view, ticket-head, actions),
   `blocks` (todos los demás), orden estable.
7. **Tema `contapyme` por default** en el shell.
8. **Mobile**: el `<is-drawer>` del kit aloja el nav móvil. El hamburger solo
   se muestra en `<= 640px`. El mismo nav se inyecta en `shellNav` (desktop)
   y `drawerNav` (móvil) — fuente única, dos destinos.
9. **Brand menu**: usa `<is-palette-selector>` del kit. El branding "ja |
   gudeloe" es texto estático en `.brand-lockup`, no interactivo.

### Visor (`src/components/app/`)

10. **tk-app responsive**: desktop con `<is-split-panel>` (`primary="start"`,
    `position-in-pixels`, `storage-key="tk-app-nav"`) para redimensionar el
    catálogo. En `<= 48rem` el atributo `compact` colapsa el panel izquierdo
    y mueve el nav al `<is-drawer>` (hamburguesa).
11. **tk-nav**: lista plana ordenada por `fechaSolicitud` desc. El filtro de
    espacio (Todo / PatyIA / Clientes / **ISP Svelte**) vive en tabs del
    header de `tk-app` (`is-tab-group` → `nav.contexto`). Buscador con
    `<is-input>`.
    - `TkSpace = 'patyia' | 'clientesis' | 'isp-svelte'`.
    - `isp-svelte` es **virtual**: muchos tickets tienen `space` real
      `clientesis`/`patyia`. El filtro usa heurística
      (`space === 'isp-svelte'` **o** `TK-ISP-*` **o** título/resumen ISP-Svelte),
      no solo igualdad de space.
    - Cadena completa al añadir un space: tipo `TkSpace` → `api.SPACES` /
      `listarTodos` → tab + panel en `tk-app` → `contexto` en `tk-nav` →
      etiqueta en `tk-ticket-head` / `tk-view` → ruta worker.
12. **tk-view**: arma secciones por `docLane` (solicitud, causa, solución,
    verificación, otros). Un bloque sin carril cae en «Detalle».
    - Tags que monta con `document.createElement` (`tk-ticket-head`,
      `tk-block`, `tk-commits`, `tk-metrics`): **import side-effect** en
      `tk-view.ts` **y** `<script>` en `index.html` del shell. Sin eso el
      CE no hace upgrade → UI vacía.
13. **Dos modos en `tk-view`**: `doc` (diligencia/solución: bloques + commits)
    y `metrics` (estudio InSoft: KPIs, datos, tiempos). Se cambia con FAB
    flotante; evento `tk-modo`; atributo `modo`. **No** mezclar tiempos
    InSoft dentro del modo `doc`.
14. **`tk-metrics`** es el contenedor del modo metrics. Vive en
    `src/components/tk/tk-metrics.ts` y **debe** estar en:
    - `all.ts` (bundle `tk.all.js` de demos/export),
    - `FUENTES` de `tests/render.test.mjs`,
    - `index.html` (`./dist/cdn/tk-metrics.js`),
    - `import './tk-metrics.js'` desde `tk-view.ts`.
    Omitir cualquiera → FAB de métricas pinta un nodo vacío.
15. **`docLane`** es el contrato de secciones. El worker puede enriquecerlo
    (`ensureLanes`); el visor agrupa por carril. No inventar carriles
    nuevos sin alinear worker + visor.
16. **`tk-table` + matriz de pruebas**:
    - 2 columnas en todas las filas → ficha Campo/Valor (`dl.ficha`), no grid.
    - Tabla de datos → `<is-data-grid>` con **siempre**
      `toolbar-tools="false"`, **sin** `quick-filter`, **sin** `show-toolbar`.
    - Motivo: en documento (p. ej. «Matriz de pruebas realizadas») la
      búsqueda y Columnas/Filtros/Densidad/Exportar estorban.
    - El boolean vive en el kit (`AppWebcomponents` → `is-data-grid`).
      Si falta en el CDN, **arreglar el kit y pushear**, no ocultar con CSS
      en el visor.
17. **`tk-file-tree` hints**: pistas al hover con `<is-tooltip>`, **nunca**
    texto inline al lado del nombre. Sincronizar árboles desde commits con
    el script del worker (`npm run tk:sync-file-trees`), no inventar paths.

### General

18. **`tk-stepper` y `tk-timeline` son del kit** (`is-stepper`, `is-timeline`).
    No crear timelines verticales custom: si el patrón es "fechas en eje
    temporal", `is-timeline` ya lo hace.
19. **`<is-palette-selector>` del kit** aplica `data-palette` al `<html>` y
    persiste en `localStorage`. El `demo-boot.js` lo aplica antes del primer
    paint; el selector se inicializa leyendo ese atributo.
20. **`compact` attribute + CSS media query** siempre para responsive.
    No togglear visibilidad con JS en `matchMedia` (mejor atributo
    `:host([compact])` + CSS).
21. **Cambios en dos repos**: cambio de API/`is-*` →
    `Personal/apps/AppWebcomponents` (commit + push `main`); consumo en
    tks → `frontend-webcomponents`. jsDelivr `@main` tarda minutos en
    refrescar; pin de commit en export HTML si hace falta inmediatez.
22. **Commits en PowerShell**: no usar HEREDOC bash
    (`git commit -m "$(cat <<'EOF'…"`). Usar
    `git commit -m "mensaje en una línea"` o aquí-string de PowerShell.
23. **Registro de custom elements**: `define()` es idempotente, pero
    **solo corre si el módulo se importa**. `createElement('tk-x')` sin
    haber cargado `tk-x.js` crea un HTMLElement desconocido (sin shadow,
    sin contenido). Mitigación: import en el padre + script en `index.html`
    + test de invariante.
## Anti-patrones explícitos

### Demo

- **No escribir HTML con `Set-Content` de PowerShell** corrompe UTF-8
  (doble encoding, mojibake tipo `vía` → `vÃ­a`). Usar `Write` (la
  herramienta) o `.NET` directo:
  `[System.IO.File]::WriteAllText($path, $content, [System.Text.UTF8Encoding]::new($false))`.
  Si ves `Â·`, `â€"`, `Ã±` en el output, **es mojake, no es un cambio del
  usuario**. Reconstruir el archivo desde el origen limpio.

- **No inventar un protocolo `?s=` propio**. El shell importa `manifest.js`
  y reusa el mismo `b64url(JSON.stringify(...))` que AppWebcomponents.

- **No añadir lógica de "docs completas" al demo**. La demo imita la
  presentación de AppWebcomponents (chrome, TOC lateral, scrollspy) NO
  aplica aquí: los `tk-*` son componentes de bloque, no páginas de
  documentación. Cada preview es una página simple con título + descripción
  + demo en vivo.

- **No reimplementar el drawer móvil**. El kit tiene `<is-drawer>` con
  backdrop, slide-in, escape, light-dismiss, focus trap. Usarlo.

- **No reimplementar el palette picker**. El kit tiene `<is-palette-selector>`
  con su propio trigger, menú, swatch, check, `aria-selected`, localStorage.
  Usarlo. El `<is-palette-selector>` también acepta `slot="trigger"` para
  custom branding.

- **No reimplementar el theme toggle**. El kit tiene `<is-theme-toggle>`.
  Solo `demo-boot.js` aplica el tema antes del primer paint.

- **No usar `isChart` u otros nombres con mayúscula** — los nombres de
  custom elements siempre son kebab-case (`is-chart`, `is-bar-chart`).
  `customElements.define('IsChart', …)` falla silencioso.

- **No tocar el `manifest.js` sin ejecutar el test**. La pareja
  `tag` ↔ `page` debe existir (el test la verifica). Borrar un `tk-*` del
  manifest sin borrar su preview deja un archivo muerto.

- **No escribir `tk-all.js` con guion**. El archivo real es `tk.all.js`
  (punto). Lo genera `scripts/build.mjs` desde `src/components/tk/all.ts`.

- **No usar `is-toast` directo. Usar el wrapper `aviso()` de `js/estado.ts`**.
  Ese wrapper hace lookup del host, ofrece fallback a consola, y mantiene
  tipos.

- **No escribir el `is-palette-selector` con `value` y un listener manual**
  para `data-palette`. El componente ya escribe el atributo en `<html>`
  y persiste en localStorage. Solo escucha `is-palette-change` para
  sincronizar iframes.

### Visor

- **No usar `is-split-panel` en móvil** si el patrón es drawer/hamburguesa:
  en `tk-app` el split es desktop; en `compact` se colapsa y gana el drawer.

- **No añadir `<tk-actions>` si el ticket no está activo**. El componente
  ya oculta sus botones cuando no hay ticket. Ver `tk-actions.ts`.

- **No activar toolbar de data-grid en tablas del documento**. Prohibido en
  `tk-table.ts`: `show-toolbar`, `quick-filter`, o dejar `toolbar-tools`
  en default (true). Obligatorio: `toolbar-tools="false"`. El test
  `tests/tk-invariants.test.mjs` lo vigila.

- **No meter KPIs/tiempos InSoft en modo `doc`**. Eso es `tk-metrics` /
  modo `metrics`. Duplicar `tk-tiempos` en doc fue un error de producto.

- **No montar un `tk-*` solo con `createElement` sin cargar su módulo**.
  El browser no registra el CE solo por el nombre del tag. Obliga:
  `import './tk-x.js'` en el padre que lo crea **y** `<script>` en
  `index.html` del shell (doble red de seguridad). Test:
  `tests/tk-invariants.test.mjs`.

- **No añadir la pestaña ISP Svelte sin el resto de la cadena** (tipo,
  `SPACES`, filtro heurístico en nav, worker). Tab solo en HTML = vacío
  o tickets mal filtrados.

- **No filtrar ISP solo con `String(f.space) === 'isp-svelte'`**. Los
  tickets ISP suelen tener space real `clientesis`; la heurística
  (`TK-ISP-*`, título/resumen) es obligatoria.

- **No pintar hints del file-tree como texto visible permanente**. Solo
  `<is-tooltip>`. Texto al lado del path ensucia el árbol.

- **No reinventar auth del worker en el front**. Login lab:
  `POST /api/auth/login` en `jagudeloe-tks`. Ver `../backend-tks/LLM.md`.

### Convenciones de TS

- **No usar `currentColor` en SVGs producidos por `is-icon`**. El componente
  ya hereda `color`; el SVG debe pintar con `fill="currentColor"` o el
  CSS interno del kit.

- **No exportar `tk-*` como `tk-all.js` con guión**. Archivo real:
  `tk.all.js` (punto). Es lo que carga los previews.

- **No dejar mojibake CP850 en contenido** (`c├│digo`). Siempre pasar por
  `fixMojibake` / `fixMojibakeDeep`. Prohibido “corregir” solo en CSS o
  con replace ad-hoc de una palabra.


## Errores reales que nos costó tiempo

| Síntoma | Causa | Fix |
|---|---|---|
| Iframe devuelve 404 para `tk.all.js` | Path relativo con 3 `../` en vez de 4 | Contar: `previews/` → `demo/` → `components/` → `src/` → root. Cuatro niveles. |
| `<tk-view>` no renderiza dentro de jsdom | jsdom no carga módulos con `data:` URI | Renderizar solo contra el HTML estático; validar estructura, no pintar. |
| `tk-all.js` no se encuentra en dist | Olvidaste `npm run build` | `build` antes de `dev` o `test`. |
| `manifest.js` exportar `export default` | El browser lo soporta, pero jsdom lo quiere como ES module en `import components from './manifest.js'` | Usar `import(manifestUrl)` dinámico en el test, no `JSON.parse(string)`. |
| Las tildes se ven rotas en el iframe | Mojibake por el linter / Set-Content | Reconstruir el archivo con UTF-8 sin BOM. |
| `tk-tree` no expande al cargar | `is-tree-item` sin `expanded` cuando el padre no es hoja | Ver `tk-file-tree.ts` — la marca `expanded` se aplica desde el shell. |
| `tk-timeline` no muestra gráfica | Sólo se pinta cuando hay ≥ 2 `date` válidos | Payload de muestra con 4 ISO dates. |
| `tk-chart` no se ve | `<is-chart>` necesita el `<script type="application/json">` con la config; el componente la lee de su primer hijo. | `tk-chart.ts` lo inyecta con `jsonScript`. |
| Pestaña "Inicio" no navega | `HOME` debe estar en el manifest con `tag: 'home'` | El shell lee HOME de `components.find(c => c.tag === 'home')`. |
| `localStorage` `is-theme` no persiste en iframe | Firefox trata storage de iframes de otro origen como particionado | Ok, mismo origen. Si el iframe no es del mismo origen, el preview-boot.js cae al `<html data-theme>` por defecto. |
| Drawer no abre en click | El `<tk-nav>` no se ha movido al `<is-drawer>` antes de `show()` | `#moverNav('drawer')` antes de `#drawer.show()`. Si el nav está en otro padre, el drawer queda vacío. |
| Drawer abre con `tk-*` styles rotos | El CSS de `tk-nav` envuelve a `tk-nav` con `.shell-nav`, no `.drawer` | El drawer usa `<div class="drawer__mount">` + el mismo `<tk-nav>`; el shadow DOM del nav lo pinta. |
| `is-palette-selector` no se ve inicializado | `value` se setea después del `connectedCallback` | El componente lee `document.documentElement.dataset.palette` en init. `demo-boot.js` lo aplica antes de cargar el kit. |
| `tk-html` no carga como iframe | El type MIME no se detecta | No aplica — nuestros `.html` sirven OK. |
| `tk-table` con celdas sin texto | La rejilla requiere `<td>` con contenido | El componente `<is-data-grid>` rellena vacíos con string vacío. |
| El nav móvil se ve duplicado | El `<tk-nav>` se inyecta en `shellNav` Y `drawerNav` con el mismo contenido | Es el patrón desktop+drawer; ocultar el rail en `compact` via CSS. |
| `compact` no se aplica en Safari | `:host([compact])` necesita que el atributo esté en el elemento | Atributo `compact` setado con `toggleAttribute('compact', true)` en `#onBreakpoint`. |
| `is-drawer` size se sale de pantalla | Usar `--size: 100vw` | Limit a `min(92vw, 22rem)` con CSS var. CSS de parte `panel` para bg. |
| Custom timeline CSS mojibake en tk-steps | Encabezados con tildes pierden encoding | El bloque debe escribirse con `Write`, no `Set-Content`. |
| Matriz de pruebas con Columnas/Filtros/Densidad/Exportar/búsqueda | `tk-table` activaba toolbar/search o el kit no podía apagar tools | Kit: `toolbar-tools="false"`. Visor: siempre ese attr; nunca search en doc. |
| Ocultar toolbar con CSS en el shadow del grid | CSS del consumidor no es el contrato | Extender `is-data-grid` en AppWebcomponents, build, push, luego consumir. |
| `git commit` con HEREDOC bash falla en PowerShell | Shell de Windows no entiende `cat <<'EOF'` | `git commit -m "..."` en una línea. |
| JWT system-login / verify-access rompe CRUD lab | Auth InSoft no aplica al lab | `POST /api/auth/login` → JWT `lab: true`; guard salta verify-access. |
| Secciones en «Detalle» o desordenadas | `docLane` ausente | Worker `ensureLanes` (on por defecto); `?lanes=0` solo raw. |
| File-tree incompleto vs commits | Paths a mano / stubs | `npm run tk:sync-file-trees -- --apply` en backend-tks. |
| Modo metrics sin componente | `tk-metrics` fuera de `all.ts` / FUENTES | Registrar en barril + test. |
| FAB métricas → vista **totalmente vacía** | `tk-metrics.js` **no** estaba en `index.html` y `tk-view` no lo importaba; `createElement` sin upgrade | Script en `index.html` + `import './tk-metrics.js'` en `tk-view` + invariantes. |
| Falta pestaña ISP Svelte en header | Solo existía ruta worker; front sin tab/`SPACES`/`contexto` | Cadena completa: tipo + api + tab + nav heurístico + chips. |
| Tab ISP vacío o tickets “desaparecen” | Filtro solo por `space === 'isp-svelte'` | Heurística `esIspSvelte` (id / título / space virtual). |
| CDN `@main` sirve build viejo | Cache jsDelivr | Esperar o pin `@<sha>`. |
| Textos con `c├│digo` / `qu├®` / `ÔÇö` | UTF-8 leído como CP850 y regrabado | `fixMojibake` en worker (`enrichTicketJson`) y en `api.ts` del visor. Pares en `mojibake-pairs.ts`. No “arreglar” a mano carácter a carácter. |
| `tk-video` no aparece pese a estar en `content[]` | Falta el script en `index.html` (mismo bug de siempre: `all.ts` no basta) | Confirmar `<script type="module" src="./dist/cdn/tk-video.js">` en `index.html`, no solo en `all.ts` |
| `?s=...` con `full:true` ("modo vista", sin header ni panel) sigue mostrando header y panel izquierdo | `connectedCallback` llamaba `#render()` antes de que `#arrancar()` (async) leyera la URL y pusiera el atributo `full`; sin `attributeChangedCallback`, el shell ya estaba armado | Leer `estado.leer().full` y `setAttribute('full','')` **antes** de `#render()` en `connectedCallback`. Test: `tests/full-mode.test.mjs`. |

## Problemas abiertos (sin resolver, no inventar que se arregló)

- **2026-08-06 — TK-1457955 con bloque `video` "se queda en loop" en
  `?s=eyJ0ayI6...`.** Se descartó, con evidencia, que fuera: API lenta/caída
  (responde 200 en ~1s), video sin procesar en YouTube (`processingStatus:
  succeeded`, `embeddable: true`), o `tk-video.js` faltante en `index.html`.
  No se llegó a ver la consola del navegador (extensión de Chrome
  desconectada esa sesión).
  **Fix probable aplicado**: `tk-video.ts` pasó de `<iframe
  src="youtube-nocookie.com/embed/...">` con autoload a
  `lite-youtube-embed` (carga diferida — el iframe real de YouTube solo se
  pide al hacer clic en play). Un iframe de YouTube autocargado es un
  sospechoso razonable de "loop" visual (el player de YouTube hace su
  propio polling/postMessage pesado al iniciar). **No confirmado en
  navegador todavía** — si vuelve a pasar con `lite-youtube-embed` ya
  puesto, la causa es otra y hay que sí o sí conseguir la consola del
  navegador antes de seguir adivinando.

## Cómo añadir un componente nuevo

1. Crear `src/components/tk/tk-mi-bloque.ts` (ver patrón en `tk-badges.ts`).
   Registrarlo en `src/components/tk/all.ts`.
2. `npm run build` → confirma que `dist/cdn/tk-mi-bloque.js` y `tk.all.js`
   se regeneran.
3. Crear `src/components/demo/previews/tk-mi-bloque.html` con plantilla
   idéntica a `tk-markdown.html`.
4. Añadir entrada en `src/components/demo/manifest.js`:
   `{ tag: 'tk-mi-bloque', title: '…', category: 'blocks', page: 'tk-mi-bloque.html', script: '../tk/tk-mi-bloque.ts' }`.
   Añadir `home` con `category: 'shell'` solo si es la portada.
5. `npm run test` — falla si el manifest no resuelve o si el preview no
   tiene el tag correspondiente.

## Cómo añadir un componente nuevo al kit (no al visor)

Si el `tk-*` necesita un `is-*` que no existe aún:
1. **Antes**: confirmar que no se resuelve con un `is-*` ya disponible
   (`is-tree`, `is-callout`, `is-stat`, `is-tag`, `is-chart`, `is-input`,
   `is-palette-selector`, `is-drawer`, `is-toast`, `is-popover`, `is-popup`).
2. **Si todo falla**: añadir el `is-*` en `AppWebcomponents/components/`
   (otro repo). Exponerlo en `dist/cdn/all.min.js`.
3. **Solo entonces**: bumpear el commit CDN en `index.html` del visor Y en
   todos los previews del demo.

## Tests automatizados

`tests/` **no** está en `.gitignore`: se versionan. Convención del repo:
`*.test.mjs` con `node:test` (**no** `*.test.ts` — no hay runner TS; si
alguien pide `.test.ts`, responder con `.test.mjs`).

`npm run test` corre:

- `tests/render.test.mjs` — humo del visor: parsing, despacho por `kind`,
  saneado de HTML, escape de markdown, registro de custom elements,
  modos doc/metrics, tabla → ficha vs grid sin chrome de toolbar.
- `tests/tk-invariants.test.mjs` — invariantes de **fuente** (avisan
  inconsistencia sin abrir el browser):
  - `toolbar-tools="false"` en `tk-table`; prohibido `quick-filter` /
    `show-toolbar`.
  - `tk-metrics` en `all.ts`, en `index.html`, e importado por `tk-view`.
  - Tags que `tk-view` crea con `createElement` tienen script en
    `index.html` (red de seguridad del shell).
  - Cadena ISP Svelte: `TkSpace`, `SPACES` en `api.ts`, tab en `tk-app`,
    `contexto`/`esIspSvelte` en `tk-nav`.
  - Hints vía `is-tooltip` en file-tree.
- `tests/export.test.mjs` — el HTML descargable: import map completo,
  cada URI `data:` decodifica al `.js` compilado, JSON del ticket saneado.
- `tests/demo.test.mjs` — invariantes del demo: paths relativos, manifest
  ↔ preview, encoding UTF-8 sin BOM, sin mojibake, is-* cargado por CDN,
  boot scripts balanceados, `<is-palette-selector>` Y `<is-drawer>`
  presentes (no reimplementación).
- `tests/mojibake.test.mjs` — pares CP850 → UTF-8.

Si rompes uno de estos, **el CI te lo dice antes de llegar al browser**.

## Ecosistema relacionado

| Repo | Path local | LLM |
|---|---|---|
| Visor WC (este) | `Personal/apps/jagudeloe/frontend-webcomponents` | este archivo + [`LLM.md`](../../../LLM.md) raíz del paquete |
| Worker TKS | `Personal/apps/jagudeloe/backend-tks` | `../backend-tks/LLM.md` |
| Kit `is-*` | `Personal/apps/AppWebcomponents` | `components/data/LLM.md` (grids) + `LLM.md` raíz |

### Cómo extender tests cuando aparece un error

Si un bug escapa a producción:

1. Reproducir el bug (browser o HTML estático).
2. Añadir un caso al test correspondiente — preferir
   `tests/tk-invariants.test.mjs` si es “olvidamos un script/import/tab”.
3. Verificar que el test falla en `main` y pasa en tu branch.
4. Hacer el fix **solo** después de tener el test rojo.

Nunca fixes sin un test que demuestre el bug — sin él, el bug va a volver.

## Comandos útiles

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

## Convenciones de commit

- Conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`.
- `dist/cdn/tk.all.js` se commitea junto al commit (es build artifact).
- Mensajes en español, máx 72 chars en el subject.
- No pisar master — branches por feature.
