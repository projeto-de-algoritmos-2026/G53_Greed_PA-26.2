(function (root) {
  'use strict';
  const BACKPACKS = [
    { name: 'Bolsa de explorador', capacity: 6 },
    { name: 'Mochila de aventureiro', capacity: 10 },
    { name: 'Mochila de expedição', capacity: 18 }
  ];
  const MATERIALS = [
    { id: 'gold', name: 'Ouro em pó', icon: '🟡', color: '#e9c266' },
    { id: 'silver', name: 'Prata em pó', icon: '⚪', color: '#c4d1dc' },
    { id: 'bronze', name: 'Bronze em pó', icon: '🟠', color: '#d79c73' },
    { id: 'crystal', name: 'Cristal moído', icon: '💎', color: '#89cee0' },
    { id: 'magic', name: 'Pó mágico', icon: '✨', color: '#c5a1eb' }
  ];
  // Sorteio injetável para permitir testes reproduzíveis.
  function createRound(random = Math.random) {
    const items = MATERIALS.map(item => {
      const available = 4 + Math.floor(random() * 6);
      const valuePerKg = 15 + Math.floor(random() * 20) * 5;
      return { ...item, available, valuePerKg, totalValue: available * valuePerKg };
    });
    // Fisher–Yates: a posição dos cartões não indica a melhor escolha.
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }
  const api = { BACKPACKS, createRound };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TreasureRounds = api;
})(globalThis);
