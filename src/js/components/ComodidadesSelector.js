import { escapeHtml } from '../utils/formatters.js';

/** Un CHECKED por cada comodidad asociada. PATCH sustituye la selección completa. */
export function pintarSelectorComodidades(comodidades, seleccionadas = []) {
  const actuales = new Set(seleccionadas.map((x) => Number(x.id)));
  if (comodidades.length === 0) return '<p class="text-muted">No existen comodidades. Un administrador debe crearlas primero.</p>';
  return `<fieldset class="amenities-fieldset"><legend class="h5 mb-3">Comodidades asociadas</legend>
    <p class="small text-muted">Marque las comodidades y guarde la selección completa. Desmarcarlas todas elimina las asociaciones.</p>
    <div class="row g-2">${comodidades.map((c) => {
      const id = Number(c.id);
      if (!Number.isSafeInteger(id) || id < 1) return '';
      return `<div class="col-sm-6 col-lg-4"><label class="amenity-option">
        <input class="form-check-input" type="checkbox" name="comodidades_ids" value="${id}" ${actuales.has(id) ? 'checked' : ''} />
        <span>${escapeHtml(c.nombre)}</span></label></div>`;
    }).join('')}</div>
    <div id="comodidades-feedback" class="mt-3" aria-live="polite"></div>
    <button class="btn btn-outline-success mt-2" type="button" id="guardar-comodidades">Guardar comodidades</button>
  </fieldset>`;
}