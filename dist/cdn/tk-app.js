import{css as h,define as c,html as r}from"./_shared.js";import{aviso as p,estado as n}from"./estado.js";import{api as o}from"./api.js";const m="(max-width: 48rem)",l=280,u=`
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
    font-size: 0.9375rem;
    font-weight: 640;
    letter-spacing: -0.015em;

    is-icon { flex: none; color: var(--is-accent, #1a6eb0); font-size: 1.25rem; }
    small {
      overflow: hidden;
      color: var(--is-text-muted, #9aa7b4);
      font-size: 0.75rem;
      font-weight: 500;
      letter-spacing: 0;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
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
    .marca small { display: none; }
  }
`;class f extends HTMLElement{static get observedAttributes(){return["full"]}#i;#t=null;#s=null;#a=null;#h=null;#e=null;#o=null;#r=null;#l=null;#n=!1;#d=null;#c=!1;#p=l;constructor(){super(),this.#i=this.attachShadow({mode:"open"}),h(this.#i,u)}connectedCallback(){this.#y(),this.#w(),addEventListener("popstate",()=>{this.#f()})}disconnectedCallback(){this.#l?.removeEventListener("change",this.#g)}get full(){return this.hasAttribute("full")}#g=()=>{this.#v(!!this.#l?.matches)};#v(t){this.toggleAttribute("compact",t),!t&&this.#n&&this.#u(),t||this.#m("rail");const i=this.#a;if(i)if(i.disabled=t,t){const a=Number(i.positionInPixels);Number.isFinite(a)&&a>0&&(this.#p=a),i.positionInPixels=0}else{const a=this.#p>0?this.#p:l;i.positionInPixels=a}}#m(t){if(!this.#t||!this.#s||!this.#h)return;const i=t==="rail"?this.#s:this.#h;this.#t.parentElement!==i&&i.appendChild(this.#t)}#b(){!this.#e||this.#n||(this.#m("drawer"),this.#e.show?.(),this.#e.setAttribute("open",""))}#u(){!this.#e||!this.#n||(this.#e.hide?.(),this.#e.removeAttribute("open"))}async#w(){n.leer().full&&this.setAttribute("full",""),this.full||await this.#k(),await this.#f()}async#k(){try{const{data:t}=await o.listarTodos();this.#t&&(this.#t.filas=t)}catch(t){p(`No se pudo cargar el cat\xE1logo: ${t instanceof Error?t.message:t}`,"danger")}}async#f(){const{tk:t,space:i}=n.leer();if(this.#t&&(this.#t.seleccionado=t??""),!t){this.#d&&(this.#d.ticket=null),this.#r&&(this.#r.ticket=null);return}await this.#x(t,i??"patyia")}async#x(t,i){if(this.#c)return;this.#c=!0;const a=this.#i.querySelector(".visor");a?.replaceChildren(r`
      <div class="cargando">
        <is-spinner aria-hidden="true"></is-spinner>
        Cargando ${t}…
      </div>
    `);try{const{data:e}=await o.ticket(i,t);this.#d=Object.assign(document.createElement("tk-view"),{ticket:e}),this.#r&&(this.#r.ticket=e),a?.replaceChildren(this.#d),document.title=`${e.iticket} \xB7 ${e.titulo??"Tiquete"}`}catch(e){this.#r&&(this.#r.ticket=null),a?.replaceChildren(r`
        <div class="cargando">
          <is-callout color="danger" icon="mdi:alert-circle-outline">
            No se pudo abrir ${t}: ${e instanceof Error?e.message:String(e)}
          </is-callout>
        </div>
      `)}finally{this.#c=!1}}#y(){for(;this.#i.firstChild;)this.#i.removeChild(this.#i.firstChild);const t=document.createElement("div");if(t.className="visor",this.full){this.#i.append(t);return}this.#t=document.createElement("tk-nav"),this.#t.addEventListener("tk-seleccion",e=>{const{iticket:s,space:d}=e.detail;n.escribir({tk:s,space:d}),this.#f(),this.#u()}),this.#r=document.createElement("tk-actions"),this.#s=document.createElement("aside"),this.#s.className="rail",this.#s.slot="start",this.#s.setAttribute("aria-label","Cat\xE1logo de tiquetes"),this.#s.appendChild(this.#t),t.slot="end",this.#a=document.createElement("is-split-panel"),this.#a.className="split",this.#a.setAttribute("orientation","horizontal"),this.#a.setAttribute("primary","start"),this.#a.setAttribute("position-in-pixels",String(l)),this.#a.setAttribute("storage-key","tk-app-nav"),this.#a.append(this.#s,t),this.#i.append(r`
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
        <is-tab-group class="filtros" active="all" without-scroll-controls>
          <is-tab slot="nav" panel="all">Todo</is-tab>
          <is-tab slot="nav" panel="patyia">PatyIA</is-tab>
          <is-tab slot="nav" panel="clientesis">Clientes</is-tab>
          <is-tab-panel name="all"></is-tab-panel>
          <is-tab-panel name="patyia"></is-tab-panel>
          <is-tab-panel name="clientesis"></is-tab-panel>
        </is-tab-group>
        <span class="relleno"></span>
        <span class="acciones-tk">${this.#r}</span>
        <is-theme-toggle></is-theme-toggle>
      </header>
      <div class="cuerpo">${this.#a}</div>
      <is-drawer id="navDrawer" placement="start" label="Catálogo de tiquetes" light-dismiss>
        <div class="drawer__mount"></div>
      </is-drawer>
    `),this.#o=this.#i.querySelector(".nav-btn"),this.#e=this.#i.querySelector("#navDrawer"),this.#h=this.#i.querySelector(".drawer__mount"),this.#i.querySelector(".filtros")?.addEventListener("is-tab-show",e=>{const s=String(e.detail?.name??"all");this.#t&&(this.#t.contexto=s)}),this.#o?.addEventListener("click",()=>{this.#n?this.#u():this.#b()}),this.#e?.addEventListener("is-show",()=>{this.#n=!0,this.#o?.setAttribute("aria-expanded","true"),queueMicrotask(()=>{this.#t?.shadowRoot?.querySelector("input, is-input")?.focus?.()})});const a=()=>{this.#n=!1,this.#o?.setAttribute("aria-expanded","false"),this.#m("rail")};this.#e?.addEventListener("is-after-hide",a),this.#e?.addEventListener("is-hide",()=>{this.#n&&a()}),this.#l=matchMedia(m),this.#l.addEventListener("change",this.#g),this.#v(this.#l.matches)}}c("tk-app",f);
