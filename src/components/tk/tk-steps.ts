/**
 * <tk-steps> — bloque `steps`: fases de análisis con sus hallazgos.
 *
 * Payload: { phases | steps: [{ title, items: (string | bloque)[] }] }
 *
 * Un ítem puede ser texto (markdown inline) o un bloque anidado — en la BD hoy
 * aparecen `badges` dentro de una fase. Los bloques anidados se delegan a
 * <tk-block>, que es quien conoce el mapa de tipos.
 */

import { blockCss, crearBloque, define, html, md, proseCss, raw, rec } from './_shared.js';
const CSS = /* css */ `
  ${blockCss}
  ${proseCss}
  ol { margin: 0; padding: 0; list-style: none; }
  .fase {
    position: relative;
    padding: 0 0 1.35em 1.55em;
    border-left: 1px solid var(--is-border, #2a3038);

    &:last-child { padding-bottom: 0; border-left-color: transparent; }
    &::before {
      position: absolute;
      top: 0.5em;
      left: 0;
      width: 0.5em;
      height: 0.5em;
      border-radius: 50%;
      background: var(--is-accent, #1a6eb0);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--is-accent, #1a6eb0) 22%, transparent);
      content: "";
      transform: translateX(-50%);
    }
    h3 {
      margin: 0 0 0.55em;
      font-size: 0.9375em;
      font-weight: 620;
      letter-spacing: -0.008em;
      line-height: 1.35;
    }
  }
  .hallazgos { display: grid; gap: 0.45em; min-width: 0; }
  .hallazgo {
    max-width: min(100%, var(--tk-measure, 68ch));
    min-width: 0;
    color: var(--is-text-soft, #c3ced9);
    font-size: 0.9em;
    line-height: 1.55;
    overflow-wrap: anywhere;

    &.prosa > :last-child { margin-bottom: 0; }
  }
  h3 { overflow-wrap: anywhere; }
`;

interface Fase {
  readonly title: string;
  readonly items: readonly unknown[];
}

const leerFase = (raw: unknown, i: number): Fase => {
  const r = rec(raw);
  const items = Array.isArray(r.items) ? r.items
    : Array.isArray(r.steps) ? r.steps
      : r.text ? [r.text] : [];
  return { title: String(r.title ?? r.label ?? `Fase ${i + 1}`), items };
};

/** Un ítem es prosa o un bloque anidado; <tk-block> resuelve el segundo caso. */
const hallazgo = (item: unknown): Node | null => {
  if (item == null) return null;
  if (typeof item === 'string') {
    return html`<div class="hallazgo prosa">${raw(md(item))}</div>`;
  }
  return Object.assign(document.createElement('tk-block'), { bloque: item as TkBlock });
};

define('tk-steps', crearBloque(CSS, (root, p) => {
  const crudas = Array.isArray(p.phases) ? p.phases
    : Array.isArray(p.steps) ? p.steps : [];
  const fases = crudas.map(leerFase).filter((f) => f.items.length || f.title);
  if (!fases.length) return;

  root.append(html`
    ${p.title && html`<h2 class="titulo">${p.title}</h2>`}
    <ol>
      ${fases.map((fase) => html`
        <li class="fase">
          <h3>${fase.title}</h3>
          <div class="hallazgos">${fase.items.map(hallazgo)}</div>
        </li>
      `)}
    </ol>
  `);
}));
