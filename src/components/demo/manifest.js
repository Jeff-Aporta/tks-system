/**
 * manifest.js — catálogo de componentes tk-* para la demo.
 *
 * Cada entrada es consumida por demo/index.html para construir el shell-nav
 * y resolver el iframe. El `page` es la ruta relativa a `demo/previews/`.
 * `script` apunta al .ts fuente (solo referencia, no se carga en runtime).
 */
export default [
  { tag: 'home', title: 'Inicio', category: 'shell', page: 'home.html', script: '' },
  { tag: 'tk-view',       title: 'Visor de tiquete',  category: 'document', page: 'tk-view.html',       script: '../tk/tk-view.ts' },
  { tag: 'tk-ticket-head',title: 'Cabecera',          category: 'document', page: 'tk-ticket-head.html',script: '../tk/tk-ticket-head.ts' },
  { tag: 'tk-actions',    title: 'Acciones',          category: 'document', page: 'tk-actions.html',    script: '../tk/tk-actions.ts' },
  { tag: 'tk-block',      title: 'Despachador',       category: 'blocks',   page: 'tk-block.html',      script: '../tk/tk-block.ts' },
  { tag: 'tk-markdown',   title: 'Markdown',          category: 'blocks',   page: 'tk-markdown.html',   script: '../tk/tk-markdown.ts' },
  { tag: 'tk-html',       title: 'HTML saneado',      category: 'blocks',   page: 'tk-html.html',       script: '../tk/tk-html.ts' },
  { tag: 'tk-badges',     title: 'Etiquetas',         category: 'blocks',   page: 'tk-badges.html',     script: '../tk/tk-badges.ts' },
  { tag: 'tk-table',      title: 'Tabla / Ficha',     category: 'blocks',   page: 'tk-table.html',      script: '../tk/tk-table.ts' },
  { tag: 'tk-image',      title: 'Imagen',            category: 'blocks',   page: 'tk-image.html',      script: '../tk/tk-image.ts' },
  { tag: 'tk-code',       title: 'Código',            category: 'blocks',   page: 'tk-code.html',       script: '../tk/tk-code.ts' },
  { tag: 'tk-url',        title: 'Enlace',            category: 'blocks',   page: 'tk-url.html',        script: '../tk/tk-url.ts' },
  { tag: 'tk-cambio-bd',  title: 'Cambio en BD',      category: 'blocks',   page: 'tk-cambio-bd.html',  script: '../tk/tk-cambio-bd.ts' },
  { tag: 'tk-steps',      title: 'Fases',             category: 'blocks',   page: 'tk-steps.html',      script: '../tk/tk-steps.ts' },
  { tag: 'tk-file-tree',  title: 'Árbol de archivos', category: 'blocks',   page: 'tk-file-tree.html',  script: '../tk/tk-file-tree.ts' },
  { tag: 'tk-timeline',   title: 'Línea de tiempo',   category: 'blocks',   page: 'tk-timeline.html',   script: '../tk/tk-timeline.ts' },
  { tag: 'tk-sequence',   title: 'Secuencia',         category: 'blocks',   page: 'tk-sequence.html',   script: '../tk/tk-sequence.ts' },
  { tag: 'tk-stepper',    title: 'Procedimiento',     category: 'blocks',   page: 'tk-stepper.html',    script: '../tk/tk-stepper.ts' },
  { tag: 'tk-chart',      title: 'Gráfica',           category: 'blocks',   page: 'tk-chart.html',      script: '../tk/tk-chart.ts' },
  { tag: 'tk-diagram',    title: 'Diagrama',          category: 'blocks',   page: 'tk-diagram.html',    script: '../tk/tk-diagram.ts' },
];
