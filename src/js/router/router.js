import { pintarNavbar } from '../components/Navbar.js';
import { pintarFooter } from '../components/Footer.js';
import { obtenerSesion, cerrarSesion } from '../state/sesion.js';
import { mostrarNoAutorizado } from '../pages/NoAutorizadoPage.js';
import { resolverRuta } from './routes.js';

let controladorActual = null;
let navegacionIniciada = false;

function refrescarNavbar() {
  const cabecera = document.querySelector('#site-header');
  if (cabecera) cabecera.innerHTML = pintarNavbar(window.location.pathname);
}

async function dibujarRuta() {
  controladorActual?.abort();
  controladorActual = new AbortController();
  const signal = controladorActual.signal;
  const app = document.querySelector('#app');
  document.querySelector('#site-footer').innerHTML = pintarFooter();
  let { vista, params, requiereAuth, requiereAdmin } = resolverRuta(window.location.pathname);
  const sesion = obtenerSesion();

  if (requiereAuth && !sesion) {
    const destino = window.location.pathname;
    window.history.replaceState({}, '', `/login?next=${encodeURIComponent(destino)}`);
    ({ vista, params } = resolverRuta('/login'));
  } else if (requiereAdmin && sesion?.usuario?.rol !== 'admin') {
    vista = mostrarNoAutorizado;
    params = {};
  }

  refrescarNavbar();
  app.setAttribute('aria-busy', 'true');
  try {
    await vista({ contenedor: app, params, signal });
  } catch (error) {
    if (!signal.aborted) {
      app.textContent = 'Ocurrió un problema al mostrar la página.';
      console.error(error);
    }
  } finally {
    if (!signal.aborted) app.setAttribute('aria-busy', 'false');
  }
}

export function navegar(ruta) {
  if (ruta !== `${window.location.pathname}${window.location.search}`) {
    window.history.pushState({}, '', ruta);
  }
  window.scrollTo({ top: 0, behavior: 'auto' });
  void dibujarRuta();
}

export function iniciarRouter() {
  if (navegacionIniciada) return;
  navegacionIniciada = true;
  document.addEventListener('click', (evento) => {
    if (evento.defaultPrevented || evento.button !== 0 || evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
    const salir = evento.target.closest('[data-logout]');
    if (salir) {
      evento.preventDefault();
      cerrarSesion();
      navegar('/');
      return;
    }
    const enlace = evento.target.closest('a[data-link]');
    if (!enlace || enlace.hasAttribute('download') || enlace.target === '_blank') return;
    const destino = new URL(enlace.href, window.location.href);
    if (destino.origin !== window.location.origin) return;
    evento.preventDefault();
    navegar(`${destino.pathname}${destino.search}${destino.hash}`);
    const menu = document.querySelector('#navbarMenu');
    if (menu?.classList.contains('show')) {
      window.bootstrap?.Collapse.getInstance(menu)?.hide();
    }
  });
  window.addEventListener('popstate', () => void dibujarRuta());
  window.addEventListener('sesion-cambiada', () => {
    refrescarNavbar();
    const { requiereAuth } = resolverRuta(window.location.pathname);
    if (requiereAuth && !obtenerSesion()) navegar('/login');
  });
  void dibujarRuta();
}