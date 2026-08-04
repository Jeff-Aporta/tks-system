/**
 * demo-boot.js — aplica theme + palette antes del primer pintado.
 *
 * Réplica del patrón preview-boot.js pero para el SHELL (no el iframe). Sin
 * embebido: el shell siempre muestra la toolbar. Sin este script, el html
 * parpadea en `dark/contapyme` (los defaults del html estático) y la
 * MutationObserver del is-theme-toggle ya escribió otros valores del
 * localStorage después del paint.
 */
(function () {
  var TEMAS = { dark: 1, light: 1 };
  var PALETAS = { insoft: 1, contapyme: 1, agrowin: 1 };
  var params = new URLSearchParams(location.search);
  var root = document.documentElement;

  var b64urlDecode = function (input) {
    var pad = String(input).replace(/-/g, '+').replace(/_/g, '/');
    while (pad.length % 4) pad += '=';
    var bin = atob(pad);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  };

  var fromS = null;
  var raw = params.get('s');
  if (raw) {
    try { fromS = JSON.parse(b64urlDecode(raw)); } catch (e) { fromS = null; }
  }

  var theme = TEMAS[fromS && fromS.theme] ? fromS.theme : null;
  var palette = PALETAS[fromS && fromS.palette] ? fromS.palette : null;

  if (!theme) {
    try {
      var lsTheme = localStorage.getItem('is-theme');
      if (TEMAS[lsTheme]) theme = lsTheme;
    } catch (e) {}
  }
  if (!palette) {
    try {
      var lsPalette = localStorage.getItem('is-palette');
      if (PALETAS[lsPalette]) palette = lsPalette;
    } catch (e) {}
  }

  root.classList.toggle('theme-light', theme === 'light');
  root.classList.toggle('theme-dark', theme !== 'light');
  root.dataset.theme = theme || 'dark';
  root.dataset.palette = palette || 'contapyme';
})();
