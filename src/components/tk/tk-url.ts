/**
 * <tk-url> — bloques `url` y `link` del ticket.
 *
 * Payload: { href | url, label, caption }
 *
 * Solo se aceptan esquemas http/https: el enlace de un ticket abre una
 * referencia externa, nunca ejecuta nada.
 */

import { blockCss, crearBloque, define, html } from './_shared.js';
const CSS = /* css */ `
  ${blockCss}
  a {
    display: inline-flex;
    max-width: 100%;
    align-items: center;
    gap: 0.5em;
    padding: 0.55em 0.85em;
    border: 1px solid var(--is-border, #2a3038);
    border-radius: var(--tk-radius, 0.625rem);
    background: var(--is-bg-soft, #14181d);
    color: var(--tk-link, #6fb2e8);
    font-size: 0.875em;
    text-decoration: none;
    transition: border-color 140ms ease-out, background-color 140ms ease-out;

    &:hover {
      border-color: var(--is-accent, #1a6eb0);
      background: color-mix(in srgb, var(--is-accent, #1a6eb0) 10%, var(--is-bg-soft, #14181d));
    }
    &:focus-visible {
      outline: 2px solid var(--is-focus, #4c9be8);
      outline-offset: 2px;
    }
  }
  .etiqueta {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  is-icon { flex: none; font-size: 1.05em; }
`;

define('tk-url', crearBloque(CSS, (root, p) => {
  const href = String(p.href ?? p.url ?? '').trim();
  if (!/^https?:\/\//i.test(href)) return;

  root.append(html`
    ${p.title && html`<h2 class="titulo">${p.title}</h2>`}
    <a href="${href}" target="_blank" rel="noopener noreferrer">
      <is-icon icon="mdi:open-in-new" aria-hidden="true"></is-icon>
      <span class="etiqueta">${String(p.label ?? href)}</span>
    </a>
    ${p.caption && html`<p class="pie">${p.caption}</p>`}
  `);
}));
