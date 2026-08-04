/**
 * <tk-view> — documento completo de un tiquete a partir de su JSON.
 *
 * Propiedades
 *   ticket    TkTicket        — ticket ya normalizado por la capa de datos
 *   embebido  boolean (attr)  — sin acciones de compartir/descargar
 *
 * Es el componente que se "quema" en el HTML descargable: recibe el JSON y
 * construye toda la vista. Todo lo demás del visor (panel, cabecera, caché)
 * es prescindible para leer un tiquete.
 *
 * Los bloques se agrupan por `docLane` en secciones con título. Un bloque sin
 * carril cae en «Detalle», nunca se descarta.
 */

import { css, define, html, rec } from './_shared.js';
const CSS = /* css */ `
  :host {
    display: block;
    container-type: inline-size;
    --tk-measure: 68ch;
    color: var(--is-text, #e6edf3);
    font-family: var(--is-font-sans, system-ui, -apple-system, "Segoe UI", sans-serif);
  }
  .documento {
    display: grid;
    gap: 2rem;
    max-width: 54rem;
    margin: 0 auto;
    padding: clamp(1.15rem, 0.55rem + 1.8vw, 2.25rem) clamp(1rem, 0.5rem + 1.6vw, 2rem);
  }
  .encabezado { min-width: 0; }
  section {
    display: grid;
    gap: 1rem;
    padding-top: 0.15rem;
  }
  .rotulo {
    display: flex;
    align-items: center;
    gap: 0.75em;
    margin: 0 0 0.15rem;
    color: var(--is-text-soft, #c3ced9);
    font-size: 0.72rem;
    font-weight: 650;
    letter-spacing: 0.11em;
    text-transform: uppercase;
  }
  .rotulo::after {
    height: 1px;
    flex: 1;
    background: linear-gradient(
      to right,
      var(--is-border, #2a3038),
      transparent
    );
    content: "";
  }
  .vacio {
    display: grid;
    gap: 0.6rem;
    padding: 3rem 1rem;
    color: var(--is-text-muted, #9aa7b4);
    text-align: center;
  }
  .firma {
    margin-top: 0.5rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--is-border-soft, #1f242b);
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.75rem;
    line-height: 1.5;
  }
`;
/** Orden de lectura del documento. El de la BD es de escritura, no de lectura. */
const SECCIONES: ReadonlyArray<{ lane: TkDocLane; rotulo: string }> = [
  { lane: 'solicitud', rotulo: 'Solicitud' },
  { lane: 'evidencias', rotulo: 'Evidencias' },
  { lane: 'causa', rotulo: 'Causa' },
  { lane: 'solucion', rotulo: 'Solución' },
  { lane: 'verificacion', rotulo: 'Verificación' },
  { lane: 'otros', rotulo: 'Detalle' },
];

/** Bloques del ticket: `content[]`, o `doc.blocks` en documentos antiguos. */
const bloquesDe = (tk: TkTicket): TkBlock[] => {
  const propios = Array.isArray(tk.content) && tk.content.length
    ? [...tk.content]
    : [...(tk.doc?.blocks ?? [])];
  const deContextos = (tk.contexts ?? []).flatMap((c) => [...(c.content ?? [])]);
  return [...propios, ...deContextos]
    .filter((b) => b && typeof b === 'object')
    .sort((a, b) => (a.sortKey ?? 0) - (b.sortKey ?? 0));
};

const carril = (b: TkBlock): TkDocLane =>
  (rec(b.payload).docLane as TkDocLane) ?? 'otros';

class TkView extends HTMLElement {
  static get observedAttributes(): string[] { return ['embebido']; }

  #ticket: TkTicket | null = null;
  #root: ShadowRoot;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
    css(this.#root, CSS);
  }

  connectedCallback(): void { this.#render(); }
  attributeChangedCallback(): void { if (this.isConnected) this.#render(); }

  get ticket(): TkTicket | null { return this.#ticket; }
  set ticket(v: TkTicket | null) {
    this.#ticket = v;
    if (this.isConnected) this.#render();
  }

  /** Acepta el JSON tal como llega del worker o del HTML descargado. */
  set json(v: unknown) {
    const r = rec(v);
    this.ticket = (r.ticket ? r.ticket : r) as TkTicket;
  }

  get embebido(): boolean { return this.hasAttribute('embebido'); }
  set embebido(v: boolean) { this.toggleAttribute('embebido', !!v); }

  #render(): void {
    while (this.#root.firstChild) this.#root.removeChild(this.#root.firstChild);
    const tk = this.#ticket;

    if (!tk?.iticket) {
      this.#root.append(html`
        <div class="vacio">
          <is-icon icon="mdi:file-document-outline" style="font-size:2rem" aria-hidden="true"></is-icon>
          <p>Selecciona un tiquete para ver su documentación.</p>
        </div>
      `);
      return;
    }

    const bloques = bloquesDe(tk);
    const acciones = this.embebido
      ? null
      : Object.assign(document.createElement('tk-actions'), { ticket: tk });
    const cabecera = Object.assign(document.createElement('tk-ticket-head'), {
      ticket: tk,
      acciones,
    });

    const secciones = SECCIONES.map(({ lane, rotulo }) => {
      const propios = bloques.filter((b) => carril(b) === lane);
      if (!propios.length) return null;

      return html`
        <section aria-label="${rotulo}">
          <h2 class="rotulo">${rotulo}</h2>
          ${propios.map((b) => Object.assign(document.createElement('tk-block'), { bloque: b }))}
        </section>
      `;
    }).filter(Boolean);

    this.#root.append(html`
      <article class="documento">
        <header class="encabezado">${cabecera}</header>
        ${secciones.length > 0 ? secciones : html`
          <is-callout color="neutral" icon="mdi:text-box-remove-outline">
            Este tiquete todavía no tiene documentación publicada.
          </is-callout>
        `}
        <footer class="firma">
          ${tk.iticket} · ${tk.space === 'patyia' ? 'PatyIA' : 'Clientes'} ·
          documentación generada desde jagudeloe-tks
        </footer>
      </article>
    `);  }
}

define('tk-view', TkView);
