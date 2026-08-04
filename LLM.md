# LLM.md — jagudeloe-tks-front (visor WC)

Índice operativo del visor de tiquetes. **Léelo antes de tocar código.**

## Documentos

| Documento | Contenido |
|---|---|
| [`src/components/demo/LLM.md`](src/components/demo/LLM.md) | Guía completa: convenciones, anti-patrones, errores reales, demos, tests |
| [`../backend-tks/LLM.md`](../backend-tks/LLM.md) | Worker API: auth lab JWT, CRUD, `docLane`, CLI sync |
| Kit `is-*` → [`AppWebcomponents/components/data/LLM.md`](../../AppWebcomponents/components/data/LLM.md) | `is-data-grid` / `toolbar-tools` |

## Qué hacer (resumen)

1. Reusar `is-*` del kit; no reinventar controles.
2. Tablas del documento: `toolbar-tools="false"`, sin búsqueda ni tools.
3. Modo `doc` ≠ modo `metrics` (`tk-metrics` + FAB).
4. Hints de árbol: solo `<is-tooltip>`.
5. Cambios de kit → AppWebcomponents → push → luego consumir en este repo.
6. En PowerShell: commits con `-m "..."` plano (sin HEREDOC bash).
7. Tras bug: test rojo en `tests/*.test.mjs` antes del fix.

## Qué no hacer (resumen)

- No `show-toolbar` / `quick-filter` en `tk-table`.
- No ocultar chrome del grid con CSS local.
- No meter tiempos InSoft en modo documento.
- No texto inline de hints en `tk-file-tree`.
- No inventar auth frente al worker (usar login lab).
- No `tk-all.js` con guión → es `tk.all.js`.

Detalle y tabla de errores: **demo/LLM.md**.
