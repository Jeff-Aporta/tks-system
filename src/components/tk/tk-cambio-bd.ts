/**
 * <tk-cambio-bd> — bloque `cambio-bd`: un cambio aplicado a la base de datos.
 *
 * Payload: { tabla, registro, intencion, sql }
 *
 * Es el bloque con más peso operativo del ticket (documenta un DDL/DML real),
 * así que declara tabla y registro afectados antes del SQL, no después.
 */

import { blockCss, crearBloque, define, html, md, proseCss, raw } from './_shared.js';
const CSS = /* css */ `
  ${blockCss}
  ${proseCss}
  .marco {
    overflow: hidden;
    border: 1px solid var(--is-border, #2a3038);
    border-radius: var(--tk-radius, 0.625rem);
    background: var(--is-bg-soft, #14181d);
  }
  .cabecera {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em 1em;
    align-items: baseline;
    padding: 0.7em 0.95em;
    border-bottom: 1px solid var(--is-border-soft, #1f242b);
    background: var(--is-bg-elev, #1c2128);
  }
  .campo {
    display: inline-flex;
    gap: 0.4em;
    align-items: baseline;
    font-size: 0.8125em;

    dt {
      margin: 0;
      color: var(--is-text-muted, #9aa7b4);
      letter-spacing: 0.04em;
      text-transform: uppercase;
      font-size: 0.9em;
    }
    dd {
      margin: 0;
      font-family: var(--is-font-mono, ui-monospace, Menlo, monospace);
      color: var(--tk-code-text, #a8d5ff);
    }
  }
  .intencion {
    padding: 0.8em 0.95em;
    font-size: 0.875em;

    + tk-code { display: block; padding: 0 0.95em 0.95em; }
  }
  dl { margin: 0; display: contents; }
`;

const campo = (rotulo: string, valor: string): DocumentFragment | null => (valor
  ? html`<dl class="campo"><dt>${rotulo}</dt><dd>${valor}</dd></dl>`
  : null);

define('tk-cambio-bd', crearBloque(CSS, (root, p) => {
  const sql = String(p.sql ?? '').trim();
  const tabla = String(p.tabla ?? '').trim();
  const registro = String(p.registro ?? '').trim();
  const intencion = String(p.intencion ?? '').trim();
  if (!sql && !tabla && !intencion) return;

  const codigo = sql
    ? Object.assign(document.createElement('tk-code'), { payload: { code: sql, language: 'sql' } })
    : null;

  root.append(html`
    <h2 class="titulo">${String(p.title ?? 'Cambio en base de datos')}</h2>
    <div class="marco">
      ${(tabla || registro) && html`
        <div class="cabecera">
          ${campo('Tabla', tabla)}
          ${campo('Registro', registro)}
        </div>
      `}
      ${intencion && html`<div class="intencion prosa">${raw(md(intencion))}</div>`}
      ${codigo}
    </div>
  `);
}));
