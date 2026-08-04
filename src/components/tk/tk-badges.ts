/**
 * <tk-badges> — bloques `badge` y `badges` del ticket.
 *
 * `badge` trae { tone, label }; `badges` trae { items: [{tone,label}] }. Se
 * pintan con <is-tag>, que ya resuelve color y forma en los dos temas.
 *
 * Propiedad
 *   payload  { tone, label } | { items } | { badges }
 */

import { blockCss, crearBloque, define, html, rec, tono } from './_shared.js';
const CSS = /* css */ `
  ${blockCss}
  .fila {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45em;
    align-items: center;
    font-size: 0.875rem;
  }
`;

define('tk-badges', crearBloque(CSS, (root, p) => {
  const crudos = Array.isArray(p.items) ? p.items
    : Array.isArray(p.badges) ? p.badges
      : p.label ? [p] : [];

  const etiquetas = crudos
    .map(rec)
    .map((it) => ({ texto: String(it.label ?? it.text ?? '').trim(), color: tono(it.tone ?? it.color) }))
    .filter((it) => it.texto);
  if (!etiquetas.length) return;

  root.append(html`
    ${p.title && html`<h2 class="titulo">${p.title}</h2>`}
    <div class="fila">
      ${etiquetas.map((it) => html`
        <is-tag color="${it.color}" variant="filled-outlined" pill>${it.texto}</is-tag>
      `)}
    </div>
  `);
}));
