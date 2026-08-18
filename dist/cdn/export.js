import{IS_CDN as s}from"./is-cdn.js";import{IS_TAGS as c}from"./is-tags.js";const d="Jeff-Aporta/tks-system",l="main",n=`https://cdn.jsdelivr.net/gh/${d}@${l}/dist/cdn`,r=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),m=e=>{const a=`${e.iticket} \xB7 ${e.titulo??"Tiquete"}`,o=JSON.stringify(e).replace(/<\/(script)/gi,"<\\/$1");return`<!doctype html>
<html lang="es" class="theme-dark" data-theme="dark" data-palette="contapyme">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="generator" content="jagudeloe \xB7 visor de tiquetes">
<title>${r(a)}</title>

<!-- Kit is-* (versi\xF3n fijada) -->
<link rel="stylesheet" href="${s}/is-base.min.css">
<link rel="stylesheet" href="${s}/palettes.min.css">

<!-- Un solo m\xF3dulo: define los tk-* y pide al loader del kit los is-* que
     este documento usa (~255 kB) en vez del all.min.js del kit (2,1 MB).

     La lista va ESCRITA en el HTML, no importada del bundle. Con un
     import nombrado de IS_TAGS el documento moria con un SyntaxError
     ("does not provide an export named 'IS_TAGS'") cada vez que jsDelivr
     servia de su cache una revision anterior a esa exportacion: la ref
     "main" se cachea por edge, asi que hay una ventana en la que la ficha
     recien generada se encuentra el bundle viejo y queda en blanco. -->
<script type="module">
  import "${n}/all.min.js";
  import { ISWebComponentsLoader as L } from "${s}/loader.min.js";
  await L.load(...${JSON.stringify(c)});
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
    <span><strong>${r(e.iticket)}</strong> \xB7 documentaci\xF3n descargada</span>
    <is-theme-toggle></is-theme-toggle>
  </div>

  <tk-view embebido></tk-view>

  <script type="application/json" id="tk-datos">${o}<\/script>
  <script type="module">
    const datos = JSON.parse(document.getElementById('tk-datos').textContent);
    const vista = document.querySelector('tk-view');
    customElements.whenDefined('tk-view').then(() => { vista.json = datos; });
  <\/script>
</body>
</html>
`},p={cdn:n,async html(e){return m(e)},async descargar(e){const a=await p.html(e),o=new Blob([a],{type:"text/html;charset=utf-8"}),i=URL.createObjectURL(o),t=document.createElement("a");t.href=i,t.download=`${e.iticket}.html`,document.body.append(t),t.click(),t.remove(),setTimeout(()=>URL.revokeObjectURL(i),3e4)}};export{l as TK_REF,d as TK_REPO,p as exportar};
