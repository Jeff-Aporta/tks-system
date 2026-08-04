/**
 * <tk-timeline> — bloques `timeline` y `metrics-timeline`.
 *
 * Payload: { timeline: { title, resumen: [{label,value,highlight}], milestones: [...] } }
 *
 * El payload de la BD habla de `milestones` y <is-timeline> espera `events`:
 * la traducción se hace aquí y no en el servidor, para no atar la BD al kit de
 * componentes. El `resumen` no es parte del gráfico — son las cifras hábiles
 * del ticket y van arriba, donde se leen primero.
 */

import { blockCss, crearBloque, define, fecha, html, jsonScript, raw, rec } from './_shared.js';
const CSS = /* css */ `
  ${blockCss}
  .resumen {
    display: grid;
    gap: 0.65em;
    margin: 0 0 1em;
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  }
  .cifra {
    display: grid;
    gap: 0.3rem;
    padding: 0.65rem 0.8rem;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: color-mix(in srgb, var(--is-bg-soft, #14181d) 88%, transparent);
  }
  .cifra[data-hl] {
    border-color: color-mix(in srgb, var(--is-accent, #1a6eb0) 45%, var(--is-border-soft, #1f242b));
    background: color-mix(in srgb, var(--is-accent, #1a6eb0) 10%, var(--is-bg-soft, #14181d));
  }
  .cifra-rotulo {
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .cifra-valor {
    font-size: 0.975rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    font-variant-numeric: tabular-nums;
  }
  is-timeline { display: block; }
  .hitos { margin: 0; padding: 0; list-style: none; }
  .hito {
    display: grid;
    align-items: baseline;
    gap: 0.2em 0.9em;
    padding: 0.55em 0;
    border-bottom: 1px solid var(--is-border-soft, #1f242b);
    grid-template-columns: 4.75em 1fr;

    &:last-child { border-bottom: 0; }
  }
  .hora {
    color: var(--tk-link, #6fb2e8);
    font-family: var(--is-font-mono, ui-monospace, Menlo, monospace);
    font-size: 0.8125em;
    font-variant-numeric: tabular-nums;
  }
  .etiqueta { font-size: 0.9em; font-weight: 550; }
  .nota {
    grid-column: 2;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.8125em;
  }
`;

interface Hito {
  readonly id: string;
  readonly label: string;
  readonly date: string;
  readonly hora: string;
  readonly desc: string;
}

const leerHitos = (crudos: readonly unknown[]): Hito[] => crudos.map((raw, i) => {
  const r = rec(raw);
  return {
    id: String(r.key ?? r.id ?? `h${i}`),
    label: String(r.label ?? r.name ?? `Hito ${i + 1}`),
    date: String(r.iso ?? r.date ?? ''),
    hora: String(r.hora ?? ''),
    desc: String(r.nota ?? r.description ?? ''),
  };
}).filter((h) => h.label);

define('tk-timeline', crearBloque(CSS, (root, p) => {
  const src = rec(p.timeline ?? p);
  const hitos = leerHitos(Array.isArray(src.milestones) ? src.milestones
    : Array.isArray(src.events) ? src.events : []);
  const resumen = (Array.isArray(src.resumen) ? src.resumen : []).map(rec);
  if (!hitos.length && !resumen.length) return;

  const titulo = String(src.title ?? p.title ?? '');

  // Con dos o más fechas válidas hay escala real: lo pinta <is-timeline>.
  const conFecha = hitos.filter((h) => h.date && !Number.isNaN(new Date(h.date).getTime()));
  const grafico = conFecha.length >= 2
    ? html`
      <is-timeline color="inline">
        ${jsonScript({
          timeline: {
            title: titulo || undefined,
            orientation: 'vertical',
            events: conFecha.map((h) => ({ id: h.id, label: h.label, date: h.date, desc: h.desc })),
          },
        })}
      </is-timeline>
    `
    : html`
      <ul class="hitos">
        ${hitos.map((h) => html`
          <li class="hito">
            <span class="hora">${h.hora || fecha(h.date)}</span>
            <span class="etiqueta">${h.label}</span>
            ${h.desc && html`<span class="nota">${h.desc}</span>`}
          </li>
        `)}
      </ul>
    `;

  root.append(html`
    ${titulo && html`<h2 class="titulo">${titulo}</h2>`}
    ${resumen.length > 0 && html`
      <div class="resumen">
        ${resumen.map((r) => html`
          <div class="cifra" ${raw(r.highlight === true ? 'data-hl' : '')}>
            <span class="cifra-rotulo">${String(r.label ?? '')}</span>
            <span class="cifra-valor">${String(r.value ?? '—')}</span>
          </div>
        `)}
      </div>
    `}
    ${hitos.length > 0 && grafico}
  `);
}));
