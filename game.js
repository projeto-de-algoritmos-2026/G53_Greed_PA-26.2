'use strict';
const { CAPACITY, TREASURES, fractionalKnapsack, evaluateSelection } = window.TreasureGame;
const form = document.querySelector('#game-form');
const result = document.querySelector('#result');
const feedback = document.querySelector('#feedback');
const weight = document.querySelector('#weight');
const progress = document.querySelector('#capacity');
const format = value => value.toLocaleString('pt-BR', { maximumFractionDigits: 2 });

function update() {
  result.hidden = true;
  const quantities = Object.fromEntries(TREASURES.map(item => [item.id, form.elements[item.id].valueAsNumber]));
  const state = evaluateSelection(quantities);
  weight.textContent = state.totalWeight === undefined ? '— / 10 kg' : `${format(state.totalWeight)} / 10 kg`;
  progress.value = Math.min(state.totalWeight ?? 0, CAPACITY);
  feedback.classList.toggle('error', !state.valid);
  feedback.textContent = state.valid
    ? `Valor da sua mochila: ${format(state.totalValue)} pontos. Espaço livre: ${format(CAPACITY - state.totalWeight)} kg.`
    : state.message;
  return state;
}

form.addEventListener('input', update);
form.addEventListener('submit', event => {
  event.preventDefault();
  const state = update();
  if (!state.valid) return;
  const optimal = fractionalKnapsack(TREASURES, CAPACITY);
  const percentage = state.totalValue / optimal.totalValue * 100;
  const perfect = Math.abs(state.totalValue - optimal.totalValue) < 1e-9;
  const stars = perfect ? '★★★' : percentage >= 70 ? '★★☆' : percentage > 0 ? '★☆☆' : '☆☆☆';
  result.innerHTML = `
    <h2 id="result-title">${stars} ${perfect ? 'Mochila perfeita!' : 'Coleta concluída!'}</h2>
    <p>Você coletou <strong>${format(state.totalValue)} pontos</strong> de ${format(optimal.totalValue)} possíveis.
    Aproveitamento: <strong>${format(percentage)}%</strong>.</p>
    <h3>Como o algoritmo escolhe?</h3>
    <p>Ele ordena os tesouros pelo valor por kg e pega o máximo possível de cada um, até encher a mochila:</p>
    <ol>${optimal.selection.map(item => `<li><strong>${item.name}</strong>: ${format(item.quantity)} kg × ${format(item.valuePerKg)} pontos/kg = ${format(item.value)} pontos.</li>`).join('')}</ol>
    <p>Como os metais podem ser divididos, essa estratégia gulosa encontra o maior valor possível.
    ${perfect ? 'Você encontrou a mesma solução!' : 'Ajuste suas quantidades e tente novamente!'}</p>`;
  result.hidden = false;
  result.focus();
});
form.addEventListener('reset', () => {
  // O evento acontece antes de o navegador restaurar os valores dos campos.
  setTimeout(() => { update(); form.elements.gold.focus(); }, 0);
});
update();
