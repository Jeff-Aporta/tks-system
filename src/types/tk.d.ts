/**
 * tk.d.ts — contrato de tipos del visor de tiquetes.
 *
 * Declaraciones ambiente: no emiten JavaScript y por eso son visibles desde
 * cualquier `.ts` del proyecto sin `import`. Esa ausencia de imports es
 * deliberada — los fuentes se concatenan tal cual dentro del HTML descargable,
 * donde no hay resolución de módulos.
 */

/* ── Documento del ticket (respuesta de jagudeloe-tks) ───────────── */

/** Carril del documento: agrupa bloques en secciones de lectura. */
type TkDocLane = 'solicitud' | 'evidencias' | 'causa' | 'verificacion' | 'solucion' | 'otros';

/** Discriminante de bloque presente hoy en BD. `string` cubre los futuros. */
type TkBlockKind =
  | 'markdown' | 'html' | 'badge' | 'badges' | 'table' | 'image' | 'image-group'
  | 'steps' | 'timeline' | 'metrics-timeline' | 'file-tree' | 'code' | 'sequence'
  | 'mui-stepper' | 'url' | 'link' | 'cambio-bd' | 'chart' | 'diagram'
  | (string & {});

interface TkBlockPayload {
  readonly title?: string;
  readonly docLane?: TkDocLane;
  readonly caption?: string;
  readonly [key: string]: unknown;
}

interface TkBlock {
  readonly kind?: TkBlockKind;
  readonly payload?: TkBlockPayload;
  readonly sortKey?: number;
  readonly blocks?: readonly TkBlock[];
  readonly iid?: number;
  readonly iContext?: number | null;
}

interface TkCommit {
  readonly hash: string;
  readonly proyecto?: string;
  readonly descripcion?: string;
  readonly insCount?: number;
  readonly delCount?: number;
  readonly minutos?: number;
}

interface TkTiempo {
  readonly name: string;
  readonly detail?: string;
  readonly minutos: number;
}

interface TkContext {
  readonly asesorNombre?: string;
  readonly horaInicio?: string | null;
  readonly horaFin?: string | null;
  readonly bChecked?: boolean;
  readonly commits?: readonly TkCommit[];
  readonly content?: readonly TkBlock[];
}

interface TkTicket {
  readonly iticket: string;
  readonly space: string;
  readonly titulo?: string;
  readonly solicitante?: string;
  readonly resumen?: string;
  readonly descripcion?: string;
  readonly fechaSolicitud?: string | null;
  readonly fechaEntrega?: string | null;
  readonly estado?: string;
  readonly activo?: boolean;
  readonly detallesExtra?: Record<string, unknown>;
  readonly meta?: Record<string, unknown>;
  readonly normativa?: Record<string, unknown>;
  readonly contexts?: readonly TkContext[];
  readonly rootCommits?: readonly TkCommit[];
  readonly tiempos?: readonly TkTiempo[];
  readonly content?: readonly TkBlock[];
  readonly doc?: { readonly blocks?: readonly TkBlock[] };
  readonly commitMinutos?: number;
  readonly estimacionMinutos?: number;
  readonly diligenciaMinutos?: number;
  readonly extraMinutos?: number;
  readonly tiempoEstimacionMinutos?: number;
  readonly tiempoTotalMinutos?: number;
}

/** Fila del listado: cabecera del ticket, sin `content`. */
type TkTicketRow = Omit<TkTicket, 'content' | 'contexts' | 'doc'>;

/* ── Transporte y caché ──────────────────────────────────────────── */

interface TkListResponse {
  readonly ok: boolean;
  readonly space: string;
  readonly total: number;
  readonly rows: readonly TkTicketRow[];
  readonly error?: string;
}

interface TkDetailResponse {
  readonly ok: boolean;
  readonly ticket?: TkTicket;
  readonly error?: string;
}

/** De dónde salió el dato que se está mostrando. Gobierna el aviso al usuario. */
type TkOrigen = 'red' | 'cache' | 'cache-vencida' | 'embebido';

interface TkResultado<T> {
  readonly data: T;
  readonly origen: TkOrigen;
  /** Epoch ms de la escritura en caché que respalda el dato. */
  readonly guardadoEn: number;
  readonly error?: string;
}

/** Espacio de trabajo en BD. `general` no existe: es la unión en la UI. */
type TkSpace = 'patyia' | 'clientesis';

/* ── Estado de navegación (?s= en la URL) ────────────────────────── */

interface TkEstadoUrl {
  readonly space?: TkSpace;
  readonly tk?: string;
  readonly theme?: 'dark' | 'light';
  readonly q?: string;
  /** Vista de página completa: sin cabecera ni panel de navegación. */
  readonly full?: boolean;
}

/* ── API compartida (globalThis.TK) ──────────────────────────────── */

type TkAtributos = Record<string, string | number | boolean | null | undefined | ((e: Event) => void)>;

/** Cadena marcada como HTML de confianza por `TK.raw`. */
interface TkHtmlCrudo { readonly __tkCrudo: unique symbol }

/** Valor interpolable en `TK.html`. */
type TkValor =
  | string | number | boolean | null | undefined
  | Node | TkHtmlCrudo | ((e: Event) => void)
  | readonly TkValor[];

interface TkApi {
  /** Adopta una hoja constructable memoizada por texto en el shadow root. */
  css(shadow: ShadowRoot, cssText: string): void;
  /** Estilos base de todo bloque de documento. */
  readonly blockCss: string;
  /** Estilos del HTML que produce `md()`. */
  readonly proseCss: string;

  /**
   * Crea la clase de un bloque de documento: shadow con `cssText` adoptado,
   * propiedad `payload` y repintado completo en cada asignación.
   */
  crearBloque(
    cssText: string,
    render: (root: ShadowRoot, payload: TkBlockPayload, host: HTMLElement) => void,
  ): CustomElementConstructor;

  /**
   * Plantilla etiquetada a DocumentFragment. Los valores interpolados se
   * escapan salvo que vengan de `raw()`; los `Node` se insertan; una función
   * detrás de `on…=` se enlaza como listener.
   */
  html(strings: TemplateStringsArray, ...values: TkValor[]): DocumentFragment;

  /** Marca HTML ya saneado para que `html` no lo escape. */
  raw(valor: unknown): TkHtmlCrudo;

  el<K extends keyof HTMLElementTagNameMap>(
    tag: K, attrs?: TkAtributos, children?: TkHijos
  ): HTMLElementTagNameMap[K];
  el(tag: string, attrs?: TkAtributos, children?: TkHijos): HTMLElement;

  jsonScript(data: unknown): HTMLScriptElement;
  esc(s: unknown): string;
  rec(v: unknown): Record<string, unknown>;

  md(src: unknown): string;
  inlineMd(src: unknown): string;

  fecha(iso: string | null | undefined, conHora?: boolean): string;
  minutos(min: unknown): string;
  tono(t: unknown): 'brand' | 'info' | 'success' | 'warning' | 'danger' | 'neutral';
  estadoColor(estado: unknown): 'info' | 'success' | 'warning' | 'neutral';

  readonly b64url: {
    encode(str: string): string;
    decode(str: string): string;
  };

  define(tag: string, clase: CustomElementConstructor): void;
}

type TkHijos = (Node | string | null | undefined) | readonly (Node | string | null | undefined)[];

/* ── API de aplicación ────────────────────────────────────────────
 *
 * Separada de `TK` a propósito: `TK` es lo que viaja dentro del HTML
 * descargable (render puro); `TKApp` es lo que solo tiene sentido dentro del
 * visor (red, caché, URL, exportación).
 */

type TkAvisoColor = 'brand' | 'success' | 'warning' | 'danger' | 'neutral';

interface TkCacheEntrada<T> {
  readonly data: T;
  readonly guardadoEn: number;
  readonly vencida: boolean;
}

interface TkCacheApi {
  readonly vigenciaMs: number;
  leer<T>(clave: string): Promise<TkCacheEntrada<T> | null>;
  escribir(clave: string, data: unknown): Promise<number>;
  limpiar(): Promise<void>;
}

interface TkApiCliente {
  readonly base: string;
  readonly spaces: readonly TkSpace[];
  listar(space: TkSpace): Promise<TkResultado<readonly TkTicketRow[]>>;
  listarTodos(): Promise<TkResultado<readonly TkTicketRow[]>>;
  ticket(space: TkSpace, iticket: string): Promise<TkResultado<TkTicket>>;
  /** Vacía la caché para forzar lectura de red en la próxima consulta. */
  refrescar(): Promise<void>;
}

interface TkExportador {
  /** Base CDN del kit `is-*` que se enlaza en el HTML generado. */
  readonly cdn: string;
  html(tk: TkTicket): Promise<string>;
  descargar(tk: TkTicket): Promise<void>;
}

interface TkEstadoApi {
  leer(): TkEstadoUrl;
  escribir(parcial: TkEstadoUrl, reemplazar?: boolean): TkEstadoUrl;
  /** URL absoluta con ese estado, sin tocar la navegación actual. */
  enlace(parcial: TkEstadoUrl): string;
}

interface TkAppApi {
  /** URL base del proyecto; resuelve los fuentes al exportar. */
  raiz: string;
  cache: TkCacheApi;
  api: TkApiCliente;
  exportar: TkExportador;
  estado: TkEstadoApi;
  aviso(mensaje: string, color?: TkAvisoColor): void;
}

