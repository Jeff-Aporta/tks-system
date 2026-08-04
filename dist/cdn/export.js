const o="https://cdn.jsdelivr.net/gh/Jeff-Aporta/is-webcomponents@1c0e451393a412c2c5a41d1d4d4a2e62aa662bda/dist/cdn",c="Jeff-Aporta/jagudeloe-tks-front",d="main",r=`https://cdn.jsdelivr.net/gh/${c}@${d}/dist/cdn`,n=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),l=t=>{const s=`${t.iticket} \xB7 ${t.titulo??"Tiquete"}`,a=JSON.stringify(t).replace(/<\/(script)/gi,"<\\/$1");return`<!doctype html>
<html lang="es" class="theme-dark" data-theme="dark" data-palette="contapyme">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="generator" content="jagudeloe \xB7 visor de tiquetes">
<title>${n(s)}</title>

<!-- Kit is-* (versi\xF3n fijada) -->
<link rel="stylesheet" href="${o}/is-base.min.css">
<link rel="stylesheet" href="${o}/palettes.min.css">
<script type="module" src="${o}/all.min.js"><\/script>

<!-- Componentes tk-* (bundle \xFAnico, CDN de este repo) -->
<script type="module" src="${r}/tk.all.js"><\/script>

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

  <script type="application/json" id="tk-datos">${a}<\/script>
  <script type="module">
    const datos = JSON.parse(document.getElementById('tk-datos').textContent);
    const vista = document.querySelector('tk-view');
    customElements.whenDefined('tk-view').then(() => { vista.json = datos; });
  <\/script>
</body>
</html>
`},m={cdn:r,async html(t){return l(t)},async descargar(t){const s=await m.html(t),a=new Blob([s],{type:"text/html;charset=utf-8"}),i=URL.createObjectURL(a),e=document.createElement("a");e.href=i,e.download=`${t.iticket}.html`,document.body.append(e),e.click(),e.remove(),setTimeout(()=>URL.revokeObjectURL(i),3e4)}};export{d as TK_PIN,c as TK_REPO,m as exportar};
