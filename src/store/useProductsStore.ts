import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_PIZZA_PRICING, SEED_PRODUCTS } from '../data/seedProducts'
import { makeId } from '../lib/id'
import type { PizzaSizePricing, Product } from '../types'

interface ProductsState {
  products: Product[]
  pizzaPricing: PizzaSizePricing
  addProduct: (input: Omit<Product, 'id'>) => void
  updateProduct: (id: string, patch: Partial<Omit<Product, 'id'>>) => void
  toggleActive: (id: string) => void
  removeProduct: (id: string) => void
  updatePizzaPricing: (patch: Partial<PizzaSizePricing>) => void
}

export const useProductsStore = create<ProductsState>()(
  persist(
    (set) => ({
      products: SEED_PRODUCTS,
      pizzaPricing: DEFAULT_PIZZA_PRICING,
      addProduct: (input) =>
        set((state) => ({ products: [...state.products, { ...input, id: makeId('prod') }] })),
      updateProduct: (id, patch) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
      toggleActive: (id) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, active: !p.active } : p)),
        })),
      removeProduct: (id) =>
        set((state) => ({ products: state.products.filter((p) => p.id !== id) })),
      updatePizzaPricing: (patch) =>
        set((state) => ({ pizzaPricing: { ...state.pizzaPricing, ...patch } })),
    }),
    { name: 'forno-products' },
  ),
)
