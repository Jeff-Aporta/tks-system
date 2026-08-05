import{blockCss as p,crearBloque as l,define as a,html as s,md as d,proseCss as m,raw as $,rec as n}from"./_shared.js";const u=`
  ${p}
  ${m}
  is-stepper { display: block; }
  .desc {
    color: var(--is-text, #e6edf3);
    font-size: 0.875em;
  }
`;a("tk-stepper",l(u,(o,e)=>{const r=n(e.stepper??e),i=(Array.isArray(r.steps)?r.steps:[]).map(n);i.length&&o.append(s`
    ${e.title&&s`<h2 class="titulo">${e.title}</h2>`}
    <!-- active = total: el procedimiento está documentado, ningún paso queda pendiente. -->
    <is-stepper orientation="vertical" active="${i.length}">
      ${i.map(t=>{const c=String(t.description??t.desc??"").trim();return s`
          <is-stepper-step
            label="${String(t.label??t.title??"")}"
            icon="${String(t.icon??"mdi:checkbox-marked-circle-outline")}"
          >
            ${c&&s`<div slot="description" class="desc prosa">${$(d(c))}</div>`}
          </is-stepper-step>
        `})}
    </is-stepper>
    ${e.caption&&s`<p class="pie">${e.caption}</p>`}
  `)}));
