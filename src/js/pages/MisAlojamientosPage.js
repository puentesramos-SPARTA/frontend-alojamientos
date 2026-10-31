import { listarAlojamientos } from '../api/publica.api.js';
import { pintarTarjetaAlojamiento } from '../components/AlojamientoCard.js';
import { estadoCargando, estadoError, estadoVacio } from '../components/Estados.js';
import { obtenerSesion } from '../state/sesion.js';

export async function mostrarMisAlojamientos({ contenedor, signal }) {
  contenedor.innerHTML = `<section class="container section-block">
    <div class="d-flex flex-wrap justify-content-between align-items-start gap-3 page-heading">
      <div><span class="eyebrow">MI ESPACIO</span><h1>Mis alojamientos</h1>
        <p>Esta vista filtra localmente el catálogo público por usuario_id. Flask no ofrece GET /mis-alojamientos.</p></div>
      <a class="btn btn-accent" href="/alojamientos/nuevo" data-link><i class="bi bi-plus-lg me-1"></i>Crear alojamiento</a>
    </div><div id="mis-lista">${estadoCargando('Consultando sus alojamientos…')}</div></section>`;
  const lista = contenedor.querySelector('#mis-lista');
  try {
    const respuesta = await listarAlojamientos(signal);
    if (signal.aborted) return;
    if (!Array.isArray(respuesta?.data)) throw new Error('Listado de alojamientos inesperado.');
    const usuarioId = Number(obtenerSesion()?.usuario?.id);
    const propios = respuesta.data.filter((a) => Number(a.usuario_id) === usuarioId);
    lista.innerHTML = propios.length
      ? `<div class="row g-4">${propios.map((a) => {
        const id = Number(a.id);
        if (!Number.isSafeInteger(id) || id < 1) return '';
        return `<div class="col-md-6 col-xl-4">${pintarTarjetaAlojamiento(a)}
          <a class="btn btn-outline-success w-100 mt-2" href="/alojamientos/${id}/editar" data-link>Editar y gestionar comodidades</a></div>`;
      }).join('')}</div>`
      : estadoVacio('Todavía no ha publicado alojamientos.');
  } catch (error) {
    if (!signal.aborted) lista.innerHTML = estadoError(error);
  }
}