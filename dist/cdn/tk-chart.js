import{blockCss as d,crearBloque as p,define as u,html as a,jsonScript as b,rec as t}from"./_shared.js";const g=`
  ${d}
  .subtitulo {
    margin: -0.5em 0 0.9em;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.875em;
    line-height: 1.5;
  }
  .marco {
    padding: 0.9em;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: var(--is-bg-soft, #14181d);
  }
  is-chart {
    display: block;
    width: 100%;
    min-height: 16rem;
  }
`;u("tk-chart",p(g,(l,s)=>{const i=t(s.chart??s),r=t(i.data);if(!(Array.isArray(r.datasets)?r.datasets:[]).length)return;const o=t(t(i.options).plugins),e=String(s.title??t(o.title).text??""),n=String(t(o.subtitle).text??""),c={...i,options:{...t(i.options),plugins:{...o,title:{display:!1},subtitle:{display:!1}}}};l.append(a`
    ${e&&a`<h2 class="titulo">${e}</h2>`}
    ${n&&a`<p class="subtitulo">${n}</p>`}
    <div class="marco">
      <is-chart type="${String(i.type??"bar")}">
        ${b(c)}
      </is-chart>
    </div>
    ${s.caption&&a`<p class="pie">${s.caption}</p>`}
  `)}));
