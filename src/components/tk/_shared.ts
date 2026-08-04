/**
 * _shared.ts — base común de los componentes `tk-*`.
 *
 * Módulo ES: el resto de `components/tk/*.ts` importa de aquí. El HTML
 * descargado autocontenido (ver `js/export.ts`) empaqueta este módulo junto
 * con los demás mediante un pequeño runtime CommonJS embebido, porque un
 * archivo suelto no tiene servidor que resuelva rutas relativas.
 *
 * El CSS de cada componente vive en una constante del propio .ts (no en un
 * .css hermano) porque `adoptCss` no depende de `import.meta.url`: el HTML
 * descargado no tiene esa URL de origen.
 *
 * Los tipos viven en `types/tk.d.ts` (ambiente, sin emisión, visibles sin
 * `import` en todo el proyecto).
 */

/* ── Shadow DOM ─────────────────────────────────────────────── */

const SHEETS = new Map<string, CSSStyleSheet>();

/** Hoja constructable memoizada por texto: N instancias comparten 1 objeto. */
export const css = (shadow: ShadowRoot, cssText: string): void => {
  let sheet = SHEETS.get(cssText);
  if (!sheet) {
    sheet = new CSSStyleSheet();
    sheet.replaceSync(cssText);
    SHEETS.set(cssText, sheet);
  }
  shadow.adoptedStyleSheets = [...shadow.adoptedStyleSheets, sheet];
};

/** Estilos comunes a todo bloque de documento (superficie, título, texto). */
export const blockCss = /* css */ `
  :host {
    display: block;
    max-width: 100%;
    min-width: 0;
    overflow-wrap: break-word;
    color: var(--is-text, #e6edf3);
    font-family: var(--is-font-sans, system-ui, -apple-system, "Segoe UI", sans-serif);
    font-size: 0.9375rem;
    line-height: 1.65;
  }
  .titulo {
    margin: 0 0 0.65em;
    max-width: min(100%, var(--tk-measure, 68ch));
    font-size: 1.0625em;
    font-weight: 620;
    letter-spacing: -0.011em;
    line-height: 1.35;
    overflow-wrap: anywhere;
    color: var(--is-text, #e6edf3);
  }
  .superficie {
    max-width: 100%;
    min-width: 0;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: var(--is-bg-soft, #14181d);
  }
  .pie {
    margin: 0.65em 0 0;
    max-width: min(100%, var(--tk-measure, 68ch));
    color: var(--is-text-muted, #9aa7b4);
    font-size: 0.8125em;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }
`;

/* ── DOM ────────────────────────────────────────────────────── */

export const el = ((tag: string, attrs: TkAtributos = {}, children: TkHijos = []): HTMLElement => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === false || v == null) continue;
    if (k === 'class') node.className = String(v);
    else if (k === 'text') node.textContent = String(v);
    else if (k === 'html') node.innerHTML = String(v);
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v === true ? '' : String(v));
  }
  const lista = Array.isArray(children) ? children : [children];
  for (const c of lista) {
    if (c == null) continue;
    node.append(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return node;
}) as TkApi['el'];

/* ── Plantillas ─────────────────────────────────────────────── */

const CRUDO = Symbol('tk-html-crudo');

/** Marca una cadena como HTML de confianza dentro de `html`. */
export const raw = (valor: unknown): TkHtmlCrudo =>
  ({ [CRUDO]: String(valor ?? '') } as unknown as TkHtmlCrudo);

const esCrudo = (v: unknown): v is TkHtmlCrudo =>
  typeof v === 'object' && v !== null && CRUDO in v;

/**
 * `html` — plantilla etiquetada que devuelve un DocumentFragment.
 *
 * Se lee como JSX y no depende de ningún framework:
 *
 *   root.append(html`
 *     <h2 class="titulo">${titulo}</h2>
 *     <button onclick=${() => abrir()}>Ampliar</button>
 *     <div class="prosa">${raw(TK.md(texto))}</div>
 *   `);
 *
 * Reglas de interpolación:
 *   - primitivo            → texto escapado (sirve también dentro de atributos)
 *   - Node / fragmento     → se inserta el nodo tal cual
 *   - array                → cada elemento, en orden
 *   - función tras `on…=`  → addEventListener sobre ese elemento
 *   - `raw(str)`           → HTML sin escapar (solo para HTML ya saneado)
 *   - null / false         → nada
 *
 * El escape por defecto es lo que hace seguro pintar payloads de ticket.
 */
export const html = (strings: TemplateStringsArray, ...values: unknown[]): DocumentFragment => {
  const nodos: Node[] = [];
  const handlers: Array<{ evento: string; fn: EventListener }> = [];
  let acc = '';

  for (let i = 0; i < strings.length; i++) {
    acc += strings[i];
    if (i >= values.length) continue;
    const v = values[i];

    if (v == null || v === false || v === true) continue;

    // Manejador de evento: la plantilla trae `onclick=` justo antes del valor.
    // Se admite guion (`onis-change=`) porque los `is-*` emiten eventos
    // propios (`is-input`, `is-change`), no los nativos.
    const enAtributoEvento = typeof v === 'function' && /\s+on([a-zA-Z][\w-]*)=\s*$/.test(acc);
    if (enAtributoEvento) {
      const m = acc.match(/\s+on([a-zA-Z][\w-]*)=\s*$/)!;
      acc = acc.slice(0, acc.length - m[0].length);
      acc += ` data-tk-ev="${handlers.length}"`;
      handlers.push({ evento: m[1]!.toLowerCase(), fn: v as EventListener });
      continue;
    }

    if (esCrudo(v)) {
      acc += (v as unknown as Record<symbol, string>)[CRUDO];
      continue;
    }

    const lista = Array.isArray(v) ? v : [v];
    for (const item of lista) {
      if (item == null || item === false || item === true) continue;
      if (item instanceof Node) {
        acc += `<template data-tk-nodo="${nodos.length}"></template>`;
        nodos.push(item);
      } else if (esCrudo(item)) {
        acc += (item as unknown as Record<symbol, string>)[CRUDO];
      } else {
        acc += esc(item);
      }
    }
  }

  const plantilla = document.createElement('template');
  plantilla.innerHTML = acc;
  const frag = plantilla.content;

  for (const marca of [...frag.querySelectorAll('template[data-tk-nodo]')]) {
    const idx = Number((marca as HTMLElement).dataset.tkNodo);
    marca.replaceWith(nodos[idx] ?? document.createComment('tk:nodo'));
  }

  for (const elx of [...frag.querySelectorAll('[data-tk-ev]')]) {
    const idx = Number((elx as HTMLElement).dataset.tkEv);
    const h = handlers[idx];
    if (h) elx.addEventListener(h.evento, h.fn);
    elx.removeAttribute('data-tk-ev');
  }

  return frag;
};

/** JSON de configuración para los `is-*` que lo leen de un hijo <script>. */
export const jsonScript = (data: unknown): HTMLScriptElement => {
  const s = document.createElement('script');
  s.type = 'application/json';
  s.textContent = JSON.stringify(data);
  return s;
};

export const esc = (s: unknown): string => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export const rec = (v: unknown): Record<string, unknown> =>
  (v && typeof v === 'object' && !Array.isArray(v) ? v as Record<string, unknown> : {});

/* ── Markdown ───────────────────────────────────────────────── */

/** Subconjunto inline: `code`, **negrita**, *cursiva*, ~~tachado~~, [link](url). */
export const inlineMd = (src: unknown): string => {
  const codes: string[] = [];
  // El código va primero y sale del flujo: dentro de ` ` nada más se interpreta.
  let t = String(src ?? '').replace(/`([^`]+)`/g, (_m, c: string) => {
    codes.push(c);
    return ` ${codes.length - 1} `;
  });

  t = esc(t)
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g,
      (_m, txt: string, href: string) =>
        `<a href="${esc(href)}" target="_blank" rel="noopener noreferrer">${txt}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/~~([^~]+)~~/g, '<del>$1</del>');

  return t.replace(/ (\d+) /g, (_m, i: string) => `<code>${esc(codes[Number(i)])}</code>`);
};

/** Markdown a HTML: encabezados, listas, tablas, cita, regla, código cercado. */
export const md = (src: unknown): string => {
  const lines = String(src ?? '').replace(/\r\n?/g, '\n').split('\n');
  const out: string[] = [];
  const buf: string[] = [];
  let i = 0;

  const cerrarParrafo = (): void => {
    if (buf.length) out.push(`<p>${inlineMd(buf.join(' '))}</p>`);
    buf.length = 0;
  };

  while (i < lines.length) {
    const line = lines[i]!;

    // Bloque de código cercado.
    const fence = line.match(/^\s*```(\w+)?\s*$/);
    if (fence) {
      cerrarParrafo();
      const cuerpo: string[] = [];
      i++;
      while (i < lines.length && !/^\s*```\s*$/.test(lines[i]!)) cuerpo.push(lines[i++]!);
      i++;
      out.push(`<pre data-lang="${esc(fence[1] ?? '')}"><code>${esc(cuerpo.join('\n'))}</code></pre>`);
      continue;
    }

    // Tabla GFM: fila de cabecera seguida de fila de separadores.
    if (/^\s*\|/.test(line) && /^\s*\|[\s:|-]+\|?\s*$/.test(lines[i + 1] ?? '')) {
      cerrarParrafo();
      const celdas = (l: string): string[] =>
        l.trim().replace(/^\||\|$/g, '').split('|').map((c) => inlineMd(c.trim()));
      const head = celdas(line);
      i += 2;
      const filas: string[][] = [];
      while (i < lines.length && /^\s*\|/.test(lines[i]!)) filas.push(celdas(lines[i++]!));
      out.push(
        `<table><thead><tr>${head.map((c) => `<th>${c}</th>`).join('')}</tr></thead>` +
        `<tbody>${filas.map((f) => `<tr>${f.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`,
      );
      continue;
    }

    const enc = line.match(/^(#{1,6})\s+(.*)$/);
    if (enc) {
      cerrarParrafo();
      // El h1 del markdown baja a h3: el h1/h2 de la página los pone el visor.
      const n = Math.min(enc[1]!.length + 2, 6);
      out.push(`<h${n}>${inlineMd(enc[2])}</h${n}>`);
      i++;
      continue;
    }

    if (/^\s*(---|___|\*\*\*)\s*$/.test(line)) {
      cerrarParrafo();
      out.push('<hr>');
      i++;
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      cerrarParrafo();
      const cita: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i]!)) cita.push(lines[i++]!.replace(/^\s*>\s?/, ''));
      out.push(`<blockquote>${md(cita.join('\n'))}</blockquote>`);
      continue;
    }

    const item = line.match(/^\s*([-*+]|\d+[.)])\s+/);
    if (item) {
      cerrarParrafo();
      const ordenada = /\d/.test(item[1]!);
      const items: string[] = [];
      while (i < lines.length) {
        const m = lines[i]!.match(/^\s*([-*+]|\d+[.)])\s+(.*)$/);
        if (!m) {
          // Continuación indentada del ítem anterior.
          if (items.length && /^\s{2,}\S/.test(lines[i]!)) {
            items[items.length - 1] += ` ${lines[i]!.trim()}`;
            i++;
            continue;
          }
          break;
        }
        items.push(m[2]!);
        i++;
      }
      const tag = ordenada ? 'ol' : 'ul';
      out.push(`<${tag}>${items.map((t) => `<li>${inlineMd(t)}</li>`).join('')}</${tag}>`);
      continue;
    }

    if (!line.trim()) {
      cerrarParrafo();
      i++;
      continue;
    }

    buf.push(line.trim());
    i++;
  }

  cerrarParrafo();
  return out.join('\n');
};

/** CSS del HTML producido por `md()` — lo adoptan los bloques con prosa. */
export const proseCss = /* css */ `
  .prosa {
    max-width: min(100%, var(--tk-measure, 68ch));
    min-width: 0;
    overflow-wrap: anywhere;
    word-break: break-word;

    > :first-child { margin-top: 0; }
    > :last-child { margin-bottom: 0; }

    h3, h4, h5, h6 {
      margin: 1.35em 0 0.45em;
      font-weight: 620;
      letter-spacing: -0.01em;
      line-height: 1.3;
      overflow-wrap: anywhere;
    }
    h3 { font-size: 1.0625em; }
    h4 { font-size: 0.9375em; color: var(--is-text-muted, #9aa7b4); }
    p { margin: 0 0 0.8em; overflow-wrap: anywhere; }
    ul, ol {
      margin: 0 0 0.85em;
      padding-left: 1.15em;
      max-width: 100%;
    }
    li {
      margin: 0.3em 0;
      padding-left: 0.15em;
      overflow-wrap: anywhere;

      &::marker { color: var(--is-accent, #1a6eb0); }
      > p { margin: 0.2em 0; }
    }
    a {
      color: var(--tk-link, #6fb2e8);
      text-decoration: underline;
      text-underline-offset: 0.18em;
      text-decoration-thickness: 1px;
      text-decoration-color: color-mix(in srgb, currentColor 40%, transparent);
      overflow-wrap: anywhere;

      &:hover { text-decoration-color: currentColor; }
    }
    code {
      display: inline;
      padding: 0.1em 0.35em;
      border: 1px solid var(--is-border-soft, #1f242b);
      border-radius: 0.28em;
      background: var(--is-code-bg, #0f1318);
      font-family: var(--is-font-mono, ui-monospace, "Cascadia Code", Menlo, monospace);
      font-size: 0.86em;
      line-height: 1.45;
      vertical-align: baseline;
      white-space: break-spaces;
      overflow-wrap: anywhere;
      word-break: break-word;
      color: var(--tk-code-text, #a8d5ff);
      box-decoration-break: clone;
      -webkit-box-decoration-break: clone;
    }
    pre {
      margin: 0 0 1em;
      max-width: 100%;
      padding: 0.85em 1em;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border: 1px solid var(--is-border-soft, #1f242b);
      border-radius: var(--tk-radius, 0.625rem);
      background: var(--is-code-bg, #0f1318);
      font-size: 0.8125em;
      line-height: 1.6;

      code {
        display: inline;
        padding: 0;
        border: 0;
        background: none;
        color: inherit;
        font-size: inherit;
        white-space: pre;
        vertical-align: baseline;
        word-break: normal;
        overflow-wrap: normal;
      }
    }
    blockquote {
      margin: 0 0 1em;
      max-width: 100%;
      padding: 0.15em 0 0.15em 0.95em;
      border-left: 2px solid color-mix(in srgb, var(--is-accent, #1a6eb0) 70%, transparent);
      color: var(--is-text-muted, #9aa7b4);
    }
    hr {
      margin: 1.4em 0;
      border: 0;
      border-top: 1px solid var(--is-border-soft, #1f242b);
    }
    table {
      display: block;
      width: 100%;
      max-width: 100%;
      margin: 0 0 1em;
      overflow-x: auto;
      border-collapse: collapse;
      font-size: 0.9em;
      -webkit-overflow-scrolling: touch;
    }
    th, td {
      padding: 0.5em 0.75em;
      border-bottom: 1px solid var(--is-border-soft, #1f242b);
      text-align: left;
      vertical-align: top;
    }
    th { font-weight: 600; color: var(--is-text-muted, #9aa7b4); }
    del { color: var(--is-text-muted, #9aa7b4); }
  }
`;

/* ── Formato ────────────────────────────────────────────────── */

const FECHA = new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
const FECHA_HORA = new Intl.DateTimeFormat('es-CO', {
  day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
});

export const fecha = (iso: string | null | undefined, conHora = false): string => {
  if (!iso) return '';
  // Algunas filas llegan con la ISO doblemente entrecomillada desde la BD/API.
  let crudo = String(iso).trim();
  if (
    (crudo.startsWith('"') && crudo.endsWith('"')) ||
    (crudo.startsWith("'") && crudo.endsWith("'"))
  ) {
    crudo = crudo.slice(1, -1).trim();
  }
  const d = new Date(crudo);
  if (Number.isNaN(d.getTime())) return crudo;
  return (conHora ? FECHA_HORA : FECHA).format(d);
};

/** Minutos a "2 h 15 min". Cadena vacía para 0 o valor no numérico. */
export const minutos = (min: unknown): string => {
  const n = Number(min);
  if (!Number.isFinite(n) || n <= 0) return '';
  const h = Math.floor(n / 60);
  const m = Math.round(n % 60);
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
};

/** Tono del payload (vocabulario heredado) al `color` de los `is-*`. */
const TONOS: Record<string, ReturnType<TkApi['tono']>> = {
  primary: 'brand', brand: 'brand', info: 'info', success: 'success',
  ok: 'success', warning: 'warning', warn: 'warning', danger: 'danger',
  error: 'danger', violet: 'brand', neutral: 'neutral', default: 'neutral',
};
export const tono = (t: unknown): ReturnType<TkApi['tono']> =>
  TONOS[String(t ?? '').toLowerCase()] ?? 'neutral';

/** Estado del ticket al color semántico de chips y puntos. */
export const estadoColor = (estado: unknown): ReturnType<TkApi['estadoColor']> => {
  const e = String(estado ?? '').toLowerCase();
  if (e.includes('cerrad') || e.includes('solucion')) return 'success';
  if (e.includes('proceso') || e.includes('curso')) return 'warning';
  if (e.includes('abiert') || e.includes('nuevo')) return 'info';
  return 'neutral';
};

/** Base64 URL-safe con soporte UTF-8 (estado en la URL y payloads empotrados). */
export const b64url = {
  encode(str: string): string {
    const bytes = new TextEncoder().encode(str);
    let bin = '';
    for (const b of bytes) bin += String.fromCharCode(b);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  },
  decode(str: string): string {
    let pad = String(str).replace(/-/g, '+').replace(/_/g, '/');
    while (pad.length % 4) pad += '=';
    const bin = atob(pad);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  },
};

/** Registro idempotente: volver a cargar el mismo fuente no lanza. */
export const define = (tag: string, clase: CustomElementConstructor): void => {
  if (!customElements.get(tag)) customElements.define(tag, clase);
};

/**
 * Fábrica de bloques de documento. Todos comparten el mismo ciclo: shadow con
 * CSS adoptado, `payload` por propiedad (nunca atributo: el JSON trae saltos
 * de línea y objetos anidados) y repintado completo en cada asignación.
 *
 * El repintado total es intencional: un bloque de ticket es inmutable dentro
 * de su versión del documento, así que no hay estado que conservar.
 */
export const crearBloque = (
  cssText: string,
  render: (root: ShadowRoot, payload: TkBlockPayload, host: HTMLElement) => void,
): CustomElementConstructor => class extends HTMLElement {
  #payload: TkBlockPayload = {};
  #root: ShadowRoot;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
    css(this.#root, cssText);
  }

  connectedCallback(): void { this.#render(); }

  get payload(): TkBlockPayload { return this.#payload; }
  set payload(v: TkBlockPayload | null | undefined) {
    this.#payload = rec(v) as TkBlockPayload;
    if (this.isConnected) this.#render();
  }

  #render(): void {
    // Se conservan las hojas adoptadas; solo se barren los nodos pintados.
    while (this.#root.firstChild) this.#root.removeChild(this.#root.firstChild);
    render(this.#root, this.#payload, this);
  }
};
