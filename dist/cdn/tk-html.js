import{blockCss as n,crearBloque as l,define as m,html as a,proseCss as c,raw as u}from"./_shared.js";const b=`
  ${n}
  ${c}
  .prosa img { max-width: 100%; height: auto; border-radius: var(--tk-radius, 0.625rem); }
  .prosa table { display: block; overflow-x: auto; }
`,f=["script","style","iframe","object","embed","form","link","meta","base"],d=o=>{const e=new DOMParser().parseFromString(String(o??""),"text/html");e.body.querySelectorAll(f.join(",")).forEach(t=>t.remove());for(const t of e.body.querySelectorAll("*")){for(const r of[...t.attributes]){const s=r.name.toLowerCase(),i=r.value.trim().toLowerCase();(s.startsWith("on")||(s==="href"||s==="src")&&i.startsWith("javascript:"))&&t.removeAttribute(r.name)}t.tagName==="A"&&(t.setAttribute("target","_blank"),t.setAttribute("rel","noopener noreferrer"))}return e.body.innerHTML};m("tk-html",l(b,(o,e)=>{const t=String(e.html??"").trim();!t&&!e.title||o.append(a`
    ${e.title&&a`<h2 class="titulo">${e.title}</h2>`}
    ${t&&a`<div class="prosa">${u(d(t))}</div>`}
  `)}));
