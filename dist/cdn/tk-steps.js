import{blockCss as l,crearBloque as n,define as o,html as i,md as d,proseCss as c,raw as m,rec as h}from"./_shared.js";const p=`
  ${l}
  ${c}
  ol { margin: 0; padding: 0; list-style: none; }
  .fase {
    position: relative;
    padding: 0 0 1.35em 1.55em;
    border-left: 1px solid var(--is-border, #2a3038);

    &:last-child { padding-bottom: 0; border-left-color: transparent; }
    &::before {
      position: absolute;
      top: 0.5em;
      left: 0;
      width: 0.5em;
      height: 0.5em;
      border-radius: 50%;
      background: var(--is-accent, #1a6eb0);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--is-accent, #1a6eb0) 22%, transparent);
      content: "";
      transform: translateX(-50%);
    }
    h3 {
      margin: 0 0 0.55em;
      font-size: 0.9375em;
      font-weight: 620;
      letter-spacing: -0.008em;
      line-height: 1.35;
    }
  }
  .hallazgos { display: grid; gap: 0.45em; min-width: 0; }
  .hallazgo {
    max-width: 100%;
    min-width: 0;
    color: var(--is-text, #e6edf3);
    font-size: 0.9em;
    line-height: 1.55;
    overflow-wrap: anywhere;

    &.prosa > :last-child { margin-bottom: 0; }
  }
  h3 { overflow-wrap: anywhere; }
`,g=(t,r)=>{const e=h(t),s=Array.isArray(e.items)?e.items:Array.isArray(e.steps)?e.steps:e.text?[e.text]:[];return{title:String(e.title??e.label??`Fase ${r+1}`),items:s}},u=t=>t==null?null:typeof t=="string"?i`<div class="hallazgo prosa">${m(d(t))}</div>`:Object.assign(document.createElement("tk-block"),{bloque:t});o("tk-steps",n(p,(t,r)=>{const s=(Array.isArray(r.phases)?r.phases:Array.isArray(r.steps)?r.steps:[]).map(g).filter(a=>a.items.length||a.title);s.length&&t.append(i`
    ${r.title&&i`<h2 class="titulo">${r.title}</h2>`}
    <ol>
      ${s.map(a=>i`
        <li class="fase">
          <h3>${a.title}</h3>
          <div class="hallazgos">${a.items.map(u)}</div>
        </li>
      `)}
    </ol>
  `)}));
