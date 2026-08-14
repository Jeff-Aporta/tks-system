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
`,w=[{lane:"solicitud",rotulo:"Solicitud"},{lane:"evidencias",rotulo:"Evidencias"},{lane:"causa",rotulo:"Causa"},{lane:"solucion",rotulo:"Soluci\xF3n"},{lane:"verificacion",rotulo:"Verificaci\xF3n"},{lane:"otros",rotulo:"Detalle"}],T=r=>{const t=new Set;return r.filter(e=>{const a=String(e.kind??"").toLowerCase();if(a!=="image"&&a!=="image-group")return!0;const i=d(e.payload),o=String(i.url??i.src??"").trim().split("?")[0]??"";return o?t.has(o)?!1:(t.add(o),!0):!0})},x=new Set(["video","youtube"]),y=()=>{try{return new URLSearchParams(location.search).get("mode-tkt")==="free"}catch{return!1}},C=r=>{const t=Array.isArray(r.content)&&r.content.length?[...r.content]:[...r.doc?.blocks??[]],e=(r.contexts??[]).flatMap(i=>[...i.content??[]]),a=y();return T([...t,...e].filter(i=>i&&typeof i=="object").filter(i=>a||!x.has(String(i.kind??"").toLowerCase())).sort((i,o)=>(i.sortkey??0)-(o.sortkey??0)))},S=(r,t)=>{const e=d(r.payload),a=String(e.docLane??e.section??e.lane??"").trim().toLowerCase();if(a==="solicitud"||a==="evidencias"||a==="causa"||a==="solucion"||a==="verificacion"||a==="otros")return a;const i=String(e.title??"").toLowerCase().normalize("NFD").replace(/\p{M}/gu,"");if(/^solicitud|^objetivo|requerimiento insoft|^requerimiento\b/.test(i))return"solicitud";if(/^evidencia|informacion del tiquete|pantallazo|captura/.test(i))return"evidencias";if(/hipotesis|causa identificada|causa del problema|^causa\b|antecedente|analisis realizado|diagnostico|raiz del problema/.test(i))return"causa";if(/verificacion\b|validacion\b|investigacion y pruebas|como probar|pruebas realizadas/.test(i))return"verificacion";if(/solucion aplicada|solucion entregada|^solucion\b|cambios en base de datos|resultado\b|conclusion|catalogo por tipo|resumen de tiempos/.test(i))return"solucion";const o=String(r.kind??"").toLowerCase();return o==="html"||o==="image"||o==="image-group"?t==="otros"?"evidencias":t:o==="badge"||o==="badges"?t==="otros"?"solicitud":t:o==="code"||o==="sql"||o==="cambio-bd"||o==="file-tree"?t==="otros"?"solucion":t:o==="steps"||o==="stepper"?t==="otros"?"verificacion":t:o==="table"&&t==="otros"?"evidencias":o==="markdown"||o==="md"||o==="text"?i?"otros":t:"otros"},A=r=>{let t="solicitud";return r.map(e=>{const a=S(e,t);return t=a,{b:e,lane:a}})},L=r=>{const t=String(r.kind??"").toLowerCase();return t==="image"||t==="image-group"},h=r=>{const t=d(r.payload),e=String(t.caption??"").trim()||String(t.title??"").trim(),a=Array.isArray(r.blocks)?r.blocks:[];return String(r.kind??"").toLowerCase()==="image-group"&&a.length?r:{...r,kind:"image",payload:{...t,caption:e,title:""},blocks:void 0}},$=r=>{const t=[];let e=[];const a=()=>{if(e.length){if(e.length===1)t.push(e[0]);else{const i=e.flatMap(n=>String(n.kind??"").toLowerCase()==="image-group"&&Array.isArray(n.blocks)&&n.blocks.length?n.blocks.map(h):[h(n)]),o=d(e[0].payload).docLane;t.push({kind:"image-group",sortkey:e[0].sortkey,payload:o?{docLane:o}:{},blocks:i})}e=[]}};for(const i of r)L(i)?e.push(i):(a(),t.push(i));return a(),t},E=r=>{const t=[...r.rootCommits??[]];return t.length?t:(r.contexts??[]).flatMap(e=>[...e.commits??[]])},m=r=>String(r||"").trim().toLowerCase()==="metrics"?"metrics":"doc",z=24,j=r=>{const t=String(r||"").trim().toLowerCase();return t==="clientesis"||t==="isp-svelte"?t:"patyia"};class D extends HTMLElement{static get observedAttributes(){return["embebido","modo","tk","space"]}#o=null;#e="doc";#t;#r="inicial";#a="";#s=0;constructor(){super(),this.#t=this.attachShadow({mode:"open"}),g(this.#t,v)}connectedCallback(){this.#e=m(this.getAttribute("modo")),this.getAttribute("tk")&&!this.#o?this.cargar():this.#i()}attributeChangedCallback(t,e,a){if(t==="modo"&&(this.#e=m(a)),!!this.isConnected){if((t==="tk"||t==="space")&&e!==a&&this.getAttribute("tk")){this.cargar();return}this.#i()}}async cargar(){const t=String(this.getAttribute("tk")||"").trim();if(!t)return;const e=j(this.getAttribute("space")),a=Number(this.getAttribute("cache-horas"))||z,i=++this.#s;this.#r="cargando",this.#i();const o=(s,l)=>{i===this.#s&&(this.#o=this.hasAttribute("sanear")?k(s):s,this.#r="listo",this.#i(),this.dispatchEvent(new CustomEvent("tk-datos",{bubbles:!0,composed:!0,detail:{origen:l,ticket:this.#o}})))};try{const s=await f.ticket(e,t,{vigenciaMs:a*60*60*1e3});o(s.data,s.origen);return}catch(s){this.#a=s instanceof Error?s.message:String(s)}const n=this.getAttribute("fallback");if(n)try{const s=await fetch(n,{headers:{accept:"application/json"}});if(!s.ok)throw new Error(`HTTP ${s.status}`);const l=d(await s.json());o(l.ticket?l.ticket:l,"archivo local");return}catch(s){this.#a+=` \xB7 fallback: ${s instanceof Error?s.message:String(s)}`}i===this.#s&&(this.#r="error",this.#i(),this.dispatchEvent(new CustomEvent("tk-error",{bubbles:!0,composed:!0,detail:{error:this.#a}})))}get ticket(){return this.#o}set ticket(t){this.#o=t,this.isConnected&&this.#i()}set json(t){const e=d(t);this.ticket=e.ticket?e.ticket:e}get embebido(){return this.hasAttribute("embebido")}set embebido(t){this.toggleAttribute("embebido",!!t)}get modo(){return this.#e}set modo(t){const e=m(String(t));this.#e!==e&&(this.#e=e,this.setAttribute("modo",e),this.dispatchEvent(new CustomEvent("tk-modo",{bubbles:!0,composed:!0,detail:{modo:e}})),this.isConnected&&this.#i())}#n=()=>{this.modo=this.#e==="doc"?"metrics":"doc"};#c(t){const e=A(C(t)),a=Object.assign(document.createElement("tk-ticket-head"),{ticket:t}),i=E(t),o=w.map(({lane:s,rotulo:l})=>{const p=$(e.filter(u=>u.lane===s).map(u=>u.b));return p.length?c`
        <section aria-label="${l}" data-lane="${s}">
          <h2 class="rotulo">${l}</h2>
          ${p.map(u=>Object.assign(document.createElement("tk-block"),{bloque:u}))}
        </section>
      `:null}).filter(Boolean),n=i.length?c`
        <section aria-label="Commits">
          <h2 class="rotulo">Commits</h2>
          ${Object.assign(document.createElement("tk-commits"),{commits:i})}
        </section>
      `:null;return c`
      <article class="documento" data-modo="doc">
        <header class="encabezado">${a}</header>
        ${o.length>0?o:c`
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
        `);return}if(this.#r==="error"){const o=location.protocol==="file:";this.#t.append(c`
          <div class="vacio">
            <is-icon icon="mdi:cloud-off-outline" style="font-size:2rem" aria-hidden="true"></is-icon>
            <p>No se pudo obtener ${this.getAttribute("tk")??"el tiquete"}.</p>
            <p class="detalle">${this.#a}</p>
            ${o?c`<p class="detalle">
              La página está abierta como archivo local: el respaldo en disco necesita servirse por HTTP.
            </p>`:null}
          </div>
        `);return}this.#t.append(c`
        <div class="vacio">
          <is-icon icon="mdi:file-document-outline" style="font-size:2rem" aria-hidden="true"></is-icon>
          <p>Selecciona un tiquete para ver su documentación.</p>
        </div>
      `);return}const e=this.#e==="metrics",a=e?"mdi:file-document-outline":"mdi:chart-timeline-variant",i=e?"Ver documentaci\xF3n":"Ver m\xE9tricas InSoft";this.#t.append(c`
      <div class="shell">
        ${e?this.#l(t):this.#c(t)}
        <div class="fab">
          <button
            type="button"
            class="fab-btn"
            aria-label="${i}"
            title="${i}"
            aria-pressed="${e?"true":"false"}"
            onclick=${this.#n}
          >
            <is-icon icon="${a}" aria-hidden="true"></is-icon>
          </button>
        </div>
      </div>
    `)}}b("tk-view",D);
