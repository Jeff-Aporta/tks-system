/**
 * <tk-actions> — acciones del tiquete: compartir y descargar.
 *
 * Propiedad
 *   ticket  TkTicket
 *
 * Compartir copia un enlace a la vista de página completa (sin cabecera ni
 * panel), que es lo que se manda por chat o correo. Descargar genera un HTML
 * autocontenido con el JSON quemado, para archivar la documentación.
 *
 * Vive en `components/tk/` pero no viaja en el HTML descargado: allí no hay
 * nada que compartir ni que volver a descargar.
 */

import { css, define, html } from './_shared.js';
import { aviso, estado } from '../../js/estado.js';
import { exportar } from '../../js/export.js';
const CSS = /* css */ `
  :host {
    display: flex;
    flex: none;
    gap: 0.4rem;
    align-items: center;
    font-family: var(--is-font-sans, system-ui, sans-serif);
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

    // Compartir nativo donde exista (móvil); portapapeles en escritorio.
    const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
    if (nav.share) {
      try {
        await nav.share({ title: `${tk.iticket} · ${tk.titulo ?? ''}`.trim(), url });
        return;
      } catch {
        // Cancelar el diálogo no es un error: se sigue al portapapeles.
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
    if (!this.#ticket) return;

    this.#root.append(html`
      <is-button variant="outlined" onclick=${() => void this.#compartir()}>
        <is-icon slot="start" icon="mdi:share-variant-outline" aria-hidden="true"></is-icon>
        Compartir
      </is-button>
      <is-button
        variant="filled"
        onclick=${(e: Event) => void this.#descargar(e.currentTarget as HTMLElement)}
      >
        <is-icon slot="start" icon="mdi:download-outline" aria-hidden="true"></is-icon>
        Descargar
      </is-button>
    `);
  }
}

define('tk-actions', TkActions);
