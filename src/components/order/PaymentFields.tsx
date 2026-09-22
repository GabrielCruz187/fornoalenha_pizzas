import { Banknote, CreditCard, QrCode, Wallet } from 'lucide-react'
import { TextField, TextAreaField } from '../ui/FormControls'
import { cn } from '../../lib/cn'
import { PAYMENT_LABELS, type PaymentMethod } from '../../types'

const PAYMENT_ICONS: Record<PaymentMethod, typeof Banknote> = {
  dinheiro: Banknote,
  pix: QrCode,
  cartao_credito: CreditCard,
  cartao_debito: Wallet,
}

interface PaymentFieldsProps {
  paymentMethod: PaymentMethod
  onPaymentMethodChange: (v: PaymentMethod) => void
  changeFor: string
  onChangeForChange: (v: string) => void
  discount: string
  onDiscountChange: (v: string) => void
  notes: string
  onNotesChange: (v: string) => void
}

export function PaymentFields({
  paymentMethod,
  onPaymentMethodChange,
  changeFor,
  onChangeForChange,
  discount,
  onDiscountChange,
  notes,
  onNotesChange,
}: PaymentFieldsProps) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-medium text-cream-dim">Forma de pagamento</span>
      <div className="grid grid-cols-2 gap-1.5">
        {(Object.keys(PAYMENT_LABELS) as PaymentMethod[]).map((method) => {
          const Icon = PAYMENT_ICONS[method]
          return (
            <button
              key={method}
              onClick={() => onPaymentMethodChange(method)}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors',
                paymentMethod === method
                  ? 'border-gold-500 bg-gold-500/10 text-gold-300'
                  : 'border-border bg-bg-soft text-cream-dim hover:border-border-strong',
              )}
            >
              <Icon size={15} />
              {PAYMENT_LABELS[method]}
            </button>
          )
        })}
      </div>

      {paymentMethod === 'dinheiro' && (
        <TextField
          label="Troco para"
          value={changeFor}
          onChange={(e) => onChangeForChange(e.target.value)}
          inputMode="decimal"
          placeholder="Deixe em branco se não precisar de troco"
        />
      )}

      <TextField
        label="Desconto"
        value={discount}
        onChange={(e) => onDiscountChange(e.target.value)}
        inputMode="decimal"
        placeholder="0,00"
      />

      <TextAreaField
        label="Observações do pedido"
        rows={2}
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Ex: entregar até 20h, ligar ao chegar…"
      />
    </div>
  )
}
