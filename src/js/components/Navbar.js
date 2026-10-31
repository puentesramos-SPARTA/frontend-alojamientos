import { obtenerSesion } from '../state/sesion.js';
import { escapeHtml } from '../utils/formatters.js';

const enlacesPublicos = [
  { ruta: '/', nombre: 'Inicio' },
  { ruta: '/alojamientos', nombre: 'Alojamientos' },
  { ruta: '/comodidades', nombre: 'Comodidades' },
  { ruta: '/estado', nombre: 'Estado de API' },
];

export function pintarNavbar(rutaActual) {
  const sesion = obtenerSesion();
  const enlaces = [...enlacesPublicos];
  if (sesion) {
    enlaces.push({ ruta: '/mis-alojamientos', nombre: 'Mis alojamientos' });
    enlaces.push({ ruta: '/alojamientos/nuevo', nombre: 'Publicar' });
    enlaces.push({ ruta: '/perfil', nombre: 'Mi perfil' });
    if (sesion.usuario.rol === 'admin') {
      enlaces.push({ ruta: '/admin/usuarios', nombre: 'Usuarios' });
      enlaces.push({ ruta: '/admin/comodidades/nueva', nombre: 'Nueva comodidad' });
    }
  }
  const links = enlaces.map(({ ruta, nombre }) => {
    const activo = ruta === '/' ? rutaActual === '/' : rutaActual.startsWith(ruta);
    return `<li class="nav-item"><a class="nav-link ${activo ? 'active' : ''}"
      ${activo ? 'aria-current="page"' : ''} href="${ruta}" data-link>${escapeHtml(nombre)}</a></li>`;
  }).join('');
  const acciones = sesion
    ? `<li class="nav-item"><span class="navbar-note navbar-identidad">${escapeHtml(sesion.usuario.correo)}</span></li>
       <li class="nav-item"><button class="btn btn-outline-secondary btn-sm ms-lg-2" type="button" data-logout>Cerrar sesión</button></li>`
    : `<li class="nav-item"><a href="/login" data-link class="btn btn-outline-success btn-sm ms-lg-2">Ingresar</a></li>
       <li class="nav-item"><a href="/registro" data-link class="btn btn-accent btn-sm ms-lg-1">Registrarse</a></li>`;

  return `<nav class="navbar navbar-expand-lg site-navbar" aria-label="Navegación principal">
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
        <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">${links}${acciones}</ul>
      </div>
    </div>
  </nav>`;
}