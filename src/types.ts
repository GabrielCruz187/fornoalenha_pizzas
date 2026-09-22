export type ProductCategory =
  | 'pizza_salgada'
  | 'pizza_doce'
  | 'cheese'
  | 'prato'
  | 'petisco'
  | 'adicional'

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  pizza_salgada: 'Pizzas Salgadas',
  pizza_doce: 'Pizzas Doces',
  cheese: 'Cheeses Tradicionais',
  prato: 'Pratos',
  petisco: 'Petiscos',
  adicional: 'Adicionais',
}

export const CATEGORY_ORDER: ProductCategory[] = [
  'pizza_salgada',
  'pizza_doce',
  'cheese',
  'prato',
  'petisco',
  'adicional',
]

export type PricingType = 'pizza' | 'fixed' | 'variant'

export interface ProductVariant {
  id: string
  label: string
  price: number
}

export interface Product {
  id: string
  name: string
  description?: string
  category: ProductCategory
  pricingType: PricingType
  price?: number
  variants?: ProductVariant[]
  active: boolean
}

export type PizzaSize = 'pequena' | 'media' | 'grande'

export const PIZZA_SIZE_LABELS: Record<PizzaSize, string> = {
  pequena: 'Pequena',
  media: 'Média',
  grande: 'Grande',
}

export interface PizzaSizePricing {
  pequena: number
  media: number
  grande: number
  borda: number
}

export type PaymentMethod = 'dinheiro' | 'pix' | 'cartao_credito' | 'cartao_debito'

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  dinheiro: 'Dinheiro',
  pix: 'Pix',
  cartao_credito: 'Cartão de Crédito',
  cartao_debito: 'Cartão de Débito',
}

export type DeliveryType = 'entrega' | 'retirada'

export interface OrderItem {
  id: string
  productId: string | null
  name: string
  category: ProductCategory
  pricingType: PricingType
  size?: PizzaSize
  border?: boolean
  flavors?: string[]
  variantLabel?: string
  unitPrice: number
  quantity: number
  notes?: string
  lineTotal: number
}

export type OrderStatus = 'novo' | 'impresso' | 'erro_impressao' | 'concluido' | 'cancelado'

export const STATUS_LABELS: Record<OrderStatus, string> = {
  novo: 'Novo',
  impresso: 'Impresso',
  erro_impressao: 'Erro de impressão',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
}

export interface Order {
  id: string
  number: number
  createdAt: string
  updatedAt: string
  customerName: string
  customerPhone?: string
  deliveryType: DeliveryType
  address?: string
  addressReference?: string
  items: OrderItem[]
  paymentMethod: PaymentMethod
  changeFor?: number
  deliveryFee: number
  discount: number
  notes?: string
  subtotal: number
  total: number
  status: OrderStatus
  printCount: number
  cancelReason?: string
}

export interface NewOrderInput {
  customerName: string
  customerPhone?: string
  deliveryType: DeliveryType
  address?: string
  addressReference?: string
  items: OrderItem[]
  paymentMethod: PaymentMethod
  changeFor?: number
  deliveryFee: number
  discount: number
  notes?: string
}
