/**
 * <tk-view> — documento completo de un tiquete a partir de su JSON.
 *
 * Propiedades
 *   ticket    TkTicket        — ticket ya normalizado por la capa de datos
 *   embebido  boolean (attr)  — sin acciones de compartir/descargar
 *
 * Es el componente que se "quema" en el HTML descargable: recibe el JSON y
 * construye toda la vista. Las acciones viven en el header de <tk-app>.
 *
 * Los bloques se agrupan por `docLane` en secciones con título. Un bloque sin
 * carril cae en «Detalle», nunca se descarta. Commits y tiempos InSoft van
 * al final (mismo JSON del tk: `rootCommits` / `tiempos`).
 */

import { css, define, html, rec } from './_shared.js';

const CSS = /* css */ `
  :host {
    display: block;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    container-type: inline-size;
    --tk-measure: 78ch;
    color: var(--is-text, #e6edf3);
    font-family: var(--is-font-sans, system-ui, -apple-system, "Segoe UI", sans-serif);
    overflow-wrap: break-word;
  }
  .documento {
    display: grid;
    gap: clamp(1.35rem, 1rem + 1.5vw, 2rem);
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    margin: 0;
    padding: clamp(0.9rem, 0.4rem + 1.6vw, 2.25rem) clamp(0.85rem, 0.4rem + 1.8vw, 2.5rem);
  }
  .encabezado,
  section,
  tk-ticket-head,
  tk-block,
  tk-commits,
  tk-tiempos {
    min-width: 0;
    max-width: 100%;
  }
  section {
    display: grid;
    gap: 0.9rem;
    padding-top: 0.15rem;
  }
  @container (max-width: 36rem) {
    .documento {
      gap: 1.25rem;
      padding-inline: 0.85rem;
    }
  }
  .rotulo {
    display: flex;
    align-items: center;
    gap: 0.75em;
    margin: 0 0 0.15rem;
    min-width: 0;
    color: var(--is-text-soft, #c3ced9);
    font-size: 0.72rem;
    font-weight: 650;
    letter-spacing: 0.11em;
    text-transform: uppercase;
  }
  .rotulo::after {
    height: 1px;
    flex: 1;
    min-width: 1rem;
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
    overflow-wrap: anywhere;
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

const carrilDe = (b: TkBlock, sticky: TkDocLane): TkDocLane => {
  const p = rec(b.payload);
  const explicit = String(p.docLane ?? p.section ?? p.lane ?? '').trim().toLowerCase();
  if (
    explicit === 'solicitud' ||
    explicit === 'evidencias' ||
    explicit === 'causa' ||
    explicit === 'solucion' ||
    explicit === 'verificacion' ||
    explicit === 'otros'
  ) {
    return explicit;
  }

  const title = String(p.title ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');

  if (/^solicitud|^objetivo|requerimiento insoft|^requerimiento\b/.test(title)) return 'solicitud';
  if (/^evidencia|informacion del tiquete|pantallazo|captura/.test(title)) return 'evidencias';
  if (/hipotesis|causa identificada|causa del problema|^causa\b|antecedente|analisis realizado|diagnostico|raiz del problema/.test(title)) {
    return 'causa';
  }
  if (/verificacion\b|validacion\b|investigacion y pruebas|como probar|pruebas realizadas/.test(title)) {
    return 'verificacion';
  }
  if (
    /solucion aplicada|solucion entregada|^solucion\b|cambios en base de datos|resultado\b|conclusion|catalogo por tipo|resumen de tiempos/.test(
      title,
    )
  ) {
    return 'solucion';
  }

  const kind = String(b.kind ?? '').toLowerCase();
  if (kind === 'html' || kind === 'image' || kind === 'image-group') {
    return sticky === 'otros' ? 'evidencias' : sticky;
  }
  if (kind === 'badge' || kind === 'badges') return sticky === 'otros' ? 'solicitud' : sticky;
  if (kind === 'code' || kind === 'sql' || kind === 'cambio-bd' || kind === 'file-tree') {
    return sticky === 'otros' ? 'solucion' : sticky;
  }
  if (kind === 'steps' || kind === 'stepper') {
    return sticky === 'otros' ? 'verificacion' : sticky;
  }
  if (kind === 'table' && sticky === 'otros') return 'evidencias';
  if (kind === 'markdown' || kind === 'md' || kind === 'text') {
    return title ? 'otros' : sticky;
  }
  if (title) return 'otros';
  // Kinds desconocidos sin carril explícito → Detalle (no heredar sticky).
  return 'otros';
};

const bloquesConCarril = (bloques: TkBlock[]): Array<{ b: TkBlock; lane: TkDocLane }> => {
  let sticky: TkDocLane = 'solicitud';
  return bloques.map((b) => {
    const lane = carrilDe(b, sticky);
    sticky = lane;
    return { b, lane };
  });
};

const commitsDe = (tk: TkTicket): TkCommit[] => {
  const root = [...(tk.rootCommits ?? [])];
  if (root.length) return root;
  return (tk.contexts ?? []).flatMap((c) => [...(c.commits ?? [])]);
};

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

    const bloques = bloquesConCarril(bloquesDe(tk));
    const cabecera = Object.assign(document.createElement('tk-ticket-head'), { ticket: tk });
    const commits = commitsDe(tk);
    const tiempos = [...(tk.tiempos ?? [])].filter((t) => Number(t.minutos ?? 0) > 0);

    const secciones = SECCIONES.map(({ lane, rotulo }) => {
      const propios = bloques.filter((x) => x.lane === lane).map((x) => x.b);
      if (!propios.length) return null;

      return html`
        <section aria-label="${rotulo}">
          <h2 class="rotulo">${rotulo}</h2>
          ${propios.map((b) => Object.assign(document.createElement('tk-block'), { bloque: b }))}
        </section>
      `;
    }).filter(Boolean);

    const seccionCommits = commits.length
      ? html`
        <section aria-label="Commits">
          <h2 class="rotulo">Commits</h2>
          ${Object.assign(document.createElement('tk-commits'), { commits })}
        </section>
      `
      : null;

    const seccionTiempos = tiempos.length
      ? html`
        <section aria-label="Tiempos InSoft">
          <h2 class="rotulo">Tiempos InSoft</h2>
          ${Object.assign(document.createElement('tk-tiempos'), { tiempos })}
        </section>
      `
      : null;

    this.#root.append(html`
      <article class="documento">
        <header class="encabezado">${cabecera}</header>
        ${secciones.length > 0 ? secciones : html`
          <is-callout color="neutral" icon="mdi:text-box-remove-outline">
            Este tiquete todavía no tiene documentación publicada.
          </is-callout>
        `}
        ${seccionCommits}
        ${seccionTiempos}
        <footer class="firma">
          ${tk.iticket} · ${tk.space === 'patyia' ? 'PatyIA' : 'Clientes'} ·
          documentación generada desde jagudeloe-tks
        </footer>
      </article>
    `);
  }
}

define('tk-view', TkView);
