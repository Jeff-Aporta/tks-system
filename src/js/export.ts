/**
 * export.ts — descarga de un tiquete como HTML portable.
 *
 * El archivo generado:
 *   - carga `all.min.js` por CDN (tip de `main` de este repo): define los
 *     `tk-*` y exporta `IS_TAGS`, la lista de componentes del kit que este
 *     documento usa de verdad,
 *   - pide esos `is-*` al loader del kit (`@main`, tip actual). El
 *     `all.min.js` del kit son 211 módulos (2,1 MB) para pintar trece.
 *   - lleva el JSON del tiquete quemado en un <script type="application/json">.
 *
 * Resultado: se abre con doble clic (`file://`) porque todos los módulos son
 * URLs `https://` absolutas. No usa import maps ni `data:` URIs: Chrome trata
 * `file:` como origen único y falla al resolver `./_shared.js`.
 *
 */
import { IS_CDN } from './is-cdn.js';
import { IS_TAGS } from './is-tags.js';

/** Repo público del visor (`origin`; `jagudeloe-tks-front` es su espejo). */
export const TK_REPO = 'Jeff-Aporta/tks-system';
/**
 * Referencia del CDN: el tip de `main`, no un SHA.
 *
 * Con pin, una ficha ya distribuida quedaba clavada al bundle del día en que
 * se generó: no se rompía, pero tampoco recibía un arreglo sin regenerarla y
 * volver a publicarla en la unidad oficial — y son decenas de fichas. Con
 * `@main` el arreglo llega solo. El precio es que un cambio incompatible en
 * el bundle rompe fichas ya repartidas, así que `IS_TAGS` y los `tk-*` son
 * contrato público: se agregan, no se renombran ni se quitan.
 */
export const TK_REF = 'main';

const TK_CDN = `https://cdn.jsdelivr.net/gh/${TK_REPO}@${TK_REF}/dist/cdn`;

const escapar = (s: string): string => s
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const plantilla = (tk: TkTicket): string => {
  const titulo = `${tk.iticket} · ${tk.titulo ?? 'Tiquete'}`;
  const json = JSON.stringify(tk).replace(/<\/(script)/gi, '<\\/$1');

  return `<!doctype html>
<html lang="es" class="theme-dark" data-theme="dark" data-palette="contapyme">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="generator" content="jagudeloe · visor de tiquetes">
<title>${escapar(titulo)}</title>

<!-- Kit is-* (versión fijada) -->
<link rel="stylesheet" href="${IS_CDN}/is-base.min.css">
<link rel="stylesheet" href="${IS_CDN}/palettes.min.css">

<!-- Un solo módulo: define los tk-* y pide al loader del kit los is-* que
     este documento usa (~255 kB) en vez del all.min.js del kit (2,1 MB).

     La lista va ESCRITA en el HTML, no importada del bundle. Con un
     import nombrado de IS_TAGS el documento moria con un SyntaxError
     ("does not provide an export named 'IS_TAGS'") cada vez que jsDelivr
     servia de su cache una revision anterior a esa exportacion: la ref
     "main" se cachea por edge, asi que hay una ventana en la que la ficha
     recien generada se encuentra el bundle viejo y queda en blanco. -->
<script type="module">
  import "${TK_CDN}/all.min.js";
  import { ISWebComponentsLoader as L } from "${IS_CDN}/loader.min.js";
  await L.load(...${JSON.stringify(IS_TAGS)});
<\/script>

<style>
  :root {
    --tk-radius: 0.625rem;
    --tk-measure: 68ch;
    --tk-link: #6fb2e8;
    --tk-code-text: #a8d5ff;
  }
  html, body { margin: 0; background: var(--is-bg, #0b0d10); }
  body {
    min-height: 100vh;
    color: var(--is-text, #e6edf3);
    font-family: var(--is-font-sans, system-ui, -apple-system, "Segoe UI", sans-serif);
  }
  .tk-barra {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.6rem clamp(1rem, 4vw, 2rem);
    border-bottom: 1px solid var(--is-border-soft, #1f242b);
    background: var(--is-bg-soft, #14181d);
    font-size: 0.8125rem;
    color: var(--is-text-muted, #9aa7b4);

    strong { color: var(--is-text, #e6edf3); font-weight: 600; }
  }
</style>
</head>
<body>
  <div class="tk-barra">
    <span><strong>${escapar(tk.iticket)}</strong> · documentación descargada</span>
    <is-theme-toggle></is-theme-toggle>
  </div>

  <tk-view embebido></tk-view>

  <script type="application/json" id="tk-datos">${json}<\/script>
  <script type="module">
    const datos = JSON.parse(document.getElementById('tk-datos').textContent);
    const vista = document.querySelector('tk-view');
    customElements.whenDefined('tk-view').then(() => { vista.json = datos; });
  <\/script>
</body>
</html>
`;
};

export const exportar: TkExportador = {
  cdn: TK_CDN,

  async html(tk: TkTicket): Promise<string> {
    return plantilla(tk);
  },

  async descargar(tk: TkTicket): Promise<void> {
    const html = await exportar.html(tk);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tk.iticket}.html`;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
  },
};
