import{blockCss as l,crearBloque as c,define as m,html as a,md as g,proseCss as b,raw as p}from"./_shared.js";const f=`
  ${l}
  ${b}
  .marco {
    overflow: hidden;
    border: 1px solid var(--is-border, #2a3038);
    border-radius: var(--tk-radius, 0.625rem);
    background: var(--is-bg-soft, #14181d);
  }
  .cabecera {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em 1em;
    align-items: baseline;
    padding: 0.7em 0.95em;
    border-bottom: 1px solid var(--is-border-soft, #1f242b);
    background: var(--is-bg-elev, #1c2128);
  }
  .campo {
    display: inline-flex;
    gap: 0.4em;
    align-items: baseline;
    font-size: 0.8125em;

    dt {
      margin: 0;
      color: var(--is-text-muted, #9aa7b4);
      letter-spacing: 0.04em;
      text-transform: uppercase;
      font-size: 0.9em;
    }
    dd {
      margin: 0;
      font-family: var(--is-font-mono, ui-monospace, Menlo, monospace);
      color: var(--tk-code-text, #a8d5ff);
    }
  }
  .intencion {
    padding: 0.8em 0.95em;
    font-size: 0.875em;

    + tk-code { display: block; padding: 0 0.95em 0.95em; }
  }
  dl { margin: 0; display: contents; }
`,s=(i,e)=>e?a`<dl class="campo"><dt>${i}</dt><dd>${e}</dd></dl>`:null;m("tk-cambio-bd",c(f,(i,e)=>{const t=String(e.sql??"").trim(),o=String(e.tabla??"").trim(),r=String(e.registro??"").trim(),n=String(e.intencion??"").trim();if(!t&&!o&&!n)return;const d=t?Object.assign(document.createElement("tk-code"),{payload:{code:t,language:"sql"}}):null;i.append(a`
    <h2 class="titulo">${String(e.title??"Cambio en base de datos")}</h2>
    <div class="marco">
      ${(o||r)&&a`
        <div class="cabecera">
          ${s("Tabla",o)}
          ${s("Registro",r)}
        </div>
      `}
      ${n&&a`<div class="intencion prosa">${p(g(n))}</div>`}
      ${d}
    </div>
  `)}));
