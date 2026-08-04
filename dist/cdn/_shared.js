const k=new Map,x=(o,e)=>{let n=k.get(e);n||(n=new CSSStyleSheet,n.replaceSync(e),k.set(e,n)),o.adoptedStyleSheets=[...o.adoptedStyleSheets,n]},T=`
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
`,A=((o,e={},n=[])=>{const r=document.createElement(o);for(const[s,i]of Object.entries(e))i===!1||i==null||(s==="class"?r.className=String(i):s==="text"?r.textContent=String(i):s==="html"?r.innerHTML=String(i):s.startsWith("on")&&typeof i=="function"?r.addEventListener(s.slice(2),i):r.setAttribute(s,i===!0?"":String(i)));const t=Array.isArray(n)?n:[n];for(const s of t)s!=null&&r.append(typeof s=="string"?document.createTextNode(s):s);return r}),p=Symbol("tk-html-crudo"),E=o=>({[p]:String(o??"")}),w=o=>typeof o=="object"&&o!==null&&p in o,H=(o,...e)=>{const n=[],r=[];let t="";for(let l=0;l<o.length;l++){if(t+=o[l],l>=e.length)continue;const c=e[l];if(c==null||c===!1||c===!0)continue;if(typeof c=="function"&&/\s+on([a-zA-Z][\w-]*)=\s*$/.test(t)){const a=t.match(/\s+on([a-zA-Z][\w-]*)=\s*$/);t=t.slice(0,t.length-a[0].length),t+=` data-tk-ev="${r.length}"`,r.push({evento:a[1].toLowerCase(),fn:c});continue}if(w(c)){t+=c[p];continue}const d=Array.isArray(c)?c:[c];for(const a of d)a==null||a===!1||a===!0||(a instanceof Node?(t+=`<template data-tk-nodo="${n.length}"></template>`,n.push(a)):w(a)?t+=a[p]:t+=g(a))}const s=document.createElement("template");s.innerHTML=t;const i=s.content;for(const l of[...i.querySelectorAll("template[data-tk-nodo]")]){const c=Number(l.dataset.tkNodo);l.replaceWith(n[c]??document.createComment("tk:nodo"))}for(const l of[...i.querySelectorAll("[data-tk-ev]")]){const c=Number(l.dataset.tkEv),m=r[c];m&&l.addEventListener(m.evento,m.fn),l.removeAttribute("data-tk-ev")}return i},L=o=>{const e=document.createElement("script");return e.type="application/json",e.textContent=JSON.stringify(o),e},g=o=>String(o??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"),y=o=>o&&typeof o=="object"&&!Array.isArray(o)?o:{},f=o=>{const e=[];let n=String(o??"").replace(/`([^`]+)`/g,(r,t)=>(e.push(t),` ${e.length-1} `));return n=g(n).replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g,(r,t,s)=>`<a href="${g(s)}" target="_blank" rel="noopener noreferrer">${t}</a>`).replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/(^|[\s(])\*([^*\n]+)\*/g,"$1<em>$2</em>").replace(/~~([^~]+)~~/g,"<del>$1</del>"),n.replace(/ (\d+) /g,(r,t)=>`<code>${g(e[Number(t)])}</code>`)},v=o=>{const e=String(o??"").replace(/\r\n?/g,`
`).split(`
`),n=[],r=[];let t=0;const s=()=>{r.length&&n.push(`<p>${f(r.join(" "))}</p>`),r.length=0};for(;t<e.length;){const i=e[t],l=i.match(/^\s*```(\w+)?\s*$/);if(l){s();const d=[];for(t++;t<e.length&&!/^\s*```\s*$/.test(e[t]);)d.push(e[t++]);t++,n.push(`<pre data-lang="${g(l[1]??"")}"><code>${g(d.join(`
`))}</code></pre>`);continue}if(/^\s*\|/.test(i)&&/^\s*\|[\s:|-]+\|?\s*$/.test(e[t+1]??"")){s();const d=u=>u.trim().replace(/^\||\|$/g,"").split("|").map(b=>f(b.trim())),a=d(i);t+=2;const h=[];for(;t<e.length&&/^\s*\|/.test(e[t]);)h.push(d(e[t++]));n.push(`<table><thead><tr>${a.map(u=>`<th>${u}</th>`).join("")}</tr></thead><tbody>${h.map(u=>`<tr>${u.map(b=>`<td>${b}</td>`).join("")}</tr>`).join("")}</tbody></table>`);continue}const c=i.match(/^(#{1,6})\s+(.*)$/);if(c){s();const d=Math.min(c[1].length+2,6);n.push(`<h${d}>${f(c[2])}</h${d}>`),t++;continue}if(/^\s*(---|___|\*\*\*)\s*$/.test(i)){s(),n.push("<hr>"),t++;continue}if(/^\s*>\s?/.test(i)){s();const d=[];for(;t<e.length&&/^\s*>\s?/.test(e[t]);)d.push(e[t++].replace(/^\s*>\s?/,""));n.push(`<blockquote>${v(d.join(`
`))}</blockquote>`);continue}const m=i.match(/^\s*([-*+]|\d+[.)])\s+/);if(m){s();const d=/\d/.test(m[1]),a=[];for(;t<e.length;){const u=e[t].match(/^\s*([-*+]|\d+[.)])\s+(.*)$/);if(!u){if(a.length&&/^\s{2,}\S/.test(e[t])){a[a.length-1]+=` ${e[t].trim()}`,t++;continue}break}a.push(u[2]),t++}const h=d?"ol":"ul";n.push(`<${h}>${a.map(u=>`<li>${f(u)}</li>`).join("")}</${h}>`);continue}if(!i.trim()){s(),t++;continue}r.push(i.trim()),t++}return s(),n.join(`
`)},N=`
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
`,S=new Intl.DateTimeFormat("es-CO",{day:"2-digit",month:"short",year:"numeric"}),$=new Intl.DateTimeFormat("es-CO",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}),j=(o,e=!1)=>{if(!o)return"";let n=String(o).trim();(n.startsWith('"')&&n.endsWith('"')||n.startsWith("'")&&n.endsWith("'"))&&(n=n.slice(1,-1).trim());const r=new Date(n);return Number.isNaN(r.getTime())?n:(e?$:S).format(r)},M=o=>{const e=Number(o);if(!Number.isFinite(e)||e<=0)return"";const n=Math.floor(e/60),r=Math.round(e%60);return n?r?`${n} h ${r} min`:`${n} h`:`${r} min`},C={primary:"brand",brand:"brand",info:"info",success:"success",ok:"success",warning:"warning",warn:"warning",danger:"danger",error:"danger",violet:"brand",neutral:"neutral",default:"neutral"},R=o=>C[String(o??"").toLowerCase()]??"neutral",z=o=>{const e=String(o??"").toLowerCase();return e.includes("cerrad")||e.includes("solucion")?"success":e.includes("proceso")||e.includes("curso")?"warning":e.includes("abiert")||e.includes("nuevo")?"info":"neutral"},_={encode(o){const e=new TextEncoder().encode(o);let n="";for(const r of e)n+=String.fromCharCode(r);return btoa(n).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")},decode(o){let e=String(o).replace(/-/g,"+").replace(/_/g,"/");for(;e.length%4;)e+="=";const n=atob(e),r=new Uint8Array(n.length);for(let t=0;t<n.length;t++)r[t]=n.charCodeAt(t);return new TextDecoder().decode(r)}},O=(o,e)=>{customElements.get(o)||customElements.define(o,e)},q=(o,e)=>class extends HTMLElement{#t={};#e;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),x(this.#e,o)}connectedCallback(){this.#n()}get payload(){return this.#t}set payload(n){this.#t=y(n),this.isConnected&&this.#n()}#n(){for(;this.#e.firstChild;)this.#e.removeChild(this.#e.firstChild);e(this.#e,this.#t,this)}};export{_ as b64url,T as blockCss,q as crearBloque,x as css,O as define,A as el,g as esc,z as estadoColor,j as fecha,H as html,f as inlineMd,L as jsonScript,v as md,M as minutos,N as proseCss,E as raw,y as rec,R as tono};
