/**
 * <tk-table> — bloque `table` del ticket.
 *
 * Payload: { title, headers?: string[], rows: (string | object)[][], caption? }
 *
 * La tabla la pinta <is-data-grid> del kit. En el documento del tk la toolbar
 * va apagada (`toolbar-tools="false"`, sin `quick-filter`): la matriz de
 * pruebas no debe mostrar búsqueda ni Columnas/Filtros/Densidad/Exportar.
 *
 * Excepción deliberada: cuando todas las filas tienen dos celdas, el bloque no
 * es una tabla de datos sino una ficha Campo/Valor (la "Información del
 * tiquete" que abre casi todos los tickets). Ahí una rejilla con cabeceras,
 * menús y footer estorba: se pinta como lista de definición.
 */

import { blockCss, crearBloque, define, html, inlineMd, raw, rec } from './_shared.js';
const CSS = /* css */ `
  ${blockCss}
  .ficha {
    display: grid;
    overflow: hidden;
    margin: 0;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: var(--is-bg-soft, #14181d);
    grid-template-columns: minmax(7rem, max-content) 1fr;

    dt, dd {
      padding: 0.6em 0.95em;
      border-top: 1px solid var(--is-border-soft, #1f242b);
      font-size: 0.875em;
      line-height: 1.55;
    }
    dt:first-of-type, dt:first-of-type + dd { border-top: 0; }
    dt {
      color: var(--is-text, #e6edf3);
      font-weight: 550;
    }
    dd { margin: 0; min-width: 0; }
    code {
      padding: 0.1em 0.35em;
      border-radius: 0.28em;
      background: var(--is-code-bg, #0f1318);
      font-family: var(--is-font-mono, ui-monospace, Menlo, monospace);
      font-size: 0.9em;
      color: var(--tk-code-text, #a8d5ff);
    }
    a { color: var(--tk-link, #6fb2e8); }
  }
  is-data-grid {
    display: block;
    --is-grid-height: auto;
  }
`;

/** Celda cruda a HTML: strings con markdown inline, objetos por su campo texto. */
const celda = (v: unknown): string => {
  if (v == null) return '';
  if (typeof v === 'object') {
    const r = rec(v);
    return inlineMd(r.text ?? r.label ?? r.value ?? '');
  }
  return inlineMd(v);
};

interface Columna {
  readonly field: string;
  readonly headerName: string;
  readonly flex: number;
  readonly sortable: boolean;
  /** `{ html }` es el contrato de is-data-grid para contenido no textual. */
  renderCell(params: { readonly value: unknown }): { readonly html: string };
}

define('tk-table', crearBloque(CSS, (root, p) => {
  const filas = (Array.isArray(p.rows) ? p.rows : []).map((f) => (Array.isArray(f) ? f : [f]));
  if (!filas.length) return;
  const cabeceras = (Array.isArray(p.headers) ? p.headers : []).map(String);

  // Ficha Campo/Valor: dos columnas en todas las filas.
  if (filas.every((f) => f.length === 2)) {
    root.append(html`
      ${p.title && html`<h2 class="titulo">${p.title}</h2>`}
      <dl class="ficha">
        ${filas.map((f) => html`
          <dt>${raw(celda(f[0]))}</dt>
          <dd>${raw(celda(f[1]))}</dd>
        `)}
      </dl>
      ${p.caption && html`<p class="pie">${p.caption}</p>`}
    `);
    return;
  }

  const anchura = Math.max(...filas.map((f) => f.length), cabeceras.length);
  const columnas: Columna[] = Array.from({ length: anchura }, (_v, i) => ({
    field: `c${i}`,
    headerName: cabeceras[i] ?? `Columna ${i + 1}`,
    flex: 1,
    sortable: true,
    renderCell: ({ value }) => ({ html: celda(value) }),
  }));

  const rejilla = Object.assign(document.createElement('is-data-grid'), {
    columns: columnas,
    rows: filas.map((f, i) => {
      const fila: Record<string, unknown> = { id: i };
      f.forEach((c, j) => { fila[`c${j}`] = c; });
      return fila;
    }),
  });
  rejilla.setAttribute('auto-height', '');
  rejilla.setAttribute('hide-footer', '');
  rejilla.setAttribute('density', 'compact');
  rejilla.setAttribute('disable-column-menu', '');
  // Vista documento: sin búsqueda ni Columnas/Filtros/Densidad/Exportar.
  rejilla.setAttribute('toolbar-tools', 'false');

  root.append(html`
    ${p.title && html`<h2 class="titulo">${p.title}</h2>`}
    ${rejilla}
    ${p.caption && html`<p class="pie">${p.caption}</p>`}
  `);
}));
