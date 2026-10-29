import { API_BASE_URL } from '../config.js';

/**
 * Cliente para rutas públicas. Devuelve el objeto de la API completo,
 * por ejemplo { success: true, data: [...] } o { status: 'ok', ... }.
 */
export async function obtenerJSON(ruta, { signal } = {}) {
  let respuesta;
  try {
    respuesta = await fetch(`${API_BASE_URL}${ruta}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal,
    });
  } catch (error) {
    if (error?.name === 'AbortError') throw error;
    const fallo = new Error('No fue posible conectar con Flask. Revise que la API esté iniciada y que CORS permita http://localhost:5173.');
    fallo.status = 0;
    throw fallo;
  }

  let cuerpo;
  try {
    cuerpo = await respuesta.json();
  } catch {
    const fallo = new Error('La API no devolvió un JSON válido.');
    fallo.status = respuesta.status;
    throw fallo;
  }

  if (!respuesta.ok) {
    const fallo = new Error(cuerpo?.error?.message || `Error HTTP ${respuesta.status}.`);
    fallo.status = respuesta.status;
    fallo.details = cuerpo?.error?.details;
    throw fallo;
  }

  return cuerpo;
}