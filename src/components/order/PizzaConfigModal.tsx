import { useMemo, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { SelectField, TextAreaField } from '../ui/FormControls'
import { useProductsStore } from '../../store/useProductsStore'
import { buildPizzaItem, pizzaUnitPrice } from '../../lib/cart'
import { formatCurrency } from '../../lib/format'
import { PIZZA_SIZE_LABELS, type OrderItem, type PizzaSize, type Product } from '../../types'
import { cn } from '../../lib/cn'

interface PizzaConfigModalProps {
  product: Product | null
  onClose: () => void
  onConfirm: (item: OrderItem) => void
}

const SIZES: PizzaSize[] = ['pequena', 'media', 'grande']

export function PizzaConfigModal({ product, onClose, onConfirm }: PizzaConfigModalProps) {
  const products = useProductsStore((s) => s.products)
  const pizzaPricing = useProductsStore((s) => s.pizzaPricing)

  const [size, setSize] = useState<PizzaSize>('media')
  const [border, setBorder] = useState(false)
  const [halfHalf, setHalfHalf] = useState(false)
  const [secondFlavorId, setSecondFlavorId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')

  const otherFlavors = useMemo(
    () => products.filter((p) => p.active && p.category === product?.category && p.id !== product?.id),
    [products, product],
  )

  if (!product) return null

  const secondFlavor = halfHalf ? otherFlavors.find((p) => p.id === secondFlavorId) : undefined
  const flavors = secondFlavor ? [product, secondFlavor] : [product]
  const unitPrice = pizzaUnitPrice(pizzaPricing, size, border)

  const reset = () => {
    setSize('media')
    setBorder(false)
    setHalfHalf(false)
    setSecondFlavorId('')
    setQuantity(1)
    setNotes('')
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleConfirm = () => {
    const item = buildPizzaItem(flavors, size, border, pizzaPricing, quantity, notes.trim() || undefined)
    onConfirm(item)
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
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={halfHalf && !secondFlavorId}
          >
            Adicionar · {formatCurrency(unitPrice * quantity)}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <span className="mb-1.5 block text-xs font-medium text-cream-dim">Tamanho</span>
          <div className="grid grid-cols-3 gap-2">
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={cn(
                  'rounded-lg border px-2 py-2.5 text-center text-sm font-medium transition-colors',
                  size === s
                    ? 'border-gold-500 bg-gold-500/10 text-gold-300'
                    : 'border-border bg-bg-soft text-cream-dim hover:border-border-strong',
                )}
              >
                <div>{PIZZA_SIZE_LABELS[s]}</div>
                <div className="text-xs text-muted">{formatCurrency(pizzaPricing[s])}</div>
              </button>
            ))}
          </div>
        </div>

        <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border bg-bg-soft px-3 py-2.5">
          <span className="text-sm text-cream-dim">Borda recheada (+{formatCurrency(pizzaPricing.borda)})</span>
          <input
            type="checkbox"
            checked={border}
            onChange={(e) => setBorder(e.target.checked)}
            className="h-4 w-4 accent-gold-500"
          />
        </label>

        <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border bg-bg-soft px-3 py-2.5">
          <span className="text-sm text-cream-dim">Meio a meio</span>
          <input
            type="checkbox"
            checked={halfHalf}
            onChange={(e) => {
              setHalfHalf(e.target.checked)
              if (!e.target.checked) setSecondFlavorId('')
            }}
            className="h-4 w-4 accent-gold-500"
          />
        </label>

        {halfHalf && (
          <SelectField
            label="Segundo sabor"
            value={secondFlavorId}
            onChange={(e) => setSecondFlavorId(e.target.value)}
          >
            <option value="">Selecione o segundo sabor…</option>
            {otherFlavors.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </SelectField>
        )}

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
          placeholder="Ex: sem cebola, bem assada…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
    </Modal>
  )
}
