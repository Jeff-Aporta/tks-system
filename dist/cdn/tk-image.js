import{blockCss as c,crearBloque as d,define as m,html as a,rec as u}from"./_shared.js";const h=`
  ${c}
  /* auto-fill + tope fijo (no 1fr): con pocas evidencias las miniaturas
     quedan en celdas ~18rem, no estiradas al ancho del documento. */
  .rejilla {
    display: grid;
    gap: 0.85rem;
    grid-template-columns: repeat(auto-fill, minmax(min(14rem, 100%), 18rem));
    justify-content: start;
    align-items: start;
  }
  figure {
    margin: 0;
    overflow: hidden;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: var(--is-bg-soft, #14181d);
    min-width: 0;
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
      height: var(--tk-image-alto, 10.5rem);
      object-fit: cover;
      object-position: top center;
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
    line-height: 1.45;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .rota {
    padding: 1.2em;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.8125em;
    text-align: center;
  }
`,g=`
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
`,l=e=>{const t=String(e.url??e.src??"").trim();return t?{url:t,alt:String(e.alt??e.caption??e.title??"Evidencia del tiquete"),caption:String(e.caption??"")}:null};class p extends HTMLElement{#t;#e=[];#i=0;#a=t=>{this.hasAttribute("open")&&(t.key==="Escape"?this.cerrar():t.key==="ArrowRight"?this.#r(1):t.key==="ArrowLeft"&&this.#r(-1))};constructor(){super(),this.#t=this.attachShadow({mode:"open"});const t=new CSSStyleSheet;t.replaceSync(g),this.#t.adoptedStyleSheets=[t]}connectedCallback(){document.addEventListener("keydown",this.#a),this.addEventListener("click",t=>{t.target===this&&this.cerrar()})}disconnectedCallback(){document.removeEventListener("keydown",this.#a)}abrir(t,i=0){this.#e=t,this.#i=Math.max(0,Math.min(i,t.length-1)),this.setAttribute("open",""),this.#o(),queueMicrotask(()=>this.#t.querySelector(".cerrar")?.focus())}cerrar(){this.removeAttribute("open")}#r(t){this.#e.length<2||(this.#i=(this.#i+t+this.#e.length)%this.#e.length,this.#o())}#o(){const t=this.#e[this.#i];if(!t)return;const i=this.#e.length>1;for(;this.#t.firstChild;)this.#t.removeChild(this.#t.firstChild);this.#t.append(a`
      <div class="marco" role="dialog" aria-modal="true" aria-label="${t.alt}">
        ${i?a`<span class="contador">${this.#i+1} / ${this.#e.length}</span>`:null}
        <button class="cerrar" type="button" aria-label="Cerrar" onclick=${()=>this.cerrar()}>
          <is-icon icon="mdi:close" aria-hidden="true"></is-icon>
        </button>
        ${i?a`
          <button class="nav prev" type="button" aria-label="Anterior" onclick=${()=>this.#r(-1)}>
            <is-icon icon="mdi:chevron-left" aria-hidden="true"></is-icon>
          </button>
          <button class="nav next" type="button" aria-label="Siguiente" onclick=${()=>this.#r(1)}>
            <is-icon icon="mdi:chevron-right" aria-hidden="true"></is-icon>
          </button>
        `:null}
        <img class="foto" src="${t.url}" alt="${t.alt}">
        ${t.caption||t.alt?a`<p class="leyenda">${t.caption||t.alt}</p>`:null}
      </div>
    `)}}customElements.get("tk-lightbox")||customElements.define("tk-lightbox",p);const b=()=>{let e=document.querySelector("tk-lightbox");return e||(e=document.createElement("tk-lightbox"),document.body.append(e)),e},f=e=>{const t=new Set;return e.filter(i=>{const o=i.url.split("?")[0]??i.url;return t.has(o)?!1:(t.add(o),!0)})},v=(e,t,i)=>{const o=r=>{r.target.removeAttribute("data-cargando")},n=r=>{const s=r.target;(s.closest(".lienzo")??s).replaceWith(a`
      <p class="rota">La evidencia ya no está disponible.</p>
    `)};return a`
    <figure>
      <button
        class="lienzo"
        type="button"
        aria-label="Ampliar: ${e.alt}"
        onclick=${()=>b().abrir(t,i)}
      >
        <img
          src="${e.url}"
          alt="${e.alt}"
          loading="lazy"
          decoding="async"
          data-cargando
          onload=${o}
          onerror=${n}
        >
      </button>
      ${e.caption&&a`<figcaption>${e.caption}</figcaption>`}
    </figure>
  `};m("tk-image",d(h,(e,t,i)=>{const o=i.bloques??[],n=f((o.length?o.map(r=>l(u(r.payload))):[l(t)]).filter(r=>!!r));n.length&&e.append(a`
    ${t.title&&a`<h2 class="titulo">${t.title}</h2>`}
    <div class="rejilla">
      ${n.map((r,s)=>v(r,n,s))}
    </div>
  `)}));
