import { listarAlojamientos } from '../api/publica.api.js';
import { pintarTarjetaAlojamiento } from '../components/AlojamientoCard.js';
import { estadoCargando, estadoError, estadoVacio } from '../components/Estados.js';

export async function mostrarAlojamientos({ contenedor, signal }) {
  contenedor.innerHTML = `
    <section class="container section-block">
      <div class="page-heading"><span class="eyebrow">EXPLORA</span><h1>Todos los alojamientos</h1>
        <p>Consulta los lugares publicados en la API. El filtro se aplica a los datos ya cargados.</p></div>
      <div class="search-panel mb-4">
        <label for="filtro" class="form-label fw-semibold mb-2">Buscar por nombre o ciudad</label>
        <div class="input-group"><span class="input-group-text"><i class="bi bi-search"></i></span>
          <input class="form-control" id="filtro" type="search" placeholder="Ej.: Medellín o apartamento" autocomplete="off" /></div>
        <small class="text-muted" id="cantidad" aria-live="polite"></small>
      </div>
      <div id="lista" aria-live="polite">${estadoCargando('Consultando alojamientos…')}</div>
    </section>`;

  const lista = contenedor.querySelector('#lista');
  const filtro = contenedor.querySelector('#filtro');
  const cantidad = contenedor.querySelector('#cantidad');
  try {
    const respuesta = await listarAlojamientos(signal);
    if (signal.aborted) return;
    if (!Array.isArray(respuesta?.data)) throw new Error('La API respondió con un formato inesperado para alojamientos.');
    const alojamientos = respuesta.data;

    function actualizar() {
      const consulta = filtro.value.toLocaleLowerCase('es').trim();
      const visibles = alojamientos.filter((item) =>
        `${item.titulo ?? ''} ${item.ciudad ?? ''}`.toLocaleLowerCase('es').includes(consulta));
      cantidad.textContent = `${visibles.length} de ${alojamientos.length} alojamientos`;
      lista.innerHTML = visibles.length
        ? `<div class="row g-4">${visibles.map((alojamiento) => `<div class="col-md-6 col-xl-4">${pintarTarjetaAlojamiento(alojamiento)}</div>`).join('')}</div>`
        : estadoVacio(alojamientos.length ? 'No hay coincidencias para la búsqueda.' : 'La API todavía no tiene alojamientos registrados.');
    }
    filtro.addEventListener('input', actualizar);
    actualizar();
  } catch (error) {
    if (signal.aborted) return;
    cantidad.textContent = '';
    lista.innerHTML = estadoError(error);
  }
}