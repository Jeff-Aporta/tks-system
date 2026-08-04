import{css as r,define as o,html as s}from"./_shared.js";import{aviso as a,estado as n}from"./estado.js";import{exportar as c}from"./export.js";const l=`
  :host {
    display: none;
    flex-wrap: nowrap;
    gap: 0.15rem;
    align-items: center;
    flex: none;
    font-family: var(--is-font-sans, system-ui, sans-serif);
  }
  :host([activo]) { display: inline-flex; }
  is-button {
    min-width: 2.25rem;
  }
`;class d extends HTMLElement{#i=null;#t;constructor(){super(),this.#t=this.attachShadow({mode:"open"}),r(this.#t,l)}connectedCallback(){this.#e()}get ticket(){return this.#i}set ticket(t){this.#i=t,this.toggleAttribute("activo",!!t?.iticket),this.isConnected&&this.#e()}async#a(){const t=this.#i;if(!t)return;const i=n.enlace({space:t.space,tk:t.iticket,full:!0}),e=navigator;if(e.share)try{await e.share({title:`${t.iticket} \xB7 ${t.titulo??""}`.trim(),url:i});return}catch{}try{await navigator.clipboard.writeText(i),a("Enlace copiado al portapapeles.","success")}catch{a("No se pudo copiar el enlace. C\xF3pialo de la barra de direcciones.","warning")}}async#r(t){const i=this.#i;if(i){t.setAttribute("loading","");try{await c.descargar(i),a(`${i.iticket}.html descargado.`,"success")}catch(e){a(`No se pudo generar el HTML: ${e instanceof Error?e.message:e}`,"danger")}finally{t.removeAttribute("loading")}}}#e(){for(;this.#t.firstChild;)this.#t.removeChild(this.#t.firstChild);this.#i?.iticket&&this.#t.append(s`
      <is-button
        variant="text"
        color="neutral"
        pill
        type="button"
        aria-label="Compartir tiquete"
        title="Compartir"
        onclick=${()=>{this.#a()}}
      >
        <is-icon icon="mdi:share-variant-outline" aria-hidden="true"></is-icon>
      </is-button>
      <is-button
        variant="text"
        color="neutral"
        pill
        type="button"
        aria-label="Descargar HTML del tiquete"
        title="Descargar"
        onclick=${t=>{this.#r(t.currentTarget)}}
      >
        <is-icon icon="mdi:download-outline" aria-hidden="true"></is-icon>
      </is-button>
    `)}}o("tk-actions",d);
