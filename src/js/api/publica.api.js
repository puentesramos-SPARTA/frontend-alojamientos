import { obtenerJSON } from './http.js';

export function consultarSalud(signal) {
  return obtenerJSON('/health', { signal });
}

export function listarAlojamientos(signal) {
  return obtenerJSON('/api/v1/alojamientos', { signal });
}

export function consultarAlojamiento(id, signal) {
  return obtenerJSON(`/api/v1/alojamientos/${id}`, { signal });
}

export function listarComodidades(signal) {
  return obtenerJSON('/api/v1/comodidades', { signal });
}