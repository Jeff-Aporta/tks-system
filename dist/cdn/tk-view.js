import{css as h,define as f,html as r,rec as u}from"./_shared.js";const g=`
  :host {
    display: block;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    container-type: inline-size;
    --tk-measure: 78ch;
    color: var(--is-text, #e6edf3);
    font-family: var(--is-font-sans, system-ui, -apple-system, "Segoe UI", sans-serif);
    overflow-wrap: break-word;
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
  tk-tiempos {
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
    color: var(--is-text-soft, #c3ced9);
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
    color: var(--is-text-muted, #9aa7b4);
    text-align: center;
  }
  .firma {
    margin-top: 0.5rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--is-border-soft, #1f242b);
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.75rem;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }
`,k=[{lane:"solicitud",rotulo:"Solicitud"},{lane:"evidencias",rotulo:"Evidencias"},{lane:"causa",rotulo:"Causa"},{lane:"solucion",rotulo:"Soluci\xF3n"},{lane:"verificacion",rotulo:"Verificaci\xF3n"},{lane:"otros",rotulo:"Detalle"}],v=n=>{const e=Array.isArray(n.content)&&n.content.length?[...n.content]:[...n.doc?.blocks??[]],o=(n.contexts??[]).flatMap(t=>[...t.content??[]]);return[...e,...o].filter(t=>t&&typeof t=="object").sort((t,a)=>(t.sortKey??0)-(a.sortKey??0))},w=(n,e)=>{const o=u(n.payload),t=String(o.docLane??o.section??o.lane??"").trim().toLowerCase();if(t==="solicitud"||t==="evidencias"||t==="causa"||t==="solucion"||t==="verificacion"||t==="otros")return t;const a=String(o.title??"").toLowerCase().normalize("NFD").replace(/\p{M}/gu,"");if(/^solicitud|^objetivo|requerimiento insoft|^requerimiento\b/.test(a))return"solicitud";if(/^evidencia|informacion del tiquete|pantallazo|captura/.test(a))return"evidencias";if(/hipotesis|causa identificada|causa del problema|^causa\b|antecedente|analisis realizado|diagnostico|raiz del problema/.test(a))return"causa";if(/verificacion\b|validacion\b|investigacion y pruebas|como probar|pruebas realizadas/.test(a))return"verificacion";if(/solucion aplicada|solucion entregada|^solucion\b|cambios en base de datos|resultado\b|conclusion|catalogo por tipo|resumen de tiempos/.test(a))return"solucion";const i=String(n.kind??"").toLowerCase();return i==="html"||i==="image"||i==="image-group"?e==="otros"?"evidencias":e:i==="badge"||i==="badges"?e==="otros"?"solicitud":e:i==="code"||i==="sql"||i==="cambio-bd"||i==="file-tree"?e==="otros"?"solucion":e:i==="steps"||i==="stepper"?e==="otros"?"verificacion":e:i==="table"&&e==="otros"?"evidencias":i==="markdown"||i==="md"||i==="text"?a?"otros":e:"otros"},T=n=>{let e="solicitud";return n.map(o=>{const t=w(o,e);return e=t,{b:o,lane:t}})},x=n=>{const e=[...n.rootCommits??[]];return e.length?e:(n.contexts??[]).flatMap(o=>[...o.commits??[]])};class C extends HTMLElement{static get observedAttributes(){return["embebido"]}#t=null;#e;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),h(this.#e,g)}connectedCallback(){this.#i()}attributeChangedCallback(){this.isConnected&&this.#i()}get ticket(){return this.#t}set ticket(e){this.#t=e,this.isConnected&&this.#i()}set json(e){const o=u(e);this.ticket=o.ticket?o.ticket:o}get embebido(){return this.hasAttribute("embebido")}set embebido(e){this.toggleAttribute("embebido",!!e)}#i(){for(;this.#e.firstChild;)this.#e.removeChild(this.#e.firstChild);const e=this.#t;if(!e?.iticket){this.#e.append(r`
        <div class="vacio">
          <is-icon icon="mdi:file-document-outline" style="font-size:2rem" aria-hidden="true"></is-icon>
          <p>Selecciona un tiquete para ver su documentación.</p>
        </div>
      `);return}const o=T(v(e)),t=Object.assign(document.createElement("tk-ticket-head"),{ticket:e}),a=x(e),i=[...e.tiempos??[]].filter(c=>Number(c.minutos??0)>0),l=k.map(({lane:c,rotulo:d})=>{const m=o.filter(s=>s.lane===c).map(s=>s.b);return m.length?r`
        <section aria-label="${d}">
          <h2 class="rotulo">${d}</h2>
          ${m.map(s=>Object.assign(document.createElement("tk-block"),{bloque:s}))}
        </section>
      `:null}).filter(Boolean),p=a.length?r`
        <section aria-label="Commits">
          <h2 class="rotulo">Commits</h2>
          ${Object.assign(document.createElement("tk-commits"),{commits:a})}
        </section>
      `:null,b=i.length?r`
        <section aria-label="Tiempos InSoft">
          <h2 class="rotulo">Tiempos InSoft</h2>
          ${Object.assign(document.createElement("tk-tiempos"),{tiempos:i})}
        </section>
      `:null;this.#e.append(r`
      <article class="documento">
        <header class="encabezado">${t}</header>
        ${l.length>0?l:r`
          <is-callout color="neutral" icon="mdi:text-box-remove-outline">
            Este tiquete todavía no tiene documentación publicada.
          </is-callout>
        `}
        ${p}
        ${b}
        <footer class="firma">
          ${e.iticket} · ${e.space==="patyia"?"PatyIA":"Clientes"} ·
          documentación generada desde jagudeloe-tks
        </footer>
      </article>
    `)}}f("tk-view",C);
