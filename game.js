'use strict';
const { fractionalKnapsack, evaluateSelection } = window.TreasureGame;
const { BACKPACKS, createRound } = window.TreasureRounds;
const form = document.querySelector('#game-form');
const result = document.querySelector('#result');
const feedback = document.querySelector('#feedback');
const weight = document.querySelector('#weight');
const progress = document.querySelector('#capacity');
const choice = document.querySelector('#backpack-choice');
const cards = document.querySelector('#treasures');
const format = value => value.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
let capacity = 10;
let treasures = [];
let round = 0;
let attempts = 0;

choice.innerHTML = BACKPACKS.map(bag => `<option value="${bag.capacity}">${bag.name} · ${bag.capacity} kg</option>`).join('');
choice.value = String(capacity);

function renderCards() {
  cards.innerHTML = treasures.map(item => `
    <article class="treasure" style="--accent: ${item.color}">
      <span class="icon" aria-hidden="true">${item.icon}</span>
      <h2>${item.name}</h2>
      <p class="price">${format(item.totalValue)} <span>pontos/lote</span></p>
      <p>Peso do lote: <strong>${item.available} kg</strong></p>
      <label for="${item.id}">Quanto levar de ${item.name.toLowerCase()} (kg)</label>
      <input id="${item.id}" name="${item.id}" type="number" min="0" max="${item.available}" step="0.1" value="0" required inputmode="decimal">
    </article>`).join('');
}

function update() {
  result.hidden = true;
  const quantities = Object.fromEntries(treasures.map(item => [item.id, form.elements[item.id].valueAsNumber]));
  const state = evaluateSelection(quantities, treasures, capacity);
  weight.textContent = `${state.totalWeight === undefined ? '—' : format(state.totalWeight)} / ${capacity} kg`;
  progress.max = capacity;
  progress.value = Math.min(state.totalWeight ?? 0, capacity);
  feedback.classList.toggle('error', !state.valid);
  feedback.textContent = state.valid
    ? `Valor da sua mochila: ${format(state.totalValue)} pontos. Espaço livre: ${format(capacity - state.totalWeight)} kg.`
    : state.message;
  return state;
}

function emptyBackpack() {
  for (const item of treasures) form.elements[item.id].value = '0';
  update();
}

function newRound() {
  treasures = createRound();
  round++;
  attempts = 0;
  document.querySelector('#round-label').textContent = `Expedição ${round}`;
  renderCards();
  update();
}

choice.addEventListener('change', () => {
  capacity = Number(choice.value);
  attempts = 0;
  emptyBackpack();
});
document.querySelector('#new-round').addEventListener('click', newRound);
form.addEventListener('input', update);
form.addEventListener('reset', event => {
  event.preventDefault();
  emptyBackpack();
  form.elements[treasures[0].id].focus();
});
form.addEventListener('submit', event => {
  event.preventDefault();
  const state = update();
  if (!state.valid) return;
  attempts++;
  const optimal = fractionalKnapsack(treasures, capacity);
  const percentage = state.totalValue / optimal.totalValue * 100;
  const perfect = Math.abs(state.totalValue - optimal.totalValue) < 1e-9;
  const stars = perfect ? '★★★' : percentage >= 70 ? '★★☆' : percentage > 0 ? '★☆☆' : '☆☆☆';
  result.innerHTML = `
    <p class="eyebrow">EXPEDIÇÃO ${round} · TENTATIVA ${attempts}</p>
    <h2 id="result-title">${stars} ${perfect ? 'Mochila perfeita!' : 'Coleta concluída!'}</h2>
    <p>Você coletou <strong>${format(state.totalValue)} pontos</strong>. Aproveitamento: <strong>${format(percentage)}%</strong> do valor ótimo.</p>
    <p>${perfect ? 'Você encontrou a melhor combinação! Sorteie uma nova expedição para continuar.' : 'Ainda há espaço para melhorar a estratégia. Ajuste as quantidades e tente novamente, ou revele a solução abaixo.'}</p>
    <details>
      <summary>Revelar solução do algoritmo</summary>
      <p>O guloso divide o valor de cada lote pelo seu peso, ordena pelo valor por kg e coleta nessa ordem:</p>
      <ol>${optimal.selection.map(item => `<li><strong>${item.name}</strong>: ${format(item.totalValue)} ÷ ${item.available} = ${format(item.valuePerKg)} pontos/kg. Levar ${format(item.quantity)} kg → ${format(item.value)} pontos.</li>`).join('')}</ol>
      <p>Melhor resultado: <strong>${format(optimal.totalValue)} pontos</strong> em ${format(optimal.totalWeight)} kg. O fracionamento permite obter a solução ótima com essa estratégia.</p>
    </details>`;
  result.hidden = false;
  result.focus();
});
newRound();
