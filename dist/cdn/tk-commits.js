import{css as m,define as c,fecha as h,html as a,rec as l}from"./_shared.js";const u=`
  :host {
    display: block;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    font-family: var(--is-font-sans, system-ui, sans-serif);
  }
  .panel {
    overflow: auto;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: color-mix(in srgb, var(--is-bg-soft, #14181d) 92%, transparent);
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8125rem;
  }
  th, td {
    padding: 0.55rem 0.75rem;
    border-bottom: 1px solid var(--is-border-soft, #1f242b);
    text-align: left;
    vertical-align: top;
  }
  th {
    position: sticky;
    top: 0;
    background: color-mix(in srgb, var(--is-bg-soft, #14181d) 96%, var(--is-accent, #1a6eb0));
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.6875rem;
    font-weight: 650;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    white-space: nowrap;
  }
  th.num, td.num { text-align: right; font-variant-numeric: tabular-nums; }
  tr:last-child td { border-bottom: 0; }
  tr.total td {
    font-weight: 700;
    border-top: 2px solid var(--is-border, #2a3038);
    background: color-mix(in srgb, var(--is-bg-soft, #14181d) 80%, transparent);
  }
  a.hash {
    color: var(--tk-link, #6fb2e8);
    font-family: var(--is-font-mono, ui-monospace, Menlo, monospace);
    text-decoration: none;
  }
  a.hash:hover { text-decoration: underline; }
  .desc {
    display: -webkit-box;
    max-width: 36rem;
    overflow: hidden;
    line-height: 1.45;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow-wrap: anywhere;
  }
  .chip {
    display: inline-block;
    padding: 0.1em 0.45em;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 650;
    font-variant-numeric: tabular-nums;
  }
  .ins {
    color: #34d399;
    background: color-mix(in srgb, #10b981 16%, transparent);
  }
  .del {
    color: #f87171;
    background: color-mix(in srgb, #ef4444 16%, transparent);
  }
  .fecha { color: var(--is-text-muted, #9aa7b4); white-space: nowrap; }
`,p={ISS:"Dev-InSoft/ISS-AyudasCPIA","ISS-AyudasCPIA":"Dev-InSoft/ISS-AyudasCPIA",PatyIA:"Dev-InSoft/ISS-AyudasCPIA","ISA-DOC":"Dev-InSoft/ISA-DOC","isa-patyia":"Jeff-Aporta/isa-patyia",ISA:"Jeff-Aporta/isa-patyia","ISW-ClientesIS":"Dev-InSoft/ISW-ClientesIS","ISP-ClientesIS":"Dev-InSoft/ISP-ClientesIS","ISP-CLientesISServer":"Dev-InSoft/ISP-CLientesISServer","ISS-ClientesIS-ContaPymeU":"Dev-InSoft/ISS-ClientesIS-ContaPymeU","ISP-SvelteComponents":"Dev-InSoft/ISP-SvelteComponents"},f=(o,t)=>{const n=t.trim();if(!n)return"#";const s=o.trim();return`https://github.com/${p[s]??`Dev-InSoft/${s||"repo"}`}/commit/${n}`},b=o=>{const t=l(o.meta),n=String(o.fecha??t.fecha??"");if(!n)return"\u2014";const s=new Date(n);if(Number.isNaN(s.getTime()))return h(n);const r=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];return`${s.getDate()} ${r[s.getMonth()]}`},S=o=>{const t=l(o.meta);return String(t.repo??o.proyecto??"PatyIA")};class g extends HTMLElement{#e=[];#t;constructor(){super(),this.#t=this.attachShadow({mode:"open"}),m(this.#t,u)}connectedCallback(){this.#n()}get commits(){return this.#e}set commits(t){this.#e=Array.isArray(t)?t:[],this.isConnected&&this.#n()}#n(){for(;this.#t.firstChild;)this.#t.removeChild(this.#t.firstChild);const t=this.#e.filter(e=>String(e.hash??"").trim());if(!t.length)return;let n=0,s=0,r=0;for(const e of t)n+=Number(e.insCount??0),s+=Number(e.delCount??0),r+=Number(e.minutos??0);this.#t.append(a`
      <div class="panel" role="region" aria-label="Commits del tiquete">
        <table>
          <thead>
            <tr>
              <th>Commit</th>
              <th>Fecha</th>
              <th>Descripción</th>
              <th class="num">Ins</th>
              <th class="num">Del</th>
              <th class="num">Tiempo</th>
            </tr>
          </thead>
          <tbody>
            ${t.map(e=>{const i=String(e.hash??""),d=f(S(e),i);return a`
                <tr>
                  <td>
                    <a class="hash" href="${d}" target="_blank" rel="noopener noreferrer">
                      ${i.slice(0,9)}
                    </a>
                  </td>
                  <td class="fecha">${b(e)}</td>
                  <td><span class="desc" title="${String(e.descripcion??"")}">${String(e.descripcion??"")}</span></td>
                  <td class="num"><span class="chip ins">+${Number(e.insCount??0)}</span></td>
                  <td class="num"><span class="chip del">−${Number(e.delCount??0)}</span></td>
                  <td class="num">${Number(e.minutos??0)} min</td>
                </tr>
              `})}
            <tr class="total">
              <td></td>
              <td></td>
              <td>${t.length===1?"1 commit":`${t.length} commits`}</td>
              <td class="num"><span class="chip ins">+${n}</span></td>
              <td class="num"><span class="chip del">−${s}</span></td>
              <td class="num">${r} min</td>
            </tr>
          </tbody>
        </table>
      </div>
    `)}}c("tk-commits",g);
