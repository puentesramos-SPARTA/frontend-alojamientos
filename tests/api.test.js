import test from 'node:test';
import assert from 'node:assert/strict';
import { obtenerJSON } from '../src/js/api/http.js';
import { consultarSalud, listarAlojamientos, consultarAlojamiento, listarComodidades } from '../src/js/api/publica.api.js';

const originalFetch = globalThis.fetch;

test.after(() => { globalThis.fetch = originalFetch; });

test('usa las cuatro rutas reales y conserva los contratos JSON', async () => {
  const rutas = [];
  globalThis.fetch = async (url, opciones) => {
    rutas.push(new URL(url).pathname);
    assert.equal(opciones.method, 'GET');
    return { ok: true, json: async () => ({ success: true, data: [] }) };
  };
  await consultarSalud();
  await listarAlojamientos();
  await consultarAlojamiento(4);
  const resultado = await listarComodidades();
  assert.deepEqual(rutas, ['/health', '/api/v1/alojamientos', '/api/v1/alojamientos/4', '/api/v1/comodidades']);
  assert.deepEqual(resultado, { success: true, data: [] });
});

test('preserva status y mensaje de error HTTP del backend', async () => {
  globalThis.fetch = async () => ({ ok: false, status: 404, json: async () => ({ error: { message: 'Alojamiento no encontrado.' } }) });
  await assert.rejects(obtenerJSON('/api/v1/alojamientos/999'), (error) => error.status === 404 && error.message === 'Alojamiento no encontrado.');
});

test('informa cuando Flask no está disponible', async () => {
  globalThis.fetch = async () => { throw new TypeError('Failed to fetch'); };
  await assert.rejects(consultarSalud(), (error) => error.status === 0 && /Flask/.test(error.message));
});