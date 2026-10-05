# 🎒 Mochila de Tesouros

Minijogo do grupo G53 para demonstrar **Knapsack fracionário** com algoritmos gulosos.
Cada expedição sorteia cinco lotes divisíveis: ouro, prata, bronze, cristal moído e pó mágico.
Escolha quanto levar para maximizar os pontos sem ultrapassar a capacidade da mochila.

## Como executar

Clone o repositório e abra `index.html` em um navegador moderno. Não há dependências, backend
ou necessidade de internet após o download. Opcionalmente, execute `python -m http.server 8000`
na pasta do projeto e acesse `http://localhost:8000`.

## Como jogar

1. Escolha uma mochila: **6 kg**, **10 kg** ou **18 kg**.
2. Compare o valor total de cada lote com seu peso. O lote com mais pontos nem sempre é a melhor escolha!
3. Informe as quantidades em incrementos de 0,1 kg. Os materiais podem ser fracionados.
4. Clique em **Finalizar coleta** para ver pontos, aproveitamento e estrelas.
5. Tente melhorar sua escolha ou abra **Revelar solução do algoritmo** para ver o cálculo.
6. Use **Nova expedição** para sortear novos pesos, valores e ordem dos cartões.

Trocar a mochila esvazia a coleta e zera o contador de tentativas, mantendo os mesmos lotes.
**Esvaziar mochila** limpa apenas as quantidades, permitindo tentar novamente na mesma rodada.
Uma nova expedição mantém a mochila escolhida e reinicia as tentativas. Nada é salvo ao recarregar a página.

O aproveitamento é `100 × pontos coletados / pontos ótimos`: uma solução ótima recebe três estrelas;
a partir de 70%, duas; acima de zero, uma; mochila vazia, nenhuma. Cada finalização válida conta como tentativa.

## Rodadas dinâmicas

### Modo Desafiador

Selecione **DESAFIADOR · valores secretos** em **Modo de jogo**. Os cartões mostram apenas os pesos:
os pontos por lote são substituídos por `?`. A pontuação da mochila também fica oculta durante a edição
e só aparece ao finalizar uma coleta válida, junto do aproveitamento em relação à solução ótima.
O botão de revelar a solução não aparece nesse modo, mesmo após alcançar 100%.

O histórico registra as quantidades, os pontos e o aproveitamento de cada tentativa, da mais recente
para a mais antiga. Ajuste a coleta usando esses resultados até encontrar uma mochila perfeita.
Esvaziar a mochila mantém o histórico. Trocar a capacidade ou iniciar outra expedição limpa o histórico
e reinicia o contador. Trocar de modo sempre sorteia uma nova expedição, mantendo a capacidade escolhida,
para que os valores vistos no Clássico não revelem a solução do Desafiador.

Os segredos são uma regra da interface de um jogo local, não uma proteção contra inspeção do JavaScript.

### Sorteio dos lotes

Cada lote tem de 4 a 9 kg e vale de 15 a 110 pontos por kg, em múltiplos de cinco.
O valor mostrado no cartão é o **valor do lote inteiro**, calculado pelo peso vezes o valor por kg.
Qualquer material pode ser o mais vantajoso; o nome e a posição não indicam sua prioridade.
O estoque total sempre excede 18 kg, exigindo escolhas mesmo com a maior mochila.

Os sorteios tornam as combinações variáveis, mas preservam a regra do Knapsack fracionário:
priorizar o maior valor por kg continua sendo a estratégia ótima. O desafio é identificar essa relação,
não decorar uma quantidade fixa. Empates de valor por kg podem produzir diferentes soluções igualmente ótimas.

## Algoritmo guloso

A função `fractionalKnapsack`, em `knapsack.js`, ordena uma cópia dos itens pelo valor por kg em ordem
decrescente. Para cada item, leva o mínimo entre o estoque e a capacidade restante, podendo fracionar
qualquer lote. O algoritmo não altera a ordem original dos cartões.

Exemplo: um lote de 9 kg vale 180 pontos e outro de 4 kg vale 160 pontos. O segundo vale 40 pontos/kg,
enquanto o primeiro vale 20. Em uma mochila de 6 kg, levar os 4 kg do segundo e 2 kg do primeiro rende
200 pontos, contra 120 ao levar apenas 6 kg do lote com maior valor total.

Substituir peso de um material menos valioso por igual peso de outro mais valioso nunca reduz os pontos.
Como os materiais são divisíveis, essa estratégia permite obter uma solução ótima. Isso não vale em geral
para Knapsack 0/1, em que os itens são indivisíveis.

Complexidade: **O(n log n)** para ordenar, **O(n)** para percorrer e **O(n)** de espaço adicional.
A interface restringe as escolhas a décimos de quilo; como estoques e capacidades são inteiros,
sempre é possível representar uma solução ótima neste jogo.

## Organização

- `index.html`: estrutura da página e controles de expedição.
- `styles.css`: visual responsivo sem bibliotecas externas.
- `knapsack.js`: algoritmo, validação e cenário fixo usado nos testes de regressão.
- `rounds.js`: mochilas e geração de lotes sorteados.
- `game.js`: estado da rodada, formulário, pontuação e explicação opcional.
- `tests/`: testes automatizados com o executor nativo do Node.js.

## Testes

Com Node.js 18 ou superior:

```sh
node --test tests/knapsack.test.js tests/rounds.test.js
```

Os nove testes cobrem solução ótima, frações, validações, imutabilidade da entrada, limites dos sorteios,
as três capacidades e um caso em que escolher o maior valor total falha.
No navegador foram verificados: troca de mochila, excesso de peso, soluções ótimas com 10 e 18 kg,
revelação opcional da solução e limpeza da coleta ao sortear uma nova expedição.
Também foram verificados o modo Desafiador, a ausência de valores e da solução na interface,
a pontuação após finalizar, o histórico entre tentativas e o retorno ao modo Clássico com nova rodada.

## Roteiro de apresentação

1. Escolha uma mochila e explique que os cartões mostram valores de lotes inteiros.
2. Monte uma coleta e observe sua pontuação.
3. Revele a solução e mostre a divisão valor/peso e a ordenação gulosa.
4. Troque a mochila para comparar a mesma rodada com outra capacidade.
5. Sorteie uma expedição e mostre que a estratégia continua válida apesar das novas quantidades.
