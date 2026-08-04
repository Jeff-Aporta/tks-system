import{css as d,define as c,html as s}from"./_shared.js";import{aviso as o,estado as n}from"./estado.js";import{api as l}from"./api.js";const h=`
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
    display: none; /* s\xF3lo en m\xF3vil */
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

  /* El drawer m\xF3vil reusa <is-drawer>. Le pedimos el ancho y los tokens
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
    /* Mesh atmosf\xE9rico: la superficie de lectura, no una decoraci\xF3n del shell. */
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

  /* M\xF3vil: el nav vive en el drawer. Oculta su slot en el split-panel y
     el divisor; el iframe toma todo el ancho. */
  @media (max-width: 640px) {
    .nav-btn { display: inline-flex; }
    is-split-panel > [slot="start"] { display: none; }
    is-split-panel::part(divider) { display: none; }
  }
`;class p extends HTMLElement{static get observedAttributes(){return["full"]}#e;#t=null;#a=null;#d=null;#i=null;#r=null;#n=null;#s=!1;#l=null;#c=!1;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),d(this.#e,h)}connectedCallback(){this.#w(),this.#g(),addEventListener("popstate",()=>{this.#o()})}disconnectedCallback(){this.#n?.removeEventListener?.("change",this.#h)}get full(){return this.hasAttribute("full")}#h=()=>{this.#n?.matches||this.#s&&this.#i?.hide()};#p(e){if(!this.#t||!this.#a||!this.#d)return;const t=e==="panel"?this.#a:this.#d;this.#t.parentElement!==t&&t.appendChild(this.#t)}#f(){!this.#i||this.#s||(this.#p("drawer"),this.#i.show())}#u(){!this.#i||!this.#s||this.#i.hide()}async#g(){n.leer().full&&this.setAttribute("full",""),this.full||await this.#m(),await this.#o()}async#m(){try{const{data:e,origen:t}=await l.listarTodos();this.#t&&(this.#t.filas=e),this.#v(t)}catch(e){o(`No se pudo cargar el cat\xE1logo: ${e instanceof Error?e.message:e}`,"danger")}}#v(e){const t=this.#e.querySelector(".estado-datos");if(!t)return;const a=e==="red"?"Datos al d\xEDa":e==="cache"?"Cach\xE9 local":"Copia sin conexi\xF3n",i=e==="red"?"mdi:cloud-check-outline":e==="cache"?"mdi:database-outline":"mdi:cloud-off-outline";t.replaceChildren(s`
      <is-icon icon="${i}" aria-hidden="true"></is-icon>
      ${a}
    `)}async#o(){const{tk:e,space:t}=n.leer();if(this.#t&&(this.#t.seleccionado=e??""),!e){this.#l&&(this.#l.ticket=null);return}await this.#b(e,t??"patyia")}async#b(e,t){if(this.#c)return;this.#c=!0;const a=this.#e.querySelector(".visor");a?.replaceChildren(s`
      <div class="cargando">
        <is-spinner aria-hidden="true"></is-spinner>
        Cargando ${e}…
      </div>
    `);try{const{data:i,origen:r}=await l.ticket(t,e);this.#v(r),this.#l=Object.assign(document.createElement("tk-view"),{ticket:i}),a?.replaceChildren(this.#l),document.title=`${i.iticket} \xB7 ${i.titulo??"Tiquete"}`}catch(i){a?.replaceChildren(s`
        <div class="cargando">
          <is-callout color="danger" icon="mdi:alert-circle-outline">
            No se pudo abrir ${e}: ${i instanceof Error?i.message:String(i)}
          </is-callout>
        </div>
      `)}finally{this.#c=!1}}#w(){for(;this.#e.firstChild;)this.#e.removeChild(this.#e.firstChild);const e=s`<div class="visor"></div>`;if(this.full){this.#e.append(e);return}this.#t=document.createElement("tk-nav"),this.#t.addEventListener("tk-seleccion",a=>{const{iticket:i,space:r}=a.detail;n.escribir({tk:i,space:r}),this.#o(),this.#u()});const t=async()=>{await l.refrescar(),await this.#m(),await this.#o(),o("Cat\xE1logo actualizado desde el servidor.","success")};this.#a=document.createElement("div"),this.#a.style.cssText="height:100%;min-height:0;display:flex",this.#a.appendChild(this.#t),this.#e.append(s`
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
        <is-button variant="plain" aria-label="Actualizar datos" onclick=${()=>{t()}}>
          <is-icon slot="start" icon="mdi:refresh" aria-hidden="true"></is-icon>
        </is-button>
        <is-theme-toggle></is-theme-toggle>
      </header>
      <is-split-panel position="26" primary="start" snap="0% 26% 40%" storage-key="tk-panel">
        <div slot="start" style="height:100%;min-height:0;display:flex">${this.#a}</div>
        <div slot="end" style="height:100%;min-height:0;display:flex;flex-direction:column">
          ${e}
        </div>
      </is-split-panel>
      <is-drawer id="navDrawer" placement="start" label="Catálogo de tiquetes" light-dismiss>
        <div class="drawer__mount"></div>
      </is-drawer>
    `),this.#r=this.#e.querySelector(".nav-btn"),this.#i=this.#e.querySelector("#navDrawer"),this.#d=this.#e.querySelector(".drawer__mount"),this.#r?.addEventListener("click",()=>{this.#s?this.#u():this.#f()}),this.#i?.addEventListener("is-show",()=>{this.#s=!0,this.#r?.setAttribute("aria-expanded","true"),queueMicrotask(()=>{this.#i?.querySelector("input")?.focus()})}),this.#i?.addEventListener("is-after-hide",()=>{this.#s=!1,this.#r?.setAttribute("aria-expanded","false"),this.#r?.focus(),this.#p("panel")}),this.#n=matchMedia("(max-width: 640px)"),this.#n.addEventListener?.("change",this.#h)}}c("tk-app",p);
