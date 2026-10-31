import test from 'node:test';
import assert from 'node:assert/strict';
import { pintarFormularioAlojamiento } from '../src/js/components/AlojamientoForm.js';
import { pintarSelectorComodidades } from '../src/js/components/ComodidadesSelector.js';

test('formulario no inserta HTML recibido como título ni descripción', () => {
  const html = pintarFormularioAlojamiento({ id: 2, titulo: '<img src=x onerror=alert(1)>', descripcion: '<script>bad()</script>', ciudad: 'Cali', precio_noche: 100000 });
  assert.ok(!html.includes('<img src=x'));
  assert.ok(!html.includes('<script>bad()'));
  assert.ok(html.includes('&lt;script&gt;'));
});

test('selector de comodidades escapa nombres y marca las ya asociadas', () => {
  const html = pintarSelectorComodidades([{ id: 3, nombre: '<WiFi>' }, { id: 9, nombre: 'Piscina' }], [{ id: 3, nombre: '<WiFi>' }]);
  assert.ok(html.includes('&lt;WiFi&gt;'));
  assert.ok(html.includes('value="3" checked'));
  assert.ok(html.includes('value="9" '));
  assert.ok(!html.includes('<WiFi>'));
  assert.match(pintarSelectorComodidades([]), /No existen/);
});