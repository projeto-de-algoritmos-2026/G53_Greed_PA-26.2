const test = require('node:test');
const assert = require('node:assert/strict');
const { TREASURES, fractionalKnapsack, evaluateSelection } = require('../knapsack.js');

test('mochila de 10 kg encontra 720 pontos e fraciona o bronze', () => {
  const result = fractionalKnapsack(TREASURES, 10);
  assert.equal(result.totalValue, 720);
  assert.equal(result.totalWeight, 10);
  assert.deepEqual(result.selection.map(item => item.quantity), [4, 5, 1]);
});
test('ordena por valor por kg sem modificar a entrada', () => {
  const items = [...TREASURES].reverse();
  const original = [...items];
  assert.equal(fractionalKnapsack(items, 2.5).totalValue, 250);
  assert.deepEqual(items, original);
});
test('aceita capacidade zero, lista vazia e capacidade excedente', () => {
  assert.equal(fractionalKnapsack(TREASURES, 0).totalValue, 0);
  assert.equal(fractionalKnapsack([], 10).totalWeight, 0);
  assert.equal(fractionalKnapsack(TREASURES, 100).totalWeight, 15);
});
test('rejeita entradas inválidas do algoritmo', () => {
  assert.throws(() => fractionalKnapsack(TREASURES, -1), RangeError);
  assert.throws(() => fractionalKnapsack([{ available: -1, valuePerKg: 10 }], 10), RangeError);
});
test('valida estoque, números, valores negativos e excesso de peso', () => {
  for (const gold of [-1, 5, NaN, Infinity]) {
    assert.equal(evaluateSelection({ gold, silver: 0, bronze: 0 }).valid, false);
  }
  assert.equal(evaluateSelection({ gold: 4, silver: 5, bronze: 2 }).valid, false);
});
test('calcula escolhas fracionárias e mochila vazia', () => {
  assert.equal(evaluateSelection({ gold: .1, silver: .2, bronze: .3 }).totalWeight, .6);
  assert.equal(evaluateSelection({ gold: 0, silver: 0, bronze: 0 }).totalValue, 0);
  assert.equal(evaluateSelection({ gold: 4, silver: 5, bronze: 1 }).totalValue, 720);
});
