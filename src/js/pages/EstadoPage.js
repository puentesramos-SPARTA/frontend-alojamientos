import { consultarSalud } from '../api/publica.api.js';
import { estadoCargando, estadoError } from '../components/Estados.js';
import { escapeHtml } from '../utils/formatters.js';

export async function mostrarEstado({ contenedor, signal }) {
  contenedor.innerHTML = `<section class="container section-block">
    <div class="page-heading"><span class="eyebrow">CONECTIVIDAD</span><h1>Estado del servicio</h1>
    <p>Prueba real del endpoint público <code>GET /health</code>.</p></div>
    <div id="estado-api">${estadoCargando('Comprobando la conexión…')}</div>
  </section>`;
  const region = contenedor.querySelector('#estado-api');
  try {
    const datos = await consultarSalud(signal);
    if (signal.aborted) return;
    region.innerHTML = `<div class="status-card"><i class="bi bi-check-circle-fill status-icon"></i>
      <h2 class="h4 mt-3">Respuesta recibida</h2>
      <dl class="row mt-4 mb-0">
        <dt class="col-sm-3">Estado</dt><dd class="col-sm-9">${escapeHtml(datos.status)}</dd>
        <dt class="col-sm-3">Servicio</dt><dd class="col-sm-9">${escapeHtml(datos.service)}</dd>
        <dt class="col-sm-3">Versión</dt><dd class="col-sm-9">${escapeHtml(datos.version)}</dd>
      </dl></div>`;
  } catch (error) {
    if (signal.aborted) return;
    region.innerHTML = estadoError(error);
  }
}