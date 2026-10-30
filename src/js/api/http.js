import { API_BASE_URL } from '../config.js';
import { cerrarSesion } from '../state/sesion.js';

/** Peticiones públicas y protegidas con el contrato JSON real de Flask. */
export async function solicitarJSON(ruta, { method = 'GET', body, token, signal } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  let respuesta;
  try {
    respuesta = await fetch(`${API_BASE_URL}${ruta}`, {
      method, headers, signal,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch (error) {
    if (error?.name === 'AbortError') throw error;
    const fallo = new Error('No fue posible conectar con Flask. Compruebe el servidor y CORS para http://localhost:5173.');
    fallo.status = 0;
    throw fallo;
  }

  // Se prevé DELETE 204 para el Sprint 3; no debe interpretarse como JSON roto.
  if (respuesta.status === 204) return null;
  let cuerpo;
  try {
    cuerpo = await respuesta.json();
  } catch {
    const fallo = new Error('La API no devolvió un JSON válido.');
    fallo.status = respuesta.status;
    throw fallo;
  }
  if (!respuesta.ok) {
    // No cerrar sesión al recibir 401 de /login: todavía no se envió JWT.
    if (respuesta.status === 401 && token) cerrarSesion();
    const fallo = new Error(cuerpo?.error?.message || `Error HTTP ${respuesta.status}.`);
    fallo.status = respuesta.status;
    fallo.details = cuerpo?.error?.details;
    throw fallo;
  }
  return cuerpo;
}