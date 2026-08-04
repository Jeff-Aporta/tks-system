/**
 * <tk-nav> — panel izquierdo: catálogo de tiquetes públicos.
 *
 * Propiedades
 *   filas         readonly TkTicketRow[]
 *   seleccionado  string  — iticket activo
 *
 * Eventos
 *   tk-seleccion  detail: { iticket, space }
 *
 * Agrupa por espacio y ordena por fecha descendente, que es como se busca un
 * tiquete: «el de la semana pasada de PatyIA». El filtro es por texto libre
 * sobre código, título y resumen — el mismo criterio que aplica el worker.
 */

import { css, define, estadoColor, fecha, html } from '../tk/_shared.js';
const CSS = /* css */ `
  :host {
    display: flex;
    overflow: hidden;
    min-height: 0;
    flex-direction: column;
    color: var(--is-text, #e6edf3);
    font-family: var(--is-font-sans, system-ui, -apple-system, "Segoe UI", sans-serif);
  }
  .buscador {
    flex: none;
    padding: 0.8rem 0.75rem 0.55rem;
  }
  .lista {
    overflow-y: auto;
    min-height: 0;
    flex: 1;
    padding: 0 0.45rem 1rem;
    scrollbar-width: thin;
  }
  .grupo {
    position: sticky;
    top: 0;
    z-index: 1;
    padding: 0.95rem 0.55rem 0.45rem;
    backdrop-filter: blur(8px);
    background: color-mix(in srgb, var(--is-bg, #0b0d10) 82%, transparent);
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.6875rem;
    font-weight: 650;
    letter-spacing: 0.11em;
    text-transform: uppercase;
  }
  .grupo span { color: var(--is-text-soft, #c3ced9); font-weight: 500; }
  .tk {
    display: grid;
    width: 100%;
    gap: 0.3rem;
    margin: 0 0 0.2rem;
    padding: 0.65rem 0.7rem;
    border: 1px solid transparent;
    border-radius: 0.5rem;
    background: none;
    color: inherit;
    cursor: pointer;
    font: inherit;
    text-align: left;
    transition: background-color 130ms ease-out, border-color 130ms ease-out;

    &:hover { background: color-mix(in srgb, var(--is-accent, #1a6eb0) 10%, transparent); }
    &:focus-visible {
      outline: 2px solid var(--is-focus, #4c9be8);
      outline-offset: -2px;
    }
    &[aria-current="true"] {
      border-color: color-mix(in srgb, var(--is-accent, #1a6eb0) 55%, transparent);
      background: color-mix(in srgb, var(--is-accent, #1a6eb0) 16%, transparent);

      .titulo { font-weight: 600; }
    }
  }
  .meta {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    min-width: 0;
    color: var(--is-text-muted, #9aa7b4);
    font-family: var(--is-font-mono, ui-monospace, Menlo, monospace);
    font-size: 0.6875rem;
    letter-spacing: 0.03em;
  }
  .codigo {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .fecha {
    margin-left: auto;
    flex: none;
    opacity: 0.88;
    font-variant-numeric: tabular-nums;
  }
  .punto {
    width: 0.4rem;
    height: 0.4rem;
    flex: none;
    border-radius: 50%;
    background: var(--punto);
  }
  .titulo {
    display: -webkit-box;
    overflow: hidden;
    padding-left: calc(0.4rem + 0.45rem);
    font-size: 0.8125rem;
    line-height: 1.4;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .vacio {
    padding: 2rem 1rem;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.8125rem;
    text-align: center;
  }
`;

const PUNTOS: Readonly<Record<string, string>> = {
  success: 'var(--is-color-success-500, #2f9e44)',
  warning: 'var(--is-color-warning-500, #f08c00)',
  info: 'var(--is-accent, #1a6eb0)',
  neutral: 'var(--is-text-muted, #9aa7b4)',
};

const ETIQUETA: Readonly<Record<string, string>> = {
  patyia: 'PatyIA',
  clientesis: 'Clientes',
};

class TkNav extends HTMLElement {
  #filas: readonly TkTicketRow[] = [];
  #seleccionado = '';
  #busqueda = '';
  #root: ShadowRoot;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
    css(this.#root, CSS);
  }

  connectedCallback(): void { this.#render(); }

  get filas(): readonly TkTicketRow[] { return this.#filas; }
  set filas(v: readonly TkTicketRow[]) {
    this.#filas = v ?? [];
    if (this.isConnected) this.#render();
  }

  get seleccionado(): string { return this.#seleccionado; }
  set seleccionado(v: string) {
    if (this.#seleccionado === v) return;
    this.#seleccionado = v ?? '';
    if (this.isConnected) this.#pintarSeleccion();
  }

  /** Cambiar de selección no debe repintar la lista entera ni perder el scroll. */
  #pintarSeleccion(): void {
    for (const b of this.#root.querySelectorAll<HTMLElement>('.tk')) {
      b.setAttribute('aria-current', String(b.dataset.tk === this.#seleccionado));
    }
  }

  #filtradas(): readonly TkTicketRow[] {
    const q = this.#busqueda.trim().toLowerCase();
    if (!q) return this.#filas;
    return this.#filas.filter((f) => [f.iticket, f.titulo, f.resumen]
      .some((c) => String(c ?? '').toLowerCase().includes(q)));
  }

  #elegir(fila: TkTicketRow): void {
    this.dispatchEvent(new CustomEvent('tk-seleccion', {
      detail: { iticket: fila.iticket, space: fila.space },
      bubbles: true,
      composed: true,
    }));
  }

  #render(): void {
    while (this.#root.firstChild) this.#root.removeChild(this.#root.firstChild);

    // `is-input` es el evento del kit; el `input` nativo no cruza su shadow DOM.
    const alBuscar = (e: Event): void => {
      this.#busqueda = String((e.target as HTMLInputElement).value ?? '');
      const lista = this.#root.querySelector('.lista');
      if (lista) lista.replaceWith(this.#lista());
    };

    this.#root.append(html`
      <div class="buscador">
        <is-input
          type="search"
          placeholder="Buscar tiquete…"
          value="${this.#busqueda}"
          onis-input=${alBuscar}
        >
          <is-icon slot="start" icon="mdi:magnify" aria-hidden="true"></is-icon>
        </is-input>
      </div>
      ${this.#lista()}
    `);
  }

  #lista(): DocumentFragment {
    const filas = this.#filtradas();
    const porEspacio = new Map<string, TkTicketRow[]>();
    for (const f of filas) {
      const clave = String(f.space ?? 'otros');
      if (!porEspacio.has(clave)) porEspacio.set(clave, []);
      porEspacio.get(clave)!.push(f);
    }

    if (!filas.length) {
      return html`
        <div class="lista">
          <p class="vacio">
            ${this.#filas.length ? 'Ningún tiquete coincide con la búsqueda.' : 'Cargando tiquetes…'}
          </p>
        </div>
      `;
    }

    return html`
      <div class="lista">
        ${[...porEspacio.entries()].map(([space, grupo]) => html`
          <p class="grupo">${ETIQUETA[space] ?? space} <span>${grupo.length}</span></p>
          ${grupo.map((f) => html`
            <button
              class="tk"
              type="button"
              data-tk="${f.iticket}"
              aria-current="${String(f.iticket === this.#seleccionado)}"
              onclick=${() => this.#elegir(f)}
            >
              <span class="meta">
                <span
                  class="punto"
                  style="--punto: ${PUNTOS[estadoColor(f.estado)]!}"
                  aria-hidden="true"
                ></span>
                <span class="codigo">${f.iticket}</span>
                ${f.fechaSolicitud
                  ? html`<span class="fecha">${fecha(f.fechaSolicitud)}</span>`
                  : null}
              </span>
              <span class="titulo">${String(f.titulo ?? 'Sin título')}</span>
            </button>
          `)}
        `)}
      </div>
    `;
  }
}

define('tk-nav', TkNav);
