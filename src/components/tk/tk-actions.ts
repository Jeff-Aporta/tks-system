/**
 * <tk-actions> — compartir y descargar el tiquete (solo iconos).
 *
 * Propiedad
 *   ticket  TkTicket
 *
 * Pensado para el header de <tk-app>: `variant="text"`, sin etiqueta.
 * Visible solo cuando hay ticket. No viaja en el HTML descargado.
 */

import { css, define, html } from './_shared.js';
import { aviso, estado } from '../../js/estado.js';
import { exportar } from '../../js/export.js';

const CSS = /* css */ `
  :host {
    display: none;
    flex-wrap: nowrap;
    gap: 0.15rem;
    align-items: center;
    flex: none;
    font-family: var(--is-font-sans, system-ui, sans-serif);
  }
  :host([activo]) { display: inline-flex; }
  is-button {
    min-width: 2.25rem;
  }
`;

class TkActions extends HTMLElement {
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
    this.toggleAttribute('activo', !!v?.iticket);
    if (this.isConnected) this.#render();
  }

  async #compartir(): Promise<void> {
    const tk = this.#ticket;
    if (!tk) return;

    const url = estado.enlace({
      space: tk.space as TkSpace,
      tk: tk.iticket,
      full: true,
    });

    const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
    if (nav.share) {
      try {
        await nav.share({ title: `${tk.iticket} · ${tk.titulo ?? ''}`.trim(), url });
        return;
      } catch {
        /* cancelar → portapapeles */
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      aviso('Enlace copiado al portapapeles.', 'success');
    } catch {
      aviso('No se pudo copiar el enlace. Cópialo de la barra de direcciones.', 'warning');
    }
  }

  async #descargar(boton: HTMLElement): Promise<void> {
    const tk = this.#ticket;
    if (!tk) return;

    boton.setAttribute('loading', '');
    try {
      await exportar.descargar(tk);
      aviso(`${tk.iticket}.html descargado.`, 'success');
    } catch (e) {
      aviso(`No se pudo generar el HTML: ${e instanceof Error ? e.message : e}`, 'danger');
    } finally {
      boton.removeAttribute('loading');
    }
  }

  #render(): void {
    while (this.#root.firstChild) this.#root.removeChild(this.#root.firstChild);
    if (!this.#ticket?.iticket) return;

    this.#root.append(html`
      <is-button
        variant="text"
        color="neutral"
        pill
        type="button"
        aria-label="Compartir tiquete"
        title="Compartir"
        onclick=${() => void this.#compartir()}
      >
        <is-icon icon="mdi:share-variant-outline" aria-hidden="true"></is-icon>
      </is-button>
      <is-button
        variant="text"
        color="neutral"
        pill
        type="button"
        aria-label="Descargar HTML del tiquete"
        title="Descargar"
        onclick=${(e: Event) => void this.#descargar(e.currentTarget as HTMLElement)}
      >
        <is-icon icon="mdi:download-outline" aria-hidden="true"></is-icon>
      </is-button>
    `);
  }
}

define('tk-actions', TkActions);
