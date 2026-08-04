import{blockCss as n,crearBloque as c,define as l,html as t,jsonScript as u,rec as d}from"./_shared.js";const m=`
  ${n}
  .subtitulo {
    margin: -0.5em 0 0.75em;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.875em;
  }
  .marco {
    overflow-x: auto;
    padding: 0.5em;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: var(--is-bg-soft, #14181d);
  }
  is-sequence-diagram { display: block; min-width: 32rem; }
`;l("tk-sequence",c(m,(o,e)=>{const s=d(e.sequence),i=Array.isArray(s.messages)?s.messages:[],r=String(e.preset??s.preset??"");if(!i.length&&!r)return;const a=String(e.subtitle??"");o.append(t`
    ${e.title&&t`<h2 class="titulo">${e.title}</h2>`}
    ${a&&t`<p class="subtitulo">${a}</p>`}
    <div class="marco">
      <is-sequence-diagram color="inline">
        ${u(r&&!i.length?{preset:r}:{sequence:s})}
      </is-sequence-diagram>
    </div>
    ${e.caption&&t`<p class="pie">${e.caption}</p>`}
  `)}));
