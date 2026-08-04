/**
 * preview-boot.js — sync, sin defer/module.
 * Aplica theme + palette desde ?s= (iniciales) o localStorage ANTES del primer paint.
 * No escribe la URL: s solo representa el estado inicial de esa carga.
 *
 * Replica exacta de AppWebcomponents/scripts/preview-boot.js: el protocolo del
 * ?s= (b64url JSON con { theme, palette, embed }) es compartido por ambas demos.
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

  var themeParam = (fromS && fromS.theme) || params.get('theme') || params.get('mode');
  var paletteParam = (fromS && fromS.palette) || params.get('palette');
  var embed = !!(fromS && fromS.embed) || (params.has('embed') && params.get('embed') !== '0' && params.get('embed') !== 'false');

  var theme = TEMAS[themeParam] ? themeParam : null;
  var palette = PALETAS[paletteParam] ? paletteParam : null;

  if (!theme) {
    var lsTheme = null;
    try { lsTheme = localStorage.getItem('is-theme'); } catch (e) {}
    theme = TEMAS[lsTheme] ? lsTheme : (root.dataset.theme || 'dark');
  }
  if (!palette) {
    var lsPalette = null;
    try { lsPalette = localStorage.getItem('is-palette'); } catch (e) {}
    palette = PALETAS[lsPalette] ? lsPalette : (root.dataset.palette || 'contapyme');
  }

  root.classList.toggle('theme-light', theme === 'light');
  root.classList.toggle('theme-dark', theme === 'dark');
  root.dataset.theme = theme;
  root.dataset.palette = palette;
  if (embed) root.dataset.embed = '1';
})();
