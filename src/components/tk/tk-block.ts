/**
 * <tk-block> — despachador: un bloque del JSON al componente que lo pinta.
 *
 * Propiedad
 *   bloque  TkBlock
 *
 * Es el único punto del proyecto que conoce el mapa `kind → tag`. Un `kind`
 * desconocido no se descarta en silencio: se muestra como aviso con el nombre,
 * porque un bloque invisible en la documentación de un ticket es un dato
 * perdido, no un detalle estético.
 */

import { css, define, html, rec } from './_shared.js';
const CSS = /* css */ `
  :host { display: block; }
  :host([oculto]) { display: none; }
  is-callout { font-size: 0.8125rem; }
  code {
    font-family: var(--is-font-mono, ui-monospace, Menlo, monospace);
    color: var(--tk-code-text, #a8d5ff);
  }
`;

const MAPA: Readonly<Record<string, string>> = {
  markdown: 'tk-markdown',
  md: 'tk-markdown',
  text: 'tk-markdown',
  html: 'tk-html',
  badge: 'tk-badges',
  badges: 'tk-badges',
  table: 'tk-table',
  image: 'tk-image',
  'image-group': 'tk-image',
  steps: 'tk-steps',
  timeline: 'tk-timeline',
  'metrics-timeline': 'tk-timeline',
  'file-tree': 'tk-file-tree',
  code: 'tk-code',
  sql: 'tk-code',
  sequence: 'tk-sequence',
  'mui-stepper': 'tk-stepper',
  stepper: 'tk-stepper',
  url: 'tk-url',
  link: 'tk-url',
  'cambio-bd': 'tk-cambio-bd',
  chart: 'tk-chart',
  diagram: 'tk-diagram',
};

/** Un bloque sin contenido útil no ocupa espacio en el documento. */
const tieneContenido = (b: TkBlock): boolean => {
  const p = rec(b.payload);
  if (Array.isArray(b.blocks) && b.blocks.length) return true;
  for (const clave of ['text', 'body', 'html', 'code', 'sql', 'url', 'src', 'href', 'label', 'source']) {
    if (String(p[clave] ?? '').trim()) return true;
  }
  for (const clave of ['rows', 'items', 'badges', 'paths', 'phases', 'steps']) {
    if (Array.isArray(p[clave]) && (p[clave] as unknown[]).length) return true;
  }
  for (const clave of ['timeline', 'sequence', 'stepper', 'chart']) {
    if (Object.keys(rec(p[clave])).length) return true;
  }
  return false;
};

class TkBloque extends HTMLElement {
  #bloque: TkBlock = {};
  #root: ShadowRoot;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
    css(this.#root, CSS);
  }

  connectedCallback(): void { this.#render(); }

  get bloque(): TkBlock { return this.#bloque; }
  set bloque(v: TkBlock | null | undefined) {
    this.#bloque = (v ?? {}) as TkBlock;
    if (this.isConnected) this.#render();
  }

  /** Carril del bloque — lo usa <tk-view> para agrupar por sección. */
  get docLane(): TkDocLane {
    return (rec(this.#bloque.payload).docLane as TkDocLane) ?? 'otros';
  }

  #render(): void {
    while (this.#root.firstChild) this.#root.removeChild(this.#root.firstChild);

    const bloque = this.#bloque;
    const kind = String(bloque.kind ?? '').toLowerCase();

    if (!tieneContenido(bloque)) {
      this.setAttribute('oculto', '');
      return;
    }
    this.removeAttribute('oculto');

    const tag = MAPA[kind];
    if (!tag) {
      this.#root.append(html`
        <is-callout color="warning" icon="mdi:puzzle-outline">
          Bloque <code>${kind || 'sin tipo'}</code> sin representación en este visor.
        </is-callout>
      `);
      return;
    }

    const nodo = document.createElement(tag) as HTMLElement & {
      payload?: TkBlockPayload;
      bloques?: readonly TkBlock[];
    };
    // Los hijos van antes que el payload: el render los lee en la asignación.
    if (Array.isArray(bloque.blocks) && bloque.blocks.length) nodo.bloques = bloque.blocks;
    nodo.payload = rec(bloque.payload) as TkBlockPayload;
    this.#root.append(nodo);
  }
}

define('tk-block', TkBloque);
