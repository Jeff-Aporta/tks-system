import{blockCss as d,crearBloque as m,define as h,html as n,proseCss as f,raw as b}from"./_shared.js";const u=`
  ${d}
  ${f}
  .prosa img { max-width: 100%; height: auto; border-radius: var(--tk-radius, 0.625rem); }
  .prosa table { display: table; width: 100%; max-width: 100%; overflow-x: auto; }
  /* Redacci\xF3n del ticket: hereda --is-text del tema; ignora grises inline InSoft. */
  .prosa,
  .prosa :is(p, li, span, div, strong, em, h1, h2, h3, h4, h5, h6, td, th) {
    color: var(--is-text, #e6edf3);
  }
  .prosa a { color: var(--tk-link, #6fb2e8); }
  .prosa code { color: var(--tk-code-text, #a8d5ff); }
`,p=["script","style","iframe","object","embed","form","link","meta","base"],g=i=>i.replace(/(?:^|;)\s*width\s*:\s*\d{3,4}px\b/gi,";width:100%").replace(/(?:^|;)\s*max-width\s*:\s*\d{3,4}px\b/gi,";max-width:100%").replace(/(?:^|;)\s*min-width\s*:\s*\d{3,4}px\b/gi,";min-width:0").replace(/^;+/,"").trim(),w=i=>i.replace(/(?:^|;)\s*color\s*:\s*(?:#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})\b|rgba?\([^)]*\)|hsla?\([^)]*\)|gray|grey|silver|currentcolor)\s*/gi,";").replace(/;{2,}/g,";").replace(/^;+|;+$/g,"").trim(),v=i=>{const r=new DOMParser().parseFromString(String(i??""),"text/html");r.body.querySelectorAll(p.join(",")).forEach(t=>t.remove());for(const t of r.body.querySelectorAll("*")){for(const s of[...t.attributes]){const l=s.name.toLowerCase(),c=s.value.trim().toLowerCase();(l.startsWith("on")||(l==="href"||l==="src")&&c.startsWith("javascript:"))&&t.removeAttribute(s.name)}t.tagName==="A"&&(t.setAttribute("target","_blank"),t.setAttribute("rel","noopener noreferrer"));const o=t.getAttribute("width");o&&/^\d{3,4}$/.test(o)&&Number(o)>=400&&(t.removeAttribute("width"),t.setAttribute("data-tk-fluid",""));let a=t.getAttribute("style");if(!a)continue;let e=a;/color\s*:/i.test(e)&&(e=w(e)),/\d{3,4}px/.test(e)&&/(?:^|;)\s*(?:max-)?width\s*:/i.test(e)&&(e=g(e)),e?e!==a&&t.setAttribute("style",e):t.removeAttribute("style")}return r.body.innerHTML};h("tk-html",m(u,(i,r)=>{const t=String(r.html??"").trim();!t&&!r.title||i.append(n`
    ${r.title&&n`<h2 class="titulo">${r.title}</h2>`}
    ${t&&n`<div class="prosa">${b(v(t))}</div>`}
  `)}));
