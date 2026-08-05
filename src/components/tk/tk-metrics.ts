/**
 * <tk-metrics> — dimensión InSoft del tiquete (tiempo hábil, KPIs, tiempos).
 *
 * Propiedad
 *   ticket  TkTicket
 *
 * Vista hermana de la documentación: no mezcla bloques `content[]`.
 */

import { css, define, fecha, html, minutos, rec } from './_shared.js';
import './tk-tiempos.js';

const CSS = /* css */ `
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
    max-width: 100%;
    margin: 0;
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
`;

type MetricasBag = {
  fechaCreacion?: string;
  horaInicioAtencion?: string;
  fechaCierre?: string;
  notas?: string;
  documentacion?: Record<string, unknown>;
  reporteEmpresa?: Record<string, unknown>;
  metricasHabilesMinutos?: Record<string, unknown>;
};

const bagMetricas = (tk: TkTicket): MetricasBag => {
  const extra = rec(tk.detallesextra);
  const meta = rec(tk.meta);
  const fromExtra = rec(extra.metricas);
  const fromMeta = rec(meta.metricas);
  const merged = { ...fromMeta, ...fromExtra } as MetricasBag;
  const doc = rec(merged.documentacion);
  if (doc.metricasHabilesMinutos && !merged.metricasHabilesMinutos) {
    merged.metricasHabilesMinutos = rec(doc.metricasHabilesMinutos);
  }
  return merged;
};

const num = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : 0;
};

const horasAMin = (h: unknown): number => {
  const n = Number(h);
  return Number.isFinite(n) && n > 0 ? Math.round(n * 60) : 0;
};

const kpiItems = (tk: TkTicket, m: MetricasBag) => {
  const hab = rec(m.metricasHabilesMinutos);
  const doc = rec(m.documentacion);
  const habDoc = rec(doc.metricasHabilesMinutos);
  const hasta =
    num(hab.hastaAtencion ?? habDoc.hastaAtencion)
    || num(tk.diligenciaMinutos);
  const empresa = rec(m.reporteEmpresa);
  const activa =
    num(hab.atencionActiva ?? habDoc.atencionActiva)
    || horasAMin(empresa.horasAtencion);
  const total =
    num(hab.totalSolucion ?? habDoc.totalSolucion ?? tk.tiempoTotalMinutos)
    || horasAMin(empresa.horasSolucion)
    || num(tk.tiempoestimacionminutos)
    || (hasta + activa + num(tk.commitminutos));

  return [
    {
      icon: 'mdi:clock-start',
      label: 'Hasta atención',
      minutos: hasta,
      sub: 'Creación → inicio atención',
    },
    {
      icon: 'mdi:head-cog-outline',
      label: 'Atención activa',
      minutos: activa,
      sub: 'Inicio atención → cierre',
    },
    {
      icon: 'mdi:check-decagram',
      label: 'Total solución hábil',
      minutos: total,
      sub: 'Tiempo real laborado / estimado',
    },
  ] as const;
};

class TkMetrics extends HTMLElement {
  #ticket: TkTicket | null = null;
  #root: ShadowRoot;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
    css(this.#root, CSS);
  }

  connectedCallback(): void { this.#render(); }

  get ticket(): TkTicket | null { return this.#ticket; }
  set ticket(v: TkTicket | null) {
    this.#ticket = v;
    if (this.isConnected) this.#render();
  }

  #render(): void {
    while (this.#root.firstChild) this.#root.removeChild(this.#root.firstChild);
    const tk = this.#ticket;
    if (!tk?.iticket) {
      this.#root.append(html`<p class="vacio">Sin tiquete para métricas.</p>`);
      return;
    }

    const m = bagMetricas(tk);
    const doc = rec(m.documentacion);
    const empresa = rec(m.reporteEmpresa);
    const kpis = kpiItems(tk, m);
    const tiempos = [...(tk.tiempos ?? [])].filter((t) => Number(t.minutos ?? 0) > 0);
    const abierto = !m.fechaCierre && String(doc.cierreEmpresa ?? tk.estado ?? '').toLowerCase().includes('abierto')
      || (!m.fechaCierre && !tk.fechaentrega);

    const tipoApertura = String(
      doc.tiposolicitudapertura
        ?? rec(tk.normativa).tiposolicitudapertura
        ?? rec(tk.normativa).tipoSolicitud
        ?? '',
    ).trim();

    const avisos: DocumentFragment[] = [];
    if (!m.fechaCreacion) {
      avisos.push(html`
        <is-callout color="warning" icon="mdi:calendar-alert">
          Falta fecha de creación InSoft (<code>metricas.fechaCreacion</code>).
        </is-callout>
      `);
    } else if (abierto || !m.fechaCierre) {
      avisos.push(html`
        <is-callout color="info" icon="mdi:information-outline">
          Ticket abierto — sin cierre InSoft. Las métricas de atención activa y total se completan al registrar el cierre.
        </is-callout>
      `);
    }

    const filasDoc = [
      ['Creación', m.fechaCreacion || fecha(tk.fechasolicitud, true) || '—'],
      ['Inicio atención', m.horaInicioAtencion || '—'],
      ['Cierre', m.fechaCierre || fecha(tk.fechaentrega, true) || 'Abierto'],
      ['Tipo apertura', tipoApertura || '—'],
      ['Asignado', String(doc.asignadoA || doc.ingeniero || '—')],
      ['Solicitante', String(doc.solicitante || tk.solicitante || '—')],
      ['Clasificador', String(doc.clasificador || '—')],
      ['Medio', String(doc.medioAtencion || '—')],
    ].filter(([, v]) => String(v).trim() && String(v) !== '—');

    const filasEmpresa = [
      ['Horas atención (empresa)', empresa.horasAtencion != null ? `${empresa.horasAtencion} h` : ''],
      ['Horas solución (empresa)', empresa.horasSolucion != null ? `${empresa.horasSolucion} h` : ''],
      ['Capturado', String(empresa.capturado || '')],
      ['Fuente', String(empresa.fuente || '')],
    ].filter(([, v]) => String(v).trim());

    this.#root.append(html`
      <article class="metrics" aria-label="Métricas InSoft">
        <header>
          <p class="eyebrow">Estudio de métricas · tiempo hábil InSoft</p>
          <h1 class="titulo">${tk.iticket}</h1>
          <p class="sub">${tk.titulo || ''}</p>
          ${tipoApertura ? html`<p class="meta">Tipo solicitud apertura: ${tipoApertura}</p>` : null}
        </header>

        ${avisos.length ? html`<div class="avisos">${avisos}</div>` : null}

        <div class="kpis" role="group" aria-label="Indicadores de tiempo hábil">
          ${kpis.map((k) => html`
            <div class="kpi">
              <div class="kpi-lbl">
                <is-icon icon="${k.icon}" aria-hidden="true"></is-icon>
                <span>${k.label}</span>
              </div>
              <div class="kpi-val">${k.minutos > 0 ? minutos(k.minutos) : '—'}</div>
              <div class="kpi-sub">${k.sub}</div>
            </div>
          `)}
        </div>

        ${filasDoc.length ? html`
          <section class="card" aria-label="Datos InSoft">
            <h2 class="card-h">
              <is-icon icon="mdi:clipboard-text-clock-outline" aria-hidden="true"></is-icon>
              Datos InSoft
            </h2>
            <dl class="filas">
              ${filasDoc.map(([k, v]) => html`
                <div class="fila"><dt>${k}</dt><dd>${v}</dd></div>
              `)}
            </dl>
            ${m.notas ? html`<p class="meta">${m.notas}</p>` : null}
          </section>
        ` : null}

        ${filasEmpresa.length ? html`
          <section class="card" aria-label="Reporte empresa">
            <h2 class="card-h">
              <is-icon icon="mdi:office-building-outline" aria-hidden="true"></is-icon>
              Reporte empresa
            </h2>
            <dl class="filas">
              ${filasEmpresa.map(([k, v]) => html`
                <div class="fila"><dt>${k}</dt><dd>${v}</dd></div>
              `)}
            </dl>
          </section>
        ` : null}

        <section class="card" aria-label="Desglose de tiempos">
          <h2 class="card-h">
            <is-icon icon="mdi:chart-timeline-variant" aria-hidden="true"></is-icon>
            Desglose de tiempos
          </h2>
          ${tiempos.length
            ? Object.assign(document.createElement('tk-tiempos'), { tiempos })
            : html`<p class="vacio">Sin filas de tiempo estimadas en este tiquete.</p>`}
        </section>
      </article>
    `);
  }
}

define('tk-metrics', TkMetrics);
