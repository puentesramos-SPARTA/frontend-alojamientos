import { solicitarJSON } from './http.js';
import { obtenerToken } from '../state/sesion.js';

/** Contratos literales del backend Flask, sin endpoints adicionales. */
export function crearAlojamiento(datos, signal) {
  return solicitarJSON('/api/v1/alojamientos', {
    method: 'POST', body: datos, token: obtenerToken(), signal,
  });
}

export function actualizarAlojamiento(id, datos, signal) {
  return solicitarJSON(`/api/v1/alojamientos/${id}`, {
    method: 'PATCH', body: datos, token: obtenerToken(), signal,
  });
}

export function eliminarAlojamiento(id, signal) {
  // Flask responde 204 sin contenido; el cliente HTTP retorna null.
  return solicitarJSON(`/api/v1/alojamientos/${id}`, {
    method: 'DELETE', token: obtenerToken(), signal,
  });
}

export function asignarComodidades(id, comodidadesIds, signal) {
  // Reemplaza toda la relación N:M, no agrega una comodidad individual.
  return solicitarJSON(`/api/v1/alojamientos/${id}/comodidades`, {
    method: 'PATCH', body: { comodidades_ids: comodidadesIds }, token: obtenerToken(), signal,
  });
}