import { escapeHtml } from '../utils/formatters.js';

export function estadoCargando(mensaje = 'Cargando información…') {
  return `<div class="state-panel" role="status"><span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>${escapeHtml(mensaje)}</div>`;
}

export function estadoVacio(mensaje) {
  return `<div class="state-panel state-empty"><i class="bi bi-inbox me-2" aria-hidden="true"></i>${escapeHtml(mensaje)}</div>`;
}

export function estadoError(error, mensaje = 'No fue posible cargar los datos.') {
  return `<div class="alert alert-danger app-alert" role="alert"><strong>Atención.</strong> ${escapeHtml(error?.message || mensaje)}</div>`;
}