import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { TextAreaField } from '../ui/FormControls'
import { buildVariantItem } from '../../lib/cart'
import { formatCurrency } from '../../lib/format'
import type { OrderItem, Product, ProductVariant } from '../../types'
import { cn } from '../../lib/cn'

interface VariantConfigModalProps {
  product: Product | null
  onClose: () => void
  onConfirm: (item: OrderItem) => void
}

export function VariantConfigModal({ product, onClose, onConfirm }: VariantConfigModalProps) {
  const [variant, setVariant] = useState<ProductVariant | null>(product?.variants?.[0] ?? null)
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')

  if (!product) return null

  const reset = () => {
    setVariant(product.variants?.[0] ?? null)
    setQuantity(1)
    setNotes('')
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleConfirm = () => {
    if (!variant) return
    onConfirm(buildVariantItem(product, variant, quantity, notes.trim() || undefined))
    reset()
  }

  return (
    <Modal
      open={!!product}
      onClose={handleClose}
      title={product.name}
      description={product.description}
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirm} disabled={!variant}>
            Adicionar · {formatCurrency((variant?.price ?? 0) * quantity)}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <span className="mb-1.5 block text-xs font-medium text-cream-dim">Opção</span>
          <div className="grid grid-cols-2 gap-2">
            {product.variants?.map((v) => (
              <button
                key={v.id}
                onClick={() => setVariant(v)}
                className={cn(
                  'rounded-lg border px-2 py-2.5 text-center text-sm font-medium transition-colors',
                  variant?.id === v.id
                    ? 'border-gold-500 bg-gold-500/10 text-gold-300'
                    : 'border-border bg-bg-soft text-cream-dim hover:border-border-strong',
                )}
              >
                <div>{v.label}</div>
                <div className="text-xs text-muted">{formatCurrency(v.price)}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-cream-dim">Quantidade</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Diminuir quantidade"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-strong text-cream hover:bg-surface-hover"
            >
              <Minus size={14} />
            </button>
            <span className="w-6 text-center text-sm font-semibold text-cream">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Aumentar quantidade"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-strong text-cream hover:bg-surface-hover"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <TextAreaField
          label="Observações do item"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
    </Modal>
  )
}
