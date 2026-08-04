import{blockCss as l,css as m,define as d,estadoColor as p,fecha as c,html as s,md as u,minutos as g,proseCss as h,raw as f}from"./_shared.js";const v=`
  ${l}
  ${h}
  .cima {
    display: flex;
    flex-wrap: wrap;
    gap: 0.85rem 1.25rem;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1.15rem;
  }
  .identidad { flex: 1 1 18rem; min-width: 0; }
  .acciones {
    display: flex;
    flex: none;
    gap: 0.4rem;
    align-items: center;
    padding-top: 0.1rem;
  }
  .codigo {
    display: flex;
    align-items: center;
    gap: 0.55em;
    margin: 0 0 0.4em;
    color: var(--is-text-muted, #9aa7b4);
    font-family: var(--is-font-mono, ui-monospace, Menlo, monospace);
    font-size: 0.8125rem;
    letter-spacing: 0.04em;
  }
  .punto {
    width: 0.5em;
    height: 0.5em;
    border-radius: 50%;
    background: var(--punto);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--punto) 22%, transparent);
  }
  h1 {
    margin: 0 0 0.7rem;
    max-width: 28em;
    font-size: clamp(1.4rem, 1.05rem + 1.4vw, 2rem);
    font-weight: 660;
    letter-spacing: -0.024em;
    line-height: 1.18;
    text-wrap: balance;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4em;
    margin: 0;
    font-size: 0.8125rem;
  }
  .cifras {
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem;
    margin: 0 0 1.15rem;
  }
  .cifra {
    display: grid;
    gap: 0.35rem;
    flex: 1 1 11rem;
    max-width: 16.5rem;
    padding: 0.7rem 0.85rem;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: color-mix(in srgb, var(--is-bg-soft, #14181d) 88%, transparent);
  }
  .cifra-rotulo {
    display: flex;
    align-items: center;
    gap: 0.4em;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;

    is-icon { font-size: 0.95em; opacity: 0.9; }
  }
  .cifra-valor {
    font-size: 0.975rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    line-height: 1.35;
    font-variant-numeric: tabular-nums;
  }
  .resumen {
    max-width: var(--tk-measure, 68ch);
    color: var(--is-text-soft, #c3ced9);
    font-size: 1rem;
    line-height: 1.7;
  }
`,x={success:"var(--is-color-success-500, #2f9e44)",warning:"var(--is-color-warning-500, #f08c00)",info:"var(--is-accent, #1a6eb0)",neutral:"var(--is-text-muted, #9aa7b4)"},r=(t,i,e)=>t?s`
    <is-tag color="${i}" variant="filled-outlined" pill>
      <is-icon slot="start" icon="${e}" aria-hidden="true"></is-icon>
      ${t}
    </is-tag>
  `:null,a=(t,i,e)=>i?s`
    <div class="cifra">
      <span class="cifra-rotulo">
        <is-icon icon="${e}" aria-hidden="true"></is-icon>
        ${t}
      </span>
      <span class="cifra-valor">${i}</span>
    </div>
  `:null;class w extends HTMLElement{#t=null;#e=null;#i;constructor(){super(),this.#i=this.attachShadow({mode:"open"}),m(this.#i,v)}connectedCallback(){this.#s()}get ticket(){return this.#t}set ticket(i){this.#t=i,this.isConnected&&this.#s()}get acciones(){return this.#e}set acciones(i){this.#e=i,this.isConnected&&this.#s()}#s(){for(;this.#i.firstChild;)this.#i.removeChild(this.#i.firstChild);const i=this.#t;if(!i)return;const e=p(i.estado),n=String(i.resumen??"").trim(),o=i.rootCommits?.length??0;this.#i.append(s`
      <div class="cima">
        <div class="identidad">
          <p class="codigo">
            <span class="punto" style="--punto: ${x[e]}" aria-hidden="true"></span>
            ${i.iticket}
          </p>
          <h1>${String(i.titulo??i.iticket)}</h1>
          <div class="chips">
            ${r(String(i.estado??""),e,"mdi:circle-slice-8")}
            ${r(i.space==="patyia"?"PatyIA":"Clientes","brand","mdi:folder-outline")}
            ${r(String(i.solicitante??""),"neutral","mdi:account-outline")}
          </div>
        </div>
        ${this.#e&&s`<div class="acciones">${this.#e}</div>`}
      </div>
      <div class="cifras">
        ${a("Solicitado",c(i.fechaSolicitud,!0),"mdi:calendar-arrow-right")}
        ${a("Entregado",c(i.fechaEntrega,!0),"mdi:calendar-check")}
        ${a("Tiempo total",g(i.tiempoTotalMinutos??i.diligenciaMinutos),"mdi:timer-outline")}
        ${a("Commits",o?String(o):"","mdi:source-commit")}
      </div>
      ${n&&s`<div class="resumen prosa">${f(u(n))}</div>`}
    `)}}d("tk-ticket-head",w);
