/**
 * <tk-markdown> — bloque `markdown` del ticket.
 *
 * Propiedad
 *   payload  { text | body | content, title }
 */

import { blockCss, crearBloque, define, html, md, proseCss, raw } from './_shared.js';
const CSS = /* css */ `
  ${blockCss}
  ${proseCss}
`;

define('tk-markdown', crearBloque(CSS, (root, p) => {
  const texto = String(p.text ?? p.body ?? p.content ?? '').trim();
  if (!texto && !p.title) return;

  root.append(html`
    ${p.title && html`<h2 class="titulo">${p.title}</h2>`}
    ${texto && html`<div class="prosa">${raw(md(texto))}</div>`}
  `);
}));
