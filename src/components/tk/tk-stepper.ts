/**
 * <tk-stepper> — bloque `mui-stepper`: procedimiento paso a paso (cómo probar).
 *
 * Payload: { stepper: { steps: [{ id, icon, color, label, description }] } }
 *
 * El nombre del `kind` viene del front anterior (MUI). Aquí lo pinta
 * <is-stepper> en vertical: los pasos llevan descripción larga con markdown y
 * en horizontal no cabrían sin recortar.
 */

import { blockCss, crearBloque, define, html, md, proseCss, raw, rec } from './_shared.js';
const CSS = /* css */ `
  ${blockCss}
  ${proseCss}
  is-stepper { display: block; }
  .desc {
    color: var(--is-text-soft, #c3ced9);
    font-size: 0.875em;
  }
`;

define('tk-stepper', crearBloque(CSS, (root, p) => {
  const spec = rec(p.stepper ?? p);
  const pasos = (Array.isArray(spec.steps) ? spec.steps : []).map(rec);
  if (!pasos.length) return;

  root.append(html`
    ${p.title && html`<h2 class="titulo">${p.title}</h2>`}
    <!-- active = total: el procedimiento está documentado, ningún paso queda pendiente. -->
    <is-stepper orientation="vertical" active="${pasos.length}">
      ${pasos.map((paso) => {
        const desc = String(paso.description ?? paso.desc ?? '').trim();
        return html`
          <is-stepper-step
            label="${String(paso.label ?? paso.title ?? '')}"
            icon="${String(paso.icon ?? 'mdi:checkbox-marked-circle-outline')}"
          >
            ${desc && html`<div slot="description" class="desc prosa">${raw(md(desc))}</div>`}
          </is-stepper-step>
        `;
      })}
    </is-stepper>
    ${p.caption && html`<p class="pie">${p.caption}</p>`}
  `);
}));
