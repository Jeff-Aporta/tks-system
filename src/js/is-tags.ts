/**
 * is-tags.ts — componentes del kit `is-*` que `<tk-view>` necesita de verdad.
 *
 * Por qué existe: el HTML descargable cargaba `is-webcomponents/dist/cdn/
 * all.min.js`, que es una lista de imports de 211 módulos — 2,1 MB para pintar
 * un tiquete que usa trece. Con el loader del kit y esta lista, el mismo
 * documento baja ~255 kB.
 *
 * Se exporta desde el barril (`dist/cdn/all.min.js` de este repo), así que el
 * documento resuelve componentes y lista en un único import.
 *
 * Mantenerla al día: los tags salen de `src/components/tk/**`; el guardián
 * `tests/is-tags.test.mjs` compara esta lista contra lo que el código usa y
 * falla si alguien agrega un `<is-…>` sin declararlo aquí.
 */
export const IS_TAGS: readonly string[] = [
  'is-button',
  'is-callout',
  'is-chart',
  'is-copy-button',
  'is-data-grid',
  'is-details',
  'is-icon',
  'is-lightbox',
  'is-sequence-diagram',
  'is-stepper',
  'is-tag',
  'is-theme-toggle',
  'is-timeline',
  'is-tooltip',
];

/**
 * Tags que otro módulo ya define, así que no se piden al loader.
 * `is-stepper-step` sale dentro de `navigation/stepper.min.js` (`is-stepper`),
 * y pedirlo suelto es un 404: no está en el catálogo del loader.
 */
export const IS_TAGS_CUBIERTOS: readonly string[] = ['is-stepper-step'];
