import { useState } from 'react'
import { motion } from 'framer-motion'
import { Pizza } from 'lucide-react'
import { useProductsStore } from '../../store/useProductsStore'
import { TextField } from '../ui/FormControls'
import { Button } from '../ui/Button'
import { useToastStore } from '../../store/useToastStore'

export function PizzaPricingCard() {
  const pizzaPricing = useProductsStore((s) => s.pizzaPricing)
  const updatePizzaPricing = useProductsStore((s) => s.updatePizzaPricing)
  const push = useToastStore((s) => s.push)

  const [draft, setDraft] = useState({
    pequena: String(pizzaPricing.pequena),
    media: String(pizzaPricing.media),
    grande: String(pizzaPricing.grande),
    borda: String(pizzaPricing.borda),
  })

  const handleSave = () => {
    updatePizzaPricing({
      pequena: Number(draft.pequena) || 0,
      media: Number(draft.media) || 0,
      grande: Number(draft.grande) || 0,
      borda: Number(draft.borda) || 0,
    })
    push({ variant: 'success', message: 'Preços das pizzas atualizados' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mb-6 rounded-xl border border-gold-700/40 bg-surface-raised p-4"
    >
      <div className="mb-3 flex items-center gap-2">
        <Pizza size={16} className="text-gold-400" />
        <h2 className="text-sm font-semibold text-cream">Tabela de preços das pizzas</h2>
      </div>
      <p className="mb-3 text-xs text-muted">Vale para todos os sabores de pizzas salgadas e doces.</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <TextField label="Pequena" inputMode="decimal" value={draft.pequena} onChange={(e) => setDraft((d) => ({ ...d, pequena: e.target.value }))} />
        <TextField label="Média" inputMode="decimal" value={draft.media} onChange={(e) => setDraft((d) => ({ ...d, media: e.target.value }))} />
        <TextField label="Grande" inputMode="decimal" value={draft.grande} onChange={(e) => setDraft((d) => ({ ...d, grande: e.target.value }))} />
        <TextField label="Borda" inputMode="decimal" value={draft.borda} onChange={(e) => setDraft((d) => ({ ...d, borda: e.target.value }))} />
      </div>
      <Button size="sm" className="mt-3" onClick={handleSave}>
        Salvar preços
      </Button>
    </motion.div>
  )
}
