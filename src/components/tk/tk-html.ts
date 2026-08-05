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
  .prosa table { display: table; width: 100%; max-width: 100%; overflow-x: auto; }
  /* Redacción del ticket: hereda --is-text del tema; ignora grises inline InSoft. */
  .prosa,
  .prosa :is(p, li, span, div, strong, em, h1, h2, h3, h4, h5, h6, td, th) {
    color: var(--is-text, #e6edf3);
  }
  .prosa a { color: var(--tk-link, #6fb2e8); }
  .prosa code { color: var(--tk-code-text, #a8d5ff); }
`;

const TAGS_PROHIBIDAS = ['script', 'style', 'iframe', 'object', 'embed', 'form', 'link', 'meta', 'base'];

/** Quita anchos fijos de plantilla email (p. ej. width:680px) para el visor fluido. */
const fluidizarEstilo = (style: string): string =>
  style
    .replace(/(?:^|;)\s*width\s*:\s*\d{3,4}px\b/gi, ';width:100%')
    .replace(/(?:^|;)\s*max-width\s*:\s*\d{3,4}px\b/gi, ';max-width:100%')
    .replace(/(?:^|;)\s*min-width\s*:\s*\d{3,4}px\b/gi, ';min-width:0')
    .replace(/^;+/, '')
    .trim();

/** Quita `color:` gris/neutro del HTML InSoft; el tema pinta la redacción. */
const sinColorGris = (style: string): string =>
  style
    .replace(
      /(?:^|;)\s*color\s*:\s*(?:#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})\b|rgba?\([^)]*\)|hsla?\([^)]*\)|gray|grey|silver|currentcolor)\s*/gi,
      ';',
    )
    .replace(/;{2,}/g, ';')
    .replace(/^;+|;+$/g, '')
    .trim();

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
    const widthAttr = el.getAttribute('width');
    if (widthAttr && /^\d{3,4}$/.test(widthAttr) && Number(widthAttr) >= 400) {
      el.removeAttribute('width');
      el.setAttribute('data-tk-fluid', '');
    }
    let style = el.getAttribute('style');
    if (!style) continue;
    let next = style;
    if (/color\s*:/i.test(next)) next = sinColorGris(next);
    if (/\d{3,4}px/.test(next) && /(?:^|;)\s*(?:max-)?width\s*:/i.test(next)) {
      next = fluidizarEstilo(next);
    }
    if (!next) el.removeAttribute('style');
    else if (next !== style) el.setAttribute('style', next);
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
