import{css as s,define as r,html as o}from"./_shared.js";import{aviso as a,estado as n}from"./estado.js";import{exportar as c}from"./export.js";const l=`
  :host {
    display: flex;
    flex: none;
    gap: 0.4rem;
    align-items: center;
    font-family: var(--is-font-sans, system-ui, sans-serif);
  }
`;class d extends HTMLElement{#i=null;#t;constructor(){super(),this.#t=this.attachShadow({mode:"open"}),s(this.#t,l)}connectedCallback(){this.#e()}get ticket(){return this.#i}set ticket(t){this.#i=t,this.isConnected&&this.#e()}async#a(){const t=this.#i;if(!t)return;const i=n.enlace({space:t.space,tk:t.iticket,full:!0}),e=navigator;if(e.share)try{await e.share({title:`${t.iticket} \xB7 ${t.titulo??""}`.trim(),url:i});return}catch{}try{await navigator.clipboard.writeText(i),a("Enlace copiado al portapapeles.","success")}catch{a("No se pudo copiar el enlace. C\xF3pialo de la barra de direcciones.","warning")}}async#s(t){const i=this.#i;if(i){t.setAttribute("loading","");try{await c.descargar(i),a(`${i.iticket}.html descargado.`,"success")}catch(e){a(`No se pudo generar el HTML: ${e instanceof Error?e.message:e}`,"danger")}finally{t.removeAttribute("loading")}}}#e(){for(;this.#t.firstChild;)this.#t.removeChild(this.#t.firstChild);this.#i&&this.#t.append(o`
      <is-button variant="outlined" onclick=${()=>{this.#a()}}>
        <is-icon slot="start" icon="mdi:share-variant-outline" aria-hidden="true"></is-icon>
        Compartir
      </is-button>
      <is-button
        variant="filled"
        onclick=${t=>{this.#s(t.currentTarget)}}
      >
        <is-icon slot="start" icon="mdi:download-outline" aria-hidden="true"></is-icon>
        Descargar
      </is-button>
    `)}}r("tk-actions",d);
