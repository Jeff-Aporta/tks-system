import{css as a,define as n,estadoColor as c,fecha as l,html as r}from"./_shared.js";const d=`
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
  .grupo {
    position: sticky;
    top: 0;
    z-index: 1;
    padding: 0.95rem 0.55rem 0.45rem;
    backdrop-filter: blur(8px);
    background: color-mix(in srgb, var(--is-bg, #0b0d10) 82%, transparent);
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.6875rem;
    font-weight: 650;
    letter-spacing: 0.11em;
    text-transform: uppercase;
  }
  .grupo span { color: var(--is-text-soft, #c3ced9); font-weight: 500; }
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
  .punto {
    width: 0.4rem;
    height: 0.4rem;
    flex: none;
    border-radius: 50%;
    background: var(--punto);
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
`,u={success:"var(--is-color-success-500, #2f9e44)",warning:"var(--is-color-warning-500, #f08c00)",info:"var(--is-accent, #1a6eb0)",neutral:"var(--is-text-muted, #9aa7b4)"},p={patyia:"PatyIA",clientesis:"Clientes"};class h extends HTMLElement{#e=[];#i="";#s="";#t;constructor(){super(),this.#t=this.attachShadow({mode:"open"}),a(this.#t,d)}connectedCallback(){this.#o()}get filas(){return this.#e}set filas(t){this.#e=t??[],this.isConnected&&this.#o()}get seleccionado(){return this.#i}set seleccionado(t){this.#i!==t&&(this.#i=t??"",this.isConnected&&this.#a())}#a(){for(const t of this.#t.querySelectorAll(".tk"))t.setAttribute("aria-current",String(t.dataset.tk===this.#i))}#n(){const t=this.#s.trim().toLowerCase();return t?this.#e.filter(e=>[e.iticket,e.titulo,e.resumen].some(i=>String(i??"").toLowerCase().includes(t))):this.#e}#c(t){this.dispatchEvent(new CustomEvent("tk-seleccion",{detail:{iticket:t.iticket,space:t.space},bubbles:!0,composed:!0}))}#o(){for(;this.#t.firstChild;)this.#t.removeChild(this.#t.firstChild);const t=e=>{this.#s=String(e.target.value??"");const i=this.#t.querySelector(".lista");i&&i.replaceWith(this.#r())};this.#t.append(r`
      <div class="buscador">
        <is-input
          type="search"
          placeholder="Buscar tiquete…"
          value="${this.#s}"
          onis-input=${t}
        >
          <is-icon slot="start" icon="mdi:magnify" aria-hidden="true"></is-icon>
        </is-input>
      </div>
      ${this.#r()}
    `)}#r(){const t=this.#n(),e=new Map;for(const i of t){const o=String(i.space??"otros");e.has(o)||e.set(o,[]),e.get(o).push(i)}return t.length?r`
      <div class="lista">
        ${[...e.entries()].map(([i,o])=>r`
          <p class="grupo">${p[i]??i} <span>${o.length}</span></p>
          ${o.map(s=>r`
            <button
              class="tk"
              type="button"
              data-tk="${s.iticket}"
              aria-current="${String(s.iticket===this.#i)}"
              onclick=${()=>this.#c(s)}
            >
              <span class="meta">
                <span
                  class="punto"
                  style="--punto: ${u[c(s.estado)]}"
                  aria-hidden="true"
                ></span>
                <span class="codigo">${s.iticket}</span>
                ${s.fechaSolicitud?r`<span class="fecha">${l(s.fechaSolicitud)}</span>`:null}
              </span>
              <span class="titulo">${String(s.titulo??"Sin t\xEDtulo")}</span>
            </button>
          `)}
        `)}
      </div>
    `:r`
        <div class="lista">
          <p class="vacio">
            ${this.#e.length?"Ning\xFAn tiquete coincide con la b\xFAsqueda.":"Cargando tiquetes\u2026"}
          </p>
        </div>
      `}}n("tk-nav",h);
