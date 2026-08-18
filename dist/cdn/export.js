import{IS_CDN as a}from"./is-cdn.js";const c="Jeff-Aporta/tks-system",l="main",r=`https://cdn.jsdelivr.net/gh/${c}@${l}/dist/cdn`,n=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),d=t=>{const s=`${t.iticket} \xB7 ${t.titulo??"Tiquete"}`,o=JSON.stringify(t).replace(/<\/(script)/gi,"<\\/$1");return`<!doctype html>
<html lang="es" class="theme-dark" data-theme="dark" data-palette="contapyme">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="generator" content="jagudeloe \xB7 visor de tiquetes">
<title>${n(s)}</title>

<!-- Kit is-* (versi\xF3n fijada) -->
<link rel="stylesheet" href="${a}/is-base.min.css">
<link rel="stylesheet" href="${a}/palettes.min.css">

<!-- Un solo m\xF3dulo: define los tk-* y pide al loader del kit los is-* que
     este documento usa (~255 kB) en vez del all.min.js del kit (2,1 MB). -->
<script type="module">
  import { IS_TAGS } from "${r}/all.min.js";
  import { ISWebComponentsLoader as L } from "${a}/loader.min.js";
  await L.load(...IS_TAGS);
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
    <span><strong>${n(t.iticket)}</strong> \xB7 documentaci\xF3n descargada</span>
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
`},m={cdn:r,async html(t){return d(t)},async descargar(t){const s=await m.html(t),o=new Blob([s],{type:"text/html;charset=utf-8"}),i=URL.createObjectURL(o),e=document.createElement("a");e.href=i,e.download=`${t.iticket}.html`,document.body.append(e),e.click(),e.remove(),setTimeout(()=>URL.revokeObjectURL(i),3e4)}};export{l as TK_REF,c as TK_REPO,m as exportar};
