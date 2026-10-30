import test from 'node:test';
import assert from 'node:assert/strict';
import { resolverRuta } from '../src/js/router/routes.js';
import { mostrarPerfil } from '../src/js/pages/PerfilPage.js';
import { mostrarAdminUsuarios } from '../src/js/pages/AdminUsuariosPage.js';
import { mostrarLogin } from '../src/js/pages/LoginPage.js';
import { mostrarRegistro } from '../src/js/pages/RegistroPage.js';
import { mostrarNoEncontrada } from '../src/js/pages/NoEncontradaPage.js';

test('registro y login son rutas públicas', () => {
  assert.equal(resolverRuta('/registro').vista, mostrarRegistro);
  assert.equal(resolverRuta('/login').vista, mostrarLogin);
  assert.equal(resolverRuta('/login').requiereAuth, false);
});

test('perfil requiere sesión y administración también requiere rol', () => {
  assert.equal(resolverRuta('/perfil').vista, mostrarPerfil);
  assert.equal(resolverRuta('/perfil').requiereAuth, true);
  assert.equal(resolverRuta('/perfil').requiereAdmin, false);
  assert.equal(resolverRuta('/admin/usuarios').vista, mostrarAdminUsuarios);
  assert.equal(resolverRuta('/admin/usuarios').requiereAdmin, true);
});

test('no inventa actualización de perfil ni rutas de reservas', () => {
  assert.equal(resolverRuta('/perfil/editar').vista, mostrarNoEncontrada);
  assert.equal(resolverRuta('/reservas').vista, mostrarNoEncontrada);
});