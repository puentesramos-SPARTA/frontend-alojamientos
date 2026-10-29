import test from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml, formatearCOP, resumen } from '../src/js/utils/formatters.js';

test('escapeHtml neutraliza contenido HTML recibido de la API', () => {
  assert.equal(escapeHtml('<script>alert("x")</script>'), '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
  assert.equal(escapeHtml(null), '');
});

test('formatearCOP muestra moneda colombiana', () => {
  assert.match(formatearCOP(180000), /180[.,]000/);
  assert.equal(formatearCOP('no-numero'), 'Precio no disponible');
});

test('resumen acorta textos largos sin alterar textos cortos', () => {
  assert.equal(resumen('Hola', 8), 'Hola');
  assert.equal(resumen('ABCDEFGHIJK', 5), 'ABCDE…');
});