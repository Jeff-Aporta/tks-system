import{blockCss as m,crearBloque as g,define as f,fecha as p,html as r,jsonScript as b,raw as u,rec as l}from"./_shared.js";const v=`
  ${m}
  .resumen {
    display: grid;
    gap: 0.65em;
    margin: 0 0 1em;
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  }
  .cifra {
    display: grid;
    gap: 0.3rem;
    padding: 0.65rem 0.8rem;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: color-mix(in srgb, var(--is-bg-soft, #14181d) 88%, transparent);
  }
  .cifra[data-hl] {
    border-color: color-mix(in srgb, var(--is-accent, #1a6eb0) 45%, var(--is-border-soft, #1f242b));
    background: color-mix(in srgb, var(--is-accent, #1a6eb0) 10%, var(--is-bg-soft, #14181d));
  }
  .cifra-rotulo {
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .cifra-valor {
    font-size: 0.975rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    font-variant-numeric: tabular-nums;
  }
  is-timeline { display: block; }
  .hitos { margin: 0; padding: 0; list-style: none; }
  .hito {
    display: grid;
    align-items: baseline;
    gap: 0.2em 0.9em;
    padding: 0.55em 0;
    border-bottom: 1px solid var(--is-border-soft, #1f242b);
    grid-template-columns: 4.75em 1fr;

    &:last-child { border-bottom: 0; }
  }
  .hora {
    color: var(--tk-link, #6fb2e8);
    font-family: var(--is-font-mono, ui-monospace, Menlo, monospace);
    font-size: 0.8125em;
    font-variant-numeric: tabular-nums;
  }
  .etiqueta { font-size: 0.9em; font-weight: 550; }
  .nota {
    grid-column: 2;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.8125em;
  }
`,h=n=>n.map((i,t)=>{const a=l(i);return{id:String(a.key??a.id??`h${t}`),label:String(a.label??a.name??`Hito ${t+1}`),date:String(a.iso??a.date??""),hora:String(a.hora??""),desc:String(a.nota??a.description??"")}}).filter(i=>i.label);f("tk-timeline",g(v,(n,i)=>{const t=l(i.timeline??i),a=h(Array.isArray(t.milestones)?t.milestones:Array.isArray(t.events)?t.events:[]),s=(Array.isArray(t.resumen)?t.resumen:[]).map(l);if(!a.length&&!s.length)return;const o=String(t.title??i.title??""),d=a.filter(e=>e.date&&!Number.isNaN(new Date(e.date).getTime())),c=d.length>=2?r`
      <is-timeline color="inline">
        ${b({timeline:{title:o||void 0,orientation:"vertical",events:d.map(e=>({id:e.id,label:e.label,date:e.date,desc:e.desc}))}})}
      </is-timeline>
    `:r`
      <ul class="hitos">
        ${a.map(e=>r`
          <li class="hito">
            <span class="hora">${e.hora||p(e.date)}</span>
            <span class="etiqueta">${e.label}</span>
            ${e.desc&&r`<span class="nota">${e.desc}</span>`}
          </li>
        `)}
      </ul>
    `;n.append(r`
    ${o&&r`<h2 class="titulo">${o}</h2>`}
    ${s.length>0&&r`
      <div class="resumen">
        ${s.map(e=>r`
          <div class="cifra" ${u(e.highlight===!0?"data-hl":"")}>
            <span class="cifra-rotulo">${String(e.label??"")}</span>
            <span class="cifra-valor">${String(e.value??"\u2014")}</span>
          </div>
        `)}
      </div>
    `}
    ${a.length>0&&c}
  `)}));
