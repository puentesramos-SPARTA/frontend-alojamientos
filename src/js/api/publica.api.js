import { solicitarJSON } from './http.js';

export function consultarSalud(signal) {
  return solicitarJSON('/health', { signal });
}

export function listarAlojamientos(signal) {
  return solicitarJSON('/api/v1/alojamientos', { signal });
}

export function consultarAlojamiento(id, signal) {
  return solicitarJSON(`/api/v1/alojamientos/${id}`, { signal });
}

export function listarComodidades(signal) {
  return solicitarJSON('/api/v1/comodidades', { signal });
}