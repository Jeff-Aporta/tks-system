import{css as n,define as l,html as a,rec as s}from"./_shared.js";const c=`
  :host { display: block; }
  :host([oculto]) { display: none; }
  is-callout { font-size: 0.8125rem; }
  code {
    font-family: var(--is-font-mono, ui-monospace, Menlo, monospace);
    color: var(--tk-code-text, #a8d5ff);
  }
`,d={markdown:"tk-markdown",md:"tk-markdown",text:"tk-markdown",html:"tk-html",badge:"tk-badges",badges:"tk-badges",table:"tk-table",image:"tk-image","image-group":"tk-image",steps:"tk-steps",timeline:"tk-timeline","metrics-timeline":"tk-timeline","file-tree":"tk-file-tree",code:"tk-code",sql:"tk-code",sequence:"tk-sequence","mui-stepper":"tk-stepper",stepper:"tk-stepper",url:"tk-url",link:"tk-url","cambio-bd":"tk-cambio-bd",chart:"tk-chart",diagram:"tk-diagram"},k=o=>{const e=s(o.payload);if(Array.isArray(o.blocks)&&o.blocks.length)return!0;for(const t of["text","body","html","code","sql","url","src","href","label","source"])if(String(e[t]??"").trim())return!0;for(const t of["rows","items","badges","paths","phases","steps"])if(Array.isArray(e[t])&&e[t].length)return!0;for(const t of["timeline","sequence","stepper","chart"])if(Object.keys(s(e[t])).length)return!0;return!1};class u extends HTMLElement{#t={};#e;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),n(this.#e,c)}connectedCallback(){this.#o()}get bloque(){return this.#t}set bloque(e){this.#t=e??{},this.isConnected&&this.#o()}get docLane(){return s(this.#t.payload).docLane??"otros"}#o(){for(;this.#e.firstChild;)this.#e.removeChild(this.#e.firstChild);const e=this.#t,t=String(e.kind??"").toLowerCase();if(!k(e)){this.setAttribute("oculto","");return}this.removeAttribute("oculto");const i=d[t];if(!i){this.#e.append(a`
        <is-callout color="warning" icon="mdi:puzzle-outline">
          Bloque <code>${t||"sin tipo"}</code> sin representación en este visor.
        </is-callout>
      `);return}const r=document.createElement(i);Array.isArray(e.blocks)&&e.blocks.length&&(r.bloques=e.blocks),r.payload=s(e.payload),this.#e.append(r)}}l("tk-block",u);
