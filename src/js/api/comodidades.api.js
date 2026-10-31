import { solicitarJSON } from './http.js';
import { obtenerToken } from '../state/sesion.js';

export function crearComodidad(nombre, signal) {
  return solicitarJSON('/api/v1/comodidades', {
    method: 'POST', body: { nombre }, token: obtenerToken(), signal,
  });
}