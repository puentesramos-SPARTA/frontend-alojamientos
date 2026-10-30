import { registrarUsuario } from '../api/auth.api.js';
import { estadoError } from '../components/Estados.js';
import { escapeHtml } from '../utils/formatters.js';
import { validarRegistro } from '../utils/validaciones.js';

export async function mostrarRegistro({ contenedor, signal }) {
  contenedor.innerHTML = `<section class="container section-block auth-section">
    <div class="auth-card"><span class="eyebrow">CREAR CUENTA</span><h1 class="h2 fw-bold mt-2">Regístrese en Aloja.</h1>
    <p class="text-muted">El servidor creará un usuario con rol <strong>usuario</strong>. El registro no inicia sesión automáticamente.</p>
    <form id="registro-form" novalidate>
      <div class="mb-3"><label class="form-label" for="registro-correo">Correo electrónico</label>
        <input class="form-control" id="registro-correo" name="correo" type="email" autocomplete="email" required maxlength="255" /></div>
      <div class="mb-3"><label class="form-label" for="registro-contrasena">Contraseña (mínimo 6 caracteres)</label>
        <input class="form-control" id="registro-contrasena" name="contrasena" type="password" autocomplete="new-password" minlength="6" required /></div>
      <div class="mb-3"><label class="form-label" for="registro-confirmar">Confirmar contraseña</label>
        <input class="form-control" id="registro-confirmar" name="confirmar" type="password" autocomplete="new-password" minlength="6" required /></div>
      <div id="registro-feedback" aria-live="polite"></div>
      <button class="btn btn-accent w-100" type="submit">Crear cuenta</button>
    </form>
    <p class="small text-muted mt-3 mb-0">¿Ya tiene cuenta? <a href="/login" data-link>Iniciar sesión</a>.</p>
    </div></section>`;

  const form = contenedor.querySelector('#registro-form');
  const feedback = contenedor.querySelector('#registro-feedback');
  const boton = form.querySelector('button[type="submit"]');
  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const datos = {
      correo: form.elements.correo.value.trim(),
      contrasena: form.elements.contrasena.value,
      confirmar: form.elements.confirmar.value,
    };
    const fallo = validarRegistro(datos);
    if (fallo) { feedback.innerHTML = estadoError(new Error(fallo)); return; }
    boton.disabled = true;
    feedback.textContent = 'Creando cuenta…';
    try {
      const respuesta = await registrarUsuario({ correo: datos.correo, contrasena: datos.contrasena }, signal);
      if (signal.aborted) return;
      if (!respuesta?.data?.id) throw new Error('El registro no devolvió el identificador esperado.');
      feedback.innerHTML = `<div class="alert alert-success" role="status">Cuenta creada para <strong>${escapeHtml(respuesta.data.correo)}</strong>. Ahora puede <a href="/login" data-link>iniciar sesión</a>.</div>`;
      form.reset();
    } catch (error) {
      if (!signal.aborted) feedback.innerHTML = estadoError(error);
    } finally {
      if (!signal.aborted) boton.disabled = false;
    }
  });
}