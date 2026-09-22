import { makeId } from './id'
import type { OrderItem, PizzaSize, PizzaSizePricing, Product, ProductVariant } from '../types'

export function pizzaUnitPrice(pricing: PizzaSizePricing, size: PizzaSize, border: boolean): number {
  return pricing[size] + (border ? pricing.borda : 0)
}

export function buildPizzaItem(
  flavors: Product[],
  size: PizzaSize,
  border: boolean,
  pricing: PizzaSizePricing,
  quantity: number,
  notes?: string,
): OrderItem {
  const unitPrice = pizzaUnitPrice(pricing, size, border)
  const names = flavors.map((f) => f.name)
  return {
    id: makeId('item'),
    productId: flavors.length === 1 ? flavors[0].id : null,
    name: names.length > 1 ? `Meio a meio: ${names.join(' / ')}` : names[0],
    category: flavors[0].category,
    pricingType: 'pizza',
    size,
    border,
    flavors: names,
    unitPrice,
    quantity,
    notes,
    lineTotal: unitPrice * quantity,
  }
}

export function buildFixedItem(product: Product, quantity: number, notes?: string): OrderItem {
  const unitPrice = product.price ?? 0
  return {
    id: makeId('item'),
    productId: product.id,
    name: product.name,
    category: product.category,
    pricingType: 'fixed',
    unitPrice,
    quantity,
    notes,
    lineTotal: unitPrice * quantity,
  }
}

export function buildVariantItem(
  product: Product,
  variant: ProductVariant,
  quantity: number,
  notes?: string,
): OrderItem {
  return {
    id: makeId('item'),
    productId: product.id,
    name: product.name,
    category: product.category,
    pricingType: 'variant',
    variantLabel: variant.label,
    unitPrice: variant.price,
    quantity,
    notes,
    lineTotal: variant.price * quantity,
  }
}
