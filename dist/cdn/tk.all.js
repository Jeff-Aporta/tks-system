var K=new Map,k=(i,e)=>{let t=K.get(e);t||(t=new CSSStyleSheet,t.replaceSync(e),K.set(e,t)),i.adoptedStyleSheets=[...i.adoptedStyleSheets,t]},u=`
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
`;var M=Symbol("tk-html-crudo"),v=i=>({[M]:String(i??"")}),G=i=>typeof i=="object"&&i!==null&&M in i,a=(i,...e)=>{let t=[],r=[],o="";for(let l=0;l<i.length;l++){if(o+=i[l],l>=e.length)continue;let c=e[l];if(c==null||c===!1||c===!0)continue;if(typeof c=="function"&&/\s+on([a-zA-Z][\w-]*)=\s*$/.test(o)){let f=o.match(/\s+on([a-zA-Z][\w-]*)=\s*$/);o=o.slice(0,o.length-f[0].length),o+=` data-tk-ev="${r.length}"`,r.push({evento:f[1].toLowerCase(),fn:c});continue}if(G(c)){o+=c[M];continue}let h=Array.isArray(c)?c:[c];for(let f of h)f==null||f===!1||f===!0||(f instanceof Node?(o+=`<template data-tk-nodo="${t.length}"></template>`,t.push(f)):G(f)?o+=f[M]:o+=S(f))}let n=document.createElement("template");n.innerHTML=o;let s=n.content;for(let l of[...s.querySelectorAll("template[data-tk-nodo]")]){let c=Number(l.dataset.tkNodo);l.replaceWith(t[c]??document.createComment("tk:nodo"))}for(let l of[...s.querySelectorAll("[data-tk-ev]")]){let c=Number(l.dataset.tkEv),g=r[c];g&&l.addEventListener(g.evento,g.fn),l.removeAttribute("data-tk-ev")}return s},T=i=>{let e=document.createElement("script");return e.type="application/json",e.textContent=JSON.stringify(i),e},S=i=>String(i??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"),d=i=>i&&typeof i=="object"&&!Array.isArray(i)?i:{},C=i=>{let e=[],t=String(i??"").replace(/`([^`]+)`/g,(r,o)=>(e.push(o),` ${e.length-1} `));return t=S(t).replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g,(r,o,n)=>`<a href="${S(n)}" target="_blank" rel="noopener noreferrer">${o}</a>`).replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/(^|[\s(])\*([^*\n]+)\*/g,"$1<em>$2</em>").replace(/~~([^~]+)~~/g,"<del>$1</del>"),t.replace(/ (\d+) /g,(r,o)=>`<code>${S(e[Number(o)])}</code>`)},x=i=>{let e=String(i??"").replace(/\r\n?/g,`
`).split(`
`),t=[],r=[],o=0,n=()=>{r.length&&t.push(`<p>${C(r.join(" "))}</p>`),r.length=0};for(;o<e.length;){let s=e[o],l=s.match(/^\s*```(\w+)?\s*$/);if(l){n();let h=[];for(o++;o<e.length&&!/^\s*```\s*$/.test(e[o]);)h.push(e[o++]);o++,t.push(`<pre data-lang="${S(l[1]??"")}"><code>${S(h.join(`
`))}</code></pre>`);continue}if(/^\s*\|/.test(s)&&/^\s*\|[\s:|-]+\|?\s*$/.test(e[o+1]??"")){n();let h=w=>w.trim().replace(/^\||\|$/g,"").split("|").map(D=>C(D.trim())),f=h(s);o+=2;let b=[];for(;o<e.length&&/^\s*\|/.test(e[o]);)b.push(h(e[o++]));t.push(`<table><thead><tr>${f.map(w=>`<th>${w}</th>`).join("")}</tr></thead><tbody>${b.map(w=>`<tr>${w.map(D=>`<td>${D}</td>`).join("")}</tr>`).join("")}</tbody></table>`);continue}let c=s.match(/^(#{1,6})\s+(.*)$/);if(c){n();let h=Math.min(c[1].length+2,6);t.push(`<h${h}>${C(c[2])}</h${h}>`),o++;continue}if(/^\s*(---|___|\*\*\*)\s*$/.test(s)){n(),t.push("<hr>"),o++;continue}if(/^\s*>\s?/.test(s)){n();let h=[];for(;o<e.length&&/^\s*>\s?/.test(e[o]);)h.push(e[o++].replace(/^\s*>\s?/,""));t.push(`<blockquote>${x(h.join(`
`))}</blockquote>`);continue}let g=s.match(/^\s*([-*+]|\d+[.)])\s+/);if(g){n();let h=/\d/.test(g[1]),f=[];for(;o<e.length;){let w=e[o].match(/^\s*([-*+]|\d+[.)])\s+(.*)$/);if(!w){if(f.length&&/^\s{2,}\S/.test(e[o])){f[f.length-1]+=` ${e[o].trim()}`,o++;continue}break}f.push(w[2]),o++}let b=h?"ol":"ul";t.push(`<${b}>${f.map(w=>`<li>${C(w)}</li>`).join("")}</${b}>`);continue}if(!s.trim()){n(),o++;continue}r.push(s.trim()),o++}return n(),t.join(`
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
`,me=new Intl.DateTimeFormat("es-CO",{day:"2-digit",month:"short",year:"numeric"}),ue=new Intl.DateTimeFormat("es-CO",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}),$=(i,e=!1)=>{if(!i)return"";let t=String(i).trim();(t.startsWith('"')&&t.endsWith('"')||t.startsWith("'")&&t.endsWith("'"))&&(t=t.slice(1,-1).trim());let r=new Date(t);return Number.isNaN(r.getTime())?t:(e?ue:me).format(r)},I=i=>{let e=Number(i);if(!Number.isFinite(e)||e<=0)return"";let t=Math.floor(e/60),r=Math.round(e%60);return t?r?`${t} h ${r} min`:`${t} h`:`${r} min`},pe={primary:"brand",brand:"brand",info:"info",success:"success",ok:"success",warning:"warning",warn:"warning",danger:"danger",error:"danger",violet:"brand",neutral:"neutral",default:"neutral"},Z=i=>pe[String(i??"").toLowerCase()]??"neutral",X=i=>{let e=String(i??"").toLowerCase();return e.includes("cerrad")||e.includes("solucion")?"success":e.includes("proceso")||e.includes("curso")?"warning":e.includes("abiert")||e.includes("nuevo")?"info":"neutral"},A={encode(i){let e=new TextEncoder().encode(i),t="";for(let r of e)t+=String.fromCharCode(r);return btoa(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")},decode(i){let e=String(i).replace(/-/g,"+").replace(/_/g,"/");for(;e.length%4;)e+="=";let t=atob(e),r=new Uint8Array(t.length);for(let o=0;o<t.length;o++)r[o]=t.charCodeAt(o);return new TextDecoder().decode(r)}},m=(i,e)=>{customElements.get(i)||customElements.define(i,e)},p=(i,e)=>class extends HTMLElement{#t={};#e;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),k(this.#e,i)}connectedCallback(){this.#i()}get payload(){return this.#t}set payload(t){this.#t=d(t),this.isConnected&&this.#i()}#i(){for(;this.#e.firstChild;)this.#e.removeChild(this.#e.firstChild);e(this.#e,this.#t,this)}};var he=`
  ${u}
  ${y}
`;m("tk-markdown",p(he,(i,e)=>{let t=String(e.text??e.body??e.content??"").trim();!t&&!e.title||i.append(a`
    ${e.title&&a`<h2 class="titulo">${e.title}</h2>`}
    ${t&&a`<div class="prosa">${v(x(t))}</div>`}
  `)}));var ge=`
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
`,fe=["script","style","iframe","object","embed","form","link","meta","base"],be=i=>i.replace(/(?:^|;)\s*width\s*:\s*\d{3,4}px\b/gi,";width:100%").replace(/(?:^|;)\s*max-width\s*:\s*\d{3,4}px\b/gi,";max-width:100%").replace(/(?:^|;)\s*min-width\s*:\s*\d{3,4}px\b/gi,";min-width:0").replace(/^;+/,"").trim(),ve=i=>i.replace(/(?:^|;)\s*color\s*:\s*(?:#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})\b|rgba?\([^)]*\)|hsla?\([^)]*\)|gray|grey|silver|currentcolor)\s*/gi,";").replace(/;{2,}/g,";").replace(/^;+|;+$/g,"").trim(),ke=i=>{let e=new DOMParser().parseFromString(String(i??""),"text/html");e.body.querySelectorAll(fe.join(",")).forEach(t=>t.remove());for(let t of e.body.querySelectorAll("*")){for(let s of[...t.attributes]){let l=s.name.toLowerCase(),c=s.value.trim().toLowerCase();(l.startsWith("on")||(l==="href"||l==="src")&&c.startsWith("javascript:"))&&t.removeAttribute(s.name)}t.tagName==="A"&&(t.setAttribute("target","_blank"),t.setAttribute("rel","noopener noreferrer"));let r=t.getAttribute("width");r&&/^\d{3,4}$/.test(r)&&Number(r)>=400&&(t.removeAttribute("width"),t.setAttribute("data-tk-fluid",""));let o=t.getAttribute("style");if(!o)continue;let n=o;/color\s*:/i.test(n)&&(n=ve(n)),/\d{3,4}px/.test(n)&&/(?:^|;)\s*(?:max-)?width\s*:/i.test(n)&&(n=be(n)),n?n!==o&&t.setAttribute("style",n):t.removeAttribute("style")}return e.body.innerHTML};m("tk-html",p(ge,(i,e)=>{let t=String(e.html??"").trim();!t&&!e.title||i.append(a`
    ${e.title&&a`<h2 class="titulo">${e.title}</h2>`}
    ${t&&a`<div class="prosa">${v(ke(t))}</div>`}
  `)}));var we=`
  ${u}
  .fila {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45em;
    align-items: center;
    font-size: 0.875rem;
  }
`;m("tk-badges",p(we,(i,e)=>{let r=(Array.isArray(e.items)?e.items:Array.isArray(e.badges)?e.badges:e.label?[e]:[]).map(d).map(o=>({texto:String(o.label??o.text??"").trim(),color:Z(o.tone??o.color)})).filter(o=>o.texto);r.length&&i.append(a`
    ${e.title&&a`<h2 class="titulo">${e.title}</h2>`}
    <div class="fila">
      ${r.map(o=>a`
        <is-tag color="${o.color}" variant="filled-outlined" pill>${o.texto}</is-tag>
      `)}
    </div>
  `)}));var ye=`
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
`,N=i=>{if(i==null)return"";if(typeof i=="object"){let e=d(i);return C(e.text??e.label??e.value??"")}return C(i)};m("tk-table",p(ye,(i,e)=>{let t=(Array.isArray(e.rows)?e.rows:[]).map(l=>Array.isArray(l)?l:[l]);if(!t.length)return;let r=(Array.isArray(e.headers)?e.headers:[]).map(String);if(t.every(l=>l.length===2)){i.append(a`
      ${e.title&&a`<h2 class="titulo">${e.title}</h2>`}
      <dl class="ficha">
        ${t.map(l=>a`
          <dt>${v(N(l[0]))}</dt>
          <dd>${v(N(l[1]))}</dd>
        `)}
      </dl>
      ${e.caption&&a`<p class="pie">${e.caption}</p>`}
    `);return}let o=Math.max(...t.map(l=>l.length),r.length),n=Array.from({length:o},(l,c)=>({field:`c${c}`,headerName:r[c]??`Columna ${c+1}`,flex:1,sortable:!0,renderCell:({value:g})=>({html:N(g)})})),s=Object.assign(document.createElement("is-data-grid"),{columns:n,rows:t.map((l,c)=>{let g={id:c};return l.forEach((h,f)=>{g[`c${f}`]=h}),g})});s.setAttribute("auto-height",""),s.setAttribute("hide-footer",""),s.setAttribute("density","compact"),s.setAttribute("disable-column-menu",""),s.setAttribute("toolbar-tools","false"),i.append(a`
    ${e.title&&a`<h2 class="titulo">${e.title}</h2>`}
    ${s}
    ${e.caption&&a`<p class="pie">${e.caption}</p>`}
  `)}));var xe=`
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
`,$e=`
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
`,Q=i=>{let e=String(i.url??i.src??"").trim();return e?{url:e,alt:String(i.alt??i.caption??i.title??"Evidencia del tiquete"),caption:String(i.caption??"")}:null},R=class extends HTMLElement{#t;#e=[];#i=0;#o=e=>{this.hasAttribute("open")&&(e.key==="Escape"?this.cerrar():e.key==="ArrowRight"?this.#r(1):e.key==="ArrowLeft"&&this.#r(-1))};constructor(){super(),this.#t=this.attachShadow({mode:"open"});let e=new CSSStyleSheet;e.replaceSync($e),this.#t.adoptedStyleSheets=[e]}connectedCallback(){document.addEventListener("keydown",this.#o),this.addEventListener("click",e=>{e.target===this&&this.cerrar()})}disconnectedCallback(){document.removeEventListener("keydown",this.#o)}abrir(e,t=0){this.#e=e,this.#i=Math.max(0,Math.min(t,e.length-1)),this.setAttribute("open",""),this.#a(),queueMicrotask(()=>this.#t.querySelector(".cerrar")?.focus())}cerrar(){this.removeAttribute("open")}#r(e){this.#e.length<2||(this.#i=(this.#i+e+this.#e.length)%this.#e.length,this.#a())}#a(){let e=this.#e[this.#i];if(!e)return;let t=this.#e.length>1;for(;this.#t.firstChild;)this.#t.removeChild(this.#t.firstChild);this.#t.append(a`
      <div class="marco" role="dialog" aria-modal="true" aria-label="${e.alt}">
        ${t?a`<span class="contador">${this.#i+1} / ${this.#e.length}</span>`:null}
        <button class="cerrar" type="button" aria-label="Cerrar" onclick=${()=>this.cerrar()}>
          <is-icon icon="mdi:close" aria-hidden="true"></is-icon>
        </button>
        ${t?a`
          <button class="nav prev" type="button" aria-label="Anterior" onclick=${()=>this.#r(-1)}>
            <is-icon icon="mdi:chevron-left" aria-hidden="true"></is-icon>
          </button>
          <button class="nav next" type="button" aria-label="Siguiente" onclick=${()=>this.#r(1)}>
            <is-icon icon="mdi:chevron-right" aria-hidden="true"></is-icon>
          </button>
        `:null}
        <img class="foto" src="${e.url}" alt="${e.alt}">
        ${e.caption||e.alt?a`<p class="leyenda">${e.caption||e.alt}</p>`:null}
      </div>
    `)}};customElements.get("tk-lightbox")||customElements.define("tk-lightbox",R);var Se=()=>{let i=document.querySelector("tk-lightbox");return i||(i=document.createElement("tk-lightbox"),document.body.append(i)),i},Ce=(i,e,t)=>{let r=n=>{let s=n.target;s.removeAttribute("data-cargando"),s.naturalWidth&&s.naturalHeight&&(s.style.aspectRatio=`${s.naturalWidth} / ${s.naturalHeight}`)},o=n=>{let s=n.target;(s.closest(".lienzo")??s).replaceWith(a`
      <p class="rota">La evidencia ya no está disponible.</p>
    `)};return a`
    <figure>
      <button
        class="lienzo"
        type="button"
        aria-label="Ampliar: ${i.alt}"
        onclick=${()=>Se().abrir(e,t)}
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
      ${i.caption&&a`<figcaption>${i.caption}</figcaption>`}
    </figure>
  `};m("tk-image",p(xe,(i,e,t)=>{let r=t.bloques??[],o=(r.length?r.map(n=>Q(d(n.payload))):[Q(e)]).filter(n=>!!n);o.length&&i.append(a`
    ${e.title&&a`<h2 class="titulo">${e.title}</h2>`}
    <div class="${o.length>1?"rejilla":""}">
      ${o.map((n,s)=>Ce(n,o,s))}
    </div>
  `)}));var Te=`
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
`,Ae=new RegExp("\\b("+["select","from","where","insert","into","values","update","set","delete","create","alter","drop","table","index","view","join","left","right","inner","outer","on","group","order","by","having","limit","offset","and","or","not","null","as","distinct","case","when","then","else","end","begin","commit","rollback","union","exists","between","like","in","const","let","var","function","return","if","for","while","await","async","class","extends","new","this","import","export","default","interface","type","try","catch","throw","typeof","true","false"].join("|")+")\\b","gi"),ze=i=>{let e=[],t=o=>(e.push(o),`\0${e.length-1}\0`),r=S(i);return r=r.replace(/(--[^\n]*|\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*)/g,o=>t(`<span class="com">${o}</span>`)),r=r.replace(/('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`)/g,o=>t(`<span class="str">${o}</span>`)),r=r.replace(/\b\d+(\.\d+)?\b/g,o=>t(`<span class="num">${o}</span>`)),r=r.replace(Ae,o=>t(`<span class="key">${o}</span>`)),r.replace(/ (\d+) /g,(o,n)=>e[Number(n)])};m("tk-code",p(Te,(i,e)=>{let t=String(e.code??e.sql??"").replace(/\s+$/,"");if(!t)return;let r=String(e.language??(e.sql?"sql":"")).trim();i.append(a`
    ${e.title&&a`<h2 class="titulo">${e.title}</h2>`}
    <div class="marco">
      <div class="barra">
        <span class="lenguaje">${r||"c\xF3digo"}</span>
        <is-copy-button value="${t}" aria-label="Copiar código"></is-copy-button>
      </div>
      <pre><code>${v(ze(t))}</code></pre>
    </div>
    ${e.caption&&a`<p class="pie">${e.caption}</p>`}
  `)}));var Ee=`
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
`;m("tk-url",p(Ee,(i,e)=>{let t=String(e.href??e.url??"").trim();/^https?:\/\//i.test(t)&&i.append(a`
    ${e.title&&a`<h2 class="titulo">${e.title}</h2>`}
    <a href="${t}" target="_blank" rel="noopener noreferrer">
      <is-icon icon="mdi:open-in-new" aria-hidden="true"></is-icon>
      <span class="etiqueta">${String(e.label??t)}</span>
    </a>
    ${e.caption&&a`<p class="pie">${e.caption}</p>`}
  `)}));var je="https://cdn.jsdelivr.net/npm/lite-youtube-embed@0.3.3/src/lite-yt-embed.js",Me=`
  ${u}

  /* Copia de lite-yt-embed.css (0.3.3), con el marco y el tope de ancho
     del visor: a pantalla completa el video se com\xEDa la columna. */
  lite-youtube {
    position: relative;
    display: block;
    contain: content;
    box-sizing: border-box;
    width: 100%;
    max-width: min(100%, var(--tk-video-max, 45rem));
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
`,Ie=/^[a-zA-Z0-9_-]{6,20}$/,ee=!1,qe=()=>{if(ee||customElements.get("lite-youtube"))return;ee=!0;let i=document.createElement("script");i.src=je,i.async=!0,document.head.append(i)};m("tk-video",p(Me,(i,e)=>{let t=String(e.youtubeid??e.youtubeId??"").trim();if(!Ie.test(t))return;qe();let r=`Reproducir: ${String(e.title??"video")}`;i.append(a`
    ${e.title&&a`<h2 class="titulo">${e.title}</h2>`}
    <lite-youtube videoid="${t}" params="rel=0&amp;modestbranding=1" playlabel="${r}">
      <a
        class="lty-playbtn"
        href="https://www.youtube.com/watch?v=${t}"
        target="_blank"
        rel="noopener noreferrer"
      ><span class="lyt-visually-hidden">${r}</span></a>
    </lite-youtube>
    ${e.caption&&a`<p class="pie">${e.caption}</p>`}
  `)}));var Le=`
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
`,te=(i,e)=>e?a`<dl class="campo"><dt>${i}</dt><dd>${e}</dd></dl>`:null;m("tk-cambio-bd",p(Le,(i,e)=>{let t=String(e.sql??"").trim(),r=String(e.tabla??"").trim(),o=String(e.registro??"").trim(),n=String(e.intencion??"").trim();if(!t&&!r&&!n)return;let s=t?Object.assign(document.createElement("tk-code"),{payload:{code:t,language:"sql"}}):null;i.append(a`
    <h2 class="titulo">${String(e.title??"Cambio en base de datos")}</h2>
    <div class="marco">
      ${(r||o)&&a`
        <div class="cabecera">
          ${te("Tabla",r)}
          ${te("Registro",o)}
        </div>
      `}
      ${n&&a`<div class="intencion prosa">${v(x(n))}</div>`}
      ${s}
    </div>
  `)}));var De=`
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
`,Ne=(i,e)=>{let t=d(i),r=Array.isArray(t.items)?t.items:Array.isArray(t.steps)?t.steps:t.text?[t.text]:[];return{title:String(t.title??t.label??`Fase ${e+1}`),items:r}},Re=i=>i==null?null:typeof i=="string"?a`<div class="hallazgo prosa">${v(x(i))}</div>`:Object.assign(document.createElement("tk-block"),{bloque:i});m("tk-steps",p(De,(i,e)=>{let r=(Array.isArray(e.phases)?e.phases:Array.isArray(e.steps)?e.steps:[]).map(Ne).filter(o=>o.items.length||o.title);r.length&&i.append(a`
    ${e.title&&a`<h2 class="titulo">${e.title}</h2>`}
    <ol>
      ${r.map(o=>a`
        <li class="fase">
          <h3>${o.title}</h3>
          <div class="hallazgos">${o.items.map(Re)}</div>
        </li>
      `)}
    </ol>
  `)}));var He=`
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
`,E=(i,e,t="")=>({nombre:i,path:e,hijos:new Map,pista:t||void 0}),Be=(i,e)=>{let t=E("","");for(let r of i){let o=String(r).split(/[/\\]/).filter(Boolean),n=t,s=[];o.forEach((l,c)=>{s.push(l);let g=s.join("/");if(n.hijos.has(l)){if(c===o.length-1){let h=n.hijos.get(l),f=String(h.pista??e[g]??e[r]??e[l]??"");f&&!h.pista&&n.hijos.set(l,E(l,g,f))}}else{let f=c===o.length-1?String(e[g]??e[r]??e[l]??e[o.slice(0,c+1).join("/")]??""):"";n.hijos.set(l,E(l,g,f))}n=n.hijos.get(l)})}return t},ie=(i,e,t)=>{let r=d(i),o=String(r.name??r.nombre??"").trim();if(!o)return null;let n=String(r.path??(t?`${t}/${o}`:o)),s=Array.isArray(r.children)?r.children:Array.isArray(r.hijos)?r.hijos:[],l=E(o,n,String(r.hint??r.pista??e[n]??e[o]??""));for(let c of s){let g=ie(c,e,n);g&&l.hijos.set(g.nombre,g)}return l},Fe=(i,e)=>{let t=E("","");for(let r of i){let o=ie(r,e,"");o&&t.hijos.set(o.nombre,o)}return t},re=0,oe=i=>{let e=i.hijos.size===0,t=e?"mdi:file-document-outline":"mdi:folder-outline",r=i.pista?`ft-tip-${++re}`:"";return a`
    <li class="nodo ${e?"hoja":"carpeta"}">
      <div class="fila">
        <is-icon class="ico" icon="${t}" aria-hidden="true"></is-icon>
        ${i.pista?a`
            <span class="nombre" id="${r}" tabindex="0">${i.nombre}</span>
            <is-tooltip for="${r}" placement="top">${i.pista}</is-tooltip>
          `:a`<span class="nombre">${i.nombre}</span>`}
      </div>
      ${e?null:a`
        <ul>
          ${[...i.hijos.values()].map(oe)}
        </ul>
      `}
    </li>
  `};m("tk-file-tree",p(He,(i,e)=>{re=0;let t=d(e.hints??e.notes),r=d(e.fileTree??{}),o=Array.isArray(e.tree)?e.tree:Array.isArray(r.tree)?r.tree:[],n=(Array.isArray(e.paths)?e.paths:Array.isArray(e.files)?e.files:Array.isArray(r.paths)?r.paths:[]).map(String).filter(Boolean);if(!o.length&&!n.length)return;let s=o.length?Fe(o,{...d(r.hints),...t}):Be(n,{...d(r.hints),...t}),l=String(e.rootLabel??e.root??r.rootLabel??"").trim(),c=[...s.hijos.values()].map(oe);i.append(a`
    <h2 class="titulo">${String(e.title??r.title??"Archivos intervenidos")}</h2>
    <ul class="arbol" role="tree" aria-label="Archivos intervenidos">
      ${l?a`
        <li class="nodo carpeta raiz" role="treeitem">
          <div class="fila">
            <is-icon class="ico" icon="mdi:source-repository" aria-hidden="true"></is-icon>
            <span class="nombre">${l}</span>
          </div>
          <ul role="group">${c}</ul>
        </li>
      `:c}
    </ul>
  `)}));var Pe=`
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
`,Oe=i=>i.map((e,t)=>{let r=d(e);return{id:String(r.key??r.id??`h${t}`),label:String(r.label??r.name??`Hito ${t+1}`),date:String(r.iso??r.date??""),hora:String(r.hora??""),desc:String(r.nota??r.description??"")}}).filter(e=>e.label);m("tk-timeline",p(Pe,(i,e)=>{let t=d(e.timeline??e),r=Oe(Array.isArray(t.milestones)?t.milestones:Array.isArray(t.events)?t.events:[]),o=(Array.isArray(t.resumen)?t.resumen:[]).map(d);if(!r.length&&!o.length)return;let n=String(t.title??e.title??""),s=r.filter(c=>c.date&&!Number.isNaN(new Date(c.date).getTime())),l=s.length>=2?a`
      <is-timeline color="inline">
        ${T({timeline:{title:n||void 0,orientation:"vertical",events:s.map(c=>({id:c.id,label:c.label,date:c.date,desc:c.desc}))}})}
      </is-timeline>
    `:a`
      <ul class="hitos">
        ${r.map(c=>a`
          <li class="hito">
            <span class="hora">${c.hora||$(c.date)}</span>
            <span class="etiqueta">${c.label}</span>
            ${c.desc&&a`<span class="nota">${c.desc}</span>`}
          </li>
        `)}
      </ul>
    `;i.append(a`
    ${n&&a`<h2 class="titulo">${n}</h2>`}
    ${o.length>0&&a`
      <div class="resumen">
        ${o.map(c=>a`
          <div class="cifra" ${v(c.highlight===!0?"data-hl":"")}>
            <span class="cifra-rotulo">${String(c.label??"")}</span>
            <span class="cifra-valor">${String(c.value??"\u2014")}</span>
          </div>
        `)}
      </div>
    `}
    ${r.length>0&&l}
  `)}));var _e=`
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
`;m("tk-sequence",p(_e,(i,e)=>{let t=d(e.sequence),r=Array.isArray(t.messages)?t.messages:[],o=String(e.preset??t.preset??"");if(!r.length&&!o)return;let n=String(e.subtitle??"");i.append(a`
    ${e.title&&a`<h2 class="titulo">${e.title}</h2>`}
    ${n&&a`<p class="subtitulo">${n}</p>`}
    <div class="marco">
      <is-sequence-diagram color="inline">
        ${T(o&&!r.length?{preset:o}:{sequence:t})}
      </is-sequence-diagram>
    </div>
    ${e.caption&&a`<p class="pie">${e.caption}</p>`}
  `)}));var Ue=`
  ${u}
  ${y}
  is-stepper { display: block; }
  .desc {
    color: var(--is-text, #e6edf3);
    font-size: 0.875em;
  }
`;m("tk-stepper",p(Ue,(i,e)=>{let t=d(e.stepper??e),r=(Array.isArray(t.steps)?t.steps:[]).map(d);r.length&&i.append(a`
    ${e.title&&a`<h2 class="titulo">${e.title}</h2>`}
    <!-- active = total: el procedimiento está documentado, ningún paso queda pendiente. -->
    <is-stepper orientation="vertical" active="${r.length}">
      ${r.map(o=>{let n=String(o.description??o.desc??"").trim();return a`
          <is-stepper-step
            label="${String(o.label??o.title??"")}"
            icon="${String(o.icon??"mdi:checkbox-marked-circle-outline")}"
          >
            ${n&&a`<div slot="description" class="desc prosa">${v(x(n))}</div>`}
          </is-stepper-step>
        `})}
    </is-stepper>
    ${e.caption&&a`<p class="pie">${e.caption}</p>`}
  `)}));var We=`
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
`;m("tk-chart",p(We,(i,e)=>{let t=d(e.chart??e),r=d(t.data);if(!(Array.isArray(r.datasets)?r.datasets:[]).length)return;let n=d(d(t.options).plugins),s=String(e.title??d(n.title).text??""),l=String(d(n.subtitle).text??""),c={...t,options:{...d(t.options),plugins:{...n,title:{display:!1},subtitle:{display:!1}}}};i.append(a`
    ${s&&a`<h2 class="titulo">${s}</h2>`}
    ${l&&a`<p class="subtitulo">${l}</p>`}
    <div class="marco">
      <is-chart type="${String(t.type??"bar")}">
        ${T(c)}
      </is-chart>
    </div>
    ${e.caption&&a`<p class="pie">${e.caption}</p>`}
  `)}));var Je=`
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
`,Ve="https://mermaid.ink/svg/",Ye=()=>document.documentElement.dataset.theme!=="light";m("tk-diagram",p(Je,(i,e)=>{let t=Ye(),r=String(t&&e.sourceDark||e.source||"").trim();if(!r)return;let o=String(e.engine??"mermaid").toLowerCase(),n=/^\s*%%\{/.test(r)?r:`%%{init: {"theme": "${t?"dark":"default"}"}}%%
${r}`,s=l=>{l.target.replaceWith(a`
      <p class="fallo">El servicio de diagramas no respondió. La fuente está abajo.</p>
    `),i.querySelector("is-details")?.setAttribute("open","")};i.append(a`
    ${e.title&&a`<h2 class="titulo">${e.title}</h2>`}
    <div class="marco">
      ${o==="mermaid"?a`
        <img
          src="${Ve+A.encode(n)}"
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
      <pre><code>${r}</code></pre>
    </is-details>
  `)}));var Ke=`
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
`,Ge={markdown:"tk-markdown",md:"tk-markdown",text:"tk-markdown",html:"tk-html",badge:"tk-badges",badges:"tk-badges",table:"tk-table",image:"tk-image","image-group":"tk-image",steps:"tk-steps",timeline:"tk-timeline","metrics-timeline":"tk-timeline","file-tree":"tk-file-tree",code:"tk-code",sql:"tk-code",sequence:"tk-sequence","mui-stepper":"tk-stepper",stepper:"tk-stepper",url:"tk-url",link:"tk-url",video:"tk-video",youtube:"tk-video","cambio-bd":"tk-cambio-bd",chart:"tk-chart",diagram:"tk-diagram"},Ze=i=>{let e=d(i.payload);if(Array.isArray(i.blocks)&&i.blocks.length)return!0;for(let t of["text","body","html","code","sql","url","src","href","label","source","youtubeid","youtubeId"])if(String(e[t]??"").trim())return!0;for(let t of["rows","items","badges","paths","files","tree","phases","steps","milestones","events","resumen"])if(Array.isArray(e[t])&&e[t].length)return!0;for(let t of["timeline","sequence","stepper","chart","fileTree"])if(Object.keys(d(e[t])).length)return!0;return!1},H=class extends HTMLElement{#t={};#e;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),k(this.#e,Ke)}connectedCallback(){this.#i()}get bloque(){return this.#t}set bloque(e){this.#t=e??{},this.isConnected&&this.#i()}get docLane(){return d(this.#t.payload).docLane??"otros"}#i(){for(;this.#e.firstChild;)this.#e.removeChild(this.#e.firstChild);let e=this.#t,t=String(e.kind??"").toLowerCase();if(!Ze(e)){this.setAttribute("oculto","");return}this.removeAttribute("oculto");let r=Ge[t];if(!r){this.#e.append(a`
        <is-callout color="warning" icon="mdi:puzzle-outline">
          Bloque <code>${t||"sin tipo"}</code> sin representación en este visor.
        </is-callout>
      `);return}let o=document.createElement(r);Array.isArray(e.blocks)&&e.blocks.length&&(o.bloques=e.blocks),o.payload=d(e.payload),this.#e.append(o)}};m("tk-block",H);var Xe=`
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
`,Qe={success:"var(--is-color-success-500, #2f9e44)",warning:"var(--is-color-warning-500, #f08c00)",info:"var(--is-accent, #1a6eb0)",neutral:"var(--is-text-muted, #9aa7b4)"},B=(i,e,t)=>i?a`
    <is-tag color="${e}" variant="filled-outlined" pill>
      <is-icon slot="start" icon="${t}" aria-hidden="true"></is-icon>
      ${i}
    </is-tag>
  `:null,q=(i,e,t)=>e?a`
    <div class="cifra">
      <span class="cifra-rotulo">
        <is-icon icon="${t}" aria-hidden="true"></is-icon>
        ${i}
      </span>
      <span class="cifra-valor">${e}</span>
    </div>
  `:null,F=class extends HTMLElement{#t=null;#e;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),k(this.#e,Xe)}connectedCallback(){this.#i()}get ticket(){return this.#t}set ticket(e){this.#t=e,this.isConnected&&this.#i()}#i(){for(;this.#e.firstChild;)this.#e.removeChild(this.#e.firstChild);let e=this.#t;if(!e)return;let t=X(e.estado),r=String(e.resumen??"").trim(),o=(e.rootCommits?.length??(e.contexts??[]).reduce((n,s)=>n+(s.commits?.length??0),0))||0;this.#e.append(a`
      <div class="cima">
        <div class="identidad">
          <p class="codigo">
            <span class="punto" style="--punto: ${Qe[t]}" aria-hidden="true"></span>
            ${e.iticket}
          </p>
          <h1>${String(e.titulo??e.iticket)}</h1>
          <div class="chips">
            ${B(String(e.estado??""),t,"mdi:circle-slice-8")}
            ${B(e.space==="patyia"?"PatyIA":e.space==="isp-svelte"?"ISP Svelte":"Clientes","brand","mdi:folder-outline")}
            ${B(String(e.solicitante??""),"neutral","mdi:account-outline")}
          </div>
        </div>
      </div>
      <div class="cifras">
        ${q("Solicitado",$(e.fechasolicitud,!0),"mdi:calendar-arrow-right")}
        ${q("Entregado",$(e.fechaentrega,!0),"mdi:calendar-check")}
        ${q("Tiempo total",I(e.tiempoTotalMinutos??e.diligenciaMinutos),"mdi:timer-outline")}
        ${q("Commits",o?String(o):"","mdi:source-commit")}
      </div>
      ${r&&a`<div class="resumen prosa">${v(x(r))}</div>`}
    `)}};m("tk-ticket-head",F);var et=`
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
`,tt={ISS:"Dev-InSoft/ISS-AyudasCPIA","ISS-AyudasCPIA":"Dev-InSoft/ISS-AyudasCPIA",PatyIA:"Dev-InSoft/ISS-AyudasCPIA","ISA-DOC":"Dev-InSoft/ISA-DOC","isa-patyia":"Jeff-Aporta/isa-patyia",ISA:"Jeff-Aporta/isa-patyia","ISW-ClientesIS":"Dev-InSoft/ISW-ClientesIS","ISP-ClientesIS":"Dev-InSoft/ISP-ClientesIS","ISP-CLientesISServer":"Dev-InSoft/ISP-CLientesISServer","ISS-ClientesIS-ContaPymeU":"Dev-InSoft/ISS-ClientesIS-ContaPymeU","ISP-SvelteComponents":"Dev-InSoft/ISP-SvelteComponents"},it=(i,e)=>{let t=e.trim();if(!t)return"#";let r=i.trim();return`https://github.com/${tt[r]??`Dev-InSoft/${r||"repo"}`}/commit/${t}`},rt=i=>{let e=d(i.meta),t=String(i.fecha??e.fecha??"");if(!t)return"\u2014";let r=new Date(t);if(Number.isNaN(r.getTime()))return $(t);let o=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];return`${r.getDate()} ${o[r.getMonth()]}`},ot=i=>{let e=d(i.meta);return String(e.repo??i.proyecto??"PatyIA")},P=class extends HTMLElement{#t=[];#e;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),k(this.#e,et)}connectedCallback(){this.#i()}get commits(){return this.#t}set commits(e){this.#t=Array.isArray(e)?e:[],this.isConnected&&this.#i()}#i(){for(;this.#e.firstChild;)this.#e.removeChild(this.#e.firstChild);let e=this.#t.filter(n=>String(n.hash??"").trim());if(!e.length)return;let t=0,r=0,o=0;for(let n of e)t+=Number(n.inscount??0),r+=Number(n.delcount??0),o+=Number(n.minutos??0);this.#e.append(a`
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
            ${e.map(n=>{let s=String(n.hash??""),l=it(ot(n),s);return a`
                <tr>
                  <td>
                    <a class="hash" href="${l}" target="_blank" rel="noopener noreferrer">
                      ${s.slice(0,9)}
                    </a>
                  </td>
                  <td class="fecha">${rt(n)}</td>
                  <td><span class="desc" title="${String(n.descripcion??"")}">${String(n.descripcion??"")}</span></td>
                  <td class="num"><span class="chip ins">+${Number(n.inscount??0)}</span></td>
                  <td class="num"><span class="chip del">−${Number(n.delcount??0)}</span></td>
                  <td class="num">${Number(n.minutos??0)} min</td>
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
    `)}};m("tk-commits",P);var at=`
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
`,O={investigacion:{label:"Investigaci\xF3n y testing",bar:"linear-gradient(90deg, #7c3aed, #8b5cf6)",bg:"rgba(124,58,237,0.14)",fg:"#c4b5fd",border:"rgba(167,139,250,0.45)"},commits:{label:"Commits",bar:"linear-gradient(90deg, #06b6d4, #6366f1)",bg:"rgba(6,182,212,0.14)",fg:"#a5f3fc",border:"rgba(34,211,238,0.45)"},diligencia:{label:"Diligencia",bar:"linear-gradient(90deg, #f59e0b, #fbbf24)",bg:"rgba(245,158,11,0.14)",fg:"#fde68a",border:"rgba(251,191,36,0.45)"},otro:{label:"Otro",bar:"linear-gradient(90deg, #059669, #10b981)",bg:"rgba(16,185,129,0.12)",fg:"#a7f3d0",border:"rgba(52,211,153,0.4)"}},nt=i=>{let e=Math.round(Number(i??0));return e<=0?0:Math.round(e/5)*5},ae=i=>{let e=String(i.phase??"").trim().toLowerCase();if(e&&O[e])return e;let t=`${i.name??""} ${i.detail??""}`.toLowerCase();return/^diligencia\b|\bdiligencia del\b|evidencias \+|documentaci[oó]n tk/i.test(t)?"diligencia":/investigaci|testing\b|\bpruebas\b|verificaci|reproducci|matriz de prueba|diagn[oó]stico/i.test(t)?"investigacion":/commit|repositorio|codigo|c[oó]digo|servidor|front|desarrollo|entrega|bd\b|fix\b|feat\b/i.test(t)?"commits":"otro"},_=class extends HTMLElement{#t=[];#e;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),k(this.#e,at)}connectedCallback(){this.#i()}get tiempos(){return this.#t}set tiempos(e){this.#t=Array.isArray(e)?e:[],this.isConnected&&this.#i()}#i(){for(;this.#e.firstChild;)this.#e.removeChild(this.#e.firstChild);let e=this.#t.map(r=>({...r,minutos:nt(r.minutos)})).filter(r=>r.minutos>0&&String(r.name??"").trim());if(!e.length)return;let t=e.reduce((r,o)=>r+o.minutos,0)||1;this.#e.append(a`
      <div class="linea" aria-label="Línea de tiempo de métricas">
        ${e.map(r=>{let o=ae(r),n=O[o];return a`
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
                    <div class="nombre">${r.name}</div>
                    ${r.detail?a`<p class="detail">${r.detail}</p>`:null}
                  </div>
                  <span class="mins">${r.minutos} min</span>
                </div>
              </div>
            </div>
          `})}
      </div>
      <div class="panel" role="region" aria-label="Resumen de tiempos InSoft">
        ${e.map(r=>{let o=ae(r),n=O[o],s=Math.min(100,r.minutos/t*100);return a`
            <div
              class="fila"
              style="${`--fase-bar:${n.bar};--fase-bg:${n.bg};--fase-fg:${n.fg};--fase-border:${n.border}`}"
            >
              <div class="cima">
                <div>
                  <div class="cima" style="justify-content:flex-start;margin-bottom:0.25rem">
                    <span class="nombre">${r.name}</span>
                    <span class="fase">${n.label}</span>
                  </div>
                  ${r.detail?a`<p class="detail">${r.detail}</p>`:null}
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
    `)}};m("tk-tiempos",_);var st=`
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
    max-width: 52rem;
    margin: 0 auto;
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
`,lt=i=>{let e=d(i.detallesextra),t=d(i.meta),r=d(e.metricas),n={...d(t.metricas),...r},s=d(n.documentacion);return s.metricasHabilesMinutos&&!n.metricasHabilesMinutos&&(n.metricasHabilesMinutos=d(s.metricasHabilesMinutos)),n},z=i=>{let e=Number(i);return Number.isFinite(e)&&e>0?Math.round(e):0},ne=i=>{let e=Number(i);return Number.isFinite(e)&&e>0?Math.round(e*60):0},ct=(i,e)=>{let t=d(e.metricasHabilesMinutos),r=d(e.documentacion),o=d(r.metricasHabilesMinutos),n=z(t.hastaAtencion??o.hastaAtencion)||z(i.diligenciaMinutos),s=d(e.reporteEmpresa),l=z(t.atencionActiva??o.atencionActiva)||ne(s.horasAtencion),c=z(t.totalSolucion??o.totalSolucion??i.tiempoTotalMinutos)||ne(s.horasSolucion)||z(i.tiempoestimacionminutos)||n+l+z(i.commitminutos);return[{icon:"mdi:clock-start",label:"Hasta atenci\xF3n",minutos:n,sub:"Creaci\xF3n \u2192 inicio atenci\xF3n"},{icon:"mdi:head-cog-outline",label:"Atenci\xF3n activa",minutos:l,sub:"Inicio atenci\xF3n \u2192 cierre"},{icon:"mdi:check-decagram",label:"Total soluci\xF3n h\xE1bil",minutos:c,sub:"Tiempo real laborado / estimado"}]},U=class extends HTMLElement{#t=null;#e;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),k(this.#e,st)}connectedCallback(){this.#i()}get ticket(){return this.#t}set ticket(e){this.#t=e,this.isConnected&&this.#i()}#i(){for(;this.#e.firstChild;)this.#e.removeChild(this.#e.firstChild);let e=this.#t;if(!e?.iticket){this.#e.append(a`<p class="vacio">Sin tiquete para métricas.</p>`);return}let t=lt(e),r=d(t.documentacion),o=d(t.reporteEmpresa),n=ct(e,t),s=[...e.tiempos??[]].filter(b=>Number(b.minutos??0)>0),l=!t.fechaCierre&&String(r.cierreEmpresa??e.estado??"").toLowerCase().includes("abierto")||!t.fechaCierre&&!e.fechaentrega,c=String(r.tiposolicitudapertura??d(e.normativa).tiposolicitudapertura??d(e.normativa).tipoSolicitud??"").trim(),g=[];t.fechaCreacion?(l||!t.fechaCierre)&&g.push(a`
        <is-callout color="info" icon="mdi:information-outline">
          Ticket abierto — sin cierre InSoft. Las métricas de atención activa y total se completan al registrar el cierre.
        </is-callout>
      `):g.push(a`
        <is-callout color="warning" icon="mdi:calendar-alert">
          Falta fecha de creación InSoft (<code>metricas.fechaCreacion</code>).
        </is-callout>
      `);let h=[["Creaci\xF3n",t.fechaCreacion||$(e.fechasolicitud,!0)||"\u2014"],["Inicio atenci\xF3n",t.horaInicioAtencion||"\u2014"],["Cierre",t.fechaCierre||$(e.fechaentrega,!0)||"Abierto"],["Tipo apertura",c||"\u2014"],["Asignado",String(r.asignadoA||r.ingeniero||"\u2014")],["Solicitante",String(r.solicitante||e.solicitante||"\u2014")],["Clasificador",String(r.clasificador||"\u2014")],["Medio",String(r.medioAtencion||"\u2014")]].filter(([,b])=>String(b).trim()&&String(b)!=="\u2014"),f=[["Horas atenci\xF3n (empresa)",o.horasAtencion!=null?`${o.horasAtencion} h`:""],["Horas soluci\xF3n (empresa)",o.horasSolucion!=null?`${o.horasSolucion} h`:""],["Capturado",String(o.capturado||"")],["Fuente",String(o.fuente||"")]].filter(([,b])=>String(b).trim());this.#e.append(a`
      <article class="metrics" aria-label="Métricas InSoft">
        <header>
          <p class="eyebrow">Estudio de métricas · tiempo hábil InSoft</p>
          <h1 class="titulo">${e.iticket}</h1>
          <p class="sub">${e.titulo||""}</p>
          ${c?a`<p class="meta">Tipo solicitud apertura: ${c}</p>`:null}
        </header>

        ${g.length?a`<div class="avisos">${g}</div>`:null}

        <div class="kpis" role="group" aria-label="Indicadores de tiempo hábil">
          ${n.map(b=>a`
            <div class="kpi">
              <div class="kpi-lbl">
                <is-icon icon="${b.icon}" aria-hidden="true"></is-icon>
                <span>${b.label}</span>
              </div>
              <div class="kpi-val">${b.minutos>0?I(b.minutos):"\u2014"}</div>
              <div class="kpi-sub">${b.sub}</div>
            </div>
          `)}
        </div>

        ${h.length?a`
          <section class="card" aria-label="Datos InSoft">
            <h2 class="card-h">
              <is-icon icon="mdi:clipboard-text-clock-outline" aria-hidden="true"></is-icon>
              Datos InSoft
            </h2>
            <dl class="filas">
              ${h.map(([b,w])=>a`
                <div class="fila"><dt>${b}</dt><dd>${w}</dd></div>
              `)}
            </dl>
            ${t.notas?a`<p class="meta">${t.notas}</p>`:null}
          </section>
        `:null}

        ${f.length?a`
          <section class="card" aria-label="Reporte empresa">
            <h2 class="card-h">
              <is-icon icon="mdi:office-building-outline" aria-hidden="true"></is-icon>
              Reporte empresa
            </h2>
            <dl class="filas">
              ${f.map(([b,w])=>a`
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
          ${s.length?Object.assign(document.createElement("tk-tiempos"),{tiempos:s}):a`<p class="vacio">Sin filas de tiempo estimadas en este tiquete.</p>`}
        </section>
      </article>
    `)}};m("tk-metrics",U);var Vt=new URL(".",document.baseURI).href,se=()=>{let e=new URLSearchParams(location.search).get("s");if(!e)return{};try{return JSON.parse(A.decode(e))}catch{return{}}},dt=(i,e=!1)=>{let t={...se(),...i},r=Object.fromEntries(Object.entries(t).filter(([,n])=>n!=null&&n!==""&&n!==!1)),o=new URL(location.href);return Object.keys(r).length?o.searchParams.set("s",A.encode(JSON.stringify(r))):o.searchParams.delete("s"),history[e?"replaceState":"pushState"]({},"",o),r},mt=i=>{let e=new URL(location.href);return e.searchParams.set("s",A.encode(JSON.stringify(i))),e.href},le={leer:se,escribir:dt,enlace:mt},j=(i,e="brand")=>{let t=document.querySelector("is-toast");if(t?.create){t.create(i,{color:e,duration:e==="warning"||e==="danger"?8e3:4e3});return}e==="danger"||e==="warning"?console.warn(`[tk] ${i}`):console.info(`[tk] ${i}`)};var L="https://cdn.jsdelivr.net/gh/Jeff-Aporta/is-webcomponents@main/dist/cdn";var ut="Jeff-Aporta/jagudeloe-tks-front",pt="03b625043f50705b81423faf429a15e568f77dab",de=`https://cdn.jsdelivr.net/gh/${ut}@${pt}/dist/cdn`,ce=i=>i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),ht=i=>{let e=`${i.iticket} \xB7 ${i.titulo??"Tiquete"}`,t=JSON.stringify(i).replace(/<\/(script)/gi,"<\\/$1");return`<!doctype html>
<html lang="es" class="theme-dark" data-theme="dark" data-palette="contapyme">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="generator" content="jagudeloe \xB7 visor de tiquetes">
<title>${ce(e)}</title>

<!-- Kit is-* (versi\xF3n fijada) -->
<link rel="stylesheet" href="${L}/is-base.min.css">
<link rel="stylesheet" href="${L}/palettes.min.css">
<script type="module" src="${L}/all.min.js"><\/script>

<!-- Componentes tk-* (bundle \xFAnico, CDN de este repo) -->
<script type="module" src="${de}/tk.all.js"><\/script>

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
    <span><strong>${ce(i.iticket)}</strong> \xB7 documentaci\xF3n descargada</span>
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
`},W={cdn:de,async html(i){return ht(i)},async descargar(i){let e=await W.html(i),t=new Blob([e],{type:"text/html;charset=utf-8"}),r=URL.createObjectURL(t),o=document.createElement("a");o.href=r,o.download=`${i.iticket}.html`,document.body.append(o),o.click(),o.remove(),setTimeout(()=>URL.revokeObjectURL(r),3e4)}};var gt=`
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
`,J=class extends HTMLElement{#t=null;#e;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),k(this.#e,gt)}connectedCallback(){this.#r()}get ticket(){return this.#t}set ticket(e){this.#t=e,this.toggleAttribute("activo",!!e?.iticket),this.isConnected&&this.#r()}async#i(){let e=this.#t;if(!e)return;let t=le.enlace({space:e.space,tk:e.iticket,full:!0}),r=navigator;if(r.share)try{await r.share({title:`${e.iticket} \xB7 ${e.titulo??""}`.trim(),url:t});return}catch{}try{await navigator.clipboard.writeText(t),j("Enlace copiado al portapapeles.","success")}catch{j("No se pudo copiar el enlace. C\xF3pialo de la barra de direcciones.","warning")}}async#o(e){let t=this.#t;if(t){e.setAttribute("loading","");try{await W.descargar(t),j(`${t.iticket}.html descargado.`,"success")}catch(r){j(`No se pudo generar el HTML: ${r instanceof Error?r.message:r}`,"danger")}finally{e.removeAttribute("loading")}}}#r(){for(;this.#e.firstChild;)this.#e.removeChild(this.#e.firstChild);this.#t?.iticket&&this.#e.append(a`
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
    `)}};m("tk-actions",J);var ft=`
  :host {
    display: block;
    position: relative;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    container-type: inline-size;
    --tk-measure: min(72ch, 100%);
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
  .firma {
    margin-top: 0.5rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--is-border-soft, #1f242b);
    color: var(--is-text, #e6edf3);
    font-size: 0.75rem;
    line-height: 1.5;
    overflow-wrap: anywhere;
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
`,bt=[{lane:"solicitud",rotulo:"Solicitud"},{lane:"evidencias",rotulo:"Evidencias"},{lane:"causa",rotulo:"Causa"},{lane:"solucion",rotulo:"Soluci\xF3n"},{lane:"verificacion",rotulo:"Verificaci\xF3n"},{lane:"otros",rotulo:"Detalle"}],vt=i=>{let e=Array.isArray(i.content)&&i.content.length?[...i.content]:[...i.doc?.blocks??[]],t=(i.contexts??[]).flatMap(r=>[...r.content??[]]);return[...e,...t].filter(r=>r&&typeof r=="object").sort((r,o)=>(r.sortkey??0)-(o.sortkey??0))},kt=(i,e)=>{let t=d(i.payload),r=String(t.docLane??t.section??t.lane??"").trim().toLowerCase();if(r==="solicitud"||r==="evidencias"||r==="causa"||r==="solucion"||r==="verificacion"||r==="otros")return r;let o=String(t.title??"").toLowerCase().normalize("NFD").replace(/\p{M}/gu,"");if(/^solicitud|^objetivo|requerimiento insoft|^requerimiento\b/.test(o))return"solicitud";if(/^evidencia|informacion del tiquete|pantallazo|captura/.test(o))return"evidencias";if(/hipotesis|causa identificada|causa del problema|^causa\b|antecedente|analisis realizado|diagnostico|raiz del problema/.test(o))return"causa";if(/verificacion\b|validacion\b|investigacion y pruebas|como probar|pruebas realizadas/.test(o))return"verificacion";if(/solucion aplicada|solucion entregada|^solucion\b|cambios en base de datos|resultado\b|conclusion|catalogo por tipo|resumen de tiempos/.test(o))return"solucion";let n=String(i.kind??"").toLowerCase();return n==="html"||n==="image"||n==="image-group"?e==="otros"?"evidencias":e:n==="badge"||n==="badges"?e==="otros"?"solicitud":e:n==="code"||n==="sql"||n==="cambio-bd"||n==="file-tree"?e==="otros"?"solucion":e:n==="steps"||n==="stepper"?e==="otros"?"verificacion":e:n==="table"&&e==="otros"?"evidencias":n==="markdown"||n==="md"||n==="text"?o?"otros":e:"otros"},wt=i=>{let e="solicitud";return i.map(t=>{let r=kt(t,e);return e=r,{b:t,lane:r}})},yt=i=>{let e=[...i.rootCommits??[]];return e.length?e:(i.contexts??[]).flatMap(t=>[...t.commits??[]])},V=i=>String(i||"").trim().toLowerCase()==="metrics"?"metrics":"doc",Y=class extends HTMLElement{static get observedAttributes(){return["embebido","modo"]}#t=null;#e="doc";#i;constructor(){super(),this.#i=this.attachShadow({mode:"open"}),k(this.#i,ft)}connectedCallback(){this.#e=V(this.getAttribute("modo")),this.#n()}attributeChangedCallback(e,t,r){e==="modo"&&(this.#e=V(r)),this.isConnected&&this.#n()}get ticket(){return this.#t}set ticket(e){this.#t=e,this.isConnected&&this.#n()}set json(e){let t=d(e);this.ticket=t.ticket?t.ticket:t}get embebido(){return this.hasAttribute("embebido")}set embebido(e){this.toggleAttribute("embebido",!!e)}get modo(){return this.#e}set modo(e){let t=V(String(e));this.#e!==t&&(this.#e=t,this.setAttribute("modo",t),this.dispatchEvent(new CustomEvent("tk-modo",{bubbles:!0,composed:!0,detail:{modo:t}})),this.isConnected&&this.#n())}#o=()=>{this.modo=this.#e==="doc"?"metrics":"doc"};#r(e){let t=wt(vt(e)),r=Object.assign(document.createElement("tk-ticket-head"),{ticket:e}),o=yt(e),n=bt.map(({lane:l,rotulo:c})=>{let g=t.filter(h=>h.lane===l).map(h=>h.b);return g.length?a`
        <section aria-label="${c}">
          <h2 class="rotulo">${c}</h2>
          ${g.map(h=>Object.assign(document.createElement("tk-block"),{bloque:h}))}
        </section>
      `:null}).filter(Boolean),s=o.length?a`
        <section aria-label="Commits">
          <h2 class="rotulo">Commits</h2>
          ${Object.assign(document.createElement("tk-commits"),{commits:o})}
        </section>
      `:null;return a`
      <article class="documento" data-modo="doc">
        <header class="encabezado">${r}</header>
        ${n.length>0?n:a`
          <is-callout color="neutral" icon="mdi:text-box-remove-outline">
            Este tiquete todavía no tiene documentación publicada.
          </is-callout>
        `}
        ${s}
        <footer class="firma">
          ${e.iticket} · ${e.space==="patyia"?"PatyIA":e.space==="isp-svelte"?"ISP Svelte":"Clientes"} ·
          documentación generada desde jagudeloe-tks
        </footer>
      </article>
    `}#a(e){return a`
      <div class="documento" data-modo="metrics">
        ${Object.assign(document.createElement("tk-metrics"),{ticket:e})}
      </div>
    `}#n(){for(;this.#i.firstChild;)this.#i.removeChild(this.#i.firstChild);let e=this.#t;if(!e?.iticket){this.#i.append(a`
        <div class="vacio">
          <is-icon icon="mdi:file-document-outline" style="font-size:2rem" aria-hidden="true"></is-icon>
          <p>Selecciona un tiquete para ver su documentación.</p>
        </div>
      `);return}let t=this.#e==="metrics",r=t?"mdi:file-document-outline":"mdi:chart-timeline-variant",o=t?"Ver documentaci\xF3n":"Ver m\xE9tricas InSoft";this.#i.append(a`
      <div class="shell">
        ${t?this.#a(e):this.#r(e)}
        <div class="fab">
          <button
            type="button"
            class="fab-btn"
            aria-label="${o}"
            title="${o}"
            aria-pressed="${t?"true":"false"}"
            onclick=${this.#o}
          >
            <is-icon icon="${r}" aria-hidden="true"></is-icon>
          </button>
        </div>
      </div>
    `)}};m("tk-view",Y);
