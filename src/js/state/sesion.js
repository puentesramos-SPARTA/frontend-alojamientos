/**
 * Estado de sesión por pestaña. sessionStorage se vacía al cerrar la pestaña;
 * su contenido nunca concede permisos: cada petición es validada en Flask.
 */
const CLAVE = 'alojamientos-sesion-v1';

function almacenamiento() {
  try { return globalThis.sessionStorage ?? null; } catch { return null; }
}

function avisarCambio() {
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new Event('sesion-cambiada'));
  }
}

export function obtenerSesion() {
  const almacen = almacenamiento();
  if (!almacen) return null;
  try {
    const valor = almacen.getItem(CLAVE);
    if (!valor) return null;
    const datos = JSON.parse(valor);
    if (typeof datos?.token !== 'string' || !datos.token ||
        !datos.usuario || typeof datos.usuario.correo !== 'string' ||
        !['admin', 'usuario'].includes(datos.usuario.rol)) {
      almacen.removeItem(CLAVE);
      return null;
    }
    return datos;
  } catch {
    try { almacen.removeItem(CLAVE); } catch { /* Storage restringido */ }
    return null;
  }
}

export function guardarSesion(accessToken, usuario) {
  if (typeof accessToken !== 'string' || !accessToken ||
      !usuario || typeof usuario.correo !== 'string' ||
      !['admin', 'usuario'].includes(usuario.rol)) {
    throw new Error('El login no devolvió una sesión válida.');
  }
  const almacen = almacenamiento();
  if (!almacen) throw new Error('El navegador impide guardar la sesión en esta pestaña.');
  const sesion = {
    token: accessToken,
    usuario: { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
  };
  almacen.setItem(CLAVE, JSON.stringify(sesion));
  avisarCambio();
  return sesion;
}

export function cerrarSesion() {
  try { almacenamiento()?.removeItem(CLAVE); } catch { /* Bloqueo de Storage */ }
  avisarCambio();
}

export function obtenerToken() {
  return obtenerSesion()?.token ?? null;
}

export function esAdmin() {
  return obtenerSesion()?.usuario?.rol === 'admin';
}