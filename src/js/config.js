const valorEntorno = import.meta.env?.VITE_API_URL?.trim();

// La API entrega /health fuera de /api/v1; aquí se configura solo el origen.
export const API_BASE_URL = (valorEntorno || 'http://localhost:5000').replace(/\/+$/, '');