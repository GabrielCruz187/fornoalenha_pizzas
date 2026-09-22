# Forno a Lenha — Painel de Pedidos

Protótipo de painel interno para lançamento rápido de pedidos delivery, com
impressão automática de comanda térmica. Frontend puro (React + Vite +
TypeScript + Tailwind), sem backend — todos os dados ficam em `localStorage`
do navegador.

## Rodando localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Páginas

- **Novo Pedido** — lançamento rápido: escolhe itens do cardápio, dados do
  cliente e pagamento, e confirma. Ao confirmar, o pedido é salvo e o diálogo
  de impressão do navegador abre automaticamente, já formatado para
  impressora térmica de 80mm.
- **Pedidos** — histórico do dia (ou período), com filtro por status
  (novo/impresso/erro/concluído/cancelado), busca, reimpressão e
  cancelamento.
- **Cardápio** — cadastro dos itens (preço fixo, pizza por tamanho ou
  variações como "1/2 pessoas") e da tabela de preços das pizzas.
- **Dashboard** — pedidos, faturamento, ticket médio, faturamento por forma
  de pagamento e produtos mais pedidos.
- **Fechamento de Caixa** — resumo do dia por forma de pagamento, com opção
  de imprimir o fechamento em folha A4.

## Sobre a impressão automática

Sem um backend ou serviço local rodando na máquina da cozinha, o navegador
não consegue mandar direto pra impressora sem *algum* tipo de confirmação.
Este protótipo abre o diálogo de impressão do navegador automaticamente,
já pronto — falta só clicar em "Imprimir" (ou apertar Enter).

Se no futuro a máquina do balcão rodar Chrome em modo kiosk com a flag
`--kiosk-printing`, a impressão passa a sair direto, sem diálogo nenhum,
sem precisar mudar nada no código.

## Persistência

Os dados (pedidos, cardápio, contador de numeração) ficam salvos no
`localStorage` do navegador daquele computador. Limpar os dados do site ou
trocar de navegador/máquina apaga o histórico — não há sincronização entre
dispositivos neste protótipo.
