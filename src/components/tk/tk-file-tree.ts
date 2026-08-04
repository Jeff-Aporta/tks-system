/**
 * <tk-file-tree> — bloque `file-tree`: archivos tocados por el ticket.
 *
 * Payload:
 *   { rootLabel, paths?: string[], tree?: Nodo[], hints?: Record<string,string> }
 *
 * Acepta rutas planas o árbol anidado (como el front React). El render es
 * propio (sin <is-tree>): más fiable y se lee como árbol real.
 */

import { blockCss, crearBloque, define, html, rec } from './_shared.js';

const CSS = /* css */ `
  ${blockCss}
  .arbol {
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    margin: 0;
    padding: 0.75rem 0.9rem;
    overflow-x: auto;
    list-style: none;
    border: 1px solid var(--is-border-soft, #1f242b);
    border-radius: var(--tk-radius, 0.625rem);
    background: var(--is-bg-soft, #14181d);
    font-family: var(--is-font-mono, ui-monospace, Menlo, monospace);
    font-size: 0.8125rem;
    line-height: 1.55;
    -webkit-overflow-scrolling: touch;
  }
  .arbol ul {
    margin: 0;
    padding: 0 0 0 1.05rem;
    list-style: none;
    border-left: 1px solid color-mix(in srgb, var(--is-border, #2a3038) 80%, transparent);
  }
  .nodo {
    margin: 0.12rem 0;
    min-width: 0;
  }
  .fila {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem 0.55rem;
    align-items: baseline;
    min-width: 0;
  }
  .ico {
    flex: none;
    color: var(--is-text-muted, #9aa7b4);
    font-size: 1em;
  }
  .nombre {
    min-width: 0;
    overflow-wrap: anywhere;
    word-break: break-word;
  }
  .carpeta .nombre { font-weight: 600; color: var(--is-text-soft, #c3ced9); }
  .pista {
    flex: 1 1 12rem;
    min-width: 0;
    color: var(--is-text-muted, #9aa7b4);
    font-family: var(--is-font-sans, system-ui, sans-serif);
    font-size: 0.92em;
    line-height: 1.4;
    overflow-wrap: anywhere;
  }
  .raiz {
    margin-bottom: 0.35rem;
    color: var(--is-accent, #1a6eb0);
    font-weight: 650;
  }
`;

interface Nodo {
  readonly nombre: string;
  readonly hijos: Map<string, Nodo>;
  readonly pista?: string;
}

const nodo = (nombre: string, pista = ''): Nodo => ({
  nombre,
  hijos: new Map(),
  pista: pista || undefined,
});

const construirPaths = (paths: readonly string[], hints: Record<string, unknown>): Nodo => {
  const raiz = nodo('');
  for (const ruta of paths) {
    const partes = String(ruta).split(/[/\\]/).filter(Boolean);
    let actual = raiz;
    partes.forEach((parte, i) => {
      if (!actual.hijos.has(parte)) {
        const esHoja = i === partes.length - 1;
        const pista = esHoja
          ? String(hints[parte] ?? hints[ruta] ?? hints[partes.slice(0, i + 1).join('/')] ?? '')
          : '';
        actual.hijos.set(parte, nodo(parte, pista));
      }
      actual = actual.hijos.get(parte)!;
    });
  }
  return raiz;
};

const leerNodoTree = (raw: unknown, hints: Record<string, unknown>, accPath: string): Nodo | null => {
  const r = rec(raw);
  const nombre = String(r.name ?? r.nombre ?? '').trim();
  if (!nombre) return null;
  const path = String(r.path ?? (accPath ? `${accPath}/${nombre}` : nombre));
  const kids = Array.isArray(r.children) ? r.children : Array.isArray(r.hijos) ? r.hijos : [];
  const out = nodo(
    nombre,
    String(r.hint ?? r.pista ?? hints[nombre] ?? hints[path] ?? ''),
  );
  for (const child of kids) {
    const n = leerNodoTree(child, hints, path);
    if (n) out.hijos.set(n.nombre, n);
  }
  return out;
};

const construirTree = (tree: readonly unknown[], hints: Record<string, unknown>): Nodo => {
  const raiz = nodo('');
  for (const item of tree) {
    const n = leerNodoTree(item, hints, '');
    if (n) raiz.hijos.set(n.nombre, n);
  }
  return raiz;
};

const pintar = (n: Nodo): DocumentFragment => {
  const esHoja = n.hijos.size === 0;
  const icono = esHoja ? 'mdi:file-document-outline' : 'mdi:folder-outline';
  return html`
    <li class="nodo ${esHoja ? 'hoja' : 'carpeta'}">
      <div class="fila">
        <is-icon class="ico" icon="${icono}" aria-hidden="true"></is-icon>
        <span class="nombre">${n.nombre}</span>
        ${n.pista ? html`<span class="pista">${n.pista}</span>` : null}
      </div>
      ${!esHoja ? html`
        <ul>
          ${[...n.hijos.values()].map(pintar)}
        </ul>
      ` : null}
    </li>
  `;
};

define('tk-file-tree', crearBloque(CSS, (root, p) => {
  const hints = rec(p.hints ?? p.notes);
  const nested = rec(p.fileTree ?? {});
  const treeArr = (Array.isArray(p.tree) ? p.tree
    : Array.isArray(nested.tree) ? nested.tree : []) as unknown[];
  const paths = (
    Array.isArray(p.paths) ? p.paths
      : Array.isArray(p.files) ? p.files
        : Array.isArray(nested.paths) ? nested.paths : []
  ).map(String).filter(Boolean);

  if (!treeArr.length && !paths.length) return;

  const arbol = treeArr.length
    ? construirTree(treeArr, { ...rec(nested.hints), ...hints })
    : construirPaths(paths, { ...rec(nested.hints), ...hints });

  const etiquetaRaiz = String(p.rootLabel ?? p.root ?? nested.rootLabel ?? '').trim();
  const ramas = [...arbol.hijos.values()].map(pintar);

  root.append(html`
    <h2 class="titulo">${String(p.title ?? nested.title ?? 'Archivos intervenidos')}</h2>
    <ul class="arbol" role="tree" aria-label="Archivos intervenidos">
      ${etiquetaRaiz ? html`
        <li class="nodo carpeta raiz" role="treeitem">
          <div class="fila">
            <is-icon class="ico" icon="mdi:source-repository" aria-hidden="true"></is-icon>
            <span class="nombre">${etiquetaRaiz}</span>
          </div>
          <ul role="group">${ramas}</ul>
        </li>
      ` : ramas}
    </ul>
  `);
}));
