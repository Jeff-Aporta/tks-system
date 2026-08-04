/**
 * <tk-html> — bloque `html` del ticket (HTML ya redactado en la BD).
 *
 * El HTML se sanea antes de inyectarse: fuera <script>, <style>, <iframe>,
 * <object>, <embed>, <form>, los atributos `on*` y las URL `javascript:`. El
 * contenido del ticket es dato, no código, aunque venga de nuestra propia BD.
 *
 * Propiedad
 *   payload  { html, title }
 */

import { blockCss, crearBloque, define, html, proseCss, raw } from './_shared.js';
const CSS = /* css */ `
  ${blockCss}
  ${proseCss}
  .prosa img { max-width: 100%; height: auto; border-radius: var(--tk-radius, 0.625rem); }
  .prosa table { display: block; overflow-x: auto; }
`;

const TAGS_PROHIBIDAS = ['script', 'style', 'iframe', 'object', 'embed', 'form', 'link', 'meta', 'base'];

const sanear = (html: unknown): string => {
  const doc = new DOMParser().parseFromString(String(html ?? ''), 'text/html');
  doc.body.querySelectorAll(TAGS_PROHIBIDAS.join(',')).forEach((n) => n.remove());

  for (const el of doc.body.querySelectorAll('*')) {
    for (const attr of [...el.attributes]) {
      const nombre = attr.name.toLowerCase();
      const valor = attr.value.trim().toLowerCase();
      if (nombre.startsWith('on')) el.removeAttribute(attr.name);
      else if ((nombre === 'href' || nombre === 'src') && valor.startsWith('javascript:')) {
        el.removeAttribute(attr.name);
      }
    }
    if (el.tagName === 'A') {
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    }
  }
  return doc.body.innerHTML;
};

define('tk-html', crearBloque(CSS, (root, p) => {
  const cuerpo = String(p.html ?? '').trim();
  if (!cuerpo && !p.title) return;

  root.append(html`
    ${p.title && html`<h2 class="titulo">${p.title}</h2>`}
    ${cuerpo && html`<div class="prosa">${raw(sanear(cuerpo))}</div>`}
  `);
}));
