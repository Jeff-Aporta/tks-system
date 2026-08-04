/**
 * <tk-diagram> — bloque `diagram`: diagrama declarado en fuente Mermaid.
 *
 * Payload: { engine, source, sourceDark?, alt, caption }
 *
 * Mermaid no se empaqueta: el diagrama se pide renderizado a mermaid.ink, que
 * es lo que ya hacen los README del ecosistema. Así el HTML descargable no
 * arrastra un motor de cientos de kB, y si el servicio no responde queda la
 * fuente visible y copiable — que es la documentación real del diagrama.
 *
 * `sourceDark` permite una variante por tema; si falta, se usa `source`.
 */

import { b64url, blockCss, crearBloque, define, html } from './_shared.js';
const CSS = /* css */ `
  ${blockCss}
  .marco {
    display: grid;
    justify-items: center;
    padding: 1em;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: var(--is-bg-soft, #14181d);
  }
  img { max-width: 100%; height: auto; }
  is-details { display: block; margin-top: 0.6em; font-size: 0.8125em; }
  pre {
    margin: 0;
    overflow-x: auto;
    font-family: var(--is-font-mono, ui-monospace, Menlo, monospace);
    font-size: 0.95em;
    line-height: 1.6;
    color: var(--is-text-soft, #c3ced9);
  }
  .fallo {
    padding: 1.2em;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.8125em;
    text-align: center;
  }
`;

const RENDER = 'https://mermaid.ink/svg/';

const temaOscuro = (): boolean => document.documentElement.dataset.theme !== 'light';

define('tk-diagram', crearBloque(CSS, (root, p) => {
  const oscuro = temaOscuro();
  const fuente = String((oscuro && p.sourceDark) || p.source || '').trim();
  if (!fuente) return;

  const motor = String(p.engine ?? 'mermaid').toLowerCase();
  // El tema se inyecta como directiva init para que el SVG llegue ya acorde.
  const conTema = /^\s*%%\{/.test(fuente)
    ? fuente
    : `%%{init: {"theme": "${oscuro ? 'dark' : 'default'}"}}%%\n${fuente}`;

  const alFallar = (e: Event): void => {
    const img = e.target as HTMLImageElement;
    img.replaceWith(html`
      <p class="fallo">El servicio de diagramas no respondió. La fuente está abajo.</p>
    `);
    root.querySelector('is-details')?.setAttribute('open', '');
  };

  root.append(html`
    ${p.title && html`<h2 class="titulo">${p.title}</h2>`}
    <div class="marco">
      ${motor === 'mermaid' ? html`
        <img
          src="${RENDER + b64url.encode(conTema)}"
          alt="${String(p.alt ?? p.caption ?? 'Diagrama del tiquete')}"
          loading="lazy"
          decoding="async"
          onerror=${alFallar}
        >
      ` : html`
        <p class="fallo">Motor de diagrama no soportado: ${motor}.</p>
      `}
    </div>
    ${p.caption && html`<p class="pie">${p.caption}</p>`}
    <is-details summary="Fuente ${motor}" variant="filled-outlined">
      <pre><code>${fuente}</code></pre>
    </is-details>
  `);
}));
