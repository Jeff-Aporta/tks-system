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
