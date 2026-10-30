import test from 'node:test';
import assert from 'node:assert/strict';
import { obtenerSesion, guardarSesion, cerrarSesion, obtenerToken, esAdmin } from '../src/js/state/sesion.js';

function memoria() {
  const mapa = new Map();
  return { getItem: (k) => mapa.get(k) ?? null, setItem: (k, v) => mapa.set(k, v), removeItem: (k) => mapa.delete(k) };
}
const originalStorage = globalThis.sessionStorage;
test.before(() => { globalThis.sessionStorage = memoria(); });
test.after(() => { globalThis.sessionStorage = originalStorage; });

test('almacena usuario y token en sessionStorage y puede cerrar la sesión', () => {
  guardarSesion('jwt-ejemplo', { id: 1, correo: 'u@example.com', rol: 'usuario' });
  assert.equal(obtenerSesion().usuario.correo, 'u@example.com');
  assert.equal(obtenerToken(), 'jwt-ejemplo');
  assert.equal(esAdmin(), false);
  cerrarSesion();
  assert.equal(obtenerSesion(), null);
});

test('permite reconocer un rol admin sólo para la interfaz', () => {
  guardarSesion('jwt-admin', { id: 2, correo: 'a@example.com', rol: 'admin' });
  assert.equal(esAdmin(), true);
  cerrarSesion();
});

test('rechaza datos corruptos, sin usuario o rol permitido', () => {
  assert.throws(() => guardarSesion('jwt', { correo: 'x', rol: 'superadmin' }));
  globalThis.sessionStorage.setItem('alojamientos-sesion-v1', 'no-es-json');
  assert.equal(obtenerSesion(), null);
});