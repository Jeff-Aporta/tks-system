import{css as h,define as c,html as n}from"./_shared.js";import{aviso as p,estado as r}from"./estado.js";import{api as o}from"./api.js";const m="(max-width: 48rem)",l=280,u=`
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
`;class f extends HTMLElement{static get observedAttributes(){return["full"]}#e;#t=null;#s=null;#a=null;#h=null;#i=null;#o=null;#n=null;#l=null;#r=!1;#d=null;#c=!1;#p=l;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),h(this.#e,u)}connectedCallback(){this.#x(),this.#w(),addEventListener("popstate",()=>{this.#f()})}disconnectedCallback(){this.#l?.removeEventListener("change",this.#v)}get full(){return this.hasAttribute("full")}#v=()=>{this.#g(!!this.#l?.matches)};#g(t){this.toggleAttribute("compact",t),!t&&this.#r&&this.#u(),t||this.#m("rail");const e=this.#a;if(e)if(e.disabled=t,t){const a=Number(e.positionInPixels);Number.isFinite(a)&&a>0&&(this.#p=a),e.positionInPixels=0}else{const a=this.#p>0?this.#p:l;e.positionInPixels=a}}#m(t){if(!this.#t||!this.#s||!this.#h)return;const e=t==="rail"?this.#s:this.#h;this.#t.parentElement!==e&&e.appendChild(this.#t)}#b(){!this.#i||this.#r||(this.#m("drawer"),this.#i.show?.(),this.#i.setAttribute("open",""))}#u(){!this.#i||!this.#r||(this.#i.hide?.(),this.#i.removeAttribute("open"))}async#w(){r.leer().full&&this.setAttribute("full",""),this.full||await this.#k(),await this.#f()}async#k(){try{const{data:t}=await o.listarTodos();this.#t&&(this.#t.filas=t)}catch(t){p(`No se pudo cargar el cat\xE1logo: ${t instanceof Error?t.message:t}`,"danger")}}async#f(){const{tk:t,space:e}=r.leer();if(this.#t&&(this.#t.seleccionado=t??""),!t){this.#d&&(this.#d.ticket=null),this.#n&&(this.#n.ticket=null);return}await this.#y(t,e??"patyia")}async#y(t,e){if(this.#c)return;this.#c=!0;const a=this.#e.querySelector(".visor");a?.replaceChildren(n`
      <div class="cargando">
        <is-spinner aria-hidden="true"></is-spinner>
        Cargando ${t}…
      </div>
    `);try{const{data:i}=await o.ticket(e,t);this.#d=Object.assign(document.createElement("tk-view"),{ticket:i}),this.#n&&(this.#n.ticket=i),a?.replaceChildren(this.#d),document.title=`${i.iticket} \xB7 ${i.titulo??"Tiquete"}`}catch(i){this.#n&&(this.#n.ticket=null),a?.replaceChildren(n`
        <div class="cargando">
          <is-callout color="danger" icon="mdi:alert-circle-outline">
            No se pudo abrir ${t}: ${i instanceof Error?i.message:String(i)}
          </is-callout>
        </div>
      `)}finally{this.#c=!1}}#x(){for(;this.#e.firstChild;)this.#e.removeChild(this.#e.firstChild);const t=document.createElement("div");if(t.className="visor",this.full){this.#e.append(t);return}this.#t=document.createElement("tk-nav"),this.#t.addEventListener("tk-seleccion",i=>{const{iticket:s,space:d}=i.detail;r.escribir({tk:s,space:d}),this.#f(),this.#u()}),this.#n=document.createElement("tk-actions"),this.#s=document.createElement("aside"),this.#s.className="rail",this.#s.slot="start",this.#s.setAttribute("aria-label","Cat\xE1logo de tiquetes"),this.#s.appendChild(this.#t),t.slot="end",this.#a=document.createElement("is-split-panel"),this.#a.className="split",this.#a.setAttribute("orientation","horizontal"),this.#a.setAttribute("primary","start"),this.#a.setAttribute("position-in-pixels",String(l)),this.#a.setAttribute("storage-key","tk-app-nav"),this.#a.append(this.#s,t),this.#e.append(n`
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
        <span class="acciones-tk">${this.#n}</span>
        <is-theme-toggle></is-theme-toggle>
      </header>
      <div class="cuerpo">${this.#a}</div>
      <is-drawer id="navDrawer" placement="start" label="Catálogo de tiquetes" light-dismiss>
        <div class="drawer__mount"></div>
      </is-drawer>
    `),this.#o=this.#e.querySelector(".nav-btn"),this.#i=this.#e.querySelector("#navDrawer"),this.#h=this.#e.querySelector(".drawer__mount"),this.#e.querySelector(".filtros")?.addEventListener("is-tab-show",i=>{const s=String(i.detail?.name??"all");this.#t&&(this.#t.contexto=s)}),this.#o?.addEventListener("click",()=>{this.#r?this.#u():this.#b()}),this.#i?.addEventListener("is-show",()=>{this.#r=!0,this.#o?.setAttribute("aria-expanded","true"),queueMicrotask(()=>{this.#t?.shadowRoot?.querySelector("input, is-input")?.focus?.()})});const a=()=>{this.#r=!1,this.#o?.setAttribute("aria-expanded","false"),this.#m("rail")};this.#i?.addEventListener("is-after-hide",a),this.#i?.addEventListener("is-hide",()=>{this.#r&&a()}),this.#l=matchMedia(m),this.#l.addEventListener("change",this.#v),this.#g(this.#l.matches)}}c("tk-app",f);
