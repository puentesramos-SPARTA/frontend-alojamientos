/** Reglas del formulario, independientes del DOM y probables mediante Node. */
export function validarAlojamiento({ titulo, descripcion, ciudad, precio_noche }) {
  if (!titulo?.trim() || titulo.trim().length > 200) return 'El título es obligatorio (máximo 200 caracteres).';
  if (!descripcion?.trim()) return 'La descripción es obligatoria.';
  if (!ciudad?.trim() || ciudad.trim().length > 100) return 'La ciudad es obligatoria (máximo 100 caracteres).';
  const entrada = String(precio_noche ?? '').trim();
  if (!/^\d+(\.\d{1,2})?$/.test(entrada)) return 'Ingrese un precio positivo con máximo dos decimales; utilice punto decimal.';
  const numero = Number(entrada);
  if (!Number.isFinite(numero) || numero <= 0 || numero > 99999999.99) return 'El precio debe ser mayor que cero y caber en DECIMAL(10,2).';
  return null;
}

export function prepararAlojamiento(datos) {
  return {
    titulo: datos.titulo.trim(),
    descripcion: datos.descripcion.trim(),
    ciudad: datos.ciudad.trim(),
    precio_noche: Number(datos.precio_noche),
  };
}

export function validarComodidad(nombre) {
  if (!nombre?.trim() || nombre.trim().length > 100) return 'El nombre es obligatorio (máximo 100 caracteres).';
  return null;
}

/** La vista ayuda a orientar; Flask es quien realmente autoriza. */
export function puedeModificar(alojamiento, sesion) {
  if (!sesion?.usuario || !alojamiento) return false;
  const idPropietario = Number(alojamiento.usuario_id);
  const idActual = Number(sesion.usuario.id);
  return sesion.usuario.rol === 'admin' ||
    (Number.isSafeInteger(idActual) && idActual > 0 && idPropietario === idActual);
}

export function idsComodidadesSeleccionadas(form) {
  return [...form.querySelectorAll('input[name="comodidades_ids"]:checked')]
    .map((campo) => Number(campo.value))
    .filter((id) => Number.isSafeInteger(id) && id > 0);
}