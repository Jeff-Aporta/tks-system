/**
 * <tk-app> — shell del visor: cabecera, catálogo y documento.
 *
 * Atributos
 *   full  boolean — página completa de un solo tiquete: sin cabecera ni panel.
 *
 * ≥ 48rem: catálogo en panel izquierdo redimensionable (`<is-split-panel>`).
 * < 48rem (`compact`): panel colapsado; menú hamburguesa abre el catálogo en
 * <is-drawer>. El visor ocupa el 100% del ancho.
 */

import { css, define, html } from '../tk/_shared.js';
import { aviso, estado } from '../../js/estado.js';
import { api } from '../../js/api.js';

const MQ_COMPACT = '(max-width: 48rem)';
const RAIL_PX_DEFAULT = 280;

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
    gap: 0.45rem;
    min-width: 0;
    padding: 0.55rem clamp(0.65rem, 2vw, 1.25rem);
    border-bottom: 1px solid var(--is-border-soft, #1f242b);
    background: color-mix(in srgb, var(--is-bg-soft, #14181d) 88%, transparent);
  }
  .marca {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    min-width: 0;
    color: var(--is-text, #e6edf3);
    font-family: var(--is-font-sans, system-ui, -apple-system, "Segoe UI", sans-serif);
    font-size: 0.9375rem;
    font-weight: 640;
    letter-spacing: -0.015em;
    white-space: nowrap;

    is-icon { flex: none; color: var(--is-accent, #1a6eb0); font-size: 1.25rem; }
  }
  .relleno { flex: 1; min-width: 0.5rem; }
  .acciones-tk {
    display: inline-flex;
    flex: none;
    align-items: center;
  }
  .filtros {
    flex: 1 1 auto;
    min-width: 0;
    max-width: min(22rem, 46vw);
    font-size: 0.8125rem;
  }
  .filtros::part(body) {
    display: none;
  }
  .filtros::part(nav),
  .filtros::part(tabs) {
    min-width: 0;
  }

  .nav-btn { display: none; }

  .cuerpo {
    display: block;
    overflow: hidden;
    min-width: 0;
    min-height: 0;
    height: 100%;
  }

  .split {
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    --min: 14rem;
    --max: 42%;
    --divider-width: 1px;
    --divider-hit-area: 10px;
  }

  .rail {
    display: flex;
    overflow: hidden;
    min-width: 0;
    min-height: 0;
    height: 100%;
    background: color-mix(in srgb, var(--is-bg-soft, #14181d) 92%, transparent);
  }
  .rail > tk-nav,
  .drawer__mount > tk-nav {
    flex: 1;
    min-width: 0;
    height: 100%;
  }

  .visor {
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
    min-width: 0;
    min-height: 0;
    height: 100%;
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
    padding: 1.25rem;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.875rem;
  }

  is-drawer#navDrawer {
    --size: min(92vw, 22rem);
    --spacing: 0;
  }
  is-drawer#navDrawer::part(panel) { background: var(--is-bg, #0b0d10); }
  is-drawer#navDrawer::part(body) {
    display: flex;
    overflow: hidden;
    padding: 0;
    min-height: 0;
    flex: 1;
    flex-direction: column;
  }
  .drawer__mount {
    display: flex;
    overflow: hidden;
    width: 100%;
    min-height: 0;
    flex: 1;
    flex-direction: column;
  }

  :host([compact]) .nav-btn { display: inline-flex; }
  :host([compact]) .split {
    --min: 0px;
    --max: 100%;
  }
  :host([compact]) .split::part(divider) {
    display: none;
    width: 0;
    min-width: 0;
    pointer-events: none;
  }

  @media (max-width: 28rem) {
    .filtros { max-width: min(18rem, 52vw); }
  }
`;

type TkNavEl = HTMLElement & {
  filas: readonly TkTicketRow[];
  seleccionado: string;
  contexto: 'all' | TkSpace;
};
type TkViewEl = HTMLElement & { ticket: TkTicket | null };
type TkActionsEl = HTMLElement & { ticket: TkTicket | null };
type DrawerEl = HTMLElement & { show?: () => void; hide?: () => void };
type SplitEl = HTMLElement & {
  disabled: boolean;
  positionInPixels: number;
};

class TkApp extends HTMLElement {
  static get observedAttributes(): string[] { return ['full']; }

  #root: ShadowRoot;
  #nav: TkNavEl | null = null;
  #rail: HTMLElement | null = null;
  #split: SplitEl | null = null;
  #drawerMount: HTMLElement | null = null;
  #drawer: DrawerEl | null = null;
  #navBtn: HTMLElement | null = null;
  #acciones: TkActionsEl | null = null;
  #mql: MediaQueryList | null = null;
  #drawerOpen = false;
  #vista: TkViewEl | null = null;
  #cargando = false;
  #railPxAntes = RAIL_PX_DEFAULT;

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
    this.#mql?.removeEventListener('change', this.#onBreakpoint);
  }

  get full(): boolean { return this.hasAttribute('full'); }

  #onBreakpoint = (): void => {
    this.#aplicarCompacto(!!this.#mql?.matches);
  };

  #aplicarCompacto(activo: boolean): void {
    this.toggleAttribute('compact', activo);
    if (!activo && this.#drawerOpen) this.#cerrarDrawer();
    if (!activo) this.#moverNav('rail');

    const split = this.#split;
    if (!split) return;

    split.disabled = activo;
    if (activo) {
      const actual = Number(split.positionInPixels);
      if (Number.isFinite(actual) && actual > 0) this.#railPxAntes = actual;
      split.positionInPixels = 0;
    } else {
      const restaurar = this.#railPxAntes > 0 ? this.#railPxAntes : RAIL_PX_DEFAULT;
      split.positionInPixels = restaurar;
    }
  }

  #moverNav(destino: 'rail' | 'drawer'): void {
    if (!this.#nav || !this.#rail || !this.#drawerMount) return;
    const target = destino === 'rail' ? this.#rail : this.#drawerMount;
    if (this.#nav.parentElement !== target) target.appendChild(this.#nav);
  }

  #abrirDrawer(): void {
    if (!this.#drawer || this.#drawerOpen) return;
    this.#moverNav('drawer');
    this.#drawer.show?.();
    this.#drawer.setAttribute('open', '');
  }

  #cerrarDrawer(): void {
    if (!this.#drawer || !this.#drawerOpen) return;
    this.#drawer.hide?.();
    this.#drawer.removeAttribute('open');
  }

  async #arrancar(): Promise<void> {
    const estadoUrl = estado.leer();
    if (estadoUrl.full) this.setAttribute('full', '');
    if (!this.full) await this.#cargarCatalogo();
    await this.#sincronizar();
  }

  async #cargarCatalogo(): Promise<void> {
    try {
      const { data } = await api.listarTodos();
      if (this.#nav) this.#nav.filas = data;
    } catch (e) {
      aviso(`No se pudo cargar el catálogo: ${e instanceof Error ? e.message : e}`, 'danger');
    }
  }

  async #sincronizar(): Promise<void> {
    const { tk, space } = estado.leer();
    if (this.#nav) this.#nav.seleccionado = tk ?? '';
    if (!tk) {
      if (this.#vista) this.#vista.ticket = null;
      if (this.#acciones) this.#acciones.ticket = null;
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
      const { data } = await api.ticket(space, iticket);
      this.#vista = Object.assign(document.createElement('tk-view'), { ticket: data });
      if (this.#acciones) this.#acciones.ticket = data;
      contenedor?.replaceChildren(this.#vista);
      document.title = `${data.iticket} · ${data.titulo ?? 'Tiquete'}`;
    } catch (e) {
      if (this.#acciones) this.#acciones.ticket = null;
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

    const visor = document.createElement('div');
    visor.className = 'visor';
    if (this.full) {
      this.#root.append(visor);
      return;
    }

    this.#nav = document.createElement('tk-nav') as TkNavEl;
    this.#nav.addEventListener('tk-seleccion', (e) => {
      const { iticket, space } = (e as CustomEvent<{ iticket: string; space: TkSpace }>).detail;
      estado.escribir({ tk: iticket, space });
      void this.#sincronizar();
      this.#cerrarDrawer();
    });

    this.#acciones = document.createElement('tk-actions') as TkActionsEl;

    this.#rail = document.createElement('aside');
    this.#rail.className = 'rail';
    this.#rail.slot = 'start';
    this.#rail.setAttribute('aria-label', 'Catálogo de tiquetes');
    this.#rail.appendChild(this.#nav);

    visor.slot = 'end';

    this.#split = document.createElement('is-split-panel') as SplitEl;
    this.#split.className = 'split';
    this.#split.setAttribute('orientation', 'horizontal');
    this.#split.setAttribute('primary', 'start');
    this.#split.setAttribute('position-in-pixels', String(RAIL_PX_DEFAULT));
    this.#split.setAttribute('storage-key', 'tk-app-nav');
    this.#split.append(this.#rail, visor);

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
          Tiquetes jagudeloe
        </span>
        <is-tab-group class="filtros" active="all" without-scroll-controls>
          <is-tab slot="nav" panel="all">Todo</is-tab>
          <is-tab slot="nav" panel="patyia">PatyIA</is-tab>
          <is-tab slot="nav" panel="clientesis">Clientes</is-tab>
          <is-tab slot="nav" panel="isp-svelte">ISP Svelte</is-tab>
          <is-tab-panel name="all"></is-tab-panel>
          <is-tab-panel name="patyia"></is-tab-panel>
          <is-tab-panel name="clientesis"></is-tab-panel>
          <is-tab-panel name="isp-svelte"></is-tab-panel>
        </is-tab-group>
        <span class="relleno"></span>
        <span class="acciones-tk">${this.#acciones}</span>
        <is-theme-toggle></is-theme-toggle>
      </header>
      <div class="cuerpo">${this.#split}</div>
      <is-drawer id="navDrawer" placement="start" label="Catálogo de tiquetes" light-dismiss>
        <div class="drawer__mount"></div>
      </is-drawer>
    `);

    this.#navBtn = this.#root.querySelector('.nav-btn');
    this.#drawer = this.#root.querySelector('#navDrawer');
    this.#drawerMount = this.#root.querySelector('.drawer__mount');

    const filtros = this.#root.querySelector('.filtros');
    filtros?.addEventListener('is-tab-show', (e) => {
      const name = String((e as CustomEvent<{ name?: string }>).detail?.name ?? 'all');
      if (this.#nav) this.#nav.contexto = name as 'all' | TkSpace;
    });

    this.#navBtn?.addEventListener('click', () => {
      if (this.#drawerOpen) this.#cerrarDrawer();
      else this.#abrirDrawer();
    });

    this.#drawer?.addEventListener('is-show', () => {
      this.#drawerOpen = true;
      this.#navBtn?.setAttribute('aria-expanded', 'true');
      queueMicrotask(() => {
        const input = this.#nav?.shadowRoot?.querySelector('input, is-input');
        (input as HTMLElement | null)?.focus?.();
      });
    });

    const alCerrar = (): void => {
      this.#drawerOpen = false;
      this.#navBtn?.setAttribute('aria-expanded', 'false');
      this.#moverNav('rail');
    };
    this.#drawer?.addEventListener('is-after-hide', alCerrar);
    this.#drawer?.addEventListener('is-hide', () => {
      if (this.#drawerOpen) alCerrar();
    });

    this.#mql = matchMedia(MQ_COMPACT);
    this.#mql.addEventListener('change', this.#onBreakpoint);
    this.#aplicarCompacto(this.#mql.matches);
  }
}

define('tk-app', TkApp);
