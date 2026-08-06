import{css as g,define as f,html as s,rec as l}from"./_shared.js";import"./tk-metrics.js";import"./tk-ticket-head.js";import"./tk-commits.js";import"./tk-block.js";const h=`
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
    /* Video: tope legible centrado \u2014 100% se com\xEDa la columna (TK view). */
    --tk-video-max: 36rem;
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
`,k=[{lane:"solicitud",rotulo:"Solicitud"},{lane:"evidencias",rotulo:"Evidencias"},{lane:"causa",rotulo:"Causa"},{lane:"solucion",rotulo:"Soluci\xF3n"},{lane:"verificacion",rotulo:"Verificaci\xF3n"},{lane:"otros",rotulo:"Detalle"}],v=i=>{const e=new Set;return i.filter(t=>{const o=String(t.kind??"").toLowerCase();if(o!=="image"&&o!=="image-group")return!0;const n=l(t.payload),r=String(n.url??n.src??"").trim().split("?")[0]??"";return r?e.has(r)?!1:(e.add(r),!0):!0})},x=i=>{const e=Array.isArray(i.content)&&i.content.length?[...i.content]:[...i.doc?.blocks??[]],t=(i.contexts??[]).flatMap(o=>[...o.content??[]]);return v([...e,...t].filter(o=>o&&typeof o=="object").sort((o,n)=>(o.sortkey??0)-(n.sortkey??0)))},w=(i,e)=>{const t=l(i.payload),o=String(t.docLane??t.section??t.lane??"").trim().toLowerCase();if(o==="solicitud"||o==="evidencias"||o==="causa"||o==="solucion"||o==="verificacion"||o==="otros")return o;const n=String(t.title??"").toLowerCase().normalize("NFD").replace(/\p{M}/gu,"");if(/^solicitud|^objetivo|requerimiento insoft|^requerimiento\b/.test(n))return"solicitud";if(/^evidencia|informacion del tiquete|pantallazo|captura/.test(n))return"evidencias";if(/hipotesis|causa identificada|causa del problema|^causa\b|antecedente|analisis realizado|diagnostico|raiz del problema/.test(n))return"causa";if(/verificacion\b|validacion\b|investigacion y pruebas|como probar|pruebas realizadas/.test(n))return"verificacion";if(/solucion aplicada|solucion entregada|^solucion\b|cambios en base de datos|resultado\b|conclusion|catalogo por tipo|resumen de tiempos/.test(n))return"solucion";const r=String(i.kind??"").toLowerCase();return r==="html"||r==="image"||r==="image-group"?e==="otros"?"evidencias":e:r==="badge"||r==="badges"?e==="otros"?"solicitud":e:r==="code"||r==="sql"||r==="cambio-bd"||r==="file-tree"?e==="otros"?"solucion":e:r==="steps"||r==="stepper"?e==="otros"?"verificacion":e:r==="table"&&e==="otros"?"evidencias":r==="markdown"||r==="md"||r==="text"?n?"otros":e:"otros"},T=i=>{let e="solicitud";return i.map(t=>{const o=w(t,e);return e=o,{b:t,lane:o}})},y=i=>{const e=String(i.kind??"").toLowerCase();return e==="image"||e==="image-group"},b=i=>{const e=l(i.payload),t=String(e.caption??"").trim()||String(e.title??"").trim(),o=Array.isArray(i.blocks)?i.blocks:[];return String(i.kind??"").toLowerCase()==="image-group"&&o.length?i:{...i,kind:"image",payload:{...e,caption:t,title:""},blocks:void 0}},C=i=>{const e=[];let t=[];const o=()=>{if(t.length){if(t.length===1)e.push(t[0]);else{const n=t.flatMap(a=>String(a.kind??"").toLowerCase()==="image-group"&&Array.isArray(a.blocks)&&a.blocks.length?a.blocks.map(b):[b(a)]),r=l(t[0].payload).docLane;e.push({kind:"image-group",sortkey:t[0].sortkey,payload:r?{docLane:r}:{},blocks:n})}t=[]}};for(const n of i)y(n)?t.push(n):(o(),e.push(n));return o(),e},S=i=>{const e=[...i.rootCommits??[]];return e.length?e:(i.contexts??[]).flatMap(t=>[...t.commits??[]])},m=i=>String(i||"").trim().toLowerCase()==="metrics"?"metrics":"doc";class L extends HTMLElement{static get observedAttributes(){return["embebido","modo"]}#i=null;#e="doc";#t;constructor(){super(),this.#t=this.attachShadow({mode:"open"}),g(this.#t,h)}connectedCallback(){this.#e=m(this.getAttribute("modo")),this.#o()}attributeChangedCallback(e,t,o){e==="modo"&&(this.#e=m(o)),this.isConnected&&this.#o()}get ticket(){return this.#i}set ticket(e){this.#i=e,this.isConnected&&this.#o()}set json(e){const t=l(e);this.ticket=t.ticket?t.ticket:t}get embebido(){return this.hasAttribute("embebido")}set embebido(e){this.toggleAttribute("embebido",!!e)}get modo(){return this.#e}set modo(e){const t=m(String(e));this.#e!==t&&(this.#e=t,this.setAttribute("modo",t),this.dispatchEvent(new CustomEvent("tk-modo",{bubbles:!0,composed:!0,detail:{modo:t}})),this.isConnected&&this.#o())}#r=()=>{this.modo=this.#e==="doc"?"metrics":"doc"};#n(e){const t=T(x(e)),o=Object.assign(document.createElement("tk-ticket-head"),{ticket:e}),n=S(e),r=k.map(({lane:d,rotulo:u})=>{const p=C(t.filter(c=>c.lane===d).map(c=>c.b));return p.length?s`
        <section aria-label="${u}" data-lane="${d}">
          <h2 class="rotulo">${u}</h2>
          ${p.map(c=>Object.assign(document.createElement("tk-block"),{bloque:c}))}
        </section>
      `:null}).filter(Boolean),a=n.length?s`
        <section aria-label="Commits">
          <h2 class="rotulo">Commits</h2>
          ${Object.assign(document.createElement("tk-commits"),{commits:n})}
        </section>
      `:null;return s`
      <article class="documento" data-modo="doc">
        <header class="encabezado">${o}</header>
        ${r.length>0?r:s`
          <is-callout color="neutral" icon="mdi:text-box-remove-outline">
            Este tiquete todavía no tiene documentación publicada.
          </is-callout>
        `}
        ${a}
        <footer class="firma">
          ${e.iticket} · ${e.space==="patyia"?"PatyIA":e.space==="isp-svelte"?"ISP Svelte":"Clientes"} ·
          documentación generada desde jagudeloe-tks
        </footer>
      </article>
    `}#a(e){return s`
      <div class="documento" data-modo="metrics">
        ${Object.assign(document.createElement("tk-metrics"),{ticket:e})}
      </div>
    `}#o(){for(;this.#t.firstChild;)this.#t.removeChild(this.#t.firstChild);const e=this.#i;if(!e?.iticket){this.#t.append(s`
        <div class="vacio">
          <is-icon icon="mdi:file-document-outline" style="font-size:2rem" aria-hidden="true"></is-icon>
          <p>Selecciona un tiquete para ver su documentación.</p>
        </div>
      `);return}const t=this.#e==="metrics",o=t?"mdi:file-document-outline":"mdi:chart-timeline-variant",n=t?"Ver documentaci\xF3n":"Ver m\xE9tricas InSoft";this.#t.append(s`
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
            <is-icon icon="${o}" aria-hidden="true"></is-icon>
          </button>
        </div>
      </div>
    `)}}f("tk-view",L);
