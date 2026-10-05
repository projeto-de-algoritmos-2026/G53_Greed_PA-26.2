/* Algoritmo independente da interface; também pode ser testado pelo Node.js. */
(function (root) {
  'use strict';
  const CAPACITY = 10;
  const TREASURES = [
    { id: 'gold', name: 'Ouro em pó', available: 4, valuePerKg: 100 },
    { id: 'silver', name: 'Prata em pó', available: 5, valuePerKg: 60 },
    { id: 'bronze', name: 'Bronze em pó', available: 6, valuePerKg: 20 }
  ];
  const round = value => Math.round(value * 1e9) / 1e9;

  function fractionalKnapsack(items, capacity) {
    if (!Number.isFinite(capacity) || capacity < 0) throw new RangeError('Capacidade inválida.');
    if (items.some(item => !Number.isFinite(item.available) || item.available < 0 ||
      !Number.isFinite(item.valuePerKg) || item.valuePerKg < 0)) throw new RangeError('Tesouro inválido.');
    // A cópia evita alterar a ordem dos itens recebidos pela interface.
    const sorted = [...items].sort((a, b) => b.valuePerKg - a.valuePerKg);
    let remaining = capacity;
    let totalValue = 0;
    const selection = [];
    for (const item of sorted) {
      if (remaining <= 0) break;
      const quantity = Math.min(item.available, remaining);
      if (quantity === 0) continue;
      const value = round(quantity * item.valuePerKg);
      selection.push({ ...item, quantity, value });
      totalValue = round(totalValue + value);
      remaining = round(remaining - quantity);
    }
    return { selection, totalValue, totalWeight: round(capacity - remaining) };
  }

  function evaluateSelection(quantities, items = TREASURES, capacity = CAPACITY) {
    let totalWeight = 0;
    let totalValue = 0;
    for (const item of items) {
      const quantity = quantities[item.id];
      if (!Number.isFinite(quantity) || quantity < 0 || quantity > item.available) {
        return { valid: false, message: `Escolha entre 0 e ${item.available} kg de ${item.name.toLowerCase()}.` };
      }
      totalWeight += quantity;
      totalValue += quantity * item.valuePerKg;
    }
    totalWeight = round(totalWeight);
    totalValue = round(totalValue);
    return { valid: totalWeight <= capacity, totalWeight, totalValue,
      message: totalWeight > capacity ? 'Sua mochila está pesada demais! Retire alguns tesouros.' : '' };
  }
  const api = { CAPACITY, TREASURES, fractionalKnapsack, evaluateSelection };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TreasureGame = api;
})(globalThis);
