/**
 * <tk-tiempos> — métricas InSoft de tiempos del tiquete (`tiempos` del JSON).
 *
 * Propiedad
 *   tiempos  readonly TkTiempo[]
 *
 * Barras por fase (investigación / commits / diligencia / otro) + total,
 * alineado al análisis de métricas del front React.
 */

import { css, define, html } from './_shared.js';

const CSS = /* css */ `
  :host {
    display: block;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    font-family: var(--is-font-sans, system-ui, sans-serif);
  }
  .panel {
    overflow: hidden;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: color-mix(in srgb, var(--is-bg-soft, #14181d) 92%, transparent);
  }
  .fila {
    display: grid;
    gap: 0.55rem;
    padding: 0.85rem 1rem;
    border-bottom: 1px solid var(--is-border-soft, #1f242b);
  }
  .fila:last-of-type { border-bottom: 0; }
  .cima {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem 0.75rem;
    align-items: flex-start;
    justify-content: space-between;
  }
  .nombre {
    font-size: 0.9rem;
    font-weight: 620;
    line-height: 1.4;
  }
  .detail {
    margin: 0.2rem 0 0;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.78rem;
    line-height: 1.45;
  }
  .mins {
    flex: none;
    color: var(--is-text-soft, #c3ced9);
    font-size: 0.8125rem;
    font-weight: 650;
    font-variant-numeric: tabular-nums;
  }
  .fase {
    display: inline-flex;
    align-items: center;
    padding: 0.12em 0.55em;
    border: 1px solid var(--fase-border);
    border-radius: 999px;
    background: var(--fase-bg);
    color: var(--fase-fg);
    font-size: 0.6875rem;
    font-weight: 650;
    letter-spacing: 0.02em;
  }
  .barra {
    height: 0.35rem;
    overflow: hidden;
    border-radius: 999px;
    background: color-mix(in srgb, var(--is-border-soft, #1f242b) 80%, transparent);
  }
  .relleno {
    height: 100%;
    border-radius: inherit;
    background: var(--fase-bar);
    max-width: 100%;
  }
  .total {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
    justify-content: space-between;
    padding: 0.85rem 1rem;
    border-top: 1px solid var(--is-border, #2a3038);
    background: color-mix(in srgb, var(--is-accent, #1a6eb0) 10%, var(--is-bg-soft, #14181d));
  }
  .total-lbl {
    font-size: 0.875rem;
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  .total-chip {
    display: inline-flex;
    align-items: center;
    padding: 0.35em 0.85em;
    border-radius: 999px;
    background: var(--is-accent, #1a6eb0);
    color: #fff;
    font-size: 0.875rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    box-shadow: 0 2px 10px color-mix(in srgb, var(--is-accent, #1a6eb0) 40%, transparent);
  }
  .linea {
    display: grid;
    gap: 0;
    margin: 0 0 0.85rem;
    padding: 0.35rem 0 0.15rem;
  }
  .pista {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.65rem;
    align-items: stretch;
  }
  .eje {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 1rem;
  }
  .punto {
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 50%;
    background: var(--fase-bar);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--fase-bar) 28%, transparent);
  }
  .trazo {
    flex: 1;
    width: 2px;
    min-height: 0.75rem;
    margin: 0.2rem 0;
    background: linear-gradient(to bottom, var(--fase-bar), var(--is-border-soft, #1f242b));
    opacity: 0.55;
  }
  .pista:last-child .trazo { display: none; }
  .carta {
    min-width: 0;
    padding: 0.35rem 0 0.85rem;
  }
`;

type Fase = 'investigacion' | 'commits' | 'diligencia' | 'otro';

const FASE: Readonly<Record<Fase, { label: string; bar: string; bg: string; fg: string; border: string }>> = {
  investigacion: {
    label: 'Investigación y testing',
    bar: 'linear-gradient(90deg, #7c3aed, #8b5cf6)',
    bg: 'rgba(124,58,237,0.14)',
    fg: '#c4b5fd',
    border: 'rgba(167,139,250,0.45)',
  },
  commits: {
    label: 'Commits',
    bar: 'linear-gradient(90deg, #06b6d4, #6366f1)',
    bg: 'rgba(6,182,212,0.14)',
    fg: '#a5f3fc',
    border: 'rgba(34,211,238,0.45)',
  },
  diligencia: {
    label: 'Diligencia',
    bar: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
    bg: 'rgba(245,158,11,0.14)',
    fg: '#fde68a',
    border: 'rgba(251,191,36,0.45)',
  },
  otro: {
    label: 'Otro',
    bar: 'linear-gradient(90deg, #059669, #10b981)',
    bg: 'rgba(16,185,129,0.12)',
    fg: '#a7f3d0',
    border: 'rgba(52,211,153,0.4)',
  },
};

const round5 = (raw: unknown): number => {
  const v = Math.round(Number(raw ?? 0));
  if (v <= 0) return 0;
  return Math.round(v / 5) * 5;
};

const clasificar = (item: TkTiempo): Fase => {
  const explicit = String((item as { phase?: string }).phase ?? '').trim().toLowerCase() as Fase;
  if (explicit && FASE[explicit]) return explicit;
  const text = `${item.name ?? ''} ${item.detail ?? ''}`.toLowerCase();
  if (/^diligencia\b|\bdiligencia del\b|evidencias \+|documentaci[oó]n tk/i.test(text)) return 'diligencia';
  if (/investigaci|testing\b|\bpruebas\b|verificaci|reproducci|matriz de prueba|diagn[oó]stico/i.test(text)) {
    return 'investigacion';
  }
  if (/commit|repositorio|codigo|c[oó]digo|servidor|front|desarrollo|entrega|bd\b|fix\b|feat\b/i.test(text)) {
    return 'commits';
  }
  return 'otro';
};

class TkTiempos extends HTMLElement {
  #tiempos: readonly TkTiempo[] = [];
  #root: ShadowRoot;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
    css(this.#root, CSS);
  }

  connectedCallback(): void { this.#render(); }

  get tiempos(): readonly TkTiempo[] { return this.#tiempos; }
  set tiempos(v: readonly TkTiempo[] | null | undefined) {
    this.#tiempos = Array.isArray(v) ? v : [];
    if (this.isConnected) this.#render();
  }

  #render(): void {
    while (this.#root.firstChild) this.#root.removeChild(this.#root.firstChild);
    const rows = this.#tiempos
      .map((t) => ({ ...t, minutos: round5(t.minutos) }))
      .filter((t) => t.minutos > 0 && String(t.name ?? '').trim());
    if (!rows.length) return;

    const total = rows.reduce((s, t) => s + t.minutos, 0) || 1;

    this.#root.append(html`
      <div class="linea" aria-label="Línea de tiempo de métricas">
        ${rows.map((t) => {
          const fase = clasificar(t);
          const meta = FASE[fase];
          return html`
            <div
              class="pista"
              style="${`--fase-bar:${meta.bar}`}"
            >
              <div class="eje">
                <span class="punto" aria-hidden="true"></span>
                <span class="trazo" aria-hidden="true"></span>
              </div>
              <div class="carta">
                <div class="cima">
                  <div>
                    <div class="nombre">${t.name}</div>
                    ${t.detail ? html`<p class="detail">${t.detail}</p>` : null}
                  </div>
                  <span class="mins">${t.minutos} min</span>
                </div>
              </div>
            </div>
          `;
        })}
      </div>
      <div class="panel" role="region" aria-label="Resumen de tiempos InSoft">
        ${rows.map((t) => {
          const fase = clasificar(t);
          const meta = FASE[fase];
          const pct = Math.min(100, (t.minutos / total) * 100);
          return html`
            <div
              class="fila"
              style="${`--fase-bar:${meta.bar};--fase-bg:${meta.bg};--fase-fg:${meta.fg};--fase-border:${meta.border}`}"
            >
              <div class="cima">
                <div>
                  <div class="cima" style="justify-content:flex-start;margin-bottom:0.25rem">
                    <span class="nombre">${t.name}</span>
                    <span class="fase">${meta.label}</span>
                  </div>
                  ${t.detail ? html`<p class="detail">${t.detail}</p>` : null}
                </div>
                <span class="mins">${t.minutos} min</span>
              </div>
              <div class="barra" aria-hidden="true">
                <div class="relleno" style="width: ${pct.toFixed(1)}%"></div>
              </div>
            </div>
          `;
        })}
        <div class="total">
          <span class="total-lbl">Tiempo invertido por estimación</span>
          <span class="total-chip">${total} min</span>
        </div>
      </div>
    `);
  }
}

define('tk-tiempos', TkTiempos);
