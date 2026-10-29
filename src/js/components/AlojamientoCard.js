import { escapeHtml, formatearCOP, resumen } from '../utils/formatters.js';

export function pintarTarjetaAlojamiento(alojamiento) {
  const id = Number(alojamiento?.id);
  if (!Number.isSafeInteger(id) || id < 1) return '';
  const titulo = escapeHtml(alojamiento.titulo);
  const ciudad = escapeHtml(alojamiento.ciudad);
  const descripcion = escapeHtml(resumen(alojamiento.descripcion));
  return `
    <article class="stay-card h-100">
      <div class="stay-illustration" aria-hidden="true">
        <div class="art-sun"></div><div class="art-hill art-hill-back"></div><div class="art-hill art-hill-front"></div>
        <i class="bi bi-house-door-fill art-house"></i>
        <span class="illustration-tag">CATÁLOGO</span>
      </div>
      <div class="stay-content">
        <span class="eyebrow"><i class="bi bi-geo-alt me-1"></i>${ciudad}</span>
        <h3 class="h5 mt-2 mb-2">${titulo}</h3>
        <p class="stay-description">${descripcion}</p>
        <div class="stay-bottom d-flex justify-content-between align-items-center gap-3">
          <div><strong>${escapeHtml(formatearCOP(alojamiento.precio_noche))}</strong><span class="text-muted small"> / noche</span></div>
          <a class="btn btn-outline-dark btn-sm" href="/alojamientos/${id}" data-link>Ver detalle <i class="bi bi-arrow-right ms-1"></i></a>
        </div>
      </div>
    </article>`;
}