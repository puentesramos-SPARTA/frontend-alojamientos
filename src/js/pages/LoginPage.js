import { iniciarSesionAPI } from '../api/auth.api.js';
import { estadoError } from '../components/Estados.js';
import { guardarSesion } from '../state/sesion.js';
import { navegar } from '../router/router.js';
import { destinoTrasLogin, validarLogin } from '../utils/validaciones.js';

export async function mostrarLogin({ contenedor, signal }) {
  contenedor.innerHTML = `<section class="container section-block auth-section">
    <div class="auth-card"><span class="eyebrow">ÁREA PERSONAL</span><h1 class="h2 fw-bold mt-2">Iniciar sesión</h1>
    <p class="text-muted">Utilice el correo y la contraseña registrados en la API Flask.</p>
    <form id="login-form" novalidate>
      <div class="mb-3"><label class="form-label" for="login-correo">Correo electrónico</label>
        <input class="form-control" id="login-correo" name="correo" type="email" autocomplete="username" required /></div>
      <div class="mb-3"><label class="form-label" for="login-contrasena">Contraseña</label>
        <input class="form-control" id="login-contrasena" name="contrasena" type="password" autocomplete="current-password" required /></div>
      <div id="login-feedback" aria-live="polite"></div>
      <button class="btn btn-accent w-100" type="submit">Ingresar</button>
    </form>
    <p class="small text-muted mt-3 mb-0">¿No tiene cuenta? <a href="/registro" data-link>Registrarse</a>.</p>
    </div></section>`;
  const form = contenedor.querySelector('#login-form');
  const feedback = contenedor.querySelector('#login-feedback');
  const boton = form.querySelector('button[type="submit"]');
  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const datos = {
      correo: form.elements.correo.value.trim(),
      contrasena: form.elements.contrasena.value,
    };
    const fallo = validarLogin(datos);
    if (fallo) { feedback.innerHTML = estadoError(new Error(fallo)); return; }
    boton.disabled = true;
    feedback.textContent = 'Validando credenciales…';
    try {
      const respuesta = await iniciarSesionAPI(datos, signal);
      if (signal.aborted) return;
      const { access_token: token, usuario } = respuesta?.data ?? {};
      guardarSesion(token, usuario);
      navegar(destinoTrasLogin(window.location.search, usuario.rol));
    } catch (error) {
      if (!signal.aborted) feedback.innerHTML = estadoError(error);
    } finally {
      if (!signal.aborted) boton.disabled = false;
    }
  });
}