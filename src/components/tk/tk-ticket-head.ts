/**
 * <tk-ticket-head> — cabecera del tiquete: identidad, estado y cifras.
 *
 * Propiedad
 *   ticket  TkTicket
 *
 * Orden deliberado: código y título (qué es), estado y ámbito (dónde está),
 * cifras de tiempo (cuánto costó). El resumen cierra porque es prosa y ya no
 * se escanea, se lee. Compartir/descargar viven en el header de <tk-app>.
 */

import { blockCss, css, define, estadoColor, fecha, html, md, minutos, proseCss, raw } from './_shared.js';
const CSS = /* css */ `
  ${blockCss}
  ${proseCss}
  :host {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    container-type: inline-size;
  }
  .cima {
    margin-bottom: 1.15rem;
    min-width: 0;
  }
  .identidad {
    min-width: 0;
    max-width: 100%;
  }
  .codigo {
    display: flex;
    align-items: center;
    gap: 0.55em;
    margin: 0 0 0.4em;
    min-width: 0;
    color: var(--is-text-muted, #9aa7b4);
    font-family: var(--is-font-mono, ui-monospace, Menlo, monospace);
    font-size: 0.8125rem;
    letter-spacing: 0.04em;
    overflow-wrap: anywhere;
  }
  .punto {
    width: 0.5em;
    height: 0.5em;
    flex: none;
    border-radius: 50%;
    background: var(--punto);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--punto) 22%, transparent);
  }
  h1 {
    margin: 0 0 0.7rem;
    max-width: 100%;
    font-size: clamp(1.25rem, 1rem + 2.2vw, 2rem);
    font-weight: 660;
    letter-spacing: -0.024em;
    line-height: 1.2;
    overflow-wrap: anywhere;
    word-break: break-word;
    text-wrap: pretty;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4em;
    margin: 0;
    max-width: 100%;
    font-size: 0.8125rem;
  }
  .cifras {
    display: grid;
    gap: 0.65rem;
    margin: 0 0 1.15rem;
    min-width: 0;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr));
  }
  .cifra {
    display: grid;
    gap: 0.35rem;
    min-width: 0;
    padding: 0.7rem 0.85rem;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: color-mix(in srgb, var(--is-bg-soft, #14181d) 88%, transparent);
  }
  .cifra-rotulo {
    display: flex;
    align-items: center;
    gap: 0.4em;
    min-width: 0;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;

    is-icon { flex: none; font-size: 0.95em; opacity: 0.9; }
  }
  .cifra-valor {
    min-width: 0;
    font-size: 0.975rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    line-height: 1.35;
    overflow-wrap: anywhere;
    font-variant-numeric: tabular-nums;
  }
  .resumen {
    max-width: min(100%, var(--tk-measure, 68ch));
    min-width: 0;
    color: var(--is-text-soft, #c3ced9);
    font-size: 1rem;
    line-height: 1.7;
  }

  @container (max-width: 36rem) {
    .cima { margin-bottom: 0.95rem; }
    .cifras { grid-template-columns: 1fr; }
  }

  @media (max-width: 48rem) {
    .cifras { grid-template-columns: 1fr; }
  }
`;

const PUNTOS: Readonly<Record<string, string>> = {
  success: 'var(--is-color-success-500, #2f9e44)',
  warning: 'var(--is-color-warning-500, #f08c00)',
  info: 'var(--is-accent, #1a6eb0)',
  neutral: 'var(--is-text-muted, #9aa7b4)',
};

const chip = (texto: string, color: string, icono: string): DocumentFragment | null => (texto
  ? html`
    <is-tag color="${color}" variant="filled-outlined" pill>
      <is-icon slot="start" icon="${icono}" aria-hidden="true"></is-icon>
      ${texto}
    </is-tag>
  `
  : null);

const cifra = (rotulo: string, valor: string, icono: string): DocumentFragment | null => (valor
  ? html`
    <div class="cifra">
      <span class="cifra-rotulo">
        <is-icon icon="${icono}" aria-hidden="true"></is-icon>
        ${rotulo}
      </span>
      <span class="cifra-valor">${valor}</span>
    </div>
  `
  : null);

class TkTicketHead extends HTMLElement {
  #ticket: TkTicket | null = null;
  #root: ShadowRoot;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
    css(this.#root, CSS);
  }

  connectedCallback(): void { this.#render(); }

  get ticket(): TkTicket | null { return this.#ticket; }
  set ticket(v: TkTicket | null) {
    this.#ticket = v;
    if (this.isConnected) this.#render();
  }

  #render(): void {
    while (this.#root.firstChild) this.#root.removeChild(this.#root.firstChild);
    const tk = this.#ticket;
    if (!tk) return;

    const color = estadoColor(tk.estado);
    const resumen = String(tk.resumen ?? '').trim();
    const commits = (tk.rootCommits?.length
      ?? (tk.contexts ?? []).reduce((n, c) => n + (c.commits?.length ?? 0), 0)) || 0;

    this.#root.append(html`
      <div class="cima">
        <div class="identidad">
          <p class="codigo">
            <span class="punto" style="--punto: ${PUNTOS[color]!}" aria-hidden="true"></span>
            ${tk.iticket}
          </p>
          <h1>${String(tk.titulo ?? tk.iticket)}</h1>
          <div class="chips">
            ${chip(String(tk.estado ?? ''), color, 'mdi:circle-slice-8')}
            ${chip(tk.space === 'patyia' ? 'PatyIA' : 'Clientes', 'brand', 'mdi:folder-outline')}
            ${chip(String(tk.solicitante ?? ''), 'neutral', 'mdi:account-outline')}
          </div>
        </div>
      </div>
      <div class="cifras">
        ${cifra('Solicitado', fecha(tk.fechaSolicitud, true), 'mdi:calendar-arrow-right')}
        ${cifra('Entregado', fecha(tk.fechaEntrega, true), 'mdi:calendar-check')}
        ${cifra('Tiempo total', minutos(tk.tiempoTotalMinutos ?? tk.diligenciaMinutos), 'mdi:timer-outline')}
        ${cifra('Commits', commits ? String(commits) : '', 'mdi:source-commit')}
      </div>
      ${resumen && html`<div class="resumen prosa">${raw(md(resumen))}</div>`}
    `);
  }
}

define('tk-ticket-head', TkTicketHead);
