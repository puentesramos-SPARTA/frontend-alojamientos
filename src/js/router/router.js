import { pintarNavbar } from '../components/Navbar.js';
import { pintarFooter } from '../components/Footer.js';
import { resolverRuta } from './routes.js';

let controladorActual = null;
let navegacionIniciada = false;

async function dibujarRuta() {
  if (controladorActual) controladorActual.abort();
  controladorActual = new AbortController();
  const signal = controladorActual.signal;
  const app = document.querySelector('#app');
  document.querySelector('#site-header').innerHTML = pintarNavbar(window.location.pathname);
  document.querySelector('#site-footer').innerHTML = pintarFooter();
  const { vista, params } = resolverRuta(window.location.pathname);
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
    const enlace = evento.target.closest('a[data-link]');
    if (!enlace || enlace.hasAttribute('download') || enlace.target === '_blank') return;
    const destino = new URL(enlace.href, window.location.href);
    if (destino.origin !== window.location.origin) return;
    evento.preventDefault();
    navegar(`${destino.pathname}${destino.search}${destino.hash}`);
    const menu = document.querySelector('#navbarMenu');
    if (menu?.classList.contains('show')) {
      // Bootstrap administra las clases y atributos del menú móvil.
      const instancia = window.bootstrap?.Collapse.getInstance(menu);
      instancia?.hide();
    }
  });
  window.addEventListener('popstate', () => void dibujarRuta());
  void dibujarRuta();
}