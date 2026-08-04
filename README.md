# jagudeloe-tks-front

Visor de tiquetes **PatyIA / ClientesIS** en web components. Sin framework,
sin JSX, sin bundler de runtime. Publica un CDN consumible por jsDelivr y
HTML descargables que se abren con doble clic (`file://`).

| | |
|---|---|
| **GitHub Pages** | https://jeff-aporta.github.io/jagudeloe-tks-front/ |
| **CDN (jsDelivr)** | `https://cdn.jsdelivr.net/gh/Jeff-Aporta/jagudeloe-tks-front@PIN/dist/cdn/` |
| **API** | `jagudeloe-tks-back` (`GET /api/tk/:space/tickets…`) |
| **Kit UI** | [`is-webcomponents`](https://github.com/Jeff-Aporta/is-webcomponents) |

```bash
npm install
npm run build      # src/**/*.ts → dist/cdn/*.js + tk.all.js
npm run typecheck
npm test
npm run dev        # http://localhost:4180
```

## Cómo está armado

| Capa | Dónde | Qué hace |
|------|-------|----------|
| Kit `is-*` | CDN (commit fijo) | Botones, tags, árbol, rejilla, charts, tema |
| Bloques `tk-*` | `src/components/tk/` | Un componente por `kind` del ticket |
| Shell | `src/components/app/` | Cabecera, panel, visor |
| Datos | `src/js/` | Worker, caché IndexedDB, estado en URL, export |
| Build | `scripts/build.mjs` | esbuild strip-types → `dist/cdn/` plano |

**Nada se reimplementa si el kit ya lo resuelve.** Los `tk-*` traducen el
payload de la BD al componente `is-*` correspondiente.

## CDN y HTML descargable

El HTML que genera **Descargar** carga un único bundle:

```html
<script type="module"
  src="https://cdn.jsdelivr.net/gh/Jeff-Aporta/jagudeloe-tks-front@PIN/dist/cdn/tk.all.js">
</script>
```

No usa import maps ni `data:` URIs: en `file://` Chrome no resuelve
`./_shared.js` (origen único). Con URL `https://` absoluta sí.

Tras publicar un cambio que afecte al bundle, actualiza el pin en
`src/js/export.ts` (`TK_PIN`) al SHA de `main` y vuelve a build/push.

## Bloques soportados

`markdown` · `html` · `badge` / `badges` · `table` · `image` / `image-group` ·
`code` · `url` / `link` · `cambio-bd` · `steps` · `file-tree` · `timeline` /
`metrics-timeline` · `sequence` · `mui-stepper` · `chart` · `diagram`

## Datos

```
GET /api/tk/:space/tickets
GET /api/tk/:space/tickets/:iticket
```

Orden: caché vigente (15 min) → red → caché vencida con toast → error.
Base local en `localhost:8786`; override con `?api=`.

## Compartir y descargar

- **Compartir** — enlace `?s=` (base64url) con `full: true` (página completa).
- **Descargar** — `TK-….html` autocontenido (JSON + CDN). Se abre offline
  respecto a este visor; necesita red solo para los CDNs fijados.

## Tema

`dark` por defecto, paleta `contapyme`. `src/js/boot.js` aplica el tema antes
del primer pintado.

## Licencia

MIT — ver [LICENSE](./LICENSE).
