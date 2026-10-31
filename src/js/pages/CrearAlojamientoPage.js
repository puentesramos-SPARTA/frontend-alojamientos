import { crearAlojamiento } from '../api/alojamientos.api.js';
import { pintarFormularioAlojamiento, datosDelFormulario } from '../components/AlojamientoForm.js';
import { estadoError } from '../components/Estados.js';
import { prepararAlojamiento, validarAlojamiento } from '../utils/gestion.js';
import { navegar } from '../router/router.js';

export async function mostrarCrearAlojamiento({ contenedor, signal }) {
  contenedor.innerHTML = `<section class="container section-block"><div class="page-heading">
    <span class="eyebrow">PUBLICACIÓN</span><h1>Crear alojamiento</h1>
    <p>El servidor toma el propietario del JWT; no envíe usuario_id desde el navegador.</p></div>
    ${pintarFormularioAlojamiento()}</section>`;
  const form = contenedor.querySelector('#alojamiento-form');
  const feedback = contenedor.querySelector('#alojamiento-feedback');
  const boton = form.querySelector('[type="submit"]');
  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const datos = datosDelFormulario(form);
    const fallo = validarAlojamiento(datos);
    if (fallo) { feedback.innerHTML = estadoError(new Error(fallo)); return; }
    boton.disabled = true;
    feedback.textContent = 'Publicando alojamiento…';
    try {
      const respuesta = await crearAlojamiento(prepararAlojamiento(datos), signal);
      if (signal.aborted) return;
      const id = Number(respuesta?.data?.id);
      if (!Number.isSafeInteger(id) || id < 1) throw new Error('La API no devolvió un ID válido.');
      navegar(`/alojamientos/${id}`);
    } catch (error) {
      if (!signal.aborted) feedback.innerHTML = estadoError(error);
    } finally {
      if (!signal.aborted) boton.disabled = false;
    }
  });
}