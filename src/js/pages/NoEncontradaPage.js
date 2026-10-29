export async function mostrarNoEncontrada({ contenedor }) {
  contenedor.innerHTML = `<section class="container section-block text-center"><span class="eyebrow">ERROR 404</span>
    <h1 class="display-4 fw-bold mt-2">Página no encontrada</h1>
    <p class="text-muted">No existe una vista frontend para esta dirección.</p>
    <a href="/" data-link class="btn btn-accent mt-3">Volver al inicio</a></section>`;
}