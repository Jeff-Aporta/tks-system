/**
 * <tk-app> — shell del visor: cabecera, panel de navegación y visor.
 *
 * Atributos
 *   full  boolean — página completa de un solo tiquete: sin cabecera ni panel.
 *
 * Todo el estado navegable vive en la URL (`?s=`), no en el componente: volver
 * atrás, recargar o compartir el enlace llevan al mismo sitio.
 *
 * El panel y el visor se separan con <is-split-panel>, que ya resuelve el
 * arrastre y recuerda la posición.
 */

import { css, define, html } from '../tk/_shared.js';
import { aviso, estado } from '../../js/estado.js';
import { api } from '../../js/api.js';
const CSS = /* css */ `
  :host {
    display: grid;
    overflow: hidden;
    height: 100dvh;
    grid-template-rows: auto 1fr;
    color: var(--is-text, #e6edf3);
    font-family: var(--is-font-sans, system-ui, -apple-system, "Segoe UI", sans-serif);
  }
  :host([full]) { grid-template-rows: 1fr; }

  header {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.6rem clamp(0.75rem, 2vw, 1.25rem);
    border-bottom: 1px solid var(--is-border-soft, #1f242b);
    background: color-mix(in srgb, var(--is-bg-soft, #14181d) 88%, transparent);
  }
  .marca {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    font-size: 0.9375rem;
    font-weight: 640;
    letter-spacing: -0.015em;

    is-icon { color: var(--is-accent, #1a6eb0); font-size: 1.25rem; }
    small {
      color: var(--is-text-muted, #9aa7b4);
      font-size: 0.75rem;
      font-weight: 500;
      letter-spacing: 0;
    }
  }
  .relleno { flex: 1; }
  .estado-datos {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.75rem;
  }

  .nav-btn {
    display: none; /* sólo en móvil */
  }

  is-split-panel {
    overflow: hidden;
    min-height: 0;
    --divider-width: 1px;
  }
  is-split-panel::part(divider) { background: var(--is-border-soft, #1f242b); }

  tk-nav {
    height: 100%;
    border-right: 1px solid var(--is-border-soft, #1f242b);
  }

  /* El drawer móvil reusa <is-drawer>. Le pedimos el ancho y los tokens
     del visor; el resto (backdrop, escape, focus, light-dismiss) ya los
     trae el propio kit. */
  is-drawer#navDrawer {
    --size: min(85vw, 320px);
    --spacing: 0;
  }
  is-drawer#navDrawer::part(body) {
    padding: 0;
    display: flex;
    flex: 1;
    min-height: 0;
  }
  is-drawer#navDrawer::part(body) > tk-nav {
    flex: 1;
    border-right: 0;
  }

  .visor {
    position: relative;
    overflow-y: auto;
    height: 100%;
    /* Mesh atmosférico: la superficie de lectura, no una decoración del shell. */
    background:
      radial-gradient(ellipse 105% 90% at 50% 50%, transparent 36%, rgb(0 0 0 / 34%) 100%),
      radial-gradient(ellipse 50% 38% at 78% 16%, color-mix(in srgb, var(--is-accent, #1a6eb0) 12%, transparent), transparent 72%),
      radial-gradient(ellipse 42% 32% at 12% 82%, rgb(99 102 241 / 12%), transparent 70%),
      radial-gradient(ellipse 135% 90% at 50% -22%, color-mix(in srgb, var(--is-accent, #1a6eb0) 34%, transparent), transparent 56%),
      linear-gradient(168deg, #02060e 0%, #061018 26%, #0b1a30 56%, #060e1a 100%);
    background-attachment: local;
  }
  :host([full]) .visor { height: 100dvh; }

  :host-context(html.theme-light) .visor,
  :host-context(html[data-theme="light"]) .visor {
    background:
      radial-gradient(ellipse 105% 95% at 50% 50%, transparent 42%, rgb(255 255 255 / 62%) 100%),
      radial-gradient(ellipse 135% 88% at 50% -22%, color-mix(in srgb, var(--is-accent, #1a6eb0) 16%, transparent), transparent 56%),
      radial-gradient(ellipse 82% 52% at 96% 6%, rgb(0 229 255 / 8%), transparent 46%),
      linear-gradient(165deg, #f5f9ff 0%, #f8fbff 24%, #eef6fc 52%, #e8f2fa 100%);
  }

  .cargando {
    display: grid;
    height: 100%;
    align-content: center;
    justify-items: center;
    gap: 0.75rem;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.875rem;
  }

  /* Tablets: el split-panel sigue partido, sin drawer. */
  @media (max-width: 60rem) {
    is-split-panel { --min: 0; }
    tk-nav { border-right: 0; }
  }

  /* Móvil: el nav vive en el drawer. Oculta su slot en el split-panel y
     el divisor; el iframe toma todo el ancho. */
  @media (max-width: 640px) {
    .nav-btn { display: inline-flex; }
    is-split-panel > [slot="start"] { display: none; }
    is-split-panel::part(divider) { display: none; }
  }
`;

type TkNavEl = HTMLElement & { filas: readonly TkTicketRow[]; seleccionado: string };
type TkViewEl = HTMLElement & { ticket: TkTicket | null };

class TkApp extends HTMLElement {
  static get observedAttributes(): string[] { return ['full']; }

  #root: ShadowRoot;
  #nav: TkNavEl | null = null;
  #navMount: HTMLElement | null = null;
  #drawerMount: HTMLElement | null = null;
  #drawer: HTMLElement | null = null;
  #navBtn: HTMLElement | null = null;
  #mql: MediaQueryList | null = null;
  #drawerOpen = false;
  #vista: TkViewEl | null = null;
  #cargando = false;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
    css(this.#root, CSS);
  }

  connectedCallback(): void {
    this.#render();
    void this.#arrancar();
    addEventListener('popstate', () => void this.#sincronizar());
  }

  disconnectedCallback(): void {
    this.#mql?.removeEventListener?.('change', this.#onBreakpoint);
  }

  get full(): boolean { return this.hasAttribute('full'); }

  #onBreakpoint = (): void => {
    // Al cruzar a desktop con el drawer abierto, lo cierra y devuelve el nav.
    if (this.#mql?.matches) return;
    if (!this.#drawerOpen) return;
    (this.#drawer as unknown as { hide: () => void } | null)?.hide();
  };

  /** Mueve el <tk-nav> entre el split-panel (desktop) y el drawer (móvil). */
  #moverNav(destino: 'panel' | 'drawer'): void {
    if (!this.#nav || !this.#navMount || !this.#drawerMount) return;
    const target = destino === 'panel' ? this.#navMount : this.#drawerMount;
    if (this.#nav.parentElement !== target) target.appendChild(this.#nav);
  }

  #abrirDrawer(): void {
    if (!this.#drawer || this.#drawerOpen) return;
    this.#moverNav('drawer');
    (this.#drawer as unknown as { show: () => void }).show();
  }

  #cerrarDrawer(): void {
    if (!this.#drawer || !this.#drawerOpen) return;
    (this.#drawer as unknown as { hide: () => void }).hide();
  }

  async #arrancar(): Promise<void> {
    const estadoUrl = estado.leer();
    if (estadoUrl.full) this.setAttribute('full', '');

    // En página completa el catálogo no se pinta, pero el tiquete sí se pide.
    if (!this.full) await this.#cargarCatalogo();
    await this.#sincronizar();
  }

  async #cargarCatalogo(): Promise<void> {
    try {
      const { data, origen } = await api.listarTodos();
      if (this.#nav) this.#nav.filas = data;
      this.#marcarOrigen(origen);
    } catch (e) {
      aviso(`No se pudo cargar el catálogo: ${e instanceof Error ? e.message : e}`, 'danger');
    }
  }

  #marcarOrigen(origen: TkOrigen): void {
    const nodo = this.#root.querySelector('.estado-datos');
    if (!nodo) return;
    const texto = origen === 'red' ? 'Datos al día'
      : origen === 'cache' ? 'Caché local'
        : 'Copia sin conexión';
    const icono = origen === 'red' ? 'mdi:cloud-check-outline'
      : origen === 'cache' ? 'mdi:database-outline'
        : 'mdi:cloud-off-outline';
    nodo.replaceChildren(html`
      <is-icon icon="${icono}" aria-hidden="true"></is-icon>
      ${texto}
    `);
  }

  /** Aplica el estado de la URL a la vista. Única fuente de verdad. */
  async #sincronizar(): Promise<void> {
    const { tk, space } = estado.leer();
    if (this.#nav) this.#nav.seleccionado = tk ?? '';

    if (!tk) {
      if (this.#vista) this.#vista.ticket = null;
      return;
    }
    await this.#abrir(tk, (space ?? 'patyia') as TkSpace);
  }

  async #abrir(iticket: string, space: TkSpace): Promise<void> {
    if (this.#cargando) return;
    this.#cargando = true;
    const contenedor = this.#root.querySelector('.visor');
    contenedor?.replaceChildren(html`
      <div class="cargando">
        <is-spinner aria-hidden="true"></is-spinner>
        Cargando ${iticket}…
      </div>
    `);

    try {
      const { data, origen } = await api.ticket(space, iticket);
      this.#marcarOrigen(origen);
      this.#vista = Object.assign(document.createElement('tk-view'), { ticket: data });
      contenedor?.replaceChildren(this.#vista);
      document.title = `${data.iticket} · ${data.titulo ?? 'Tiquete'}`;
    } catch (e) {
      contenedor?.replaceChildren(html`
        <div class="cargando">
          <is-callout color="danger" icon="mdi:alert-circle-outline">
            No se pudo abrir ${iticket}: ${e instanceof Error ? e.message : String(e)}
          </is-callout>
        </div>
      `);
    } finally {
      this.#cargando = false;
    }
  }

  #render(): void {
    while (this.#root.firstChild) this.#root.removeChild(this.#root.firstChild);

    const visor = html`<div class="visor"></div>`;

    if (this.full) {
      this.#root.append(visor);
      return;
    }

    this.#nav = document.createElement('tk-nav') as TkNavEl;
    this.#nav.addEventListener('tk-seleccion', (e) => {
      const { iticket, space } = (e as CustomEvent<{ iticket: string; space: TkSpace }>).detail;
      estado.escribir({ tk: iticket, space });
      void this.#sincronizar();
      // En móvil, elegir un tiquete cierra el drawer.
      this.#cerrarDrawer();
    });

    const refrescar = async (): Promise<void> => {
      await api.refrescar();
      await this.#cargarCatalogo();
      await this.#sincronizar();
      aviso('Catálogo actualizado desde el servidor.', 'success');
    };

    // Mount estable: el nav se mueve entre este (desktop) y el drawer (móvil).
    this.#navMount = document.createElement('div');
    this.#navMount.style.cssText = 'height:100%;min-height:0;display:flex';
    this.#navMount.appendChild(this.#nav);

    this.#root.append(html`
      <header>
        <is-button
          class="nav-btn"
          variant="plain"
          color="neutral"
          pill
          type="button"
          aria-label="Abrir catálogo de tiquetes"
          aria-expanded="false"
          aria-controls="navDrawer"
        >
          <is-icon slot="start" icon="mdi:menu" aria-hidden="true"></is-icon>
        </is-button>
        <span class="marca">
          <is-icon icon="mdi:ticket-confirmation-outline" aria-hidden="true"></is-icon>
          Tiquetes
          <small>jagudeloe</small>
        </span>
        <span class="relleno"></span>
        <span class="estado-datos"></span>
        <is-button variant="plain" aria-label="Actualizar datos" onclick=${() => void refrescar()}>
          <is-icon slot="start" icon="mdi:refresh" aria-hidden="true"></is-icon>
        </is-button>
        <is-theme-toggle></is-theme-toggle>
      </header>
      <is-split-panel position="26" primary="start" snap="0% 26% 40%" storage-key="tk-panel">
        <div slot="start" style="height:100%;min-height:0;display:flex">${this.#navMount}</div>
        <div slot="end" style="height:100%;min-height:0;display:flex;flex-direction:column">
          ${visor}
        </div>
      </is-split-panel>
      <is-drawer id="navDrawer" placement="start" label="Catálogo de tiquetes" light-dismiss>
        <div class="drawer__mount"></div>
      </is-drawer>
    `);

    // Capturar referencias del drawer + cablear sus eventos.
    this.#navBtn = this.#root.querySelector('.nav-btn');
    this.#drawer = this.#root.querySelector('#navDrawer');
    this.#drawerMount = this.#root.querySelector('.drawer__mount');

    this.#navBtn?.addEventListener('click', () => {
      if (this.#drawerOpen) this.#cerrarDrawer();
      else this.#abrirDrawer();
    });

    // Sincronizar estado con los eventos nativos del kit.
    this.#drawer?.addEventListener('is-show', () => {
      this.#drawerOpen = true;
      this.#navBtn?.setAttribute('aria-expanded', 'true');
      // Foco al buscador para teclado: abrir el menú y empezar a filtrar.
      queueMicrotask(() => {
        const buscador = this.#drawer?.querySelector('input');
        (buscador as HTMLElement | null)?.focus();
      });
    });
    this.#drawer?.addEventListener('is-after-hide', () => {
      this.#drawerOpen = false;
      this.#navBtn?.setAttribute('aria-expanded', 'false');
      this.#navBtn?.focus();
      // Devolver el nav al split-panel ahora que la animación terminó.
      this.#moverNav('panel');
    });

    // Breakpoint: si pasamos a desktop con el drawer abierto, lo cerramos.
    this.#mql = matchMedia('(max-width: 640px)');
    this.#mql.addEventListener?.('change', this.#onBreakpoint);
  }
}

define('tk-app', TkApp);
