import { formatCurrency } from './format'
import type { PizzaSizePricing, Product } from '../types'

export function productPriceLabel(product: Product, pizzaPricing: PizzaSizePricing): string {
  if (product.pricingType === 'pizza') {
    return `A partir de ${formatCurrency(pizzaPricing.pequena)}`
  }
  if (product.pricingType === 'variant' && product.variants?.length) {
    const prices = product.variants.map((v) => v.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return min === max ? formatCurrency(min) : `${formatCurrency(min)} – ${formatCurrency(max)}`
  }
  return formatCurrency(product.price ?? 0)
}
