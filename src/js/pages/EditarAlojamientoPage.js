import { consultarAlojamiento, listarComodidades } from '../api/publica.api.js';
import { actualizarAlojamiento, asignarComodidades, eliminarAlojamiento } from '../api/alojamientos.api.js';
import { pintarFormularioAlojamiento, datosDelFormulario } from '../components/AlojamientoForm.js';
import { pintarSelectorComodidades } from '../components/ComodidadesSelector.js';
import { estadoCargando, estadoError } from '../components/Estados.js';
import { escapeHtml } from '../utils/formatters.js';
import { idsComodidadesSeleccionadas, prepararAlojamiento, puedeModificar, validarAlojamiento } from '../utils/gestion.js';
import { obtenerSesion } from '../state/sesion.js';
import { navegar } from '../router/router.js';

export async function mostrarEditarAlojamiento({ contenedor, params, signal }) {
  contenedor.innerHTML = `<section class="container section-block"><div class="page-heading">
    <span class="eyebrow">GESTIÓN</span><h1>Editar alojamiento</h1></div>
    <div id="edicion-region">${estadoCargando('Cargando alojamiento y comodidades…')}</div></section>`;
  const region = contenedor.querySelector('#edicion-region');
  try {
    const [detalle, catalogo] = await Promise.all([
      consultarAlojamiento(params.id, signal), listarComodidades(signal),
    ]);
    if (signal.aborted) return;
    const alojamiento = detalle?.data;
    if (!alojamiento || !Array.isArray(catalogo?.data)) throw new Error('La API devolvió datos incompletos.');
    if (!puedeModificar(alojamiento, obtenerSesion())) {
      region.innerHTML = '<div class="alert alert-warning" role="alert">Solo el propietario o un administrador puede modificar este alojamiento.</div>';
      return;
    }
    region.innerHTML = `<p class="text-muted">Editando: <strong>${escapeHtml(alojamiento.titulo)}</strong></p>
      ${pintarFormularioAlojamiento(alojamiento)}
      <div class="management-card mt-4" id="bloque-comodidades">${pintarSelectorComodidades(catalogo.data, alojamiento.comodidades ?? [])}</div>
      <div class="danger-panel mt-4"><h2 class="h5">Eliminar alojamiento</h2>
        <p>Esta operación elimina el registro. El servidor exige que usted sea el propietario o administrador.</p>
        <div id="eliminar-feedback" aria-live="polite"></div>
        <button class="btn btn-outline-danger" id="eliminar-alojamiento" type="button">Eliminar definitivamente</button></div>`;
    const form = region.querySelector('#alojamiento-form');
    const feedback = region.querySelector('#alojamiento-feedback');
    const guardar = form.querySelector('[type="submit"]');
    form.addEventListener('submit', async (evento) => {
      evento.preventDefault();
      const datos = datosDelFormulario(form);
      const fallo = validarAlojamiento(datos);
      if (fallo) { feedback.innerHTML = estadoError(new Error(fallo)); return; }
      guardar.disabled = true;
      feedback.textContent = 'Guardando cambios…';
      try {
        await actualizarAlojamiento(params.id, prepararAlojamiento(datos), signal);
        if (!signal.aborted) navegar(`/alojamientos/${params.id}`);
      } catch (error) {
        if (!signal.aborted) feedback.innerHTML = estadoError(error);
      } finally { if (!signal.aborted) guardar.disabled = false; }
    });
    const botonComodidades = region.querySelector('#guardar-comodidades');
    if (botonComodidades) botonComodidades.addEventListener('click', async () => {
      const aviso = region.querySelector('#comodidades-feedback');
      const ids = idsComodidadesSeleccionadas(region);
      botonComodidades.disabled = true;
      aviso.textContent = 'Actualizando relaciones…';
      try {
        await asignarComodidades(params.id, ids, signal);
        if (!signal.aborted) aviso.innerHTML = '<div class="alert alert-success" role="status">Comodidades guardadas correctamente.</div>';
      } catch (error) {
        if (!signal.aborted) aviso.innerHTML = estadoError(error);
      } finally { if (!signal.aborted) botonComodidades.disabled = false; }
    });
    const eliminar = region.querySelector('#eliminar-alojamiento');
    eliminar.addEventListener('click', async () => {
      if (!window.confirm('¿Eliminar definitivamente este alojamiento? Esta acción no puede deshacerse.')) return;
      const aviso = region.querySelector('#eliminar-feedback');
      eliminar.disabled = true;
      aviso.textContent = 'Eliminando…';
      try {
        await eliminarAlojamiento(params.id, signal);
        if (!signal.aborted) navegar('/mis-alojamientos');
      } catch (error) {
        if (!signal.aborted) aviso.innerHTML = estadoError(error);
      } finally { if (!signal.aborted) eliminar.disabled = false; }
    });
  } catch (error) {
    if (signal.aborted) return;
    region.innerHTML = estadoError(error);
  }
}