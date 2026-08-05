/**
 * <tk-nav> — panel izquierdo: catálogo de tiquetes públicos.
 *
 * Propiedades
 *   filas         readonly TkTicketRow[]
 *   seleccionado  string  — iticket activo
 *   contexto      'all' | TkSpace  — filtro de espacio (tabs del header)
 *
 * Eventos
 *   tk-seleccion  detail: { iticket, space }
 *
 * Lista plana ordenada por fecha de solicitud descendente. El filtro de
 * contexto lo aplica el shell con tabs; aquí solo se consume.
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
  @media (max-width: 22rem) {
    .fecha { display: none; }
  }
  .punto {
    width: 0.4rem;
    height: 0.4rem;
    flex: none;
    border-radius: 50%;
    background: var(--punto);
  }
  .ambito {
    flex: none;
    padding: 0.05em 0.4em;
    border-radius: 999px;
    background: color-mix(in srgb, var(--is-border-soft, #1f242b) 80%, transparent);
    color: var(--is-text-soft, #c3ced9);
    font-family: var(--is-font-sans, system-ui, sans-serif);
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
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
  'isp-svelte': 'ISP Svelte',
};

/** ¿Pertenece al espacio virtual ISP-SvelteComponents? */
const esIspSvelte = (f: TkTicketRow): boolean => {
  if (String(f.space) === 'isp-svelte') return true;
  if (/^TK-ISP-/i.test(String(f.iticket ?? ''))) return true;
  const blob = `${f.titulo ?? ''} ${f.resumen ?? ''}`;
  return /isp[\s-]?svelte/i.test(blob) || /ispsveltecomponents/i.test(blob);
};

type TkContexto = 'all' | TkSpace;

const porFechaDesc = (a: TkTicketRow, b: TkTicketRow): number =>
  String(b.fechasolicitud ?? '').localeCompare(String(a.fechasolicitud ?? ''));

class TkNav extends HTMLElement {
  #filas: readonly TkTicketRow[] = [];
  #seleccionado = '';
  #busqueda = '';
  #contexto: TkContexto = 'all';
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

  get contexto(): TkContexto { return this.#contexto; }
  set contexto(v: TkContexto | string) {
    const next = (v === 'patyia' || v === 'clientesis' || v === 'isp-svelte' ? v : 'all') as TkContexto;
    if (this.#contexto === next) return;
    this.#contexto = next;
    if (this.isConnected) this.#render();
  }

  /** Cambiar de selección no debe repintar la lista entera ni perder el scroll. */
  #pintarSeleccion(): void {
    for (const b of this.#root.querySelectorAll<HTMLElement>('.tk')) {
      b.setAttribute('aria-current', String(b.dataset.tk === this.#seleccionado));
    }
  }

  #filtradas(): readonly TkTicketRow[] {
    const q = this.#busqueda.trim().toLowerCase();
    const ctx = this.#contexto;
    return [...this.#filas]
      .filter((f) => {
        if (ctx === 'all') return true;
        if (ctx === 'isp-svelte') return esIspSvelte(f);
        return String(f.space) === ctx;
      })
      .filter((f) => {
        if (!q) return true;
        return [f.iticket, f.titulo, f.resumen]
          .some((c) => String(c ?? '').toLowerCase().includes(q));
      })
      .sort(porFechaDesc);
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
    const mostrarAmbito = this.#contexto === 'all';

    if (!filas.length) {
      return html`
        <div class="lista">
          <p class="vacio">
            ${this.#filas.length ? 'Ningún tiquete coincide con el filtro.' : 'Cargando tiquetes…'}
          </p>
        </div>
      `;
    }

    return html`
      <div class="lista">
        ${filas.map((f) => html`
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
              ${mostrarAmbito
                ? html`<span class="ambito">${ETIQUETA[String(f.space)] ?? f.space}</span>`
                : null}
              ${f.fechasolicitud
                ? html`<span class="fecha">${fecha(f.fechasolicitud)}</span>`
                : null}
            </span>
            <span class="titulo">${String(f.titulo ?? 'Sin título')}</span>
          </button>
        `)}
      </div>
    `;
  }
}

define('tk-nav', TkNav);
