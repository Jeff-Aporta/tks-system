import{css as p,define as h,html as a,rec as m}from"./_shared.js";import"./tk-metrics.js";import"./tk-ticket-head.js";import"./tk-commits.js";import"./tk-block.js";const f=`
  :host {
    display: block;
    position: relative;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    container-type: inline-size;
    /* Sin medida de lectura: el documento ocupa todo el ancho del visor. Con un
       tope en unidades ch quedaba una franja muerta a la derecha. */
    --tk-measure: 100%;
    /* El video tambi\xE9n toma el ancho completo de la columna. */
    --tk-video-max: 100%;
    color: var(--is-text, #e6edf3);
    font-family: var(--is-font-sans, system-ui, -apple-system, "Segoe UI", sans-serif);
    overflow-wrap: break-word;
  }
  .shell {
    position: relative;
    min-width: 0;
  }
  .documento {
    display: grid;
    gap: clamp(1.35rem, 1rem + 1.5vw, 2rem);
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    margin: 0;
    padding: clamp(0.9rem, 0.4rem + 1.6vw, 2.25rem) clamp(0.85rem, 0.4rem + 1.8vw, 2.5rem);
  }
  .encabezado,
  section,
  tk-ticket-head,
  tk-block,
  tk-commits,
  tk-metrics {
    min-width: 0;
    max-width: 100%;
  }
  section {
    display: grid;
    gap: 0.9rem;
    padding-top: 0.15rem;
  }
  @container (max-width: 36rem) {
    .documento {
      gap: 1.25rem;
      padding-inline: 0.85rem;
    }
  }
  .rotulo {
    display: flex;
    align-items: center;
    gap: 0.75em;
    margin: 0 0 0.15rem;
    min-width: 0;
    color: var(--is-text, #e6edf3);
    font-size: 0.72rem;
    font-weight: 650;
    letter-spacing: 0.11em;
    text-transform: uppercase;
  }
  .rotulo::after {
    height: 1px;
    flex: 1;
    min-width: 1rem;
    background: linear-gradient(
      to right,
      var(--is-border, #2a3038),
      transparent
    );
    content: "";
  }
  .vacio {
    display: grid;
    gap: 0.6rem;
    padding: 3rem 1rem;
    color: var(--is-text, #e6edf3);
    text-align: center;
  }
  .firma {
    margin-top: 0.5rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--is-border-soft, #1f242b);
    color: var(--is-text, #e6edf3);
    font-size: 0.75rem;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }
  .fab {
    position: sticky;
    bottom: 1.15rem;
    z-index: 6;
    display: flex;
    justify-content: flex-end;
    box-sizing: border-box;
    width: 100%;
    height: 0;
    margin: 0;
    padding: 0 clamp(0.85rem, 0.4rem + 1.8vw, 2.5rem);
    pointer-events: none;
    transform: translateY(-3.4rem);
  }
  .fab-btn {
    pointer-events: auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.85rem;
    height: 2.85rem;
    margin: 0;
    padding: 0;
    border: 1px solid color-mix(in srgb, var(--is-border, #2a3038) 80%, transparent);
    border-radius: 999px;
    background: color-mix(in srgb, var(--is-bg-elevated, #1a2129) 92%, transparent);
    color: var(--is-text, #e6edf3);
    box-shadow:
      0 10px 28px rgba(0, 0, 0, 0.28),
      inset 0 1px 0 rgba(255, 255, 255, 0.06);
    cursor: pointer;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease;
  }
  .fab-btn:hover {
    transform: translateY(-1px);
    border-color: color-mix(in srgb, var(--is-accent, #1a6eb0) 55%, var(--is-border, #2a3038));
    background: color-mix(in srgb, var(--is-accent, #1a6eb0) 18%, var(--is-bg-elevated, #1a2129));
  }
  .fab-btn:focus-visible {
    outline: 2px solid var(--is-accent, #1a6eb0);
    outline-offset: 2px;
  }
  .fab-btn is-icon {
    font-size: 1.35rem;
  }
  .fab-btn[aria-pressed="true"] {
    color: var(--is-accent, #1a6eb0);
  }
`,g=[{lane:"solicitud",rotulo:"Solicitud"},{lane:"evidencias",rotulo:"Evidencias"},{lane:"causa",rotulo:"Causa"},{lane:"solucion",rotulo:"Soluci\xF3n"},{lane:"verificacion",rotulo:"Verificaci\xF3n"},{lane:"otros",rotulo:"Detalle"}],v=r=>{const e=Array.isArray(r.content)&&r.content.length?[...r.content]:[...r.doc?.blocks??[]],t=(r.contexts??[]).flatMap(i=>[...i.content??[]]);return[...e,...t].filter(i=>i&&typeof i=="object").sort((i,n)=>(i.sortkey??0)-(n.sortkey??0))},k=(r,e)=>{const t=m(r.payload),i=String(t.docLane??t.section??t.lane??"").trim().toLowerCase();if(i==="solicitud"||i==="evidencias"||i==="causa"||i==="solucion"||i==="verificacion"||i==="otros")return i;const n=String(t.title??"").toLowerCase().normalize("NFD").replace(/\p{M}/gu,"");if(/^solicitud|^objetivo|requerimiento insoft|^requerimiento\b/.test(n))return"solicitud";if(/^evidencia|informacion del tiquete|pantallazo|captura/.test(n))return"evidencias";if(/hipotesis|causa identificada|causa del problema|^causa\b|antecedente|analisis realizado|diagnostico|raiz del problema/.test(n))return"causa";if(/verificacion\b|validacion\b|investigacion y pruebas|como probar|pruebas realizadas/.test(n))return"verificacion";if(/solucion aplicada|solucion entregada|^solucion\b|cambios en base de datos|resultado\b|conclusion|catalogo por tipo|resumen de tiempos/.test(n))return"solucion";const o=String(r.kind??"").toLowerCase();return o==="html"||o==="image"||o==="image-group"?e==="otros"?"evidencias":e:o==="badge"||o==="badges"?e==="otros"?"solicitud":e:o==="code"||o==="sql"||o==="cambio-bd"||o==="file-tree"?e==="otros"?"solucion":e:o==="steps"||o==="stepper"?e==="otros"?"verificacion":e:o==="table"&&e==="otros"?"evidencias":o==="markdown"||o==="md"||o==="text"?n?"otros":e:"otros"},x=r=>{let e="solicitud";return r.map(t=>{const i=k(t,e);return e=i,{b:t,lane:i}})},w=r=>{const e=[...r.rootCommits??[]];return e.length?e:(r.contexts??[]).flatMap(t=>[...t.commits??[]])},c=r=>String(r||"").trim().toLowerCase()==="metrics"?"metrics":"doc";class T extends HTMLElement{static get observedAttributes(){return["embebido","modo"]}#o=null;#e="doc";#t;constructor(){super(),this.#t=this.attachShadow({mode:"open"}),p(this.#t,f)}connectedCallback(){this.#e=c(this.getAttribute("modo")),this.#i()}attributeChangedCallback(e,t,i){e==="modo"&&(this.#e=c(i)),this.isConnected&&this.#i()}get ticket(){return this.#o}set ticket(e){this.#o=e,this.isConnected&&this.#i()}set json(e){const t=m(e);this.ticket=t.ticket?t.ticket:t}get embebido(){return this.hasAttribute("embebido")}set embebido(e){this.toggleAttribute("embebido",!!e)}get modo(){return this.#e}set modo(e){const t=c(String(e));this.#e!==t&&(this.#e=t,this.setAttribute("modo",t),this.dispatchEvent(new CustomEvent("tk-modo",{bubbles:!0,composed:!0,detail:{modo:t}})),this.isConnected&&this.#i())}#r=()=>{this.modo=this.#e==="doc"?"metrics":"doc"};#n(e){const t=x(v(e)),i=Object.assign(document.createElement("tk-ticket-head"),{ticket:e}),n=w(e),o=g.map(({lane:b,rotulo:l})=>{const d=t.filter(s=>s.lane===b).map(s=>s.b);return d.length?a`
        <section aria-label="${l}">
          <h2 class="rotulo">${l}</h2>
          ${d.map(s=>Object.assign(document.createElement("tk-block"),{bloque:s}))}
        </section>
      `:null}).filter(Boolean),u=n.length?a`
        <section aria-label="Commits">
          <h2 class="rotulo">Commits</h2>
          ${Object.assign(document.createElement("tk-commits"),{commits:n})}
        </section>
      `:null;return a`
      <article class="documento" data-modo="doc">
        <header class="encabezado">${i}</header>
        ${o.length>0?o:a`
          <is-callout color="neutral" icon="mdi:text-box-remove-outline">
            Este tiquete todavía no tiene documentación publicada.
          </is-callout>
        `}
        ${u}
        <footer class="firma">
          ${e.iticket} · ${e.space==="patyia"?"PatyIA":e.space==="isp-svelte"?"ISP Svelte":"Clientes"} ·
          documentación generada desde jagudeloe-tks
        </footer>
      </article>
    `}#a(e){return a`
      <div class="documento" data-modo="metrics">
        ${Object.assign(document.createElement("tk-metrics"),{ticket:e})}
      </div>
    `}#i(){for(;this.#t.firstChild;)this.#t.removeChild(this.#t.firstChild);const e=this.#o;if(!e?.iticket){this.#t.append(a`
        <div class="vacio">
          <is-icon icon="mdi:file-document-outline" style="font-size:2rem" aria-hidden="true"></is-icon>
          <p>Selecciona un tiquete para ver su documentación.</p>
        </div>
      `);return}const t=this.#e==="metrics",i=t?"mdi:file-document-outline":"mdi:chart-timeline-variant",n=t?"Ver documentaci\xF3n":"Ver m\xE9tricas InSoft";this.#t.append(a`
      <div class="shell">
        ${t?this.#a(e):this.#n(e)}
        <div class="fab">
          <button
            type="button"
            class="fab-btn"
            aria-label="${n}"
            title="${n}"
            aria-pressed="${t?"true":"false"}"
            onclick=${this.#r}
          >
            <is-icon icon="${i}" aria-hidden="true"></is-icon>
          </button>
        </div>
      </div>
    `)}}h("tk-view",T);
