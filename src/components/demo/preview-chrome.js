/**
 * preview-chrome.js — sincroniza theme + palette en el iframe.
 *
 * Cuando el shell padre cambia el tema o la paleta, hace `postMessage` con
 * `{ type: 'is-context', theme, palette }`. Este script escucha y actualiza
 * <html> en consecuencia. En modo embebido (s.embed) los controles del usuario
 * en la barra superior del iframe están ocultos: solo aplica lo que llega del
 * padre.
 */
(function () {
  var TEMAS = { dark: 1, light: 1 };
  var PALETAS = { insoft: 1, contapyme: 1, agrowin: 1 };
  var root = document.documentElement;
  var embedded = root.dataset.embed === '1';

  var applyTheme = function (theme) {
    if (!TEMAS[theme]) return;
    root.classList.toggle('theme-light', theme === 'light');
    root.classList.toggle('theme-dark', theme === 'dark');
    root.dataset.theme = theme;
    var toggle = document.getElementById('previewTheme');
    if (toggle && typeof toggle.forceSync === 'function') toggle.forceSync();
  };

  var applyPalette = function (palette) {
    if (!PALETAS[palette]) return;
    root.dataset.palette = palette;
    var sel = document.getElementById('previewPalette');
    if (sel && sel.value !== palette) sel.value = palette;
  };

  var persist = function () {
    if (embedded) return;
    try {
      localStorage.setItem('is-theme', root.dataset.theme || 'dark');
      localStorage.setItem('is-palette', root.dataset.palette || 'contapyme');
    } catch (e) {}
  };

  addEventListener('message', function (ev) {
    if (ev.data && ev.data.type === 'is-context') {
      if (ev.data.theme) applyTheme(ev.data.theme);
      if (ev.data.palette) applyPalette(ev.data.palette);
    }
  });

  /** Construye la barra (theme + paleta) si la página no la trae. */
  var mount = function () {
    if (document.getElementById('previewChrome')) return;
    var bar = document.createElement('div');
    bar.id = 'previewChrome';
    bar.className = 'preview-chrome';
    bar.setAttribute('role', 'toolbar');
    bar.setAttribute('aria-label', 'Tema y paleta');
    bar.innerHTML = [
      '<label class="preview-chrome__palette">',
      '  <span class="preview-chrome__label">Paleta</span>',
      '  <select id="previewPalette" aria-label="Paleta de marca">',
      '    <option value="insoft">InSoft</option>',
      '    <option value="contapyme">ContaPyme</option>',
      '    <option value="agrowin">AgroWin</option>',
      '  </select>',
      '</label>',
      '<is-button-group class="preview-chrome__actions" pill aria-label="Tema">',
      '  <is-theme-toggle id="previewTheme"></is-theme-toggle>',
      '</is-button-group>'
    ].join('');
    document.body.appendChild(bar);

    if (embedded) {
      bar.hidden = true;
      bar.setAttribute('inert', '');
      return;
    }

    applyTheme(root.dataset.theme || 'dark');
    applyPalette(root.dataset.palette || 'contapyme');

    var themeBtn = document.getElementById('previewTheme');
    if (themeBtn) {
      themeBtn.addEventListener('theme-toggle', function (e) {
        var theme = e.detail && e.detail.theme
          ? e.detail.theme
          : (root.dataset.theme === 'dark' ? 'light' : 'dark');
        applyTheme(theme);
        persist();
      });
    }
    var sel = document.getElementById('previewPalette');
    if (sel) {
      sel.addEventListener('change', function (e) {
        applyPalette(e.target.value);
        persist();
      });
    }
  };

  var arrancar = function () {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', mount, { once: true });
    } else {
      mount();
    }
  };

  // Esperar a que el kit is-* esté listo antes de montar la barra.
  if (typeof customElements !== 'undefined') {
    customElements.whenDefined('is-theme-toggle').then(arrancar);
  } else {
    arrancar();
  }
})();
