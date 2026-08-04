/**
 * <tk-file-tree> — bloque `file-tree`: archivos tocados por el ticket.
 *
 * Payload: { rootLabel, paths: string[], hints?: { [basename]: string } }
 *
 * Las rutas planas se expanden a jerarquía y se pintan con <is-tree>. La pista
 * (`hints`) explica por qué ese archivo importa: se muestra junto a la hoja,
 * que es donde el lector la necesita.
 */

import { blockCss, crearBloque, define, html, raw, rec } from './_shared.js';
const CSS = /* css */ `
  ${blockCss}
  is-tree {
    display: block;
    padding: 0.7em 0.85em;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: var(--is-bg-soft, #14181d);
    font-family: var(--is-font-mono, ui-monospace, Menlo, monospace);
    font-size: 0.8125em;
    line-height: 1.55;
  }
  .pista {
    margin-left: 0.65em;
    color: var(--is-text-muted, #9aa7b4);
    font-family: var(--is-font-sans, system-ui, sans-serif);
    font-size: 0.95em;
  }
`;

interface Nodo {
  readonly nombre: string;
  readonly hijos: Map<string, Nodo>;
}

const nodo = (nombre: string): Nodo => ({ nombre, hijos: new Map() });

/** Rutas `a/b/c.ts` a árbol. Se conserva el orden de aparición del payload. */
const construir = (paths: readonly string[]): Nodo => {
  const raiz = nodo('');
  for (const ruta of paths) {
    let actual = raiz;
    for (const parte of String(ruta).split('/').filter(Boolean)) {
      if (!actual.hijos.has(parte)) actual.hijos.set(parte, nodo(parte));
      actual = actual.hijos.get(parte)!;
    }
  }
  return raiz;
};

const rama = (n: Nodo, hints: Record<string, unknown>): DocumentFragment => {
  const esHoja = n.hijos.size === 0;
  const pista = esHoja ? String(hints[n.nombre] ?? '') : '';

  return html`
    <is-tree-item ${raw(esHoja ? '' : 'expanded')}>
      <is-icon
        slot="icon"
        icon="${esHoja ? 'mdi:file-document-outline' : 'mdi:folder-outline'}"
        aria-hidden="true"
      ></is-icon>
      ${n.nombre}
      ${pista && html`<span class="pista">${pista}</span>`}
      ${[...n.hijos.values()].map((h) => rama(h, hints))}
    </is-tree-item>
  `;
};

define('tk-file-tree', crearBloque(CSS, (root, p) => {
  const paths = (Array.isArray(p.paths) ? p.paths : []).map(String).filter(Boolean);
  if (!paths.length) return;

  const hints = rec(p.hints);
  const ramas = [...construir(paths).hijos.values()].map((h) => rama(h, hints));
  const etiquetaRaiz = String(p.rootLabel ?? '').trim();

  root.append(html`
    <h2 class="titulo">${String(p.title ?? 'Archivos intervenidos')}</h2>
    <is-tree selection="none">
      ${etiquetaRaiz ? html`
        <is-tree-item expanded>
          <is-icon slot="icon" icon="mdi:source-repository" aria-hidden="true"></is-icon>
          ${etiquetaRaiz}
          ${ramas}
        </is-tree-item>
      ` : ramas}
    </is-tree>
  `);
}));
