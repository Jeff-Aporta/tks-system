/**
 * <tk-commits> — tabla de commits del tiquete (`rootCommits` del JSON).
 *
 * Propiedad
 *   commits  readonly TkCommit[]
 */

import { css, define, fecha, html, rec } from './_shared.js';

const CSS = /* css */ `
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
`;

const GITHUB: Readonly<Record<string, string>> = {
  ISS: 'Dev-InSoft/ISS-AyudasCPIA',
  'ISS-AyudasCPIA': 'Dev-InSoft/ISS-AyudasCPIA',
  PatyIA: 'Dev-InSoft/ISS-AyudasCPIA',
  'ISA-DOC': 'Dev-InSoft/ISA-DOC',
  'isa-patyia': 'Jeff-Aporta/isa-patyia',
  ISA: 'Jeff-Aporta/isa-patyia',
  'ISW-ClientesIS': 'Dev-InSoft/ISW-ClientesIS',
  'ISP-ClientesIS': 'Dev-InSoft/ISP-ClientesIS',
  'ISP-CLientesISServer': 'Dev-InSoft/ISP-CLientesISServer',
  'ISS-ClientesIS-ContaPymeU': 'Dev-InSoft/ISS-ClientesIS-ContaPymeU',
  'ISP-SvelteComponents': 'Dev-InSoft/ISP-SvelteComponents',
};

const githubUrl = (proyecto: string, hash: string): string => {
  const h = hash.trim();
  if (!h) return '#';
  const key = proyecto.trim();
  const slug = GITHUB[key] ?? `Dev-InSoft/${key || 'repo'}`;
  return `https://github.com/${slug}/commit/${h}`;
};

const commitFecha = (c: TkCommit): string => {
  const meta = rec((c as { meta?: unknown }).meta);
  const raw = String(c.fecha ?? meta.fecha ?? '');
  if (!raw) return '—';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return fecha(raw);
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${d.getDate()} ${meses[d.getMonth()]}`;
};

const proyectoDe = (c: TkCommit): string => {
  const meta = rec((c as { meta?: unknown }).meta);
  return String(meta.repo ?? c.proyecto ?? 'PatyIA');
};

class TkCommits extends HTMLElement {
  #commits: readonly TkCommit[] = [];
  #root: ShadowRoot;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
    css(this.#root, CSS);
  }

  connectedCallback(): void { this.#render(); }

  get commits(): readonly TkCommit[] { return this.#commits; }
  set commits(v: readonly TkCommit[] | null | undefined) {
    this.#commits = Array.isArray(v) ? v : [];
    if (this.isConnected) this.#render();
  }

  #render(): void {
    while (this.#root.firstChild) this.#root.removeChild(this.#root.firstChild);
    const commits = this.#commits.filter((c) => String(c.hash ?? '').trim());
    if (!commits.length) return;

    let ins = 0;
    let del = 0;
    let mins = 0;
    for (const c of commits) {
      ins += Number(c.insCount ?? 0);
      del += Number(c.delCount ?? 0);
      mins += Number(c.minutos ?? 0);
    }

    this.#root.append(html`
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
            ${commits.map((c) => {
              const hash = String(c.hash ?? '');
              const url = githubUrl(proyectoDe(c), hash);
              return html`
                <tr>
                  <td>
                    <a class="hash" href="${url}" target="_blank" rel="noopener noreferrer">
                      ${hash.slice(0, 9)}
                    </a>
                  </td>
                  <td class="fecha">${commitFecha(c)}</td>
                  <td><span class="desc" title="${String(c.descripcion ?? '')}">${String(c.descripcion ?? '')}</span></td>
                  <td class="num"><span class="chip ins">+${Number(c.insCount ?? 0)}</span></td>
                  <td class="num"><span class="chip del">−${Number(c.delCount ?? 0)}</span></td>
                  <td class="num">${Number(c.minutos ?? 0)} min</td>
                </tr>
              `;
            })}
            <tr class="total">
              <td></td>
              <td></td>
              <td>${commits.length === 1 ? '1 commit' : `${commits.length} commits`}</td>
              <td class="num"><span class="chip ins">+${ins}</span></td>
              <td class="num"><span class="chip del">−${del}</span></td>
              <td class="num">${mins} min</td>
            </tr>
          </tbody>
        </table>
      </div>
    `);
  }
}

define('tk-commits', TkCommits);
