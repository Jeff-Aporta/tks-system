/**
 * <tk-image> — bloques `image` e `image-group` del ticket.
 *
 * Payload: { url | src, alt, caption, title }; el grupo trae las imágenes en
 * `blocks[]` y se recibe por la propiedad `bloques`.
 *
 * Al hacer clic la evidencia se abre en <is-lightbox> (zoom y paneo ya
 * resueltos por el kit). La carga es `lazy` y la relación de aspecto se fija
 * al conocerla, para que el documento no salte mientras bajan los pantallazos.
 */

import { blockCss, crearBloque, define, html, rec } from './_shared.js';
const CSS = /* css */ `
  ${blockCss}
  .rejilla {
    display: grid;
    gap: 0.75rem;
    grid-template-columns: repeat(auto-fit, minmax(min(22rem, 100%), 1fr));
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
      height: auto;
      transition: opacity 160ms ease-out;

      &[data-cargando] { opacity: 0; }
    }
    &:hover img { opacity: 0.92; }
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

/** Un solo <is-lightbox> por documento: se reutiliza cambiando su contenido. */
type Lightbox = HTMLElement & { show?: () => void };

const ampliar = (fig: Figura): void => {
  let caja = document.querySelector<Lightbox>('is-lightbox[data-tk]');

  if (!caja) {
    caja = document.createElement('is-lightbox') as Lightbox;
    caja.setAttribute('data-tk', '');
    document.body.append(caja);
  }
  caja.replaceChildren(html`<img src="${fig.url}" alt="${fig.alt}">`);
  if (typeof caja.show === 'function') caja.show();
  else caja.setAttribute('open', '');
};

const figura = (fig: Figura): DocumentFragment => {
  const alCargar = (e: Event): void => {
    const img = e.target as HTMLImageElement;
    img.removeAttribute('data-cargando');
    // Reserva el espacio real una vez conocido: evita saltos en recargas.
    if (img.naturalWidth && img.naturalHeight) {
      img.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
    }
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
        onclick=${() => ampliar(fig)}
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
  const figuras: Figura[] = (hijos.length
    ? hijos.map((b) => leerFigura(rec(b.payload) as TkBlockPayload))
    : [leerFigura(p)]
  ).filter((f): f is Figura => !!f);

  if (!figuras.length) return;

  root.append(html`
    ${p.title && html`<h2 class="titulo">${p.title}</h2>`}
    <div class="${figuras.length > 1 ? 'rejilla' : ''}">
      ${figuras.map(figura)}
    </div>
  `);
}));
