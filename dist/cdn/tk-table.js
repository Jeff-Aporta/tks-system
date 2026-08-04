import{blockCss as g,crearBloque as p,define as y,html as a,inlineMd as c,raw as m,rec as $}from"./_shared.js";const k=`
  ${g}
  .ficha {
    display: grid;
    overflow: hidden;
    margin: 0;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: var(--is-bg-soft, #14181d);
    grid-template-columns: minmax(7rem, max-content) 1fr;

    dt, dd {
      padding: 0.6em 0.95em;
      border-top: 1px solid var(--is-border-soft, #1f242b);
      font-size: 0.875em;
      line-height: 1.55;
    }
    dt:first-of-type, dt:first-of-type + dd { border-top: 0; }
    dt {
      color: var(--is-text-muted, #9aa7b4);
      font-weight: 550;
    }
    dd { margin: 0; min-width: 0; }
    code {
      padding: 0.1em 0.35em;
      border-radius: 0.28em;
      background: var(--is-code-bg, #0f1318);
      font-family: var(--is-font-mono, ui-monospace, Menlo, monospace);
      font-size: 0.9em;
      color: var(--tk-code-text, #a8d5ff);
    }
    a { color: var(--tk-link, #6fb2e8); }
  }
  is-data-grid {
    display: block;
    --is-grid-height: auto;
  }
`,l=r=>{if(r==null)return"";if(typeof r=="object"){const e=$(r);return c(e.text??e.label??e.value??"")}return c(r)};y("tk-table",p(k,(r,e)=>{const n=(Array.isArray(e.rows)?e.rows:[]).map(t=>Array.isArray(t)?t:[t]);if(!n.length)return;const s=(Array.isArray(e.headers)?e.headers:[]).map(String);if(n.every(t=>t.length===2)){r.append(a`
      ${e.title&&a`<h2 class="titulo">${e.title}</h2>`}
      <dl class="ficha">
        ${n.map(t=>a`
          <dt>${m(l(t[0]))}</dt>
          <dd>${m(l(t[1]))}</dd>
        `)}
      </dl>
      ${e.caption&&a`<p class="pie">${e.caption}</p>`}
    `);return}const u=Math.max(...n.map(t=>t.length),s.length),f=Array.from({length:u},(t,i)=>({field:`c${i}`,headerName:s[i]??`Columna ${i+1}`,flex:1,sortable:!0,renderCell:({value:d})=>({html:l(d)})})),o=Object.assign(document.createElement("is-data-grid"),{columns:f,rows:n.map((t,i)=>{const d={id:i};return t.forEach((b,h)=>{d[`c${h}`]=b}),d})});o.setAttribute("auto-height",""),o.setAttribute("hide-footer",""),o.setAttribute("density","compact"),o.setAttribute("disable-column-menu",""),o.setAttribute("toolbar-tools","false"),r.append(a`
    ${e.title&&a`<h2 class="titulo">${e.title}</h2>`}
    ${o}
    ${e.caption&&a`<p class="pie">${e.caption}</p>`}
  `)}));
