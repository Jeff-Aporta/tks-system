/**
 * cache.ts — caché local de tiquetes en IndexedDB.
 *
 * Vigencia: 15 minutos. Pasado ese plazo el dato sigue en disco pero se marca
 * vencido; quien lo lea decide si le sirve. Esa distinción es la que permite
 * seguir mostrando documentación cuando el worker no responde.
 */

const BD = 'jagudeloe-tks';
const VERSION = 1;
const ALMACEN = 'tickets';
const VIGENCIA_MS = 15 * 60 * 1000;

interface Registro {
  readonly clave: string;
  readonly data: unknown;
  readonly guardadoEn: number;
}

let conexion: Promise<IDBDatabase> | null = null;

const abrir = (): Promise<IDBDatabase> => {
  conexion ??= new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(BD, VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(ALMACEN)) {
        db.createObjectStore(ALMACEN, { keyPath: 'clave' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('IndexedDB no disponible'));
  });
  return conexion;
};

const transaccion = async <T>(
  modo: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> => {
  const db = await abrir();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(ALMACEN, modo);
    const req = fn(tx.objectStore(ALMACEN));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('Fallo de IndexedDB'));
  });
};

export const cache: TkCacheApi = {
  vigenciaMs: VIGENCIA_MS,

  async leer<T>(clave: string, vigenciaMs: number = VIGENCIA_MS): Promise<TkCacheEntrada<T> | null> {
    try {
      const reg = await transaccion<Registro | undefined>('readonly', (s) => s.get(clave) as IDBRequest<Registro | undefined>);
      if (!reg) return null;
      return {
        data: reg.data as T,
        guardadoEn: reg.guardadoEn,
        // El plazo lo decide quien lee: el visor refresca cada 15 min, pero una
        // ficha suelta no necesita pegarle al worker más de una vez al día.
        vencida: Date.now() - reg.guardadoEn > vigenciaMs,
      };
    } catch {
      // Navegación privada o cuota agotada: la caché es una mejora, no un requisito.
      return null;
    }
  },

  async escribir(clave: string, data: unknown): Promise<number> {
    const guardadoEn = Date.now();
    try {
      await transaccion('readwrite', (s) => s.put({ clave, data, guardadoEn } satisfies Registro));
    } catch {
      /* sin caché se sigue funcionando contra red */
    }
    return guardadoEn;
  },

  async limpiar(): Promise<void> {
    try {
      await transaccion('readwrite', (s) => s.clear());
    } catch {
      /* nada que limpiar */
    }
  },
};
