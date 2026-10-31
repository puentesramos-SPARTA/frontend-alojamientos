import test from 'node:test';
import assert from 'node:assert/strict';
import { validarAlojamiento, prepararAlojamiento, validarComodidad, puedeModificar, idsComodidadesSeleccionadas } from '../src/js/utils/gestion.js';

test('valida campos obligatorios, límites y precio DECIMAL(10,2)', () => {
  const datos = { titulo: 'Casa', descripcion: 'Cómoda', ciudad: 'Bogotá', precio_noche: '123000.50' };
  assert.equal(validarAlojamiento(datos), null);
  assert.match(validarAlojamiento({ ...datos, titulo: ' ' }), /título/);
  assert.match(validarAlojamiento({ ...datos, descripcion: ' ' }), /descripción/);
  assert.match(validarAlojamiento({ ...datos, ciudad: ' ' }), /ciudad/);
  assert.match(validarAlojamiento({ ...datos, precio_noche: '0' }), /precio/);
  assert.match(validarAlojamiento({ ...datos, precio_noche: '123,45' }), /precio/);
  assert.match(validarAlojamiento({ ...datos, precio_noche: '20.999' }), /precio/);
  assert.match(validarAlojamiento({ ...datos, precio_noche: '100000000.00' }), /precio/);
});

test('el objeto enviado solo contiene los cuatro campos aceptados por Flask', () => {
  assert.deepEqual(prepararAlojamiento({ titulo: ' Casa ', descripcion: '  Bien  ', ciudad: ' Cali ', precio_noche: '200000.25', usuario_id: 99 }), {
    titulo: 'Casa', descripcion: 'Bien', ciudad: 'Cali', precio_noche: 200000.25,
  });
});

test('los permisos visuales son distintos de la autorización del backend', () => {
  const hospedaje = { usuario_id: 3 };
  assert.equal(puedeModificar(hospedaje, null), false);
  assert.equal(puedeModificar(hospedaje, { usuario: { id: 3, rol: 'usuario' } }), true);
  assert.equal(puedeModificar(hospedaje, { usuario: { id: 8, rol: 'usuario' } }), false);
  assert.equal(puedeModificar(hospedaje, { usuario: { id: 8, rol: 'admin' } }), true);
});

test('comodidades admite selección vacía, sin llamadas ni reglas de servidor inventadas', () => {
  assert.equal(validarComodidad(' WiFi '), null);
  assert.match(validarComodidad('  '), /nombre/);
  const falsoContenedor = { querySelectorAll: () => [{ value: '1' }, { value: '7' }, { value: '-1' }, { value: 'texto' }] };
  assert.deepEqual(idsComodidadesSeleccionadas(falsoContenedor), [1, 7]);
  assert.deepEqual(idsComodidadesSeleccionadas({ querySelectorAll: () => [] }), []);
});