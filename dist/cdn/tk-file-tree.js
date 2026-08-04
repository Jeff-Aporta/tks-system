import{blockCss as v,crearBloque as w,define as y,html as d,rec as m}from"./_shared.js";const x=`
  ${v}
  .arbol {
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    margin: 0;
    padding: 0.75rem 0.9rem;
    overflow-x: auto;
    list-style: none;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: var(--is-bg-soft, #14181d);
    font-family: var(--is-font-mono, ui-monospace, Menlo, monospace);
    font-size: 0.8125rem;
    line-height: 1.55;
    -webkit-overflow-scrolling: touch;
  }
  .arbol ul {
    margin: 0;
    padding: 0 0 0 1.05rem;
    list-style: none;
    border-left: 1px solid color-mix(in srgb, var(--is-border, #2a3038) 80%, transparent);
  }
  .nodo {
    margin: 0.12rem 0;
    min-width: 0;
  }
  .fila {
    display: flex;
    flex-wrap: nowrap;
    gap: 0.4rem;
    align-items: center;
    min-width: 0;
  }
  .ico {
    flex: none;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 1em;
  }
  .nombre {
    min-width: 0;
    overflow-wrap: anywhere;
    word-break: break-word;
    outline: none;
  }
  .nombre[tabindex] {
    cursor: help;
    border-bottom: 1px dotted color-mix(in srgb, var(--is-text-muted, #9aa7b4) 55%, transparent);
  }
  .nombre[tabindex]:hover,
  .nombre[tabindex]:focus-visible {
    color: var(--is-accent, #1a6eb0);
  }
  .carpeta .nombre { font-weight: 600; color: var(--is-text-soft, #c3ced9); }
  .carpeta .nombre[tabindex] {
    border-bottom-color: transparent;
    cursor: default;
  }
  .raiz {
    margin-bottom: 0.35rem;
    color: var(--is-accent, #1a6eb0);
    font-weight: 650;
  }
  is-tooltip {
    --max-width: 22rem;
  }
`,b=(e,o,i="")=>({nombre:e,path:o,hijos:new Map,pista:i||void 0}),j=(e,o)=>{const i=b("","");for(const r of e){const t=String(r).split(/[/\\]/).filter(Boolean);let s=i;const c=[];t.forEach((n,a)=>{c.push(n);const l=c.join("/");if(s.hijos.has(n)){if(a===t.length-1){const h=s.hijos.get(n),u=String(h.pista??o[l]??o[r]??o[n]??"");u&&!h.pista&&s.hijos.set(n,b(n,l,u))}}else{const u=a===t.length-1?String(o[l]??o[r]??o[n]??o[t.slice(0,a+1).join("/")]??""):"";s.hijos.set(n,b(n,l,u))}s=s.hijos.get(n)})}return i},f=(e,o,i)=>{const r=m(e),t=String(r.name??r.nombre??"").trim();if(!t)return null;const s=String(r.path??(i?`${i}/${t}`:t)),c=Array.isArray(r.children)?r.children:Array.isArray(r.hijos)?r.hijos:[],n=b(t,s,String(r.hint??r.pista??o[s]??o[t]??""));for(const a of c){const l=f(a,o,s);l&&n.hijos.set(l.nombre,l)}return n},$=(e,o)=>{const i=b("","");for(const r of e){const t=f(r,o,"");t&&i.hijos.set(t.nombre,t)}return i};let p=0;const g=e=>{const o=e.hijos.size===0,i=o?"mdi:file-document-outline":"mdi:folder-outline",r=e.pista?`ft-tip-${++p}`:"";return d`
    <li class="nodo ${o?"hoja":"carpeta"}">
      <div class="fila">
        <is-icon class="ico" icon="${i}" aria-hidden="true"></is-icon>
        ${e.pista?d`
            <span class="nombre" id="${r}" tabindex="0">${e.nombre}</span>
            <is-tooltip for="${r}" placement="top">${e.pista}</is-tooltip>
          `:d`<span class="nombre">${e.nombre}</span>`}
      </div>
      ${o?null:d`
        <ul>
          ${[...e.hijos.values()].map(g)}
        </ul>
      `}
    </li>
  `};y("tk-file-tree",w(x,(e,o)=>{p=0;const i=m(o.hints??o.notes),r=m(o.fileTree??{}),t=Array.isArray(o.tree)?o.tree:Array.isArray(r.tree)?r.tree:[],s=(Array.isArray(o.paths)?o.paths:Array.isArray(o.files)?o.files:Array.isArray(r.paths)?r.paths:[]).map(String).filter(Boolean);if(!t.length&&!s.length)return;const c=t.length?$(t,{...m(r.hints),...i}):j(s,{...m(r.hints),...i}),n=String(o.rootLabel??o.root??r.rootLabel??"").trim(),a=[...c.hijos.values()].map(g);e.append(d`
    <h2 class="titulo">${String(o.title??r.title??"Archivos intervenidos")}</h2>
    <ul class="arbol" role="tree" aria-label="Archivos intervenidos">
      ${n?d`
        <li class="nodo carpeta raiz" role="treeitem">
          <div class="fila">
            <is-icon class="ico" icon="mdi:source-repository" aria-hidden="true"></is-icon>
            <span class="nombre">${n}</span>
          </div>
          <ul role="group">${a}</ul>
        </li>
      `:a}
    </ul>
  `)}));
