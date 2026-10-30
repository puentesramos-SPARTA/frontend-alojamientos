import test from 'node:test';
import assert from 'node:assert/strict';
import { validarRegistro, validarLogin, destinoTrasLogin } from '../src/js/utils/validaciones.js';

test('registro valida email, mínimo de contraseña y confirmación', () => {
  assert.match(validarRegistro({ correo: 'incorrecto', contrasena: '123456', confirmar: '123456' }), /correo/);
  assert.match(validarRegistro({ correo: 'a@example.com', contrasena: '123', confirmar: '123' }), /6/);
  assert.match(validarRegistro({ correo: 'a@example.com', contrasena: '123456', confirmar: '123000' }), /coincide/);
  assert.equal(validarRegistro({ correo: 'a@example.com', contrasena: '123456', confirmar: '123456' }), null);
});

test('login exige ambos campos', () => {
  assert.ok(validarLogin({ correo: '', contrasena: '123' }));
  assert.equal(validarLogin({ correo: 'a@example.com', contrasena: 'clave' }), null);
});

test('redirige únicamente a vistas privadas conocidas e impide URLs externas', () => {
  assert.equal(destinoTrasLogin('?next=%2Fadmin%2Fusuarios', 'admin'), '/admin/usuarios');
  assert.equal(destinoTrasLogin('?next=%2Fadmin%2Fusuarios', 'usuario'), '/perfil');
  assert.equal(destinoTrasLogin('?next=https%3A%2F%2Fejemplo.com', 'admin'), '/perfil');
  assert.equal(destinoTrasLogin('?next=%2F%2Fejemplo.com', 'admin'), '/perfil');
});