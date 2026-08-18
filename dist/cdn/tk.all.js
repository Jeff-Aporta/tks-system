var re=new Map,k=(i,e)=>{let t=re.get(e);t||(t=new CSSStyleSheet,t.replaceSync(e),re.set(e,t)),i.adoptedStyleSheets=[...i.adoptedStyleSheets,t]},u=`
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
    color: var(--is-text, #e6edf3);
    font-size: 0.8125em;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }
`;var M=Symbol("tk-html-crudo"),v=i=>({[M]:String(i??"")}),oe=i=>typeof i=="object"&&i!==null&&M in i,n=(i,...e)=>{let t=[],r=[],o="";for(let l=0;l<i.length;l++){if(o+=i[l],l>=e.length)continue;let c=e[l];if(c==null||c===!1||c===!0)continue;if(typeof c=="function"&&/\s+on([a-zA-Z][\w-]*)=\s*$/.test(o)){let f=o.match(/\s+on([a-zA-Z][\w-]*)=\s*$/);o=o.slice(0,o.length-f[0].length),o+=` data-tk-ev="${r.length}"`,r.push({evento:f[1].toLowerCase(),fn:c});continue}if(oe(c)){o+=c[M];continue}let g=Array.isArray(c)?c:[c];for(let f of g)f==null||f===!1||f===!0||(f instanceof Node?(o+=`<template data-tk-nodo="${t.length}"></template>`,t.push(f)):oe(f)?o+=f[M]:o+=S(f))}let a=document.createElement("template");a.innerHTML=o;let s=a.content;for(let l of[...s.querySelectorAll("template[data-tk-nodo]")]){let c=Number(l.dataset.tkNodo);l.replaceWith(t[c]??document.createComment("tk:nodo"))}for(let l of[...s.querySelectorAll("[data-tk-ev]")]){let c=Number(l.dataset.tkEv),h=r[c];h&&l.addEventListener(h.evento,h.fn),l.removeAttribute("data-tk-ev")}return s},A=i=>{let e=document.createElement("script");return e.type="application/json",e.textContent=JSON.stringify(i),e},S=i=>String(i??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"),d=i=>i&&typeof i=="object"&&!Array.isArray(i)?i:{},T=i=>{let e=[],t=String(i??"").replace(/`([^`]+)`/g,(r,o)=>(e.push(o),` ${e.length-1} `));return t=S(t).replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g,(r,o,a)=>`<a href="${S(a)}" target="_blank" rel="noopener noreferrer">${o}</a>`).replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/(^|[\s(])\*([^*\n]+)\*/g,"$1<em>$2</em>").replace(/~~([^~]+)~~/g,"<del>$1</del>"),t.replace(/ (\d+) /g,(r,o)=>`<code>${S(e[Number(o)])}</code>`)},x=i=>{let e=String(i??"").replace(/\r\n?/g,`
`).split(`
`),t=[],r=[],o=0,a=()=>{r.length&&t.push(`<p>${T(r.join(" "))}</p>`),r.length=0};for(;o<e.length;){let s=e[o],l=s.match(/^\s*```(\w+)?\s*$/);if(l){a();let g=[];for(o++;o<e.length&&!/^\s*```\s*$/.test(e[o]);)g.push(e[o++]);o++,t.push(`<pre data-lang="${S(l[1]??"")}"><code>${S(g.join(`
`))}</code></pre>`);continue}if(/^\s*\|/.test(s)&&/^\s*\|[\s:|-]+\|?\s*$/.test(e[o+1]??"")){a();let g=w=>w.trim().replace(/^\||\|$/g,"").split("|").map(N=>T(N.trim())),f=g(s);o+=2;let b=[];for(;o<e.length&&/^\s*\|/.test(e[o]);)b.push(g(e[o++]));t.push(`<table><thead><tr>${f.map(w=>`<th>${w}</th>`).join("")}</tr></thead><tbody>${b.map(w=>`<tr>${w.map(N=>`<td>${N}</td>`).join("")}</tr>`).join("")}</tbody></table>`);continue}let c=s.match(/^(#{1,6})\s+(.*)$/);if(c){a();let g=Math.min(c[1].length+2,6);t.push(`<h${g}>${T(c[2])}</h${g}>`),o++;continue}if(/^\s*(---|___|\*\*\*)\s*$/.test(s)){a(),t.push("<hr>"),o++;continue}if(/^\s*>\s?/.test(s)){a();let g=[];for(;o<e.length&&/^\s*>\s?/.test(e[o]);)g.push(e[o++].replace(/^\s*>\s?/,""));t.push(`<blockquote>${x(g.join(`
`))}</blockquote>`);continue}let h=s.match(/^\s*([-*+]|\d+[.)])\s+/);if(h){a();let g=/\d/.test(h[1]),f=[];for(;o<e.length;){let w=e[o].match(/^\s*([-*+]|\d+[.)])\s+(.*)$/);if(!w){if(f.length&&/^\s{2,}\S/.test(e[o])){f[f.length-1]+=` ${e[o].trim()}`,o++;continue}break}f.push(w[2]),o++}let b=g?"ol":"ul";t.push(`<${b}>${f.map(w=>`<li>${T(w)}</li>`).join("")}</${b}>`);continue}if(!s.trim()){a(),o++;continue}r.push(s.trim()),o++}return a(),t.join(`
`)},y=`
  .prosa {
    max-width: 100%;
    min-width: 0;
    color: var(--is-text, #e6edf3);
    overflow-wrap: anywhere;
    word-break: break-word;

    > :first-child { margin-top: 0; }
    > :last-child { margin-bottom: 0; }

    /* Solo la prosa continua usa medida de lectura; cards/tablas/listas
       aprovechan el ancho del visor (evita columna estrecha + scroll extra). */
    > p,
    > blockquote {
      max-width: min(100%, var(--tk-measure, 72ch));
    }

    h3, h4, h5, h6 {
      margin: 1.1em 0 0.4em;
      max-width: 100%;
      font-weight: 620;
      letter-spacing: -0.01em;
      line-height: 1.3;
      overflow-wrap: anywhere;
    }
    h3 { font-size: 1.0625em; }
    h4 { font-size: 0.9375em; }
    p { margin: 0 0 0.75em; overflow-wrap: anywhere; }
    ul, ol {
      margin: 0 0 0.75em;
      padding-left: 1.15em;
      max-width: 100%;
    }
    /* Listas-tarjeta del HTML InSoft (border + list-style:none): full width,
       menos aire vertical entre \xEDtems. */
    ul[style*="list-style:none"],
    ul[style*="list-style: none"] {
      display: grid;
      gap: 0.4rem;
      padding-left: 0;
      margin: 0.35rem 0 0.65rem;
      max-width: 100%;
    }
    ul[style*="list-style:none"] > li,
    ul[style*="list-style: none"] > li {
      box-sizing: border-box;
      width: 100%;
      max-width: 100%;
      margin: 0 !important;
      padding: 0.4rem 0.7rem !important;
      line-height: 1.45;
    }
    li {
      margin: 0.25em 0;
      padding-left: 0.15em;
      overflow-wrap: anywhere;

      &::marker { color: var(--is-accent, #1a6eb0); }
      > p { margin: 0.15em 0; }
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
      max-width: min(100%, var(--tk-measure, 72ch));
      padding: 0.15em 0 0.15em 0.95em;
      border-left: 2px solid color-mix(in srgb, var(--is-accent, #1a6eb0) 70%, transparent);
      color: var(--is-text, #e6edf3);
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
    /* Anchos fijos de plantilla email (680px): fluidizar en el visor. */
    table[width],
    table[style*="680px"],
    table[style*="600px"],
    div[style*="680px"],
    div[style*="600px"] {
      width: 100% !important;
      max-width: 100% !important;
    }
    th, td {
      padding: 0.5em 0.75em;
      border-bottom: 1px solid var(--is-border-soft, #1f242b);
      text-align: left;
      vertical-align: top;
    }
    th { font-weight: 600; color: var(--is-text, #e6edf3); }
    del { color: var(--is-text, #e6edf3); opacity: 0.72; text-decoration: line-through; }

    is-callout {
      max-width: 100%;
      --_pad-y: 0.5em;
      --_pad-x: 0.75em;
      --spacing: 0.75em;
    }
  }
`,Ae=new Intl.DateTimeFormat("es-CO",{day:"2-digit",month:"short",year:"numeric"}),Ee=new Intl.DateTimeFormat("es-CO",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}),$=(i,e=!1)=>{if(!i)return"";let t=String(i).trim();(t.startsWith('"')&&t.endsWith('"')||t.startsWith("'")&&t.endsWith("'"))&&(t=t.slice(1,-1).trim());let r=new Date(t);return Number.isNaN(r.getTime())?t:(e?Ee:Ae).format(r)},R=i=>{let e=Number(i);if(!Number.isFinite(e)||e<=0)return"";let t=Math.floor(e/60),r=Math.round(e%60);return t?r?`${t} h ${r} min`:`${t} h`:`${r} min`},ze={primary:"brand",brand:"brand",info:"info",success:"success",ok:"success",warning:"warning",warn:"warning",danger:"danger",error:"danger",violet:"brand",neutral:"neutral",default:"neutral"},ae=i=>ze[String(i??"").toLowerCase()]??"neutral",ne=i=>{let e=String(i??"").toLowerCase();return e.includes("cerrad")||e.includes("solucion")?"success":e.includes("proceso")||e.includes("curso")?"warning":e.includes("abiert")||e.includes("nuevo")?"info":"neutral"},E={encode(i){let e=new TextEncoder().encode(i),t="";for(let r of e)t+=String.fromCharCode(r);return btoa(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")},decode(i){let e=String(i).replace(/-/g,"+").replace(/_/g,"/");for(;e.length%4;)e+="=";let t=atob(e),r=new Uint8Array(t.length);for(let o=0;o<t.length;o++)r[o]=t.charCodeAt(o);return new TextDecoder().decode(r)}},m=(i,e)=>{customElements.get(i)||customElements.define(i,e)},p=(i,e)=>class extends HTMLElement{#t={};#e;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),k(this.#e,i)}connectedCallback(){this.#i()}get payload(){return this.#t}set payload(t){this.#t=d(t),this.isConnected&&this.#i()}#i(){for(;this.#e.firstChild;)this.#e.removeChild(this.#e.firstChild);e(this.#e,this.#t,this)}};var Ie=`
  ${u}
  ${y}
`;m("tk-markdown",p(Ie,(i,e)=>{let t=String(e.text??e.body??e.content??"").trim();!t&&!e.title||i.append(n`
    ${e.title&&n`<h2 class="titulo">${e.title}</h2>`}
    ${t&&n`<div class="prosa">${v(x(t))}</div>`}
  `)}));var je=`
  ${u}
  ${y}
  .prosa img { max-width: 100%; height: auto; border-radius: var(--tk-radius, 0.625rem); }
  .prosa table { display: table; width: 100%; max-width: 100%; overflow-x: auto; }
  /* Redacci\xF3n del ticket: hereda --is-text del tema; ignora grises inline InSoft. */
  .prosa,
  .prosa :is(p, li, span, div, strong, em, h1, h2, h3, h4, h5, h6, td, th) {
    color: var(--is-text, #e6edf3);
  }
  .prosa a { color: var(--tk-link, #6fb2e8); }
  .prosa code { color: var(--tk-code-text, #a8d5ff); }
`,Me=["script","style","iframe","object","embed","form","link","meta","base"],Re=i=>i.replace(/(?:^|;)\s*width\s*:\s*\d{3,4}px\b/gi,";width:100%").replace(/(?:^|;)\s*max-width\s*:\s*\d{3,4}px\b/gi,";max-width:100%").replace(/(?:^|;)\s*min-width\s*:\s*\d{3,4}px\b/gi,";min-width:0").replace(/^;+/,"").trim(),Le=i=>i.replace(/(?:^|;)\s*color\s*:\s*(?:#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})\b|rgba?\([^)]*\)|hsla?\([^)]*\)|gray|grey|silver|currentcolor)\s*/gi,";").replace(/;{2,}/g,";").replace(/^;+|;+$/g,"").trim(),qe=i=>{let e=new DOMParser().parseFromString(String(i??""),"text/html");e.body.querySelectorAll(Me.join(",")).forEach(t=>t.remove());for(let t of e.body.querySelectorAll("*")){for(let s of[...t.attributes]){let l=s.name.toLowerCase(),c=s.value.trim().toLowerCase();(l.startsWith("on")||(l==="href"||l==="src")&&c.startsWith("javascript:"))&&t.removeAttribute(s.name)}t.tagName==="A"&&(t.setAttribute("target","_blank"),t.setAttribute("rel","noopener noreferrer"));let r=t.getAttribute("width");r&&/^\d{3,4}$/.test(r)&&Number(r)>=400&&(t.removeAttribute("width"),t.setAttribute("data-tk-fluid",""));let o=t.getAttribute("style");if(!o)continue;let a=o;/color\s*:/i.test(a)&&(a=Le(a)),/\d{3,4}px/.test(a)&&/(?:^|;)\s*(?:max-)?width\s*:/i.test(a)&&(a=Re(a)),a?a!==o&&t.setAttribute("style",a):t.removeAttribute("style")}return e.body.innerHTML};m("tk-html",p(je,(i,e)=>{let t=String(e.html??"").trim();!t&&!e.title||i.append(n`
    ${e.title&&n`<h2 class="titulo">${e.title}</h2>`}
    ${t&&n`<div class="prosa">${v(qe(t))}</div>`}
  `)}));var De=`
  ${u}
  .fila {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45em;
    align-items: center;
    font-size: 0.875rem;
  }
`;m("tk-badges",p(De,(i,e)=>{let r=(Array.isArray(e.items)?e.items:Array.isArray(e.badges)?e.badges:e.label?[e]:[]).map(d).map(o=>({texto:String(o.label??o.text??"").trim(),color:ae(o.tone??o.color)})).filter(o=>o.texto);r.length&&i.append(n`
    ${e.title&&n`<h2 class="titulo">${e.title}</h2>`}
    <div class="fila">
      ${r.map(o=>n`
        <is-tag color="${o.color}" variant="filled-outlined" pill>${o.texto}</is-tag>
      `)}
    </div>
  `)}));var Be=`
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
      color: var(--is-text, #e6edf3);
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
`,P=i=>{if(i==null)return"";if(typeof i=="object"){let e=d(i);return T(e.text??e.label??e.value??"")}return T(i)};m("tk-table",p(Be,(i,e)=>{let t=(Array.isArray(e.rows)?e.rows:[]).map(l=>Array.isArray(l)?l:[l]);if(!t.length)return;let r=(Array.isArray(e.headers)?e.headers:[]).map(String);if(t.every(l=>l.length===2)){i.append(n`
      ${e.title&&n`<h2 class="titulo">${e.title}</h2>`}
      <dl class="ficha">
        ${t.map(l=>n`
          <dt>${v(P(l[0]))}</dt>
          <dd>${v(P(l[1]))}</dd>
        `)}
      </dl>
      ${e.caption&&n`<p class="pie">${e.caption}</p>`}
    `);return}let o=Math.max(...t.map(l=>l.length),r.length),a=Array.from({length:o},(l,c)=>({field:`c${c}`,headerName:r[c]??`Columna ${c+1}`,flex:1,sortable:!0,renderCell:({value:h})=>({html:P(h)})})),s=Object.assign(document.createElement("is-data-grid"),{columns:a,rows:t.map((l,c)=>{let h={id:c};return l.forEach((g,f)=>{h[`c${f}`]=g}),h})});s.setAttribute("auto-height",""),s.setAttribute("hide-footer",""),s.setAttribute("density","compact"),s.setAttribute("disable-column-menu",""),s.setAttribute("toolbar-tools","false"),i.append(n`
    ${e.title&&n`<h2 class="titulo">${e.title}</h2>`}
    ${s}
    ${e.caption&&n`<p class="pie">${e.caption}</p>`}
  `)}));var Ne=`
  ${u}
  /* auto-fill + tope fijo (no 1fr): con pocas evidencias las miniaturas
     quedan en celdas ~18rem, no estiradas al ancho del documento. */
  .rejilla {
    display: grid;
    gap: 0.85rem;
    grid-template-columns: repeat(auto-fill, minmax(min(14rem, 100%), 18rem));
    justify-content: start;
    align-items: start;
  }
  figure {
    margin: 0;
    overflow: hidden;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: var(--is-bg-soft, #14181d);
    min-width: 0;
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
      height: var(--tk-image-alto, 10.5rem);
      object-fit: cover;
      object-position: top center;
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
    line-height: 1.45;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .rota {
    padding: 1.2em;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.8125em;
    text-align: center;
  }
`,Pe=`
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
`,se=i=>{let e=String(i.url??i.src??"").trim();return e?{url:e,alt:String(i.alt??i.caption??i.title??"Evidencia del tiquete"),caption:String(i.caption??"")}:null},O=class extends HTMLElement{#t;#e=[];#i=0;#o=e=>{this.hasAttribute("open")&&(e.key==="Escape"?this.cerrar():e.key==="ArrowRight"?this.#r(1):e.key==="ArrowLeft"&&this.#r(-1))};constructor(){super(),this.#t=this.attachShadow({mode:"open"});let e=new CSSStyleSheet;e.replaceSync(Pe),this.#t.adoptedStyleSheets=[e]}connectedCallback(){document.addEventListener("keydown",this.#o),this.addEventListener("click",e=>{e.target===this&&this.cerrar()})}disconnectedCallback(){document.removeEventListener("keydown",this.#o)}abrir(e,t=0){this.#e=e,this.#i=Math.max(0,Math.min(t,e.length-1)),this.setAttribute("open",""),this.#n(),queueMicrotask(()=>this.#t.querySelector(".cerrar")?.focus())}cerrar(){this.removeAttribute("open")}#r(e){this.#e.length<2||(this.#i=(this.#i+e+this.#e.length)%this.#e.length,this.#n())}#n(){let e=this.#e[this.#i];if(!e)return;let t=this.#e.length>1;for(;this.#t.firstChild;)this.#t.removeChild(this.#t.firstChild);this.#t.append(n`
      <div class="marco" role="dialog" aria-modal="true" aria-label="${e.alt}">
        ${t?n`<span class="contador">${this.#i+1} / ${this.#e.length}</span>`:null}
        <button class="cerrar" type="button" aria-label="Cerrar" onclick=${()=>this.cerrar()}>
          <is-icon icon="mdi:close" aria-hidden="true"></is-icon>
        </button>
        ${t?n`
          <button class="nav prev" type="button" aria-label="Anterior" onclick=${()=>this.#r(-1)}>
            <is-icon icon="mdi:chevron-left" aria-hidden="true"></is-icon>
          </button>
          <button class="nav next" type="button" aria-label="Siguiente" onclick=${()=>this.#r(1)}>
            <is-icon icon="mdi:chevron-right" aria-hidden="true"></is-icon>
          </button>
        `:null}
        <img class="foto" src="${e.url}" alt="${e.alt}">
        ${e.caption||e.alt?n`<p class="leyenda">${e.caption||e.alt}</p>`:null}
      </div>
    `)}};customElements.get("tk-lightbox")||customElements.define("tk-lightbox",O);var Oe=()=>{let i=document.querySelector("tk-lightbox");return i||(i=document.createElement("tk-lightbox"),document.body.append(i)),i},He=i=>{let e=new Set;return i.filter(t=>{let r=t.url.split("?")[0]??t.url;return e.has(r)?!1:(e.add(r),!0)})},Fe=(i,e,t)=>{let r=a=>{a.target.removeAttribute("data-cargando")},o=a=>{let s=a.target;(s.closest(".lienzo")??s).replaceWith(n`
      <p class="rota">La evidencia ya no está disponible.</p>
    `)};return n`
    <figure>
      <button
        class="lienzo"
        type="button"
        aria-label="Ampliar: ${i.alt}"
        onclick=${()=>Oe().abrir(e,t)}
      >
        <img
          src="${i.url}"
          alt="${i.alt}"
          loading="lazy"
          decoding="async"
          data-cargando
          onload=${r}
          onerror=${o}
        >
      </button>
      ${i.caption&&n`<figcaption>${i.caption}</figcaption>`}
    </figure>
  `};m("tk-image",p(Ne,(i,e,t)=>{let r=t.bloques??[],o=He((r.length?r.map(a=>se(d(a.payload))):[se(e)]).filter(a=>!!a));o.length&&i.append(n`
    ${e.title&&n`<h2 class="titulo">${e.title}</h2>`}
    <div class="rejilla">
      ${o.map((a,s)=>Fe(a,o,s))}
    </div>
  `)}));var _e=`
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
`,Ue=new RegExp("\\b("+["select","from","where","insert","into","values","update","set","delete","create","alter","drop","table","index","view","join","left","right","inner","outer","on","group","order","by","having","limit","offset","and","or","not","null","as","distinct","case","when","then","else","end","begin","commit","rollback","union","exists","between","like","in","const","let","var","function","return","if","for","while","await","async","class","extends","new","this","import","export","default","interface","type","try","catch","throw","typeof","true","false"].join("|")+")\\b","gi"),Ve=i=>{let e=[],t=o=>(e.push(o),`\0${e.length-1}\0`),r=S(i);return r=r.replace(/(--[^\n]*|\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*)/g,o=>t(`<span class="com">${o}</span>`)),r=r.replace(/('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`)/g,o=>t(`<span class="str">${o}</span>`)),r=r.replace(/\b\d+(\.\d+)?\b/g,o=>t(`<span class="num">${o}</span>`)),r=r.replace(Ue,o=>t(`<span class="key">${o}</span>`)),r.replace(/ (\d+) /g,(o,a)=>e[Number(a)])};m("tk-code",p(_e,(i,e)=>{let t=String(e.code??e.sql??"").replace(/\s+$/,"");if(!t)return;let r=String(e.language??(e.sql?"sql":"")).trim();i.append(n`
    ${e.title&&n`<h2 class="titulo">${e.title}</h2>`}
    <div class="marco">
      <div class="barra">
        <span class="lenguaje">${r||"c\xF3digo"}</span>
        <is-copy-button value="${t}" aria-label="Copiar código"></is-copy-button>
      </div>
      <pre><code>${v(Ve(t))}</code></pre>
    </div>
    ${e.caption&&n`<p class="pie">${e.caption}</p>`}
  `)}));var Ge=`
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
`;m("tk-url",p(Ge,(i,e)=>{let t=String(e.href??e.url??"").trim();/^https?:\/\//i.test(t)&&i.append(n`
    ${e.title&&n`<h2 class="titulo">${e.title}</h2>`}
    <a href="${t}" target="_blank" rel="noopener noreferrer">
      <is-icon icon="mdi:open-in-new" aria-hidden="true"></is-icon>
      <span class="etiqueta">${String(e.label??t)}</span>
    </a>
    ${e.caption&&n`<p class="pie">${e.caption}</p>`}
  `)}));var Je="https://cdn.jsdelivr.net/npm/lite-youtube-embed@0.3.3/src/lite-yt-embed.js",Ke=`
  ${u}

  /* Copia de lite-yt-embed.css (0.3.3). Tope de ancho + centrado: el visor
     no debe dejar que el 16:9 se coma la columna del tiquete. */
  :host {
    display: block;
    max-width: 100%;
  }
  lite-youtube {
    position: relative;
    display: block;
    contain: content;
    box-sizing: border-box;
    width: 100%;
    max-width: min(100%, var(--tk-video-max, 36rem));
    margin-inline: 0;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    border: 1px solid var(--is-border, #2a3038);
    border-radius: var(--tk-radius, 0.625rem);
    background-color: #000;
    background-position: center center;
    background-size: cover;
    cursor: pointer;
  }
  lite-youtube::before {
    content: attr(data-title);
    display: block;
    position: absolute;
    top: 0;
    background-image: linear-gradient(180deg, rgb(0 0 0 / 67%) 0%, rgb(0 0 0 / 54%) 14%, rgb(0 0 0 / 15%) 54%, rgb(0 0 0 / 5%) 72%, rgb(0 0 0 / 0%) 94%);
    height: 99px;
    width: 100%;
    font-family: "YouTube Noto", Roboto, Arial, Helvetica, sans-serif;
    color: hsl(0deg 0% 93.33%);
    text-shadow: 0 0 2px rgb(0 0 0 / 50%);
    font-size: 1rem;
    padding: 1.25rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    box-sizing: border-box;
  }
  lite-youtube:hover::before { color: #fff; }
  lite-youtube > iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
  lite-youtube > .lty-playbtn {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    background: no-repeat center/68px 48px;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68 48"><path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="red"/><path d="M45 24 27 14v20" fill="white"/></svg>');
    cursor: pointer;
    z-index: 1;
    filter: grayscale(100%);
    transition: filter 0.1s cubic-bezier(0, 0, 0.2, 1);
    border: 0;
  }
  lite-youtube:hover > .lty-playbtn,
  lite-youtube .lty-playbtn:focus { filter: none; }
  lite-youtube.lyt-activated { cursor: unset; }
  lite-youtube.lyt-activated::before,
  lite-youtube.lyt-activated > .lty-playbtn {
    opacity: 0;
    pointer-events: none;
  }
  .lyt-visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    white-space: nowrap;
    clip-path: inset(50%);
  }
  .pie {
    margin-inline: 0;
    max-width: min(100%, var(--tk-video-max, 36rem));
    text-align: start;
  }
`,We=/^[a-zA-Z0-9_-]{6,20}$/,le=!1,Ye=()=>{if(le||customElements.get("lite-youtube"))return;le=!0;let i=document.createElement("script");i.src=Je,i.async=!0,document.head.append(i)};m("tk-video",p(Ke,(i,e)=>{let t=String(e.youtubeid??e.youtubeId??"").trim();if(!We.test(t))return;Ye();let r=`Reproducir: ${String(e.title??"video")}`;i.append(n`
    <lite-youtube videoid="${t}" params="rel=0&amp;modestbranding=1" playlabel="${r}">
      <a
        class="lty-playbtn"
        href="https://www.youtube.com/watch?v=${t}"
        target="_blank"
        rel="noopener noreferrer"
      ><span class="lyt-visually-hidden">${r}</span></a>
    </lite-youtube>
    ${e.caption&&n`<p class="pie">${e.caption}</p>`}
  `)}));var Ze=`
  ${u}
  ${y}
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
`,ce=(i,e)=>e?n`<dl class="campo"><dt>${i}</dt><dd>${e}</dd></dl>`:null;m("tk-cambio-bd",p(Ze,(i,e)=>{let t=String(e.sql??"").trim(),r=String(e.tabla??"").trim(),o=String(e.registro??"").trim(),a=String(e.intencion??"").trim();if(!t&&!r&&!a)return;let s=t?Object.assign(document.createElement("tk-code"),{payload:{code:t,language:"sql"}}):null;i.append(n`
    <h2 class="titulo">${String(e.title??"Cambio en base de datos")}</h2>
    <div class="marco">
      ${(r||o)&&n`
        <div class="cabecera">
          ${ce("Tabla",r)}
          ${ce("Registro",o)}
        </div>
      `}
      ${a&&n`<div class="intencion prosa">${v(x(a))}</div>`}
      ${s}
    </div>
  `)}));var Xe=`
  ${u}
  ${y}
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
`,Qe=(i,e)=>{let t=d(i),r=Array.isArray(t.items)?t.items:Array.isArray(t.steps)?t.steps:t.text?[t.text]:[];return{title:String(t.title??t.label??`Fase ${e+1}`),items:r}},et=i=>i==null?null:typeof i=="string"?n`<div class="hallazgo prosa">${v(x(i))}</div>`:Object.assign(document.createElement("tk-block"),{bloque:i});m("tk-steps",p(Xe,(i,e)=>{let r=(Array.isArray(e.phases)?e.phases:Array.isArray(e.steps)?e.steps:[]).map(Qe).filter(o=>o.items.length||o.title);r.length&&i.append(n`
    ${e.title&&n`<h2 class="titulo">${e.title}</h2>`}
    <ol>
      ${r.map(o=>n`
        <li class="fase">
          <h3>${o.title}</h3>
          <div class="hallazgos">${o.items.map(et)}</div>
        </li>
      `)}
    </ol>
  `)}));var tt=`
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
`,j=(i,e,t="")=>({nombre:i,path:e,hijos:new Map,pista:t||void 0}),it=(i,e)=>{let t=j("","");for(let r of i){let o=String(r).split(/[/\\]/).filter(Boolean),a=t,s=[];o.forEach((l,c)=>{s.push(l);let h=s.join("/");if(a.hijos.has(l)){if(c===o.length-1){let g=a.hijos.get(l),f=String(g.pista??e[h]??e[r]??e[l]??"");f&&!g.pista&&a.hijos.set(l,j(l,h,f))}}else{let f=c===o.length-1?String(e[h]??e[r]??e[l]??e[o.slice(0,c+1).join("/")]??""):"";a.hijos.set(l,j(l,h,f))}a=a.hijos.get(l)})}return t},de=(i,e,t)=>{let r=d(i),o=String(r.name??r.nombre??"").trim();if(!o)return null;let a=String(r.path??(t?`${t}/${o}`:o)),s=Array.isArray(r.children)?r.children:Array.isArray(r.hijos)?r.hijos:[],l=j(o,a,String(r.hint??r.pista??e[a]??e[o]??""));for(let c of s){let h=de(c,e,a);h&&l.hijos.set(h.nombre,h)}return l},rt=(i,e)=>{let t=j("","");for(let r of i){let o=de(r,e,"");o&&t.hijos.set(o.nombre,o)}return t},me=0,ue=i=>{let e=i.hijos.size===0,t=e?"mdi:file-document-outline":"mdi:folder-outline",r=i.pista?`ft-tip-${++me}`:"";return n`
    <li class="nodo ${e?"hoja":"carpeta"}">
      <div class="fila">
        <is-icon class="ico" icon="${t}" aria-hidden="true"></is-icon>
        ${i.pista?n`
            <span class="nombre" id="${r}" tabindex="0">${i.nombre}</span>
            <is-tooltip for="${r}" placement="top">${i.pista}</is-tooltip>
          `:n`<span class="nombre">${i.nombre}</span>`}
      </div>
      ${e?null:n`
        <ul>
          ${[...i.hijos.values()].map(ue)}
        </ul>
      `}
    </li>
  `};m("tk-file-tree",p(tt,(i,e)=>{me=0;let t=d(e.hints??e.notes),r=d(e.fileTree??{}),o=Array.isArray(e.tree)?e.tree:Array.isArray(r.tree)?r.tree:[],a=(Array.isArray(e.paths)?e.paths:Array.isArray(e.files)?e.files:Array.isArray(r.paths)?r.paths:[]).map(String).filter(Boolean);if(!o.length&&!a.length)return;let s=o.length?rt(o,{...d(r.hints),...t}):it(a,{...d(r.hints),...t}),l=String(e.rootLabel??e.root??r.rootLabel??"").trim(),c=[...s.hijos.values()].map(ue);i.append(n`
    <h2 class="titulo">${String(e.title??r.title??"Archivos intervenidos")}</h2>
    <ul class="arbol" role="tree" aria-label="Archivos intervenidos">
      ${l?n`
        <li class="nodo carpeta raiz" role="treeitem">
          <div class="fila">
            <is-icon class="ico" icon="mdi:source-repository" aria-hidden="true"></is-icon>
            <span class="nombre">${l}</span>
          </div>
          <ul role="group">${c}</ul>
        </li>
      `:c}
    </ul>
  `)}));var ot=`
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
`,at=i=>i.map((e,t)=>{let r=d(e);return{id:String(r.key??r.id??`h${t}`),label:String(r.label??r.name??`Hito ${t+1}`),date:String(r.iso??r.date??""),hora:String(r.hora??""),desc:String(r.nota??r.description??"")}}).filter(e=>e.label);m("tk-timeline",p(ot,(i,e)=>{let t=d(e.timeline??e),r=at(Array.isArray(t.milestones)?t.milestones:Array.isArray(t.events)?t.events:[]),o=(Array.isArray(t.resumen)?t.resumen:[]).map(d);if(!r.length&&!o.length)return;let a=String(t.title??e.title??""),s=r.filter(c=>c.date&&!Number.isNaN(new Date(c.date).getTime())),l=s.length>=2?n`
      <is-timeline color="inline">
        ${A({timeline:{title:a||void 0,orientation:"vertical",events:s.map(c=>({id:c.id,label:c.label,date:c.date,desc:c.desc}))}})}
      </is-timeline>
    `:n`
      <ul class="hitos">
        ${r.map(c=>n`
          <li class="hito">
            <span class="hora">${c.hora||$(c.date)}</span>
            <span class="etiqueta">${c.label}</span>
            ${c.desc&&n`<span class="nota">${c.desc}</span>`}
          </li>
        `)}
      </ul>
    `;i.append(n`
    ${a&&n`<h2 class="titulo">${a}</h2>`}
    ${o.length>0&&n`
      <div class="resumen">
        ${o.map(c=>n`
          <div class="cifra" ${v(c.highlight===!0?"data-hl":"")}>
            <span class="cifra-rotulo">${String(c.label??"")}</span>
            <span class="cifra-valor">${String(c.value??"\u2014")}</span>
          </div>
        `)}
      </div>
    `}
    ${r.length>0&&l}
  `)}));var nt=`
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
`;m("tk-sequence",p(nt,(i,e)=>{let t=d(e.sequence),r=Array.isArray(t.messages)?t.messages:[],o=String(e.preset??t.preset??"");if(!r.length&&!o)return;let a=String(e.subtitle??"");i.append(n`
    ${e.title&&n`<h2 class="titulo">${e.title}</h2>`}
    ${a&&n`<p class="subtitulo">${a}</p>`}
    <div class="marco">
      <is-sequence-diagram color="inline">
        ${A(o&&!r.length?{preset:o}:{sequence:t})}
      </is-sequence-diagram>
    </div>
    ${e.caption&&n`<p class="pie">${e.caption}</p>`}
  `)}));var st=`
  ${u}
  ${y}
  is-stepper { display: block; }
  .desc {
    color: var(--is-text, #e6edf3);
    font-size: 0.875em;
  }
`;m("tk-stepper",p(st,(i,e)=>{let t=d(e.stepper??e),r=(Array.isArray(t.steps)?t.steps:[]).map(d);r.length&&i.append(n`
    ${e.title&&n`<h2 class="titulo">${e.title}</h2>`}
    <!-- active = total: el procedimiento está documentado, ningún paso queda pendiente. -->
    <is-stepper orientation="vertical" active="${r.length}">
      ${r.map(o=>{let a=String(o.description??o.desc??"").trim();return n`
          <is-stepper-step
            label="${String(o.label??o.title??"")}"
            icon="${String(o.icon??"mdi:checkbox-marked-circle-outline")}"
          >
            ${a&&n`<div slot="description" class="desc prosa">${v(x(a))}</div>`}
          </is-stepper-step>
        `})}
    </is-stepper>
    ${e.caption&&n`<p class="pie">${e.caption}</p>`}
  `)}));var lt=`
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
`;m("tk-chart",p(lt,(i,e)=>{let t=d(e.chart??e),r=d(t.data);if(!(Array.isArray(r.datasets)?r.datasets:[]).length)return;let a=d(d(t.options).plugins),s=String(e.title??d(a.title).text??""),l=String(d(a.subtitle).text??""),c={...t,options:{...d(t.options),plugins:{...a,title:{display:!1},subtitle:{display:!1}}}};i.append(n`
    ${s&&n`<h2 class="titulo">${s}</h2>`}
    ${l&&n`<p class="subtitulo">${l}</p>`}
    <div class="marco">
      <is-chart type="${String(t.type??"bar")}">
        ${A(c)}
      </is-chart>
    </div>
    ${e.caption&&n`<p class="pie">${e.caption}</p>`}
  `)}));var ct=`
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
`,dt="https://mermaid.ink/svg/",mt=()=>document.documentElement.dataset.theme!=="light";m("tk-diagram",p(ct,(i,e)=>{let t=mt(),r=String(t&&e.sourceDark||e.source||"").trim();if(!r)return;let o=String(e.engine??"mermaid").toLowerCase(),a=/^\s*%%\{/.test(r)?r:`%%{init: {"theme": "${t?"dark":"default"}"}}%%
${r}`,s=l=>{l.target.replaceWith(n`
      <p class="fallo">El servicio de diagramas no respondió. La fuente está abajo.</p>
    `),i.querySelector("is-details")?.setAttribute("open","")};i.append(n`
    ${e.title&&n`<h2 class="titulo">${e.title}</h2>`}
    <div class="marco">
      ${o==="mermaid"?n`
        <img
          src="${dt+E.encode(a)}"
          alt="${String(e.alt??e.caption??"Diagrama del tiquete")}"
          loading="lazy"
          decoding="async"
          onerror=${s}
        >
      `:n`
        <p class="fallo">Motor de diagrama no soportado: ${o}.</p>
      `}
    </div>
    ${e.caption&&n`<p class="pie">${e.caption}</p>`}
    <is-details summary="Fuente ${o}" variant="filled-outlined">
      <pre><code>${r}</code></pre>
    </is-details>
  `)}));var ut=`
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
`,pt={markdown:"tk-markdown",md:"tk-markdown",text:"tk-markdown",html:"tk-html",badge:"tk-badges",badges:"tk-badges",table:"tk-table",image:"tk-image","image-group":"tk-image",steps:"tk-steps",timeline:"tk-timeline","metrics-timeline":"tk-timeline","file-tree":"tk-file-tree",code:"tk-code",sql:"tk-code",sequence:"tk-sequence","mui-stepper":"tk-stepper",stepper:"tk-stepper",url:"tk-url",link:"tk-url",video:"tk-video",youtube:"tk-video","cambio-bd":"tk-cambio-bd",chart:"tk-chart",diagram:"tk-diagram"},gt=i=>{let e=d(i.payload);if(Array.isArray(i.blocks)&&i.blocks.length)return!0;for(let t of["text","body","html","code","sql","url","src","href","label","source","youtubeid","youtubeId"])if(String(e[t]??"").trim())return!0;for(let t of["rows","items","badges","paths","files","tree","phases","steps","milestones","events","resumen"])if(Array.isArray(e[t])&&e[t].length)return!0;for(let t of["timeline","sequence","stepper","chart","fileTree"])if(Object.keys(d(e[t])).length)return!0;return!1},H=class extends HTMLElement{#t={};#e;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),k(this.#e,ut)}connectedCallback(){this.#i()}get bloque(){return this.#t}set bloque(e){this.#t=e??{},this.isConnected&&this.#i()}get docLane(){return d(this.#t.payload).docLane??"otros"}#i(){for(;this.#e.firstChild;)this.#e.removeChild(this.#e.firstChild);let e=this.#t,t=String(e.kind??"").toLowerCase();if(!gt(e)){this.setAttribute("oculto","");return}this.removeAttribute("oculto");let r=pt[t];if(!r){this.#e.append(n`
        <is-callout color="warning" icon="mdi:puzzle-outline">
          Bloque <code>${t||"sin tipo"}</code> sin representación en este visor.
        </is-callout>
      `);return}let o=document.createElement(r);Array.isArray(e.blocks)&&e.blocks.length&&(o.bloques=e.blocks),o.payload=d(e.payload),this.#e.append(o)}};m("tk-block",H);var ht=`
  ${u}
  ${y}
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
    color: var(--is-text, #e6edf3);
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
`,ft={success:"var(--is-color-success-500, #2f9e44)",warning:"var(--is-color-warning-500, #f08c00)",info:"var(--is-accent, #1a6eb0)",neutral:"var(--is-text-muted, #9aa7b4)"},F=(i,e,t)=>i?n`
    <is-tag color="${e}" variant="filled-outlined" pill>
      <is-icon slot="start" icon="${t}" aria-hidden="true"></is-icon>
      ${i}
    </is-tag>
  `:null,L=(i,e,t)=>e?n`
    <div class="cifra">
      <span class="cifra-rotulo">
        <is-icon icon="${t}" aria-hidden="true"></is-icon>
        ${i}
      </span>
      <span class="cifra-valor">${e}</span>
    </div>
  `:null,_=class extends HTMLElement{#t=null;#e;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),k(this.#e,ht)}connectedCallback(){this.#i()}get ticket(){return this.#t}set ticket(e){this.#t=e,this.isConnected&&this.#i()}#i(){for(;this.#e.firstChild;)this.#e.removeChild(this.#e.firstChild);let e=this.#t;if(!e)return;let t=ne(e.estado),r=String(e.resumen??"").trim(),o=(e.rootCommits?.length??(e.contexts??[]).reduce((a,s)=>a+(s.commits?.length??0),0))||0;this.#e.append(n`
      <div class="cima">
        <div class="identidad">
          <p class="codigo">
            <span class="punto" style="--punto: ${ft[t]}" aria-hidden="true"></span>
            ${e.iticket}
          </p>
          <h1>${String(e.titulo??e.iticket)}</h1>
          <div class="chips">
            ${F(String(e.estado??""),t,"mdi:circle-slice-8")}
            ${F(e.space==="patyia"?"PatyIA":e.space==="isp-svelte"?"ISP Svelte":"Clientes","brand","mdi:folder-outline")}
            ${F(String(e.solicitante??""),"neutral","mdi:account-outline")}
          </div>
        </div>
      </div>
      <div class="cifras">
        ${L("Solicitado",$(e.fechasolicitud,!0),"mdi:calendar-arrow-right")}
        ${L("Entregado",$(e.fechaentrega,!0),"mdi:calendar-check")}
        ${L("Tiempo total",R(e.tiempoTotalMinutos??e.diligenciaMinutos),"mdi:timer-outline")}
        ${L("Commits",o?String(o):"","mdi:source-commit")}
      </div>
      ${r&&n`<div class="resumen prosa">${v(x(r))}</div>`}
    `)}};m("tk-ticket-head",_);var bt=`
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
    max-width: 100%;
    overflow: hidden;
    line-height: 1.45;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow-wrap: anywhere;
  }
  /* La descripci\xF3n es la \xFAnica columna el\xE1stica: absorbe todo el ancho
     sobrante para que hash/fecha/cifras no queden flotando en una tabla
     angosta dentro de un panel ancho. */
  th:nth-child(3), td:nth-child(3) { width: 100%; }
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
`,vt={ISS:"Dev-InSoft/ISS-AyudasCPIA","ISS-AyudasCPIA":"Dev-InSoft/ISS-AyudasCPIA",PatyIA:"Dev-InSoft/ISS-AyudasCPIA","ISA-DOC":"Dev-InSoft/ISA-DOC","isa-patyia":"Jeff-Aporta/isa-patyia",ISA:"Jeff-Aporta/isa-patyia","ISW-ClientesIS":"Dev-InSoft/ISW-ClientesIS","ISP-ClientesIS":"Dev-InSoft/ISP-ClientesIS","ISP-CLientesISServer":"Dev-InSoft/ISP-CLientesISServer","ISS-ClientesIS-ContaPymeU":"Dev-InSoft/ISS-ClientesIS-ContaPymeU","ISP-SvelteComponents":"Dev-InSoft/ISP-SvelteComponents"},kt=(i,e)=>{let t=e.trim();if(!t)return"#";let r=i.trim();return`https://github.com/${vt[r]??`Dev-InSoft/${r||"repo"}`}/commit/${t}`},wt=i=>{let e=d(i.meta),t=String(i.fecha??e.fecha??"");if(!t)return"\u2014";let r=new Date(t);if(Number.isNaN(r.getTime()))return $(t);let o=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];return`${r.getDate()} ${o[r.getMonth()]}`},yt=i=>{let e=d(i.meta);return String(e.repo??i.proyecto??"PatyIA")},U=class extends HTMLElement{#t=[];#e;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),k(this.#e,bt)}connectedCallback(){this.#i()}get commits(){return this.#t}set commits(e){this.#t=Array.isArray(e)?e:[],this.isConnected&&this.#i()}#i(){for(;this.#e.firstChild;)this.#e.removeChild(this.#e.firstChild);let e=this.#t.filter(a=>String(a.hash??"").trim());if(!e.length)return;let t=0,r=0,o=0;for(let a of e)t+=Number(a.inscount??0),r+=Number(a.delcount??0),o+=Number(a.minutos??0);this.#e.append(n`
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
            ${e.map(a=>{let s=String(a.hash??""),l=kt(yt(a),s);return n`
                <tr>
                  <td>
                    <a class="hash" href="${l}" target="_blank" rel="noopener noreferrer">
                      ${s.slice(0,9)}
                    </a>
                  </td>
                  <td class="fecha">${wt(a)}</td>
                  <td><span class="desc" title="${String(a.descripcion??"")}">${String(a.descripcion??"")}</span></td>
                  <td class="num"><span class="chip ins">+${Number(a.inscount??0)}</span></td>
                  <td class="num"><span class="chip del">−${Number(a.delcount??0)}</span></td>
                  <td class="num">${Number(a.minutos??0)} min</td>
                </tr>
              `})}
            <tr class="total">
              <td></td>
              <td></td>
              <td>${e.length===1?"1 commit":`${e.length} commits`}</td>
              <td class="num"><span class="chip ins">+${t}</span></td>
              <td class="num"><span class="chip del">−${r}</span></td>
              <td class="num">${o} min</td>
            </tr>
          </tbody>
        </table>
      </div>
    `)}};m("tk-commits",U);var xt=`
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
`,V={investigacion:{label:"Investigaci\xF3n y testing",bar:"linear-gradient(90deg, #7c3aed, #8b5cf6)",bg:"rgba(124,58,237,0.14)",fg:"#c4b5fd",border:"rgba(167,139,250,0.45)"},commits:{label:"Commits",bar:"linear-gradient(90deg, #06b6d4, #6366f1)",bg:"rgba(6,182,212,0.14)",fg:"#a5f3fc",border:"rgba(34,211,238,0.45)"},diligencia:{label:"Diligencia",bar:"linear-gradient(90deg, #f59e0b, #fbbf24)",bg:"rgba(245,158,11,0.14)",fg:"#fde68a",border:"rgba(251,191,36,0.45)"},otro:{label:"Otro",bar:"linear-gradient(90deg, #059669, #10b981)",bg:"rgba(16,185,129,0.12)",fg:"#a7f3d0",border:"rgba(52,211,153,0.4)"}},$t=i=>{let e=Math.round(Number(i??0));return e<=0?0:Math.round(e/5)*5},pe=i=>{let e=String(i.phase??"").trim().toLowerCase();if(e&&V[e])return e;let t=`${i.name??""} ${i.detail??""}`.toLowerCase();return/^diligencia\b|\bdiligencia del\b|evidencias \+|documentaci[oó]n tk/i.test(t)?"diligencia":/investigaci|testing\b|\bpruebas\b|verificaci|reproducci|matriz de prueba|diagn[oó]stico/i.test(t)?"investigacion":/commit|repositorio|codigo|c[oó]digo|servidor|front|desarrollo|entrega|bd\b|fix\b|feat\b/i.test(t)?"commits":"otro"},G=class extends HTMLElement{#t=[];#e;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),k(this.#e,xt)}connectedCallback(){this.#i()}get tiempos(){return this.#t}set tiempos(e){this.#t=Array.isArray(e)?e:[],this.isConnected&&this.#i()}#i(){for(;this.#e.firstChild;)this.#e.removeChild(this.#e.firstChild);let e=this.#t.map(r=>({...r,minutos:$t(r.minutos)})).filter(r=>r.minutos>0&&String(r.name??"").trim());if(!e.length)return;let t=e.reduce((r,o)=>r+o.minutos,0)||1;this.#e.append(n`
      <div class="linea" aria-label="Línea de tiempo de métricas">
        ${e.map(r=>{let o=pe(r),a=V[o];return n`
            <div
              class="pista"
              style="${`--fase-bar:${a.bar}`}"
            >
              <div class="eje">
                <span class="punto" aria-hidden="true"></span>
                <span class="trazo" aria-hidden="true"></span>
              </div>
              <div class="carta">
                <div class="cima">
                  <div>
                    <div class="nombre">${r.name}</div>
                    ${r.detail?n`<p class="detail">${r.detail}</p>`:null}
                  </div>
                  <span class="mins">${r.minutos} min</span>
                </div>
              </div>
            </div>
          `})}
      </div>
      <div class="panel" role="region" aria-label="Resumen de tiempos InSoft">
        ${e.map(r=>{let o=pe(r),a=V[o],s=Math.min(100,r.minutos/t*100);return n`
            <div
              class="fila"
              style="${`--fase-bar:${a.bar};--fase-bg:${a.bg};--fase-fg:${a.fg};--fase-border:${a.border}`}"
            >
              <div class="cima">
                <div>
                  <div class="cima" style="justify-content:flex-start;margin-bottom:0.25rem">
                    <span class="nombre">${r.name}</span>
                    <span class="fase">${a.label}</span>
                  </div>
                  ${r.detail?n`<p class="detail">${r.detail}</p>`:null}
                </div>
                <span class="mins">${r.minutos} min</span>
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
    `)}};m("tk-tiempos",G);var St=`
  :host {
    display: block;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    container-type: inline-size;
    color: var(--is-text, #e6edf3);
    font-family: var(--is-font-sans, system-ui, -apple-system, "Segoe UI", sans-serif);
  }
  .metrics {
    display: grid;
    gap: clamp(1.1rem, 0.8rem + 1.2vw, 1.75rem);
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    margin: 0;
    padding: 0;
  }
  .eyebrow {
    margin: 0;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.72rem;
    font-weight: 650;
    letter-spacing: 0.11em;
    text-transform: uppercase;
  }
  .titulo {
    margin: 0.35rem 0 0;
    font-size: clamp(1.35rem, 1.1rem + 1.2vw, 1.85rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }
  .sub {
    margin: 0.45rem 0 0;
    color: var(--is-text-soft, #c3ced9);
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.45;
  }
  .meta {
    margin: 0.55rem 0 0;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.875rem;
    line-height: 1.45;
  }
  .avisos {
    display: grid;
    gap: 0.65rem;
  }
  .kpis {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0;
    overflow: hidden;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background:
      linear-gradient(
        135deg,
        color-mix(in srgb, var(--is-bg-soft, #14181d) 88%, transparent),
        color-mix(in srgb, var(--is-accent, #1a6eb0) 10%, transparent)
      );
  }
  .kpi {
    display: grid;
    gap: 0.35rem;
    min-width: 0;
    padding: 1rem 1.05rem;
  }
  .kpi + .kpi {
    border-left: 1px solid color-mix(in srgb, var(--is-border, #2a3038) 70%, transparent);
  }
  .kpi-lbl {
    display: flex;
    gap: 0.4rem;
    align-items: center;
    min-width: 0;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.78rem;
    font-weight: 550;
  }
  .kpi-lbl is-icon { flex: none; font-size: 1.05em; }
  .kpi-val {
    font-size: 1.35rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    line-height: 1.15;
  }
  .kpi-sub {
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.75rem;
    line-height: 1.4;
  }
  .card {
    display: grid;
    gap: 0.85rem;
    padding: 1rem 1.1rem;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: color-mix(in srgb, var(--is-bg-soft, #14181d) 92%, transparent);
  }
  .card-h {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin: 0;
    font-size: 0.95rem;
    font-weight: 650;
  }
  .card-h is-icon { color: var(--is-accent, #1a6eb0); }
  .filas {
    display: grid;
    gap: 0.45rem;
  }
  .fila {
    display: grid;
    grid-template-columns: minmax(7rem, 11rem) minmax(0, 1fr);
    gap: 0.65rem 1rem;
    align-items: baseline;
    font-size: 0.875rem;
    line-height: 1.45;
  }
  .fila dt {
    margin: 0;
    color: var(--is-text-muted, #9aa7b4);
    font-weight: 550;
  }
  .fila dd {
    margin: 0;
    min-width: 0;
    overflow-wrap: anywhere;
  }
  .vacio {
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.9rem;
    line-height: 1.5;
  }
  @container (max-width: 40rem) {
    .kpis { grid-template-columns: 1fr; }
    .kpi + .kpi {
      border-left: 0;
      border-top: 1px solid color-mix(in srgb, var(--is-border, #2a3038) 70%, transparent);
    }
    .fila { grid-template-columns: 1fr; gap: 0.15rem; }
  }
`,Tt=i=>{let e=d(i.detallesextra),t=d(i.meta),r=d(e.metricas),a={...d(t.metricas),...r},s=d(a.documentacion);return s.metricasHabilesMinutos&&!a.metricasHabilesMinutos&&(a.metricasHabilesMinutos=d(s.metricasHabilesMinutos)),a},z=i=>{let e=Number(i);return Number.isFinite(e)&&e>0?Math.round(e):0},ge=i=>{let e=Number(i);return Number.isFinite(e)&&e>0?Math.round(e*60):0},Ct=(i,e)=>{let t=d(e.metricasHabilesMinutos),r=d(e.documentacion),o=d(r.metricasHabilesMinutos),a=z(t.hastaAtencion??o.hastaAtencion)||z(i.diligenciaMinutos),s=d(e.reporteEmpresa),l=z(t.atencionActiva??o.atencionActiva)||ge(s.horasAtencion),c=z(t.totalSolucion??o.totalSolucion??i.tiempoTotalMinutos)||ge(s.horasSolucion)||z(i.tiempoestimacionminutos)||a+l+z(i.commitminutos);return[{icon:"mdi:clock-start",label:"Hasta atenci\xF3n",minutos:a,sub:"Creaci\xF3n \u2192 inicio atenci\xF3n"},{icon:"mdi:head-cog-outline",label:"Atenci\xF3n activa",minutos:l,sub:"Inicio atenci\xF3n \u2192 cierre"},{icon:"mdi:check-decagram",label:"Total soluci\xF3n h\xE1bil",minutos:c,sub:"Tiempo real laborado / estimado"}]},J=class extends HTMLElement{#t=null;#e;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),k(this.#e,St)}connectedCallback(){this.#i()}get ticket(){return this.#t}set ticket(e){this.#t=e,this.isConnected&&this.#i()}#i(){for(;this.#e.firstChild;)this.#e.removeChild(this.#e.firstChild);let e=this.#t;if(!e?.iticket){this.#e.append(n`<p class="vacio">Sin tiquete para métricas.</p>`);return}let t=Tt(e),r=d(t.documentacion),o=d(t.reporteEmpresa),a=Ct(e,t),s=[...e.tiempos??[]].filter(b=>Number(b.minutos??0)>0),l=!t.fechaCierre&&String(r.cierreEmpresa??e.estado??"").toLowerCase().includes("abierto")||!t.fechaCierre&&!e.fechaentrega,c=String(r.tiposolicitudapertura??d(e.normativa).tiposolicitudapertura??d(e.normativa).tipoSolicitud??"").trim(),h=[];t.fechaCreacion?(l||!t.fechaCierre)&&h.push(n`
        <is-callout color="info" icon="mdi:information-outline">
          Ticket abierto — sin cierre InSoft. Las métricas de atención activa y total se completan al registrar el cierre.
        </is-callout>
      `):h.push(n`
        <is-callout color="warning" icon="mdi:calendar-alert">
          Falta fecha de creación InSoft (<code>metricas.fechaCreacion</code>).
        </is-callout>
      `);let g=[["Creaci\xF3n",t.fechaCreacion||$(e.fechasolicitud,!0)||"\u2014"],["Inicio atenci\xF3n",t.horaInicioAtencion||"\u2014"],["Cierre",t.fechaCierre||$(e.fechaentrega,!0)||"Abierto"],["Tipo apertura",c||"\u2014"],["Asignado",String(r.asignadoA||r.ingeniero||"\u2014")],["Solicitante",String(r.solicitante||e.solicitante||"\u2014")],["Clasificador",String(r.clasificador||"\u2014")],["Medio",String(r.medioAtencion||"\u2014")]].filter(([,b])=>String(b).trim()&&String(b)!=="\u2014"),f=[["Horas atenci\xF3n (empresa)",o.horasAtencion!=null?`${o.horasAtencion} h`:""],["Horas soluci\xF3n (empresa)",o.horasSolucion!=null?`${o.horasSolucion} h`:""],["Capturado",String(o.capturado||"")],["Fuente",String(o.fuente||"")]].filter(([,b])=>String(b).trim());this.#e.append(n`
      <article class="metrics" aria-label="Métricas InSoft">
        <header>
          <p class="eyebrow">Estudio de métricas · tiempo hábil InSoft</p>
          <h1 class="titulo">${e.iticket}</h1>
          <p class="sub">${e.titulo||""}</p>
          ${c?n`<p class="meta">Tipo solicitud apertura: ${c}</p>`:null}
        </header>

        ${h.length?n`<div class="avisos">${h}</div>`:null}

        <div class="kpis" role="group" aria-label="Indicadores de tiempo hábil">
          ${a.map(b=>n`
            <div class="kpi">
              <div class="kpi-lbl">
                <is-icon icon="${b.icon}" aria-hidden="true"></is-icon>
                <span>${b.label}</span>
              </div>
              <div class="kpi-val">${b.minutos>0?R(b.minutos):"\u2014"}</div>
              <div class="kpi-sub">${b.sub}</div>
            </div>
          `)}
        </div>

        ${g.length?n`
          <section class="card" aria-label="Datos InSoft">
            <h2 class="card-h">
              <is-icon icon="mdi:clipboard-text-clock-outline" aria-hidden="true"></is-icon>
              Datos InSoft
            </h2>
            <dl class="filas">
              ${g.map(([b,w])=>n`
                <div class="fila"><dt>${b}</dt><dd>${w}</dd></div>
              `)}
            </dl>
            ${t.notas?n`<p class="meta">${t.notas}</p>`:null}
          </section>
        `:null}

        ${f.length?n`
          <section class="card" aria-label="Reporte empresa">
            <h2 class="card-h">
              <is-icon icon="mdi:office-building-outline" aria-hidden="true"></is-icon>
              Reporte empresa
            </h2>
            <dl class="filas">
              ${f.map(([b,w])=>n`
                <div class="fila"><dt>${b}</dt><dd>${w}</dd></div>
              `)}
            </dl>
          </section>
        `:null}

        <section class="card" aria-label="Desglose de tiempos">
          <h2 class="card-h">
            <is-icon icon="mdi:chart-timeline-variant" aria-hidden="true"></is-icon>
            Desglose de tiempos
          </h2>
          ${s.length?Object.assign(document.createElement("tk-tiempos"),{tiempos:s}):n`<p class="vacio">Sin filas de tiempo estimadas en este tiquete.</p>`}
        </section>
      </article>
    `)}};m("tk-metrics",J);var ji=(()=>{try{return new URL(".",document.baseURI).href}catch{return""}})(),he=()=>{let e=new URLSearchParams(location.search).get("s");if(!e)return{};try{return JSON.parse(E.decode(e))}catch{return{}}},At=(i,e=!1)=>{let t={...he(),...i},r=Object.fromEntries(Object.entries(t).filter(([,a])=>a!=null&&a!==""&&a!==!1)),o=new URL(location.href);return Object.keys(r).length?o.searchParams.set("s",E.encode(JSON.stringify(r))):o.searchParams.delete("s"),history[e?"replaceState":"pushState"]({},"",o),r},Et=i=>{let e=new URL(location.href);return e.searchParams.set("s",E.encode(JSON.stringify(i))),e.href},fe={leer:he,escribir:At,enlace:Et},C=(i,e="brand")=>{let t=document.querySelector("is-toast");if(t?.create){t.create(i,{color:e,duration:e==="warning"||e==="danger"?8e3:4e3});return}e==="danger"||e==="warning"?console.warn(`[tk] ${i}`):console.info(`[tk] ${i}`)};var q="https://cdn.jsdelivr.net/gh/Jeff-Aporta/is-webcomponents@main/dist/cdn";var zt="Jeff-Aporta/tks-system",It="main",ve=`https://cdn.jsdelivr.net/gh/${zt}@${It}/dist/cdn`,be=i=>i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),jt=i=>{let e=`${i.iticket} \xB7 ${i.titulo??"Tiquete"}`,t=JSON.stringify(i).replace(/<\/(script)/gi,"<\\/$1");return`<!doctype html>
<html lang="es" class="theme-dark" data-theme="dark" data-palette="contapyme">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="generator" content="jagudeloe \xB7 visor de tiquetes">
<title>${be(e)}</title>

<!-- Kit is-* (versi\xF3n fijada) -->
<link rel="stylesheet" href="${q}/is-base.min.css">
<link rel="stylesheet" href="${q}/palettes.min.css">

<!-- Un solo m\xF3dulo: define los tk-* y pide al loader del kit los is-* que
     este documento usa (~255 kB) en vez del all.min.js del kit (2,1 MB). -->
<script type="module">
  import { IS_TAGS } from "${ve}/all.min.js";
  import { ISWebComponentsLoader as L } from "${q}/loader.min.js";
  await L.load(...IS_TAGS);
<\/script>

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
    <span><strong>${be(i.iticket)}</strong> \xB7 documentaci\xF3n descargada</span>
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
`},K={cdn:ve,async html(i){return jt(i)},async descargar(i){let e=await K.html(i),t=new Blob([e],{type:"text/html;charset=utf-8"}),r=URL.createObjectURL(t),o=document.createElement("a");o.href=r,o.download=`${i.iticket}.html`,document.body.append(o),o.click(),o.remove(),setTimeout(()=>URL.revokeObjectURL(r),3e4)}};var Mt=`
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
`,W=class extends HTMLElement{#t=null;#e;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),k(this.#e,Mt)}connectedCallback(){this.#r()}get ticket(){return this.#t}set ticket(e){this.#t=e,this.toggleAttribute("activo",!!e?.iticket),this.isConnected&&this.#r()}async#i(){let e=this.#t;if(!e)return;let t=fe.enlace({space:e.space,tk:e.iticket,full:!0}),r=navigator;if(r.share)try{await r.share({title:`${e.iticket} \xB7 ${e.titulo??""}`.trim(),url:t});return}catch{}try{await navigator.clipboard.writeText(t),C("Enlace copiado al portapapeles.","success")}catch{C("No se pudo copiar el enlace. C\xF3pialo de la barra de direcciones.","warning")}}async#o(e){let t=this.#t;if(t){e.setAttribute("loading","");try{await K.descargar(t),C(`${t.iticket}.html descargado.`,"success")}catch(r){C(`No se pudo generar el HTML: ${r instanceof Error?r.message:r}`,"danger")}finally{e.removeAttribute("loading")}}}#r(){for(;this.#e.firstChild;)this.#e.removeChild(this.#e.firstChild);this.#t?.iticket&&this.#e.append(n`
      <is-button
        variant="text"
        color="neutral"
        pill
        type="button"
        aria-label="Compartir tiquete"
        title="Compartir"
        onclick=${()=>{this.#i()}}
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
    `)}};m("tk-actions",W);var Rt="jagudeloe-tks";var D="tickets";var ke=null,Lt=()=>(ke??=new Promise((i,e)=>{let t=indexedDB.open(Rt,1);t.onupgradeneeded=()=>{let r=t.result;r.objectStoreNames.contains(D)||r.createObjectStore(D,{keyPath:"clave"})},t.onsuccess=()=>i(t.result),t.onerror=()=>e(t.error??new Error("IndexedDB no disponible"))}),ke),Y=async(i,e)=>{let t=await Lt();return new Promise((r,o)=>{let a=t.transaction(D,i),s=e(a.objectStore(D));s.onsuccess=()=>r(s.result),s.onerror=()=>o(s.error??new Error("Fallo de IndexedDB"))})},B={vigenciaMs:9e5,async leer(i,e=9e5){try{let t=await Y("readonly",r=>r.get(i));return t?{data:t.data,guardadoEn:t.guardadoEn,vencida:Date.now()-t.guardadoEn>e}:null}catch{return null}},async escribir(i,e){let t=Date.now();try{await Y("readwrite",r=>r.put({clave:i,data:e,guardadoEn:t}))}catch{}return t},async limpiar(){try{await Y("readwrite",i=>i.clear())}catch{}}};var we=[["\xD4\xC7\xAA","\u2026"],["\xD4\xC7\xD8","\u201D"],["\xD4\xC7\xF3","\u2022"],["\xD4\xC7\xF4","\u2013"],["\xD4\xC7\xF6","\u2014"],["\xD4\xE9\xBC","\u20AC"],["\u251C\xA1","\xED"],["\u251C\xA3","\xDC"],["\u251C\xAB","\xEE"],["\u251C\xAC","\xEA"],["\u251C\xAE","\xE9"],["\u251C\xBA","\xE7"],["\u251C\xBB","\xEF"],["\u251C\xBC","\xEC"],["\u251C\xBD","\xEB"],["\u251C\xBF","\xE8"],["\u251C\xC2","\xF6"],["\u251C\xDC","\xDA"],["\u251C\xE1","\xE0"],["\u251C\xE6","\xD1"],["\u251C\xE7","\xC7"],["\u251C\xEB","\xC9"],["\u251C\xEC","\xCD"],["\u251C\xED","\xE1"],["\u251C\xF1","\xE4"],["\u251C\xF3","\xE2"],["\u251C\xF4","\xD3"],["\u251C\xFC","\xC1"],["\u251C\u2502","\xF3"],["\u251C\u2510","\xFF"],["\u251C\u2524","\xF4"],["\u251C\u2551","\xFA"],["\u251C\u2557","\xFB"],["\u251C\u255D","\xFC"],["\u251C\u2563","\xF9"],["\u251C\u2592","\xF1"],["\u251C\u2593","\xF2"],["\u252C\xBD","\xAB"],["\u252C\xED","\xA1"],["\u252C\u2510","\xBF"],["\u252C\u2557","\xBB"],["\u252C\u2591","\xB0"]];var qt=/[\u2500-\u257FÔ]|Ã[\x80-\xBF]|Â[\x80-\xBF]/;function Dt(i){if(!i||!qt.test(i))return i;let e=i;for(let[t,r]of we)e.includes(t)&&(e=e.split(t).join(r));return e}function I(i){if(typeof i=="string")return Dt(i);if(Array.isArray(i))return i.map(e=>I(e));if(i&&typeof i=="object"){let e={};for(let[t,r]of Object.entries(i))e[t]=I(r);return e}return i}var Bt="https://jagudeloe-tks.jeffaporta.workers.dev",Nt=12e3,$e=new URLSearchParams(location.search).get("api")??Bt,ye=["patyia","clientesis","isp-svelte"],Z=!1,Pt=i=>{if(Z)return;Z=!0;let e=Math.round((Date.now()-i)/6e4);C(`El servidor de tiquetes no respondi\xF3. Se muestra la copia local de hace ${e} min.`,"warning")},Ot=async i=>{let e=new AbortController,t=setTimeout(()=>e.abort(),Nt);try{let r=await fetch(`${$e}${i}`,{signal:e.signal,headers:{accept:"application/json"}});if(!r.ok){let o=`HTTP ${r.status}`;try{let a=await r.json();a?.error&&(o=`${o}: ${a.error}`)}catch{}throw new Error(o)}return await r.json()}finally{clearTimeout(t)}},xe=async(i,e,t,r)=>{let o=await B.leer(i,r);if(o&&!o.vencida)return{data:I(o.data),origen:"cache",guardadoEn:o.guardadoEn};try{let a=await Ot(e);if(!t(a))throw new Error("Respuesta inesperada del worker");let s=I(a),l=await B.escribir(i,s);return{data:s,origen:"red",guardadoEn:l}}catch(a){let s=a instanceof Error?a.message:String(a);if(o)return Pt(o.guardadoEn),{data:I(o.data),origen:"cache-vencida",guardadoEn:o.guardadoEn,error:s};throw new Error(`No se pudo obtener ${e}: ${s}`)}},X={base:$e,spaces:ye,async listar(i){let e=await xe(`lista:${i}`,`/api/tk/${i}/tickets?limit=200`,t=>!!t?.ok&&Array.isArray(t.rows));return{...e,data:e.data.rows}},async listarTodos(){let e=(await Promise.allSettled(ye.map(a=>X.listar(a)))).filter(a=>a.status==="fulfilled");if(!e.length)throw new Error("Ning\xFAn espacio de tiquetes respondi\xF3");let t=new Map;for(let a of e)for(let s of a.value.data){let l=String(s.iticket??"");!l||t.has(l)||t.set(l,s)}let r=[...t.values()],o=e.some(a=>a.value.origen==="cache-vencida")?"cache-vencida":e.every(a=>a.value.origen==="red")?"red":"cache";return r.sort((a,s)=>String(s.fechasolicitud??"").localeCompare(String(a.fechasolicitud??""))),{data:r,origen:o,guardadoEn:Math.min(...e.map(a=>a.value.guardadoEn))}},async ticket(i,e,t){let r=e.trim(),o=/^TK-/i.test(r)?r:`TK-${r}`,a=await xe(`tk:${o}`,`/api/tk/${i}/tickets/${encodeURIComponent(o)}`,s=>!!s?.ok&&!!s.ticket?.iticket,t?.vigenciaMs);return{...a,data:a.data.ticket}},async refrescar(){await B.limpiar(),Z=!1}};var Q=/\b(jeffrey|agudelo|viviana|restrepo|camilo|jagudeloe|vrestrepo)\b/i,Se="el \xE1rea solicitante",Ht=[[/\bVRESTREPO\b/g,"el perfil solicitante"],[/\bJAGUDELOE\b/g,"el perfil de ingenier\xEDa"]],Ft=/https?:\/\/[^\s)"'<>]+/g;var _t=/\b[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)+\b/g,Ut=i=>{let e=[],t=String(i).replace(Ft,r=>(e.push(r),`\uF8FF${e.length-1}\uF8FF`));for(let[r,o]of Ht)t=t.replace(r,o);return Q.test(t)&&(t=t.replace(_t,r=>Q.test(r)?Se:r),t=t.replace(Q,Se)),t.replace(new RegExp("\uF8FF(\\d+)\uF8FF","g"),(r,o)=>e[Number(o)]??"")},ee=i=>{if(typeof i=="string")return Ut(i);if(Array.isArray(i))return i.map(ee);if(i&&typeof i=="object"){let e={};for(let[t,r]of Object.entries(i))e[t]=ee(r);return e}return i},Te=i=>ee(i);var Vt=`
  :host {
    display: block;
    position: relative;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    container-type: inline-size;
    /* Sin medida de lectura: el documento ocupa todo el ancho del visor. Con un
       tope en unidades ch quedaba una franja muerta a la derecha. */
    --tk-measure: 100%;
    /* Video: tope legible centrado \u2014 100% se com\xEDa la columna (TK view). */
    --tk-video-max: 36rem;
    color: var(--is-text, #e6edf3);
    font-family: var(--is-font-sans, system-ui, -apple-system, "Segoe UI", sans-serif);
    overflow-wrap: break-word;
  }
  .shell {
    position: relative;
    min-width: 0;
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
  tk-metrics {
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
    color: var(--is-text, #e6edf3);
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
    color: var(--is-text, #e6edf3);
    text-align: center;
  }
  .vacio .detalle {
    margin: 0;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.8125rem;
  }
  .fab {
    position: sticky;
    bottom: 1.15rem;
    z-index: 6;
    display: flex;
    justify-content: flex-end;
    box-sizing: border-box;
    width: 100%;
    height: 0;
    margin: 0;
    padding: 0 clamp(0.85rem, 0.4rem + 1.8vw, 2.5rem);
    pointer-events: none;
    transform: translateY(-3.4rem);
  }
  .fab-btn {
    pointer-events: auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.85rem;
    height: 2.85rem;
    margin: 0;
    padding: 0;
    border: 1px solid color-mix(in srgb, var(--is-border, #2a3038) 80%, transparent);
    border-radius: 999px;
    background: color-mix(in srgb, var(--is-bg-elevated, #1a2129) 92%, transparent);
    color: var(--is-text, #e6edf3);
    box-shadow:
      0 10px 28px rgba(0, 0, 0, 0.28),
      inset 0 1px 0 rgba(255, 255, 255, 0.06);
    cursor: pointer;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease;
  }
  .fab-btn:hover {
    transform: translateY(-1px);
    border-color: color-mix(in srgb, var(--is-accent, #1a6eb0) 55%, var(--is-border, #2a3038));
    background: color-mix(in srgb, var(--is-accent, #1a6eb0) 18%, var(--is-bg-elevated, #1a2129));
  }
  .fab-btn:focus-visible {
    outline: 2px solid var(--is-accent, #1a6eb0);
    outline-offset: 2px;
  }
  .fab-btn is-icon {
    font-size: 1.35rem;
  }
  .fab-btn[aria-pressed="true"] {
    color: var(--is-accent, #1a6eb0);
  }
`,Gt=[{lane:"solicitud",rotulo:"Solicitud"},{lane:"evidencias",rotulo:"Evidencias"},{lane:"causa",rotulo:"Causa"},{lane:"solucion",rotulo:"Soluci\xF3n"},{lane:"verificacion",rotulo:"Verificaci\xF3n"},{lane:"otros",rotulo:"Detalle"}],Jt=i=>{let e=new Set;return i.filter(t=>{let r=String(t.kind??"").toLowerCase();if(r!=="image"&&r!=="image-group")return!0;let o=d(t.payload),a=String(o.url??o.src??"").trim().split("?")[0]??"";return a?e.has(a)?!1:(e.add(a),!0):!0})},Kt=new Set(["video","youtube"]),Wt=()=>{try{return new URLSearchParams(location.search).get("mode-tkt")==="free"}catch{return!1}},Yt=i=>{let e=Array.isArray(i.content)&&i.content.length?[...i.content]:[...i.doc?.blocks??[]],t=(i.contexts??[]).flatMap(o=>[...o.content??[]]),r=Wt();return Jt([...e,...t].filter(o=>o&&typeof o=="object").filter(o=>r||!Kt.has(String(o.kind??"").toLowerCase())).sort((o,a)=>(o.sortkey??0)-(a.sortkey??0)))},Zt=(i,e)=>{let t=d(i.payload),r=String(t.docLane??t.section??t.lane??"").trim().toLowerCase();if(r==="solicitud"||r==="evidencias"||r==="causa"||r==="solucion"||r==="verificacion"||r==="otros")return r;let o=String(t.title??"").toLowerCase().normalize("NFD").replace(/\p{M}/gu,"");if(/^solicitud|^objetivo|requerimiento insoft|^requerimiento\b/.test(o))return"solicitud";if(/^evidencia|informacion del tiquete|pantallazo|captura/.test(o))return"evidencias";if(/hipotesis|causa identificada|causa del problema|^causa\b|antecedente|analisis realizado|diagnostico|raiz del problema/.test(o))return"causa";if(/verificacion\b|validacion\b|investigacion y pruebas|como probar|pruebas realizadas/.test(o))return"verificacion";if(/solucion aplicada|solucion entregada|^solucion\b|cambios en base de datos|resultado\b|conclusion|catalogo por tipo|resumen de tiempos/.test(o))return"solucion";let a=String(i.kind??"").toLowerCase();return a==="html"||a==="image"||a==="image-group"?e==="otros"?"evidencias":e:a==="badge"||a==="badges"?e==="otros"?"solicitud":e:a==="code"||a==="sql"||a==="cambio-bd"||a==="file-tree"?e==="otros"?"solucion":e:a==="steps"||a==="stepper"?e==="otros"?"verificacion":e:a==="table"&&e==="otros"?"evidencias":a==="markdown"||a==="md"||a==="text"?o?"otros":e:"otros"},Xt=i=>{let e="solicitud";return i.map(t=>{let r=Zt(t,e);return e=r,{b:t,lane:r}})},Qt=i=>{let e=String(i.kind??"").toLowerCase();return e==="image"||e==="image-group"},Ce=i=>{let e=d(i.payload),t=String(e.caption??"").trim()||String(e.title??"").trim(),r=Array.isArray(i.blocks)?i.blocks:[];return String(i.kind??"").toLowerCase()==="image-group"&&r.length?i:{...i,kind:"image",payload:{...e,caption:t,title:""},blocks:void 0}},ei=i=>{let e=[],t=[],r=()=>{if(t.length){if(t.length===1)e.push(t[0]);else{let o=t.flatMap(s=>String(s.kind??"").toLowerCase()==="image-group"&&Array.isArray(s.blocks)&&s.blocks.length?s.blocks.map(Ce):[Ce(s)]),a=d(t[0].payload).docLane;e.push({kind:"image-group",sortkey:t[0].sortkey,payload:a?{docLane:a}:{},blocks:o})}t=[]}};for(let o of i)Qt(o)?t.push(o):(r(),e.push(o));return r(),e},ti=i=>{let e=[...i.rootCommits??[]];return e.length?e:(i.contexts??[]).flatMap(t=>[...t.commits??[]])},te=i=>String(i||"").trim().toLowerCase()==="metrics"?"metrics":"doc",ii=24,ri=i=>{let e=String(i||"").trim().toLowerCase();return e==="clientesis"||e==="isp-svelte"?e:"patyia"},ie=class extends HTMLElement{static get observedAttributes(){return["embebido","modo","tk","space"]}#t=null;#e="doc";#i;#o="inicial";#r="";#n=0;constructor(){super(),this.#i=this.attachShadow({mode:"open"}),k(this.#i,Vt)}connectedCallback(){this.#e=te(this.getAttribute("modo")),this.getAttribute("tk")&&!this.#t?this.cargar():this.#a()}attributeChangedCallback(e,t,r){if(e==="modo"&&(this.#e=te(r)),!!this.isConnected){if((e==="tk"||e==="space")&&t!==r&&this.getAttribute("tk")){this.cargar();return}this.#a()}}async cargar(){let e=String(this.getAttribute("tk")||"").trim();if(!e)return;let t=ri(this.getAttribute("space")),r=Number(this.getAttribute("cache-horas"))||ii,o=++this.#n;this.#o="cargando",this.#a();let a=(l,c)=>{o===this.#n&&(this.#t=this.hasAttribute("sanear")?Te(l):l,this.#o="listo",this.#a(),this.dispatchEvent(new CustomEvent("tk-datos",{bubbles:!0,composed:!0,detail:{origen:c,ticket:this.#t}})))};try{let l=await X.ticket(t,e,{vigenciaMs:r*60*60*1e3});a(l.data,l.origen);return}catch(l){this.#r=l instanceof Error?l.message:String(l)}let s=this.getAttribute("fallback");if(s)try{let l=await fetch(s,{headers:{accept:"application/json"}});if(!l.ok)throw new Error(`HTTP ${l.status}`);let c=d(await l.json());a(c.ticket?c.ticket:c,"archivo local");return}catch(l){this.#r+=` \xB7 fallback: ${l instanceof Error?l.message:String(l)}`}o===this.#n&&(this.#o="error",this.#a(),this.dispatchEvent(new CustomEvent("tk-error",{bubbles:!0,composed:!0,detail:{error:this.#r}})))}get ticket(){return this.#t}set ticket(e){this.#t=e,this.isConnected&&this.#a()}set json(e){let t=d(e);this.ticket=t.ticket?t.ticket:t}get embebido(){return this.hasAttribute("embebido")}set embebido(e){this.toggleAttribute("embebido",!!e)}get modo(){return this.#e}set modo(e){let t=te(String(e));this.#e!==t&&(this.#e=t,this.setAttribute("modo",t),this.dispatchEvent(new CustomEvent("tk-modo",{bubbles:!0,composed:!0,detail:{modo:t}})),this.isConnected&&this.#a())}#s=()=>{this.modo=this.#e==="doc"?"metrics":"doc"};#l(e){let t=Xt(Yt(e)),r=Object.assign(document.createElement("tk-ticket-head"),{ticket:e}),o=ti(e),a=Gt.map(({lane:l,rotulo:c})=>{let h=ei(t.filter(g=>g.lane===l).map(g=>g.b));return h.length?n`
        <section aria-label="${c}" data-lane="${l}">
          <h2 class="rotulo">${c}</h2>
          ${h.map(g=>Object.assign(document.createElement("tk-block"),{bloque:g}))}
        </section>
      `:null}).filter(Boolean),s=o.length?n`
        <section aria-label="Commits">
          <h2 class="rotulo">Commits</h2>
          ${Object.assign(document.createElement("tk-commits"),{commits:o})}
        </section>
      `:null;return n`
      <article class="documento" data-modo="doc">
        <header class="encabezado">${r}</header>
        ${a.length>0?a:n`
          <is-callout color="neutral" icon="mdi:text-box-remove-outline">
            Este tiquete todavía no tiene documentación publicada.
          </is-callout>
        `}
        ${s}
      </article>
    `}#c(e){return n`
      <div class="documento" data-modo="metrics">
        ${Object.assign(document.createElement("tk-metrics"),{ticket:e})}
      </div>
    `}#a(){for(;this.#i.firstChild;)this.#i.removeChild(this.#i.firstChild);let e=this.#t;if(!e?.iticket){if(this.#o==="cargando"){this.#i.append(n`
          <div class="vacio">
            <is-icon icon="mdi:progress-clock" style="font-size:2rem" aria-hidden="true"></is-icon>
            <p>Cargando ${this.getAttribute("tk")??"el tiquete"}…</p>
          </div>
        `);return}if(this.#o==="error"){let a=location.protocol==="file:";this.#i.append(n`
          <div class="vacio">
            <is-icon icon="mdi:cloud-off-outline" style="font-size:2rem" aria-hidden="true"></is-icon>
            <p>No se pudo obtener ${this.getAttribute("tk")??"el tiquete"}.</p>
            <p class="detalle">${this.#r}</p>
            ${a?n`<p class="detalle">
              La página está abierta como archivo local: el respaldo en disco necesita servirse por HTTP.
            </p>`:null}
          </div>
        `);return}this.#i.append(n`
        <div class="vacio">
          <is-icon icon="mdi:file-document-outline" style="font-size:2rem" aria-hidden="true"></is-icon>
          <p>Selecciona un tiquete para ver su documentación.</p>
        </div>
      `);return}let t=this.#e==="metrics",r=t?"mdi:file-document-outline":"mdi:chart-timeline-variant",o=t?"Ver documentaci\xF3n":"Ver m\xE9tricas InSoft";this.#i.append(n`
      <div class="shell">
        ${t?this.#c(e):this.#l(e)}
        <div class="fab">
          <button
            type="button"
            class="fab-btn"
            aria-label="${o}"
            title="${o}"
            aria-pressed="${t?"true":"false"}"
            onclick=${this.#s}
          >
            <is-icon icon="${r}" aria-hidden="true"></is-icon>
          </button>
        </div>
      </div>
    `)}};m("tk-view",ie);var oi=["is-button","is-callout","is-chart","is-copy-button","is-data-grid","is-details","is-icon","is-lightbox","is-sequence-diagram","is-stepper","is-tag","is-theme-toggle","is-timeline","is-tooltip"],ai=["is-stepper-step"];export{oi as IS_TAGS,ai as IS_TAGS_CUBIERTOS};
