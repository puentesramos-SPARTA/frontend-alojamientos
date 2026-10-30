import test from 'node:test';
import assert from 'node:assert/strict';
import { registrarUsuario, iniciarSesionAPI, consultarPerfil, listarUsuariosAdmin } from '../src/js/api/auth.api.js';
const originalFetch = globalThis.fetch;
const originalStorage = globalThis.sessionStorage;
test.after(() => { globalThis.fetch = originalFetch; globalThis.sessionStorage = originalStorage; });

test('registro envía POST JSON con los campos existentes en Flask', async () => {
  globalThis.fetch = async (url, opciones) => {
    assert.equal(new URL(url).pathname, '/api/v1/usuarios/registro');
    assert.equal(opciones.method, 'POST');
    assert.equal(opciones.headers['Content-Type'], 'application/json');
    assert.equal(opciones.headers.Authorization, undefined);
    assert.deepEqual(JSON.parse(opciones.body), { correo: 'ana@example.com', contrasena: '123456' });
    return { ok: true, status: 201, json: async () => ({ success: true, data: { id: 1, correo: 'ana@example.com', rol: 'usuario' } }) };
  };
  const respuesta = await registrarUsuario({ correo: 'ana@example.com', contrasena: '123456' });
  assert.equal(respuesta.data.rol, 'usuario');
});

test('login no adjunta un token y conserva access_token', async () => {
  globalThis.fetch = async (url, opciones) => {
    assert.equal(new URL(url).pathname, '/api/v1/usuarios/login');
    assert.equal(opciones.headers.Authorization, undefined);
    return { ok: true, status: 200, json: async () => ({ success: true, data: { access_token: 'jwt', usuario: { id: 1, correo: 'ana@example.com', rol: 'usuario' } } }) };
  };
  assert.equal((await iniciarSesionAPI({ correo: 'ana@example.com', contrasena: '123456' })).data.access_token, 'jwt');
});

test('perfil y administración adjuntan Bearer Token al consultar Flask', async () => {
  const almacen = new Map();
  globalThis.sessionStorage = { getItem: (k) => almacen.get(k) ?? null, setItem: (k, v) => almacen.set(k, v), removeItem: (k) => almacen.delete(k) };
  const { guardarSesion } = await import('../src/js/state/sesion.js');
  guardarSesion('token-test', { id: 9, correo: 'admin@example.com', rol: 'admin' });
  const rutas = [];
  globalThis.fetch = async (url, opciones) => {
    rutas.push(new URL(url).pathname);
    assert.equal(opciones.headers.Authorization, 'Bearer token-test');
    return { ok: true, status: 200, json: async () => ({ success: true, data: [] }) };
  };
  await consultarPerfil();
  await listarUsuariosAdmin();
  assert.deepEqual(rutas, ['/api/v1/usuarios/perfil', '/api/v1/admin/usuarios']);
});

test('401 en login sin token no cierra la sesión previamente guardada', async () => {
  const { obtenerSesion } = await import('../src/js/state/sesion.js');
  globalThis.fetch = async () => ({ ok: false, status: 401, json: async () => ({ error: { message: 'Credenciales inválidas.' } }) });
  await assert.rejects(iniciarSesionAPI({ correo: 'x', contrasena: 'bad' }), (e) => e.status === 401);
  assert.equal(obtenerSesion()?.token, 'token-test');
});

test('401 en petición protegida invalida la sesión', async () => {
  const { obtenerSesion } = await import('../src/js/state/sesion.js');
  globalThis.fetch = async () => ({ ok: false, status: 401, json: async () => ({ error: { message: 'Token expirado.' } }) });
  await assert.rejects(consultarPerfil(), (e) => e.status === 401);
  assert.equal(obtenerSesion(), null);
});