import { mostrarInicio } from '../pages/InicioPage.js';
import { mostrarAlojamientos } from '../pages/AlojamientosPage.js';
import { mostrarDetalle } from '../pages/DetallePage.js';
import { mostrarComodidades } from '../pages/ComodidadesPage.js';
import { mostrarEstado } from '../pages/EstadoPage.js';
import { mostrarNoEncontrada } from '../pages/NoEncontradaPage.js';
import { mostrarRegistro } from '../pages/RegistroPage.js';
import { mostrarLogin } from '../pages/LoginPage.js';
import { mostrarPerfil } from '../pages/PerfilPage.js';
import { mostrarAdminUsuarios } from '../pages/AdminUsuariosPage.js';

const rutas = [
  { patron: /^\/$/, vista: mostrarInicio },
  { patron: /^\/alojamientos\/$/, vista: mostrarAlojamientos },
  { patron: /^\/alojamientos\/([1-9]\d*)$/, vista: mostrarDetalle, parametro: 'id' },
  { patron: /^\/comodidades$/, vista: mostrarComodidades },
  { patron: /^\/estado$/, vista: mostrarEstado },
  { patron: /^\/registro$/, vista: mostrarRegistro },
  { patron: /^\/login$/, vista: mostrarLogin },
  { patron: /^\/perfil$/, vista: mostrarPerfil, requiereAuth: true },
  { patron: /^\/admin\/usuarios$/, vista: mostrarAdminUsuarios, requiereAuth: true, requiereAdmin: true },
];

export function normalizarRuta(ruta) {
  const limpia = String(ruta || '/').split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  return limpia === '/alojamientos' ? '/alojamientos/' : limpia;
}

export function resolverRuta(ruta) {
  const normalizada = normalizarRuta(ruta);
  for (const { patron, vista, parametro, requiereAuth = false, requiereAdmin = false } of rutas) {
    const coincidencia = normalizada.match(patron);
    if (coincidencia) {
      return { vista, params: parametro ? { [parametro]: coincidencia[1] } : {}, requiereAuth, requiereAdmin };
    }
  }
  return { vista: mostrarNoEncontrada, params: {}, requiereAuth: false, requiereAdmin: false };
}