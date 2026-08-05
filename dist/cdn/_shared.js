const b=new Map,y=(o,e)=>{let n=b.get(e);n||(n=new CSSStyleSheet,n.replaceSync(e),b.set(e,n)),o.adoptedStyleSheets=[...o.adoptedStyleSheets,n]},T=`
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
`,A=((o,e={},n=[])=>{const r=document.createElement(o);for(const[i,s]of Object.entries(e))s===!1||s==null||(i==="class"?r.className=String(s):i==="text"?r.textContent=String(s):i==="html"?r.innerHTML=String(s):i.startsWith("on")&&typeof s=="function"?r.addEventListener(i.slice(2),s):r.setAttribute(i,s===!0?"":String(s)));const t=Array.isArray(n)?n:[n];for(const i of t)i!=null&&r.append(typeof i=="string"?document.createTextNode(i):i);return r}),g=Symbol("tk-html-crudo"),E=o=>({[g]:String(o??"")}),k=o=>typeof o=="object"&&o!==null&&g in o,H=(o,...e)=>{const n=[],r=[];let t="";for(let c=0;c<o.length;c++){if(t+=o[c],c>=e.length)continue;const l=e[c];if(l==null||l===!1||l===!0)continue;if(typeof l=="function"&&/\s+on([a-zA-Z][\w-]*)=\s*$/.test(t)){const a=t.match(/\s+on([a-zA-Z][\w-]*)=\s*$/);t=t.slice(0,t.length-a[0].length),t+=` data-tk-ev="${r.length}"`,r.push({evento:a[1].toLowerCase(),fn:l});continue}if(k(l)){t+=l[g];continue}const d=Array.isArray(l)?l:[l];for(const a of d)a==null||a===!1||a===!0||(a instanceof Node?(t+=`<template data-tk-nodo="${n.length}"></template>`,n.push(a)):k(a)?t+=a[g]:t+=h(a))}const i=document.createElement("template");i.innerHTML=t;const s=i.content;for(const c of[...s.querySelectorAll("template[data-tk-nodo]")]){const l=Number(c.dataset.tkNodo);c.replaceWith(n[l]??document.createComment("tk:nodo"))}for(const c of[...s.querySelectorAll("[data-tk-ev]")]){const l=Number(c.dataset.tkEv),u=r[l];u&&c.addEventListener(u.evento,u.fn),c.removeAttribute("data-tk-ev")}return s},L=o=>{const e=document.createElement("script");return e.type="application/json",e.textContent=JSON.stringify(o),e},h=o=>String(o??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"),x=o=>o&&typeof o=="object"&&!Array.isArray(o)?o:{},f=o=>{const e=[];let n=String(o??"").replace(/`([^`]+)`/g,(r,t)=>(e.push(t),` ${e.length-1} `));return n=h(n).replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g,(r,t,i)=>`<a href="${h(i)}" target="_blank" rel="noopener noreferrer">${t}</a>`).replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/(^|[\s(])\*([^*\n]+)\*/g,"$1<em>$2</em>").replace(/~~([^~]+)~~/g,"<del>$1</del>"),n.replace(/ (\d+) /g,(r,t)=>`<code>${h(e[Number(t)])}</code>`)},v=o=>{const e=String(o??"").replace(/\r\n?/g,`
`).split(`
`),n=[],r=[];let t=0;const i=()=>{r.length&&n.push(`<p>${f(r.join(" "))}</p>`),r.length=0};for(;t<e.length;){const s=e[t],c=s.match(/^\s*```(\w+)?\s*$/);if(c){i();const d=[];for(t++;t<e.length&&!/^\s*```\s*$/.test(e[t]);)d.push(e[t++]);t++,n.push(`<pre data-lang="${h(c[1]??"")}"><code>${h(d.join(`
`))}</code></pre>`);continue}if(/^\s*\|/.test(s)&&/^\s*\|[\s:|-]+\|?\s*$/.test(e[t+1]??"")){i();const d=m=>m.trim().replace(/^\||\|$/g,"").split("|").map(w=>f(w.trim())),a=d(s);t+=2;const p=[];for(;t<e.length&&/^\s*\|/.test(e[t]);)p.push(d(e[t++]));n.push(`<table><thead><tr>${a.map(m=>`<th>${m}</th>`).join("")}</tr></thead><tbody>${p.map(m=>`<tr>${m.map(w=>`<td>${w}</td>`).join("")}</tr>`).join("")}</tbody></table>`);continue}const l=s.match(/^(#{1,6})\s+(.*)$/);if(l){i();const d=Math.min(l[1].length+2,6);n.push(`<h${d}>${f(l[2])}</h${d}>`),t++;continue}if(/^\s*(---|___|\*\*\*)\s*$/.test(s)){i(),n.push("<hr>"),t++;continue}if(/^\s*>\s?/.test(s)){i();const d=[];for(;t<e.length&&/^\s*>\s?/.test(e[t]);)d.push(e[t++].replace(/^\s*>\s?/,""));n.push(`<blockquote>${v(d.join(`
`))}</blockquote>`);continue}const u=s.match(/^\s*([-*+]|\d+[.)])\s+/);if(u){i();const d=/\d/.test(u[1]),a=[];for(;t<e.length;){const m=e[t].match(/^\s*([-*+]|\d+[.)])\s+(.*)$/);if(!m){if(a.length&&/^\s{2,}\S/.test(e[t])){a[a.length-1]+=` ${e[t].trim()}`,t++;continue}break}a.push(m[2]),t++}const p=d?"ol":"ul";n.push(`<${p}>${a.map(m=>`<li>${f(m)}</li>`).join("")}</${p}>`);continue}if(!s.trim()){i(),t++;continue}r.push(s.trim()),t++}return i(),n.join(`
`)},j=`
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
`,S=new Intl.DateTimeFormat("es-CO",{day:"2-digit",month:"short",year:"numeric"}),$=new Intl.DateTimeFormat("es-CO",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}),M=(o,e=!1)=>{if(!o)return"";let n=String(o).trim();(n.startsWith('"')&&n.endsWith('"')||n.startsWith("'")&&n.endsWith("'"))&&(n=n.slice(1,-1).trim());const r=new Date(n);return Number.isNaN(r.getTime())?n:(e?$:S).format(r)},N=o=>{const e=Number(o);if(!Number.isFinite(e)||e<=0)return"";const n=Math.floor(e/60),r=Math.round(e%60);return n?r?`${n} h ${r} min`:`${n} h`:`${r} min`},C={primary:"brand",brand:"brand",info:"info",success:"success",ok:"success",warning:"warning",warn:"warning",danger:"danger",error:"danger",violet:"brand",neutral:"neutral",default:"neutral"},z=o=>C[String(o??"").toLowerCase()]??"neutral",R=o=>{const e=String(o??"").toLowerCase();return e.includes("cerrad")||e.includes("solucion")?"success":e.includes("proceso")||e.includes("curso")?"warning":e.includes("abiert")||e.includes("nuevo")?"info":"neutral"},_={encode(o){const e=new TextEncoder().encode(o);let n="";for(const r of e)n+=String.fromCharCode(r);return btoa(n).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")},decode(o){let e=String(o).replace(/-/g,"+").replace(/_/g,"/");for(;e.length%4;)e+="=";const n=atob(e),r=new Uint8Array(n.length);for(let t=0;t<n.length;t++)r[t]=n.charCodeAt(t);return new TextDecoder().decode(r)}},q=(o,e)=>{customElements.get(o)||customElements.define(o,e)},O=(o,e)=>class extends HTMLElement{#t={};#e;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),y(this.#e,o)}connectedCallback(){this.#n()}get payload(){return this.#t}set payload(n){this.#t=x(n),this.isConnected&&this.#n()}#n(){for(;this.#e.firstChild;)this.#e.removeChild(this.#e.firstChild);e(this.#e,this.#t,this)}};export{_ as b64url,T as blockCss,O as crearBloque,y as css,q as define,A as el,h as esc,R as estadoColor,M as fecha,H as html,f as inlineMd,L as jsonScript,v as md,N as minutos,j as proseCss,E as raw,x as rec,z as tono};
