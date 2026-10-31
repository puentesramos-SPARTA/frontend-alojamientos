import test from 'node:test';
import assert from 'node:assert/strict';
import { crearAlojamiento, actualizarAlojamiento, eliminarAlojamiento, asignarComodidades } from '../src/js/api/alojamientos.api.js';
import { crearComodidad } from '../src/js/api/comodidades.api.js';
import { guardarSesion, obtenerSesion } from '../src/js/state/sesion.js';

const originalFetch = globalThis.fetch;
const originalStorage = globalThis.sessionStorage;
test.before(() => {
  const mapa = new Map();
  globalThis.sessionStorage = {
    getItem: k => mapa.get(k) ?? null,
    setItem: (k, v) => mapa.set(k, v),
    removeItem: k => mapa.delete(k),
  };
  guardarSesion('jwt-prueba', { id: 5, correo: 'a@ejemplo.com', rol: 'admin' });
});
test.after(() => { globalThis.fetch = originalFetch; globalThis.sessionStorage = originalStorage; });

test('POST alojamiento usa exactamente los 4 campos y Authorization', async () => {
  const datos = { titulo: 'Casa', descripcion: 'Simple', ciudad: 'Cali', precio_noche: 130000 };
  globalThis.fetch = async (url, opciones) => {
    assert.equal(new URL(url).pathname, '/api/v1/alojamientos');
    assert.equal(opciones.method, 'POST');
    assert.equal(opciones.headers.Authorization, 'Bearer jwt-prueba');
    assert.deepEqual(JSON.parse(opciones.body), datos);
    return { ok: true, status: 201, json: async () => ({ success: true, data: { id: 8, ...datos, usuario_id: 5 } }) };
  };
  assert.equal((await crearAlojamiento(datos)).data.id, 8);
});

test('PATCH alojamiento no crea endpoints de perfil ni altera el dueño', async () => {
  globalThis.fetch = async (url, opciones) => {
    assert.equal(new URL(url).pathname, '/api/v1/alojamientos/8');
    assert.equal(opciones.method, 'PATCH');
    assert.deepEqual(JSON.parse(opciones.body), { ciudad: 'Bogotá' });
    return { ok: true, status: 200, json: async () => ({ success: true, data: { id: 8 } }) };
  };
  await actualizarAlojamiento(8, { ciudad: 'Bogotá' });
});

test('PATCH comodidades reemplaza relación usando comodidades_ids, incluso []', async () => {
  const ids = [[1, 2], []];
  globalThis.fetch = async (url, opciones) => {
    assert.equal(new URL(url).pathname, '/api/v1/alojamientos/8/comodidades');
    assert.equal(opciones.method, 'PATCH');
    assert.deepEqual(JSON.parse(opciones.body), { comodidades_ids: ids.shift() });
    return { ok: true, status: 200, json: async () => ({ success: true, data: { id: 8, comodidades: [] } }) };
  };
  await asignarComodidades(8, [1, 2]);
  await asignarComodidades(8, []);
});

test('DELETE 204 se procesa como null sin invocar respuesta.json()', async () => {
  globalThis.fetch = async (url, opciones) => {
    assert.equal(new URL(url).pathname, '/api/v1/alojamientos/8');
    assert.equal(opciones.method, 'DELETE');
    assert.equal(opciones.headers.Authorization, 'Bearer jwt-prueba');
    return { ok: true, status: 204, json: async () => { throw new Error('No debe leer JSON'); } };
  };
  assert.equal(await eliminarAlojamiento(8), null);
});

test('POST comodidad solo envía nombre; 409 se muestra desde Flask', async () => {
  let llamada = 0;
  globalThis.fetch = async (url, opciones) => {
    assert.equal(new URL(url).pathname, '/api/v1/comodidades');
    assert.equal(opciones.headers.Authorization, 'Bearer jwt-prueba');
    assert.deepEqual(JSON.parse(opciones.body), { nombre: 'WiFi' });
    llamada++;
    return llamada === 1
      ? { ok: true, status: 201, json: async () => ({ success: true, data: { id: 1, nombre: 'WiFi' } }) }
      : { ok: false, status: 409, json: async () => ({ success: false, error: { message: 'La comodidad ya existe.' } }) };
  };
  assert.equal((await crearComodidad('WiFi')).data.nombre, 'WiFi');
  await assert.rejects(crearComodidad('WiFi'), error => error.status === 409 && /existe/.test(error.message));
  assert.equal(obtenerSesion()?.token, 'jwt-prueba');
});