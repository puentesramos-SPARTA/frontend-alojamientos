import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizarRuta, resolverRuta } from '../src/js/router/routes.js';
import { mostrarDetalle } from '../src/js/pages/DetallePage.js';
import { mostrarNoEncontrada } from '../src/js/pages/NoEncontradaPage.js';

test('la ruta de catálogo acepta barra final y parámetros de URL', () => {
  assert.equal(normalizarRuta('/alojamientos?filtro=cali'), '/alojamientos/');
  assert.notEqual(resolverRuta('/alojamientos').vista, mostrarNoEncontrada);
  assert.notEqual(resolverRuta('/alojamientos/').vista, mostrarNoEncontrada);
});

test('el detalle reconoce solo IDs enteros positivos', () => {
  assert.equal(resolverRuta('/alojamientos/25').vista, mostrarDetalle);
  assert.equal(resolverRuta('/alojamientos/25').params.id, '25');
  assert.equal(resolverRuta('/alojamientos/abc').vista, mostrarNoEncontrada);
  assert.equal(resolverRuta('/alojamientos/0').vista, mostrarNoEncontrada);
});

test('una dirección desconocida muestra página 404', () => {
  assert.equal(resolverRuta('/reservas').vista, mostrarNoEncontrada);
});