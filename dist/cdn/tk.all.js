var W=new Map,v=(r,e)=>{let t=W.get(e);t||(t=new CSSStyleSheet,t.replaceSync(e),W.set(e,t)),r.adoptedStyleSheets=[...r.adoptedStyleSheets,t]},u=`
  :host {
    display: block;
    max-width: 100%;
    min-width: 0;
    overflow-wrap: break-word;
    color: var(--is-text, #e6edf3);
    font-family: var(--is-font-sans, system-ui, -apple-system, "Segoe UI", sans-serif);
    font-size: 0.9375rem;
    line-height: 1.65;
  }
  .titulo {
    margin: 0 0 0.65em;
    max-width: min(100%, var(--tk-measure, 68ch));
    font-size: 1.0625em;
    font-weight: 620;
    letter-spacing: -0.011em;
    line-height: 1.35;
    overflow-wrap: anywhere;
    color: var(--is-text, #e6edf3);
  }
  .superficie {
    max-width: 100%;
    min-width: 0;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: var(--is-bg-soft, #14181d);
  }
  .pie {
    margin: 0.65em 0 0;
    max-width: min(100%, var(--tk-measure, 68ch));
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.8125em;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }
`;var E=Symbol("tk-html-crudo"),b=r=>({[E]:String(r??"")}),J=r=>typeof r=="object"&&r!==null&&E in r,a=(r,...e)=>{let t=[],i=[],o="";for(let c=0;c<r.length;c++){if(o+=r[c],c>=e.length)continue;let l=e[c];if(l==null||l===!1||l===!0)continue;if(typeof l=="function"&&/\s+on([a-zA-Z][\w-]*)=\s*$/.test(o)){let g=o.match(/\s+on([a-zA-Z][\w-]*)=\s*$/);o=o.slice(0,o.length-g[0].length),o+=` data-tk-ev="${i.length}"`,i.push({evento:g[1].toLowerCase(),fn:l});continue}if(J(l)){o+=l[E];continue}let f=Array.isArray(l)?l:[l];for(let g of f)g==null||g===!1||g===!0||(g instanceof Node?(o+=`<template data-tk-nodo="${t.length}"></template>`,t.push(g)):J(g)?o+=g[E]:o+=$(g))}let n=document.createElement("template");n.innerHTML=o;let s=n.content;for(let c of[...s.querySelectorAll("template[data-tk-nodo]")]){let l=Number(c.dataset.tkNodo);c.replaceWith(t[l]??document.createComment("tk:nodo"))}for(let c of[...s.querySelectorAll("[data-tk-ev]")]){let l=Number(c.dataset.tkEv),h=i[l];h&&c.addEventListener(h.evento,h.fn),c.removeAttribute("data-tk-ev")}return s},T=r=>{let e=document.createElement("script");return e.type="application/json",e.textContent=JSON.stringify(r),e},$=r=>String(r??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"),d=r=>r&&typeof r=="object"&&!Array.isArray(r)?r:{},S=r=>{let e=[],t=String(r??"").replace(/`([^`]+)`/g,(i,o)=>(e.push(o),` ${e.length-1} `));return t=$(t).replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g,(i,o,n)=>`<a href="${$(n)}" target="_blank" rel="noopener noreferrer">${o}</a>`).replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/(^|[\s(])\*([^*\n]+)\*/g,"$1<em>$2</em>").replace(/~~([^~]+)~~/g,"<del>$1</del>"),t.replace(/ (\d+) /g,(i,o)=>`<code>${$(e[Number(o)])}</code>`)},y=r=>{let e=String(r??"").replace(/\r\n?/g,`
`).split(`
`),t=[],i=[],o=0,n=()=>{i.length&&t.push(`<p>${S(i.join(" "))}</p>`),i.length=0};for(;o<e.length;){let s=e[o],c=s.match(/^\s*```(\w+)?\s*$/);if(c){n();let f=[];for(o++;o<e.length&&!/^\s*```\s*$/.test(e[o]);)f.push(e[o++]);o++,t.push(`<pre data-lang="${$(c[1]??"")}"><code>${$(f.join(`
`))}</code></pre>`);continue}if(/^\s*\|/.test(s)&&/^\s*\|[\s:|-]+\|?\s*$/.test(e[o+1]??"")){n();let f=x=>x.trim().replace(/^\||\|$/g,"").split("|").map(I=>S(I.trim())),g=f(s);o+=2;let w=[];for(;o<e.length&&/^\s*\|/.test(e[o]);)w.push(f(e[o++]));t.push(`<table><thead><tr>${g.map(x=>`<th>${x}</th>`).join("")}</tr></thead><tbody>${w.map(x=>`<tr>${x.map(I=>`<td>${I}</td>`).join("")}</tr>`).join("")}</tbody></table>`);continue}let l=s.match(/^(#{1,6})\s+(.*)$/);if(l){n();let f=Math.min(l[1].length+2,6);t.push(`<h${f}>${S(l[2])}</h${f}>`),o++;continue}if(/^\s*(---|___|\*\*\*)\s*$/.test(s)){n(),t.push("<hr>"),o++;continue}if(/^\s*>\s?/.test(s)){n();let f=[];for(;o<e.length&&/^\s*>\s?/.test(e[o]);)f.push(e[o++].replace(/^\s*>\s?/,""));t.push(`<blockquote>${y(f.join(`
`))}</blockquote>`);continue}let h=s.match(/^\s*([-*+]|\d+[.)])\s+/);if(h){n();let f=/\d/.test(h[1]),g=[];for(;o<e.length;){let x=e[o].match(/^\s*([-*+]|\d+[.)])\s+(.*)$/);if(!x){if(g.length&&/^\s{2,}\S/.test(e[o])){g[g.length-1]+=` ${e[o].trim()}`,o++;continue}break}g.push(x[2]),o++}let w=f?"ol":"ul";t.push(`<${w}>${g.map(x=>`<li>${S(x)}</li>`).join("")}</${w}>`);continue}if(!s.trim()){n(),o++;continue}i.push(s.trim()),o++}return n(),t.join(`
`)},k=`
  .prosa {
    max-width: min(100%, var(--tk-measure, 68ch));
    min-width: 0;
    overflow-wrap: anywhere;
    word-break: break-word;

    > :first-child { margin-top: 0; }
    > :last-child { margin-bottom: 0; }

    h3, h4, h5, h6 {
      margin: 1.35em 0 0.45em;
      font-weight: 620;
      letter-spacing: -0.01em;
      line-height: 1.3;
      overflow-wrap: anywhere;
    }
    h3 { font-size: 1.0625em; }
    h4 { font-size: 0.9375em; color: var(--is-text-muted, #9aa7b4); }
    p { margin: 0 0 0.8em; overflow-wrap: anywhere; }
    ul, ol {
      margin: 0 0 0.85em;
      padding-left: 1.15em;
      max-width: 100%;
    }
    li {
      margin: 0.3em 0;
      padding-left: 0.15em;
      overflow-wrap: anywhere;

      &::marker { color: var(--is-accent, #1a6eb0); }
      > p { margin: 0.2em 0; }
    }
    a {
      color: var(--tk-link, #6fb2e8);
      text-decoration: underline;
      text-underline-offset: 0.18em;
      text-decoration-thickness: 1px;
      text-decoration-color: color-mix(in srgb, currentColor 40%, transparent);
      overflow-wrap: anywhere;

      &:hover { text-decoration-color: currentColor; }
    }
    code {
      display: inline;
      padding: 0.1em 0.35em;
      border: 1px solid var(--is-border-soft, #1f242b);
      border-radius: 0.28em;
      background: var(--is-code-bg, #0f1318);
      font-family: var(--is-font-mono, ui-monospace, "Cascadia Code", Menlo, monospace);
      font-size: 0.86em;
      line-height: 1.45;
      vertical-align: baseline;
      white-space: break-spaces;
      overflow-wrap: anywhere;
      word-break: break-word;
      color: var(--tk-code-text, #a8d5ff);
      box-decoration-break: clone;
      -webkit-box-decoration-break: clone;
    }
    pre {
      margin: 0 0 1em;
      max-width: 100%;
      padding: 0.85em 1em;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border: 1px solid var(--is-border-soft, #1f242b);
      border-radius: var(--tk-radius, 0.625rem);
      background: var(--is-code-bg, #0f1318);
      font-size: 0.8125em;
      line-height: 1.6;

      code {
        display: inline;
        padding: 0;
        border: 0;
        background: none;
        color: inherit;
        font-size: inherit;
        white-space: pre;
        vertical-align: baseline;
        word-break: normal;
        overflow-wrap: normal;
      }
    }
    blockquote {
      margin: 0 0 1em;
      max-width: 100%;
      padding: 0.15em 0 0.15em 0.95em;
      border-left: 2px solid color-mix(in srgb, var(--is-accent, #1a6eb0) 70%, transparent);
      color: var(--is-text-muted, #9aa7b4);
    }
    hr {
      margin: 1.4em 0;
      border: 0;
      border-top: 1px solid var(--is-border-soft, #1f242b);
    }
    table {
      display: block;
      width: 100%;
      max-width: 100%;
      margin: 0 0 1em;
      overflow-x: auto;
      border-collapse: collapse;
      font-size: 0.9em;
      -webkit-overflow-scrolling: touch;
    }
    th, td {
      padding: 0.5em 0.75em;
      border-bottom: 1px solid var(--is-border-soft, #1f242b);
      text-align: left;
      vertical-align: top;
    }
    th { font-weight: 600; color: var(--is-text-muted, #9aa7b4); }
    del { color: var(--is-text-muted, #9aa7b4); }
  }
`,ae=new Intl.DateTimeFormat("es-CO",{day:"2-digit",month:"short",year:"numeric"}),ne=new Intl.DateTimeFormat("es-CO",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}),C=(r,e=!1)=>{if(!r)return"";let t=String(r).trim();(t.startsWith('"')&&t.endsWith('"')||t.startsWith("'")&&t.endsWith("'"))&&(t=t.slice(1,-1).trim());let i=new Date(t);return Number.isNaN(i.getTime())?t:(e?ne:ae).format(i)},K=r=>{let e=Number(r);if(!Number.isFinite(e)||e<=0)return"";let t=Math.floor(e/60),i=Math.round(e%60);return t?i?`${t} h ${i} min`:`${t} h`:`${i} min`},se={primary:"brand",brand:"brand",info:"info",success:"success",ok:"success",warning:"warning",warn:"warning",danger:"danger",error:"danger",violet:"brand",neutral:"neutral",default:"neutral"},Y=r=>se[String(r??"").toLowerCase()]??"neutral",G=r=>{let e=String(r??"").toLowerCase();return e.includes("cerrad")||e.includes("solucion")?"success":e.includes("proceso")||e.includes("curso")?"warning":e.includes("abiert")||e.includes("nuevo")?"info":"neutral"},A={encode(r){let e=new TextEncoder().encode(r),t="";for(let i of e)t+=String.fromCharCode(i);return btoa(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")},decode(r){let e=String(r).replace(/-/g,"+").replace(/_/g,"/");for(;e.length%4;)e+="=";let t=atob(e),i=new Uint8Array(t.length);for(let o=0;o<t.length;o++)i[o]=t.charCodeAt(o);return new TextDecoder().decode(i)}},m=(r,e)=>{customElements.get(r)||customElements.define(r,e)},p=(r,e)=>class extends HTMLElement{#t={};#e;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),v(this.#e,r)}connectedCallback(){this.#r()}get payload(){return this.#t}set payload(t){this.#t=d(t),this.isConnected&&this.#r()}#r(){for(;this.#e.firstChild;)this.#e.removeChild(this.#e.firstChild);e(this.#e,this.#t,this)}};var le=`
  ${u}
  ${k}
`;m("tk-markdown",p(le,(r,e)=>{let t=String(e.text??e.body??e.content??"").trim();!t&&!e.title||r.append(a`
    ${e.title&&a`<h2 class="titulo">${e.title}</h2>`}
    ${t&&a`<div class="prosa">${b(y(t))}</div>`}
  `)}));var ce=`
  ${u}
  ${k}
  .prosa img { max-width: 100%; height: auto; border-radius: var(--tk-radius, 0.625rem); }
  .prosa table { display: block; overflow-x: auto; }
`,de=["script","style","iframe","object","embed","form","link","meta","base"],me=r=>{let e=new DOMParser().parseFromString(String(r??""),"text/html");e.body.querySelectorAll(de.join(",")).forEach(t=>t.remove());for(let t of e.body.querySelectorAll("*")){for(let i of[...t.attributes]){let o=i.name.toLowerCase(),n=i.value.trim().toLowerCase();(o.startsWith("on")||(o==="href"||o==="src")&&n.startsWith("javascript:"))&&t.removeAttribute(i.name)}t.tagName==="A"&&(t.setAttribute("target","_blank"),t.setAttribute("rel","noopener noreferrer"))}return e.body.innerHTML};m("tk-html",p(ce,(r,e)=>{let t=String(e.html??"").trim();!t&&!e.title||r.append(a`
    ${e.title&&a`<h2 class="titulo">${e.title}</h2>`}
    ${t&&a`<div class="prosa">${b(me(t))}</div>`}
  `)}));var ue=`
  ${u}
  .fila {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45em;
    align-items: center;
    font-size: 0.875rem;
  }
`;m("tk-badges",p(ue,(r,e)=>{let i=(Array.isArray(e.items)?e.items:Array.isArray(e.badges)?e.badges:e.label?[e]:[]).map(d).map(o=>({texto:String(o.label??o.text??"").trim(),color:Y(o.tone??o.color)})).filter(o=>o.texto);i.length&&r.append(a`
    ${e.title&&a`<h2 class="titulo">${e.title}</h2>`}
    <div class="fila">
      ${i.map(o=>a`
        <is-tag color="${o.color}" variant="filled-outlined" pill>${o.texto}</is-tag>
      `)}
    </div>
  `)}));var pe=`
  ${u}
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
`,M=r=>{if(r==null)return"";if(typeof r=="object"){let e=d(r);return S(e.text??e.label??e.value??"")}return S(r)};m("tk-table",p(pe,(r,e)=>{let t=(Array.isArray(e.rows)?e.rows:[]).map(c=>Array.isArray(c)?c:[c]);if(!t.length)return;let i=(Array.isArray(e.headers)?e.headers:[]).map(String);if(t.every(c=>c.length===2)){r.append(a`
      ${e.title&&a`<h2 class="titulo">${e.title}</h2>`}
      <dl class="ficha">
        ${t.map(c=>a`
          <dt>${b(M(c[0]))}</dt>
          <dd>${b(M(c[1]))}</dd>
        `)}
      </dl>
      ${e.caption&&a`<p class="pie">${e.caption}</p>`}
    `);return}let o=Math.max(...t.map(c=>c.length),i.length),n=Array.from({length:o},(c,l)=>({field:`c${l}`,headerName:i[l]??`Columna ${l+1}`,flex:1,sortable:!0,renderCell:({value:h})=>({html:M(h)})})),s=Object.assign(document.createElement("is-data-grid"),{columns:n,rows:t.map((c,l)=>{let h={id:l};return c.forEach((f,g)=>{h[`c${g}`]=f}),h})});s.setAttribute("auto-height",""),s.setAttribute("hide-footer",""),s.setAttribute("density","compact"),s.setAttribute("disable-column-menu",""),t.length>12&&(s.setAttribute("show-toolbar",""),s.setAttribute("quick-filter","")),r.append(a`
    ${e.title&&a`<h2 class="titulo">${e.title}</h2>`}
    ${s}
    ${e.caption&&a`<p class="pie">${e.caption}</p>`}
  `)}));var ge=`
  ${u}
  .rejilla {
    display: grid;
    gap: 0.75rem;
    grid-template-columns: repeat(auto-fit, minmax(min(22rem, 100%), 1fr));
  }
  figure {
    margin: 0;
    overflow: hidden;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: var(--is-bg-soft, #14181d);
  }
  .lienzo {
    display: block;
    width: 100%;
    padding: 0;
    border: 0;
    background: var(--is-code-bg, #0f1318);
    cursor: zoom-in;
    line-height: 0;

    img {
      display: block;
      width: 100%;
      height: auto;
      transition: opacity 160ms ease-out, transform 220ms ease;

      &[data-cargando] { opacity: 0; }
    }
    &:hover img { opacity: 0.92; transform: scale(1.01); }
    &:focus-visible {
      outline: 2px solid var(--is-focus, #4c9be8);
      outline-offset: -2px;
    }
  }
  figcaption {
    padding: 0.55em 0.8em;
    border-top: 1px solid var(--is-border-soft, #1f242b);
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.8125em;
    line-height: 1.5;
  }
  .rota {
    padding: 1.2em;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.8125em;
    text-align: center;
  }
`,he=`
  :host {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: grid;
    place-items: center;
    padding: clamp(0.75rem, 2vw, 1.5rem);
    background:
      radial-gradient(ellipse 70% 55% at 50% 42%, rgb(15 23 42 / 35%), transparent 70%),
      rgb(2 6 14 / 82%);
    backdrop-filter: blur(10px) saturate(1.15);
    -webkit-backdrop-filter: blur(10px) saturate(1.15);
    opacity: 0;
    pointer-events: none;
    transition: opacity 180ms ease;
    font-family: var(--is-font-sans, system-ui, sans-serif);
  }
  :host([open]) {
    opacity: 1;
    pointer-events: auto;
  }
  .marco {
    position: relative;
    display: grid;
    gap: 0.65rem;
    width: min(96vw, 72rem);
    max-height: min(92dvh, 56rem);
    justify-items: center;
  }
  .foto {
    display: block;
    max-width: 100%;
    max-height: min(82dvh, 50rem);
    object-fit: contain;
    border-radius: 0.75rem;
    box-shadow:
      0 0 0 1px rgb(255 255 255 / 8%),
      0 24px 64px rgb(0 0 0 / 55%);
    background: #0a0f18;
  }
  .leyenda {
    max-width: 48rem;
    color: rgb(226 232 240 / 88%);
    font-size: 0.875rem;
    line-height: 1.5;
    text-align: center;
    text-wrap: pretty;
  }
  .cerrar,
  .nav {
    position: absolute;
    display: grid;
    place-items: center;
    width: 2.5rem;
    height: 2.5rem;
    border: 1px solid rgb(255 255 255 / 14%);
    border-radius: 999px;
    background: rgb(15 23 42 / 72%);
    color: #e2e8f0;
    cursor: pointer;
    transition: background 140ms ease, transform 140ms ease;
  }
  .cerrar:hover,
  .nav:hover {
    background: rgb(30 41 59 / 88%);
    transform: scale(1.04);
  }
  .cerrar {
    top: -0.35rem;
    right: -0.15rem;
  }
  .nav.prev { left: -0.25rem; top: 50%; transform: translateY(-50%); }
  .nav.next { right: -0.25rem; top: 50%; transform: translateY(-50%); }
  .nav.prev:hover,
  .nav.next:hover { transform: translateY(-50%) scale(1.04); }
  .contador {
    position: absolute;
    top: -0.25rem;
    left: 0;
    color: rgb(148 163 184 / 95%);
    font-size: 0.75rem;
    font-variant-numeric: tabular-nums;
  }
  @media (max-width: 40rem) {
    .nav.prev { left: 0.15rem; }
    .nav.next { right: 0.15rem; }
    .cerrar { top: 0.15rem; right: 0.15rem; }
  }
`,Z=r=>{let e=String(r.url??r.src??"").trim();return e?{url:e,alt:String(r.alt??r.caption??r.title??"Evidencia del tiquete"),caption:String(r.caption??"")}:null},N=class extends HTMLElement{#t;#e=[];#r=0;#o=e=>{this.hasAttribute("open")&&(e.key==="Escape"?this.cerrar():e.key==="ArrowRight"?this.#i(1):e.key==="ArrowLeft"&&this.#i(-1))};constructor(){super(),this.#t=this.attachShadow({mode:"open"});let e=new CSSStyleSheet;e.replaceSync(he),this.#t.adoptedStyleSheets=[e]}connectedCallback(){document.addEventListener("keydown",this.#o),this.addEventListener("click",e=>{e.target===this&&this.cerrar()})}disconnectedCallback(){document.removeEventListener("keydown",this.#o)}abrir(e,t=0){this.#e=e,this.#r=Math.max(0,Math.min(t,e.length-1)),this.setAttribute("open",""),this.#a(),queueMicrotask(()=>this.#t.querySelector(".cerrar")?.focus())}cerrar(){this.removeAttribute("open")}#i(e){this.#e.length<2||(this.#r=(this.#r+e+this.#e.length)%this.#e.length,this.#a())}#a(){let e=this.#e[this.#r];if(!e)return;let t=this.#e.length>1;for(;this.#t.firstChild;)this.#t.removeChild(this.#t.firstChild);this.#t.append(a`
      <div class="marco" role="dialog" aria-modal="true" aria-label="${e.alt}">
        ${t?a`<span class="contador">${this.#r+1} / ${this.#e.length}</span>`:null}
        <button class="cerrar" type="button" aria-label="Cerrar" onclick=${()=>this.cerrar()}>
          <is-icon icon="mdi:close" aria-hidden="true"></is-icon>
        </button>
        ${t?a`
          <button class="nav prev" type="button" aria-label="Anterior" onclick=${()=>this.#i(-1)}>
            <is-icon icon="mdi:chevron-left" aria-hidden="true"></is-icon>
          </button>
          <button class="nav next" type="button" aria-label="Siguiente" onclick=${()=>this.#i(1)}>
            <is-icon icon="mdi:chevron-right" aria-hidden="true"></is-icon>
          </button>
        `:null}
        <img class="foto" src="${e.url}" alt="${e.alt}">
        ${e.caption||e.alt?a`<p class="leyenda">${e.caption||e.alt}</p>`:null}
      </div>
    `)}};customElements.get("tk-lightbox")||customElements.define("tk-lightbox",N);var fe=()=>{let r=document.querySelector("tk-lightbox");return r||(r=document.createElement("tk-lightbox"),document.body.append(r)),r},be=(r,e,t)=>{let i=n=>{let s=n.target;s.removeAttribute("data-cargando"),s.naturalWidth&&s.naturalHeight&&(s.style.aspectRatio=`${s.naturalWidth} / ${s.naturalHeight}`)},o=n=>{let s=n.target;(s.closest(".lienzo")??s).replaceWith(a`
      <p class="rota">La evidencia ya no está disponible.</p>
    `)};return a`
    <figure>
      <button
        class="lienzo"
        type="button"
        aria-label="Ampliar: ${r.alt}"
        onclick=${()=>fe().abrir(e,t)}
      >
        <img
          src="${r.url}"
          alt="${r.alt}"
          loading="lazy"
          decoding="async"
          data-cargando
          onload=${i}
          onerror=${o}
        >
      </button>
      ${r.caption&&a`<figcaption>${r.caption}</figcaption>`}
    </figure>
  `};m("tk-image",p(ge,(r,e,t)=>{let i=t.bloques??[],o=(i.length?i.map(n=>Z(d(n.payload))):[Z(e)]).filter(n=>!!n);o.length&&r.append(a`
    ${e.title&&a`<h2 class="titulo">${e.title}</h2>`}
    <div class="${o.length>1?"rejilla":""}">
      ${o.map((n,s)=>be(n,o,s))}
    </div>
  `)}));var ve=`
  ${u}
  .marco {
    overflow: hidden;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: var(--is-code-bg, #0f1318);
  }
  .barra {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75em;
    padding: 0.4em 0.5em 0.4em 0.9em;
    border-bottom: 1px solid var(--is-border-soft, #1f242b);
    background: var(--is-bg-elev, #1c2128);
  }
  .lenguaje {
    color: var(--is-text-muted, #9aa7b4);
    font-family: var(--is-font-mono, ui-monospace, Menlo, monospace);
    font-size: 0.75em;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  pre {
    margin: 0;
    padding: 0.9em 1em;
    overflow-x: auto;
    font-family: var(--is-font-mono, ui-monospace, "Cascadia Code", Menlo, monospace);
    font-size: 0.8125em;
    line-height: 1.65;
    tab-size: 2;
  }
  .com { color: var(--tk-code-com, #6b7a8c); font-style: italic; }
  .str { color: var(--tk-code-str, #7ee0b8); }
  .num { color: var(--tk-code-num, #f0b775); }
  .key { color: var(--tk-code-key, #7fb2ff); font-weight: 600; }
`,ke=new RegExp("\\b("+["select","from","where","insert","into","values","update","set","delete","create","alter","drop","table","index","view","join","left","right","inner","outer","on","group","order","by","having","limit","offset","and","or","not","null","as","distinct","case","when","then","else","end","begin","commit","rollback","union","exists","between","like","in","const","let","var","function","return","if","for","while","await","async","class","extends","new","this","import","export","default","interface","type","try","catch","throw","typeof","true","false"].join("|")+")\\b","gi"),we=r=>{let e=[],t=o=>(e.push(o),`\0${e.length-1}\0`),i=$(r);return i=i.replace(/(--[^\n]*|\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*)/g,o=>t(`<span class="com">${o}</span>`)),i=i.replace(/('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`)/g,o=>t(`<span class="str">${o}</span>`)),i=i.replace(/\b\d+(\.\d+)?\b/g,o=>t(`<span class="num">${o}</span>`)),i=i.replace(ke,o=>t(`<span class="key">${o}</span>`)),i.replace(/ (\d+) /g,(o,n)=>e[Number(n)])};m("tk-code",p(ve,(r,e)=>{let t=String(e.code??e.sql??"").replace(/\s+$/,"");if(!t)return;let i=String(e.language??(e.sql?"sql":"")).trim();r.append(a`
    ${e.title&&a`<h2 class="titulo">${e.title}</h2>`}
    <div class="marco">
      <div class="barra">
        <span class="lenguaje">${i||"c\xF3digo"}</span>
        <is-copy-button value="${t}" aria-label="Copiar código"></is-copy-button>
      </div>
      <pre><code>${b(we(t))}</code></pre>
    </div>
    ${e.caption&&a`<p class="pie">${e.caption}</p>`}
  `)}));var ye=`
  ${u}
  a {
    display: inline-flex;
    max-width: 100%;
    align-items: center;
    gap: 0.5em;
    padding: 0.55em 0.85em;
    border: 1px solid var(--is-border, #2a3038);
    border-radius: var(--tk-radius, 0.625rem);
    background: var(--is-bg-soft, #14181d);
    color: var(--tk-link, #6fb2e8);
    font-size: 0.875em;
    text-decoration: none;
    transition: border-color 140ms ease-out, background-color 140ms ease-out;

    &:hover {
      border-color: var(--is-accent, #1a6eb0);
      background: color-mix(in srgb, var(--is-accent, #1a6eb0) 10%, var(--is-bg-soft, #14181d));
    }
    &:focus-visible {
      outline: 2px solid var(--is-focus, #4c9be8);
      outline-offset: 2px;
    }
  }
  .etiqueta {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  is-icon { flex: none; font-size: 1.05em; }
`;m("tk-url",p(ye,(r,e)=>{let t=String(e.href??e.url??"").trim();/^https?:\/\//i.test(t)&&r.append(a`
    ${e.title&&a`<h2 class="titulo">${e.title}</h2>`}
    <a href="${t}" target="_blank" rel="noopener noreferrer">
      <is-icon icon="mdi:open-in-new" aria-hidden="true"></is-icon>
      <span class="etiqueta">${String(e.label??t)}</span>
    </a>
    ${e.caption&&a`<p class="pie">${e.caption}</p>`}
  `)}));var xe=`
  ${u}
  ${k}
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
`,X=(r,e)=>e?a`<dl class="campo"><dt>${r}</dt><dd>${e}</dd></dl>`:null;m("tk-cambio-bd",p(xe,(r,e)=>{let t=String(e.sql??"").trim(),i=String(e.tabla??"").trim(),o=String(e.registro??"").trim(),n=String(e.intencion??"").trim();if(!t&&!i&&!n)return;let s=t?Object.assign(document.createElement("tk-code"),{payload:{code:t,language:"sql"}}):null;r.append(a`
    <h2 class="titulo">${String(e.title??"Cambio en base de datos")}</h2>
    <div class="marco">
      ${(i||o)&&a`
        <div class="cabecera">
          ${X("Tabla",i)}
          ${X("Registro",o)}
        </div>
      `}
      ${n&&a`<div class="intencion prosa">${b(y(n))}</div>`}
      ${s}
    </div>
  `)}));var $e=`
  ${u}
  ${k}
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
    max-width: min(100%, var(--tk-measure, 68ch));
    min-width: 0;
    color: var(--is-text-soft, #c3ced9);
    font-size: 0.9em;
    line-height: 1.55;
    overflow-wrap: anywhere;

    &.prosa > :last-child { margin-bottom: 0; }
  }
  h3 { overflow-wrap: anywhere; }
`,Se=(r,e)=>{let t=d(r),i=Array.isArray(t.items)?t.items:Array.isArray(t.steps)?t.steps:t.text?[t.text]:[];return{title:String(t.title??t.label??`Fase ${e+1}`),items:i}},Ce=r=>r==null?null:typeof r=="string"?a`<div class="hallazgo prosa">${b(y(r))}</div>`:Object.assign(document.createElement("tk-block"),{bloque:r});m("tk-steps",p($e,(r,e)=>{let i=(Array.isArray(e.phases)?e.phases:Array.isArray(e.steps)?e.steps:[]).map(Se).filter(o=>o.items.length||o.title);i.length&&r.append(a`
    ${e.title&&a`<h2 class="titulo">${e.title}</h2>`}
    <ol>
      ${i.map(o=>a`
        <li class="fase">
          <h3>${o.title}</h3>
          <div class="hallazgos">${o.items.map(Ce)}</div>
        </li>
      `)}
    </ol>
  `)}));var Te=`
  ${u}
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
`,j=(r,e="")=>({nombre:r,hijos:new Map,pista:e||void 0}),Ae=(r,e)=>{let t=j("");for(let i of r){let o=String(i).split(/[/\\]/).filter(Boolean),n=t;o.forEach((s,c)=>{if(!n.hijos.has(s)){let h=c===o.length-1?String(e[s]??e[i]??e[o.slice(0,c+1).join("/")]??""):"";n.hijos.set(s,j(s,h))}n=n.hijos.get(s)})}return t},Q=(r,e,t)=>{let i=d(r),o=String(i.name??i.nombre??"").trim();if(!o)return null;let n=String(i.path??(t?`${t}/${o}`:o)),s=Array.isArray(i.children)?i.children:Array.isArray(i.hijos)?i.hijos:[],c=j(o,String(i.hint??i.pista??e[o]??e[n]??""));for(let l of s){let h=Q(l,e,n);h&&c.hijos.set(h.nombre,h)}return c},ze=(r,e)=>{let t=j("");for(let i of r){let o=Q(i,e,"");o&&t.hijos.set(o.nombre,o)}return t},V=r=>{let e=r.hijos.size===0;return a`
    <li class="nodo ${e?"hoja":"carpeta"}">
      <div class="fila">
        <is-icon class="ico" icon="${e?"mdi:file-document-outline":"mdi:folder-outline"}" aria-hidden="true"></is-icon>
        <span class="nombre">${r.nombre}</span>
        ${r.pista?a`<span class="pista">${r.pista}</span>`:null}
      </div>
      ${e?null:a`
        <ul>
          ${[...r.hijos.values()].map(V)}
        </ul>
      `}
    </li>
  `};m("tk-file-tree",p(Te,(r,e)=>{let t=d(e.hints??e.notes),i=d(e.fileTree??{}),o=Array.isArray(e.tree)?e.tree:Array.isArray(i.tree)?i.tree:[],n=(Array.isArray(e.paths)?e.paths:Array.isArray(e.files)?e.files:Array.isArray(i.paths)?i.paths:[]).map(String).filter(Boolean);if(!o.length&&!n.length)return;let s=o.length?ze(o,{...d(i.hints),...t}):Ae(n,{...d(i.hints),...t}),c=String(e.rootLabel??e.root??i.rootLabel??"").trim(),l=[...s.hijos.values()].map(V);r.append(a`
    <h2 class="titulo">${String(e.title??i.title??"Archivos intervenidos")}</h2>
    <ul class="arbol" role="tree" aria-label="Archivos intervenidos">
      ${c?a`
        <li class="nodo carpeta raiz" role="treeitem">
          <div class="fila">
            <is-icon class="ico" icon="mdi:source-repository" aria-hidden="true"></is-icon>
            <span class="nombre">${c}</span>
          </div>
          <ul role="group">${l}</ul>
        </li>
      `:l}
    </ul>
  `)}));var Ee=`
  ${u}
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
`,je=r=>r.map((e,t)=>{let i=d(e);return{id:String(i.key??i.id??`h${t}`),label:String(i.label??i.name??`Hito ${t+1}`),date:String(i.iso??i.date??""),hora:String(i.hora??""),desc:String(i.nota??i.description??"")}}).filter(e=>e.label);m("tk-timeline",p(Ee,(r,e)=>{let t=d(e.timeline??e),i=je(Array.isArray(t.milestones)?t.milestones:Array.isArray(t.events)?t.events:[]),o=(Array.isArray(t.resumen)?t.resumen:[]).map(d);if(!i.length&&!o.length)return;let n=String(t.title??e.title??""),s=i.filter(l=>l.date&&!Number.isNaN(new Date(l.date).getTime())),c=s.length>=2?a`
      <is-timeline color="inline">
        ${T({timeline:{title:n||void 0,orientation:"vertical",events:s.map(l=>({id:l.id,label:l.label,date:l.date,desc:l.desc}))}})}
      </is-timeline>
    `:a`
      <ul class="hitos">
        ${i.map(l=>a`
          <li class="hito">
            <span class="hora">${l.hora||C(l.date)}</span>
            <span class="etiqueta">${l.label}</span>
            ${l.desc&&a`<span class="nota">${l.desc}</span>`}
          </li>
        `)}
      </ul>
    `;r.append(a`
    ${n&&a`<h2 class="titulo">${n}</h2>`}
    ${o.length>0&&a`
      <div class="resumen">
        ${o.map(l=>a`
          <div class="cifra" ${b(l.highlight===!0?"data-hl":"")}>
            <span class="cifra-rotulo">${String(l.label??"")}</span>
            <span class="cifra-valor">${String(l.value??"\u2014")}</span>
          </div>
        `)}
      </div>
    `}
    ${i.length>0&&c}
  `)}));var qe=`
  ${u}
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
`;m("tk-sequence",p(qe,(r,e)=>{let t=d(e.sequence),i=Array.isArray(t.messages)?t.messages:[],o=String(e.preset??t.preset??"");if(!i.length&&!o)return;let n=String(e.subtitle??"");r.append(a`
    ${e.title&&a`<h2 class="titulo">${e.title}</h2>`}
    ${n&&a`<p class="subtitulo">${n}</p>`}
    <div class="marco">
      <is-sequence-diagram color="inline">
        ${T(o&&!i.length?{preset:o}:{sequence:t})}
      </is-sequence-diagram>
    </div>
    ${e.caption&&a`<p class="pie">${e.caption}</p>`}
  `)}));var Le=`
  ${u}
  ${k}
  is-stepper { display: block; }
  .desc {
    color: var(--is-text-soft, #c3ced9);
    font-size: 0.875em;
  }
`;m("tk-stepper",p(Le,(r,e)=>{let t=d(e.stepper??e),i=(Array.isArray(t.steps)?t.steps:[]).map(d);i.length&&r.append(a`
    ${e.title&&a`<h2 class="titulo">${e.title}</h2>`}
    <!-- active = total: el procedimiento está documentado, ningún paso queda pendiente. -->
    <is-stepper orientation="vertical" active="${i.length}">
      ${i.map(o=>{let n=String(o.description??o.desc??"").trim();return a`
          <is-stepper-step
            label="${String(o.label??o.title??"")}"
            icon="${String(o.icon??"mdi:checkbox-marked-circle-outline")}"
          >
            ${n&&a`<div slot="description" class="desc prosa">${b(y(n))}</div>`}
          </is-stepper-step>
        `})}
    </is-stepper>
    ${e.caption&&a`<p class="pie">${e.caption}</p>`}
  `)}));var Ie=`
  ${u}
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
`;m("tk-chart",p(Ie,(r,e)=>{let t=d(e.chart??e),i=d(t.data);if(!(Array.isArray(i.datasets)?i.datasets:[]).length)return;let n=d(d(t.options).plugins),s=String(e.title??d(n.title).text??""),c=String(d(n.subtitle).text??""),l={...t,options:{...d(t.options),plugins:{...n,title:{display:!1},subtitle:{display:!1}}}};r.append(a`
    ${s&&a`<h2 class="titulo">${s}</h2>`}
    ${c&&a`<p class="subtitulo">${c}</p>`}
    <div class="marco">
      <is-chart type="${String(t.type??"bar")}">
        ${T(l)}
      </is-chart>
    </div>
    ${e.caption&&a`<p class="pie">${e.caption}</p>`}
  `)}));var Me=`
  ${u}
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
`,Ne="https://mermaid.ink/svg/",De=()=>document.documentElement.dataset.theme!=="light";m("tk-diagram",p(Me,(r,e)=>{let t=De(),i=String(t&&e.sourceDark||e.source||"").trim();if(!i)return;let o=String(e.engine??"mermaid").toLowerCase(),n=/^\s*%%\{/.test(i)?i:`%%{init: {"theme": "${t?"dark":"default"}"}}%%
${i}`,s=c=>{c.target.replaceWith(a`
      <p class="fallo">El servicio de diagramas no respondió. La fuente está abajo.</p>
    `),r.querySelector("is-details")?.setAttribute("open","")};r.append(a`
    ${e.title&&a`<h2 class="titulo">${e.title}</h2>`}
    <div class="marco">
      ${o==="mermaid"?a`
        <img
          src="${Ne+A.encode(n)}"
          alt="${String(e.alt??e.caption??"Diagrama del tiquete")}"
          loading="lazy"
          decoding="async"
          onerror=${s}
        >
      `:a`
        <p class="fallo">Motor de diagrama no soportado: ${o}.</p>
      `}
    </div>
    ${e.caption&&a`<p class="pie">${e.caption}</p>`}
    <is-details summary="Fuente ${o}" variant="filled-outlined">
      <pre><code>${i}</code></pre>
    </is-details>
  `)}));var Re=`
  :host {
    display: block;
    max-width: 100%;
    min-width: 0;
    overflow-wrap: anywhere;
  }
  :host([oculto]) { display: none; }
  is-callout { font-size: 0.8125rem; max-width: 100%; }
  code {
    font-family: var(--is-font-mono, ui-monospace, Menlo, monospace);
    white-space: break-spaces;
    overflow-wrap: anywhere;
    word-break: break-word;
    color: var(--tk-code-text, #a8d5ff);
  }
`,Be={markdown:"tk-markdown",md:"tk-markdown",text:"tk-markdown",html:"tk-html",badge:"tk-badges",badges:"tk-badges",table:"tk-table",image:"tk-image","image-group":"tk-image",steps:"tk-steps",timeline:"tk-timeline","metrics-timeline":"tk-timeline","file-tree":"tk-file-tree",code:"tk-code",sql:"tk-code",sequence:"tk-sequence","mui-stepper":"tk-stepper",stepper:"tk-stepper",url:"tk-url",link:"tk-url","cambio-bd":"tk-cambio-bd",chart:"tk-chart",diagram:"tk-diagram"},He=r=>{let e=d(r.payload);if(Array.isArray(r.blocks)&&r.blocks.length)return!0;for(let t of["text","body","html","code","sql","url","src","href","label","source"])if(String(e[t]??"").trim())return!0;for(let t of["rows","items","badges","paths","files","tree","phases","steps","milestones","events","resumen"])if(Array.isArray(e[t])&&e[t].length)return!0;for(let t of["timeline","sequence","stepper","chart","fileTree"])if(Object.keys(d(e[t])).length)return!0;return!1},D=class extends HTMLElement{#t={};#e;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),v(this.#e,Re)}connectedCallback(){this.#r()}get bloque(){return this.#t}set bloque(e){this.#t=e??{},this.isConnected&&this.#r()}get docLane(){return d(this.#t.payload).docLane??"otros"}#r(){for(;this.#e.firstChild;)this.#e.removeChild(this.#e.firstChild);let e=this.#t,t=String(e.kind??"").toLowerCase();if(!He(e)){this.setAttribute("oculto","");return}this.removeAttribute("oculto");let i=Be[t];if(!i){this.#e.append(a`
        <is-callout color="warning" icon="mdi:puzzle-outline">
          Bloque <code>${t||"sin tipo"}</code> sin representación en este visor.
        </is-callout>
      `);return}let o=document.createElement(i);Array.isArray(e.blocks)&&e.blocks.length&&(o.bloques=e.blocks),o.payload=d(e.payload),this.#e.append(o)}};m("tk-block",D);var Pe=`
  ${u}
  ${k}
  :host {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    container-type: inline-size;
  }
  .cima {
    margin-bottom: 1.15rem;
    min-width: 0;
  }
  .identidad {
    min-width: 0;
    max-width: 100%;
  }
  .codigo {
    display: flex;
    align-items: center;
    gap: 0.55em;
    margin: 0 0 0.4em;
    min-width: 0;
    color: var(--is-text-muted, #9aa7b4);
    font-family: var(--is-font-mono, ui-monospace, Menlo, monospace);
    font-size: 0.8125rem;
    letter-spacing: 0.04em;
    overflow-wrap: anywhere;
  }
  .punto {
    width: 0.5em;
    height: 0.5em;
    flex: none;
    border-radius: 50%;
    background: var(--punto);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--punto) 22%, transparent);
  }
  h1 {
    margin: 0 0 0.7rem;
    max-width: 100%;
    font-size: clamp(1.25rem, 1rem + 2.2vw, 2rem);
    font-weight: 660;
    letter-spacing: -0.024em;
    line-height: 1.2;
    overflow-wrap: anywhere;
    word-break: break-word;
    text-wrap: pretty;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4em;
    margin: 0;
    max-width: 100%;
    font-size: 0.8125rem;
  }
  .cifras {
    display: grid;
    gap: 0.65rem;
    margin: 0 0 1.15rem;
    min-width: 0;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr));
  }
  .cifra {
    display: grid;
    gap: 0.35rem;
    min-width: 0;
    padding: 0.7rem 0.85rem;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: color-mix(in srgb, var(--is-bg-soft, #14181d) 88%, transparent);
  }
  .cifra-rotulo {
    display: flex;
    align-items: center;
    gap: 0.4em;
    min-width: 0;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;

    is-icon { flex: none; font-size: 0.95em; opacity: 0.9; }
  }
  .cifra-valor {
    min-width: 0;
    font-size: 0.975rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    line-height: 1.35;
    overflow-wrap: anywhere;
    font-variant-numeric: tabular-nums;
  }
  .resumen {
    max-width: min(100%, var(--tk-measure, 68ch));
    min-width: 0;
    color: var(--is-text-soft, #c3ced9);
    font-size: 1rem;
    line-height: 1.7;
  }

  @container (max-width: 36rem) {
    .cima { margin-bottom: 0.95rem; }
    .cifras { grid-template-columns: 1fr; }
  }

  @media (max-width: 48rem) {
    .cifras { grid-template-columns: 1fr; }
  }
`,Fe={success:"var(--is-color-success-500, #2f9e44)",warning:"var(--is-color-warning-500, #f08c00)",info:"var(--is-accent, #1a6eb0)",neutral:"var(--is-text-muted, #9aa7b4)"},R=(r,e,t)=>r?a`
    <is-tag color="${e}" variant="filled-outlined" pill>
      <is-icon slot="start" icon="${t}" aria-hidden="true"></is-icon>
      ${r}
    </is-tag>
  `:null,q=(r,e,t)=>e?a`
    <div class="cifra">
      <span class="cifra-rotulo">
        <is-icon icon="${t}" aria-hidden="true"></is-icon>
        ${r}
      </span>
      <span class="cifra-valor">${e}</span>
    </div>
  `:null,B=class extends HTMLElement{#t=null;#e;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),v(this.#e,Pe)}connectedCallback(){this.#r()}get ticket(){return this.#t}set ticket(e){this.#t=e,this.isConnected&&this.#r()}#r(){for(;this.#e.firstChild;)this.#e.removeChild(this.#e.firstChild);let e=this.#t;if(!e)return;let t=G(e.estado),i=String(e.resumen??"").trim(),o=(e.rootCommits?.length??(e.contexts??[]).reduce((n,s)=>n+(s.commits?.length??0),0))||0;this.#e.append(a`
      <div class="cima">
        <div class="identidad">
          <p class="codigo">
            <span class="punto" style="--punto: ${Fe[t]}" aria-hidden="true"></span>
            ${e.iticket}
          </p>
          <h1>${String(e.titulo??e.iticket)}</h1>
          <div class="chips">
            ${R(String(e.estado??""),t,"mdi:circle-slice-8")}
            ${R(e.space==="patyia"?"PatyIA":"Clientes","brand","mdi:folder-outline")}
            ${R(String(e.solicitante??""),"neutral","mdi:account-outline")}
          </div>
        </div>
      </div>
      <div class="cifras">
        ${q("Solicitado",C(e.fechaSolicitud,!0),"mdi:calendar-arrow-right")}
        ${q("Entregado",C(e.fechaEntrega,!0),"mdi:calendar-check")}
        ${q("Tiempo total",K(e.tiempoTotalMinutos??e.diligenciaMinutos),"mdi:timer-outline")}
        ${q("Commits",o?String(o):"","mdi:source-commit")}
      </div>
      ${i&&a`<div class="resumen prosa">${b(y(i))}</div>`}
    `)}};m("tk-ticket-head",B);var Oe=`
  :host {
    display: block;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    font-family: var(--is-font-sans, system-ui, sans-serif);
  }
  .panel {
    overflow: auto;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: color-mix(in srgb, var(--is-bg-soft, #14181d) 92%, transparent);
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8125rem;
  }
  th, td {
    padding: 0.55rem 0.75rem;
    border-bottom: 1px solid var(--is-border-soft, #1f242b);
    text-align: left;
    vertical-align: top;
  }
  th {
    position: sticky;
    top: 0;
    background: color-mix(in srgb, var(--is-bg-soft, #14181d) 96%, var(--is-accent, #1a6eb0));
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.6875rem;
    font-weight: 650;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    white-space: nowrap;
  }
  th.num, td.num { text-align: right; font-variant-numeric: tabular-nums; }
  tr:last-child td { border-bottom: 0; }
  tr.total td {
    font-weight: 700;
    border-top: 2px solid var(--is-border, #2a3038);
    background: color-mix(in srgb, var(--is-bg-soft, #14181d) 80%, transparent);
  }
  a.hash {
    color: var(--tk-link, #6fb2e8);
    font-family: var(--is-font-mono, ui-monospace, Menlo, monospace);
    text-decoration: none;
  }
  a.hash:hover { text-decoration: underline; }
  .desc {
    display: -webkit-box;
    max-width: 36rem;
    overflow: hidden;
    line-height: 1.45;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow-wrap: anywhere;
  }
  .chip {
    display: inline-block;
    padding: 0.1em 0.45em;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 650;
    font-variant-numeric: tabular-nums;
  }
  .ins {
    color: #34d399;
    background: color-mix(in srgb, #10b981 16%, transparent);
  }
  .del {
    color: #f87171;
    background: color-mix(in srgb, #ef4444 16%, transparent);
  }
  .fecha { color: var(--is-text-muted, #9aa7b4); white-space: nowrap; }
`,Ue={ISS:"Dev-InSoft/ISS-AyudasCPIA","ISS-AyudasCPIA":"Dev-InSoft/ISS-AyudasCPIA",PatyIA:"Dev-InSoft/ISS-AyudasCPIA","ISA-DOC":"Dev-InSoft/ISA-DOC","isa-patyia":"Jeff-Aporta/isa-patyia",ISA:"Jeff-Aporta/isa-patyia","ISW-ClientesIS":"Dev-InSoft/ISW-ClientesIS","ISP-ClientesIS":"Dev-InSoft/ISP-ClientesIS","ISP-CLientesISServer":"Dev-InSoft/ISP-CLientesISServer","ISS-ClientesIS-ContaPymeU":"Dev-InSoft/ISS-ClientesIS-ContaPymeU","ISP-SvelteComponents":"Dev-InSoft/ISP-SvelteComponents"},_e=(r,e)=>{let t=e.trim();if(!t)return"#";let i=r.trim();return`https://github.com/${Ue[i]??`Dev-InSoft/${i||"repo"}`}/commit/${t}`},We=r=>{let e=d(r.meta),t=String(r.fecha??e.fecha??"");if(!t)return"\u2014";let i=new Date(t);if(Number.isNaN(i.getTime()))return C(t);let o=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];return`${i.getDate()} ${o[i.getMonth()]}`},Je=r=>{let e=d(r.meta);return String(e.repo??r.proyecto??"PatyIA")},H=class extends HTMLElement{#t=[];#e;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),v(this.#e,Oe)}connectedCallback(){this.#r()}get commits(){return this.#t}set commits(e){this.#t=Array.isArray(e)?e:[],this.isConnected&&this.#r()}#r(){for(;this.#e.firstChild;)this.#e.removeChild(this.#e.firstChild);let e=this.#t.filter(n=>String(n.hash??"").trim());if(!e.length)return;let t=0,i=0,o=0;for(let n of e)t+=Number(n.insCount??0),i+=Number(n.delCount??0),o+=Number(n.minutos??0);this.#e.append(a`
      <div class="panel" role="region" aria-label="Commits del tiquete">
        <table>
          <thead>
            <tr>
              <th>Commit</th>
              <th>Fecha</th>
              <th>Descripción</th>
              <th class="num">Ins</th>
              <th class="num">Del</th>
              <th class="num">Tiempo</th>
            </tr>
          </thead>
          <tbody>
            ${e.map(n=>{let s=String(n.hash??""),c=_e(Je(n),s);return a`
                <tr>
                  <td>
                    <a class="hash" href="${c}" target="_blank" rel="noopener noreferrer">
                      ${s.slice(0,9)}
                    </a>
                  </td>
                  <td class="fecha">${We(n)}</td>
                  <td><span class="desc" title="${String(n.descripcion??"")}">${String(n.descripcion??"")}</span></td>
                  <td class="num"><span class="chip ins">+${Number(n.insCount??0)}</span></td>
                  <td class="num"><span class="chip del">−${Number(n.delCount??0)}</span></td>
                  <td class="num">${Number(n.minutos??0)} min</td>
                </tr>
              `})}
            <tr class="total">
              <td></td>
              <td></td>
              <td>${e.length===1?"1 commit":`${e.length} commits`}</td>
              <td class="num"><span class="chip ins">+${t}</span></td>
              <td class="num"><span class="chip del">−${i}</span></td>
              <td class="num">${o} min</td>
            </tr>
          </tbody>
        </table>
      </div>
    `)}};m("tk-commits",H);var Ke=`
  :host {
    display: block;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    font-family: var(--is-font-sans, system-ui, sans-serif);
  }
  .panel {
    overflow: hidden;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: color-mix(in srgb, var(--is-bg-soft, #14181d) 92%, transparent);
  }
  .fila {
    display: grid;
    gap: 0.55rem;
    padding: 0.85rem 1rem;
    border-bottom: 1px solid var(--is-border-soft, #1f242b);
  }
  .fila:last-of-type { border-bottom: 0; }
  .cima {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem 0.75rem;
    align-items: flex-start;
    justify-content: space-between;
  }
  .nombre {
    font-size: 0.9rem;
    font-weight: 620;
    line-height: 1.4;
  }
  .detail {
    margin: 0.2rem 0 0;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.78rem;
    line-height: 1.45;
  }
  .mins {
    flex: none;
    color: var(--is-text-soft, #c3ced9);
    font-size: 0.8125rem;
    font-weight: 650;
    font-variant-numeric: tabular-nums;
  }
  .fase {
    display: inline-flex;
    align-items: center;
    padding: 0.12em 0.55em;
    border: 1px solid var(--fase-border);
    border-radius: 999px;
    background: var(--fase-bg);
    color: var(--fase-fg);
    font-size: 0.6875rem;
    font-weight: 650;
    letter-spacing: 0.02em;
  }
  .barra {
    height: 0.35rem;
    overflow: hidden;
    border-radius: 999px;
    background: color-mix(in srgb, var(--is-border-soft, #1f242b) 80%, transparent);
  }
  .relleno {
    height: 100%;
    border-radius: inherit;
    background: var(--fase-bar);
    max-width: 100%;
  }
  .total {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
    justify-content: space-between;
    padding: 0.85rem 1rem;
    border-top: 1px solid var(--is-border, #2a3038);
    background: color-mix(in srgb, var(--is-accent, #1a6eb0) 10%, var(--is-bg-soft, #14181d));
  }
  .total-lbl {
    font-size: 0.875rem;
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  .total-chip {
    display: inline-flex;
    align-items: center;
    padding: 0.35em 0.85em;
    border-radius: 999px;
    background: var(--is-accent, #1a6eb0);
    color: #fff;
    font-size: 0.875rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    box-shadow: 0 2px 10px color-mix(in srgb, var(--is-accent, #1a6eb0) 40%, transparent);
  }
  .linea {
    display: grid;
    gap: 0;
    margin: 0 0 0.85rem;
    padding: 0.35rem 0 0.15rem;
  }
  .pista {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.65rem;
    align-items: stretch;
  }
  .eje {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 1rem;
  }
  .punto {
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 50%;
    background: var(--fase-bar);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--fase-bar) 28%, transparent);
  }
  .trazo {
    flex: 1;
    width: 2px;
    min-height: 0.75rem;
    margin: 0.2rem 0;
    background: linear-gradient(to bottom, var(--fase-bar), var(--is-border-soft, #1f242b));
    opacity: 0.55;
  }
  .pista:last-child .trazo { display: none; }
  .carta {
    min-width: 0;
    padding: 0.35rem 0 0.85rem;
  }
`,P={investigacion:{label:"Investigaci\xF3n y testing",bar:"linear-gradient(90deg, #7c3aed, #8b5cf6)",bg:"rgba(124,58,237,0.14)",fg:"#c4b5fd",border:"rgba(167,139,250,0.45)"},commits:{label:"Commits",bar:"linear-gradient(90deg, #06b6d4, #6366f1)",bg:"rgba(6,182,212,0.14)",fg:"#a5f3fc",border:"rgba(34,211,238,0.45)"},diligencia:{label:"Diligencia",bar:"linear-gradient(90deg, #f59e0b, #fbbf24)",bg:"rgba(245,158,11,0.14)",fg:"#fde68a",border:"rgba(251,191,36,0.45)"},otro:{label:"Otro",bar:"linear-gradient(90deg, #059669, #10b981)",bg:"rgba(16,185,129,0.12)",fg:"#a7f3d0",border:"rgba(52,211,153,0.4)"}},Ye=r=>{let e=Math.round(Number(r??0));return e<=0?0:Math.round(e/5)*5},ee=r=>{let e=String(r.phase??"").trim().toLowerCase();if(e&&P[e])return e;let t=`${r.name??""} ${r.detail??""}`.toLowerCase();return/^diligencia\b|\bdiligencia del\b|evidencias \+|documentaci[oó]n tk/i.test(t)?"diligencia":/investigaci|testing\b|\bpruebas\b|verificaci|reproducci|matriz de prueba|diagn[oó]stico/i.test(t)?"investigacion":/commit|repositorio|codigo|c[oó]digo|servidor|front|desarrollo|entrega|bd\b|fix\b|feat\b/i.test(t)?"commits":"otro"},F=class extends HTMLElement{#t=[];#e;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),v(this.#e,Ke)}connectedCallback(){this.#r()}get tiempos(){return this.#t}set tiempos(e){this.#t=Array.isArray(e)?e:[],this.isConnected&&this.#r()}#r(){for(;this.#e.firstChild;)this.#e.removeChild(this.#e.firstChild);let e=this.#t.map(i=>({...i,minutos:Ye(i.minutos)})).filter(i=>i.minutos>0&&String(i.name??"").trim());if(!e.length)return;let t=e.reduce((i,o)=>i+o.minutos,0)||1;this.#e.append(a`
      <div class="linea" aria-label="Línea de tiempo de métricas">
        ${e.map(i=>{let o=ee(i),n=P[o];return a`
            <div
              class="pista"
              style="${`--fase-bar:${n.bar}`}"
            >
              <div class="eje">
                <span class="punto" aria-hidden="true"></span>
                <span class="trazo" aria-hidden="true"></span>
              </div>
              <div class="carta">
                <div class="cima">
                  <div>
                    <div class="nombre">${i.name}</div>
                    ${i.detail?a`<p class="detail">${i.detail}</p>`:null}
                  </div>
                  <span class="mins">${i.minutos} min</span>
                </div>
              </div>
            </div>
          `})}
      </div>
      <div class="panel" role="region" aria-label="Resumen de tiempos InSoft">
        ${e.map(i=>{let o=ee(i),n=P[o],s=Math.min(100,i.minutos/t*100);return a`
            <div
              class="fila"
              style="${`--fase-bar:${n.bar};--fase-bg:${n.bg};--fase-fg:${n.fg};--fase-border:${n.border}`}"
            >
              <div class="cima">
                <div>
                  <div class="cima" style="justify-content:flex-start;margin-bottom:0.25rem">
                    <span class="nombre">${i.name}</span>
                    <span class="fase">${n.label}</span>
                  </div>
                  ${i.detail?a`<p class="detail">${i.detail}</p>`:null}
                </div>
                <span class="mins">${i.minutos} min</span>
              </div>
              <div class="barra" aria-hidden="true">
                <div class="relleno" style="width: ${s.toFixed(1)}%"></div>
              </div>
            </div>
          `})}
        <div class="total">
          <span class="total-lbl">Tiempo invertido por estimación</span>
          <span class="total-chip">${t} min</span>
        </div>
      </div>
    `)}};m("tk-tiempos",F);var Et=new URL(".",document.baseURI).href,te=()=>{let e=new URLSearchParams(location.search).get("s");if(!e)return{};try{return JSON.parse(A.decode(e))}catch{return{}}},Ge=(r,e=!1)=>{let t={...te(),...r},i=Object.fromEntries(Object.entries(t).filter(([,n])=>n!=null&&n!==""&&n!==!1)),o=new URL(location.href);return Object.keys(i).length?o.searchParams.set("s",A.encode(JSON.stringify(i))):o.searchParams.delete("s"),history[e?"replaceState":"pushState"]({},"",o),i},Ze=r=>{let e=new URL(location.href);return e.searchParams.set("s",A.encode(JSON.stringify(r))),e.href},re={leer:te,escribir:Ge,enlace:Ze},z=(r,e="brand")=>{let t=document.querySelector("is-toast");if(t?.create){t.create(r,{color:e,duration:e==="warning"||e==="danger"?8e3:4e3});return}e==="danger"||e==="warning"?console.warn(`[tk] ${r}`):console.info(`[tk] ${r}`)};var L="https://cdn.jsdelivr.net/gh/Jeff-Aporta/is-webcomponents@main/dist/cdn";var Xe="Jeff-Aporta/jagudeloe-tks-front",Qe="03b625043f50705b81423faf429a15e568f77dab",oe=`https://cdn.jsdelivr.net/gh/${Xe}@${Qe}/dist/cdn`,ie=r=>r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),Ve=r=>{let e=`${r.iticket} \xB7 ${r.titulo??"Tiquete"}`,t=JSON.stringify(r).replace(/<\/(script)/gi,"<\\/$1");return`<!doctype html>
<html lang="es" class="theme-dark" data-theme="dark" data-palette="contapyme">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="generator" content="jagudeloe \xB7 visor de tiquetes">
<title>${ie(e)}</title>

<!-- Kit is-* (versi\xF3n fijada) -->
<link rel="stylesheet" href="${L}/is-base.min.css">
<link rel="stylesheet" href="${L}/palettes.min.css">
<script type="module" src="${L}/all.min.js"><\/script>

<!-- Componentes tk-* (bundle \xFAnico, CDN de este repo) -->
<script type="module" src="${oe}/tk.all.js"><\/script>

<style>
  :root {
    --tk-radius: 0.625rem;
    --tk-measure: 68ch;
    --tk-link: #6fb2e8;
    --tk-code-text: #a8d5ff;
  }
  html, body { margin: 0; background: var(--is-bg, #0b0d10); }
  body {
    min-height: 100vh;
    color: var(--is-text, #e6edf3);
    font-family: var(--is-font-sans, system-ui, -apple-system, "Segoe UI", sans-serif);
  }
  .tk-barra {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.6rem clamp(1rem, 4vw, 2rem);
    border-bottom: 1px solid var(--is-border-soft, #1f242b);
    background: var(--is-bg-soft, #14181d);
    font-size: 0.8125rem;
    color: var(--is-text-muted, #9aa7b4);

    strong { color: var(--is-text, #e6edf3); font-weight: 600; }
  }
</style>
</head>
<body>
  <div class="tk-barra">
    <span><strong>${ie(r.iticket)}</strong> \xB7 documentaci\xF3n descargada</span>
    <is-theme-toggle></is-theme-toggle>
  </div>

  <tk-view embebido></tk-view>

  <script type="application/json" id="tk-datos">${t}<\/script>
  <script type="module">
    const datos = JSON.parse(document.getElementById('tk-datos').textContent);
    const vista = document.querySelector('tk-view');
    customElements.whenDefined('tk-view').then(() => { vista.json = datos; });
  <\/script>
</body>
</html>
`},O={cdn:oe,async html(r){return Ve(r)},async descargar(r){let e=await O.html(r),t=new Blob([e],{type:"text/html;charset=utf-8"}),i=URL.createObjectURL(t),o=document.createElement("a");o.href=i,o.download=`${r.iticket}.html`,document.body.append(o),o.click(),o.remove(),setTimeout(()=>URL.revokeObjectURL(i),3e4)}};var et=`
  :host {
    display: none;
    flex-wrap: nowrap;
    gap: 0.15rem;
    align-items: center;
    flex: none;
    font-family: var(--is-font-sans, system-ui, sans-serif);
  }
  :host([activo]) { display: inline-flex; }
  is-button {
    min-width: 2.25rem;
  }
`,U=class extends HTMLElement{#t=null;#e;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),v(this.#e,et)}connectedCallback(){this.#i()}get ticket(){return this.#t}set ticket(e){this.#t=e,this.toggleAttribute("activo",!!e?.iticket),this.isConnected&&this.#i()}async#r(){let e=this.#t;if(!e)return;let t=re.enlace({space:e.space,tk:e.iticket,full:!0}),i=navigator;if(i.share)try{await i.share({title:`${e.iticket} \xB7 ${e.titulo??""}`.trim(),url:t});return}catch{}try{await navigator.clipboard.writeText(t),z("Enlace copiado al portapapeles.","success")}catch{z("No se pudo copiar el enlace. C\xF3pialo de la barra de direcciones.","warning")}}async#o(e){let t=this.#t;if(t){e.setAttribute("loading","");try{await O.descargar(t),z(`${t.iticket}.html descargado.`,"success")}catch(i){z(`No se pudo generar el HTML: ${i instanceof Error?i.message:i}`,"danger")}finally{e.removeAttribute("loading")}}}#i(){for(;this.#e.firstChild;)this.#e.removeChild(this.#e.firstChild);this.#t?.iticket&&this.#e.append(a`
      <is-button
        variant="text"
        color="neutral"
        pill
        type="button"
        aria-label="Compartir tiquete"
        title="Compartir"
        onclick=${()=>{this.#r()}}
      >
        <is-icon icon="mdi:share-variant-outline" aria-hidden="true"></is-icon>
      </is-button>
      <is-button
        variant="text"
        color="neutral"
        pill
        type="button"
        aria-label="Descargar HTML del tiquete"
        title="Descargar"
        onclick=${e=>{this.#o(e.currentTarget)}}
      >
        <is-icon icon="mdi:download-outline" aria-hidden="true"></is-icon>
      </is-button>
    `)}};m("tk-actions",U);var tt=`
  :host {
    display: block;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    container-type: inline-size;
    --tk-measure: 78ch;
    color: var(--is-text, #e6edf3);
    font-family: var(--is-font-sans, system-ui, -apple-system, "Segoe UI", sans-serif);
    overflow-wrap: break-word;
  }
  .documento {
    display: grid;
    gap: clamp(1.35rem, 1rem + 1.5vw, 2rem);
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    margin: 0;
    padding: clamp(0.9rem, 0.4rem + 1.6vw, 2.25rem) clamp(0.85rem, 0.4rem + 1.8vw, 2.5rem);
  }
  .encabezado,
  section,
  tk-ticket-head,
  tk-block,
  tk-commits,
  tk-tiempos {
    min-width: 0;
    max-width: 100%;
  }
  section {
    display: grid;
    gap: 0.9rem;
    padding-top: 0.15rem;
  }
  @container (max-width: 36rem) {
    .documento {
      gap: 1.25rem;
      padding-inline: 0.85rem;
    }
  }
  .rotulo {
    display: flex;
    align-items: center;
    gap: 0.75em;
    margin: 0 0 0.15rem;
    min-width: 0;
    color: var(--is-text-soft, #c3ced9);
    font-size: 0.72rem;
    font-weight: 650;
    letter-spacing: 0.11em;
    text-transform: uppercase;
  }
  .rotulo::after {
    height: 1px;
    flex: 1;
    min-width: 1rem;
    background: linear-gradient(
      to right,
      var(--is-border, #2a3038),
      transparent
    );
    content: "";
  }
  .vacio {
    display: grid;
    gap: 0.6rem;
    padding: 3rem 1rem;
    color: var(--is-text-muted, #9aa7b4);
    text-align: center;
  }
  .firma {
    margin-top: 0.5rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--is-border-soft, #1f242b);
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.75rem;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }
`,rt=[{lane:"solicitud",rotulo:"Solicitud"},{lane:"evidencias",rotulo:"Evidencias"},{lane:"causa",rotulo:"Causa"},{lane:"solucion",rotulo:"Soluci\xF3n"},{lane:"verificacion",rotulo:"Verificaci\xF3n"},{lane:"otros",rotulo:"Detalle"}],it=r=>{let e=Array.isArray(r.content)&&r.content.length?[...r.content]:[...r.doc?.blocks??[]],t=(r.contexts??[]).flatMap(i=>[...i.content??[]]);return[...e,...t].filter(i=>i&&typeof i=="object").sort((i,o)=>(i.sortKey??0)-(o.sortKey??0))},ot=(r,e)=>{let t=d(r.payload),i=String(t.docLane??t.section??t.lane??"").trim().toLowerCase();if(i==="solicitud"||i==="evidencias"||i==="causa"||i==="solucion"||i==="verificacion"||i==="otros")return i;let o=String(t.title??"").toLowerCase().normalize("NFD").replace(/\p{M}/gu,"");if(/^solicitud|^objetivo|requerimiento insoft|^requerimiento\b/.test(o))return"solicitud";if(/^evidencia|informacion del tiquete|pantallazo|captura/.test(o))return"evidencias";if(/hipotesis|causa identificada|causa del problema|^causa\b|antecedente|analisis realizado|diagnostico|raiz del problema/.test(o))return"causa";if(/verificacion\b|validacion\b|investigacion y pruebas|como probar|pruebas realizadas/.test(o))return"verificacion";if(/solucion aplicada|solucion entregada|^solucion\b|cambios en base de datos|resultado\b|conclusion|catalogo por tipo|resumen de tiempos/.test(o))return"solucion";let n=String(r.kind??"").toLowerCase();return n==="html"||n==="image"||n==="image-group"?e==="otros"?"evidencias":e:n==="badge"||n==="badges"?e==="otros"?"solicitud":e:n==="code"||n==="sql"||n==="cambio-bd"||n==="file-tree"?e==="otros"?"solucion":e:n==="steps"||n==="stepper"?e==="otros"?"verificacion":e:n==="table"&&e==="otros"?"evidencias":n==="markdown"||n==="md"||n==="text"?o?"otros":e:"otros"},at=r=>{let e="solicitud";return r.map(t=>{let i=ot(t,e);return e=i,{b:t,lane:i}})},nt=r=>{let e=[...r.rootCommits??[]];return e.length?e:(r.contexts??[]).flatMap(t=>[...t.commits??[]])},_=class extends HTMLElement{static get observedAttributes(){return["embebido"]}#t=null;#e;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),v(this.#e,tt)}connectedCallback(){this.#r()}attributeChangedCallback(){this.isConnected&&this.#r()}get ticket(){return this.#t}set ticket(e){this.#t=e,this.isConnected&&this.#r()}set json(e){let t=d(e);this.ticket=t.ticket?t.ticket:t}get embebido(){return this.hasAttribute("embebido")}set embebido(e){this.toggleAttribute("embebido",!!e)}#r(){for(;this.#e.firstChild;)this.#e.removeChild(this.#e.firstChild);let e=this.#t;if(!e?.iticket){this.#e.append(a`
        <div class="vacio">
          <is-icon icon="mdi:file-document-outline" style="font-size:2rem" aria-hidden="true"></is-icon>
          <p>Selecciona un tiquete para ver su documentación.</p>
        </div>
      `);return}let t=at(it(e)),i=Object.assign(document.createElement("tk-ticket-head"),{ticket:e}),o=nt(e),n=[...e.tiempos??[]].filter(h=>Number(h.minutos??0)>0),s=rt.map(({lane:h,rotulo:f})=>{let g=t.filter(w=>w.lane===h).map(w=>w.b);return g.length?a`
        <section aria-label="${f}">
          <h2 class="rotulo">${f}</h2>
          ${g.map(w=>Object.assign(document.createElement("tk-block"),{bloque:w}))}
        </section>
      `:null}).filter(Boolean),c=o.length?a`
        <section aria-label="Commits">
          <h2 class="rotulo">Commits</h2>
          ${Object.assign(document.createElement("tk-commits"),{commits:o})}
        </section>
      `:null,l=n.length?a`
        <section aria-label="Tiempos InSoft">
          <h2 class="rotulo">Tiempos InSoft</h2>
          ${Object.assign(document.createElement("tk-tiempos"),{tiempos:n})}
        </section>
      `:null;this.#e.append(a`
      <article class="documento">
        <header class="encabezado">${i}</header>
        ${s.length>0?s:a`
          <is-callout color="neutral" icon="mdi:text-box-remove-outline">
            Este tiquete todavía no tiene documentación publicada.
          </is-callout>
        `}
        ${c}
        ${l}
        <footer class="firma">
          ${e.iticket} · ${e.space==="patyia"?"PatyIA":"Clientes"} ·
          documentación generada desde jagudeloe-tks
        </footer>
      </article>
    `)}};m("tk-view",_);
