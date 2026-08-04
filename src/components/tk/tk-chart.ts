/**
 * <tk-chart> — bloque `chart`: gráfica de métricas del ticket.
 *
 * Payload: { chart: { type, data: { labels, datasets }, options } }
 *
 * El payload ya tiene forma Chart.js, que es justo lo que consume <is-chart>.
 * Título y subtítulo se sacan de `options.plugins` y se pintan como texto del
 * documento: dentro del SVG no escalan bien ni se pueden seleccionar.
 */

import { blockCss, crearBloque, define, html, jsonScript, rec } from './_shared.js';
const CSS = /* css */ `
  ${blockCss}
  .subtitulo {
    margin: -0.5em 0 0.9em;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.875em;
    line-height: 1.5;
  }
  .marco {
    padding: 0.9em;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: var(--is-bg-soft, #14181d);
  }
  is-chart {
    display: block;
    width: 100%;
    min-height: 16rem;
  }
`;

define('tk-chart', crearBloque(CSS, (root, p) => {
  const config = rec(p.chart ?? p);
  const data = rec(config.data);
  const datasets = Array.isArray(data.datasets) ? data.datasets : [];
  if (!datasets.length) return;

  const plugins = rec(rec(config.options).plugins);
  const titulo = String(p.title ?? rec(plugins.title).text ?? '');
  const subtitulo = String(rec(plugins.subtitle).text ?? '');

  // El título ya está en el documento: se apaga el del SVG para no duplicarlo.
  const configSinTitulos = {
    ...config,
    options: {
      ...rec(config.options),
      plugins: { ...plugins, title: { display: false }, subtitle: { display: false } },
    },
  };

  root.append(html`
    ${titulo && html`<h2 class="titulo">${titulo}</h2>`}
    ${subtitulo && html`<p class="subtitulo">${subtitulo}</p>`}
    <div class="marco">
      <is-chart type="${String(config.type ?? 'bar')}">
        ${jsonScript(configSinTitulos)}
      </is-chart>
    </div>
    ${p.caption && html`<p class="pie">${p.caption}</p>`}
  `);
}));
