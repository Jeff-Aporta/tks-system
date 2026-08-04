var P=new Map,$=(r,e)=>{let t=P.get(e);t||(t=new CSSStyleSheet,t.replaceSync(e),P.set(e,t)),r.adoptedStyleSheets=[...r.adoptedStyleSheets,t]},u=`
  :host {
    display: block;
    color: var(--is-text, #e6edf3);
    font-family: var(--is-font-sans, system-ui, -apple-system, "Segoe UI", sans-serif);
    font-size: 0.9375rem;
    line-height: 1.65;
  }
  .titulo {
    margin: 0 0 0.65em;
    max-width: var(--tk-measure, 68ch);
    font-size: 1.0625em;
    font-weight: 620;
    letter-spacing: -0.011em;
    line-height: 1.35;
    color: var(--is-text, #e6edf3);
  }
  .superficie {
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: var(--is-bg-soft, #14181d);
  }
  .pie {
    margin: 0.65em 0 0;
    max-width: var(--tk-measure, 68ch);
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.8125em;
    line-height: 1.5;
  }
`;var z=Symbol("tk-html-crudo"),f=r=>({[z]:String(r??"")}),F=r=>typeof r=="object"&&r!==null&&z in r,n=(r,...e)=>{let t=[],i=[],o="";for(let l=0;l<r.length;l++){if(o+=r[l],l>=e.length)continue;let a=e[l];if(a==null||a===!1||a===!0)continue;if(typeof a=="function"&&/\s+on([a-zA-Z][\w-]*)=\s*$/.test(o)){let g=o.match(/\s+on([a-zA-Z][\w-]*)=\s*$/);o=o.slice(0,o.length-g[0].length),o+=` data-tk-ev="${i.length}"`,i.push({evento:g[1].toLowerCase(),fn:a});continue}if(F(a)){o+=a[z];continue}let h=Array.isArray(a)?a:[a];for(let g of h)g==null||g===!1||g===!0||(g instanceof Node?(o+=`<template data-tk-nodo="${t.length}"></template>`,t.push(g)):F(g)?o+=g[z]:o+=x(g))}let s=document.createElement("template");s.innerHTML=o;let m=s.content;for(let l of[...m.querySelectorAll("template[data-tk-nodo]")]){let a=Number(l.dataset.tkNodo);l.replaceWith(t[a]??document.createComment("tk:nodo"))}for(let l of[...m.querySelectorAll("[data-tk-ev]")]){let a=Number(l.dataset.tkEv),b=i[a];b&&l.addEventListener(b.evento,b.fn),l.removeAttribute("data-tk-ev")}return m},S=r=>{let e=document.createElement("script");return e.type="application/json",e.textContent=JSON.stringify(r),e},x=r=>String(r??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"),d=r=>r&&typeof r=="object"&&!Array.isArray(r)?r:{},w=r=>{let e=[],t=String(r??"").replace(/`([^`]+)`/g,(i,o)=>(e.push(o),` ${e.length-1} `));return t=x(t).replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g,(i,o,s)=>`<a href="${x(s)}" target="_blank" rel="noopener noreferrer">${o}</a>`).replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/(^|[\s(])\*([^*\n]+)\*/g,"$1<em>$2</em>").replace(/~~([^~]+)~~/g,"<del>$1</del>"),t.replace(/ (\d+) /g,(i,o)=>`<code>${x(e[Number(o)])}</code>`)},v=r=>{let e=String(r??"").replace(/\r\n?/g,`
`).split(`
`),t=[],i=[],o=0,s=()=>{i.length&&t.push(`<p>${w(i.join(" "))}</p>`),i.length=0};for(;o<e.length;){let m=e[o],l=m.match(/^\s*```(\w+)?\s*$/);if(l){s();let h=[];for(o++;o<e.length&&!/^\s*```\s*$/.test(e[o]);)h.push(e[o++]);o++,t.push(`<pre data-lang="${x(l[1]??"")}"><code>${x(h.join(`
`))}</code></pre>`);continue}if(/^\s*\|/.test(m)&&/^\s*\|[\s:|-]+\|?\s*$/.test(e[o+1]??"")){s();let h=y=>y.trim().replace(/^\||\|$/g,"").split("|").map(j=>w(j.trim())),g=h(m);o+=2;let T=[];for(;o<e.length&&/^\s*\|/.test(e[o]);)T.push(h(e[o++]));t.push(`<table><thead><tr>${g.map(y=>`<th>${y}</th>`).join("")}</tr></thead><tbody>${T.map(y=>`<tr>${y.map(j=>`<td>${j}</td>`).join("")}</tr>`).join("")}</tbody></table>`);continue}let a=m.match(/^(#{1,6})\s+(.*)$/);if(a){s();let h=Math.min(a[1].length+2,6);t.push(`<h${h}>${w(a[2])}</h${h}>`),o++;continue}if(/^\s*(---|___|\*\*\*)\s*$/.test(m)){s(),t.push("<hr>"),o++;continue}if(/^\s*>\s?/.test(m)){s();let h=[];for(;o<e.length&&/^\s*>\s?/.test(e[o]);)h.push(e[o++].replace(/^\s*>\s?/,""));t.push(`<blockquote>${v(h.join(`
`))}</blockquote>`);continue}let b=m.match(/^\s*([-*+]|\d+[.)])\s+/);if(b){s();let h=/\d/.test(b[1]),g=[];for(;o<e.length;){let y=e[o].match(/^\s*([-*+]|\d+[.)])\s+(.*)$/);if(!y){if(g.length&&/^\s{2,}\S/.test(e[o])){g[g.length-1]+=` ${e[o].trim()}`,o++;continue}break}g.push(y[2]),o++}let T=h?"ol":"ul";t.push(`<${T}>${g.map(y=>`<li>${w(y)}</li>`).join("")}</${T}>`);continue}if(!m.trim()){s(),o++;continue}i.push(m.trim()),o++}return s(),t.join(`
`)},k=`
  .prosa {
    max-width: var(--tk-measure, 68ch);

    > :first-child { margin-top: 0; }
    > :last-child { margin-bottom: 0; }

    h3, h4, h5, h6 {
      margin: 1.35em 0 0.45em;
      font-weight: 620;
      letter-spacing: -0.01em;
      line-height: 1.3;
    }
    h3 { font-size: 1.0625em; }
    h4 { font-size: 0.9375em; color: var(--is-text-muted, #9aa7b4); }
    p { margin: 0 0 0.8em; }
    ul, ol { margin: 0 0 0.85em; padding-left: 1.25em; }
    li {
      margin: 0.3em 0;
      padding-left: 0.15em;

      &::marker { color: var(--is-accent, #1a6eb0); }
      > p { margin: 0.2em 0; }
    }
    a {
      color: var(--tk-link, #6fb2e8);
      text-decoration: underline;
      text-underline-offset: 0.18em;
      text-decoration-thickness: 1px;
      text-decoration-color: color-mix(in srgb, currentColor 40%, transparent);

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
      line-height: 1.35;
      vertical-align: baseline;
      color: var(--tk-code-text, #a8d5ff);
      box-decoration-break: clone;
      -webkit-box-decoration-break: clone;
    }
    pre {
      margin: 0 0 1em;
      padding: 0.85em 1em;
      overflow-x: auto;
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
        vertical-align: baseline;
      }
    }
    blockquote {
      margin: 0 0 1em;
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
      width: 100%;
      max-width: 100%;
      margin: 0 0 1em;
      border-collapse: collapse;
      font-size: 0.9em;
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
`,Y=new Intl.DateTimeFormat("es-CO",{day:"2-digit",month:"short",year:"numeric"}),ee=new Intl.DateTimeFormat("es-CO",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}),A=(r,e=!1)=>{if(!r)return"";let t=String(r).trim();(t.startsWith('"')&&t.endsWith('"')||t.startsWith("'")&&t.endsWith("'"))&&(t=t.slice(1,-1).trim());let i=new Date(t);return Number.isNaN(i.getTime())?t:(e?ee:Y).format(i)},U=r=>{let e=Number(r);if(!Number.isFinite(e)||e<=0)return"";let t=Math.floor(e/60),i=Math.round(e%60);return t?i?`${t} h ${i} min`:`${t} h`:`${i} min`},te={primary:"brand",brand:"brand",info:"info",success:"success",ok:"success",warning:"warning",warn:"warning",danger:"danger",error:"danger",violet:"brand",neutral:"neutral",default:"neutral"},_=r=>te[String(r??"").toLowerCase()]??"neutral",I=r=>{let e=String(r??"").toLowerCase();return e.includes("cerrad")||e.includes("solucion")?"success":e.includes("proceso")||e.includes("curso")?"warning":e.includes("abiert")||e.includes("nuevo")?"info":"neutral"},C={encode(r){let e=new TextEncoder().encode(r),t="";for(let i of e)t+=String.fromCharCode(i);return btoa(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")},decode(r){let e=String(r).replace(/-/g,"+").replace(/_/g,"/");for(;e.length%4;)e+="=";let t=atob(e),i=new Uint8Array(t.length);for(let o=0;o<t.length;o++)i[o]=t.charCodeAt(o);return new TextDecoder().decode(i)}},c=(r,e)=>{customElements.get(r)||customElements.define(r,e)},p=(r,e)=>class extends HTMLElement{#t={};#e;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),$(this.#e,r)}connectedCallback(){this.#r()}get payload(){return this.#t}set payload(t){this.#t=d(t),this.isConnected&&this.#r()}#r(){for(;this.#e.firstChild;)this.#e.removeChild(this.#e.firstChild);e(this.#e,this.#t,this)}};var re=`
  ${u}
  ${k}
`;c("tk-markdown",p(re,(r,e)=>{let t=String(e.text??e.body??e.content??"").trim();!t&&!e.title||r.append(n`
    ${e.title&&n`<h2 class="titulo">${e.title}</h2>`}
    ${t&&n`<div class="prosa">${f(v(t))}</div>`}
  `)}));var oe=`
  ${u}
  ${k}
  .prosa img { max-width: 100%; height: auto; border-radius: var(--tk-radius, 0.625rem); }
  .prosa table { display: block; overflow-x: auto; }
`,ie=["script","style","iframe","object","embed","form","link","meta","base"],ne=r=>{let e=new DOMParser().parseFromString(String(r??""),"text/html");e.body.querySelectorAll(ie.join(",")).forEach(t=>t.remove());for(let t of e.body.querySelectorAll("*")){for(let i of[...t.attributes]){let o=i.name.toLowerCase(),s=i.value.trim().toLowerCase();(o.startsWith("on")||(o==="href"||o==="src")&&s.startsWith("javascript:"))&&t.removeAttribute(i.name)}t.tagName==="A"&&(t.setAttribute("target","_blank"),t.setAttribute("rel","noopener noreferrer"))}return e.body.innerHTML};c("tk-html",p(oe,(r,e)=>{let t=String(e.html??"").trim();!t&&!e.title||r.append(n`
    ${e.title&&n`<h2 class="titulo">${e.title}</h2>`}
    ${t&&n`<div class="prosa">${f(ne(t))}</div>`}
  `)}));var se=`
  ${u}
  .fila {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45em;
    align-items: center;
    font-size: 0.875rem;
  }
`;c("tk-badges",p(se,(r,e)=>{let i=(Array.isArray(e.items)?e.items:Array.isArray(e.badges)?e.badges:e.label?[e]:[]).map(d).map(o=>({texto:String(o.label??o.text??"").trim(),color:_(o.tone??o.color)})).filter(o=>o.texto);i.length&&r.append(n`
    ${e.title&&n`<h2 class="titulo">${e.title}</h2>`}
    <div class="fila">
      ${i.map(o=>n`
        <is-tag color="${o.color}" variant="filled-outlined" pill>${o.texto}</is-tag>
      `)}
    </div>
  `)}));var ae=`
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
`,L=r=>{if(r==null)return"";if(typeof r=="object"){let e=d(r);return w(e.text??e.label??e.value??"")}return w(r)};c("tk-table",p(ae,(r,e)=>{let t=(Array.isArray(e.rows)?e.rows:[]).map(l=>Array.isArray(l)?l:[l]);if(!t.length)return;let i=(Array.isArray(e.headers)?e.headers:[]).map(String);if(t.every(l=>l.length===2)){r.append(n`
      ${e.title&&n`<h2 class="titulo">${e.title}</h2>`}
      <dl class="ficha">
        ${t.map(l=>n`
          <dt>${f(L(l[0]))}</dt>
          <dd>${f(L(l[1]))}</dd>
        `)}
      </dl>
      ${e.caption&&n`<p class="pie">${e.caption}</p>`}
    `);return}let o=Math.max(...t.map(l=>l.length),i.length),s=Array.from({length:o},(l,a)=>({field:`c${a}`,headerName:i[a]??`Columna ${a+1}`,flex:1,sortable:!0,renderCell:({value:b})=>({html:L(b)})})),m=Object.assign(document.createElement("is-data-grid"),{columns:s,rows:t.map((l,a)=>{let b={id:a};return l.forEach((h,g)=>{b[`c${g}`]=h}),b})});m.setAttribute("auto-height",""),m.setAttribute("hide-footer",""),m.setAttribute("density","compact"),m.setAttribute("disable-column-menu",""),t.length>12&&(m.setAttribute("show-toolbar",""),m.setAttribute("quick-filter","")),r.append(n`
    ${e.title&&n`<h2 class="titulo">${e.title}</h2>`}
    ${m}
    ${e.caption&&n`<p class="pie">${e.caption}</p>`}
  `)}));var le=`
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
      transition: opacity 160ms ease-out;

      &[data-cargando] { opacity: 0; }
    }
    &:hover img { opacity: 0.92; }
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
`,W=r=>{let e=String(r.url??r.src??"").trim();return e?{url:e,alt:String(r.alt??r.caption??r.title??"Evidencia del tiquete"),caption:String(r.caption??"")}:null},ce=r=>{let e=document.querySelector("is-lightbox[data-tk]");e||(e=document.createElement("is-lightbox"),e.setAttribute("data-tk",""),document.body.append(e)),e.replaceChildren(n`<img src="${r.url}" alt="${r.alt}">`),typeof e.show=="function"?e.show():e.setAttribute("open","")},de=r=>{let e=i=>{let o=i.target;o.removeAttribute("data-cargando"),o.naturalWidth&&o.naturalHeight&&(o.style.aspectRatio=`${o.naturalWidth} / ${o.naturalHeight}`)},t=i=>{let o=i.target;(o.closest(".lienzo")??o).replaceWith(n`
      <p class="rota">La evidencia ya no está disponible.</p>
    `)};return n`
    <figure>
      <button
        class="lienzo"
        type="button"
        aria-label="Ampliar: ${r.alt}"
        onclick=${()=>ce(r)}
      >
        <img
          src="${r.url}"
          alt="${r.alt}"
          loading="lazy"
          decoding="async"
          data-cargando
          onload=${e}
          onerror=${t}
        >
      </button>
      ${r.caption&&n`<figcaption>${r.caption}</figcaption>`}
    </figure>
  `};c("tk-image",p(le,(r,e,t)=>{let i=t.bloques??[],o=(i.length?i.map(s=>W(d(s.payload))):[W(e)]).filter(s=>!!s);o.length&&r.append(n`
    ${e.title&&n`<h2 class="titulo">${e.title}</h2>`}
    <div class="${o.length>1?"rejilla":""}">
      ${o.map(de)}
    </div>
  `)}));var me=`
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
`,ue=new RegExp("\\b("+["select","from","where","insert","into","values","update","set","delete","create","alter","drop","table","index","view","join","left","right","inner","outer","on","group","order","by","having","limit","offset","and","or","not","null","as","distinct","case","when","then","else","end","begin","commit","rollback","union","exists","between","like","in","const","let","var","function","return","if","for","while","await","async","class","extends","new","this","import","export","default","interface","type","try","catch","throw","typeof","true","false"].join("|")+")\\b","gi"),pe=r=>{let e=[],t=o=>(e.push(o),`\0${e.length-1}\0`),i=x(r);return i=i.replace(/(--[^\n]*|\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*)/g,o=>t(`<span class="com">${o}</span>`)),i=i.replace(/('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`)/g,o=>t(`<span class="str">${o}</span>`)),i=i.replace(/\b\d+(\.\d+)?\b/g,o=>t(`<span class="num">${o}</span>`)),i=i.replace(ue,o=>t(`<span class="key">${o}</span>`)),i.replace(/ (\d+) /g,(o,s)=>e[Number(s)])};c("tk-code",p(me,(r,e)=>{let t=String(e.code??e.sql??"").replace(/\s+$/,"");if(!t)return;let i=String(e.language??(e.sql?"sql":"")).trim();r.append(n`
    ${e.title&&n`<h2 class="titulo">${e.title}</h2>`}
    <div class="marco">
      <div class="barra">
        <span class="lenguaje">${i||"c\xF3digo"}</span>
        <is-copy-button value="${t}" aria-label="Copiar código"></is-copy-button>
      </div>
      <pre><code>${f(pe(t))}</code></pre>
    </div>
    ${e.caption&&n`<p class="pie">${e.caption}</p>`}
  `)}));var ge=`
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
`;c("tk-url",p(ge,(r,e)=>{let t=String(e.href??e.url??"").trim();/^https?:\/\//i.test(t)&&r.append(n`
    ${e.title&&n`<h2 class="titulo">${e.title}</h2>`}
    <a href="${t}" target="_blank" rel="noopener noreferrer">
      <is-icon icon="mdi:open-in-new" aria-hidden="true"></is-icon>
      <span class="etiqueta">${String(e.label??t)}</span>
    </a>
    ${e.caption&&n`<p class="pie">${e.caption}</p>`}
  `)}));var fe=`
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
`,J=(r,e)=>e?n`<dl class="campo"><dt>${r}</dt><dd>${e}</dd></dl>`:null;c("tk-cambio-bd",p(fe,(r,e)=>{let t=String(e.sql??"").trim(),i=String(e.tabla??"").trim(),o=String(e.registro??"").trim(),s=String(e.intencion??"").trim();if(!t&&!i&&!s)return;let m=t?Object.assign(document.createElement("tk-code"),{payload:{code:t,language:"sql"}}):null;r.append(n`
    <h2 class="titulo">${String(e.title??"Cambio en base de datos")}</h2>
    <div class="marco">
      ${(i||o)&&n`
        <div class="cabecera">
          ${J("Tabla",i)}
          ${J("Registro",o)}
        </div>
      `}
      ${s&&n`<div class="intencion prosa">${f(v(s))}</div>`}
      ${m}
    </div>
  `)}));var he=`
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
  .hallazgos { display: grid; gap: 0.45em; }
  .hallazgo {
    max-width: var(--tk-measure, 68ch);
    color: var(--is-text-soft, #c3ced9);
    font-size: 0.9em;
    line-height: 1.55;

    &.prosa > :last-child { margin-bottom: 0; }
  }
`,be=(r,e)=>{let t=d(r),i=Array.isArray(t.items)?t.items:Array.isArray(t.steps)?t.steps:t.text?[t.text]:[];return{title:String(t.title??t.label??`Fase ${e+1}`),items:i}},ke=r=>r==null?null:typeof r=="string"?n`<div class="hallazgo prosa">${f(v(r))}</div>`:Object.assign(document.createElement("tk-block"),{bloque:r});c("tk-steps",p(he,(r,e)=>{let i=(Array.isArray(e.phases)?e.phases:Array.isArray(e.steps)?e.steps:[]).map(be).filter(o=>o.items.length||o.title);i.length&&r.append(n`
    ${e.title&&n`<h2 class="titulo">${e.title}</h2>`}
    <ol>
      ${i.map(o=>n`
        <li class="fase">
          <h3>${o.title}</h3>
          <div class="hallazgos">${o.items.map(ke)}</div>
        </li>
      `)}
    </ol>
  `)}));var ve=`
  ${u}
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
`,K=r=>({nombre:r,hijos:new Map}),ye=r=>{let e=K("");for(let t of r){let i=e;for(let o of String(t).split("/").filter(Boolean))i.hijos.has(o)||i.hijos.set(o,K(o)),i=i.hijos.get(o)}return e},Z=(r,e)=>{let t=r.hijos.size===0,i=t?String(e[r.nombre]??""):"";return n`
    <is-tree-item ${f(t?"":"expanded")}>
      <is-icon
        slot="icon"
        icon="${t?"mdi:file-document-outline":"mdi:folder-outline"}"
        aria-hidden="true"
      ></is-icon>
      ${r.nombre}
      ${i&&n`<span class="pista">${i}</span>`}
      ${[...r.hijos.values()].map(o=>Z(o,e))}
    </is-tree-item>
  `};c("tk-file-tree",p(ve,(r,e)=>{let t=(Array.isArray(e.paths)?e.paths:[]).map(String).filter(Boolean);if(!t.length)return;let i=d(e.hints),o=[...ye(t).hijos.values()].map(m=>Z(m,i)),s=String(e.rootLabel??"").trim();r.append(n`
    <h2 class="titulo">${String(e.title??"Archivos intervenidos")}</h2>
    <is-tree selection="none">
      ${s?n`
        <is-tree-item expanded>
          <is-icon slot="icon" icon="mdi:source-repository" aria-hidden="true"></is-icon>
          ${s}
          ${o}
        </is-tree-item>
      `:o}
    </is-tree>
  `)}));var $e=`
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
`,xe=r=>r.map((e,t)=>{let i=d(e);return{id:String(i.key??i.id??`h${t}`),label:String(i.label??i.name??`Hito ${t+1}`),date:String(i.iso??i.date??""),hora:String(i.hora??""),desc:String(i.nota??i.description??"")}}).filter(e=>e.label);c("tk-timeline",p($e,(r,e)=>{let t=d(e.timeline??e),i=xe(Array.isArray(t.milestones)?t.milestones:Array.isArray(t.events)?t.events:[]),o=(Array.isArray(t.resumen)?t.resumen:[]).map(d);if(!i.length&&!o.length)return;let s=String(t.title??e.title??""),m=i.filter(a=>a.date&&!Number.isNaN(new Date(a.date).getTime())),l=m.length>=2?n`
      <is-timeline color="inline">
        ${S({timeline:{title:s||void 0,orientation:"vertical",events:m.map(a=>({id:a.id,label:a.label,date:a.date,desc:a.desc}))}})}
      </is-timeline>
    `:n`
      <ul class="hitos">
        ${i.map(a=>n`
          <li class="hito">
            <span class="hora">${a.hora||A(a.date)}</span>
            <span class="etiqueta">${a.label}</span>
            ${a.desc&&n`<span class="nota">${a.desc}</span>`}
          </li>
        `)}
      </ul>
    `;r.append(n`
    ${s&&n`<h2 class="titulo">${s}</h2>`}
    ${o.length>0&&n`
      <div class="resumen">
        ${o.map(a=>n`
          <div class="cifra" ${f(a.highlight===!0?"data-hl":"")}>
            <span class="cifra-rotulo">${String(a.label??"")}</span>
            <span class="cifra-valor">${String(a.value??"\u2014")}</span>
          </div>
        `)}
      </div>
    `}
    ${i.length>0&&l}
  `)}));var we=`
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
`;c("tk-sequence",p(we,(r,e)=>{let t=d(e.sequence),i=Array.isArray(t.messages)?t.messages:[],o=String(e.preset??t.preset??"");if(!i.length&&!o)return;let s=String(e.subtitle??"");r.append(n`
    ${e.title&&n`<h2 class="titulo">${e.title}</h2>`}
    ${s&&n`<p class="subtitulo">${s}</p>`}
    <div class="marco">
      <is-sequence-diagram color="inline">
        ${S(o&&!i.length?{preset:o}:{sequence:t})}
      </is-sequence-diagram>
    </div>
    ${e.caption&&n`<p class="pie">${e.caption}</p>`}
  `)}));var Se=`
  ${u}
  ${k}
  is-stepper { display: block; }
  .desc {
    color: var(--is-text-soft, #c3ced9);
    font-size: 0.875em;
  }
`;c("tk-stepper",p(Se,(r,e)=>{let t=d(e.stepper??e),i=(Array.isArray(t.steps)?t.steps:[]).map(d);i.length&&r.append(n`
    ${e.title&&n`<h2 class="titulo">${e.title}</h2>`}
    <!-- active = total: el procedimiento está documentado, ningún paso queda pendiente. -->
    <is-stepper orientation="vertical" active="${i.length}">
      ${i.map(o=>{let s=String(o.description??o.desc??"").trim();return n`
          <is-stepper-step
            label="${String(o.label??o.title??"")}"
            icon="${String(o.icon??"mdi:checkbox-marked-circle-outline")}"
          >
            ${s&&n`<div slot="description" class="desc prosa">${f(v(s))}</div>`}
          </is-stepper-step>
        `})}
    </is-stepper>
    ${e.caption&&n`<p class="pie">${e.caption}</p>`}
  `)}));var Ce=`
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
`;c("tk-chart",p(Ce,(r,e)=>{let t=d(e.chart??e),i=d(t.data);if(!(Array.isArray(i.datasets)?i.datasets:[]).length)return;let s=d(d(t.options).plugins),m=String(e.title??d(s.title).text??""),l=String(d(s.subtitle).text??""),a={...t,options:{...d(t.options),plugins:{...s,title:{display:!1},subtitle:{display:!1}}}};r.append(n`
    ${m&&n`<h2 class="titulo">${m}</h2>`}
    ${l&&n`<p class="subtitulo">${l}</p>`}
    <div class="marco">
      <is-chart type="${String(t.type??"bar")}">
        ${S(a)}
      </is-chart>
    </div>
    ${e.caption&&n`<p class="pie">${e.caption}</p>`}
  `)}));var Te=`
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
`,Ae="https://mermaid.ink/svg/",Ee=()=>document.documentElement.dataset.theme!=="light";c("tk-diagram",p(Te,(r,e)=>{let t=Ee(),i=String(t&&e.sourceDark||e.source||"").trim();if(!i)return;let o=String(e.engine??"mermaid").toLowerCase(),s=/^\s*%%\{/.test(i)?i:`%%{init: {"theme": "${t?"dark":"default"}"}}%%
${i}`,m=l=>{l.target.replaceWith(n`
      <p class="fallo">El servicio de diagramas no respondió. La fuente está abajo.</p>
    `),r.querySelector("is-details")?.setAttribute("open","")};r.append(n`
    ${e.title&&n`<h2 class="titulo">${e.title}</h2>`}
    <div class="marco">
      ${o==="mermaid"?n`
        <img
          src="${Ae+C.encode(s)}"
          alt="${String(e.alt??e.caption??"Diagrama del tiquete")}"
          loading="lazy"
          decoding="async"
          onerror=${m}
        >
      `:n`
        <p class="fallo">Motor de diagrama no soportado: ${o}.</p>
      `}
    </div>
    ${e.caption&&n`<p class="pie">${e.caption}</p>`}
    <is-details summary="Fuente ${o}" variant="filled-outlined">
      <pre><code>${i}</code></pre>
    </is-details>
  `)}));var ze=`
  :host { display: block; }
  :host([oculto]) { display: none; }
  is-callout { font-size: 0.8125rem; }
  code {
    font-family: var(--is-font-mono, ui-monospace, Menlo, monospace);
    color: var(--tk-code-text, #a8d5ff);
  }
`,qe={markdown:"tk-markdown",md:"tk-markdown",text:"tk-markdown",html:"tk-html",badge:"tk-badges",badges:"tk-badges",table:"tk-table",image:"tk-image","image-group":"tk-image",steps:"tk-steps",timeline:"tk-timeline","metrics-timeline":"tk-timeline","file-tree":"tk-file-tree",code:"tk-code",sql:"tk-code",sequence:"tk-sequence","mui-stepper":"tk-stepper",stepper:"tk-stepper",url:"tk-url",link:"tk-url","cambio-bd":"tk-cambio-bd",chart:"tk-chart",diagram:"tk-diagram"},je=r=>{let e=d(r.payload);if(Array.isArray(r.blocks)&&r.blocks.length)return!0;for(let t of["text","body","html","code","sql","url","src","href","label","source"])if(String(e[t]??"").trim())return!0;for(let t of["rows","items","badges","paths","phases","steps"])if(Array.isArray(e[t])&&e[t].length)return!0;for(let t of["timeline","sequence","stepper","chart"])if(Object.keys(d(e[t])).length)return!0;return!1},M=class extends HTMLElement{#t={};#e;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),$(this.#e,ze)}connectedCallback(){this.#r()}get bloque(){return this.#t}set bloque(e){this.#t=e??{},this.isConnected&&this.#r()}get docLane(){return d(this.#t.payload).docLane??"otros"}#r(){for(;this.#e.firstChild;)this.#e.removeChild(this.#e.firstChild);let e=this.#t,t=String(e.kind??"").toLowerCase();if(!je(e)){this.setAttribute("oculto","");return}this.removeAttribute("oculto");let i=qe[t];if(!i){this.#e.append(n`
        <is-callout color="warning" icon="mdi:puzzle-outline">
          Bloque <code>${t||"sin tipo"}</code> sin representación en este visor.
        </is-callout>
      `);return}let o=document.createElement(i);Array.isArray(e.blocks)&&e.blocks.length&&(o.bloques=e.blocks),o.payload=d(e.payload),this.#e.append(o)}};c("tk-block",M);var Le=`
  ${u}
  ${k}
  .cima {
    display: flex;
    flex-wrap: wrap;
    gap: 0.85rem 1.25rem;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1.15rem;
  }
  .identidad { flex: 1 1 18rem; min-width: 0; }
  .acciones {
    display: flex;
    flex: none;
    gap: 0.4rem;
    align-items: center;
    padding-top: 0.1rem;
  }
  .codigo {
    display: flex;
    align-items: center;
    gap: 0.55em;
    margin: 0 0 0.4em;
    color: var(--is-text-muted, #9aa7b4);
    font-family: var(--is-font-mono, ui-monospace, Menlo, monospace);
    font-size: 0.8125rem;
    letter-spacing: 0.04em;
  }
  .punto {
    width: 0.5em;
    height: 0.5em;
    border-radius: 50%;
    background: var(--punto);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--punto) 22%, transparent);
  }
  h1 {
    margin: 0 0 0.7rem;
    max-width: 28em;
    font-size: clamp(1.4rem, 1.05rem + 1.4vw, 2rem);
    font-weight: 660;
    letter-spacing: -0.024em;
    line-height: 1.18;
    text-wrap: balance;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4em;
    margin: 0;
    font-size: 0.8125rem;
  }
  .cifras {
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem;
    margin: 0 0 1.15rem;
  }
  .cifra {
    display: grid;
    gap: 0.35rem;
    flex: 1 1 11rem;
    max-width: 16.5rem;
    padding: 0.7rem 0.85rem;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: color-mix(in srgb, var(--is-bg-soft, #14181d) 88%, transparent);
  }
  .cifra-rotulo {
    display: flex;
    align-items: center;
    gap: 0.4em;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;

    is-icon { font-size: 0.95em; opacity: 0.9; }
  }
  .cifra-valor {
    font-size: 0.975rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    line-height: 1.35;
    font-variant-numeric: tabular-nums;
  }
  .resumen {
    max-width: var(--tk-measure, 68ch);
    color: var(--is-text-soft, #c3ced9);
    font-size: 1rem;
    line-height: 1.7;
  }
`,Me={success:"var(--is-color-success-500, #2f9e44)",warning:"var(--is-color-warning-500, #f08c00)",info:"var(--is-accent, #1a6eb0)",neutral:"var(--is-text-muted, #9aa7b4)"},N=(r,e,t)=>r?n`
    <is-tag color="${e}" variant="filled-outlined" pill>
      <is-icon slot="start" icon="${t}" aria-hidden="true"></is-icon>
      ${r}
    </is-tag>
  `:null,q=(r,e,t)=>e?n`
    <div class="cifra">
      <span class="cifra-rotulo">
        <is-icon icon="${t}" aria-hidden="true"></is-icon>
        ${r}
      </span>
      <span class="cifra-valor">${e}</span>
    </div>
  `:null,R=class extends HTMLElement{#t=null;#e=null;#r;constructor(){super(),this.#r=this.attachShadow({mode:"open"}),$(this.#r,Le)}connectedCallback(){this.#o()}get ticket(){return this.#t}set ticket(e){this.#t=e,this.isConnected&&this.#o()}get acciones(){return this.#e}set acciones(e){this.#e=e,this.isConnected&&this.#o()}#o(){for(;this.#r.firstChild;)this.#r.removeChild(this.#r.firstChild);let e=this.#t;if(!e)return;let t=I(e.estado),i=String(e.resumen??"").trim(),o=e.rootCommits?.length??0;this.#r.append(n`
      <div class="cima">
        <div class="identidad">
          <p class="codigo">
            <span class="punto" style="--punto: ${Me[t]}" aria-hidden="true"></span>
            ${e.iticket}
          </p>
          <h1>${String(e.titulo??e.iticket)}</h1>
          <div class="chips">
            ${N(String(e.estado??""),t,"mdi:circle-slice-8")}
            ${N(e.space==="patyia"?"PatyIA":"Clientes","brand","mdi:folder-outline")}
            ${N(String(e.solicitante??""),"neutral","mdi:account-outline")}
          </div>
        </div>
        ${this.#e&&n`<div class="acciones">${this.#e}</div>`}
      </div>
      <div class="cifras">
        ${q("Solicitado",A(e.fechaSolicitud,!0),"mdi:calendar-arrow-right")}
        ${q("Entregado",A(e.fechaEntrega,!0),"mdi:calendar-check")}
        ${q("Tiempo total",U(e.tiempoTotalMinutos??e.diligenciaMinutos),"mdi:timer-outline")}
        ${q("Commits",o?String(o):"","mdi:source-commit")}
      </div>
      ${i&&n`<div class="resumen prosa">${f(v(i))}</div>`}
    `)}};c("tk-ticket-head",R);var dt=new URL(".",document.baseURI).href,G=()=>{let e=new URLSearchParams(location.search).get("s");if(!e)return{};try{return JSON.parse(C.decode(e))}catch{return{}}},Ne=(r,e=!1)=>{let t={...G(),...r},i=Object.fromEntries(Object.entries(t).filter(([,s])=>s!=null&&s!==""&&s!==!1)),o=new URL(location.href);return Object.keys(i).length?o.searchParams.set("s",C.encode(JSON.stringify(i))):o.searchParams.delete("s"),history[e?"replaceState":"pushState"]({},"",o),i},Re=r=>{let e=new URL(location.href);return e.searchParams.set("s",C.encode(JSON.stringify(r))),e.href},X={leer:G,escribir:Ne,enlace:Re},E=(r,e="brand")=>{let t=document.querySelector("is-toast");if(t?.create){t.create(r,{color:e,duration:e==="warning"||e==="danger"?8e3:4e3});return}e==="danger"||e==="warning"?console.warn(`[tk] ${r}`):console.info(`[tk] ${r}`)};var B="https://cdn.jsdelivr.net/gh/Jeff-Aporta/is-webcomponents@1c0e451393a412c2c5a41d1d4d4a2e62aa662bda/dist/cdn",Be="Jeff-Aporta/jagudeloe-tks-front",He="main",V=`https://cdn.jsdelivr.net/gh/${Be}@${He}/dist/cdn`,Q=r=>r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),Oe=r=>{let e=`${r.iticket} \xB7 ${r.titulo??"Tiquete"}`,t=JSON.stringify(r).replace(/<\/(script)/gi,"<\\/$1");return`<!doctype html>
<html lang="es" class="theme-dark" data-theme="dark" data-palette="contapyme">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="generator" content="jagudeloe \xB7 visor de tiquetes">
<title>${Q(e)}</title>

<!-- Kit is-* (versi\xF3n fijada) -->
<link rel="stylesheet" href="${B}/is-base.min.css">
<link rel="stylesheet" href="${B}/palettes.min.css">
<script type="module" src="${B}/all.min.js"><\/script>

<!-- Componentes tk-* (bundle \xFAnico, CDN de este repo) -->
<script type="module" src="${V}/tk.all.js"><\/script>

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
    <span><strong>${Q(r.iticket)}</strong> \xB7 documentaci\xF3n descargada</span>
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
`},H={cdn:V,async html(r){return Oe(r)},async descargar(r){let e=await H.html(r),t=new Blob([e],{type:"text/html;charset=utf-8"}),i=URL.createObjectURL(t),o=document.createElement("a");o.href=i,o.download=`${r.iticket}.html`,document.body.append(o),o.click(),o.remove(),setTimeout(()=>URL.revokeObjectURL(i),3e4)}};var De=`
  :host {
    display: flex;
    flex: none;
    gap: 0.4rem;
    align-items: center;
    font-family: var(--is-font-sans, system-ui, sans-serif);
  }
`,O=class extends HTMLElement{#t=null;#e;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),$(this.#e,De)}connectedCallback(){this.#i()}get ticket(){return this.#t}set ticket(e){this.#t=e,this.isConnected&&this.#i()}async#r(){let e=this.#t;if(!e)return;let t=X.enlace({space:e.space,tk:e.iticket,full:!0}),i=navigator;if(i.share)try{await i.share({title:`${e.iticket} \xB7 ${e.titulo??""}`.trim(),url:t});return}catch{}try{await navigator.clipboard.writeText(t),E("Enlace copiado al portapapeles.","success")}catch{E("No se pudo copiar el enlace. C\xF3pialo de la barra de direcciones.","warning")}}async#o(e){let t=this.#t;if(t){e.setAttribute("loading","");try{await H.descargar(t),E(`${t.iticket}.html descargado.`,"success")}catch(i){E(`No se pudo generar el HTML: ${i instanceof Error?i.message:i}`,"danger")}finally{e.removeAttribute("loading")}}}#i(){for(;this.#e.firstChild;)this.#e.removeChild(this.#e.firstChild);this.#t&&this.#e.append(n`
      <is-button variant="outlined" onclick=${()=>{this.#r()}}>
        <is-icon slot="start" icon="mdi:share-variant-outline" aria-hidden="true"></is-icon>
        Compartir
      </is-button>
      <is-button
        variant="filled"
        onclick=${e=>{this.#o(e.currentTarget)}}
      >
        <is-icon slot="start" icon="mdi:download-outline" aria-hidden="true"></is-icon>
        Descargar
      </is-button>
    `)}};c("tk-actions",O);var Pe=`
  :host {
    display: block;
    container-type: inline-size;
    --tk-measure: 68ch;
    color: var(--is-text, #e6edf3);
    font-family: var(--is-font-sans, system-ui, -apple-system, "Segoe UI", sans-serif);
  }
  .documento {
    display: grid;
    gap: 2rem;
    max-width: 54rem;
    margin: 0 auto;
    padding: clamp(1.15rem, 0.55rem + 1.8vw, 2.25rem) clamp(1rem, 0.5rem + 1.6vw, 2rem);
  }
  .encabezado { min-width: 0; }
  section {
    display: grid;
    gap: 1rem;
    padding-top: 0.15rem;
  }
  .rotulo {
    display: flex;
    align-items: center;
    gap: 0.75em;
    margin: 0 0 0.15rem;
    color: var(--is-text-soft, #c3ced9);
    font-size: 0.72rem;
    font-weight: 650;
    letter-spacing: 0.11em;
    text-transform: uppercase;
  }
  .rotulo::after {
    height: 1px;
    flex: 1;
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
  }
`,Fe=[{lane:"solicitud",rotulo:"Solicitud"},{lane:"evidencias",rotulo:"Evidencias"},{lane:"causa",rotulo:"Causa"},{lane:"solucion",rotulo:"Soluci\xF3n"},{lane:"verificacion",rotulo:"Verificaci\xF3n"},{lane:"otros",rotulo:"Detalle"}],Ue=r=>{let e=Array.isArray(r.content)&&r.content.length?[...r.content]:[...r.doc?.blocks??[]],t=(r.contexts??[]).flatMap(i=>[...i.content??[]]);return[...e,...t].filter(i=>i&&typeof i=="object").sort((i,o)=>(i.sortKey??0)-(o.sortKey??0))},_e=r=>d(r.payload).docLane??"otros",D=class extends HTMLElement{static get observedAttributes(){return["embebido"]}#t=null;#e;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),$(this.#e,Pe)}connectedCallback(){this.#r()}attributeChangedCallback(){this.isConnected&&this.#r()}get ticket(){return this.#t}set ticket(e){this.#t=e,this.isConnected&&this.#r()}set json(e){let t=d(e);this.ticket=t.ticket?t.ticket:t}get embebido(){return this.hasAttribute("embebido")}set embebido(e){this.toggleAttribute("embebido",!!e)}#r(){for(;this.#e.firstChild;)this.#e.removeChild(this.#e.firstChild);let e=this.#t;if(!e?.iticket){this.#e.append(n`
        <div class="vacio">
          <is-icon icon="mdi:file-document-outline" style="font-size:2rem" aria-hidden="true"></is-icon>
          <p>Selecciona un tiquete para ver su documentación.</p>
        </div>
      `);return}let t=Ue(e),i=this.embebido?null:Object.assign(document.createElement("tk-actions"),{ticket:e}),o=Object.assign(document.createElement("tk-ticket-head"),{ticket:e,acciones:i}),s=Fe.map(({lane:m,rotulo:l})=>{let a=t.filter(b=>_e(b)===m);return a.length?n`
        <section aria-label="${l}">
          <h2 class="rotulo">${l}</h2>
          ${a.map(b=>Object.assign(document.createElement("tk-block"),{bloque:b}))}
        </section>
      `:null}).filter(Boolean);this.#e.append(n`
      <article class="documento">
        <header class="encabezado">${o}</header>
        ${s.length>0?s:n`
          <is-callout color="neutral" icon="mdi:text-box-remove-outline">
            Este tiquete todavía no tiene documentación publicada.
          </is-callout>
        `}
        <footer class="firma">
          ${e.iticket} · ${e.space==="patyia"?"PatyIA":"Clientes"} ·
          documentación generada desde jagudeloe-tks
        </footer>
      </article>
    `)}};c("tk-view",D);
