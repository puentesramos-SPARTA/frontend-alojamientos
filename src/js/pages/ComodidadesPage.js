import { listarComodidades } from '../api/publica.api.js';
import { estadoCargando, estadoError, estadoVacio } from '../components/Estados.js';
import { escapeHtml } from '../utils/formatters.js';

export async function mostrarComodidades({ contenedor, signal }) {
  contenedor.innerHTML = `<section class="container section-block">
    <div class="page-heading"><span class="eyebrow">SERVICIOS</span><h1>Catálogo de comodidades</h1>
      <p>Este catálogo proviene de <code>GET /api/v1/comodidades</code>. En Sprint 3 se incorporará su administración.</p></div>
    <div id="comodidades-lista">${estadoCargando('Consultando comodidades…')}</div></section>`;
  const lista = contenedor.querySelector('#comodidades-lista');
  try {
    const respuesta = await listarComodidades(signal);
    if (signal.aborted) return;
    if (!Array.isArray(respuesta?.data)) throw new Error('Formato inesperado de comodidades.');
    lista.innerHTML = respuesta.data.length
      ? `<div class="row g-3">${respuesta.data.map((item) => `<div class="col-sm-6 col-lg-4"><div class="amenity-card"><span class="amenity-icon"><i class="bi bi-check2-circle"></i></span><span>${escapeHtml(item.nombre)}</span></div></div>`).join('')}</div>`
      : estadoVacio('La API todavía no tiene comodidades registradas.');
  } catch (error) {
    if (signal.aborted) return;
    lista.innerHTML = estadoError(error);
  }
}