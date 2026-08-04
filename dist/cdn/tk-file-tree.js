import{blockCss as g,crearBloque as b,define as p,html as d,rec as m}from"./_shared.js";const w=`
  ${g}
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
    flex-wrap: wrap;
    gap: 0.35rem 0.55rem;
    align-items: baseline;
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
  }
  .carpeta .nombre { font-weight: 600; color: var(--is-text-soft, #c3ced9); }
  .pista {
    flex: 1 1 12rem;
    min-width: 0;
    color: var(--is-text-muted, #9aa7b4);
    font-family: var(--is-font-sans, system-ui, sans-serif);
    font-size: 0.92em;
    line-height: 1.4;
    overflow-wrap: anywhere;
  }
  .raiz {
    margin-bottom: 0.35rem;
    color: var(--is-accent, #1a6eb0);
    font-weight: 650;
  }
`,h=(n,o="")=>({nombre:n,hijos:new Map,pista:o||void 0}),y=(n,o)=>{const e=h("");for(const r of n){const i=String(r).split(/[/\\]/).filter(Boolean);let s=e;i.forEach((t,a)=>{if(!s.hijos.has(t)){const c=a===i.length-1?String(o[t]??o[r]??o[i.slice(0,a+1).join("/")]??""):"";s.hijos.set(t,h(t,c))}s=s.hijos.get(t)})}return e},f=(n,o,e)=>{const r=m(n),i=String(r.name??r.nombre??"").trim();if(!i)return null;const s=String(r.path??(e?`${e}/${i}`:i)),t=Array.isArray(r.children)?r.children:Array.isArray(r.hijos)?r.hijos:[],a=h(i,String(r.hint??r.pista??o[i]??o[s]??""));for(const l of t){const c=f(l,o,s);c&&a.hijos.set(c.nombre,c)}return a},v=(n,o)=>{const e=h("");for(const r of n){const i=f(r,o,"");i&&e.hijos.set(i.nombre,i)}return e},u=n=>{const o=n.hijos.size===0;return d`
    <li class="nodo ${o?"hoja":"carpeta"}">
      <div class="fila">
        <is-icon class="ico" icon="${o?"mdi:file-document-outline":"mdi:folder-outline"}" aria-hidden="true"></is-icon>
        <span class="nombre">${n.nombre}</span>
        ${n.pista?d`<span class="pista">${n.pista}</span>`:null}
      </div>
      ${o?null:d`
        <ul>
          ${[...n.hijos.values()].map(u)}
        </ul>
      `}
    </li>
  `};p("tk-file-tree",b(w,(n,o)=>{const e=m(o.hints??o.notes),r=m(o.fileTree??{}),i=Array.isArray(o.tree)?o.tree:Array.isArray(r.tree)?r.tree:[],s=(Array.isArray(o.paths)?o.paths:Array.isArray(o.files)?o.files:Array.isArray(r.paths)?r.paths:[]).map(String).filter(Boolean);if(!i.length&&!s.length)return;const t=i.length?v(i,{...m(r.hints),...e}):y(s,{...m(r.hints),...e}),a=String(o.rootLabel??o.root??r.rootLabel??"").trim(),l=[...t.hijos.values()].map(u);n.append(d`
    <h2 class="titulo">${String(o.title??r.title??"Archivos intervenidos")}</h2>
    <ul class="arbol" role="tree" aria-label="Archivos intervenidos">
      ${a?d`
        <li class="nodo carpeta raiz" role="treeitem">
          <div class="fila">
            <is-icon class="ico" icon="mdi:source-repository" aria-hidden="true"></is-icon>
            <span class="nombre">${a}</span>
          </div>
          <ul role="group">${l}</ul>
        </li>
      `:l}
    </ul>
  `)}));
