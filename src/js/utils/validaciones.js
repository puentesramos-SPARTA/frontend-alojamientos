/** Validaciones inmediatas de UX; Marshmallow sigue siendo la autoridad. */
export function validarRegistro({ correo, contrasena, confirmar }) {
  if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    return 'Escriba un correo con formato válido.';
  }
  if (!contrasena || contrasena.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres.';
  }
  if (contrasena !== confirmar) {
    return 'La confirmación no coincide con la contraseña.';
  }
  return null;
}

export function validarLogin({ correo, contrasena }) {
  if (!correo?.trim() || !contrasena) return 'Ingrese correo y contraseña.';
  return null;
}

/** Solo se permite redirigir a vistas privadas conocidas, nunca a otra web. */
export function destinoTrasLogin(search, rol) {
  const destino = new URLSearchParams(search).get('next');
  if (destino === '/admin/usuarios' && rol === 'admin') return destino;
  return '/perfil';
}