/** Escapa datos que podrían venir de usuarios; nunca inyecte texto remoto sin escaparlo. */
export function escapeHtml(valor) {
  return String(valor ?? '').replace(/[&<>"']/g, (caracter) => {
    const mapa = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return mapa[caracter];
  });
}

export function formatearCOP(valor) {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return 'Precio no disponible';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(numero);
}

export function resumen(texto, limite = 125) {
  const contenido = String(texto ?? '').trim();
  if (contenido.length <= limite) return contenido;
  return `${contenido.slice(0, limite).trimEnd()}…`;
}