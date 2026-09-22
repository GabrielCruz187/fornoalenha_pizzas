import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { SelectField, TextAreaField, TextField } from '../ui/FormControls'
import { useProductsStore } from '../../store/useProductsStore'
import { makeId } from '../../lib/id'
import { CATEGORY_LABELS, CATEGORY_ORDER, type PricingType, type Product, type ProductCategory, type ProductVariant } from '../../types'

interface ProductFormModalProps {
  open: boolean
  onClose: () => void
  editingProduct: Product | null
}

const emptyVariant = (): ProductVariant => ({ id: makeId('variant'), label: '', price: 0 })

export function ProductFormModal({ open, onClose, editingProduct }: ProductFormModalProps) {
  const addProduct = useProductsStore((s) => s.addProduct)
  const updateProduct = useProductsStore((s) => s.updateProduct)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<ProductCategory>('cheese')
  const [pricingType, setPricingType] = useState<PricingType>('fixed')
  const [price, setPrice] = useState('0')
  const [variants, setVariants] = useState<ProductVariant[]>([emptyVariant()])

  useEffect(() => {
    if (!open) return
    if (editingProduct) {
      setName(editingProduct.name)
      setDescription(editingProduct.description ?? '')
      setCategory(editingProduct.category)
      setPricingType(editingProduct.pricingType)
      setPrice(String(editingProduct.price ?? 0))
      setVariants(editingProduct.variants?.length ? editingProduct.variants : [emptyVariant()])
    } else {
      setName('')
      setDescription('')
      setCategory('cheese')
      setPricingType('fixed')
      setPrice('0')
      setVariants([emptyVariant()])
    }
  }, [open, editingProduct])

  const handleSave = () => {
    if (!name.trim()) return
    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
      category,
      pricingType,
      price: pricingType === 'fixed' ? Number(price) || 0 : undefined,
      variants: pricingType === 'variant' ? variants.filter((v) => v.label.trim()) : undefined,
      active: editingProduct?.active ?? true,
    }
    if (editingProduct) {
      updateProduct(editingProduct.id, payload)
    } else {
      addProduct(payload)
    }
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingProduct ? 'Editar item' : 'Novo item do cardápio'}
      maxWidth="max-w-lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={!name.trim()}>
            Salvar
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <TextField label="Nome" required value={name} onChange={(e) => setName(e.target.value)} />
        <TextAreaField
          label="Descrição / ingredientes"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <SelectField label="Categoria" value={category} onChange={(e) => setCategory(e.target.value as ProductCategory)}>
          {CATEGORY_ORDER.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </SelectField>
        <SelectField
          label="Tipo de preço"
          value={pricingType}
          onChange={(e) => setPricingType(e.target.value as PricingType)}
          hint="Pizza usa a tabela de tamanhos definida acima do cardápio."
        >
          <option value="fixed">Preço fixo</option>
          <option value="pizza">Pizza (por tamanho)</option>
          <option value="variant">Variações (ex: 1 ou 2 pessoas)</option>
        </SelectField>

        {pricingType === 'fixed' && (
          <TextField label="Preço" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} />
        )}

        {pricingType === 'variant' && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-cream-dim">Variações</span>
            {variants.map((v, idx) => (
              <div key={v.id} className="flex items-center gap-2">
                <input
                  value={v.label}
                  onChange={(e) =>
                    setVariants((prev) => prev.map((p, i) => (i === idx ? { ...p, label: e.target.value } : p)))
                  }
                  placeholder="Rótulo (ex: 1 pessoa)"
                  className="flex-1 rounded-lg border border-border bg-bg-soft px-3 py-2 text-sm text-cream focus:border-gold-500/70 focus:outline-none"
                />
                <input
                  value={v.price}
                  onChange={(e) =>
                    setVariants((prev) =>
                      prev.map((p, i) => (i === idx ? { ...p, price: Number(e.target.value) || 0 } : p)),
                    )
                  }
                  inputMode="decimal"
                  placeholder="Preço"
                  className="w-24 rounded-lg border border-border bg-bg-soft px-3 py-2 text-sm text-cream focus:border-gold-500/70 focus:outline-none"
                />
                <button
                  onClick={() => setVariants((prev) => prev.filter((_, i) => i !== idx))}
                  aria-label="Remover variação"
                  className="rounded-md p-2 text-muted hover:bg-status-error-bg hover:text-status-error"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={() => setVariants((prev) => [...prev, emptyVariant()])}>
              Adicionar variação
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}
