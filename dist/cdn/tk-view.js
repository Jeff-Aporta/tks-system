import{css as g,define as b,html as c,rec as d}from"./_shared.js";import{api as f}from"./api.js";import{sanearTicket as k}from"./sanear.js";import"./tk-metrics.js";import"./tk-ticket-head.js";import"./tk-commits.js";import"./tk-block.js";const v=`
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
  .vacio .detalle {
    margin: 0;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.8125rem;
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
`,T=[{lane:"solicitud",rotulo:"Solicitud"},{lane:"evidencias",rotulo:"Evidencias"},{lane:"causa",rotulo:"Causa"},{lane:"solucion",rotulo:"Soluci\xF3n"},{lane:"verificacion",rotulo:"Verificaci\xF3n"},{lane:"otros",rotulo:"Detalle"}],w=o=>{const t=new Set;return o.filter(e=>{const i=String(e.kind??"").toLowerCase();if(i!=="image"&&i!=="image-group")return!0;const s=d(e.payload),r=String(s.url??s.src??"").trim().split("?")[0]??"";return r?t.has(r)?!1:(t.add(r),!0):!0})},x=o=>{const t=Array.isArray(o.content)&&o.content.length?[...o.content]:[...o.doc?.blocks??[]],e=(o.contexts??[]).flatMap(i=>[...i.content??[]]);return w([...t,...e].filter(i=>i&&typeof i=="object").sort((i,s)=>(i.sortkey??0)-(s.sortkey??0)))},y=(o,t)=>{const e=d(o.payload),i=String(e.docLane??e.section??e.lane??"").trim().toLowerCase();if(i==="solicitud"||i==="evidencias"||i==="causa"||i==="solucion"||i==="verificacion"||i==="otros")return i;const s=String(e.title??"").toLowerCase().normalize("NFD").replace(/\p{M}/gu,"");if(/^solicitud|^objetivo|requerimiento insoft|^requerimiento\b/.test(s))return"solicitud";if(/^evidencia|informacion del tiquete|pantallazo|captura/.test(s))return"evidencias";if(/hipotesis|causa identificada|causa del problema|^causa\b|antecedente|analisis realizado|diagnostico|raiz del problema/.test(s))return"causa";if(/verificacion\b|validacion\b|investigacion y pruebas|como probar|pruebas realizadas/.test(s))return"verificacion";if(/solucion aplicada|solucion entregada|^solucion\b|cambios en base de datos|resultado\b|conclusion|catalogo por tipo|resumen de tiempos/.test(s))return"solucion";const r=String(o.kind??"").toLowerCase();return r==="html"||r==="image"||r==="image-group"?t==="otros"?"evidencias":t:r==="badge"||r==="badges"?t==="otros"?"solicitud":t:r==="code"||r==="sql"||r==="cambio-bd"||r==="file-tree"?t==="otros"?"solucion":t:r==="steps"||r==="stepper"?t==="otros"?"verificacion":t:r==="table"&&t==="otros"?"evidencias":r==="markdown"||r==="md"||r==="text"?s?"otros":t:"otros"},C=o=>{let t="solicitud";return o.map(e=>{const i=y(e,t);return t=i,{b:e,lane:i}})},S=o=>{const t=String(o.kind??"").toLowerCase();return t==="image"||t==="image-group"},h=o=>{const t=d(o.payload),e=String(t.caption??"").trim()||String(t.title??"").trim(),i=Array.isArray(o.blocks)?o.blocks:[];return String(o.kind??"").toLowerCase()==="image-group"&&i.length?o:{...o,kind:"image",payload:{...t,caption:e,title:""},blocks:void 0}},A=o=>{const t=[];let e=[];const i=()=>{if(e.length){if(e.length===1)t.push(e[0]);else{const s=e.flatMap(n=>String(n.kind??"").toLowerCase()==="image-group"&&Array.isArray(n.blocks)&&n.blocks.length?n.blocks.map(h):[h(n)]),r=d(e[0].payload).docLane;t.push({kind:"image-group",sortkey:e[0].sortkey,payload:r?{docLane:r}:{},blocks:s})}e=[]}};for(const s of o)S(s)?e.push(s):(i(),t.push(s));return i(),t},$=o=>{const t=[...o.rootCommits??[]];return t.length?t:(o.contexts??[]).flatMap(e=>[...e.commits??[]])},m=o=>String(o||"").trim().toLowerCase()==="metrics"?"metrics":"doc",L=24,E=o=>{const t=String(o||"").trim().toLowerCase();return t==="clientesis"||t==="isp-svelte"?t:"patyia"};class z extends HTMLElement{static get observedAttributes(){return["embebido","modo","tk","space"]}#o=null;#e="doc";#t;#r="inicial";#s="";#a=0;constructor(){super(),this.#t=this.attachShadow({mode:"open"}),g(this.#t,v)}connectedCallback(){this.#e=m(this.getAttribute("modo")),this.getAttribute("tk")&&!this.#o?this.cargar():this.#i()}attributeChangedCallback(t,e,i){if(t==="modo"&&(this.#e=m(i)),!!this.isConnected){if((t==="tk"||t==="space")&&e!==i&&this.getAttribute("tk")){this.cargar();return}this.#i()}}async cargar(){const t=String(this.getAttribute("tk")||"").trim();if(!t)return;const e=E(this.getAttribute("space")),i=Number(this.getAttribute("cache-horas"))||L,s=++this.#a;this.#r="cargando",this.#i();const r=(a,l)=>{s===this.#a&&(this.#o=this.hasAttribute("sanear")?k(a):a,this.#r="listo",this.#i(),this.dispatchEvent(new CustomEvent("tk-datos",{bubbles:!0,composed:!0,detail:{origen:l,ticket:this.#o}})))};try{const a=await f.ticket(e,t,{vigenciaMs:i*60*60*1e3});r(a.data,a.origen);return}catch(a){this.#s=a instanceof Error?a.message:String(a)}const n=this.getAttribute("fallback");if(n)try{const a=await fetch(n,{headers:{accept:"application/json"}});if(!a.ok)throw new Error(`HTTP ${a.status}`);const l=d(await a.json());r(l.ticket?l.ticket:l,"archivo local");return}catch(a){this.#s+=` \xB7 fallback: ${a instanceof Error?a.message:String(a)}`}s===this.#a&&(this.#r="error",this.#i(),this.dispatchEvent(new CustomEvent("tk-error",{bubbles:!0,composed:!0,detail:{error:this.#s}})))}get ticket(){return this.#o}set ticket(t){this.#o=t,this.isConnected&&this.#i()}set json(t){const e=d(t);this.ticket=e.ticket?e.ticket:e}get embebido(){return this.hasAttribute("embebido")}set embebido(t){this.toggleAttribute("embebido",!!t)}get modo(){return this.#e}set modo(t){const e=m(String(t));this.#e!==e&&(this.#e=e,this.setAttribute("modo",e),this.dispatchEvent(new CustomEvent("tk-modo",{bubbles:!0,composed:!0,detail:{modo:e}})),this.isConnected&&this.#i())}#n=()=>{this.modo=this.#e==="doc"?"metrics":"doc"};#c(t){const e=C(x(t)),i=Object.assign(document.createElement("tk-ticket-head"),{ticket:t}),s=$(t),r=T.map(({lane:a,rotulo:l})=>{const p=A(e.filter(u=>u.lane===a).map(u=>u.b));return p.length?c`
        <section aria-label="${l}" data-lane="${a}">
          <h2 class="rotulo">${l}</h2>
          ${p.map(u=>Object.assign(document.createElement("tk-block"),{bloque:u}))}
        </section>
      `:null}).filter(Boolean),n=s.length?c`
        <section aria-label="Commits">
          <h2 class="rotulo">Commits</h2>
          ${Object.assign(document.createElement("tk-commits"),{commits:s})}
        </section>
      `:null;return c`
      <article class="documento" data-modo="doc">
        <header class="encabezado">${i}</header>
        ${r.length>0?r:c`
          <is-callout color="neutral" icon="mdi:text-box-remove-outline">
            Este tiquete todavía no tiene documentación publicada.
          </is-callout>
        `}
        ${n}
        <footer class="firma">
          ${t.iticket} · ${t.space==="patyia"?"PatyIA":t.space==="isp-svelte"?"ISP Svelte":"Clientes"} ·
          documentación generada desde jagudeloe-tks
        </footer>
      </article>
    `}#l(t){return c`
      <div class="documento" data-modo="metrics">
        ${Object.assign(document.createElement("tk-metrics"),{ticket:t})}
      </div>
    `}#i(){for(;this.#t.firstChild;)this.#t.removeChild(this.#t.firstChild);const t=this.#o;if(!t?.iticket){if(this.#r==="cargando"){this.#t.append(c`
          <div class="vacio">
            <is-icon icon="mdi:progress-clock" style="font-size:2rem" aria-hidden="true"></is-icon>
            <p>Cargando ${this.getAttribute("tk")??"el tiquete"}…</p>
          </div>
        `);return}if(this.#r==="error"){const r=location.protocol==="file:";this.#t.append(c`
          <div class="vacio">
            <is-icon icon="mdi:cloud-off-outline" style="font-size:2rem" aria-hidden="true"></is-icon>
            <p>No se pudo obtener ${this.getAttribute("tk")??"el tiquete"}.</p>
            <p class="detalle">${this.#s}</p>
            ${r?c`<p class="detalle">
              La página está abierta como archivo local: el respaldo en disco necesita servirse por HTTP.
            </p>`:null}
          </div>
        `);return}this.#t.append(c`
        <div class="vacio">
          <is-icon icon="mdi:file-document-outline" style="font-size:2rem" aria-hidden="true"></is-icon>
          <p>Selecciona un tiquete para ver su documentación.</p>
        </div>
      `);return}const e=this.#e==="metrics",i=e?"mdi:file-document-outline":"mdi:chart-timeline-variant",s=e?"Ver documentaci\xF3n":"Ver m\xE9tricas InSoft";this.#t.append(c`
      <div class="shell">
        ${e?this.#l(t):this.#c(t)}
        <div class="fab">
          <button
            type="button"
            class="fab-btn"
            aria-label="${s}"
            title="${s}"
            aria-pressed="${e?"true":"false"}"
            onclick=${this.#n}
          >
            <is-icon icon="${i}" aria-hidden="true"></is-icon>
          </button>
        </div>
      </div>
    `)}}b("tk-view",z);
