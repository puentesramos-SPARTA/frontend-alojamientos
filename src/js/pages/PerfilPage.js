import { consultarPerfil } from '../api/auth.api.js';
import { estadoCargando, estadoError } from '../components/Estados.js';
import { obtenerSesion } from '../state/sesion.js';
import { escapeHtml } from '../utils/formatters.js';

function campo(valor) { return valor == null || valor === '' ? 'Sin registrar' : escapeHtml(valor); }

export async function mostrarPerfil({ contenedor, signal }) {
  const usuario = obtenerSesion()?.usuario;
  contenedor.innerHTML = `<section class="container section-block">
    <div class="page-heading"><span class="eyebrow">CUENTA</span><h1>Mi perfil</h1>
    <p>Consulta protegida: <code>GET /api/v1/usuarios/perfil</code> con Bearer Token.</p></div>
    <div id="perfil-region" aria-live="polite">${estadoCargando('Cargando el perfil…')}</div>
  </section>`;
  const region = contenedor.querySelector('#perfil-region');
  try {
    const respuesta = await consultarPerfil(signal);
    if (signal.aborted) return;
    const perfil = respuesta?.data;
    if (!perfil || typeof perfil !== 'object') throw new Error('La API devolvió un perfil inesperado.');
    region.innerHTML = `<div class="account-card">
      <div class="account-avatar" aria-hidden="true"><i class="bi bi-person-circle"></i></div>
      <div><span class="eyebrow">DATOS DE LA CUENTA</span>
        <h2 class="h4 mt-2">${campo(usuario?.correo)}</h2>
        <p class="text-muted">Rol al iniciar sesión: <span class="badge text-bg-light">${campo(usuario?.rol)}</span></p>
        <dl class="row mb-0">
          <dt class="col-sm-5">ID de usuario</dt><dd class="col-sm-7">${campo(perfil.usuario_id)}</dd>
          <dt class="col-sm-5">Nombre</dt><dd class="col-sm-7">${campo(perfil.nombre)}</dd>
          <dt class="col-sm-5">Apellido</dt><dd class="col-sm-7">${campo(perfil.apellido)}</dd>
          <dt class="col-sm-5">Teléfono</dt><dd class="col-sm-7">${campo(perfil.telefono)}</dd>
        </dl>
        <p class="small text-muted mb-0 mt-3">Estos campos son solo de lectura: el backend proporcionado no expone PATCH de perfil.</p>
      </div>
    </div>`;
  } catch (error) {
    if (!signal.aborted) region.innerHTML = estadoError(error);
  }
}