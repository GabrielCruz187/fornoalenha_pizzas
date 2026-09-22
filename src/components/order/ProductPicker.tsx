import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useProductsStore } from '../../store/useProductsStore'
import { CATEGORY_LABELS, CATEGORY_ORDER, type Product, type ProductCategory } from '../../types'
import { productPriceLabel } from '../../lib/priceLabel'
import { cn } from '../../lib/cn'
import { motion } from 'framer-motion'

interface ProductPickerProps {
  onSelect: (product: Product) => void
}

export function ProductPicker({ onSelect }: ProductPickerProps) {
  const products = useProductsStore((s) => s.products)
  const pizzaPricing = useProductsStore((s) => s.pizzaPricing)
  const [category, setCategory] = useState<ProductCategory | 'todas'>('pizza_salgada')
  const [query, setQuery] = useState('')

  const active = useMemo(() => products.filter((p) => p.active), [products])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return active.filter((p) => {
      const matchesQuery = q ? p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q) : true
      const matchesCategory = q ? true : category === 'todas' || p.category === category
      return matchesQuery && matchesCategory
    })
  }, [active, category, query])

  return (
    <div className="flex h-full flex-col">
      <div className="relative mb-3">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar item do cardápio…"
          aria-label="Buscar item do cardápio"
          className="w-full rounded-lg border border-border bg-bg-soft py-2.5 pl-9 pr-3 text-sm text-cream placeholder:text-muted-dim focus:border-gold-500/70 focus:outline-none focus:ring-1 focus:ring-gold-500/40"
        />
      </div>

      {!query && (
        <div className="mb-4 flex flex-wrap gap-1.5" role="tablist" aria-label="Categorias do cardápio">
          {CATEGORY_ORDER.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={category === cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                category === cat
                  ? 'bg-gold-500 text-[#1a1310]'
                  : 'bg-surface-raised text-cream-dim hover:bg-surface-hover hover:text-cream',
              )}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      )}

      <div className="grid flex-1 auto-rows-min grid-cols-1 gap-2 overflow-y-auto pb-2 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((product) => (
          <motion.button
            key={product.id}
            layout
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(product)}
            className="flex flex-col items-start gap-1 rounded-xl border border-border bg-surface px-3.5 py-3 text-left transition-colors hover:border-gold-500/50 hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
          >
            <span className="text-sm font-semibold text-cream">{product.name}</span>
            {product.description && (
              <span className="line-clamp-2 text-xs text-muted">{product.description}</span>
            )}
            <span className="mt-1 text-xs font-medium text-gold-400">
              {productPriceLabel(product, pizzaPricing)}
            </span>
          </motion.button>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-10 text-center text-sm text-muted">Nenhum item encontrado.</div>
        )}
      </div>
    </div>
  )
}
