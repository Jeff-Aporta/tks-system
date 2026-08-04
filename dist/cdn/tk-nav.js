import{css as a,define as r,estadoColor as c,fecha as l,html as s}from"./_shared.js";const d=`
  :host {
    display: flex;
    overflow: hidden;
    min-height: 0;
    flex-direction: column;
    color: var(--is-text, #e6edf3);
    font-family: var(--is-font-sans, system-ui, -apple-system, "Segoe UI", sans-serif);
  }
  .buscador {
    flex: none;
    padding: 0.8rem 0.75rem 0.55rem;
  }
  .lista {
    overflow-y: auto;
    min-height: 0;
    flex: 1;
    padding: 0 0.45rem 1rem;
    scrollbar-width: thin;
  }
  .tk {
    display: grid;
    width: 100%;
    gap: 0.3rem;
    margin: 0 0 0.2rem;
    padding: 0.65rem 0.7rem;
    border: 1px solid transparent;
    border-radius: 0.5rem;
    background: none;
    color: inherit;
    cursor: pointer;
    font: inherit;
    text-align: left;
    transition: background-color 130ms ease-out, border-color 130ms ease-out;

    &:hover { background: color-mix(in srgb, var(--is-accent, #1a6eb0) 10%, transparent); }
    &:focus-visible {
      outline: 2px solid var(--is-focus, #4c9be8);
      outline-offset: -2px;
    }
    &[aria-current="true"] {
      border-color: color-mix(in srgb, var(--is-accent, #1a6eb0) 55%, transparent);
      background: color-mix(in srgb, var(--is-accent, #1a6eb0) 16%, transparent);

      .titulo { font-weight: 600; }
    }
  }
  .meta {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    min-width: 0;
    color: var(--is-text-muted, #9aa7b4);
    font-family: var(--is-font-mono, ui-monospace, Menlo, monospace);
    font-size: 0.6875rem;
    letter-spacing: 0.03em;
  }
  .codigo {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .fecha {
    margin-left: auto;
    flex: none;
    opacity: 0.88;
    font-variant-numeric: tabular-nums;
  }
  @media (max-width: 22rem) {
    .fecha { display: none; }
  }
  .punto {
    width: 0.4rem;
    height: 0.4rem;
    flex: none;
    border-radius: 50%;
    background: var(--punto);
  }
  .ambito {
    flex: none;
    padding: 0.05em 0.4em;
    border-radius: 999px;
    background: color-mix(in srgb, var(--is-border-soft, #1f242b) 80%, transparent);
    color: var(--is-text-soft, #c3ced9);
    font-family: var(--is-font-sans, system-ui, sans-serif);
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }
  .titulo {
    display: -webkit-box;
    overflow: hidden;
    padding-left: calc(0.4rem + 0.45rem);
    font-size: 0.8125rem;
    line-height: 1.4;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .vacio {
    padding: 2rem 1rem;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.8125rem;
    text-align: center;
  }
`,u={success:"var(--is-color-success-500, #2f9e44)",warning:"var(--is-color-warning-500, #f08c00)",info:"var(--is-accent, #1a6eb0)",neutral:"var(--is-text-muted, #9aa7b4)"},h={patyia:"PatyIA",clientesis:"Clientes"},m=(o,t)=>String(t.fechaSolicitud??"").localeCompare(String(o.fechaSolicitud??""));class p extends HTMLElement{#s=[];#e="";#o="";#i="all";#t;constructor(){super(),this.#t=this.attachShadow({mode:"open"}),a(this.#t,d)}connectedCallback(){this.#n()}get filas(){return this.#s}set filas(t){this.#s=t??[],this.isConnected&&this.#n()}get seleccionado(){return this.#e}set seleccionado(t){this.#e!==t&&(this.#e=t??"",this.isConnected&&this.#r())}get contexto(){return this.#i}set contexto(t){const i=t==="patyia"||t==="clientesis"?t:"all";this.#i!==i&&(this.#i=i,this.isConnected&&this.#n())}#r(){for(const t of this.#t.querySelectorAll(".tk"))t.setAttribute("aria-current",String(t.dataset.tk===this.#e))}#c(){const t=this.#o.trim().toLowerCase(),i=this.#i;return[...this.#s].filter(e=>i==="all"?!0:String(e.space)===i).filter(e=>t?[e.iticket,e.titulo,e.resumen].some(n=>String(n??"").toLowerCase().includes(t)):!0).sort(m)}#l(t){this.dispatchEvent(new CustomEvent("tk-seleccion",{detail:{iticket:t.iticket,space:t.space},bubbles:!0,composed:!0}))}#n(){for(;this.#t.firstChild;)this.#t.removeChild(this.#t.firstChild);const t=i=>{this.#o=String(i.target.value??"");const e=this.#t.querySelector(".lista");e&&e.replaceWith(this.#a())};this.#t.append(s`
      <div class="buscador">
        <is-input
          type="search"
          placeholder="Buscar tiquete…"
          value="${this.#o}"
          onis-input=${t}
        >
          <is-icon slot="start" icon="mdi:magnify" aria-hidden="true"></is-icon>
        </is-input>
      </div>
      ${this.#a()}
    `)}#a(){const t=this.#c(),i=this.#i==="all";return t.length?s`
      <div class="lista">
        ${t.map(e=>s`
          <button
            class="tk"
            type="button"
            data-tk="${e.iticket}"
            aria-current="${String(e.iticket===this.#e)}"
            onclick=${()=>this.#l(e)}
          >
            <span class="meta">
              <span
                class="punto"
                style="--punto: ${u[c(e.estado)]}"
                aria-hidden="true"
              ></span>
              <span class="codigo">${e.iticket}</span>
              ${i?s`<span class="ambito">${h[String(e.space)]??e.space}</span>`:null}
              ${e.fechaSolicitud?s`<span class="fecha">${l(e.fechaSolicitud)}</span>`:null}
            </span>
            <span class="titulo">${String(e.titulo??"Sin t\xEDtulo")}</span>
          </button>
        `)}
      </div>
    `:s`
        <div class="lista">
          <p class="vacio">
            ${this.#s.length?"Ning\xFAn tiquete coincide con el filtro.":"Cargando tiquetes\u2026"}
          </p>
        </div>
      `}}r("tk-nav",p);
