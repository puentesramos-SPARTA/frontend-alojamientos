import { crearComodidad } from '../api/comodidades.api.js';
import { estadoError } from '../components/Estados.js';
import { escapeHtml } from '../utils/formatters.js';
import { validarComodidad } from '../utils/gestion.js';

export async function mostrarAdminCrearComodidad({ contenedor, signal }) {
  contenedor.innerHTML = `<section class="container section-block auth-section"><div class="auth-card">
    <span class="eyebrow">ADMINISTRACIÓN</span><h1 class="h2 fw-bold mt-2">Nueva comodidad</h1>
    <p class="text-muted">Solo un usuario con rol admin puede crear una comodidad en Flask.</p>
    <form id="crear-comodidad-form" novalidate>
      <label class="form-label" for="nombre-comodidad">Nombre de la comodidad</label>
      <input class="form-control" id="nombre-comodidad" name="nombre" maxlength="100" required placeholder="Ej.: WiFi" />
      <div id="nueva-comodidad-feedback" class="mt-3" aria-live="polite"></div>
      <button type="submit" class="btn btn-accent mt-3">Crear comodidad</button>
    </form>
    <a href="/comodidades" data-link class="d-inline-block mt-4">Ver catálogo público</a>
  </div></section>`;
  const form = contenedor.querySelector('#crear-comodidad-form');
  const feedback = contenedor.querySelector('#nueva-comodidad-feedback');
  const boton = form.querySelector('[type="submit"]');
  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const nombre = form.elements.nombre.value.trim();
    const fallo = validarComodidad(nombre);
    if (fallo) { feedback.innerHTML = estadoError(new Error(fallo)); return; }
    boton.disabled = true;
    feedback.textContent = 'Creando comodidad…';
    try {
      const respuesta = await crearComodidad(nombre, signal);
      if (signal.aborted) return;
      if (!respuesta?.data?.id) throw new Error('La API no confirmó la creación.');
      feedback.innerHTML = `<div class="alert alert-success" role="status">Comodidad <strong>${escapeHtml(respuesta.data.nombre)}</strong> creada.</div>`;
      form.reset();
    } catch (error) {
      if (!signal.aborted) feedback.innerHTML = estadoError(error);
    } finally { if (!signal.aborted) boton.disabled = false; }
  });
}