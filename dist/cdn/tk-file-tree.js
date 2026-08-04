import{blockCss as l,crearBloque as m,define as f,html as r,raw as u,rec as h}from"./_shared.js";const p=`
  ${l}
  is-tree {
    display: block;
    padding: 0.7em 0.85em;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: var(--is-bg-soft, #14181d);
    font-family: var(--is-font-mono, ui-monospace, Menlo, monospace);
    font-size: 0.8125em;
    line-height: 1.55;
  }
  .pista {
    margin-left: 0.65em;
    color: var(--is-text-muted, #9aa7b4);
    font-family: var(--is-font-sans, system-ui, sans-serif);
    font-size: 0.95em;
  }
`,a=e=>({nombre:e,hijos:new Map}),g=e=>{const o=a("");for(const s of e){let i=o;for(const t of String(s).split("/").filter(Boolean))i.hijos.has(t)||i.hijos.set(t,a(t)),i=i.hijos.get(t)}return o},c=(e,o)=>{const s=e.hijos.size===0,i=s?String(o[e.nombre]??""):"";return r`
    <is-tree-item ${u(s?"":"expanded")}>
      <is-icon
        slot="icon"
        icon="${s?"mdi:file-document-outline":"mdi:folder-outline"}"
        aria-hidden="true"
      ></is-icon>
      ${e.nombre}
      ${i&&r`<span class="pista">${i}</span>`}
      ${[...e.hijos.values()].map(t=>c(t,o))}
    </is-tree-item>
  `};f("tk-file-tree",m(p,(e,o)=>{const s=(Array.isArray(o.paths)?o.paths:[]).map(String).filter(Boolean);if(!s.length)return;const i=h(o.hints),t=[...g(s).hijos.values()].map(d=>c(d,i)),n=String(o.rootLabel??"").trim();e.append(r`
    <h2 class="titulo">${String(o.title??"Archivos intervenidos")}</h2>
    <is-tree selection="none">
      ${n?r`
        <is-tree-item expanded>
          <is-icon slot="icon" icon="mdi:source-repository" aria-hidden="true"></is-icon>
          ${n}
          ${t}
        </is-tree-item>
      `:t}
    </is-tree>
  `)}));
