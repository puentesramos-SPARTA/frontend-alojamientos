import { consultarAlojamiento } from '../api/publica.api.js';
import { estadoCargando, estadoError } from '../components/Estados.js';
import { escapeHtml, formatearCOP } from '../utils/formatters.js';

export async function mostrarDetalle({ contenedor, params, signal }) {
  contenedor.innerHTML = `<section class="container section-block"><a href="/alojamientos" class="back-link" data-link><i class="bi bi-arrow-left me-2"></i>Volver al catálogo</a>
    <div id="detalle" class="mt-4">${estadoCargando('Cargando el alojamiento…')}</div></section>`;
  const region = contenedor.querySelector('#detalle');
  try {
    const respuesta = await consultarAlojamiento(params.id, signal);
    if (signal.aborted) return;
    const alojamiento = respuesta?.data;
    if (!alojamiento || typeof alojamiento !== 'object') throw new Error('La API no devolvió los datos del alojamiento.');
    const comodidades = Array.isArray(alojamiento.comodidades) ? alojamiento.comodidades : [];
    region.innerHTML = `
      <div class="detail-banner" aria-hidden="true"><i class="bi bi-buildings-fill"></i><span>DETALLE DEL ALOJAMIENTO</span></div>
      <div class="row g-5 mt-1">
        <div class="col-lg-8">
          <span class="eyebrow"><i class="bi bi-geo-alt me-1"></i>${escapeHtml(alojamiento.ciudad)}</span>
          <h1 class="display-6 fw-bold mt-2">${escapeHtml(alojamiento.titulo)}</h1>
          <p class="lead detail-description">${escapeHtml(alojamiento.descripcion)}</p>
          <h2 class="h5 mt-5 mb-3">Comodidades del alojamiento</h2>
          <div class="d-flex flex-wrap gap-2">${comodidades.length
            ? comodidades.map((item) => `<span class="amenity-pill"><i class="bi bi-check-circle me-2"></i>${escapeHtml(item.nombre)}</span>`).join('')
            : '<p class="text-muted">Este alojamiento todavía no tiene comodidades asociadas.</p>'}</div>
        </div>
        <div class="col-lg-4"><aside class="price-panel"><span class="eyebrow">PRECIO DE REFERENCIA</span>
          <div class="price-value">${escapeHtml(formatearCOP(alojamiento.precio_noche))}</div>
          <p class="text-muted">por noche</p><hr /><p class="small mb-0">El backend de estos sprints no incluye reservas ni pagos. Este precio es informativo.</p>
        </aside></div>
      </div>`;
  } catch (error) {
    if (signal.aborted) return;
    region.innerHTML = error.status === 404
      ? `<div class="state-panel state-empty"><h1 class="h4">Alojamiento no encontrado</h1><p>El identificador solicitado no existe.</p><a href="/alojamientos" data-link>Volver al catálogo</a></div>`
      : estadoError(error);
  }
}