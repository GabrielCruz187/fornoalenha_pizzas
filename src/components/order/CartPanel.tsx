import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { formatCurrency } from '../../lib/format'
import { PIZZA_SIZE_LABELS, type OrderItem } from '../../types'
import { EmptyState } from '../ui/EmptyState'

interface CartPanelProps {
  items: OrderItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}

export function CartPanel({ items, onUpdateQuantity, onRemove }: CartPanelProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Comanda vazia"
        description="Clique nos itens do cardápio ao lado para montar o pedido."
      />
    )
  }

  return (
    <ul role="list" className="flex flex-col gap-2">
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.li
            key={item.id}
            layout
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-lg border border-border bg-bg-soft px-3 py-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-cream">{item.name}</p>
                <p className="text-xs text-muted">
                  {item.size && PIZZA_SIZE_LABELS[item.size]}
                  {item.border && ' + borda'}
                  {item.variantLabel}
                  {item.notes && ` · ${item.notes}`}
                </p>
              </div>
              <button
                onClick={() => onRemove(item.id)}
                aria-label={`Remover ${item.name}`}
                className="shrink-0 rounded-md p-1 text-muted hover:bg-status-error-bg hover:text-status-error"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  aria-label="Diminuir quantidade"
                  className="flex h-6 w-6 items-center justify-center rounded border border-border-strong text-cream-dim hover:bg-surface-hover"
                >
                  <Minus size={12} />
                </button>
                <span className="w-4 text-center text-xs font-semibold text-cream">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  aria-label="Aumentar quantidade"
                  className="flex h-6 w-6 items-center justify-center rounded border border-border-strong text-cream-dim hover:bg-surface-hover"
                >
                  <Plus size={12} />
                </button>
              </div>
              <span className="text-sm font-semibold text-gold-400">{formatCurrency(item.lineTotal)}</span>
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  )
}
