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
8. Evidencias: miniatura acotada (rejilla `auto-fill` + alto fijo) y una sola
   figura por captura; el detalle se ve en el lightbox.
9. En PowerShell: commits con `-m "..."` plano (sin HEREDOC bash).
10. Tras bug: test rojo en `tests/*.test.mjs` antes del fix (`tests/` **sí** se versiona).

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
- No pintar la evidencia a ancho completo (`auto-fit` estira la única
  miniatura) ni repetir la misma URL en varios bloques: ver
  `tests/evidencias.test.mjs`.
- No `*.test.ts` aquí: el runner es `node:test` + `*.test.mjs`.

Detalle y tabla de errores: **demo/LLM.md**.
