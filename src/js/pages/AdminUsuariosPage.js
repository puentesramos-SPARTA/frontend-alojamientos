import { listarUsuariosAdmin } from '../api/auth.api.js';
import { estadoCargando, estadoError, estadoVacio } from '../components/Estados.js';
import { escapeHtml } from '../utils/formatters.js';

export async function mostrarAdminUsuarios({ contenedor, signal }) {
  contenedor.innerHTML = `<section class="container section-block">
    <div class="page-heading"><span class="eyebrow">ADMINISTRACIÓN</span><h1>Usuarios registrados</h1>
    <p>Vista de solo lectura. Flask valida en MySQL el rol actual de quien envía el JWT.</p></div>
    <div id="admin-region" aria-live="polite">${estadoCargando('Consultando usuarios…')}</div>
  </section>`;
  const region = contenedor.querySelector('#admin-region');
  try {
    const respuesta = await listarUsuariosAdmin(signal);
    if (signal.aborted) return;
    const usuarios = respuesta?.data;
    if (!Array.isArray(usuarios)) throw new Error('La API devolvió un listado de usuarios inesperado.');
    region.innerHTML = usuarios.length ? `<div class="table-responsive account-table"><table class="table table-hover align-middle mb-0">
      <caption class="visually-hidden">Usuarios registrados en la aplicación</caption>
      <thead><tr><th scope="col">ID</th><th scope="col">Correo</th><th scope="col">Rol</th></tr></thead>
      <tbody>${usuarios.map((usuario) => `<tr><td>${escapeHtml(usuario.id)}</td><td>${escapeHtml(usuario.correo)}</td>
        <td><span class="badge ${usuario.rol === 'admin' ? 'text-bg-success' : 'text-bg-secondary'}">${escapeHtml(usuario.rol)}</span></td></tr>`).join('')}</tbody>
      </table></div>` : estadoVacio('Todavía no hay usuarios registrados.');
  } catch (error) {
    if (!signal.aborted) region.innerHTML = estadoError(error);
  }
}