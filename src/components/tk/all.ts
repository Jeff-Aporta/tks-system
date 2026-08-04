/**
 * all.ts — barril de todos los componentes `tk-*` (no `tk-app`/`tk-nav`, que
 * son del shell, no del documento).
 *
 * Sirve solo para que `scripts/build.mjs` genere `dist/cdn/tk.all.js`: un
 * único archivo con todo lo necesario para pintar un documento de tiquete
 * (`<tk-view>` y sus bloques), útil para incrustarlo con un solo
 * `<script type="module" src="dist/cdn/tk.all.js">` sin listar cada
 * componente por separado.
 */
import './_shared.js';
import './tk-markdown.js';
import './tk-html.js';
import './tk-badges.js';
import './tk-table.js';
import './tk-image.js';
import './tk-code.js';
import './tk-url.js';
import './tk-cambio-bd.js';
import './tk-steps.js';
import './tk-file-tree.js';
import './tk-timeline.js';
import './tk-sequence.js';
import './tk-stepper.js';
import './tk-chart.js';
import './tk-diagram.js';
import './tk-block.js';
import './tk-ticket-head.js';
import './tk-commits.js';
import './tk-tiempos.js';
import './tk-actions.js';
import './tk-view.js';
