/**
 * <tk-file-tree> — bloque `file-tree`: archivos tocados por el ticket.
 *
 * Payload:
 *   { rootLabel, paths?: string[], tree?: Nodo[], hints?: Record<string,string> }
 *
 * Las pistas (`hints`) se muestran como `<is-tooltip>` al hover/foco
 * sobre el nombre del archivo (no como texto inline al lado).
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
    flex-wrap: nowrap;
    gap: 0.4rem;
    align-items: center;
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
    outline: none;
  }
  .nombre[tabindex] {
    cursor: help;
    border-bottom: 1px dotted color-mix(in srgb, var(--is-text-muted, #9aa7b4) 55%, transparent);
  }
  .nombre[tabindex]:hover,
  .nombre[tabindex]:focus-visible {
    color: var(--is-accent, #1a6eb0);
  }
  .carpeta .nombre { font-weight: 600; color: var(--is-text-soft, #c3ced9); }
  .carpeta .nombre[tabindex] {
    border-bottom-color: transparent;
    cursor: default;
  }
  .raiz {
    margin-bottom: 0.35rem;
    color: var(--is-accent, #1a6eb0);
    font-weight: 650;
  }
  is-tooltip {
    --max-width: 22rem;
  }
`;

interface Nodo {
  readonly nombre: string;
  readonly path: string;
  readonly hijos: Map<string, Nodo>;
  readonly pista?: string;
}

const nodo = (nombre: string, path: string, pista = ''): Nodo => ({
  nombre,
  path,
  hijos: new Map(),
  pista: pista || undefined,
});

const construirPaths = (paths: readonly string[], hints: Record<string, unknown>): Nodo => {
  const raiz = nodo('', '');
  for (const ruta of paths) {
    const partes = String(ruta).split(/[/\\]/).filter(Boolean);
    let actual = raiz;
    const acc: string[] = [];
    partes.forEach((parte, i) => {
      acc.push(parte);
      const path = acc.join('/');
      if (!actual.hijos.has(parte)) {
        const esHoja = i === partes.length - 1;
        const pista = esHoja
          ? String(hints[path] ?? hints[ruta] ?? hints[parte] ?? hints[partes.slice(0, i + 1).join('/')] ?? '')
          : '';
        actual.hijos.set(parte, nodo(parte, path, pista));
      } else if (i === partes.length - 1) {
        const prev = actual.hijos.get(parte)!;
        const pista = String(
          prev.pista
            ?? hints[path]
            ?? hints[ruta]
            ?? hints[parte]
            ?? '',
        );
        if (pista && !prev.pista) {
          actual.hijos.set(parte, nodo(parte, path, pista));
        }
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
    path,
    String(r.hint ?? r.pista ?? hints[path] ?? hints[nombre] ?? ''),
  );
  for (const child of kids) {
    const n = leerNodoTree(child, hints, path);
    if (n) out.hijos.set(n.nombre, n);
  }
  return out;
};

const construirTree = (tree: readonly unknown[], hints: Record<string, unknown>): Nodo => {
  const raiz = nodo('', '');
  for (const item of tree) {
    const n = leerNodoTree(item, hints, '');
    if (n) raiz.hijos.set(n.nombre, n);
  }
  return raiz;
};

let tipSeq = 0;

const pintar = (n: Nodo): DocumentFragment => {
  const esHoja = n.hijos.size === 0;
  const icono = esHoja ? 'mdi:file-document-outline' : 'mdi:folder-outline';
  const tipId = n.pista ? `ft-tip-${++tipSeq}` : '';
  return html`
    <li class="nodo ${esHoja ? 'hoja' : 'carpeta'}">
      <div class="fila">
        <is-icon class="ico" icon="${icono}" aria-hidden="true"></is-icon>
        ${n.pista
          ? html`
            <span class="nombre" id="${tipId}" tabindex="0">${n.nombre}</span>
            <is-tooltip for="${tipId}" placement="top">${n.pista}</is-tooltip>
          `
          : html`<span class="nombre">${n.nombre}</span>`}
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
  tipSeq = 0;
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
