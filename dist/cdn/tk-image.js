import{blockCss as s,crearBloque as c,define as d,html as o,rec as u}from"./_shared.js";const g=`
  ${s}
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
`,n=t=>{const a=String(t.url??t.src??"").trim();return a?{url:a,alt:String(t.alt??t.caption??t.title??"Evidencia del tiquete"),caption:String(t.caption??"")}:null},m=t=>{let a=document.querySelector("is-lightbox[data-tk]");a||(a=document.createElement("is-lightbox"),a.setAttribute("data-tk",""),document.body.append(a)),a.replaceChildren(o`<img src="${t.url}" alt="${t.alt}">`),typeof a.show=="function"?a.show():a.setAttribute("open","")},p=t=>{const a=i=>{const e=i.target;e.removeAttribute("data-cargando"),e.naturalWidth&&e.naturalHeight&&(e.style.aspectRatio=`${e.naturalWidth} / ${e.naturalHeight}`)},r=i=>{const e=i.target;(e.closest(".lienzo")??e).replaceWith(o`
      <p class="rota">La evidencia ya no está disponible.</p>
    `)};return o`
    <figure>
      <button
        class="lienzo"
        type="button"
        aria-label="Ampliar: ${t.alt}"
        onclick=${()=>m(t)}
      >
        <img
          src="${t.url}"
          alt="${t.alt}"
          loading="lazy"
          decoding="async"
          data-cargando
          onload=${a}
          onerror=${r}
        >
      </button>
      ${t.caption&&o`<figcaption>${t.caption}</figcaption>`}
    </figure>
  `};d("tk-image",c(g,(t,a,r)=>{const i=r.bloques??[],e=(i.length?i.map(l=>n(u(l.payload))):[n(a)]).filter(l=>!!l);e.length&&t.append(o`
    ${a.title&&o`<h2 class="titulo">${a.title}</h2>`}
    <div class="${e.length>1?"rejilla":""}">
      ${e.map(p)}
    </div>
  `)}));
