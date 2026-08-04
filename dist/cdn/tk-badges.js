import{blockCss as o,crearBloque as i,define as s,html as l,rec as c,tono as n}from"./_shared.js";const d=`
  ${o}
  .fila {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45em;
    align-items: center;
    font-size: 0.875rem;
  }
`;s("tk-badges",i(d,(a,t)=>{const r=(Array.isArray(t.items)?t.items:Array.isArray(t.badges)?t.badges:t.label?[t]:[]).map(c).map(e=>({texto:String(e.label??e.text??"").trim(),color:n(e.tone??e.color)})).filter(e=>e.texto);r.length&&a.append(l`
    ${t.title&&l`<h2 class="titulo">${t.title}</h2>`}
    <div class="fila">
      ${r.map(e=>l`
        <is-tag color="${e.color}" variant="filled-outlined" pill>${e.texto}</is-tag>
      `)}
    </div>
  `)}));
