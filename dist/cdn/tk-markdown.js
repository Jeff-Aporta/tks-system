import{blockCss as s,crearBloque as i,define as l,html as o,md as n,proseCss as a,raw as c}from"./_shared.js";const d=`
  ${s}
  ${a}
`;l("tk-markdown",i(d,(r,t)=>{const e=String(t.text??t.body??t.content??"").trim();!e&&!t.title||r.append(o`
    ${t.title&&o`<h2 class="titulo">${t.title}</h2>`}
    ${e&&o`<div class="prosa">${c(n(e))}</div>`}
  `)}));
