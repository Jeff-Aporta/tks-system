# LLM.md — jagudeloe-tks-front (visor WC)

Índice operativo del visor de tiquetes. **Léelo antes de tocar código.**

## Documentos

| Documento | Contenido |
|---|---|
| [`src/components/demo/LLM.md`](src/components/demo/LLM.md) | Guía completa: convenciones, anti-patrones, errores reales, demos, tests |
| [`../backend-tks/LLM.md`](../backend-tks/LLM.md) | Worker API: auth lab JWT, CRUD, `docLane`, space virtual `isp-svelte`, CLI sync |
| Kit `is-*` → [`AppWebcomponents/components/data/LLM.md`](../../AppWebcomponents/components/data/LLM.md) | `is-data-grid` / `toolbar-tools` |

## Qué hacer (resumen)

1. Reusar `is-*` del kit; no reinventar controles.
2. Tablas del documento: `toolbar-tools="false"`, sin búsqueda ni tools.
3. Modo `doc` ≠ modo `metrics` (`tk-metrics` + FAB).
4. Todo CE que `createElement` monte **debe** estar importado y/o en `index.html`
   (si no, el tag no hace upgrade → vista vacía).
5. Spaces: `patyia` \| `clientesis` \| `isp-svelte` (virtual). Tab header +
   `api.spaces` + filtro `tk-nav` + tipo `TkSpace` van juntos.
6. Hints de árbol: solo `<is-tooltip>`.
7. Cambios de kit → AppWebcomponents → push → luego consumir en este repo.
8. **Evidencias**: `tk-view` fusiona `image` consecutivos → `image-group`;
   rejilla `auto-fill` + tope `18rem` + `justify-content: start`; una figura
   por URL; detalle en lightbox. Ver `tests/evidencias.test.mjs`.
9. **Video**: tope `--tk-video-max: 36rem` en `tk-view` / `tk-video`; alinear
   a la izquierda (`margin-inline: 0`); embed con `lite-youtube-embed` (no
   iframe YouTube al cargar). Ver `tests/video-layout.test.mjs`.
10. **SEO / marca**: `index.html` lleva title, description, canonical, favicon
    vía **Iconify API** (`api.iconify.design/...svg`, no `favicon.svg` local),
    apple-touch/OG en `src/assets/brand/`. Canonical:
    `https://jeff-aporta.github.io/jagudeloe-tks-front/`. Ver
    `tests/index-meta.test.mjs`.
11. En PowerShell: commits con `-m "..."` plano (sin HEREDOC bash).
12. Tras bug: test rojo en `tests/*.test.mjs` antes del fix (`tests/` **sí** se
    versiona; no está en `.gitignore`).

## Fichas sueltas: `<tk-view>` se carga solo (14-ago-2026)

Una página que embebe la ficha de un tiquete **no escribe JavaScript**. Declara
el tiquete y el componente resuelve:

```html
<link rel="stylesheet" href="…/is-webcomponents@main/dist/cdn/is-base.min.css">
<link rel="stylesheet" href="…/is-webcomponents@main/dist/cdn/palettes.min.css">
<link rel="stylesheet" href="…/tks-system@main/dist/cdn/documento.css">
<script type="module" src="…/is-webcomponents@main/dist/cdn/all.min.js"></script>
<script type="module" src="…/tks-system@main/dist/cdn/tk.all.js"></script>

<tk-view embebido sanear
         tk="TK-1426669" space="clientesis"
         fallback="./TK-1426669-tk.json"></tk-view>
```

| Atributo | Default | Qué hace |
|---|---|---|
| `tk` | — | Id del tiquete. Su presencia activa la autocarga. |
| `space` | `patyia` | `patyia` \| `clientesis` \| `isp-svelte`. |
| `fallback` | — | JSON local; último recurso si el worker no responde. |
| `cache-horas` | `24` | Vigencia de la caché para esa lectura. |
| `sanear` | apagado | Aplica R51 (nombres propios → cargo/rol) al dato del worker. |

Eventos: `tk-datos` (`{ origen, ticket }`) y `tk-error` (`{ error }`).

**SÍ hacer**
- Reusar `api.ticket()`: ya trae caché en IndexedDB, degradación a copia vencida
  y aviso. El plazo se pasa por lectura (`{ vigenciaMs }`), no se hardcodea.
- Sanear con `js/sanear.ts` — es la única copia de la regla R51. Si un generador
  necesita el mismo saneo, importa de ahí.
- El lienzo de una ficha suelta va en `css/documento.css` → `dist/cdn/documento.css`.
  `is-base.css` no pinta `html`/`body` a propósito.

**NO hacer**
- **No** incrustar el JSON del tiquete en el HTML. Congela el dato: cualquier
  cambio en el sistema solo se veía regenerando el archivo.
- **No** replicar en cada página el fetch, la caché y el saneo. Todo eso vive en
  el componente; la página solo declara atributos.
- **No** calcular en el arranque de un módulo algo que dependa de una URL
  resoluble (`new URL('.', document.baseURI)`). `estado.ts` lo hacía y, al pasar
  a ser dependencia de `<tk-view>`, tumbaba el componente en cualquier documento
  sin base (`about:blank`, `srcdoc`, jsdom). Va en `try/catch`.
- **No** esperar que el `fallback` funcione con la página abierta por `file://`:
  el navegador bloquea leer un archivo hermano. El worker sí responde ahí.

Guardián: `tests/tk-view-autocarga.test.mjs`.

## Qué no hacer (resumen)

- No `show-toolbar` / `quick-filter` en `tk-table`.
- No ocultar chrome del grid con CSS local.
- No meter tiempos InSoft en modo documento.
- No asumir que `createElement('tk-x')` registra el custom element.
- No añadir un space solo en el tab o solo en la API (parcial = bug).
- No filtrar ISP solo con `f.space === 'isp-svelte'` (muchos viven en
  `clientesis` / `TK-ISP-*` / título).
- No texto inline de hints en `tk-file-tree`.
- No inventar auth frente al worker (usar login lab).
- No `tk-all.js` con guión → es `tk.all.js`.
- **No** `--tk-video-max: 100%` ni centrar el video a pantalla completa: el
  documento se come el viewport.
- **No** dejar `image` sueltos en serie sin fusionar: cada uno a ancho completo
  = “una columna estirada”, no galería.
- **No** `grid-template-columns: … 1fr` ni `auto-fit` solo para evidencias:
  con una miniatura estira al 100%. Usar `auto-fill` + max fijo (`18rem`).
- **No** pintar la evidencia a ancho completo ni repetir la misma URL en varios
  bloques: ver `tests/evidencias.test.mjs`.
- **No** iframe YouTube autocargado en `tk-video` (sospecha de “loop” pesado);
  usar `lite-youtube`.
- **No** publicar el shell sin meta/canonical/favicon/og: el share queda sin
  marca.
- No `*.test.ts` aquí: el runner es `node:test` + `*.test.mjs`.

Detalle y tabla de errores: **demo/LLM.md**.
