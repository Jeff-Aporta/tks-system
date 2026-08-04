import{b64url as d,blockCss as m,crearBloque as c,define as g,html as t}from"./_shared.js";const u=`
  ${m}
  .marco {
    display: grid;
    justify-items: center;
    padding: 1em;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: var(--is-bg-soft, #14181d);
  }
  img { max-width: 100%; height: auto; }
  is-details { display: block; margin-top: 0.6em; font-size: 0.8125em; }
  pre {
    margin: 0;
    overflow-x: auto;
    font-family: var(--is-font-mono, ui-monospace, Menlo, monospace);
    font-size: 0.95em;
    line-height: 1.6;
    color: var(--is-text-soft, #c3ced9);
  }
  .fallo {
    padding: 1.2em;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.8125em;
    text-align: center;
  }
`,f="https://mermaid.ink/svg/",p=()=>document.documentElement.dataset.theme!=="light";g("tk-diagram",c(u,(i,e)=>{const r=p(),a=String(r&&e.sourceDark||e.source||"").trim();if(!a)return;const o=String(e.engine??"mermaid").toLowerCase(),s=/^\s*%%\{/.test(a)?a:`%%{init: {"theme": "${r?"dark":"default"}"}}%%
${a}`,n=l=>{l.target.replaceWith(t`
      <p class="fallo">El servicio de diagramas no respondió. La fuente está abajo.</p>
    `),i.querySelector("is-details")?.setAttribute("open","")};i.append(t`
    ${e.title&&t`<h2 class="titulo">${e.title}</h2>`}
    <div class="marco">
      ${o==="mermaid"?t`
        <img
          src="${f+d.encode(s)}"
          alt="${String(e.alt??e.caption??"Diagrama del tiquete")}"
          loading="lazy"
          decoding="async"
          onerror=${n}
        >
      `:t`
        <p class="fallo">Motor de diagrama no soportado: ${o}.</p>
      `}
    </div>
    ${e.caption&&t`<p class="pie">${e.caption}</p>`}
    <is-details summary="Fuente ${o}" variant="filled-outlined">
      <pre><code>${a}</code></pre>
    </is-details>
  `)}));
