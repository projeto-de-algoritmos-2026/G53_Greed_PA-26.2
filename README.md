# 🎒 Mochila de Tesouros

Minijogo do grupo G53 para demonstrar **Knapsack fracionário**, no tema de algoritmos gulosos.
Escolha a quantidade de ouro, prata e bronze em pó para maximizar os pontos de uma mochila de 10 kg.

## Como executar

Clone o repositório e abra `index.html` em um navegador moderno. Não é necessário instalar dependências,
usar backend ou ter conexão com a internet depois do download.

Opcionalmente, na pasta do projeto, execute `python -m http.server 8000` e acesse `http://localhost:8000`.

## Como jogar

1. Informe quantos quilos de cada metal deseja levar. Os campos aceitam incrementos de 0,1 kg.
2. Acompanhe o peso e os pontos da mochila. Não ultrapasse o estoque de cada metal nem o limite de 10 kg.
3. Clique em **Finalizar coleta** para comparar sua escolha com a melhor solução.
4. Leia o passo a passo do algoritmo e tente melhorar sua pontuação. **Recomeçar** zera a mochila.

| Tesouro | Estoque | Pontos por kg |
| --- | --- | --- |
| Ouro em pó | 4 kg | 100 |
| Prata em pó | 5 kg | 60 |
| Bronze em pó | 6 kg | 20 |

O aproveitamento é `100 × pontos coletados / pontos ótimos`. Uma solução ótima recebe três estrelas;
a partir de 70%, duas; acima de zero, uma; mochila vazia, nenhuma.

## Algoritmo guloso

A função `fractionalKnapsack`, em `knapsack.js`, ordena uma cópia dos itens pelo valor por kg em ordem
decrescente. Para cada item, leva o mínimo entre o estoque disponível e a capacidade restante.
Assim, pode pegar apenas uma parte do último tesouro.

Neste cenário, a solução ótima é **4 kg de ouro + 5 kg de prata + 1 kg de bronze = 720 pontos**.
A estratégia funciona porque os recursos são divisíveis: substituir peso de um metal menos valioso
por igual peso de outro mais valioso nunca reduz a pontuação. Escolher os maiores valores por kg
primeiro permite obter uma solução ótima. Isso não se aplica, em geral, ao Knapsack 0/1, no qual os
itens são indivisíveis.

A ordenação custa **O(n log n)** e o percurso custa **O(n)**. A cópia e a seleção ocupam **O(n)** de
espaço adicional. O algoritmo aceita quantidades fracionárias; a interface limita as escolhas a décimos
de quilo para simplificar o jogo.

## Organização

- `index.html`: estrutura e formulário do jogo.
- `styles.css`: visual responsivo, sem bibliotecas externas.
- `knapsack.js`: dados dos tesouros, algoritmo e validação das escolhas.
- `game.js`: atualização da interface, pontuação, comparação e reinício.
- `tests/knapsack.test.js`: testes automatizados com o executor nativo do Node.js.

## Testes

Com Node.js 18 ou superior, execute:

```sh
node --test tests/knapsack.test.js
```

Os testes cobrem solução ótima, fracionamento, ordenação sem alterar a entrada, capacidades zero e
excedente, lista vazia, entradas inválidas, excesso de peso e cálculo da escolha do jogador.

Para conferir a interface: finalize com 4/5/1 kg (720 pontos), tente 4/5/2 kg (excesso de peso) e use
Recomeçar (campos e peso zerados). Esses fluxos também foram verificados no navegador.

## Roteiro curto de apresentação

1. Explique a capacidade da mochila e o valor por kg dos três tesouros.
2. Faça uma escolha que caiba, mas não seja ótima, como 0/4/6 kg (360 pontos).
3. Mostre a comparação com os 720 pontos possíveis e a ordenação gulosa.
4. Explique por que os metais em pó permitem fracionamento e mostre a função em `knapsack.js`.
