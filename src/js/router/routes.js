import { mostrarInicio } from '../pages/InicioPage.js';
import { mostrarAlojamientos } from '../pages/AlojamientosPage.js';
import { mostrarDetalle } from '../pages/DetallePage.js';
import { mostrarComodidades } from '../pages/ComodidadesPage.js';
import { mostrarEstado } from '../pages/EstadoPage.js';
import { mostrarNoEncontrada } from '../pages/NoEncontradaPage.js';

const rutas = [
  { patron: /^\/$/, vista: mostrarInicio },
  { patron: /^\/alojamientos\/$/, vista: mostrarAlojamientos },
  { patron: /^\/alojamientos\/([1-9]\d*)$/, vista: mostrarDetalle, parametro: 'id' },
  { patron: /^\/comodidades$/, vista: mostrarComodidades },
  { patron: /^\/estado$/, vista: mostrarEstado },
];

/** Permite /alojamientos y /alojamientos/ sin duplicar una página. */
export function normalizarRuta(ruta) {
  const limpia = String(ruta || '/').split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  return limpia === '/alojamientos' ? '/alojamientos/' : limpia;
}

export function resolverRuta(ruta) {
  const normalizada = normalizarRuta(ruta);
  for (const { patron, vista, parametro } of rutas) {
    const coincidencia = normalizada.match(patron);
    if (coincidencia) {
      return { vista, params: parametro ? { [parametro]: coincidencia[1] } : {} };
    }
  }
  return { vista: mostrarNoEncontrada, params: {} };
}