import { Bike, Store, UserCheck } from 'lucide-react'
import { TextField } from '../ui/FormControls'
import { cn } from '../../lib/cn'
import { formatCurrency, formatDate } from '../../lib/format'
import type { KnownCustomer } from '../../lib/customers'
import type { DeliveryType } from '../../types'

interface CustomerFieldsProps {
  customerName: string
  onCustomerNameChange: (v: string) => void
  customerPhone: string
  onCustomerPhoneChange: (v: string) => void
  knownCustomer: KnownCustomer | null
  deliveryType: DeliveryType
  onDeliveryTypeChange: (v: DeliveryType) => void
  address: string
  onAddressChange: (v: string) => void
  addressReference: string
  onAddressReferenceChange: (v: string) => void
  deliveryFee: string
  onDeliveryFeeChange: (v: string) => void
}

export function CustomerFields({
  customerName,
  onCustomerNameChange,
  customerPhone,
  onCustomerPhoneChange,
  knownCustomer,
  deliveryType,
  onDeliveryTypeChange,
  address,
  onAddressChange,
  addressReference,
  onAddressReferenceChange,
  deliveryFee,
  onDeliveryFeeChange,
}: CustomerFieldsProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-1.5 rounded-lg border border-border bg-bg-soft p-1">
        {(
          [
            { value: 'entrega' as const, label: 'Entrega', icon: Bike },
            { value: 'retirada' as const, label: 'Retirada', icon: Store },
          ]
        ).map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => onDeliveryTypeChange(value)}
            className={cn(
              'flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-colors',
              deliveryType === value ? 'bg-gold-500 text-[#1a1310]' : 'text-cream-dim hover:bg-surface-hover',
            )}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      <TextField
        label="Nome do cliente"
        required
        value={customerName}
        onChange={(e) => onCustomerNameChange(e.target.value)}
        placeholder="Nome de quem está pedindo"
      />
      <TextField
        label="Telefone"
        value={customerPhone}
        onChange={(e) => onCustomerPhoneChange(e.target.value)}
        placeholder="(00) 00000-0000"
        inputMode="tel"
      />
      {knownCustomer && (
        <div
          role="status"
          className="-mt-1 flex items-start gap-2 rounded-lg border border-gold-700/40 bg-gold-900/30 px-3 py-2 text-xs text-cream-dim"
        >
          <UserCheck size={15} className="mt-0.5 shrink-0 text-gold-400" />
          <span>
            <strong className="text-cream">{knownCustomer.name}</strong> · {knownCustomer.orderCount}{' '}
            {knownCustomer.orderCount === 1 ? 'pedido' : 'pedidos'} · ticket médio{' '}
            {formatCurrency(knownCustomer.averageTicket)} · último em {formatDate(knownCustomer.lastOrderAt)}
          </span>
        </div>
      )}

      {deliveryType === 'entrega' && (
        <>
          <TextField
            label="Endereço"
            required
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            placeholder="Rua, número, bairro"
          />
          <TextField
            label="Referência"
            value={addressReference}
            onChange={(e) => onAddressReferenceChange(e.target.value)}
            placeholder="Perto de… / apto / cor da casa"
          />
          <TextField
            label="Taxa de entrega"
            value={deliveryFee}
            onChange={(e) => onDeliveryFeeChange(e.target.value)}
            inputMode="decimal"
            placeholder="0,00"
          />
        </>
      )}
    </div>
  )
}
