import{css as u,define as p,html as n,rec as d}from"./_shared.js";const h=`
  :host {
    display: block;
    container-type: inline-size;
    --tk-measure: 68ch;
    color: var(--is-text, #e6edf3);
    font-family: var(--is-font-sans, system-ui, -apple-system, "Segoe UI", sans-serif);
  }
  .documento {
    display: grid;
    gap: 2rem;
    max-width: 54rem;
    margin: 0 auto;
    padding: clamp(1.15rem, 0.55rem + 1.8vw, 2.25rem) clamp(1rem, 0.5rem + 1.6vw, 2rem);
  }
  .encabezado { min-width: 0; }
  section {
    display: grid;
    gap: 1rem;
    padding-top: 0.15rem;
  }
  .rotulo {
    display: flex;
    align-items: center;
    gap: 0.75em;
    margin: 0 0 0.15rem;
    color: var(--is-text-soft, #c3ced9);
    font-size: 0.72rem;
    font-weight: 650;
    letter-spacing: 0.11em;
    text-transform: uppercase;
  }
  .rotulo::after {
    height: 1px;
    flex: 1;
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
  }
`,b=[{lane:"solicitud",rotulo:"Solicitud"},{lane:"evidencias",rotulo:"Evidencias"},{lane:"causa",rotulo:"Causa"},{lane:"solucion",rotulo:"Soluci\xF3n"},{lane:"verificacion",rotulo:"Verificaci\xF3n"},{lane:"otros",rotulo:"Detalle"}],g=t=>{const e=Array.isArray(t.content)&&t.content.length?[...t.content]:[...t.doc?.blocks??[]],o=(t.contexts??[]).flatMap(i=>[...i.content??[]]);return[...e,...o].filter(i=>i&&typeof i=="object").sort((i,a)=>(i.sortKey??0)-(a.sortKey??0))},k=t=>d(t.payload).docLane??"otros";class f extends HTMLElement{static get observedAttributes(){return["embebido"]}#t=null;#e;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),u(this.#e,h)}connectedCallback(){this.#i()}attributeChangedCallback(){this.isConnected&&this.#i()}get ticket(){return this.#t}set ticket(e){this.#t=e,this.isConnected&&this.#i()}set json(e){const o=d(e);this.ticket=o.ticket?o.ticket:o}get embebido(){return this.hasAttribute("embebido")}set embebido(e){this.toggleAttribute("embebido",!!e)}#i(){for(;this.#e.firstChild;)this.#e.removeChild(this.#e.firstChild);const e=this.#t;if(!e?.iticket){this.#e.append(n`
        <div class="vacio">
          <is-icon icon="mdi:file-document-outline" style="font-size:2rem" aria-hidden="true"></is-icon>
          <p>Selecciona un tiquete para ver su documentación.</p>
        </div>
      `);return}const o=g(e),i=this.embebido?null:Object.assign(document.createElement("tk-actions"),{ticket:e}),a=Object.assign(document.createElement("tk-ticket-head"),{ticket:e,acciones:i}),r=b.map(({lane:m,rotulo:c})=>{const l=o.filter(s=>k(s)===m);return l.length?n`
        <section aria-label="${c}">
          <h2 class="rotulo">${c}</h2>
          ${l.map(s=>Object.assign(document.createElement("tk-block"),{bloque:s}))}
        </section>
      `:null}).filter(Boolean);this.#e.append(n`
      <article class="documento">
        <header class="encabezado">${a}</header>
        ${r.length>0?r:n`
          <is-callout color="neutral" icon="mdi:text-box-remove-outline">
            Este tiquete todavía no tiene documentación publicada.
          </is-callout>
        `}
        <footer class="firma">
          ${e.iticket} · ${e.space==="patyia"?"PatyIA":"Clientes"} ·
          documentación generada desde jagudeloe-tks
        </footer>
      </article>
    `)}}p("tk-view",f);
