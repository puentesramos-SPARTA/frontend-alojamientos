export async function mostrarNoAutorizado({ contenedor }) {
  contenedor.innerHTML = `<section class="container section-block"><div class="state-panel state-empty">
    <i class="bi bi-shield-lock display-4" aria-hidden="true"></i>
    <h1 class="h3 mt-3">Acceso restringido (403)</h1>
    <p>Esta vista requiere rol administrador. Su cuenta no tiene ese permiso.</p>
    <p class="small text-muted">El servidor vuelve a validar cada operación; ocultar botones no concede ni revoca permisos.</p>
    <a href="/perfil" data-link class="btn btn-outline-success">Volver al perfil</a>
  </div></section>`;
}