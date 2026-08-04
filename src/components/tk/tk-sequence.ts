/**
 * <tk-sequence> — bloque `sequence`: diagrama de secuencia del ticket.
 *
 * Payload: { sequence: { actors, groups, messages }, title, subtitle, caption }
 *
 * <is-sequence-diagram> consume exactamente el mismo JSON que ya guarda la BD,
 * así que el payload pasa tal cual. Solo se limpian las plantillas
 * `{{iconify: {...}}}` de las etiquetas cuando el kit no las resuelve.
 */

import { blockCss, crearBloque, define, html, jsonScript, rec } from './_shared.js';
const CSS = /* css */ `
  ${blockCss}
  .subtitulo {
    margin: -0.5em 0 0.75em;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.875em;
  }
  .marco {
    overflow-x: auto;
    padding: 0.5em;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: var(--is-bg-soft, #14181d);
  }
  is-sequence-diagram { display: block; min-width: 32rem; }
`;

define('tk-sequence', crearBloque(CSS, (root, p) => {
  const spec = rec(p.sequence);
  const mensajes = Array.isArray(spec.messages) ? spec.messages : [];
  const preset = String(p.preset ?? spec.preset ?? '');
  if (!mensajes.length && !preset) return;
  const subtitulo = String(p.subtitle ?? '');

  root.append(html`
    ${p.title && html`<h2 class="titulo">${p.title}</h2>`}
    ${subtitulo && html`<p class="subtitulo">${subtitulo}</p>`}
    <div class="marco">
      <is-sequence-diagram color="inline">
        ${jsonScript(preset && !mensajes.length ? { preset } : { sequence: spec })}
      </is-sequence-diagram>
    </div>
    ${p.caption && html`<p class="pie">${p.caption}</p>`}
  `);
}));
