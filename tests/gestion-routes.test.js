import test from 'node:test';
import assert from 'node:assert/strict';
import { resolverRuta } from '../src/js/router/routes.js';
import { mostrarNoEncontrada } from '../src/js/pages/NoEncontradaPage.js';
import { destinoTrasLogin } from '../src/js/utils/validaciones.js';

test('rutas CRUD y sección personal exigen sesión, sin confundir ID con nuevo', () => {
  assert.equal(resolverRuta('/alojamientos/nuevo').requiereAuth, true);
  assert.equal(resolverRuta('/mis-alojamientos').requiereAuth, true);
  assert.equal(resolverRuta('/alojamientos/17/editar').params.id, '17');
  assert.equal(resolverRuta('/alojamientos/17/editar').requiereAuth, true);
  assert.equal(resolverRuta('/alojamientos/xx/editar').vista, mostrarNoEncontrada);
  assert.equal(resolverRuta('/alojamientos/-8/editar').vista, mostrarNoEncontrada);
});

test('nueva comodidad está protegida por rol y catálogo sigue público', () => {
  assert.equal(resolverRuta('/admin/comodidades/nueva').requiereAdmin, true);
  assert.equal(resolverRuta('/admin/comodidades/nueva').requiereAuth, true);
  assert.equal(resolverRuta('/comodidades').requiereAuth, false);
  assert.equal(resolverRuta('/alojamientos').requiereAuth, false);
});

test('el login solo permite destinos locales conocidos por la SPA', () => {
  assert.equal(destinoTrasLogin('?next=/alojamientos/nuevo', 'usuario'), '/alojamientos/nuevo');
  assert.equal(destinoTrasLogin('?next=/mis-alojamientos', 'usuario'), '/mis-alojamientos');
  assert.equal(destinoTrasLogin('?next=%2Falojamientos%2F7%2Feditar', 'usuario'), '/alojamientos/7/editar');
  assert.equal(destinoTrasLogin('?next=%2Fadmin%2Fcomodidades%2Fnueva', 'admin'), '/admin/comodidades/nueva');
  assert.equal(destinoTrasLogin('?next=%2Fadmin%2Fcomodidades%2Fnueva', 'usuario'), '/perfil');
  assert.equal(destinoTrasLogin('?next=https://sitio-malicioso', 'admin'), '/perfil');
});