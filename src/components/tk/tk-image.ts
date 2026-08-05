/**
 * <tk-image> — bloques `image` e `image-group` del ticket.
 *
 * Al hacer clic abre un lightbox propio (oscuro, centrado, teclado Esc /
 * flechas si hay varias), sin depender del zoom básico de <is-lightbox>.
 */

import { blockCss, crearBloque, define, html, rec } from './_shared.js';

const CSS = /* css */ `
  ${blockCss}
  /* auto-fill (no auto-fit): con una sola evidencia la miniatura ocupa una
     columna, no el ancho completo del documento. El detalle está en el lightbox. */
  .rejilla {
    display: grid;
    gap: 0.75rem;
    grid-template-columns: repeat(auto-fill, minmax(min(14rem, 100%), 1fr));
  }
  figure {
    margin: 0;
    overflow: hidden;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: var(--is-bg-soft, #14181d);
  }
  .lienzo {
    display: block;
    width: 100%;
    padding: 0;
    border: 0;
    background: var(--is-code-bg, #0f1318);
    cursor: zoom-in;
    line-height: 0;

    img {
      display: block;
      width: 100%;
      height: var(--tk-image-alto, 9.5rem);
      object-fit: cover;
      object-position: top center;
      transition: opacity 160ms ease-out, transform 220ms ease;

      &[data-cargando] { opacity: 0; }
    }
    &:hover img { opacity: 0.92; transform: scale(1.01); }
    &:focus-visible {
      outline: 2px solid var(--is-focus, #4c9be8);
      outline-offset: -2px;
    }
  }
  figcaption {
    padding: 0.55em 0.8em;
    border-top: 1px solid var(--is-border-soft, #1f242b);
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.8125em;
    line-height: 1.5;
  }
  .rota {
    padding: 1.2em;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.8125em;
    text-align: center;
  }
`;

const LB_CSS = /* css */ `
  :host {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: grid;
    place-items: center;
    padding: clamp(0.75rem, 2vw, 1.5rem);
    background:
      radial-gradient(ellipse 70% 55% at 50% 42%, rgb(15 23 42 / 35%), transparent 70%),
      rgb(2 6 14 / 82%);
    backdrop-filter: blur(10px) saturate(1.15);
    -webkit-backdrop-filter: blur(10px) saturate(1.15);
    opacity: 0;
    pointer-events: none;
    transition: opacity 180ms ease;
    font-family: var(--is-font-sans, system-ui, sans-serif);
  }
  :host([open]) {
    opacity: 1;
    pointer-events: auto;
  }
  .marco {
    position: relative;
    display: grid;
    gap: 0.65rem;
    width: min(96vw, 72rem);
    max-height: min(92dvh, 56rem);
    justify-items: center;
  }
  .foto {
    display: block;
    max-width: 100%;
    max-height: min(82dvh, 50rem);
    object-fit: contain;
    border-radius: 0.75rem;
    box-shadow:
      0 0 0 1px rgb(255 255 255 / 8%),
      0 24px 64px rgb(0 0 0 / 55%);
    background: #0a0f18;
  }
  .leyenda {
    max-width: 48rem;
    color: rgb(226 232 240 / 88%);
    font-size: 0.875rem;
    line-height: 1.5;
    text-align: center;
    text-wrap: pretty;
  }
  .cerrar,
  .nav {
    position: absolute;
    display: grid;
    place-items: center;
    width: 2.5rem;
    height: 2.5rem;
    border: 1px solid rgb(255 255 255 / 14%);
    border-radius: 999px;
    background: rgb(15 23 42 / 72%);
    color: #e2e8f0;
    cursor: pointer;
    transition: background 140ms ease, transform 140ms ease;
  }
  .cerrar:hover,
  .nav:hover {
    background: rgb(30 41 59 / 88%);
    transform: scale(1.04);
  }
  .cerrar {
    top: -0.35rem;
    right: -0.15rem;
  }
  .nav.prev { left: -0.25rem; top: 50%; transform: translateY(-50%); }
  .nav.next { right: -0.25rem; top: 50%; transform: translateY(-50%); }
  .nav.prev:hover,
  .nav.next:hover { transform: translateY(-50%) scale(1.04); }
  .contador {
    position: absolute;
    top: -0.25rem;
    left: 0;
    color: rgb(148 163 184 / 95%);
    font-size: 0.75rem;
    font-variant-numeric: tabular-nums;
  }
  @media (max-width: 40rem) {
    .nav.prev { left: 0.15rem; }
    .nav.next { right: 0.15rem; }
    .cerrar { top: 0.15rem; right: 0.15rem; }
  }
`;

interface Figura {
  readonly url: string;
  readonly alt: string;
  readonly caption: string;
}

const leerFigura = (p: TkBlockPayload): Figura | null => {
  const url = String(p.url ?? p.src ?? '').trim();
  if (!url) return null;
  return {
    url,
    alt: String(p.alt ?? p.caption ?? p.title ?? 'Evidencia del tiquete'),
    caption: String(p.caption ?? ''),
  };
};

class TkLightbox extends HTMLElement {
  #root: ShadowRoot;
  #figs: Figura[] = [];
  #idx = 0;
  #onKey = (e: KeyboardEvent): void => {
    if (!this.hasAttribute('open')) return;
    if (e.key === 'Escape') this.cerrar();
    else if (e.key === 'ArrowRight') this.#ir(1);
    else if (e.key === 'ArrowLeft') this.#ir(-1);
  };

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(LB_CSS);
    this.#root.adoptedStyleSheets = [sheet];
  }

  connectedCallback(): void {
    document.addEventListener('keydown', this.#onKey);
    this.addEventListener('click', (e) => {
      if (e.target === this) this.cerrar();
    });
  }
  disconnectedCallback(): void {
    document.removeEventListener('keydown', this.#onKey);
  }

  abrir(figs: Figura[], idx = 0): void {
    this.#figs = figs;
    this.#idx = Math.max(0, Math.min(idx, figs.length - 1));
    this.setAttribute('open', '');
    this.#pintar();
    queueMicrotask(() => (this.#root.querySelector('.cerrar') as HTMLElement | null)?.focus());
  }

  cerrar(): void {
    this.removeAttribute('open');
  }

  #ir(delta: number): void {
    if (this.#figs.length < 2) return;
    this.#idx = (this.#idx + delta + this.#figs.length) % this.#figs.length;
    this.#pintar();
  }

  #pintar(): void {
    const fig = this.#figs[this.#idx];
    if (!fig) return;
    const multi = this.#figs.length > 1;
    while (this.#root.firstChild) this.#root.removeChild(this.#root.firstChild);

    this.#root.append(html`
      <div class="marco" role="dialog" aria-modal="true" aria-label="${fig.alt}">
        ${multi ? html`<span class="contador">${this.#idx + 1} / ${this.#figs.length}</span>` : null}
        <button class="cerrar" type="button" aria-label="Cerrar" onclick=${() => this.cerrar()}>
          <is-icon icon="mdi:close" aria-hidden="true"></is-icon>
        </button>
        ${multi ? html`
          <button class="nav prev" type="button" aria-label="Anterior" onclick=${() => this.#ir(-1)}>
            <is-icon icon="mdi:chevron-left" aria-hidden="true"></is-icon>
          </button>
          <button class="nav next" type="button" aria-label="Siguiente" onclick=${() => this.#ir(1)}>
            <is-icon icon="mdi:chevron-right" aria-hidden="true"></is-icon>
          </button>
        ` : null}
        <img class="foto" src="${fig.url}" alt="${fig.alt}">
        ${(fig.caption || fig.alt) ? html`<p class="leyenda">${fig.caption || fig.alt}</p>` : null}
      </div>
    `);
  }
}

if (!customElements.get('tk-lightbox')) {
  customElements.define('tk-lightbox', TkLightbox);
}

const lightbox = (): TkLightbox => {
  let caja = document.querySelector<TkLightbox>('tk-lightbox');
  if (!caja) {
    caja = document.createElement('tk-lightbox') as TkLightbox;
    document.body.append(caja);
  }
  return caja;
};

/** La misma URL en varios bloques del payload es una sola evidencia. */
const unicas = (figs: Figura[]): Figura[] => {
  const vistas = new Set<string>();
  return figs.filter((f) => {
    const clave = f.url.split('?')[0] ?? f.url;
    if (vistas.has(clave)) return false;
    vistas.add(clave);
    return true;
  });
};

const figura = (fig: Figura, todas: Figura[], idx: number): DocumentFragment => {
  const alCargar = (e: Event): void => {
    (e.target as HTMLImageElement).removeAttribute('data-cargando');
  };

  const alFallar = (e: Event): void => {
    const img = e.target as HTMLImageElement;
    (img.closest('.lienzo') ?? img).replaceWith(html`
      <p class="rota">La evidencia ya no está disponible.</p>
    `);
  };

  return html`
    <figure>
      <button
        class="lienzo"
        type="button"
        aria-label="Ampliar: ${fig.alt}"
        onclick=${() => lightbox().abrir(todas, idx)}
      >
        <img
          src="${fig.url}"
          alt="${fig.alt}"
          loading="lazy"
          decoding="async"
          data-cargando
          onload=${alCargar}
          onerror=${alFallar}
        >
      </button>
      ${fig.caption && html`<figcaption>${fig.caption}</figcaption>`}
    </figure>
  `;
};

define('tk-image', crearBloque(CSS, (root, p, host) => {
  const hijos = (host as HTMLElement & { bloques?: readonly TkBlock[] }).bloques ?? [];
  const figuras: Figura[] = unicas((hijos.length
    ? hijos.map((b) => leerFigura(rec(b.payload) as TkBlockPayload))
    : [leerFigura(p)]
  ).filter((f): f is Figura => !!f));

  if (!figuras.length) return;

  root.append(html`
    ${p.title && html`<h2 class="titulo">${p.title}</h2>`}
    <div class="rejilla">
      ${figuras.map((f, i) => figura(f, figuras, i))}
    </div>
  `);
}));
