const test = require('node:test');
const assert = require('node:assert/strict');
const { BACKPACKS, createRound } = require('../rounds.js');
const { fractionalKnapsack, evaluateSelection } = require('../knapsack.js');

test('rodadas respeitam limites e exigem escolhas em todas as mochilas', () => {
  for (const seed of [0, .25, .5, .999999]) {
    const items = createRound(() => seed);
    assert.equal(new Set(items.map(item => item.id)).size, 5);
    for (const item of items) {
      assert.ok(item.available >= 4 && item.available <= 9);
      assert.ok(item.valuePerKg >= 15 && item.valuePerKg <= 110);
      assert.equal(item.totalValue, item.available * item.valuePerKg);
    }
    for (const bag of BACKPACKS) {
      assert.ok(items.reduce((sum, item) => sum + item.available, 0) > bag.capacity);
      const solution = fractionalKnapsack(items, bag.capacity);
      assert.equal(solution.totalWeight, bag.capacity);
      const quantities = Object.fromEntries(items.map(item => [item.id, 0]));
      for (const item of solution.selection) quantities[item.id] = item.quantity;
      assert.equal(evaluateSelection(quantities, items, bag.capacity).totalValue, solution.totalValue);
    }
  }
});
test('sorteios diferentes alteram o cenário', () => {
  assert.notDeepEqual(createRound(() => 0), createRound(() => .9));
});
test('prioriza valor por kg mesmo quando outro lote vale mais no total', () => {
  const items = [
    { id: 'large', available: 9, valuePerKg: 20 },
    { id: 'small', available: 4, valuePerKg: 40 }
  ];
  assert.equal(fractionalKnapsack(items, 6).totalValue, 200);
  assert.equal(evaluateSelection({ large: 6, small: 0 }, items, 6).totalValue, 120);
});
