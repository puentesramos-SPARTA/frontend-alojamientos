import { consultarSalud } from '../api/publica.api.js';

export async function mostrarInicio({ contenedor, signal }) {
  contenedor.innerHTML = `
    <section class="hero-wrap">
      <div class="container hero-grid">
        <div class="hero-copy">
          <div class="pill-label"><span class="pulse-dot"></span> Una nueva forma de explorar</div>
          <h1>Encuentra tu próximo <em>espacio favorito.</em></h1>
          <p>Explora alojamientos registrados en la plataforma. Consulta su ciudad, precio por noche y comodidades; sin necesidad de iniciar sesión.</p>
          <div class="d-flex gap-3 flex-wrap mt-4">
            <a href="/alojamientos" data-link class="btn btn-accent btn-lg">Explorar alojamientos <i class="bi bi-arrow-up-right ms-1"></i></a>
            <a href="/comodidades" data-link class="btn btn-outline-light btn-lg">Ver comodidades</a>
          </div>
          <div class="hero-connect" id="home-health" role="status">Comprobando conexión con Flask…</div>
        </div>
        <div class="hero-art" aria-hidden="true">
          <div class="hero-orbit orbit-one"></div><div class="hero-orbit orbit-two"></div>
          <div class="hero-building"><span class="building-window"></span><span class="building-window"></span><span class="building-window"></span></div>
          <div class="hero-art-badge"><i class="bi bi-compass"></i><span>Tu próxima estancia<br><strong>comienza aquí</strong></span></div>
        </div>
      </div>
    </section>
    <section class="container section-block">
      <div class="row g-4">
        <div class="col-md-4"><div class="feature-tile"><i class="bi bi-search"></i><h2 class="h5 mt-3">Explora el catálogo</h2><p>Consulta los alojamientos disponibles en los registros públicos de la API.</p></div></div>
        <div class="col-md-4"><div class="feature-tile"><i class="bi bi-card-checklist"></i><h2 class="h5 mt-3">Revisa los detalles</h2><p>Conoce la ubicación, descripción y precio por noche de cada alojamiento.</p></div></div>
        <div class="col-md-4"><div class="feature-tile"><i class="bi bi-wifi"></i><h2 class="h5 mt-3">Descubre comodidades</h2><p>Conoce los servicios registrados y las comodidades asociadas a cada lugar.</p></div></div>
      </div>
    </section>`;

  const mensaje = contenedor.querySelector('#home-health');
  try {
    const salud = await consultarSalud(signal);
    if (signal.aborted) return;
    const correcto = salud?.status === 'ok';
    mensaje.className = `hero-connect ${correcto ? 'is-online' : 'is-offline'}`;
    mensaje.textContent = correcto
      ? `API conectada · ${salud.service || 'alojamientos-api'} · ${salud.version || 'v1'}`
      : `La API respondió: ${salud?.status || 'estado no reconocido'}`;
  } catch (error) {
    if (signal.aborted) return;
    mensaje.className = 'hero-connect is-offline';
    mensaje.textContent = error.message || 'La API no está disponible.';
  }
}