import{blockCss as l,css as h,define as p,estadoColor as u,fecha as c,html as r,md as g,minutos as f,proseCss as w,raw as v}from"./_shared.js";const x=`
  ${l}
  ${w}
  :host {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    container-type: inline-size;
  }
  .cima {
    margin-bottom: 1.15rem;
    min-width: 0;
  }
  .identidad {
    min-width: 0;
    max-width: 100%;
  }
  .codigo {
    display: flex;
    align-items: center;
    gap: 0.55em;
    margin: 0 0 0.4em;
    min-width: 0;
    color: var(--is-text-muted, #9aa7b4);
    font-family: var(--is-font-mono, ui-monospace, Menlo, monospace);
    font-size: 0.8125rem;
    letter-spacing: 0.04em;
    overflow-wrap: anywhere;
  }
  .punto {
    width: 0.5em;
    height: 0.5em;
    flex: none;
    border-radius: 50%;
    background: var(--punto);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--punto) 22%, transparent);
  }
  h1 {
    margin: 0 0 0.7rem;
    max-width: 100%;
    font-size: clamp(1.25rem, 1rem + 2.2vw, 2rem);
    font-weight: 660;
    letter-spacing: -0.024em;
    line-height: 1.2;
    overflow-wrap: anywhere;
    word-break: break-word;
    text-wrap: pretty;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4em;
    margin: 0;
    max-width: 100%;
    font-size: 0.8125rem;
  }
  .cifras {
    display: grid;
    gap: 0.65rem;
    margin: 0 0 1.15rem;
    min-width: 0;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr));
  }
  .cifra {
    display: grid;
    gap: 0.35rem;
    min-width: 0;
    padding: 0.7rem 0.85rem;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: color-mix(in srgb, var(--is-bg-soft, #14181d) 88%, transparent);
  }
  .cifra-rotulo {
    display: flex;
    align-items: center;
    gap: 0.4em;
    min-width: 0;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;

    is-icon { flex: none; font-size: 0.95em; opacity: 0.9; }
  }
  .cifra-valor {
    min-width: 0;
    font-size: 0.975rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    line-height: 1.35;
    overflow-wrap: anywhere;
    font-variant-numeric: tabular-nums;
  }
  .resumen {
    max-width: min(100%, var(--tk-measure, 68ch));
    min-width: 0;
    color: var(--is-text, #e6edf3);
    font-size: 1rem;
    line-height: 1.7;
  }

  @container (max-width: 36rem) {
    .cima { margin-bottom: 0.95rem; }
    .cifras { grid-template-columns: 1fr; }
  }

  @media (max-width: 48rem) {
    .cifras { grid-template-columns: 1fr; }
  }
`,k={success:"var(--is-color-success-500, #2f9e44)",warning:"var(--is-color-warning-500, #f08c00)",info:"var(--is-accent, #1a6eb0)",neutral:"var(--is-text-muted, #9aa7b4)"},n=(e,i,t)=>e?r`
    <is-tag color="${i}" variant="filled-outlined" pill>
      <is-icon slot="start" icon="${t}" aria-hidden="true"></is-icon>
      ${e}
    </is-tag>
  `:null,a=(e,i,t)=>i?r`
    <div class="cifra">
      <span class="cifra-rotulo">
        <is-icon icon="${t}" aria-hidden="true"></is-icon>
        ${e}
      </span>
      <span class="cifra-valor">${i}</span>
    </div>
  `:null;class b extends HTMLElement{#t=null;#i;constructor(){super(),this.#i=this.attachShadow({mode:"open"}),h(this.#i,x)}connectedCallback(){this.#e()}get ticket(){return this.#t}set ticket(i){this.#t=i,this.isConnected&&this.#e()}#e(){for(;this.#i.firstChild;)this.#i.removeChild(this.#i.firstChild);const i=this.#t;if(!i)return;const t=u(i.estado),s=String(i.resumen??"").trim(),o=(i.rootCommits?.length??(i.contexts??[]).reduce((m,d)=>m+(d.commits?.length??0),0))||0;this.#i.append(r`
      <div class="cima">
        <div class="identidad">
          <p class="codigo">
            <span class="punto" style="--punto: ${k[t]}" aria-hidden="true"></span>
            ${i.iticket}
          </p>
          <h1>${String(i.titulo??i.iticket)}</h1>
          <div class="chips">
            ${n(String(i.estado??""),t,"mdi:circle-slice-8")}
            ${n(i.space==="patyia"?"PatyIA":i.space==="isp-svelte"?"ISP Svelte":"Clientes","brand","mdi:folder-outline")}
            ${n(String(i.solicitante??""),"neutral","mdi:account-outline")}
          </div>
        </div>
      </div>
      <div class="cifras">
        ${a("Solicitado",c(i.fechasolicitud,!0),"mdi:calendar-arrow-right")}
        ${a("Entregado",c(i.fechaentrega,!0),"mdi:calendar-check")}
        ${a("Tiempo total",f(i.tiempoTotalMinutos??i.diligenciaMinutos),"mdi:timer-outline")}
        ${a("Commits",o?String(o):"","mdi:source-commit")}
      </div>
      ${s&&r`<div class="resumen prosa">${v(g(s))}</div>`}
    `)}}p("tk-ticket-head",b);
