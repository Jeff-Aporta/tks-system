/**
 * <tk-view> — documento completo de un tiquete a partir de su JSON.
 *
 * Propiedades
 *   ticket    TkTicket
 *   embebido  boolean (attr)  — sin acciones de compartir/descargar
 *   modo      'doc' | 'metrics' (attr) — dimensión activa
 *
 * Dos dimensiones visuales:
 *   - doc      — diligen cia / solución (bloques, commits)
 *   - metrics  — estudio InSoft (KPIs, tiempos hábiles)
 *
 * Un botón flotante intercambia el modo.
 */

import { css, define, html, rec } from './_shared.js';
// Dependencias de createElement: sin import, el tag queda sin upgrade en el shell.
import './tk-metrics.js';
import './tk-ticket-head.js';
import './tk-commits.js';
import './tk-block.js';

type TkVistaModo = 'doc' | 'metrics';

const CSS = /* css */ `
  :host {
    display: block;
    position: relative;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    container-type: inline-size;
    /* Sin medida de lectura: el documento ocupa todo el ancho del visor. Con un
       tope en unidades ch quedaba una franja muerta a la derecha. */
    --tk-measure: 100%;
    /* Video: tope legible centrado — 100% se comía la columna (TK view). */
    --tk-video-max: 36rem;
    color: var(--is-text, #e6edf3);
    font-family: var(--is-font-sans, system-ui, -apple-system, "Segoe UI", sans-serif);
    overflow-wrap: break-word;
  }
  .shell {
    position: relative;
    min-width: 0;
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
  tk-metrics {
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
    color: var(--is-text, #e6edf3);
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
    color: var(--is-text, #e6edf3);
    text-align: center;
  }
  .firma {
    margin-top: 0.5rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--is-border-soft, #1f242b);
    color: var(--is-text, #e6edf3);
    font-size: 0.75rem;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }
  .fab {
    position: sticky;
    bottom: 1.15rem;
    z-index: 6;
    display: flex;
    justify-content: flex-end;
    box-sizing: border-box;
    width: 100%;
    height: 0;
    margin: 0;
    padding: 0 clamp(0.85rem, 0.4rem + 1.8vw, 2.5rem);
    pointer-events: none;
    transform: translateY(-3.4rem);
  }
  .fab-btn {
    pointer-events: auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.85rem;
    height: 2.85rem;
    margin: 0;
    padding: 0;
    border: 1px solid color-mix(in srgb, var(--is-border, #2a3038) 80%, transparent);
    border-radius: 999px;
    background: color-mix(in srgb, var(--is-bg-elevated, #1a2129) 92%, transparent);
    color: var(--is-text, #e6edf3);
    box-shadow:
      0 10px 28px rgba(0, 0, 0, 0.28),
      inset 0 1px 0 rgba(255, 255, 255, 0.06);
    cursor: pointer;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease;
  }
  .fab-btn:hover {
    transform: translateY(-1px);
    border-color: color-mix(in srgb, var(--is-accent, #1a6eb0) 55%, var(--is-border, #2a3038));
    background: color-mix(in srgb, var(--is-accent, #1a6eb0) 18%, var(--is-bg-elevated, #1a2129));
  }
  .fab-btn:focus-visible {
    outline: 2px solid var(--is-accent, #1a6eb0);
    outline-offset: 2px;
  }
  .fab-btn is-icon {
    font-size: 1.35rem;
  }
  .fab-btn[aria-pressed="true"] {
    color: var(--is-accent, #1a6eb0);
  }
`;

const SECCIONES: ReadonlyArray<{ lane: TkDocLane; rotulo: string }> = [
  { lane: 'solicitud', rotulo: 'Solicitud' },
  { lane: 'evidencias', rotulo: 'Evidencias' },
  { lane: 'causa', rotulo: 'Causa' },
  { lane: 'solucion', rotulo: 'Solución' },
  { lane: 'verificacion', rotulo: 'Verificación' },
  { lane: 'otros', rotulo: 'Detalle' },
];

/**
 * La misma captura puede llegar en varios bloques (seed por rol, contextos que
 * repiten la evidencia del ticket). El documento la muestra una sola vez.
 */
const sinImagenesRepetidas = (bloques: TkBlock[]): TkBlock[] => {
  const vistas = new Set<string>();
  return bloques.filter((b) => {
    const kind = String(b.kind ?? '').toLowerCase();
    if (kind !== 'image' && kind !== 'image-group') return true;
    const p = rec(b.payload);
    const url = String(p.url ?? p.src ?? '').trim().split('?')[0] ?? '';
    if (!url) return true;
    if (vistas.has(url)) return false;
    vistas.add(url);
    return true;
  });
};

const bloquesDe = (tk: TkTicket): TkBlock[] => {
  const propios = Array.isArray(tk.content) && tk.content.length
    ? [...tk.content]
    : [...(tk.doc?.blocks ?? [])];
  const deContextos = (tk.contexts ?? []).flatMap((c) => [...(c.content ?? [])]);
  return sinImagenesRepetidas(
    [...propios, ...deContextos]
      .filter((b) => b && typeof b === 'object')
      .sort((a, b) => (a.sortkey ?? 0) - (b.sortkey ?? 0)),
  );
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

/**
 * Imágenes sueltas en serie (típico en Evidencias) se pintaban una debajo de
 * otra a ancho completo. Se fusionan en un `image-group` para grid + lightbox.
 * El `title` del bloque pasa a `caption` si no había pie (es la etiqueta visible).
 */
const esImagen = (b: TkBlock): boolean => {
  const k = String(b.kind ?? '').toLowerCase();
  return k === 'image' || k === 'image-group';
};

const comoHijoImagen = (b: TkBlock): TkBlock => {
  const p = rec(b.payload);
  const caption = String(p.caption ?? '').trim() || String(p.title ?? '').trim();
  const hijos = Array.isArray(b.blocks) ? b.blocks : [];
  if (String(b.kind ?? '').toLowerCase() === 'image-group' && hijos.length) {
    return b;
  }
  return {
    ...b,
    kind: 'image',
    payload: { ...p, caption, title: '' },
    blocks: undefined,
  };
};

const fusionarImagenes = (bloques: TkBlock[]): TkBlock[] => {
  const out: TkBlock[] = [];
  let run: TkBlock[] = [];

  const flush = (): void => {
    if (!run.length) return;
    if (run.length === 1) {
      out.push(run[0]!);
    } else {
      const hijos = run.flatMap((b) => {
        const k = String(b.kind ?? '').toLowerCase();
        if (k === 'image-group' && Array.isArray(b.blocks) && b.blocks.length) {
          return b.blocks.map(comoHijoImagen);
        }
        return [comoHijoImagen(b)];
      });
      const lane = rec(run[0]!.payload).docLane;
      out.push({
        kind: 'image-group',
        sortkey: run[0]!.sortkey,
        payload: lane ? { docLane: lane } : {},
        blocks: hijos,
      });
    }
    run = [];
  };

  for (const b of bloques) {
    if (esImagen(b)) run.push(b);
    else {
      flush();
      out.push(b);
    }
  }
  flush();
  return out;
};

const commitsDe = (tk: TkTicket): TkCommit[] => {
  const root = [...(tk.rootCommits ?? [])];
  if (root.length) return root;
  return (tk.contexts ?? []).flatMap((c) => [...(c.commits ?? [])]);
};

const parseModo = (raw: string | null | undefined): TkVistaModo =>
  String(raw || '').trim().toLowerCase() === 'metrics' ? 'metrics' : 'doc';

class TkView extends HTMLElement {
  static get observedAttributes(): string[] { return ['embebido', 'modo']; }

  #ticket: TkTicket | null = null;
  #modo: TkVistaModo = 'doc';
  #root: ShadowRoot;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
    css(this.#root, CSS);
  }

  connectedCallback(): void {
    this.#modo = parseModo(this.getAttribute('modo'));
    this.#render();
  }

  attributeChangedCallback(name: string, _prev: string | null, next: string | null): void {
    if (name === 'modo') this.#modo = parseModo(next);
    if (this.isConnected) this.#render();
  }

  get ticket(): TkTicket | null { return this.#ticket; }
  set ticket(v: TkTicket | null) {
    this.#ticket = v;
    if (this.isConnected) this.#render();
  }

  set json(v: unknown) {
    const r = rec(v);
    this.ticket = (r.ticket ? r.ticket : r) as TkTicket;
  }

  get embebido(): boolean { return this.hasAttribute('embebido'); }
  set embebido(v: boolean) { this.toggleAttribute('embebido', !!v); }

  get modo(): TkVistaModo { return this.#modo; }
  set modo(v: TkVistaModo | string) {
    const next = parseModo(String(v));
    if (this.#modo === next) return;
    this.#modo = next;
    this.setAttribute('modo', next);
    this.dispatchEvent(new CustomEvent('tk-modo', {
      bubbles: true,
      composed: true,
      detail: { modo: next },
    }));
    if (this.isConnected) this.#render();
  }

  #toggleModo = (): void => {
    this.modo = this.#modo === 'doc' ? 'metrics' : 'doc';
  };

  #renderDoc(tk: TkTicket): DocumentFragment {
    const bloques = bloquesConCarril(bloquesDe(tk));
    const cabecera = Object.assign(document.createElement('tk-ticket-head'), { ticket: tk });
    const commits = commitsDe(tk);

    const secciones = SECCIONES.map(({ lane, rotulo }) => {
      const propios = fusionarImagenes(
        bloques.filter((x) => x.lane === lane).map((x) => x.b),
      );
      if (!propios.length) return null;
      return html`
        <section aria-label="${rotulo}" data-lane="${lane}">
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

    return html`
      <article class="documento" data-modo="doc">
        <header class="encabezado">${cabecera}</header>
        ${secciones.length > 0 ? secciones : html`
          <is-callout color="neutral" icon="mdi:text-box-remove-outline">
            Este tiquete todavía no tiene documentación publicada.
          </is-callout>
        `}
        ${seccionCommits}
        <footer class="firma">
          ${tk.iticket} · ${
            tk.space === 'patyia' ? 'PatyIA'
              : tk.space === 'isp-svelte' ? 'ISP Svelte'
                : 'Clientes'
          } ·
          documentación generada desde jagudeloe-tks
        </footer>
      </article>
    `;
  }

  #renderMetrics(tk: TkTicket): DocumentFragment {
    return html`
      <div class="documento" data-modo="metrics">
        ${Object.assign(document.createElement('tk-metrics'), { ticket: tk })}
      </div>
    `;
  }

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

    const enMetrics = this.#modo === 'metrics';
    const fabIcon = enMetrics ? 'mdi:file-document-outline' : 'mdi:chart-timeline-variant';
    const fabLabel = enMetrics ? 'Ver documentación' : 'Ver métricas InSoft';

    this.#root.append(html`
      <div class="shell">
        ${enMetrics ? this.#renderMetrics(tk) : this.#renderDoc(tk)}
        <div class="fab">
          <button
            type="button"
            class="fab-btn"
            aria-label="${fabLabel}"
            title="${fabLabel}"
            aria-pressed="${enMetrics ? 'true' : 'false'}"
            onclick=${this.#toggleModo}
          >
            <is-icon icon="${fabIcon}" aria-hidden="true"></is-icon>
          </button>
        </div>
      </div>
    `);
  }
}

define('tk-view', TkView);
