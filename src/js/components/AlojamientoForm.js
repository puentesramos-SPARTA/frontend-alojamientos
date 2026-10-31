import { escapeHtml } from '../utils/formatters.js';

/** Reutilizable para creación y actualización, sin depender de React. */
export function pintarFormularioAlojamiento(alojamiento = null) {
  const valor = (campo) => escapeHtml(alojamiento?.[campo] ?? '');
  return `<form id="alojamiento-form" class="management-card" novalidate>
    <div class="row g-3">
      <div class="col-12"><label class="form-label" for="alojamiento-titulo">Título *</label>
        <input class="form-control" id="alojamiento-titulo" name="titulo" maxlength="200" required
          value="${valor('titulo')}" placeholder="Ej.: Apartamento en Laureles" /></div>
      <div class="col-12"><label class="form-label" for="alojamiento-descripcion">Descripción *</label>
        <textarea class="form-control" id="alojamiento-descripcion" name="descripcion" rows="5" required>${valor('descripcion')}</textarea></div>
      <div class="col-md-6"><label class="form-label" for="alojamiento-ciudad">Ciudad *</label>
        <input class="form-control" id="alojamiento-ciudad" name="ciudad" maxlength="100" required value="${valor('ciudad')}" /></div>
      <div class="col-md-6"><label class="form-label" for="alojamiento-precio">Precio por noche (COP) *</label>
        <input class="form-control" id="alojamiento-precio" name="precio_noche" inputmode="decimal" type="number"
          min="0.01" max="99999999.99" step="0.01" required value="${valor('precio_noche')}" /></div>
    </div>
    <div class="mt-3" id="alojamiento-feedback" aria-live="polite"></div>
    <div class="d-flex gap-2 flex-wrap mt-4">
      <button class="btn btn-accent" type="submit">${alojamiento ? 'Guardar cambios' : 'Publicar alojamiento'}</button>
      <a href="${alojamiento ? `/alojamientos/${Number(alojamiento.id)}` : '/mis-alojamientos'}"
        class="btn btn-outline-secondary" data-link>Cancelar</a>
    </div>
  </form>`;
}

export function datosDelFormulario(form) {
  return {
    titulo: form.elements.titulo.value,
    descripcion: form.elements.descripcion.value,
    ciudad: form.elements.ciudad.value,
    precio_noche: form.elements.precio_noche.value,
  };
}