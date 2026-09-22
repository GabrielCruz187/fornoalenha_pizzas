import type { Product } from '../types'

let n = 0
const id = () => `seed_${(n++).toString(36)}`

const pizza = (name: string, description: string, doce = false): Product => ({
  id: id(),
  name,
  description,
  category: doce ? 'pizza_doce' : 'pizza_salgada',
  pricingType: 'pizza',
  active: true,
})

const fixed = (name: string, description: string, category: Product['category'], price: number): Product => ({
  id: id(),
  name,
  description,
  category,
  pricingType: 'fixed',
  price,
  active: true,
})

export const SEED_PRODUCTS: Product[] = [
  // Pizzas salgadas
  pizza('Atum', 'Molho de tomate, mussarela e atum'),
  pizza('Bacon', 'Molho de tomate, mussarela e bacon em cubos'),
  pizza('Basca', 'Molho de tomate, mussarela, bacon, vinagrete e catupiry'),
  pizza('Baiana', 'Molho de tomate, mussarela, calabresa, azeitonas, cebola, ovo e pimenta'),
  pizza('Calabresa', 'Molho de tomate, mussarela e calabresa em fatias'),
  pizza('Caipira', 'Molho de tomate, mussarela, frango, milho e requeijão'),
  pizza('Chester', 'Molho de tomate, mussarela, peito de chester e requeijão'),
  pizza('Frango c/ Catupiry', 'Molho de tomate, mussarela, frango desfiado e catupiry'),
  pizza('Frango ao Vinagrete', 'Molho de tomate, mussarela, frango desfiado e vinagrete'),
  pizza('Fricassê', 'Molho de tomate, mussarela, frango, creme de leite e batata palha'),
  pizza('Italiana', 'Molho de tomate, mussarela e salame'),
  pizza('Coração', 'Molho de tomate, mussarela e coração'),
  pizza('Lombo Canadense', 'Molho de tomate, mussarela, lombo canadense em fatias e abacaxi'),
  pizza('Marguerita', 'Molho de tomate, mussarela, rodelas de tomate, parmesão e manjericão'),
  pizza('Milho', 'Molho de tomate, mussarela e milho'),
  pizza('Portuguesa', 'Molho de tomate, mussarela, presunto, ovo, cebola e pimentão'),
  pizza('Quatro Queijos', 'Molho de tomate, mussarela, provolone, gorgonzola e parmesão'),
  pizza('Siciliana', 'Molho de tomate, mussarela, calabresa, cebola, azeitonas e parmesão'),
  pizza('Strogonoff de Carne', 'Molho de tomate, mussarela e strogonoff de carne'),
  pizza('Tomates Secos e Rúcula', 'Molho de tomate, mussarela, tomate seco e rúcula'),
  pizza('Americana', 'Molho de tomate, mussarela, milho e bacon'),
  pizza('Moda da Casa', 'Molho de tomate, mussarela, provolone, lombo canadense, abacaxi e catupiry'),
  pizza('Vegetariana', 'Molho de tomate, mussarela, brócolis, ricota e palmito'),
  pizza('Entrevero', 'Molho de tomate, mussarela, iscas de carne, frango, bacon e calabresa'),
  pizza('Pepperoni', 'Molho de tomate, mussarela e pepperoni'),
  pizza('Filé Alho e Óleo', 'Molho de tomate, mussarela, filé, alho e óleo'),
  pizza('Filé com Fritas', 'Molho de tomate, mussarela, filé e batata frita'),
  pizza('Costela com Figo', 'Molho de tomate, mussarela, costela e figo'),
  pizza('Bacon com Abacaxi', 'Molho de tomate, mussarela, bacon e abacaxi'),
  pizza('Queijo Bry com Mel', 'Molho de tomate, mussarela, bacon e abacaxi'),
  pizza('Doritos', 'Molho de tomate, mussarela e doritos'),

  // Pizzas doces
  pizza('Chocolate Preto', 'Chocolate preto', true),
  pizza('Chocolate Branco', 'Chocolate branco', true),
  pizza('Banana c/ Canela', 'Banana com canela', true),
  pizza('Califórnia', 'Figo, abacaxi, pêssego e leite condensado', true),
  pizza("MM'S", "Chocolate preto e mm's", true),
  pizza('Chocolate com Sorvete', 'Chocolate com sorvete', true),
  pizza('Chocolate com Biscoito Negresco', 'Chocolate com biscoito negresco', true),
  pizza('Chocolate com Geleia de Abacaxi ao Vinho', 'Chocolate com geleia de abacaxi ao vinho', true),
  pizza('Creme de Amendoim com Chocolate', 'Creme de amendoim com chocolate', true),
  pizza('Adicional', 'Morango, amendoim, mm\'s', true),

  // Pratos
  fixed('Calzone', 'Molho de tomate, mussarela, orégano e sabor a sua escolha', 'prato', 60),
  fixed('Alaminuta', 'Salada, arroz, feijão, fritas, ovo e bife de frango ou gado', 'prato', 34),
  {
    id: id(),
    name: 'Parmegiana',
    description: 'Bife a parmegiana com molho vermelho e queijo, arroz, branco, salada mista e batata frita',
    category: 'prato',
    pricingType: 'variant',
    variants: [
      { id: id(), label: '1 pessoa', price: 45 },
      { id: id(), label: '2 pessoas', price: 85 },
    ],
    active: true,
  },

  // Cheeses tradicionais
  fixed('X-Salada', 'Hamburguer, queijo lanche, maionese, alface, tomate, milho e ovo', 'cheese', 22),
  fixed('X-Frango', 'Filé de frango, queijo lanche, maionese, alface, tomate, milho e ovo', 'cheese', 25),
  fixed('X-Coração', 'Coração de frango, queijo lanche, maionese, alface, tomate, milho e ovo', 'cheese', 30),
  fixed('X-Strogonoff', 'Strogonoff de carne, queijo lanche, maionese, alface, tomate, milho e ovo', 'cheese', 28),
  fixed('X-Bacon', 'Hamburguer, bacon, queijo lanche, maionese, alface, tomate, milho e ovo', 'cheese', 28),
  fixed('X-Calabresa', 'Calabresa, queijo lanche, maionese, alface, tomate, milho e ovo', 'cheese', 25),
  fixed('X-Atum', 'Atum, queijo lanche, maionese, alface, tomate, milho e ovo', 'cheese', 28),
  fixed('X-Filé', 'Filé em cubos, queijo lanche, maionese, alface, tomate, milho e ovo', 'cheese', 30),
  fixed(
    'X-Tudo',
    'Bacon, calabresa, frango, coração, queijo lanche, maionese, alface, tomate, milho e ovo',
    'cheese',
    33,
  ),
  fixed(
    'X-Tudo Especial',
    'Hamburguer, bacon, calabresa, frango, coração, queijo lanche, maionese, alface, tomate, milho e ovo',
    'cheese',
    38,
  ),
  fixed(
    'X-Abagualado',
    'Dois hambúrgueres, dois ovos, dois queijos, maionese, milho, tomate e alface',
    'cheese',
    35,
  ),
  fixed(
    'X-Tropeiro',
    'Quatro hambúrgueres, três ovos, três queijos, maionese, milho, tomate e alface',
    'cheese',
    46,
  ),
  fixed('X-Fricassê', 'Fricassê de frango, maionese, tomate, milho, alface, ovo e queijo', 'cheese', 28),
  fixed('X-Kids', 'Hamburguer, maionese, queijo e cheddar', 'cheese', 22),
  fixed('Adicionais', 'Catupiry, cheddar, cebola, bacon, queijo', 'cheese', 5),

  // Petiscos
  fixed(
    'Picadão Misto',
    'Iscas de carne, frango, calabresa, pepino, ovo de codorna, azeitonas, queijo mussarela e batata frita ou polenta frita',
    'petisco',
    93,
  ),
  fixed('Porção de Tilápia', 'Acompanha batata frita ou polenta frita', 'petisco', 85),
  fixed('Porção de Coração', 'Acompanha batata frita ou polenta frita', 'petisco', 65),
  fixed('Porção de Filé', 'Acompanha batata frita ou polenta frita', 'petisco', 70),
  fixed('Torre de Batata', 'Batata frita, iscas de carne, frango, calabresa, bacon, cheddar e mussarela', 'petisco', 80),
]

export const DEFAULT_PIZZA_PRICING = {
  pequena: 46,
  media: 60,
  grande: 70,
  borda: 5,
}
