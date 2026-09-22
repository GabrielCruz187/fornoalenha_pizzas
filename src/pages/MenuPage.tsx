import { Pencil, Plus, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { Button } from '../components/ui/Button'
import { PizzaPricingCard } from '../components/menu/PizzaPricingCard'
import { ProductFormModal } from '../components/menu/ProductFormModal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { useProductsStore } from '../store/useProductsStore'
import { productPriceLabel } from '../lib/priceLabel'
import { CATEGORY_LABELS, CATEGORY_ORDER, type Product } from '../types'
import { cn } from '../lib/cn'

export function MenuPage() {
  const products = useProductsStore((s) => s.products)
  const pizzaPricing = useProductsStore((s) => s.pizzaPricing)
  const toggleActive = useProductsStore((s) => s.toggleActive)
  const removeProduct = useProductsStore((s) => s.removeProduct)

  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)

  const grouped = useMemo(() => {
    return CATEGORY_ORDER.map((cat) => ({
      category: cat,
      items: products.filter((p) => p.category === cat),
    })).filter((g) => g.items.length > 0)
  }, [products])

  return (
    <div>
      <PageHeader
        title="Cardápio"
        subtitle="Itens, preços e disponibilidade"
        actions={
          <Button
            icon={<Plus size={16} />}
            onClick={() => {
              setEditingProduct(null)
              setFormOpen(true)
            }}
          >
            Novo item
          </Button>
        }
      />

      <PizzaPricingCard />

      <div className="flex flex-col gap-6">
        {grouped.map(({ category, items }, sectionIdx) => (
          <motion.section
            key={category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(sectionIdx, 5) * 0.05, duration: 0.25 }}
          >
            <h2 className="mb-2 font-display text-base font-semibold text-cream">{CATEGORY_LABELS[category]}</h2>
            <div className="overflow-hidden rounded-xl border border-border">
              {items.map((product, idx) => (
                <div
                  key={product.id}
                  className={cn(
                    'flex items-center justify-between gap-3 bg-surface px-4 py-3 transition-colors hover:bg-surface-hover',
                    idx !== items.length - 1 && 'border-b border-border',
                    !product.active && 'opacity-50',
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-cream">{product.name}</p>
                    {product.description && (
                      <p className="truncate text-xs text-muted">{product.description}</p>
                    )}
                  </div>
                  <span className="shrink-0 text-sm font-medium text-gold-400">
                    {productPriceLabel(product, pizzaPricing)}
                  </span>
                  <label className="flex shrink-0 items-center gap-1.5 text-xs text-muted">
                    <input
                      type="checkbox"
                      checked={product.active}
                      onChange={() => toggleActive(product.id)}
                      className="h-3.5 w-3.5 accent-gold-500"
                    />
                    Ativo
                  </label>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingProduct(product)
                        setFormOpen(true)
                      }}
                      aria-label={`Editar ${product.name}`}
                      className="rounded-md p-1.5 text-muted hover:bg-surface-hover hover:text-cream"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeletingProduct(product)}
                      aria-label={`Remover ${product.name}`}
                      className="rounded-md p-1.5 text-muted hover:bg-status-error-bg hover:text-status-error"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      <ProductFormModal open={formOpen} onClose={() => setFormOpen(false)} editingProduct={editingProduct} />

      <ConfirmDialog
        open={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={() => {
          if (deletingProduct) removeProduct(deletingProduct.id)
          setDeletingProduct(null)
        }}
        title="Remover item do cardápio?"
        description={`"${deletingProduct?.name}" será removido permanentemente da lista. Pedidos já lançados não são afetados.`}
        confirmLabel="Remover"
      />
    </div>
  )
}
