import { escapeHtml } from '../utils/formatters.js';

const enlaces = [
  { ruta: '/', nombre: 'Inicio' },
  { ruta: '/alojamientos', nombre: 'Alojamientos' },
  { ruta: '/comodidades', nombre: 'Comodidades' },
  { ruta: '/estado', nombre: 'Estado de API' },
];

export function pintarNavbar(rutaActual) {
  const links = enlaces.map(({ ruta, nombre }) => {
    const activo = ruta === '/' ? rutaActual === '/' : rutaActual.startsWith(ruta);
    return `<li class="nav-item"><a class="nav-link ${activo ? 'active' : ''}"
      ${activo ? 'aria-current="page"' : ''} href="${ruta}" data-link>${escapeHtml(nombre)}</a></li>`;
  }).join('');

  return `
    <nav class="navbar navbar-expand-lg site-navbar" aria-label="Navegación principal">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center gap-2" href="/" data-link>
          <span class="brand-mark" aria-hidden="true"><i class="bi bi-house-heart-fill"></i></span>
          <span>Aloja<span class="brand-dot">.</span></span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu"
          aria-controls="navbarMenu" aria-expanded="false" aria-label="Mostrar navegación">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarMenu">
          <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">${links}</ul>
          <span class="ms-lg-4 navbar-note d-none d-lg-inline">Explora sin registrarte</span>
        </div>
      </div>
    </nav>`;
}