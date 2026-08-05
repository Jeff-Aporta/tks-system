import{css as k,define as w,fecha as b,html as r,minutos as x,rec as a}from"./_shared.js";import"./tk-tiempos.js";const S=`
  :host {
    display: block;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    container-type: inline-size;
    color: var(--is-text, #e6edf3);
    font-family: var(--is-font-sans, system-ui, -apple-system, "Segoe UI", sans-serif);
  }
  .metrics {
    display: grid;
    gap: clamp(1.1rem, 0.8rem + 1.2vw, 1.75rem);
    box-sizing: border-box;
    width: 100%;
    max-width: 52rem;
    margin: 0 auto;
    padding: 0;
  }
  .eyebrow {
    margin: 0;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.72rem;
    font-weight: 650;
    letter-spacing: 0.11em;
    text-transform: uppercase;
  }
  .titulo {
    margin: 0.35rem 0 0;
    font-size: clamp(1.35rem, 1.1rem + 1.2vw, 1.85rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }
  .sub {
    margin: 0.45rem 0 0;
    color: var(--is-text-soft, #c3ced9);
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.45;
  }
  .meta {
    margin: 0.55rem 0 0;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.875rem;
    line-height: 1.45;
  }
  .avisos {
    display: grid;
    gap: 0.65rem;
  }
  .kpis {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0;
    overflow: hidden;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background:
      linear-gradient(
        135deg,
        color-mix(in srgb, var(--is-bg-soft, #14181d) 88%, transparent),
        color-mix(in srgb, var(--is-accent, #1a6eb0) 10%, transparent)
      );
  }
  .kpi {
    display: grid;
    gap: 0.35rem;
    min-width: 0;
    padding: 1rem 1.05rem;
  }
  .kpi + .kpi {
    border-left: 1px solid color-mix(in srgb, var(--is-border, #2a3038) 70%, transparent);
  }
  .kpi-lbl {
    display: flex;
    gap: 0.4rem;
    align-items: center;
    min-width: 0;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.78rem;
    font-weight: 550;
  }
  .kpi-lbl is-icon { flex: none; font-size: 1.05em; }
  .kpi-val {
    font-size: 1.35rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    line-height: 1.15;
  }
  .kpi-sub {
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.75rem;
    line-height: 1.4;
  }
  .card {
    display: grid;
    gap: 0.85rem;
    padding: 1rem 1.1rem;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: color-mix(in srgb, var(--is-bg-soft, #14181d) 92%, transparent);
  }
  .card-h {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin: 0;
    font-size: 0.95rem;
    font-weight: 650;
  }
  .card-h is-icon { color: var(--is-accent, #1a6eb0); }
  .filas {
    display: grid;
    gap: 0.45rem;
  }
  .fila {
    display: grid;
    grid-template-columns: minmax(7rem, 11rem) minmax(0, 1fr);
    gap: 0.65rem 1rem;
    align-items: baseline;
    font-size: 0.875rem;
    line-height: 1.45;
  }
  .fila dt {
    margin: 0;
    color: var(--is-text-muted, #9aa7b4);
    font-weight: 550;
  }
  .fila dd {
    margin: 0;
    min-width: 0;
    overflow-wrap: anywhere;
  }
  .vacio {
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.9rem;
    line-height: 1.5;
  }
  @container (max-width: 40rem) {
    .kpis { grid-template-columns: 1fr; }
    .kpi + .kpi {
      border-left: 0;
      border-top: 1px solid color-mix(in srgb, var(--is-border, #2a3038) 70%, transparent);
    }
    .fila { grid-template-columns: 1fr; gap: 0.15rem; }
  }
`,$=s=>{const i=a(s.detallesextra),e=a(s.meta),o=a(i.metricas),c={...a(e.metricas),...o},l=a(c.documentacion);return l.metricasHabilesMinutos&&!c.metricasHabilesMinutos&&(c.metricasHabilesMinutos=a(l.metricasHabilesMinutos)),c},d=s=>{const i=Number(s);return Number.isFinite(i)&&i>0?Math.round(i):0},v=s=>{const i=Number(s);return Number.isFinite(i)&&i>0?Math.round(i*60):0},M=(s,i)=>{const e=a(i.metricasHabilesMinutos),o=a(i.documentacion),n=a(o.metricasHabilesMinutos),c=d(e.hastaAtencion??n.hastaAtencion)||d(s.diligenciaMinutos),l=a(i.reporteEmpresa),p=d(e.atencionActiva??n.atencionActiva)||v(l.horasAtencion),m=d(e.totalSolucion??n.totalSolucion??s.tiempoTotalMinutos)||v(l.horasSolucion)||d(s.tiempoestimacionminutos)||c+p+d(s.commitminutos);return[{icon:"mdi:clock-start",label:"Hasta atenci\xF3n",minutos:c,sub:"Creaci\xF3n \u2192 inicio atenci\xF3n"},{icon:"mdi:head-cog-outline",label:"Atenci\xF3n activa",minutos:p,sub:"Inicio atenci\xF3n \u2192 cierre"},{icon:"mdi:check-decagram",label:"Total soluci\xF3n h\xE1bil",minutos:m,sub:"Tiempo real laborado / estimado"}]};class C extends HTMLElement{#e=null;#i;constructor(){super(),this.#i=this.attachShadow({mode:"open"}),k(this.#i,S)}connectedCallback(){this.#t()}get ticket(){return this.#e}set ticket(i){this.#e=i,this.isConnected&&this.#t()}#t(){for(;this.#i.firstChild;)this.#i.removeChild(this.#i.firstChild);const i=this.#e;if(!i?.iticket){this.#i.append(r`<p class="vacio">Sin tiquete para métricas.</p>`);return}const e=$(i),o=a(e.documentacion),n=a(e.reporteEmpresa),c=M(i,e),l=[...i.tiempos??[]].filter(t=>Number(t.minutos??0)>0),p=!e.fechaCierre&&String(o.cierreEmpresa??i.estado??"").toLowerCase().includes("abierto")||!e.fechaCierre&&!i.fechaentrega,m=String(o.tiposolicitudapertura??a(i.normativa).tiposolicitudapertura??a(i.normativa).tipoSolicitud??"").trim(),u=[];e.fechaCreacion?(p||!e.fechaCierre)&&u.push(r`
        <is-callout color="info" icon="mdi:information-outline">
          Ticket abierto — sin cierre InSoft. Las métricas de atención activa y total se completan al registrar el cierre.
        </is-callout>
      `):u.push(r`
        <is-callout color="warning" icon="mdi:calendar-alert">
          Falta fecha de creación InSoft (<code>metricas.fechaCreacion</code>).
        </is-callout>
      `);const g=[["Creaci\xF3n",e.fechaCreacion||b(i.fechasolicitud,!0)||"\u2014"],["Inicio atenci\xF3n",e.horaInicioAtencion||"\u2014"],["Cierre",e.fechaCierre||b(i.fechaentrega,!0)||"Abierto"],["Tipo apertura",m||"\u2014"],["Asignado",String(o.asignadoA||o.ingeniero||"\u2014")],["Solicitante",String(o.solicitante||i.solicitante||"\u2014")],["Clasificador",String(o.clasificador||"\u2014")],["Medio",String(o.medioAtencion||"\u2014")]].filter(([,t])=>String(t).trim()&&String(t)!=="\u2014"),f=[["Horas atenci\xF3n (empresa)",n.horasAtencion!=null?`${n.horasAtencion} h`:""],["Horas soluci\xF3n (empresa)",n.horasSolucion!=null?`${n.horasSolucion} h`:""],["Capturado",String(n.capturado||"")],["Fuente",String(n.fuente||"")]].filter(([,t])=>String(t).trim());this.#i.append(r`
      <article class="metrics" aria-label="Métricas InSoft">
        <header>
          <p class="eyebrow">Estudio de métricas · tiempo hábil InSoft</p>
          <h1 class="titulo">${i.iticket}</h1>
          <p class="sub">${i.titulo||""}</p>
          ${m?r`<p class="meta">Tipo solicitud apertura: ${m}</p>`:null}
        </header>

        ${u.length?r`<div class="avisos">${u}</div>`:null}

        <div class="kpis" role="group" aria-label="Indicadores de tiempo hábil">
          ${c.map(t=>r`
            <div class="kpi">
              <div class="kpi-lbl">
                <is-icon icon="${t.icon}" aria-hidden="true"></is-icon>
                <span>${t.label}</span>
              </div>
              <div class="kpi-val">${t.minutos>0?x(t.minutos):"\u2014"}</div>
              <div class="kpi-sub">${t.sub}</div>
            </div>
          `)}
        </div>

        ${g.length?r`
          <section class="card" aria-label="Datos InSoft">
            <h2 class="card-h">
              <is-icon icon="mdi:clipboard-text-clock-outline" aria-hidden="true"></is-icon>
              Datos InSoft
            </h2>
            <dl class="filas">
              ${g.map(([t,h])=>r`
                <div class="fila"><dt>${t}</dt><dd>${h}</dd></div>
              `)}
            </dl>
            ${e.notas?r`<p class="meta">${e.notas}</p>`:null}
          </section>
        `:null}

        ${f.length?r`
          <section class="card" aria-label="Reporte empresa">
            <h2 class="card-h">
              <is-icon icon="mdi:office-building-outline" aria-hidden="true"></is-icon>
              Reporte empresa
            </h2>
            <dl class="filas">
              ${f.map(([t,h])=>r`
                <div class="fila"><dt>${t}</dt><dd>${h}</dd></div>
              `)}
            </dl>
          </section>
        `:null}

        <section class="card" aria-label="Desglose de tiempos">
          <h2 class="card-h">
            <is-icon icon="mdi:chart-timeline-variant" aria-hidden="true"></is-icon>
            Desglose de tiempos
          </h2>
          ${l.length?Object.assign(document.createElement("tk-tiempos"),{tiempos:l}):r`<p class="vacio">Sin filas de tiempo estimadas en este tiquete.</p>`}
        </section>
      </article>
    `)}}w("tk-metrics",C);
