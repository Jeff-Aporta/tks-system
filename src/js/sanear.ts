/**
 * sanear.ts — R51: en material publicable no aparece el nombre propio de nadie,
 * se nombra el cargo o el rol.
 *
 * El worker devuelve el tiquete tal como está en la base, con nombres reales.
 * Eso está bien dentro del visor interno, pero una ficha publicada (documento
 * suelto, carpeta oficial, adjunto de un correo) tiene que salir limpia. Antes
 * este saneo vivía duplicado en el generador de fichas; aquí es uno solo para
 * todos los consumidores.
 *
 * Uso:
 *   import { sanearTicket } from './sanear.js';
 *   vista.ticket = sanearTicket(tk);
 */

const NOMBRES_VETADOS = /\b(jeffrey|agudelo|viviana|restrepo|camilo|jagudeloe|vrestrepo)\b/i;
const ROL_GENERICO = 'el área solicitante';

/**
 * Usuarios de sistema: nombres propios disfrazados de identificador de base de
 * datos. Aparecen en mayúsculas dentro de frases técnicas ("Guard SQL:
 * VRESTREPO solo puede mutar…"), donde el reemplazo por nombre-propio-
 * capitalizado no los alcanza.
 */
const USUARIOS_SISTEMA: ReadonlyArray<readonly [RegExp, string]> = [
  [/\bVRESTREPO\b/g, 'el perfil solicitante'],
  [/\bJAGUDELOE\b/g, 'el perfil de ingeniería'],
];

/**
 * Las URLs se apartan antes de sanear y se reponen intactas. El bucket de R2 y
 * el worker llevan una cadena vetada en el nombre: sanear dentro de la URL la
 * rompe y la imagen deja de cargar.
 */
const URL_EN_TEXTO = /https?:\/\/[^\s)"'<>]+/g;
/** Marcador de hueco: área de uso privado, imposible en el texto de un tiquete. */
const MARCA = '\u{F8FF}';

const NOMBRE_PROPIO = /\b[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)+\b/g;

export const sanearTexto = (txt: string): string => {
  const urls: string[] = [];
  let s = String(txt).replace(URL_EN_TEXTO, (u) => {
    urls.push(u);
    return `${MARCA}${urls.length - 1}${MARCA}`;
  });

  for (const [patron, rol] of USUARIOS_SISTEMA) s = s.replace(patron, rol);

  if (NOMBRES_VETADOS.test(s)) {
    s = s.replace(NOMBRE_PROPIO, (n) => (NOMBRES_VETADOS.test(n) ? ROL_GENERICO : n));
    s = s.replace(NOMBRES_VETADOS, ROL_GENERICO);
  }

  return s.replace(new RegExp(`${MARCA}(\\d+)${MARCA}`, 'g'), (_, i: string) => urls[Number(i)] ?? '');
};

/** Recorre cualquier estructura y sanea cada string que encuentre. */
export const sanearProfundo = <T>(valor: T): T => {
  if (typeof valor === 'string') return sanearTexto(valor) as unknown as T;
  if (Array.isArray(valor)) return valor.map(sanearProfundo) as unknown as T;
  if (valor && typeof valor === 'object') {
    const salida: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(valor as Record<string, unknown>)) salida[k] = sanearProfundo(v);
    return salida as unknown as T;
  }
  return valor;
};

export const sanearTicket = (tk: TkTicket): TkTicket => sanearProfundo(tk);
